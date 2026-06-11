import { db } from "./firebase.js";
import { checkAuth } from "./auth.js";
import {
  doc,
  getDoc,
  addDoc,
  updateDoc,
  collection
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const editId = params.get("id");

// Telefon formatlash
function formatPhone(val) {
  const digits = val.replace(/\D/g, "").substring(0, 12);
  if (digits.length <= 3) return `+${digits}`;
  if (digits.length <= 5) return `+${digits.slice(0,3)} (${digits.slice(3)}`;
  if (digits.length <= 8) return `+${digits.slice(0,3)} (${digits.slice(3,5)}) ${digits.slice(5)}`;
  if (digits.length <= 10) return `+${digits.slice(0,3)} (${digits.slice(3,5)}) ${digits.slice(5,8)}-${digits.slice(8)}`;
  return `+${digits.slice(0,3)} (${digits.slice(3,5)}) ${digits.slice(5,8)}-${digits.slice(8,10)}-${digits.slice(10)}`;
}

document.getElementById("xodimPhone")?.addEventListener("input", function (e) {
  const before = this.value.substring(0, this.selectionStart);
  const digitsBefore = before.replace(/\D/g, "").length;
  this.value = formatPhone(this.value);
  let count = 0, newPos = 0;
  for (let i = 0; i < this.value.length; i++) {
    if (/\d/.test(this.value[i])) count++;
    if (count === digitsBefore) { newPos = i + 1; break; }
  }
  this.setSelectionRange(newPos, newPos);
});

document.getElementById("passportSeries")?.addEventListener("input", function () {
  this.value = this.value.toUpperCase().replace(/[^A-Z]/g, "");
});

document.getElementById("jshshir")?.addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, "").substring(0, 14);
});

document.getElementById("passportNumber")?.addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, "").substring(0, 7);
});

checkAuth(async () => {
  if (editId) {
    document.getElementById("formTitle").textContent = "Shartnomani tahrirlash";
    document.getElementById("breadcrumbTitle").textContent = "Tahrirlash";

    const snap = await getDoc(doc(db, "contracts", editId));
    if (snap.exists()) {
      const d = snap.data();
      document.getElementById("fullName").value = d.fullName || "";
      document.getElementById("position").value = d.position || "";
      document.getElementById("department").value = d.department || "";
      document.getElementById("contractNumber").value = d.contractNumber || "";
      document.getElementById("startDate").value = d.startDate || "";
      document.getElementById("endDate").value = d.endDate || "";
      document.getElementById("salary").value = d.salary || "";
      document.getElementById("workType").value = d.workType || "Asosiy ish joyi";
      document.getElementById("passportSeries").value = d.passportSeries || "";
      document.getElementById("passportNumber").value = d.passportNumber || "";
      document.getElementById("jshshir").value = d.jshshir || "";
      document.getElementById("xodimAddress").value = d.xodimAddress || "";
      document.getElementById("xodimPhone").value = d.xodimPhone || "";
      document.getElementById("notes").value = d.notes || "";
    }
  }
});

document.getElementById("saveBtn").addEventListener("click", async () => {
  const fullName = document.getElementById("fullName").value.trim();
  const position = document.getElementById("position").value.trim();
  const department = document.getElementById("department").value.trim();
  const contractNumber = document.getElementById("contractNumber").value.trim();
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const salary = document.getElementById("salary").value;
  const workType = document.getElementById("workType").value;
  const passportSeries = document.getElementById("passportSeries").value.trim().toUpperCase();
  const passportNumber = document.getElementById("passportNumber").value.trim();
  const jshshir = document.getElementById("jshshir").value.trim();
  const xodimAddress = document.getElementById("xodimAddress").value.trim();
  const xodimPhone = document.getElementById("xodimPhone").value.trim();
  const notes = document.getElementById("notes").value.trim();

  if (!fullName || !position || !department || !contractNumber || !startDate || !endDate || !salary) {
    alert("Asosiy maydonlarni to'ldiring!");
    return;
  }

  if (passportSeries.length !== 2) {
    alert("Pasport seriyasi 2 ta harf bo'lishi kerak (masalan: AB)");
    return;
  }

  if (passportNumber.length !== 7) {
    alert("Pasport raqami 7 ta raqam bo'lishi kerak");
    return;
  }

  if (jshshir.length !== 14) {
    alert("JSHSHIR 14 ta raqam bo'lishi kerak");
    return;
  }

  if (endDate < startDate) {
    alert("Tugash sanasi boshlanish sanasidan oldin bo'lishi mumkin emas!");
    return;
  }

  const data = {
    fullName, position, department, contractNumber,
    startDate, endDate, salary, workType,
    passportSeries, passportNumber, jshshir,
    xodimAddress, xodimPhone, notes
  };

  if (editId) {
    await updateDoc(doc(db, "contracts", editId), data);
  } else {
    await addDoc(collection(db, "contracts"), {
      ...data,
      createdAt: new Date().toISOString()
    });
  }

  window.location.href = "dashboard.html";
});