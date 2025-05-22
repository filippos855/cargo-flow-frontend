import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalOrders = 0;
  createdOrders = 0;
  inTripOrders = 0;
  finishedOrders = 0;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    const orders = this.orderService.getOrders();
    this.totalOrders = orders.length;
    this.createdOrders = orders.filter(o => o.status === 'Creată').length;
    this.inTripOrders = orders.filter(o => o.includedInTrip).length;
    this.finishedOrders = orders.filter(o => o.status === 'Finalizată').length;
  }
}
