import { Component } from '@angular/core';

@Component({
  selector: 'app-location-permission',
  standalone: true,
  templateUrl: './location-permission.html',
  styleUrls: ['./location-permission.css']
})
export class LocationPermissionComponent {
  private readonly storageKey = 'unio_location_permission';
  showPrompt = !localStorage.getItem(this.storageKey);

  allowLocation(): void {
    if (!navigator.geolocation) {
      localStorage.setItem(this.storageKey, 'unsupported');
      this.showPrompt = false;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        localStorage.setItem(this.storageKey, 'granted');
        localStorage.setItem('unio_last_lat', String(position.coords.latitude));
        localStorage.setItem('unio_last_lng', String(position.coords.longitude));
        this.showPrompt = false;
      },
      () => {
        localStorage.setItem(this.storageKey, 'denied');
        this.showPrompt = false;
      }
    );
  }

  dismissPrompt(): void {
    localStorage.setItem(this.storageKey, 'dismissed');
    this.showPrompt = false;
  }
}
