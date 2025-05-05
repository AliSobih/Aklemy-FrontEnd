// src/app/services/shopping-cart.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Course } from '../common/course';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  private categoriesUpdated = new Subject<void>();

  constructor() {}

  addProductToCart(product: Course): { success: boolean; message: string } {
    let cart: Course[] = JSON.parse(localStorage.getItem('cart') || '[]');

    // Check if the product already exists in the cart
    const productExists = cart.some((item) => item.id === product.id);
    if (productExists) {
      return { success: false, message: 'Product already in cart!' };
    }

    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    this.categoriesUpdated.next();

    return { success: true, message: 'Product added to cart!' };
  }

  removeProductFromCart(productId: number): {
    success: boolean;
    message: string;
  } {
    let cart: any[] = JSON.parse(localStorage.getItem('cart') || '[]');

    const updatedCart = cart.filter((item) => item.id !== productId);
    if (updatedCart.length === cart.length) {
      return { success: false, message: 'Product not found in cart!' };
    }

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    this.categoriesUpdated.next();

    return { success: true, message: 'Product removed from cart!' };
  }

  getCartItems(): any[] {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  }

  getshoppingUpdatedListener() {
    return this.categoriesUpdated.asObservable();
  }
}
