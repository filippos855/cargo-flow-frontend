import { Component, OnInit } from '@angular/core';
import { DashboardService, DashboardStats } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: []
})
export class DashboardComponent implements OnInit {
  stats?: DashboardStats;
  isLoading = true;
  error?: string;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Eroare la încărcarea datelor!';
        this.isLoading = false;
      }
    });
  }
}
