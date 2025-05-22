import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor(private router: Router, private orderService: OrderService) {}

  ngOnInit(): void {
    this.orders = this.orderService.getOrders();
  }

  addOrder(): void {
    alert('Funcționalitatea de adăugare comandă va fi implementată.');
  }

  viewOrder(order: Order): void {
    this.router.navigate(['/orders', order.id]);
  }
}
