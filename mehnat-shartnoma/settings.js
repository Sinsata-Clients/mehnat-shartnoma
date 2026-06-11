import { db } from "./firebase.js";
import { checkAuth } from "./auth.js";
import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const SETTINGS_DOC = "config/organization";

checkAuth(async () => {
  const snap = await getDoc(doc(db, "config", "organization"));
  if (snap.exists()) {
    const s = snap.data();
    document.getElementById("orgName").value = s.orgName || "";
    document.getElementById("orgAddress").value = s.orgAddress || "";
    document.getElementById("orgStir").value = s.orgStir || "";
    document.getElementById("orgHr").value = s.orgHr || "";
    document.getElementById("orgBank").value = s.orgBank || "";
  }
});

document.getElementById("saveSettingsBtn").addEventListener("click", async () => {
  const orgName = document.getElementById("orgName").value.trim();
  const orgAddress = document.getElementById("orgAddress").value.trim();
  const orgStir = document.getElementById("orgStir").value.trim();
  const orgHr = document.getElementById("orgHr").value.trim();
  const orgBank = document.getElementById("orgBank").value.trim();

  if (!orgName || !orgAddress || !orgStir || !orgHr || !orgBank) {
    document.getElementById("settingsMsg").style.color = "#ef4444";
    document.getElementById("settingsMsg").textContent = "Barcha maydonlarni to'ldiring!";
    return;
  }

  await setDoc(doc(db, "config", "organization"), {
    orgName, orgAddress, orgStir, orgHr, orgBank
  });

  document.getElementById("settingsMsg").style.color = "#059669";
  document.getElementById("settingsMsg").textContent = "✅ Sozlamalar saqlandi!";
});