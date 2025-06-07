# 📦 cargo-flow-frontend - Development README

Acest fișier documentează structura, convențiile și progresul aplicației tale Angular pentru gestionarea comenzilor, curselor și resurselor unei firme de transport. Este destinat uzului intern și reluării lucrului în sesiuni viitoare cu ChatGPT în cadrul proiectului **Licenta_Fillipos**.

---

## 📅 Stack tehnologic actual

* **Angular**: 20.0.0
* **TypeScript**: 5.8.3
* **Node.js**: v20.19.2
* **npm**: 11.4.1

---

## 📁 Structura actuală `src/app`

```plaintext
src/app/
├── auth/
│   ├── components/
│   │   └── login/
│   │       ├── login.component.ts
│   │       ├── login.component.html
│   │       ├── login.component.scss
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── role.guard.ts
│   └── services/
│       └── auth.service.ts
├── core/
│   └── layout/
│       ├── layout.component.html
│       ├── layout.component.scss
│       └── layout.component.ts
├── dashboard/
│   └── components/
│       └── dashboard.component.ts
├── orders/
│   ├── components/
│   │   ├── orders.component.ts
│   │   └── order-details/
│   │       └── order-details.component.ts
│   ├── models/
│   │   └── order.model.ts
│   └── services/
│       └── order.service.ts
├── trips/
│   ├── components/
│   │   ├── trips.component.ts
│   │   └── trip-details/
│   │       └── trip-details.component.ts
│   ├── models/
│   │   └── trip.model.ts
│   └── services/
│       └── trip.service.ts
├── fleet/
│   ├── components/
│   │   ├── fleet.component.ts
│   │   └── fleet-details/
│   │       └── fleet-details.component.ts
│   ├── models/
│   │   └── fleet-vehicle.model.ts
│   └── services/
│       └── fleet.service.ts
├── invoices/
│   ├── components/
│   │   ├── invoices.component.ts
│   │   └── invoice-details/
│   │       └── invoice-details.component.ts
│   ├── models/
│   │   └── invoice.model.ts
│   └── services/
│       └── invoice.service.ts
├── reports/
│   └── components/...
├── users/
│   ├── components/
│   │   ├── users.component.ts
│   │   └── user-details/
│   │       └── user-details.component.ts
│   ├── models/
│   │   └── user.model.ts
│   └── services/
│       └── user.service.ts
├── resources/
│   ├── companies/
│   │   ├── components/...
│   ├── persons/
│   │   ├── components/...
├── shared/
│   └── models/
│       ├── company.model.ts
│       ├── person.model.ts
│       ├── dictionary-item.model.ts
│       └── dictionary.model.ts
├── app.routes.ts
├── app.config.ts
└── app.component.*
```

---

## 🔠 Convenții de denumire

* Toate denumirile din cod (fișiere, clase, variabile) sunt în **engleză**.
* Textele afișate în UI (buton, titlu, label) sunt în **română**.
* Toate componentele sunt **standalone** (`standalone: true`) și lazy-loaded cu `loadComponent`.
* Stilurile folosesc `scss` și sunt unificate vizual (font, culori, butoane, tabele).
* Linkurile între entități (ex: comandă → cursă, utilizator → persoană) sunt implementate și stilizate consistent.

---

## ✅ Progres module implementate

| Modul         | Componentă principală        | Stare                                                | Detalii                 |
| ------------- | ---------------------------- | ---------------------------------------------------- | ----------------------- |
| Dashboard     | `dashboard.component.ts`     | ✅ Funcțional                                         |                         |
| Orders        | `orders.component.ts`        | ✅ Listare, detalii, includere în curse               |                         |
| Trips         | `trips.component.ts`         | ✅ Listare, detalii, comenzi incluse                  |                         |
| Fleet         | `fleet.component.ts`         | ✅ Listare, detalii, editable                         |                         |
| Invoices      | `invoices.component.ts`      | ✅ Listare, detalii, emitere pentru comenzi/curse     |                         |
| Reports       | —                            | ⏳ Urmează                                            |                         |
| Users         | `users.component.ts`         | ✅ Autentificare, listare, roluri, legat de persoane  |                         |
| API Clients   | —                            | ⏳ Urmează                                            |                         |
| Resources     | Companies + Persons          | ✅ Funcționale, legături active                       |                         |

---

## 🧹 Modele principale

* `User`: `id`, `username`, `passwordHash`, `person: Person`, `role: DictionaryItem`, `isActive`
* `Invoice`: `id`, `number`, `invoiceType`, `status`, `issueDate`, `dueDate`, `company`, `amount`, `currency`, `order?`, `trip?`
* `Company`: `id`, `name`, `code`, `contactPerson`, `cui?`, `address?`
* `Person`: `id`, `fullName`, `phone?`, `email?`
* `Order`: `id`, `number`, `createdDate`, `company`, `deliveryPerson`, `status`, `trip?`
* `Trip`: `id`, `number`, `startDate`, `endDate?`, `status`, `transportCompany`, `driver?`, `tractorUnit?`, `trailer?`, `orders?`
* `FleetVehicle`: `id`, `identifier`, `type`, `itpExpiration`, `rcaExpiration`, `isAvailable`
* `DictionaryItem`: `id`, `name`, `dictionaryId`

---

## 🛡️ Autentificare și roluri

* Pagina de login funcțională: username + parolă cu `remember me`
* Utilizatorul curent e stocat în `localStorage` sau `sessionStorage`
* Roluri disponibile:
  - **admin**: acces complet
  - **operator**: comenzi, curse, resurse
  - **manager flota**: curse, flotă, resurse
  - **financiar**: facturi, rapoarte, resurse

* Layoutul afișează userul logat + rolul în meniul lateral (jos) + buton logout

---

## 🔐 Guards și acces per pagină

* `auth.guard.ts`: blochează accesul dacă nu ești logat
* `role.guard.ts`: blochează accesul dacă nu ai rolul permis (setat în `app.routes.ts`)

---

## 📌 Alte note pentru ChatGPT

* Proiectul face parte din lucrarea de licență **Licenta_Fillipos**
* Branch activ: `develop`
* Obiectiv curent: finalizare funcționalități detaliu (edit/delete) + pagini de creare
* În viitor: conectare cu backend real pentru login + persistare date reale
* Urmează implementare pentru `API Clients`, `Reports`