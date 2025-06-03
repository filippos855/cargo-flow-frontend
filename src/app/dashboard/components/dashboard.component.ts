import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalOrders = 0;
  pendingOrders = 0;
  activeTrips = 0;
  expiringFleet = 0;
  unpaidInvoices = 0;
  activeClients = 0;

  ngOnInit(): void {
    // TODO: Înlocuiește cu apeluri reale la servicii când sunt disponibile
    this.totalOrders = 128;
    this.pendingOrders = 14;
    this.activeTrips = 6;
    this.expiringFleet = 2;
    this.unpaidInvoices = 17;
    this.activeClients = 12;
  }
}
