import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { Company } from '../../models/company.model';
import { CompanyService } from '../../services/company.service';
import { CompanyFormComponent } from '../company-form/company-form.component';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

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

  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' | 'info' = 'success';

  showDeleteConfirm = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private companyService: CompanyService
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const found = this.companyService.getCompanyById(id);
    if (found) {
      this.company = { ...found };
    } else {
      this.notificationMessage = 'Firma nu a fost găsită.';
      this.notificationType = 'error';
      this.showNotification = true;
    }
  }

  enableEdit(): void {
    this.isEditing = true;
  }

  saveCompany(updated: Company): void {
    this.companyService.updateCompany(updated);
    this.company = updated;
    this.isEditing = false;
    this.notificationMessage = 'Firma a fost actualizată.';
    this.notificationType = 'success';
    this.showNotification = true;
  }

  requestDelete(): void {
    this.showDeleteConfirm = true;
  }

  confirmDelete(): void {
    this.companyService.deleteCompanyById(this.company.id);
    this.notificationMessage = 'Firma a fost ștearsă.';
    this.notificationType = 'success';
    this.showNotification = true;
    this.goBack();
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  goBack(): void {
    this.location.back();
  }

  cancelEdit(): void {
    this.isEditing = false;
  }
}
