import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthApiService } from '../../core/services/auth-api.service';
import {
  CreatePropertyListingPayload,
  HostelType,
  LunchDinnerOption,
  PropertyListing,
  PropertyListingApiService,
  RentDuration,
  RentalCategory
} from '../../core/services/property-listing-api.service';

@Component({
  selector: 'app-edit-property',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-property.html',
  styleUrls: ['../list-property/list-property.css']
})
export class EditPropertyComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly propertyApi = inject(PropertyListingApiService);
  private readonly authService = inject(AuthApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly currentUser = this.authService.currentUser;
  readonly RentalCategory = RentalCategory;

  loading = false;
  loadingProperty = true;
  errorMessage = '';
  successMessage = '';
  imagePreviewUrls: string[] = [];
  selectedFiles: File[] = [];
  propertyId = '';

  readonly rentDurationOptions = [
    { value: RentDuration.ONE_DAY, label: '1 Day' },
    { value: RentDuration.ONE_WEEK, label: '1 Week' },
    { value: RentDuration.ONE_MONTH, label: '1 Month' },
    { value: RentDuration.THREE_MONTHS, label: '3 Months' },
    { value: RentDuration.SIX_MONTHS, label: '6 Months' },
    { value: RentDuration.ONE_YEAR, label: '1 Year' }
  ];

  readonly hostelTypeOptions = [
    { value: HostelType.SINGLE_BED_ROOM, label: 'Single Bed Room' },
    { value: HostelType.DOUBLE_BED_ROOM, label: 'Double Bed Room (Combine)' },
    { value: HostelType.HOSTEL, label: 'Hostel' },
    { value: HostelType.FLAT, label: 'Flat' },
    { value: HostelType.HOUSE, label: 'House' },
    { value: HostelType.APARTMENT, label: 'Apartment' },
    { value: HostelType.OTHER, label: 'Other' }
  ];

  readonly lunchDinnerOptions = [
    { value: LunchDinnerOption.INCLUDED, label: 'Yes (included in rent amount)' },
    { value: LunchDinnerOption.NOT_AVAILABLE, label: 'No' },
    { value: LunchDinnerOption.PAY_EXTRA, label: 'Yes (Pay Extra to avail the service)' }
  ];

  readonly propertyForm = this.formBuilder.nonNullable.group({
    proprietorName: ['', [Validators.required, Validators.minLength(2)]],
    mobileNumber: ['', [Validators.required, Validators.pattern(/^[\d+\-\s()]{10,20}$/)]],
    alternativeMobileNumber: ['', [Validators.pattern(/^[\d+\-\s()]{10,20}$/)]],
    email: ['', [Validators.required, Validators.email]],
    permanentAddress: ['', [Validators.required, Validators.minLength(5)]],
    rentalAddress: ['', [Validators.required, Validators.minLength(5)]],
    quickRent: [false],
    rentDurations: [[] as RentDuration[], [Validators.required, Validators.minLength(1)]],
    rentalCategory: [RentalCategory.HOSTELS_PG, [Validators.required]],
    hostelType: ['' as HostelType | ''],
    surfaceArea: ['', [Validators.pattern(/^\d+$/)]],
    parkingBikeScooter: [false],
    parkingCar: [false],
    furnitureBed: [false],
    furnitureTable: [false],
    furnitureChair: [false],
    furnitureBardrove: [false],
    furnitureAlmirah: [false],
    furnitureKitchenWare: [false],
    nearbyPlaces: [''],
    bachelorAllowed: ['' as boolean | ''],
    cctvAvailable: ['' as boolean | ''],
    lunchDinnerOption: ['' as LunchDinnerOption | ''],
    lateNightEntryAllowed: ['' as boolean | ''],
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
    images: [[] as string[]]
  });

  ngOnInit(): void {
    this.propertyId = this.route.snapshot.paramMap.get('id') || '';
    if (this.propertyId) {
      this.loadProperty();
    } else {
      this.errorMessage = 'Property ID not found';
      this.loadingProperty = false;
    }
  }

  loadProperty(): void {
    this.loadingProperty = true;
    this.errorMessage = '';

    this.propertyApi
      .getPropertyListingById(this.propertyId)
      .pipe(
        finalize(() => {
          this.loadingProperty = false;
        })
      )
      .subscribe({
        next: (response) => {
          const property = response.property;
          this.propertyForm.patchValue({
            proprietorName: property.proprietorName,
            mobileNumber: property.mobileNumber,
            alternativeMobileNumber: property.alternativeMobileNumber || '',
            email: property.email,
            permanentAddress: property.permanentAddress,
            rentalAddress: property.rentalAddress,
            quickRent: property.quickRent,
            rentDurations: property.rentDurations,
            rentalCategory: property.rentalCategory,
            hostelType: property.hostelType || '',
            surfaceArea: property.surfaceArea ? String(property.surfaceArea) : '',
            parkingBikeScooter: property.parkingBikeScooter,
            parkingCar: property.parkingCar,
            furnitureBed: property.furnitureBed,
            furnitureTable: property.furnitureTable,
            furnitureChair: property.furnitureChair,
            furnitureBardrove: property.furnitureBardrove,
            furnitureAlmirah: property.furnitureAlmirah,
            furnitureKitchenWare: property.furnitureKitchenWare,
            nearbyPlaces: property.nearbyPlaces || '',
            bachelorAllowed: property.bachelorAllowed ?? '',
            cctvAvailable: property.cctvAvailable ?? '',
            lunchDinnerOption: property.lunchDinnerOption || '',
            lateNightEntryAllowed: property.lateNightEntryAllowed ?? '',
            title: property.title,
            description: property.description,
            images: property.images
          });
          this.imagePreviewUrls = property.images;
        },
        error: (error: unknown) => {
          this.errorMessage = this.extractError(error, 'Failed to load property. Please try again.');
        }
      });
  }

  get isHostelsPG(): boolean {
    return this.propertyForm.get('rentalCategory')?.value === RentalCategory.HOSTELS_PG;
  }

  submitProperty(): void {
    if (this.propertyForm.invalid || this.loading) {
      this.propertyForm.markAllAsTouched();
      this.errorMessage = this.validationMessage();
      this.successMessage = '';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.propertyForm.getRawValue();
    const payload: CreatePropertyListingPayload = {
      proprietorName: formValue.proprietorName.trim(),
      mobileNumber: formValue.mobileNumber.trim(),
      alternativeMobileNumber: formValue.alternativeMobileNumber.trim() || null,
      email: formValue.email.trim().toLowerCase(),
      permanentAddress: formValue.permanentAddress.trim(),
      rentalAddress: formValue.rentalAddress.trim(),
      quickRent: formValue.quickRent,
      rentDurations: formValue.rentDurations,
      rentalCategory: formValue.rentalCategory,
      hostelType: formValue.hostelType || null,
      surfaceArea: formValue.surfaceArea ? parseInt(formValue.surfaceArea, 10) : null,
      parkingBikeScooter: formValue.parkingBikeScooter,
      parkingCar: formValue.parkingCar,
      furnitureBed: formValue.furnitureBed,
      furnitureTable: formValue.furnitureTable,
      furnitureChair: formValue.furnitureChair,
      furnitureBardrove: formValue.furnitureBardrove,
      furnitureAlmirah: formValue.furnitureAlmirah,
      furnitureKitchenWare: formValue.furnitureKitchenWare,
      nearbyPlaces: formValue.nearbyPlaces.trim() || null,
      bachelorAllowed: formValue.bachelorAllowed === '' ? null : formValue.bachelorAllowed,
      cctvAvailable: formValue.cctvAvailable === '' ? null : formValue.cctvAvailable,
      lunchDinnerOption: formValue.lunchDinnerOption || null,
      lateNightEntryAllowed: formValue.lateNightEntryAllowed === '' ? null : formValue.lateNightEntryAllowed,
      title: formValue.title.trim(),
      description: formValue.description.trim(),
      images: formValue.images
    };

    this.propertyApi
      .updatePropertyListing(this.propertyId, payload)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.successMessage = response.message;
          setTimeout(() => {
            this.router.navigate(['/my-properties']);
          }, 2000);
        },
        error: (error: unknown) => {
          this.errorMessage = this.extractError(error, 'Unable to update property listing. Please try again.');
        }
      });
  }

  onRentDurationChange(event: Event, duration: RentDuration): void {
    const checkbox = event.target as HTMLInputElement;
    const currentDurations = this.propertyForm.get('rentDurations')?.value as RentDuration[];

    if (checkbox.checked) {
      this.propertyForm.patchValue({
        rentDurations: [...currentDurations, duration]
      });
    } else {
      this.propertyForm.patchValue({
        rentDurations: currentDurations.filter((d) => d !== duration)
      });
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files) {
      return;
    }

    const newFiles = Array.from(files);
    if (this.selectedFiles.length + newFiles.length > 3) {
      this.errorMessage = 'Maximum 3 images allowed';
      return;
    }

    newFiles.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'File size must be less than 5MB';
        return;
      }

      this.selectedFiles.push(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviewUrls.push(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });

    this.propertyForm.patchValue({
      images: this.imagePreviewUrls
    });
  }

  removeImage(index: number): void {
    this.imagePreviewUrls.splice(index, 1);
    this.selectedFiles.splice(index, 1);
    this.propertyForm.patchValue({
      images: this.imagePreviewUrls
    });
  }

  cancel(): void {
    this.router.navigate(['/my-properties']);
  }

  private validationMessage(): string {
    const controls = this.propertyForm.controls;

    if (controls.proprietorName.hasError('required')) {
      return 'Proprietor name is required.';
    }
    if (controls.mobileNumber.hasError('required')) {
      return 'Mobile number is required.';
    }
    if (controls.mobileNumber.hasError('pattern')) {
      return 'Please enter a valid mobile number (10-20 digits).';
    }
    if (controls.email.hasError('required')) {
      return 'Email is required.';
    }
    if (controls.email.hasError('email')) {
      return 'Please enter a valid email address.';
    }
    if (controls.permanentAddress.hasError('required')) {
      return 'Permanent address is required.';
    }
    if (controls.rentalAddress.hasError('required')) {
      return 'Rental address is required.';
    }
    if (controls.rentDurations.hasError('required') || controls.rentDurations.hasError('minlength')) {
      return 'Please select at least one rent duration.';
    }
    if (controls.title.hasError('required')) {
      return 'Title is required.';
    }
    if (controls.description.hasError('required')) {
      return 'Description is required.';
    }
    if (controls.description.hasError('maxlength')) {
      return 'Description must be within 500 characters.';
    }

    return 'Please fill all required fields correctly.';
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
