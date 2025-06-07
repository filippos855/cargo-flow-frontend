import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Invoice } from '../../models/invoice.model';
import { InvoiceService } from '../../services/invoice.service';

@Component({
  selector: 'app-invoice-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss']
})
export class InvoiceDetailsComponent {
  invoice!: Invoice;
  isEditing = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private invoiceService: InvoiceService
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const found = this.invoiceService.getInvoiceById(id);
    if (found) {
      this.invoice = { ...found };
    }
  }

  enableEdit(): void {
    this.isEditing = true;
  }

  save(): void {
    this.invoiceService.updateInvoice(this.invoice);
    this.isEditing = false;
    alert('Factura a fost salvată.');
  }

  goBack(): void {
    this.location.back();
  }
}
