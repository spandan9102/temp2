import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
	selector: 'app-product-detail',
	standalone: true,
	imports: [CommonModule, RouterLink],
	template: `
		<div class="product-detail-container" *ngIf="product(); else loading">
			<div class="back-button">
				<button (click)="goBack()" class="back-btn">
					← Back to Products
				</button>
			</div>
			
			<div class="product-detail">
				<div class="product-image">
					<img 
						[src]="product()!.imageUrl" 
						[alt]="product()!.name"
						(error)="onImageError($event)"
					/>
					<span class="status-badge" [class.active]="product()!.status==='active'" [class.inactive]="product()!.status==='inactive'">
						{{ product()!.status.toUpperCase() }}
					</span>
				</div>
				
				<div class="product-info">
					<h1 class="product-title">{{ product()!.name }}</h1>
					<p class="product-description">{{ product()!.description }}</p>
					
					<!-- Brief Product Description -->
					<div class="product-brief">
						<h3>About This Product</h3>
						<p>{{ getBriefDescription() }}</p>
					</div>
					
					<div class="product-meta">
						<div class="meta-item">
							<span class="label">Price:</span>
							<span class="value price">{{ product()!.price | currency:'USD' }}</span>
						</div>
						<div class="meta-item">
							<span class="label">Category:</span>
							<span class="value">{{ product()!.category }}</span>
						</div>
						<div class="meta-item">
							<span class="label">Stock:</span>
							<span class="value" [class.in-stock]="product()!.stock > 0" [class.out-stock]="product()!.stock === 0">
								{{ product()!.stock }} {{ product()!.stock > 0 ? '(In Stock)' : '(Out of Stock)' }}
							</span>
						</div>
					</div>
					
					<!-- Quantity Controls (only shown after adding to cart) -->
					<div class="quantity-section" *ngIf="isInCart() && product()!.stock > 0">
						<label class="quantity-label">Quantity:</label>
						<div class="quantity-controls">
							<button 
								class="quantity-btn" 
								(click)="decreaseQuantity()" 
								type="button">
								−
							</button>
							<span class="quantity-display">{{ quantity() }}</span>
							<button 
								class="quantity-btn" 
								(click)="increaseQuantity()" 
								[disabled]="quantity() >= product()!.stock"
								type="button">
								+
							</button>
						</div>
					</div>
					
					<div class="actions">
						<!-- Show Add to Cart initially -->
						<button 
							*ngIf="!isInCart()"
							class="add-to-cart-btn" 
							[disabled]="product()!.stock === 0"
							(click)="addToCart()">
							{{ product()!.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
						</button>
						
						<!-- Show Continue Shopping after adding to cart -->
						<button 
							*ngIf="isInCart()"
							class="continue-shopping-btn"
							(click)="goBack()">
							← Continue Shopping
						</button>
						
						<button class="wishlist-btn" [class.in-wishlist]="isInWishlist()" (click)="addToWishlist()">
							{{ isInWishlist() ? '♥ Remove from Wishlist' : '♡ Add to Wishlist' }}
						</button>
					</div>
				</div>
			</div>
		</div>
		
		<ng-template #loading>
			<div class="loading-container">
				<div class="loading-spinner"></div>
				<p>Loading product details...</p>
			</div>
		</ng-template>
		
		<div *ngIf="!product() && !isLoading" class="error-container">
			<h2>Product Not Found</h2>
			<p>The product you're looking for doesn't exist.</p>
			<button (click)="goBack()" class="back-btn">
				← Back to Products
			</button>
		</div>
	`,
	styles: [`
		.product-detail-container {
			width: 100%;
			min-height: 100vh;
			padding: 24px;
			max-width: 1400px;
			margin: 0 auto;
		}
		
		.back-button {
			margin-bottom: 32px;
		}
		
		.back-btn {
			display: inline-flex;
			align-items: center;
			gap: 8px;
			padding: 12px 20px;
			background: #f8fafc;
			border: 1px solid #e2e8f0;
			border-radius: 8px;
			color: #475569;
			cursor: pointer;
			font-weight: 500;
			transition: all 0.2s;
		}
		
		.back-btn:hover {
			background: #e2e8f0;
			color: #334155;
		}
		
		.product-detail {
			display: grid;
			grid-template-columns: 1fr 1.2fr;
			gap: 40px;
			background: white;
			border-radius: 16px;
			padding: 40px;
			box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
			max-width: 1200px;
			margin: 0 auto;
		}
		
		.product-image {
			position: relative;
			border-radius: 12px;
			overflow: hidden;
			background: #f1f5f9;
			aspect-ratio: 1;
			max-height: 500px;
		}
		
		.product-image img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			transition: transform 0.3s ease;
		}
		
		.product-image:hover img {
			transform: scale(1.05);
		}
		
		.status-badge {
			position: absolute;
			top: 16px;
			right: 16px;
			padding: 6px 12px;
			border-radius: 999px;
			font-size: 12px;
			font-weight: 600;
			color: white;
		}
		
		.status-badge.active {
			background: #22c55e;
		}
		
		.status-badge.inactive {
			background: #9ca3af;
		}
		
		.product-info {
			display: flex;
			flex-direction: column;
		}
		
		.product-title {
			font-size: 32px;
			font-weight: 700;
			color: #1f2937;
			margin: 0 0 16px 0;
			line-height: 1.2;
		}
		
		.product-description {
			font-size: 18px;
			color: #6b7280;
			line-height: 1.6;
			margin: 0 0 32px 0;
		}
		
		.product-brief {
			margin-bottom: 32px;
			padding: 24px;
			background: #f8fafc;
			border-radius: 12px;
			border: 1px solid #e2e8f0;
		}

		.product-brief h3 {
			font-size: 20px;
			font-weight: 600;
			color: #1f2937;
			margin-bottom: 16px;
			border-bottom: 1px solid #e2e8f0;
			padding-bottom: 12px;
		}

		.product-brief p {
			font-size: 16px;
			color: #475569;
			line-height: 1.6;
		}
		
		.product-meta {
			display: grid;
			gap: 16px;
			margin-bottom: 32px;
		}
		
		.meta-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 12px 0;
			border-bottom: 1px solid #f1f5f9;
		}
		
		.meta-item:last-child {
			border-bottom: none;
		}
		
		.label {
			font-weight: 500;
			color: #374151;
			font-size: 16px;
		}
		
		.value {
			font-weight: 600;
			color: #1f2937;
			font-size: 16px;
		}
		
		.value.price {
			font-size: 24px;
			color: #059669;
		}
		
		.value.in-stock {
			color: #16a34a;
		}
		
		.value.out-stock {
			color: #ef4444;
		}
		
		/* Quantity Controls */
		.quantity-section {
			margin-bottom: 24px;
			padding: 12px 16px;
			background: #f8fafc;
			border-radius: 8px;
			border: 1px solid #e2e8f0;
			display: inline-block;
		}
		
		.quantity-label {
			display: block;
			margin-bottom: 8px;
			font-size: 13px;
			font-weight: 500;
			color: #374151;
		}
		
		.quantity-controls {
			display: flex;
			align-items: center;
			gap: 0;
		}
		
		.quantity-btn {
			width: 28px;
			height: 28px;
			border: 1px solid #d1d5db;
			background: #fff;
			color: #374151;
			font-size: 12px;
			font-weight: 600;
			cursor: pointer;
			transition: all 0.2s;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		
		.quantity-btn:first-child {
			border-radius: 4px 0 0 4px;
		}
		
		.quantity-btn:last-child {
			border-radius: 0 4px 4px 0;
		}
		
		.quantity-btn:hover:not(:disabled) {
			background: #f3f4f6;
			color: #1f2937;
		}
		
		.quantity-btn:disabled {
			background: #f9fafb;
			color: #9ca3af;
			cursor: not-allowed;
		}
		
		.quantity-display {
			width: 40px;
			height: 28px;
			border-top: 1px solid #d1d5db;
			border-bottom: 1px solid #d1d5db;
			background: #fff;
			display: flex;
			align-items: center;
			justify-content: center;
			font-weight: 600;
			color: #1f2937;
			font-size: 12px;
		}
		
		.actions {
			display: flex;
			gap: 16px;
			margin-top: auto;
		}
		
		.add-to-cart-btn {
			flex: 1;
			padding: 16px 24px;
			background: #2563eb;
			color: white;
			border: none;
			border-radius: 12px;
			font-size: 16px;
			font-weight: 600;
			cursor: pointer;
			transition: all 0.2s;
		}
		
		.add-to-cart-btn:hover:not(:disabled) {
			background: #1d4ed8;
			transform: translateY(-1px);
		}
		
		.add-to-cart-btn:disabled {
			background: #9ca3af;
			cursor: not-allowed;
		}

		.continue-shopping-btn {
			padding: 16px 24px;
			background: #f8fafc;
			color: #475569;
			border: 1px solid #e2e8f0;
			border-radius: 12px;
			font-size: 16px;
			font-weight: 500;
			cursor: pointer;
			transition: all 0.2s;
		}

		.continue-shopping-btn:hover {
			background: #e2e8f0;
			color: #334155;
		}
		
		.wishlist-btn {
			padding: 16px 24px;
			background: #f8fafc;
			color: #475569;
			border: 1px solid #e2e8f0;
			border-radius: 12px;
			font-size: 16px;
			font-weight: 500;
			cursor: pointer;
			transition: all 0.2s;
		}
		
		.wishlist-btn:hover {
			background: #fce7f3;
			color: #ec4899;
			border-color: #ec4899;
		}
		
		.wishlist-btn.in-wishlist {
			background: #fce7f3;
			color: #ec4899;
			border-color: #ec4899;
		}
		
		.wishlist-btn.in-wishlist:hover {
			background: #f3e8ff;
			color: #a855f7;
			border-color: #a855f7;
		}
		
		.loading-container,
		.error-container {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			min-height: 400px;
			text-align: center;
		}
		
		.loading-spinner {
			width: 40px;
			height: 40px;
			border: 4px solid #f3f4f6;
			border-top: 4px solid #2563eb;
			border-radius: 50%;
			animation: spin 1s linear infinite;
			margin-bottom: 16px;
		}
		
		@keyframes spin {
			0% { transform: rotate(0deg); }
			100% { transform: rotate(360deg); }
		}
		
		/* Responsive Design */
		@media (max-width: 768px) {
			.product-detail {
				grid-template-columns: 1fr;
				gap: 24px;
				padding: 24px;
			}
			
			.product-title {
				font-size: 24px;
			}
			
			.product-description {
				font-size: 16px;
			}
			
			.actions {
				flex-direction: column;
			}
			
			.add-to-cart-btn,
			.continue-shopping-btn,
			.wishlist-btn {
				width: 100%;
			}
			
			.quantity-controls {
				justify-content: center;
			}
		}
	`]
})
export class ProductDetailComponent implements OnInit {
	product = signal<Product | null>(null);
	quantity = signal(1);
	isLoading = true;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private productService: ProductService,
		private cartService: CartService
	) {
		// Set up effect to sync with cart service
		effect(() => {
			const prod = this.product();
			if (prod) {
				this.quantity.set(this.cartService.getCartQuantity(prod.id) || 1);
			}
		});
	}

	ngOnInit(): void {
		const id = this.route.snapshot.paramMap.get('id');
		if (id) {
			this.loadProduct(id);
		}
	}

	loadProduct(id: string): void {
		this.productService.getProduct(id).subscribe({
			next: (product) => {
				this.product.set(product || null);
				this.isLoading = false;
				// Sync quantity with cart service
				if (product) {
					this.quantity.set(this.cartService.getCartQuantity(product.id) || 1);
				}
			},
			error: (error) => {
				console.error('Error loading product:', error);
				this.product.set(null);
				this.isLoading = false;
			}
		});
	}

	increaseQuantity(): void {
		const current = this.quantity();
		const prod = this.product();
		if (prod && current < prod.stock) {
			const newQuantity = current + 1;
			this.quantity.set(newQuantity);
			this.cartService.addToCart(prod, newQuantity);
		}
	}

	decreaseQuantity(): void {
		const current = this.quantity();
		const prod = this.product();
		if (prod) {
			if (current > 1) {
				const newQuantity = current - 1;
				this.quantity.set(newQuantity);
				this.cartService.addToCart(prod, newQuantity);
			} else if (current === 1) {
				// Remove from cart
				this.quantity.set(1);
				this.cartService.addToCart(prod, 0);
			}
		}
	}

	goBack(): void {
		this.router.navigate(['/products']);
	}

	addToCart(): void {
		const prod = this.product();
		if (prod && prod.stock > 0) {
			this.quantity.set(1);
			this.cartService.addToCart(prod, 1);
		}
	}

	addToWishlist(): void {
		const prod = this.product();
		if (prod) {
			this.cartService.toggleWishlist(prod);
		}
	}

	isInCart(): boolean {
		const prod = this.product();
		return prod ? this.cartService.isInCart(prod.id) : false;
	}

	isInWishlist(): boolean {
		const prod = this.product();
		return prod ? this.cartService.isInWishlist(prod.id) : false;
	}

	onImageError(event: any): void {
		// Fallback images based on category
		const prod = this.product();
		if (prod) {
			const fallbackImages = {
				'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=400&auto=format&fit=crop',
				'Clothing': 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=400&auto=format&fit=crop',
				'Food & Beverage': 'https://images.unsplash.com/photo-1506459225024-1428097a7e18?q=80&w=400&auto=format&fit=crop',
				'Home & Garden': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400&auto=format&fit=crop'
			};
			
			const fallback = fallbackImages[prod.category as keyof typeof fallbackImages] || 
							'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=400&auto=format&fit=crop';
							
			event.target.src = fallback;
		}
	}

	getBriefDescription(): string {
		const prod = this.product();
		if (!prod) return '';

		// Generate category-specific brief descriptions
		const categoryDescriptions: Record<string, string> = {
			'Electronics': `This ${prod.name.toLowerCase()} is a premium electronic device designed for modern users. It combines cutting-edge technology with user-friendly features to deliver exceptional performance and reliability.`,
			'Clothing': `This ${prod.name.toLowerCase()} is crafted with high-quality materials and attention to detail. Perfect for both casual and formal occasions, it offers comfort, style, and durability.`,
			'Food & Beverage': `This premium ${prod.name.toLowerCase()} is carefully selected for its superior quality and taste. Made with natural ingredients and traditional methods to ensure the best flavor experience.`,
			'Home & Garden': `This ${prod.name.toLowerCase()} is designed to enhance your living space with both functionality and aesthetic appeal. Built to last with quality materials and thoughtful design.`
		};

		return categoryDescriptions[prod.category] || `This ${prod.name.toLowerCase()} offers excellent quality and value. ${prod.description}`;
	}
} 