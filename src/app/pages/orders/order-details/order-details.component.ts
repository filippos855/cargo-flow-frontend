import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Order } from '../../../models/order.model';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent {
  order!: Order;
  isEditing = false;

  constructor(private route: ActivatedRoute, private router: Router, private orderService: OrderService) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const found = this.orderService.getOrderById(id);
    if (found) {
      this.order = { ...found };
    }
  }

  enableEdit(): void {
    this.isEditing = true;
  }

  save(): void {
    this.orderService.updateOrder(this.order);
    this.isEditing = false;
    alert('Comanda a fost salvată.');
  }

  goBack(): void {
    this.router.navigate(['/orders']);
  }
}
