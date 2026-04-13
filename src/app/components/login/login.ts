import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthApiService } from '../../core/services/auth-api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  private readonly authApi = inject(AuthApiService);
  private readonly router = inject(Router);

  username = '';
  password = '';
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  login(): void {
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authApi.login(this.username, this.password).subscribe({
      next: (token) => {
        localStorage.setItem('unio_token', token);
        this.successMessage = 'Login successful. Backend token saved locally.';
        this.isSubmitting = false;
        this.router.navigateByUrl('/quick-rent');
      },
      error: () => {
        this.errorMessage = 'Login failed. Backend demo credentials are admin / password.';
        this.isSubmitting = false;
      }
    });
  }
}
