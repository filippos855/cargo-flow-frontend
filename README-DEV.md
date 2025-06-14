# 🎞️ cargo-flow-frontend - Development README

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
│   │   ├── orders.component.html
│   │   ├── orders.component.scss
│   │   ├── order-form/
│   │   │   ├── order-form.component.ts
│   │   │   ├── order-form.component.html
│   │   │   └── order-form.component.scss
│   │   └── order-details/
│   │       ├── order-details.component.ts
│   │       ├── order-details.component.html
│   │       └── order-details.component.scss
│   ├── models/
│   │   └── order.model.ts
│   └── services/
│       └── order.service.ts
├── trips/
│   ├── components/
│   │   ├── trips.component.ts
│   │   ├── trips.component.html
│   │   ├── trips.component.scss
│   │   ├── trip-form/
│   │   │   ├── trip-form.component.ts
│   │   │   ├── trip-form.component.html
│   │   │   └── trip-form.component.scss
│   │   └── trip-details/
│   │       ├── trip-details.component.ts
│   │       ├── trip-details.component.html
│   │       └── trip-details.component.scss
│   ├── models/
│   │   └── trip.model.ts
│   └── services/
│       └── trip.service.ts
├── fleet/
│   ├── components/
│   │   ├── fleet.component.ts
│   │   ├── fleet.component.html
│   │   ├── fleet.component.scss
│   │   ├── fleet-details/
│   │   │   ├── fleet-details.component.ts
│   │   │   ├── fleet-details.component.html
│   │   │   └── fleet-details.component.scss
│   │   └── fleet-form/
│   │       ├── fleet-form.component.ts
│   │       ├── fleet-form.component.html
│   │       └── fleet-form.component.scss
│   ├── models/
│   │   └── fleet-vehicle.model.ts
│   └── services/
│       └── fleet.service.ts
├── invoices/
│   ├── components/
│   │   ├── invoices.component.ts
│   │   ├── invoices.component.html
│   │   ├── invoices.component.scss
│   │   └── invoice-details/
│   │       ├── invoice-details.component.ts
│   │       ├── invoice-details.component.html
│   │       └── invoice-details.component.scss
│   ├── models/
│   │   └── invoice.model.ts
│   └── services/
│       └── invoice.service.ts
├── reports/
│   └── components/...
├── users/
│   ├── components/
│   │   ├── users.component.ts
│   │   ├── users.component.html
│   │   ├── users.component.scss
│   │   ├── user-details/
│   │   │   ├── user-details.component.ts
│   │   │   ├── user-details.component.html
│   │   │   └── user-details.component.scss
│   │   └── user-form/
│   │       ├── user-form.component.ts
│   │       ├── user-form.component.html
│   │       └── user-form.component.scss
│   ├── models/
│   │   └── user.model.ts
│   └── services/
│       └── user.service.ts
├── companies/
│   ├── components/...
├── persons/
│   ├── components/...
├── shared/
│   ├── components/
│   │   ├── confirm-dialog/
│   │   ├── notification/
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
* Sintaxa folosită este modernă (Angular v17+): doar `@if`, fără `*ngIf`, `@for` în loc de `*ngFor`.
* Confirmările și alertele sunt stilizate (nu se mai folosește `confirm()`/`alert()`).

---

## ✅ Progres module implementate

| Modul       | Componentă principală    | Stare                                               | Detalii                                                      |
| ----------- | ------------------------ | --------------------------------------------------- | ------------------------------------------------------------ |
| Dashboard   | `dashboard.component.ts` | ✅ Funcțional                                        |                                                              |
| Orders      | `orders.component.ts`    | ✅ CRUD complet, paginare, sortare, filtrare         | Include/exclude din curse, ConfirmDialog/Notificări aplicate |
| Trips       | `trips.component.ts`     | ✅ CRUD complet, comenzi incluse, UI modern          | Paginare, sortare, filtrare, adăugare/editare/ștergere curse |
| Fleet       | `fleet.component.ts`     | ✅ CRUD complet, filtre checkbox, detalii, editabile |                                                              |
| Invoices    | `invoices.component.ts`  | ✅ CRUD complet, asociere comenzi/curse              |                                                              |
| Reports     | —                        | ⏳ Urmează                                           |                                                              |
| Users       | `users.component.ts`     | ✅ CRUD complet, filtrare după activ, legat persoane |                                                              |
| Companies   | `companies.component.ts` | ✅ CRUD complet, linkuri funcționale                 |                                                              |
| Persons     | `persons.component.ts`   | ✅ CRUD complet, sortare, căutare, validare ștergere |                                                              |

---

## 🪃 Modele principale

* `Order`: `id`, `number`, `createdDate`, `company`, `deliveryPerson`, `address`, `status`, `trip?`
* `Trip`: `id`, `number`, `startDate`, `endDate?`, `status`, `transportCompany`, `driver?`, `tractorUnit?`, `trailer?`, `orders?`
* `Invoice`: `id`, `number`, `invoiceType`, `status`, `issueDate`, `dueDate`, `company`, `amount`, `currency`, `order?`, `trip?`
* `User`: `id`, `username`, `passwordHash`, `person: Person`, `role: DictionaryItem`, `isActive`
* `Company`: `id`, `name`, `code`, `contactPerson`, `cui?`, `address?`
* `Person`: `id`, `fullName`, `phone?`, `email?`, `cnp?`
* `FleetVehicle`: `id`, `identifier`, `type`, `itpExpiration`, `rcaExpiration`, `isAvailable`
* `DictionaryItem`: `id`, `name`, `dictionaryId`

---

## 🔒 Autentificare și roluri

* Pagina de login funcțională: username + parolă cu `remember me`
* Utilizatorul curent e stocat în `localStorage` sau `sessionStorage`
* Roluri disponibile:

  * **admin**: acces complet
  * **operator**: comenzi, curse, resurse
  * **manager flota**: curse, flotă, resurse
  * **financiar**: facturi, rapoarte, resurse
* Layoutul afișează userul logat + rolul în meniul lateral (jos) + buton logout

---

## 🔐 Guards și acces per pagină

* `auth.guard.ts`: blochează accesul dacă nu ești logat
* `role.guard.ts`: blochează accesul dacă nu ai rolul permis (setat în `app.routes.ts`)

---

## 📌 Alte note pentru ChatGPT

* Proiectul face parte din lucrarea de licență **Licenta_Fillipos**
* Branch activ: `develop`
* Obiectiv curent: aplicare completă a funcționalităților de creare/editare/ștergere cu UI modern (fără alert/confirm) în toate modulele
* Modulele `Orders`, `Trips`, `Fleet`, `Persons`, `Users` au fost extinse complet cu:
  * adăugare/ștergere/editare
  * confirmări vizuale (ConfirmDialog)
  * notificări stilizate (NotificationComponent)
  * sortare, paginare, filtrare avansată
  * validare la ștergere dacă sunt folosiți
* Modulele `Companies` și `Invoices` au layout complet și linkuri funcționale
* Urmează implementare pentru `Reports`, `API Clients` și conectare la backend real
