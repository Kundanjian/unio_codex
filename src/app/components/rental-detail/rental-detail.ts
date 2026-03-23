import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { rentalListings } from '../../data/market-data';

@Component({
  selector: 'app-rental-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './rental-detail.html',
  styleUrls: ['./rental-detail.css']
})
export class RentalDetailComponent {
  private readonly route = inject(ActivatedRoute);
  readonly listing =
    rentalListings.find((item) => item.id === this.route.snapshot.paramMap.get('id')) ??
    rentalListings[0];
  readonly relatedListings = rentalListings.slice(0, 4);

  stars(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, index) => index < rating);
  }
}
