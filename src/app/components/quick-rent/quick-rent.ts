import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  durationOptions,
  quickFilters,
  rentalListings
} from '../../data/market-data';

@Component({
  selector: 'app-quick-rent',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './quick-rent.html',
  styleUrls: ['./quick-rent.css']
})
export class QuickRentComponent {
  readonly durationOptions = durationOptions;
  readonly quickFilters = quickFilters;
  readonly listings = [...rentalListings, ...rentalListings.slice(0, 4)];

  stars(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, index) => index < rating);
  }
}
