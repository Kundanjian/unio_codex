export type Category = {
  icon: string;
  label: string;
};

export type RentalListing = {
  id: string;
  title: string;
  price: number;
  dailyPrice: number;
  unit: string;
  summary: string;
  location: string;
  image: string;
  rating: number;
  badge?: string;
};

export type OrderItem = {
  title: string;
  status: 'Active' | 'Completed' | 'Upcoming';
  duration: string;
  amount: string;
};

const createArt = (topColor: string, bottomColor: string, label: string): string => {
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
};

export const quickFilters: Category[] = [
  { icon: '2W', label: 'Bike' },
  { icon: '4W', label: 'Car' },
  { icon: 'ST', label: 'Sofa' },
  { icon: 'HS', label: 'Hostels' }
];

const roomArt = createArt('#dbeafe', '#93c5fd', 'Room View');
const bunkArt = createArt('#fee2e2', '#f59e0b', 'Bunk Stay');
const kitchenArt = createArt('#ede9fe', '#8b5cf6', 'Kitchen');
const towerArt = createArt('#dcfce7', '#22c55e', 'Apartment');
const gardenArt = createArt('#fef3c7', '#f97316', 'Garden Home');
const mapArt = createArt('#cffafe', '#0891b2', 'Map Nearby');
const tripArt = createArt('#ffedd5', '#ea580c', 'Trip Plan');

export const durationOptions = ['Daily', 'Weekly', 'Monthly'];
export const locationSuggestions = ['Jabalpur', 'Jabalpur, Madhya Pradesh', 'Madhya Pradesh'];

export const rentalListings: RentalListing[] = [
  {
    id: 'ganga-jamna-boys-hostel',
    title: '1 BHK Hostel, fully furnished',
    price: 4500,
    dailyPrice: 250,
    unit: '/month',
    summary: 'Comfortable private stay with wardrobe, AC and attached washroom.',
    location: 'Jabalpur, M.P.',
    image: roomArt,
    rating: 4
  },
  {
    id: 'study-cabin-hostel',
    title: '1 BHK Hostel with study cabin',
    price: 4000,
    dailyPrice: 220,
    unit: '/month',
    summary: 'Bright room setup with work desk, fresh linen and natural light.',
    location: 'Civil Lines, Jabalpur',
    image: roomArt,
    rating: 4,
    badge: 'Popular'
  },
  {
    id: 'twin-sharing-room',
    title: '2 beds in one room with attached bath',
    price: 2500,
    dailyPrice: 160,
    unit: '/month',
    summary: 'Budget-friendly twin sharing option near coaching and transit.',
    location: 'Napier Town, Jabalpur',
    image: roomArt,
    rating: 3
  },
  {
    id: 'student-bunk-room',
    title: 'Student bunk room, fully furnished',
    price: 4500,
    dailyPrice: 275,
    unit: '/month',
    summary: 'Clean bunk setup with storage, cooler and quick access to markets.',
    location: 'Wright Town, Jabalpur',
    image: bunkArt,
    rating: 4
  },
  {
    id: 'compact-studio-room',
    title: 'Compact studio room near city center',
    price: 4500,
    dailyPrice: 240,
    unit: '/month',
    summary: 'Modern essentials for solo renters who want a central location.',
    location: 'Sadar, Jabalpur',
    image: roomArt,
    rating: 4
  },
  {
    id: 'minimal-room-desk',
    title: 'Minimal room with wardrobe and desk',
    price: 4300,
    dailyPrice: 235,
    unit: '/month',
    summary: 'Quiet street-facing room ideal for interns and students.',
    location: 'Katanga, Jabalpur',
    image: roomArt,
    rating: 3
  },
  {
    id: 'shared-kitchen-private-room',
    title: 'Shared kitchen with private room',
    price: 4500,
    dailyPrice: 245,
    unit: '/month',
    summary: 'Private room plus fitted kitchen access in a gated property.',
    location: 'Adhartal, Jabalpur',
    image: kitchenArt,
    rating: 4
  },
  {
    id: 'apartment-block-stay',
    title: 'Apartment block stay for long term',
    price: 4500,
    dailyPrice: 260,
    unit: '/month',
    summary: 'Well-connected residential option with lift and secure entry.',
    location: 'Madan Mahal, Jabalpur',
    image: towerArt,
    rating: 4
  }
];

export const discoveryTiles = [
  { title: 'Garden-facing home', image: gardenArt },
  { title: 'Nearby on map', image: mapArt },
  { title: 'More room photos', image: roomArt },
  { title: 'Trip plan?', image: tripArt }
];

export const orderItems: OrderItem[] = [
  {
    title: 'Ganga Jamna Boys Hostel',
    status: 'Active',
    duration: '23 Mar 2026 - 23 Apr 2026',
    amount: 'Rs 4,500/month'
  },
  {
    title: 'City Center Studio',
    status: 'Completed',
    duration: '10 Feb 2026 - 10 Mar 2026',
    amount: 'Rs 4,300/month'
  },
  {
    title: 'Weekend Bike Rental',
    status: 'Upcoming',
    duration: '28 Mar 2026 - 30 Mar 2026',
    amount: 'Rs 900/weekend'
  }
];

export const helpTopics = [
  'How to book and confirm a property',
  'How Unio Coins apply to rentals',
  'What documents are needed for hostel stays',
  'How to contact support or request cancellation'
];

export const settingGroups = [
  { label: 'Profile', value: 'Name, phone number and email' },
  { label: 'Notifications', value: 'Rental updates, OTP and reminders' },
  { label: 'Privacy', value: 'Saved addresses and account visibility' },
  { label: 'Security', value: 'Password and login preferences' }
];
