import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthApiService } from '../../core/services/auth-api.service';
import { PwaInstallService } from '../../core/services/pwa-install.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthApiService);
  private readonly pwaInstallService = inject(PwaInstallService);
  private readonly router = inject(Router);

  menuOpen = false;
  theme: 'light' | 'dark' = 'light';
  mobileAppUrl = 'https://play.google.com/store/apps/details?id=com.unio.mobile';
  installingApp = false;
  readonly currentUser = this.authService.currentUser;
  readonly isLoggedIn = this.authService.isLoggedIn;
  readonly canInstallPwa = this.pwaInstallService.canInstall;
  readonly isPwaInstalled = this.pwaInstallService.isInstalled;

  ngOnInit(): void {
    this.pwaInstallService.init();

    const savedTheme = localStorage.getItem('unio-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.theme = savedTheme === 'dark' || (!savedTheme && prefersDark) ? 'dark' : 'light';
    this.applyTheme();

    if (this.isLoggedIn()) {
      this.authService.syncProfile().subscribe();
    }

    this.authService.getMobileAppInstallUrl().subscribe((url) => {
      this.mobileAppUrl = url;
    });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  toggleTheme(): void {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('unio-theme', this.theme);
    this.applyTheme();
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.closeMenu();
    this.router.navigate(['/']);
  }

  async installMobileApp(): Promise<void> {
    if (this.installingApp) {
      return;
    }

    this.installingApp = true;
    try {
      const result = await this.pwaInstallService.promptInstall();
      this.closeMenu();

      if (result === 'unavailable') {
        window.open(this.mobileAppUrl, '_blank', 'noopener');
      }
    } finally {
      this.installingApp = false;
    }
  }

  userInitial(): string {
    const name = this.currentUser()?.name.trim();
    return name ? name[0].toUpperCase() : 'U';
  }

  userName(): string {
    return this.currentUser()?.name || 'Guest';
  }

  userContact(): string {
    const user = this.currentUser();
    return user?.phone || user?.email || 'mobile or mail';
  }

  userCoins(): number {
    return this.currentUser()?.unioCoins ?? 0;
  }

  private applyTheme(): void {
    document.documentElement.setAttribute('data-theme', this.theme);
  }
}
