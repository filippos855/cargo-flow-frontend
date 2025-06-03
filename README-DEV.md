# 📦 cargo-flow-frontend - Development README

Acest fișier documentează structura, convențiile și progresul aplicației tale Angular pentru gestionarea comenzilor, curselor și resurselor unei firme de transport. Este destinat uzului intern și reluării lucrului în sesiuni viitoare cu ChatGPT în cadrul proiectului **Licenta\_Fillipos**.

---

## 📁 Structura actuală `src/app`

```plaintext
src/app/
├── core/
│   └── layout/
│       ├── layout.component.html
│       ├── layout.component.scss
│       ├── layout.component.spec.ts
│       └── layout.component.ts
├── dashboard/
│   └── components/
│       ├── dashboard.component.html
│       ├── dashboard.component.scss
│       ├── dashboard.component.spec.ts
│       └── dashboard.component.ts
├── orders/
│   ├── components/
│   │   ├── orders.component.html
│   │   ├── orders.component.scss
│   │   ├── orders.component.spec.ts
│   │   ├── orders.component.ts
│   │   └── order-details/
│   │       ├── order-details.component.html
│   │       ├── order-details.component.scss
│   │       ├── order-details.component.spec.ts
│   │       └── order-details.component.ts
│   ├── models/
│   │   └── order.model.ts
│   └── services/
│       ├── order.service.spec.ts
│       └── order.service.ts
├── trips/
│   ├── components/
│   │   ├── trips.component.html
│   │   ├── trips.component.scss
│   │   ├── trips.component.spec.ts
│   │   └── trip-details/
│   │       ├── trip-details.component.html
│   │       ├── trip-details.component.scss
│   │       ├── trip-details.component.spec.ts
│   │       └── trip-details.component.ts
│   ├── models/
│   │   └── trip.model.ts
│   └── services/
│       ├── trip.service.ts
│       └── trip.service.spec.ts
├── shared/
│   └── models/
│       ├── company.model.ts
│       ├── dictionary-item.model.ts
│       ├── dictionary.model.ts
│       ├── fleet-vehicle.model.ts
│       └── person.model.ts
├── app.component.html
├── app.component.scss
├── app.component.spec.ts
├── app.component.ts
├── app.config.ts
└── app.routes.ts
```

---

## 🔠 Convenții de denumire

* Toate denumirile din cod (fișiere, clase, variabile) sunt în **engleză**.
* Textele afișate în UI (buton, titlu, label) sunt în **română**.
* Toate componentele sunt **standalone** (`standalone: true`) și lazy-loaded cu `loadComponent`.
* Stilurile folosesc `scss` și sunt unificate vizual (font, culori, butoane, tabele).
* Linkurile între entități (ex: comandă → cursă, cursă → comandă) sunt implementate și stilizate consistent.

---

## ✅ Progres module implementate

| Modul         | Componentă principală        | Stare                                                | Detalii                 |
| ------------- | ---------------------------- | ---------------------------------------------------- | ----------------------- |
| Dashboard     | `dashboard.component.ts`     | ✅ Funcțional                                         |                         |
| Orders        | `orders.component.ts`        | ✅ Listare și detalii                                 | Comenzi legate de curse |
| Order details | `order-details.component.ts` | ✅ Include în cursă, editable, link spre cursă        |                         |
| Trips         | `trips.component.ts`         | ✅ Listare, detalii, adăugare mock, link spre comenzi |                         |
| Trip details  | `trip-details.component.ts`  | ✅ Vizualizare completă + comenzi incluse             |                         |
| Fleet         | —                            | ⏳ Urmează                                            |                         |
| Invoices      | —                            | ⏳ Urmează                                            |                         |
| Reports       | —                            | ⏳ Urmează                                            |                         |
| Users         | —                            | ⏳ Urmează                                            |                         |
| API Clients   | —                            | ⏳ Urmează                                            |                         |
| Resources     | Companies + Persons          | ⏳ Meniu existent, funcționalitate urmează            |                         |

---

## 🧹 Modele existente (shared/models + trips/models)

* `Company`: `id`, `name`, `code`, `contactPerson: Person`, `cui?`, `address?`
* `Person`: `id`, `fullName`, `phone?`, `email?`
* `DictionaryItem`: `id`, `name`, `dictionaryId` (folosit pentru `OrderStatus`, `TripStatus`, `VehicleType`)
* `FleetVehicle`: `id`, `identifier`, `type: DictionaryItem`, `itpExpiration`, `rcaExpiration`, `isAvailable`
* `Order`: `id`, `number`, `createdDate`, `company`, `deliveryPerson`, `status`, `trip?`
* `Trip`: `id`, `number`, `startDate`, `endDate?`, `status`, `transportCompany`, `driver?`, `tractorUnit?`, `trailer?`, `orders?`

---

## ⚙️ Servicii

* `OrderService` oferă:

  * `getOrders()`, `getOrderById(id)`, `updateOrder()`, `includeInMockTrip(order)`
* `TripService` oferă:

  * `getTrips()`, `getTripById(id)`, `addMockTrip(trip)`

---

## 📌 Alte note pentru ChatGPT

* Proiectul face parte din lucrarea de licență în cadrul **Licenta\_Fillipos**
* Branch activ de lucru: `develop`
* Angular 17 + standalone components + routing lazy (cu `loadComponent`)
* Testele folosesc `provideRouter([])`
* Layoutul include meniu lateral cu icoane animate și collapse
* Se urmărește consistența vizuală și UX fluid între module
