import { db, auth } from "./firebase.js";
import { checkAuth } from "./auth.js";
import { generatePDF } from "./pdf.js";
import {
  collection, addDoc, getDocs, deleteDoc,
  doc, updateDoc, query, orderBy, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let orgSettings = null;

async function loadSettings() {
  const warning = document.getElementById("settingsWarning");
  const missingEl = document.getElementById("missingFields");

  const fields = {
    orgName: "Universitet nomi",
    orgAddress: "Manzil",
    orgStir: "STIR",
    orgHr: "H/r",
    orgBank: "Bank"
  };

  let missing = [];

  try {
    const snap = await getDoc(doc(db, "config", "organization"));
    if (snap.exists()) {
      orgSettings = snap.data();
      missing = Object.entries(fields)
        .filter(([key]) => !orgSettings[key])
        .map(([, label]) => label);
      if (missing.length > 0) orgSettings = null;
    } else {
      orgSettings = null;
      missing = Object.values(fields);
    }
  } catch (e) {
    orgSettings = null;
    missing = Object.values(fields);
  }

  if (missing.length > 0) {
    missingEl.textContent = missing.join(", ");
    warning.style.display = "flex";
  } else {
    warning.style.display = "none";
  }

  loadContracts();
}

if (document.getElementById("contractsTable")) {
  checkAuth((user) => {
    document.getElementById("userEmail").textContent = user.email;
    loadSettings();
    loadContracts();
  });
}

async function loadContracts(filter = "") {
  const tbody = document.getElementById("contractsTable");
  const q = query(collection(db, "contracts"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  let total = 0, active = 0, expired = 0;
  const today = new Date().toISOString().split("T")[0];

  if (snapshot.empty) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; color:#9ca3af; padding:32px;">
          Hali shartnoma kiritilmagan
        </td>
      </tr>`;
    updateStats(0, 0, 0);
    return;
  }

  tbody.innerHTML = "";
  let index = 1;

  snapshot.forEach((docSnap) => {
    const d = docSnap.data();
    const isActive = d.endDate >= today;

    if (filter && !d.fullName?.toLowerCase().includes(filter) && !d.position?.toLowerCase().includes(filter)) return;

    total++;
    if (isActive) active++; else expired++;

    tbody.innerHTML += `
      <tr>
        <td>${index++}</td>
        <td>${d.fullName}</td>
        <td>${d.position}</td>
        <td>${d.department || "-"}</td>
        <td>${d.startDate}</td>
        <td>${d.endDate}</td>
        <td>
          <span class="badge ${isActive ? "badge-active" : "badge-expired"}">
            ${isActive ? "Faol" : "Muddati tugagan"}
          </span>
        </td>
        <td>
          <button class="btn-edit" onclick="editContract('${docSnap.id}')">Tahrirlash</button>
          <button class="btn-pdf ${!orgSettings ? 'btn-pdf-disabled' : ''}"
            onclick="downloadPDF('${docSnap.id}')"
            ${!orgSettings ? 'disabled title="Tashkilot ma\'lumotlari to\'liq emas"' : ''}>
            PDF
          </button>
          <button class="btn-delete" onclick="deleteContract('${docSnap.id}')">O'chirish</button>
        </td>
      </tr>`;
  });

  updateStats(total, active, expired);
}

function updateStats(total, active, expired) {
  if (document.getElementById("totalCount")) {
    document.getElementById("totalCount").textContent = total;
    document.getElementById("activeCount").textContent = active;
    document.getElementById("expiredCount").textContent = expired;
  }
}

if (document.getElementById("searchInput")) {
  document.getElementById("searchInput").addEventListener("input", (e) => {
    loadContracts(e.target.value.toLowerCase());
  });
}

window.editContract = (id) => {
  window.location.href = `contract.html?id=${id}`;
};

window.deleteContract = async (id) => {
  if (confirm("Shartnomani o'chirishni tasdiqlaysizmi?")) {
    await deleteDoc(doc(db, "contracts", id));
    loadContracts();
  }
};

window.downloadPDF = async (id) => {
  if (!orgSettings) {
    alert("Avval tashkilot ma'lumotlarini to'liq kiriting!");
    return;
  }
  await generatePDF(id, orgSettings);
};