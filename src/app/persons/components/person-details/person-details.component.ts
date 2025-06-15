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
    this.personService.getPersonById(id).subscribe(p => {
      this.person = { ...p };
    });
  }

  enableEdit(): void {
    this.isEditing = true;
  }

  private extractBackendError(error: any): string | null {
    if (error?.error?.errors) {
      const errorObj = error.error.errors;
      const firstKey = Object.keys(errorObj)[0];
      return errorObj[firstKey]?.[0] || null;
    }

    if (error?.error?.error) {
      return error.error.error;
    }

    return null;
  }

  save(): void {
    this.personService.updatePerson(this.person).subscribe({
      next: () => {
        this.isEditing = false;
        this.notificationMessage = 'Persoana a fost salvată cu succes.';
        this.notificationType = 'success';
        this.showNotification = true;
      },
      error: (err) => {
        const errorMessage = this.extractBackendError(err);
        this.notificationMessage = errorMessage || 'Eroare la salvare.';
        this.notificationType = 'error';
        this.showNotification = true;
      }
    });
  }

  cancelEdit(): void {
    this.personService.getPersonById(this.person.id).subscribe(p => {
      this.person = { ...p };
      this.isEditing = false;
    });
  }

  goBack(): void {
    this.location.back();
  }

  requestDelete(): void {
    this.showDeleteConfirm = true;
  }

  confirmDelete(): void {
    this.personService.deletePersonById(this.person.id).subscribe({
      next: () => {
        this.notificationMessage = 'Persoana a fost ștearsă.';
        this.notificationType = 'success';
        this.showNotification = true;
        this.goBack();
      },
      error: (err) => {
        const errorMessage = this.extractBackendError(err);
        this.notificationMessage = errorMessage || 'Eroare la ștergere.';
        this.notificationType = 'error';
        this.showNotification = true;
      }
    });
  }
  
  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }
}
