import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, timeout } from 'rxjs';
import { PropertyListing, PropertyListingApiService } from '../../core/services/property-listing-api.service';

@Component({
  selector: 'app-my-properties',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-properties.html',
  styleUrls: ['./my-properties.css']
})
export class MyPropertiesComponent implements OnInit {
  private readonly propertyApi = inject(PropertyListingApiService);
  private readonly router = inject(Router);

  properties: PropertyListing[] = [];
  loading = false;
  errorMessage = '';
  deletingId: string | null = null;
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  itemsPerPage = 10;

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(page: number = 1): void {
    this.loading = true;
    this.errorMessage = '';
    this.currentPage = page;

    this.propertyApi
      .getPropertyListings(page, this.itemsPerPage)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.properties = response.properties;
          this.totalPages = (response as any).totalPages || 1;
          this.totalItems = (response as any).total || 0;
        },
        error: (error: unknown) => {
          this.errorMessage = this.extractError(error, 'Failed to load properties. Please try again.');
        }
      });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadProperties(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.loadProperties(this.currentPage - 1);
    }
  }

  deleteProperty(id: string): void {
    if (!confirm('Are you sure you want to delete this property listing?')) {
      return;
    }

    this.deletingId = id;
    this.errorMessage = '';

    this.propertyApi
      .deletePropertyListing(id)
      .pipe(
        timeout(10000),
        finalize(() => {
          this.deletingId = null;
        })
      )
      .subscribe({
        next: () => {
          this.properties = this.properties.filter((p) => p.id !== id);
        },
        error: (error: unknown) => {
          this.errorMessage = this.extractError(error, 'Failed to delete property. Please try again.');
        }
      });
  }

  editProperty(id: string): void {
    this.router.navigate(['/edit-property', id]);
  }

  viewProperty(id: string): void {
    this.router.navigate(['/property', id]);
  }

  goToListProperty(): void {
    this.router.navigate(['/list-property']);
  }

  getRentalCategoryLabel(category: string): string {
    switch (category) {
      case 'HOSTELS_PG':
        return 'Hostels / PG';
      case 'VEHICLES':
        return 'Vehicles';
      default:
        return category;
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'status-active';
      case 'INACTIVE':
        return 'status-inactive';
      default:
        return 'status-default';
    }
  }

  private extractError(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return 'Backend service is not reachable. Please ensure backend is running on port 5003.';
      }
      return error.error?.message ?? fallback;
    }
    return 'Request timed out. Please try again.';
  }
}
