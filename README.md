# 📋 Mehnat Shartnomasi — Avtomatlashtiruvchi Axborot Tizimi

Universitet xodimlari mehnat shartnomasini boshqarish uchun yaratilgan veb-ilova. Firebase Firestore asosida ishlaydi, Vercel da joylashtirilgan.

🔗 **Demo:** [mehnat-shartnoma.vercel.app](https://mehnat-shartnoma.vercel.app)

---

## 🚀 Imkoniyatlar

- 🔐 Email/parol orqali xavfsiz tizimga kirish
- ➕ Yangi mehnat shartnomasi qo'shish
- ✏️ Mavjud shartnomalarni tahrirlash
- 🗑️ Shartnomalarni o'chirish
- 📄 Professional PDF shartnoma eksport qilish
- 🔍 Xodim ismi yoki lavozimi bo'yicha qidirish
- 📊 Faol va muddati tugagan shartnomalar statistikasi
- ⚙️ Tashkilot rekvizitlarini sozlash
- ⚠️ Rekvizitlar to'liq bo'lmasa PDF eksport bloklanadi

---

## 🛠️ Texnologiyalar

| Texnologiya | Vazifasi |
|-------------|----------|
| HTML / CSS / JavaScript | Frontend |
| Firebase Authentication | Foydalanuvchi autentifikatsiyasi |
| Firebase Firestore | Ma'lumotlar bazasi |
| jsPDF | Brauzerda PDF yaratish |
| Vercel | Hosting va deploy |

---

## 📁 Fayl tuzilmasi

```
mehnat-shartnoma/
├── index.html          # Login sahifasi
├── dashboard.html      # Asosiy panel — shartnomalar ro'yxati
├── contract.html       # Shartnoma qo'shish / tahrirlash formasi
├── settings.html       # Tashkilot rekvizitlari sozlamalari
├── style.css           # Umumiy uslublar
├── firebase.js         # Firebase ulanish sozlamalari
├── auth.js             # Login, logout, sahifa himoyasi
├── contracts.js        # Firestore CRUD va dashboard mantiqi
├── contract-form.js    # Shartnoma formasi mantiqi va validatsiya
├── settings.js         # Tashkilot sozlamalari mantiqi
├── pdf.js              # PDF shartnoma generatsiyasi
└── README.md
```

---

## 🗄️ Firestore tuzilmasi

```
contracts/
└── {contractId}
    ├── fullName          # Xodim F.I.Sh.
    ├── position          # Lavozim
    ├── department        # Bo'lim
    ├── contractNumber    # Shartnoma raqami
    ├── startDate         # Boshlanish sanasi
    ├── endDate           # Tugash sanasi
    ├── salary            # Oylik maosh
    ├── workType          # Ish turi
    ├── passportSeries    # Pasport seriyasi
    ├── passportNumber    # Pasport raqami
    ├── jshshir           # JSHSHIR (14 xona)
    ├── xodimAddress      # Yashash manzili
    ├── xodimPhone        # Telefon raqami
    ├── notes             # Izoh
    └── createdAt         # Yaratilgan vaqt

config/
└── organization
    ├── orgName           # Universitet nomi
    ├── orgAddress        # Manzil
    ├── orgStir           # STIR
    ├── orgHr             # Hisob raqam
    └── orgBank           # Bank nomi
```

---

## ⚙️ O'rnatish va ishga tushirish

### 1. Reponi klonlash
```bash
git clone https://github.com/username/mehnat-shartnoma.git
cd mehnat-shartnoma
```

### 2. Firebase loyiha yaratish
1. [firebase.google.com](https://firebase.google.com) ga kiring
2. Yangi loyiha yarating
3. Firestore Database yoqing — `europe-west3` region
4. Authentication → Email/Password yoqing
5. Web app qo'shing va `firebaseConfig` ni oling

### 3. Firebase sozlamalarini kiriting
`firebase.js` faylini oching va `firebaseConfig` ni o'z loyihangiz ma'lumotlari bilan almashtiring:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 4. Firestore xavfsizlik qoidalarini sozlang
Firebase Console → Firestore → Rules:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contracts/{contractId} {
      allow read, write: if request.auth != null;
    }
    match /config/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. Admin foydalanuvchi yaratish
Firebase Console → Authentication → Users → Add user

### 6. Brauzerda ochish
VS Code da `index.html` ustida o'ng tugma → **Open with Live Server**

---

## 🌐 Vercel ga deploy qilish

1. [vercel.com](https://vercel.com) ga kiring
2. **Add New Project → Upload**
3. Loyiha papkasini yuklang
4. **Deploy** tugmasini bosing

---

## 📄 PDF shartnoma tuzilmasi

Eksport qilinadigan PDF quyidagi bo'limlarni o'z ichiga oladi:

1. Shartnomaning predmeti va umumiy qoidalar
2. Xodimning huquq va majburiyatlari
3. Ish beruvchining huquq va majburiyatlari
4. Mehnatga haq to'lash va ish vaqti rejimi
5. Shartnomani o'zgartirish va bekor qilish
6. Yakuniy qoidalar
7. Tomonlarning rekvizitlari va imzolari

---

## 🔒 Xavfsizlik

- Barcha sahifalar autentifikatsiya tekshiruvi bilan himoyalangan
- Firestore qoidalari faqat kirgan foydalanuvchilarga ruxsat beradi
- Tashkilot rekvizitlari to'liq bo'lmasa PDF eksport bloklanadi
- Yangi foydalanuvchilar faqat Firebase konsoli orqali qo'shiladi

---

## 📸 Skrinshot

| Login | Dashboard | Shartnoma formasi |
|-------|-----------|-------------------|
| ![Login](screenshots/login.png) | ![Dashboard](screenshots/dashboard.png) | ![Form](screenshots/form.png) |

---

## 👨‍💻 Muallif

Toshkent axborot texnologiyalari universiteti  
Diplom ishi loyihasi — 2024/2025 o'quv yili
