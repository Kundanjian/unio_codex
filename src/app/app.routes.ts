import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { QuickRentComponent } from './components/quick-rent/quick-rent';
import { MyOrdersComponent } from './components/my-orders/my-orders';
import { UnioCoinsComponent } from './components/unio-coins/unio-coins';
import { SettingsComponent } from './components/settings/settings';
import { HelpComponent } from './components/help/help';
import { LoginComponent } from './components/login/login';
import { SignupComponent } from './components/signup/signup';
import { RentalDetailComponent } from './components/rental-detail/rental-detail';
import { AccessoriesComponent } from './components/accessories/accessories';
import { DashboardComponent } from './components/dashboard/dashboard';
import { AdminLoginComponent } from './components/admin-login/admin-login';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'admin-login', component: AdminLoginComponent, canActivate: [guestGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [guestGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'quick-rent', component: QuickRentComponent },
  { path: 'accessories', component: AccessoriesComponent },
  { path: 'rentals/:id', component: RentalDetailComponent },
  { path: 'orders', component: MyOrdersComponent, canActivate: [authGuard] },
  { path: 'coins', component: UnioCoinsComponent, canActivate: [authGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
  { path: 'help', component: HelpComponent },
  { path: '**', redirectTo: '' }
];
