import { db } from "./firebase.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export async function generatePDF(id, org) {
  if (!window.jspdf) {
    alert("jsPDF yuklanmadi");
    return;
  }

  const snap = await getDoc(doc(db, "contracts", id));
  if (!snap.exists()) return;

  const d = snap.data();
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ unit: "mm", format: "a4" });

  const L = 25;
  const R = 185;
  const W = R - L;
  const C = 105;

  function b(size) { pdf.setFont("helvetica", "bold"); pdf.setFontSize(size); }
  function n(size) { pdf.setFont("helvetica", "normal"); pdf.setFontSize(size); }

  function block(txt, x, y, maxW) {
    const lines = pdf.splitTextToSize(txt, maxW);
    pdf.text(lines, x, y);
    return y + lines.length * 5.8;
  }

  // ── SARLAVHA ──
  b(14);
  pdf.text("MEHNAT SHARTNOMASI", C, 18, { align: "center" });

  n(11);
  pdf.text(`${d.contractNumber || "_________"}-sonli`, C, 25, { align: "center" });

  n(10);
  pdf.text("Toshkent shahri", L, 34);
  pdf.text(`Sana: ${d.startDate || "202__ yil"}`, R, 34, { align: "right" });

  pdf.setLineWidth(0.4);
  pdf.line(L, 37, R, 37);

  // ── KIRISH MATNI ──
  let y = 44;
  n(10);
  const intro = `Toshkent axborot texnologiyalari universiteti (keyingi o'rinlarda — "Ish beruvchi") nomidan Ustav asosida ish yurituvchi Rektor bir tomondan, va ${d.fullName || "[Xodimning F.I.Sh.]"} (keyingi o'rinlarda — "Xodim") ikkinchi tomondan, ushbu mehnat shartnomasini (keyingi o'rinlarda — "Shartnoma") quyidagilar haqida tuzdilar:`;
  y = block(intro, L, y, W);
  y += 5;

  // ── 1-BO'LIM ──
  b(10);
  pdf.text("1. SHARTNOMANING PREDMETI VA UMUMIY QOIDALAR", L, y);
  y += 7;
  n(10);
  y = block(`1.1. Xodim ${d.department || "[Bo'lim nomi]"} bo'limiga ${d.position || "[Lavozim nomi]"} lavozimiga ishga qabul qilinadi.`, L, y, W); y += 2;
  y = block(`1.2. Mazkur shartnoma Xodimning ${d.workType === "Yarim stavka" ? "o'rindoshlik asosidagi ish joyi" : "asosiy ish joyi"} hisoblanadi.`, L, y, W); y += 2;
  y = block(`1.3. Mazkur shartnoma muddati: ${d.startDate || "___"} dan ${d.endDate || "___"} gacha tuziladi.`, L, y, W); y += 2;
  y = block(`1.4. Xodimning ish boshlash sanasi: ${d.startDate || "202__ yil"}.`, L, y, W); y += 2;
  y = block("1.5. Xodim uchun sinov muddati belgilanmaydi.", L, y, W);
  y += 6;

  // ── 2-BO'LIM ──
  b(10);
  pdf.text("2. XODIMNING HUQUQ VA MAJBURIYATLARI", L, y);
  y += 7;
  n(10);
  y = block("2.1. Xodim quyidagi huquqlarga ega:", L, y, W); y += 2;
  y = block("     — Ish beruvchidan shartnomadada ko'rsatilgan ish hajmini ta'minlashni va mehnat sharoitlarini yaratib berishni talab qilish;", L, y, W); y += 2;
  y = block("     — O'quv, ilmiy, uslubiy ishlarni bajarish uchun zarur sharoitlar bilan ta'minlanish;", L, y, W); y += 2;
  y = block("     — Qonunchilikda belgilangan tartibda malakasini oshirish va qayta tayyorlashdan o'tish.", L, y, W); y += 4;
  y = block("2.2. Xodim quyidagilarga majbur:", L, y, W); y += 2;
  y = block("     — OTM ustavi, Ichki mehnat tartib qoidalari va Odob-axloq kodeksiga qat'iy rioya qilish;", L, y, W); y += 2;
  y = block("     — Tasdiqlangan shaxsiy ish rejasini to'liq va sifatli bajarish;", L, y, W); y += 2;
  y = block("     — Talabalarga yuqori ilmiy va kasbiy darajada dars berish;", L, y, W); y += 2;
  y = block("     — OTMning mahalliy va xalqaro reytinglaridagi o'rnini oshirishda faol ishtirok etish.", L, y, W);
  y += 6;

  if (y > 245) { pdf.addPage(); y = 20; }

  // ── 3-BO'LIM ──
  b(10);
  pdf.text("3. ISH BERUVCHINING HUQUQ VA MAJBURIYATLARI", L, y);
  y += 7;
  n(10);
  y = block("3.1. Ish beruvchi quyidagi huquqlarga ega:", L, y, W); y += 2;
  y = block("     — Xodimdan majburiyatlarini sifatli bajarishini va mehnat intizomiga rioya qilishini talab qilish;", L, y, W); y += 2;
  y = block("     — Xodimni erishgan yutuqlari uchun rag'batlantirish yoki intizomiy jazo choralarini qo'llash.", L, y, W); y += 4;
  y = block("3.2. Ish beruvchi quyidagilarga majbur:", L, y, W); y += 2;
  y = block("     — Xodimni mazkur shartnomada belgilangan ish bilan ta'minlash;", L, y, W); y += 2;
  y = block("     — Mehnatga haq to'lashni o'z vaqtida va to'liq hajmda amalga oshirish;", L, y, W); y += 2;
  y = block("     — Xavfsiz va samarali mehnat uchun zarur sharoitlarni (xona, kompyuter, internet) yaratib berish.", L, y, W);
  y += 6;

  if (y > 245) { pdf.addPage(); y = 20; }

  // ── 4-BO'LIM ──
  b(10);
  pdf.text("4. MEHNATGA HAQ TO'LASH VA ISH VAQTI REJIMI", L, y);
  y += 7;
  n(10);
  const salary = Number(d.salary).toLocaleString("uz-UZ");
  y = block(`4.1. Xodimga oylik lavozim maoshi (oklad) ${salary} so'm miqdorida belgilanadi.`, L, y, W); y += 2;
  y = block("4.2. Xodimga ilmiy darajasi (PhD, DSc) va ilmiy unvoni uchun qonunchilikda belgilangan ustama va qo'shimcha haqlar to'lanadi.", L, y, W); y += 2;
  y = block("4.3. Ish haqi har oyda kamida ikki marta (bo'nak va yakuniy hisob-kitob) to'lanadi.", L, y, W); y += 2;
  y = block("4.4. Xodim uchun professorlar uchun haftasiga ko'pi bilan 36 soatlik qisqartirilgan ish vaqti belgilanadi.", L, y, W); y += 2;
  y = block("4.5. Xodimga davomiyligi 56 kalendar' kundan kam bo'lmagan yillik haq to'lanadigan mehnat ta'tili beriladi.", L, y, W);
  y += 6;

  if (y > 245) { pdf.addPage(); y = 20; }

  // ── 5-BO'LIM ──
  b(10);
  pdf.text("5. SHARTNOMANI O'ZGARTIRISH VA BEKOR QILISH", L, y);
  y += 7;
  n(10);
  y = block("5.1. Mazkur shartnomaga o'zgartirishlar faqat tomonlarning kelishuviga binoan qo'shimcha bitim tuzish orqali amalga oshiriladi.", L, y, W); y += 2;
  y = block("5.2. Mazkur mehnat shartnomasi O'zbekiston Respublikasi Mehnat kodeksida nazarda tutilgan asoslar bo'yicha bekor qilinishi mumkin.", L, y, W); y += 2;
  y = block("5.3. Professor-o'qituvchilar tarkibi bilan tuzilgan muddatli mehnat shartnomasi Kengash tomonidan o'tkaziladigan tanlovdan o'ta olmagan taqdirda bekor qilinadi.", L, y, W);
  y += 6;

  if (y > 245) { pdf.addPage(); y = 20; }

  // ── 6-BO'LIM ──
  b(10);
  pdf.text("6. YAKUNIY QOIDALAR", L, y);
  y += 7;
  n(10);
  y = block("6.1. Mazkur shartnoma tomonlar imzolagan kundan boshlab kuchga kiradi.", L, y, W); y += 2;
  y = block("6.2. Shartnoma ikki nusxada tuzilgan bo'lib, ikkalasi ham bir xil yuridik kuchga ega. Nusxalardan biri Ish beruvchida, ikkinchisi Xodimda saqlanadi.", L, y, W);
  y += 6;

  // ── IZOH (ixtiyoriy) ──
  if (d.notes) {
    if (y > 245) { pdf.addPage(); y = 20; }
    b(10);
    pdf.text("QO'SHIMCHA SHARTLAR:", L, y);
    y += 7;
    n(10);
    y = block(d.notes, L, y, W);
    y += 6;
  }

  // ── REKVIZITLAR ──
  if (y > 220) { pdf.addPage(); y = 20; } else { y += 6; }

  pdf.setLineWidth(0.5);
  pdf.line(L, y, R, y);
  y += 8;

  b(11);
  pdf.text("7. TOMONLARNING REKVIZITLARI VA IMZOLARI", C, y, { align: "center" });
  y += 10;

  const col1 = L;
  const col2 = 110;

  b(10);
  pdf.text("ISH BERUVCHI:", col1, y);
  pdf.text("XODIM:", col2, y);
  y += 7;

  n(9);
  const leftLines = [
    `Nomi: ${org.orgName}`,
    `Manzil: ${org.orgAddress}`,
    `STIR: ${org.orgStir}`,
    `H/r: ${org.orgHr}`,
    `Bank: ${org.orgBank}`,
    "",
  ];
  const rightLines = [
    `F.I.Sh.: ${d.fullName || "___"}`,
    `Pasport: ${d.passportSeries || "__"}${d.passportNumber || "_______"}`,
    `JSHSHIR: ${d.jshshir || "______________"}`,
    `Manzil: ${d.xodimAddress || "___"}`,
    `Tel: ${d.xodimPhone || "___"}`,
    "",
  ];

  leftLines.forEach((line, i) => { pdf.text(line, col1, y + i * 6.5); });
  rightLines.forEach((line, i) => { pdf.text(line, col2, y + i * 6.5); });

  y += leftLines.length * 6.5 + 10;

  n(10);
  pdf.text("__________________", col1, y);
  pdf.text("__________________", col2, y);
  y += 5;
  n(8);
  pdf.text("(Imzo va Muhr)", col1 + 2, y);
  pdf.text("(Imzo)", col2 + 2, y);
  y += 7;
  n(10);
  pdf.text("Sana: _______________", col1, y);
  pdf.text("Sana: _______________", col2, y);

  // ── PASTKI IZOH ──
  pdf.setLineWidth(0.4);
  pdf.line(L, 284, R, 284);
  n(8);
  pdf.text("Toshkent axborot texnologiyalari universiteti  |  www.tuit.uz", C, 289, { align: "center" });

  pdf.save(`shartnoma-${d.contractNumber || id}.pdf`);
}