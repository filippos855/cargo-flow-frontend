import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Invoice } from '../../models/invoice.model';
import { InvoiceService } from '../../services/invoice.service';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { InvoiceFormComponent } from '../invoice-form/invoice-form.component';

@Component({
  selector: 'app-invoice-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NotificationComponent,
    ConfirmDialogComponent,
    InvoiceFormComponent
  ],
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss']
})
export class InvoiceDetailsComponent {
  invoice!: Invoice;
  isEditing = false;

  showEditConfirm = false;
  showDeleteConfirm = false;
  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private invoiceService: InvoiceService
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const found = this.invoiceService.getInvoiceById(id);
    if (found) {
      this.invoice = structuredClone(found);
    }
  }

  enableEdit(): void {
    if (this.invoice.status.name === 'Achitată') {
      this.showEditConfirm = true;
    } else {
      this.isEditing = true;
    }
  }

  confirmEnableEdit(): void {
    this.isEditing = true;
    this.showEditConfirm = false;
  }

  cancelEnableEdit(): void {
    this.showEditConfirm = false;
  }

  save(): void {
    this.invoiceService.updateInvoice(this.invoice);
    this.isEditing = false;
    this.notificationMessage = 'Factura a fost salvată cu succes.';
    this.notificationType = 'success';
    this.showNotification = true;
  }

  requestDelete(): void {
    if (this.invoice.status.name === 'Achitată') {
      this.showDeleteConfirm = true;
    } else {
      this.confirmDelete();
    }
  }

  confirmDelete(): void {
    this.invoiceService.deleteInvoiceById(this.invoice.id);
    this.notificationMessage = 'Factura a fost ștearsă.';
    this.notificationType = 'success';
    this.showNotification = true;
    this.goBack();
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  cancelEdit(): void {
    const original = this.invoiceService.getInvoiceById(this.invoice.id);
    if (original) {
      this.invoice = structuredClone(original);
    }
    this.isEditing = false;
  }

  goBack(): void {
    this.location.back();
  }
}
