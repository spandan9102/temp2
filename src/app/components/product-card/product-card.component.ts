import { Component, EventEmitter, Input, Output, signal, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
	selector: 'app-product-card',
	standalone: true,
	imports: [CommonModule, RouterLink],
	templateUrl: './product-card.component.html',
	styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {
	@Input() product!: Product;
	@Output() addToCart = new EventEmitter<{product: Product, quantity: number}>();
	@Output() addToWishlist = new EventEmitter<{product: Product, inWishlist: boolean}>();

	quantity = signal(1);

	constructor(private cartService: CartService) {
		// Set up effect to sync with cart service
		effect(() => {
			if (this.product) {
				this.quantity.set(this.cartService.getCartQuantity(this.product.id) || 1);
			}
		});
	}

	ngOnInit(): void {
		// Initialize state from cart service
		if (this.product) {
			this.quantity.set(this.cartService.getCartQuantity(this.product.id) || 1);
		}
	}

	isInCart(): boolean {
		return this.cartService.isInCart(this.product.id);
	}

	isInWishlist(): boolean {
		return this.cartService.isInWishlist(this.product.id);
	}

	increaseQuantity(): void {
		const current = this.quantity();
		if (current < this.product.stock) {
			const newQuantity = current + 1;
			this.quantity.set(newQuantity);
			this.cartService.addToCart(this.product, newQuantity);
		}
	}

	decreaseQuantity(): void {
		const current = this.quantity();
		if (current > 1) {
			const newQuantity = current - 1;
			this.quantity.set(newQuantity);
			this.cartService.addToCart(this.product, newQuantity);
		} else if (current === 1) {
			// Remove from cart - go back to Add to Cart button
			this.quantity.set(1);
			this.cartService.addToCart(this.product, 0);
		}
	}

	addToCartWithQuantity(): void {
		if (this.product.stock > 0) {
			this.quantity.set(1);
			this.cartService.addToCart(this.product, 1);
		}
	}

	toggleWishlist(): void {
		this.cartService.toggleWishlist(this.product);
	}

	onImageError(event: any) {
		// Set fallback image based on category
		const fallbackImages = {
			'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=400&auto=format&fit=crop',
			'Clothing': 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=400&auto=format&fit=crop', 
			'Food & Beverage': 'https://images.unsplash.com/photo-1506459225024-1428097a7e18?q=80&w=400&auto=format&fit=crop',
			'Home & Garden': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400&auto=format&fit=crop'
		};
		
		const fallback = fallbackImages[this.product.category as keyof typeof fallbackImages] || 
						'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=400&auto=format&fit=crop';
						
		event.target.src = fallback;
	}
} 