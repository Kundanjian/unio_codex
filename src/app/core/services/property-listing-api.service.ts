import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay, tap } from 'rxjs';

export enum RentalCategory {
  HOSTELS_PG = 'HOSTELS_PG',
  VEHICLES = 'VEHICLES'
}

export enum HostelType {
  SINGLE_BED_ROOM = 'SINGLE_BED_ROOM',
  DOUBLE_BED_ROOM = 'DOUBLE_BED_ROOM',
  HOSTEL = 'HOSTEL',
  FLAT = 'FLAT',
  HOUSE = 'HOUSE',
  APARTMENT = 'APARTMENT',
  OTHER = 'OTHER'
}

export enum LunchDinnerOption {
  INCLUDED = 'INCLUDED',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
  PAY_EXTRA = 'PAY_EXTRA'
}

export enum RentDuration {
  ONE_DAY = 'ONE_DAY',
  ONE_WEEK = 'ONE_WEEK',
  ONE_MONTH = 'ONE_MONTH',
  THREE_MONTHS = 'THREE_MONTHS',
  SIX_MONTHS = 'SIX_MONTHS',
  ONE_YEAR = 'ONE_YEAR'
}

export type PropertyListing = {
  id: string;
  userId: string;
  proprietorName: string;
  mobileNumber: string;
  alternativeMobileNumber?: string | null;
  email: string;
  permanentAddress: string;
  rentalAddress: string;
  quickRent: boolean;
  rentDurations: RentDuration[];
  rentalCategory: RentalCategory;
  hostelType?: HostelType | null;
  surfaceArea?: number | null;
  parkingBikeScooter: boolean;
  parkingCar: boolean;
  furnitureBed: boolean;
  furnitureTable: boolean;
  furnitureChair: boolean;
  furnitureBardrove: boolean;
  furnitureAlmirah: boolean;
  furnitureKitchenWare: boolean;
  nearbyPlaces?: string | null;
  bachelorAllowed?: boolean | null;
  cctvAvailable?: boolean | null;
  lunchDinnerOption?: LunchDinnerOption | null;
  lateNightEntryAllowed?: boolean | null;
  title: string;
  description: string;
  images: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type CreatePropertyListingPayload = Omit<PropertyListing, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt'>;

export type UpdatePropertyListingPayload = Partial<CreatePropertyListingPayload>;

export type PropertyListingsResponse = {
  properties: PropertyListing[];
};

export type PropertyListingResponse = {
  property: PropertyListing;
};

export type CreatePropertyListingResponse = {
  message: string;
  property: PropertyListing;
};

export type UpdatePropertyListingResponse = {
  message: string;
  property: PropertyListing;
};

@Injectable({ providedIn: 'root' })
export class PropertyListingApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = '/api/properties';
  private cache = new Map<string, Observable<any>>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  getAuthHeaders() {
    const token = localStorage.getItem('unio_access_token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  }

  private clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  private getCachedObservable<T>(key: string, observable: Observable<T>): Observable<T> {
    if (!this.cache.has(key)) {
      const cached = observable.pipe(
        shareReplay(1, this.CACHE_TTL)
      );
      this.cache.set(key, cached);
    }
    return this.cache.get(key) as Observable<T>;
  }

  createPropertyListing(payload: CreatePropertyListingPayload): Observable<CreatePropertyListingResponse> {
    return this.http.post<CreatePropertyListingResponse>(this.apiBase, payload, this.getAuthHeaders()).pipe(
      tap(() => {
        this.clearCache('public-properties');
        this.clearCache('user-properties');
      })
    );
  }

  getPropertyListings(page: number = 1, limit: number = 10): Observable<PropertyListingsResponse> {
    return this.getCachedObservable(
      `user-properties-${page}-${limit}`,
      this.http.get<PropertyListingsResponse>(`${this.apiBase}?page=${page}&limit=${limit}`, this.getAuthHeaders())
    );
  }

  getPropertyListingById(id: string): Observable<PropertyListingResponse> {
    return this.getCachedObservable(
      `property-${id}`,
      this.http.get<PropertyListingResponse>(`${this.apiBase}/${id}`, this.getAuthHeaders())
    );
  }

  updatePropertyListing(id: string, payload: UpdatePropertyListingPayload): Observable<UpdatePropertyListingResponse> {
    return this.http.patch<UpdatePropertyListingResponse>(`${this.apiBase}/${id}`, payload, this.getAuthHeaders()).pipe(
      tap(() => {
        this.clearCache(`property-${id}`);
        this.clearCache('user-properties');
        this.clearCache('public-properties');
      })
    );
  }

  deletePropertyListing(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiBase}/${id}`, this.getAuthHeaders()).pipe(
      tap(() => {
        this.clearCache(`property-${id}`);
        this.clearCache('user-properties');
        this.clearCache('public-properties');
      })
    );
  }

  getPublicProperties(page: number = 1, limit: number = 12): Observable<PropertyListingsResponse> {
    return this.getCachedObservable(
      `public-properties-${page}-${limit}`,
      this.http.get<PropertyListingsResponse>(`${this.apiBase}/public?page=${page}&limit=${limit}`)
    );
  }

  getPublicPropertyById(id: string): Observable<PropertyListingResponse> {
    return this.getCachedObservable(
      `public-property-${id}`,
      this.http.get<PropertyListingResponse>(`${this.apiBase}/public/${id}`)
    );
  }
}
