import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Order } from '../../../models/order.model';
import { Trip } from '../../../models/trip.model';
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {
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

  includeInTrip(): void {
    const mockTrip: Trip = {
      id: 1,
      number: 'TRIP2024001',
      startDate: new Date(),
      status: { id: 1, name: 'Planificată' },
      transportCompany: {
        id: 1,
        name: 'Transport SRL',
        code: 'TRANS',
        contactPerson: { id: 2, fullName: 'Vasile Ion' }
      },
      driver: {
        id: 3,
        fullName: 'Popa Mihai'
      },
      tractorUnit: {
        id: 10,
        identifier: 'B123ABC',
        type: { id: 1, name: 'Tractor' },
        itpExpiration: new Date(),
        rcaExpiration: new Date(),
        isAvailable: true
      },
      trailer: {
        id: 11,
        identifier: 'CJ07XYZ',
        type: { id: 2, name: 'Trailer' },
        itpExpiration: new Date(),
        rcaExpiration: new Date(),
        isAvailable: true
      },
      orders: [this.order]
    };

    this.order.trip = mockTrip;
    this.orderService.updateOrder(this.order);
    alert('Comanda a fost inclusă într-o cursă.');
  }

  goBack(): void {
    this.router.navigate(['/orders']);
  }
}
