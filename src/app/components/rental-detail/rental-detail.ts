import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PropertyApiService } from '../../core/services/property-api.service';
import {
  facilityList,
  feedbackNotes,
  landlordRules,
  rentalListings
} from '../../data/market-data';

@Component({
  selector: 'app-rental-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './rental-detail.html',
  styleUrls: ['./rental-detail.css']
})
export class RentalDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly propertyApi = inject(PropertyApiService);
  listing = rentalListings[0];
  readonly relatedListings = rentalListings.slice(0, 4);
  readonly landlordRules = landlordRules;
  readonly facilities = facilityList;
  readonly feedbackNotes = feedbackNotes;

  ngOnInit(): void {
    const routeId = this.route.snapshot.paramMap.get('id');
    const localListing = rentalListings.find((item) => item.id === routeId);

    if (localListing) {
      this.listing = localListing;
    }

    if (routeId && /^\d+$/.test(routeId)) {
      this.propertyApi.getPropertyById(routeId).subscribe({
        next: (property) => {
          this.listing = property;
        }
      });
    }
  }

  stars(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, index) => index < rating);
  }
}
