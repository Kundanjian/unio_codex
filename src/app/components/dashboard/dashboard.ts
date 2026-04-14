import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import {
  AdminDashboardResponse,
  AuthApiService,
  DashboardResponse
} from '../../core/services/auth-api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthApiService);
  private readonly router = inject(Router);

  readonly currentUser = this.authService.currentUser;
  isFetchingDashboard = false;
  errorMessage = '';
  dashboardMessage = '';
  totalUsers: number | null = null;
  totalAdmins: number | null = null;

  ngOnInit(): void {
    this.loadDashboard();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  private loadDashboard(): void {
    this.isFetchingDashboard = true;
    this.errorMessage = '';

    this.authService
      .getDashboardData()
      .pipe(
        finalize(() => {
          this.isFetchingDashboard = false;
        })
      )
      .subscribe({
        next: (response: DashboardResponse) => {
          this.dashboardMessage = response.message;
          if ('stats' in response) {
            this.totalUsers = (response as AdminDashboardResponse).stats.totalUsers;
            this.totalAdmins = (response as AdminDashboardResponse).stats.totalAdmins;
          } else {
            this.totalUsers = null;
            this.totalAdmins = null;
          }
        },
        error: () => {
          this.authService.logout();
          this.errorMessage = 'Session expired. Please login again.';
          this.router.navigate(['/login']);
        }
      });
  }
}
