import { Component, OnInit } from '@angular/core';
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
export class InvoiceDetailsComponent implements OnInit {
  invoice!: Invoice;
  isEditing = false;

  showEditConfirm = false;
  showDeleteConfirm = false;
  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';

  loading = true;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    this.loadInvoice();
  }

  loadInvoice(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.invoiceService.getInvoiceById(id).subscribe({
      next: (data) => {
        this.invoice = { ...data };
        this.loading = false;
      },
      error: () => {
        this.notificationMessage = 'Factura nu a putut fi încărcată!';
        this.notificationType = 'error';
        this.showNotification = true;
        this.loading = false;
      }
    });
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
    this.invoiceService.updateInvoice(this.invoice).subscribe({
      next: () => {
        this.isEditing = false;
        this.notificationMessage = 'Factura a fost salvată cu succes.';
        this.notificationType = 'success';
        this.showNotification = true;
        this.loadInvoice();
      },
      error: () => {
        this.notificationMessage = 'Eroare la salvarea facturii!';
        this.notificationType = 'error';
        this.showNotification = true;
      }
    });
  }

  requestDelete(): void {
    this.showDeleteConfirm = true;
  }

  confirmDelete(): void {
    this.invoiceService.deleteInvoiceById(this.invoice.id).subscribe({
      next: () => {
        this.notificationMessage = 'Factura a fost ștearsă.';
        this.notificationType = 'success';
        this.showNotification = true;
        setTimeout(() => this.goBack(), 800);
      },
      error: () => {
        this.notificationMessage = 'Eroare la ștergerea facturii!';
        this.notificationType = 'error';
        this.showNotification = true;
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.loadInvoice();
  }

  goBack(): void {
    this.location.back();
  }
}