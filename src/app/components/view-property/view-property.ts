import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { PropertyListing, PropertyListingApiService, RentDuration, RentalCategory, HostelType, LunchDinnerOption } from '../../core/services/property-listing-api.service';

@Component({
  selector: 'app-view-property',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-property.html',
  styleUrls: ['./view-property.css']
})
export class ViewPropertyComponent implements OnInit {
  private readonly propertyApi = inject(PropertyListingApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  property: PropertyListing | null = null;
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    const propertyId = this.route.snapshot.paramMap.get('id');
    if (propertyId) {
      this.loadProperty(propertyId);
    } else {
      this.errorMessage = 'Property ID not found';
      this.loading = false;
    }
  }

  loadProperty(id: string): void {
    this.loading = true;
    this.errorMessage = '';

    this.propertyApi
      .getPropertyListingById(id)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.property = response.property;
        },
        error: (error: unknown) => {
          this.errorMessage = this.extractError(error, 'Failed to load property. Please try again.');
        }
      });
  }

  editProperty(): void {
    if (this.property) {
      this.router.navigate(['/edit-property', this.property.id]);
    }
  }

  goBack(): void {
    this.router.navigate(['/my-properties']);
  }

  getRentDurationLabel(duration: string): string {
    switch (duration) {
      case RentDuration.ONE_DAY:
        return '1 Day';
      case RentDuration.ONE_WEEK:
        return '1 Week';
      case RentDuration.ONE_MONTH:
        return '1 Month';
      case RentDuration.THREE_MONTHS:
        return '3 Months';
      case RentDuration.SIX_MONTHS:
        return '6 Months';
      case RentDuration.ONE_YEAR:
        return '1 Year';
      default:
        return duration;
    }
  }

  getHostelTypeLabel(type: string | null | undefined): string {
    if (!type) return 'Not specified';
    switch (type) {
      case HostelType.SINGLE_BED_ROOM:
        return 'Single Bed Room';
      case HostelType.DOUBLE_BED_ROOM:
        return 'Double Bed Room (Combine)';
      case HostelType.HOSTEL:
        return 'Hostel';
      case HostelType.FLAT:
        return 'Flat';
      case HostelType.HOUSE:
        return 'House';
      case HostelType.APARTMENT:
        return 'Apartment';
      case HostelType.OTHER:
        return 'Other';
      default:
        return type;
    }
  }

  getLunchDinnerLabel(option: string | null | undefined): string {
    if (!option) return 'Not specified';
    switch (option) {
      case LunchDinnerOption.INCLUDED:
        return 'Yes (included in rent)';
      case LunchDinnerOption.NOT_AVAILABLE:
        return 'No';
      case LunchDinnerOption.PAY_EXTRA:
        return 'Yes (Pay Extra)';
      default:
        return option;
    }
  }

  private extractError(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return 'Backend service is not reachable. Please ensure backend is running on port 5003.';
      }
      return error.error?.message ?? fallback;
    }
    return 'Request failed. Please try again.';
  }
}
