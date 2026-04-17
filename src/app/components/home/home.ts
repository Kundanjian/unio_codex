import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PropertyApiService } from '../../core/services/property-api.service';
import {
  discoveryTiles,
  durationOptions,
  locationSuggestions,
  platformHighlights,
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
export class HomeComponent implements OnInit {
  private readonly propertyApi = inject(PropertyApiService);
  readonly durationOptions = durationOptions;
  readonly locationSuggestions = locationSuggestions;
  readonly quickFilters = quickFilters;
  listings = rentalListings;
  readonly discoveryTiles = discoveryTiles;
  readonly platformHighlights = platformHighlights;

  ngOnInit(): void {
    this.propertyApi.getProperties().subscribe({
      next: (properties) => {
        if (properties.length) {
          this.listings = properties.slice(0, 8);
        }
      }
    });
  }

  stars(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, index) => index < rating);
  }
}
