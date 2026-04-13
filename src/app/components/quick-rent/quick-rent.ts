import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PropertyApiService } from '../../core/services/property-api.service';
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
export class QuickRentComponent implements OnInit {
  private readonly propertyApi = inject(PropertyApiService);
  readonly durationOptions = durationOptions;
  readonly quickFilters = quickFilters;
  listings = [...rentalListings, ...rentalListings.slice(0, 4)];

  ngOnInit(): void {
    this.propertyApi.getProperties().subscribe({
      next: (properties) => {
        if (properties.length) {
          this.listings = properties;
        }
      }
    });
  }

  stars(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, index) => index < rating);
  }
}
