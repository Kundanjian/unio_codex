import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  discoveryTiles,
  durationOptions,
  locationSuggestions,
  quickFilters,
  rentalListings
} from '../../data/market-data';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  readonly durationOptions = durationOptions;
  readonly locationSuggestions = locationSuggestions;
  readonly quickFilters = quickFilters;
  readonly listings = rentalListings;
  readonly discoveryTiles = discoveryTiles;

  stars(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, index) => index < rating);
  }
}
