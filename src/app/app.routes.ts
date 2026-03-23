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

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'quick-rent', component: QuickRentComponent },
  { path: 'accessories', component: AccessoriesComponent },
  { path: 'rentals/:id', component: RentalDetailComponent },
  { path: 'orders', component: MyOrdersComponent },
  { path: 'coins', component: UnioCoinsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'help', component: HelpComponent },
  { path: '**', redirectTo: '' }
];
