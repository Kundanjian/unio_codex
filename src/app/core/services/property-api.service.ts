import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { rentalListings, type RentalListing } from '../../data/market-data';
import { ApiProperty } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class PropertyApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = 'http://localhost:8080/api/properties';

  getProperties(): Observable<RentalListing[]> {
    return this.http
      .get<ApiProperty[]>(this.apiBase)
      .pipe(map((properties) => properties.map((property, index) => this.mapProperty(property, index))));
  }

  getPropertyById(id: string): Observable<RentalListing> {
    return this.http
      .get<ApiProperty>(`${this.apiBase}/${id}`)
      .pipe(map((property) => this.mapProperty(property, this.safeIndex(property.id))));
  }

  private mapProperty(property: ApiProperty, fallbackIndex: number): RentalListing {
    const fallback = rentalListings[this.safeIndex(fallbackIndex)];
    const title = property.title?.trim() || fallback.title;
    const location = property.location?.trim() || fallback.location;
    const price = property.price || fallback.price;

    return {
      ...fallback,
      id: String(property.id),
      title,
      location,
      price,
      dailyPrice: Math.max(100, Math.round(price / 18)),
      propertyType: this.inferPropertyType(title, fallback.propertyType),
      summary: `Direct landlord listing in ${location}. Check facilities, stay rules and suitability before booking.`
    };
  }

  private safeIndex(index: number): number {
    return Math.abs(index) % rentalListings.length;
  }

  private inferPropertyType(title: string, fallback: string): string {
    const normalized = title.toLowerCase();

    if (normalized.includes('hostel')) {
      return 'Hostel';
    }
    if (normalized.includes('villa')) {
      return 'Villa';
    }
    if (normalized.includes('apartment')) {
      return 'Apartment';
    }
    if (normalized.includes('flat')) {
      return 'Flat';
    }

    return fallback;
  }
}
