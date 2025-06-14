import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Person } from '../../models/person.model';
import { PersonService } from '../../services/person.service';
import { OrderService } from '../../../orders/services/order.service';
import { TripService } from '../../../trips/services/trip.service';
import { CompanyService } from '../../../companies/services/company.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';
import { PersonFormComponent } from '../person-form/person-form.component';

@Component({
  selector: 'app-person-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PersonFormComponent,
    ConfirmDialogComponent,
    NotificationComponent
  ],
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.scss']
})
export class PersonDetailsComponent {
  person!: Person;
  isEditing = false;

  showDeleteConfirm = false;
  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private personService: PersonService,
    private orderService: OrderService,
    private tripService: TripService,
    private companyService: CompanyService
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const found = this.personService.getPersonById(id);
    if (found) {
      this.person = { ...found };
    }
  }

  enableEdit(): void {
    this.isEditing = true;
  }

  save(): void {
    this.personService.updatePerson(this.person);
    this.isEditing = false;
    this.notificationMessage = 'Persoana a fost salvată cu succes.';
    this.notificationType = 'success';
    this.showNotification = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    const refreshed = this.personService.getPersonById(this.person.id);
    if (refreshed) {
      this.person = { ...refreshed };
    }
  }

  goBack(): void {
    this.location.back();
  }

  requestDelete(): void {
    const usedInOrder = this.orderService.getOrders().some(o =>
      o.deliveryPerson.id === this.person.id
    );

    const usedInTrip = this.tripService.getTripsSync?.().some(t =>
      t.driver?.id === this.person.id
    );

    const usedInCompany = this.companyService.getCompanies().some(c =>
      c.contactPerson.id === this.person.id
    );

    if (usedInOrder || usedInTrip || usedInCompany) {
      this.notificationMessage = 'Persoana nu poate fi ștearsă – este utilizată în sistem.';
      this.notificationType = 'error';
      this.showNotification = true;
      return;
    }

    this.showDeleteConfirm = true;
  }

  confirmDelete(): void {
    this.personService.deletePersonById(this.person.id);
    this.notificationMessage = 'Persoana a fost ștearsă.';
    this.notificationType = 'success';
    this.showNotification = true;
    this.goBack();
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }
}
