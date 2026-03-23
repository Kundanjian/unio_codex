import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { orderItems } from '../../data/market-data';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-orders.html',
  styleUrls: ['./my-orders.css']
})
export class MyOrdersComponent {
  readonly orders = orderItems;
}
