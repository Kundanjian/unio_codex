import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

type Category = {
  icon: string;
  label: string;
};

type PropertyCard = {
  title: string;
  price: number;
  unit: string;
  summary: string;
  image: string;
  rating: number;
  badge?: string;
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  private readonly roomArt = this.makeImage('#dbeafe', '#93c5fd', 'Room View');
  private readonly bunkArt = this.makeImage('#fee2e2', '#f59e0b', 'Bunk Stay');
  private readonly kitchenArt = this.makeImage('#ede9fe', '#8b5cf6', 'Kitchen');
  private readonly towerArt = this.makeImage('#dcfce7', '#22c55e', 'Apartment');
  private readonly gardenArt = this.makeImage('#fef3c7', '#f97316', 'Garden Home');
  private readonly mapArt = this.makeImage('#cffafe', '#0891b2', 'Map Nearby');
  private readonly tripArt = this.makeImage('#ffedd5', '#ea580c', 'Trip Plan');

  readonly durationOptions = ['Daily', 'Weekly', 'Monthly'];
  readonly locationSuggestions = ['Jabalpur', 'Jabalpur, Madhya Pradesh', 'Madhya Pradesh'];
  readonly quickFilters: Category[] = [
    { icon: '2W', label: 'Bike' },
    { icon: '4W', label: 'Car' },
    { icon: 'ST', label: 'Sofa' },
    { icon: 'HS', label: 'Hostels' }
  ];

  readonly listings: PropertyCard[] = [
    {
      title: '1 BHK Hostel, fully furnished',
      price: 4500,
      unit: '/month',
      summary: 'Comfortable private stay with wardrobe, AC and attached washroom.',
      image: this.roomArt,
      rating: 4
    },
    {
      title: '1 BHK Hostel with study cabin',
      price: 4000,
      unit: '/month',
      summary: 'Bright room setup with work desk, fresh linen and natural light.',
      image: this.roomArt,
      rating: 4,
      badge: 'Popular'
    },
    {
      title: '2 beds in one room with attached bath',
      price: 2500,
      unit: '/month',
      summary: 'Budget-friendly twin sharing option near coaching and transit.',
      image: this.roomArt,
      rating: 3
    },
    {
      title: 'Student bunk room, fully furnished',
      price: 4500,
      unit: '/month',
      summary: 'Clean bunk setup with storage, cooler and quick access to markets.',
      image: this.bunkArt,
      rating: 4
    },
    {
      title: 'Compact studio room near city center',
      price: 4500,
      unit: '/month',
      summary: 'Modern essentials for solo renters who want a central location.',
      image: this.roomArt,
      rating: 4
    },
    {
      title: 'Minimal room with wardrobe and desk',
      price: 4300,
      unit: '/month',
      summary: 'Quiet street-facing room ideal for interns and students.',
      image: this.roomArt,
      rating: 3
    },
    {
      title: 'Shared kitchen with private room',
      price: 4500,
      unit: '/month',
      summary: 'Private room plus fitted kitchen access in a gated property.',
      image: this.kitchenArt,
      rating: 4
    },
    {
      title: 'Apartment block stay for long term',
      price: 4500,
      unit: '/month',
      summary: 'Well-connected residential option with lift and secure entry.',
      image: this.towerArt,
      rating: 4
    }
  ];

  readonly discoveryTiles = [
    { title: 'Garden-facing home', image: this.gardenArt },
    { title: 'Nearby on map', image: this.mapArt },
    { title: 'More room photos', image: this.roomArt },
    { title: 'Trip plan?', image: this.tripArt }
  ];

  stars(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, index) => index < rating);
  }

  private makeImage(topColor: string, bottomColor: string, label: string): string {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${topColor}" />
            <stop offset="100%" stop-color="${bottomColor}" />
          </linearGradient>
        </defs>
        <rect width="640" height="480" rx="32" fill="url(#bg)" />
        <circle cx="522" cy="114" r="64" fill="rgba(255,255,255,0.35)" />
        <rect x="84" y="140" width="246" height="176" rx="26" fill="rgba(255,255,255,0.92)" />
        <rect x="110" y="166" width="194" height="18" rx="9" fill="rgba(15,23,42,0.16)" />
        <rect x="110" y="202" width="146" height="78" rx="18" fill="rgba(15,23,42,0.08)" />
        <rect x="358" y="168" width="170" height="126" rx="22" fill="rgba(255,255,255,0.78)" />
        <rect x="390" y="204" width="106" height="22" rx="11" fill="rgba(15,23,42,0.14)" />
        <rect x="386" y="246" width="92" height="28" rx="14" fill="rgba(15,23,42,0.1)" />
        <text x="84" y="394" fill="#0f172a" font-size="34" font-family="Segoe UI, Arial, sans-serif" font-weight="800">
          ${label}
        </text>
      </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }
}
