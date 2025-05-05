import { Component, OnDestroy, OnInit } from '@angular/core';
import { Course } from '@common/course';
import { ShoppingCartService } from '@services/shopping-cart.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss',
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  cartItems: Course[] = [];
  totalPrice: number = 0;
  originalTotalPrice: number = 0;
  sectionCount: number = 0;
  lessonCount: number = 0;
  private subscription: Subscription | undefined;
  path: string = 'http://localhost:5000/api/courses/downloadImage/';

  constructor(private shoppingCartService: ShoppingCartService) {}

  ngOnInit(): void {
    this.loadCartItems();
    this.subscription = this.shoppingCartService
      .getshoppingUpdatedListener()
      .subscribe(() => {
        this.loadCartItems();
      });
  }

  loadCartItems(): void {
    this.cartItems = this.shoppingCartService.getCartItems();
    this.calculateTotalPrice();
  }
  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.price, 0);
    this.sectionCount = this.cartItems.reduce(
      (sum, item) => sum + item.sections.length,
      0
    );
  }
 
  removeProduct(productId: any): void {
    const result = this.shoppingCartService.removeProductFromCart(productId);
    alert(result.message);
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();}
}
