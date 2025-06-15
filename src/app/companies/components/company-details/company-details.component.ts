import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { Company } from '../../models/company.model';
import { CompanyService } from '../../services/company.service';
import { PersonService } from '../../../persons/services/person.service';
import { CompanyFormComponent } from '../company-form/company-form.component';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Person } from '../../../persons/models/person.model';

@Component({
  selector: 'app-company-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CompanyFormComponent,
    NotificationComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent {
  company!: Company;
  isEditing = false;

  showDeleteConfirm = false;
  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private companyService: CompanyService,
    private personService: PersonService
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.companyService.getCompanyById(id).subscribe({
      next: (company) => {
        this.company = { ...company };

        this.personService.getPersonById(company.contactPerson.id).subscribe(person => {
          this.company.contactPerson = person;
        });
      },
      error: () => {
        this.notificationMessage = 'Firma nu a fost găsită.';
        this.notificationType = 'error';
        this.showNotification = true;
      }
    });
  }

  enableEdit(): void {
    this.isEditing = true;
  }

  save(): void {
    this.companyService.updateCompany(this.company).subscribe({
      next: () => {
        this.isEditing = false;
        this.showToast('Firma a fost salvată cu succes.', 'success');
      },
      error: (err) => {
        const errorMessage = this.extractBackendError(err);
        this.showToast(errorMessage || 'Eroare la salvare.', 'error');
      }
    });
  }

  cancelEdit(): void {
    this.companyService.getCompanyById(this.company.id).subscribe((c) => {
      this.company = { ...c };

      this.personService.getPersonById(c.contactPerson.id).subscribe(person => {
        this.company.contactPerson = person;
      });

      this.isEditing = false;
    });
  }

  requestDelete(): void {
    this.showDeleteConfirm = true;
  }

  confirmDelete(): void {
    this.companyService.deleteCompanyById(this.company.id).subscribe({
      next: () => {
        this.showToast('Firma a fost ștearsă.', 'success');
        this.goBack();
      },
      error: (err) => {
        const errorMessage = this.extractBackendError(err);
        this.showToast(errorMessage || 'Nu se poate șterge firma.', 'error');
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  goBack(): void {
    this.location.back();
  }

  private showToast(message: string, type: 'success' | 'error') {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    this.showDeleteConfirm = false;
    setTimeout(() => (this.showNotification = false), 3000);
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
}
