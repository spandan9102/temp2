import { Component, EventEmitter, Input, Output, signal, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
	selector: 'app-product-card',
	standalone: true,
	imports: [CommonModule, RouterLink],
	template: `
		<div class="card" [class.inactive]="product.status==='inactive'">
			<div class="image-wrap">
				<img 
					[src]="product!.imageUrl" 
					[alt]="product!.name"
					(error)="onImageError($event)"
					loading="lazy"
				/>
			</div>
			<div class="content">
				<h3 class="name">{{ product!.name }}</h3>
				<p class="desc">{{ product!.description }}</p>
				<div class="meta">
					<div>
						<div class="label">Price:</div>
						<div class="value">{{ product!.price | currency:'USD' }}</div>
					</div>
					<div>
						<div class="label">Category:</div>
						<div class="value">{{ product!.category }}</div>
					</div>
					<div>
						<div class="label">Stock:</div>
						<div class="value" [class.in-stock]="product!.stock>0" [class.out-stock]="product!.stock===0">
							{{ product!.stock }} {{ product!.stock>0 ? '(In Stock)' : '(Out of Stock)' }}
						</div>
					</div>
				</div>
				
				<div class="actions">
					<a [routerLink]="['/product', product!.id]" class="view-details-btn">View Details</a>
					
					<!-- Show Add to Cart initially -->
					<button 
						*ngIf="!isInCart()" 
						class="add-to-cart-btn" 
						(click)="addToCartWithQuantity()" 
						[disabled]="product!.stock===0">
						{{ product!.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
					</button>
					
					<!-- Show quantity controls after adding to cart -->
					<div class="quantity-controls" *ngIf="isInCart() && product!.stock > 0">
						<button class="quantity-btn-minus" (click)="decreaseQuantity()">
							−
						</button>
						<span class="quantity-display">{{ quantity() }}</span>
						<button class="quantity-btn-plus" (click)="increaseQuantity()" [disabled]="quantity() >= product!.stock">
							+
						</button>
					</div>
					
					<button class="wishlist-btn" [class.in-wishlist]="isInWishlist()" (click)="toggleWishlist()">
						{{ isInWishlist() ? '♥' : '♡' }}
					</button>
				</div>
			</div>
		</div>
	`,
	styles: [`
		.card{
			background:#fff;
			border:1px solid #e5e7eb;
			border-radius:12px;
			overflow:hidden;
			display:flex;
			flex-direction:column;
			box-shadow:0 4px 12px rgba(0,0,0,.04);
			height:100%;
			min-height:500px;
			transition: transform 0.2s ease;
		}
		.card:hover{
			transform: translateY(-2px);
			box-shadow:0 8px 25px rgba(0,0,0,.1);
		}
		.card.inactive{opacity:.9}
		.image-wrap{
			position:relative;
			height:200px;
			background:#f1f5f9;
			overflow:hidden;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.image-wrap img{
			width:100%;
			height:100%;
			object-fit:cover;
			display:block;
			transition:transform 0.3s ease;
			background: #f8fafc;
		}
		.image-wrap:hover img{
			transform:scale(1.05);
		}
		/* Fallback for broken images */
		.image-wrap img[src=""], .image-wrap img:not([src]) {
			display: none;
		}
		.image-wrap::before {
			content: '';
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 60px;
			height: 60px;
			background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%236b7280"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>') no-repeat center center;
			background-size: contain;
			opacity: 0.3;
			z-index: 1;
		}

		.content{
			padding:16px;
			display:flex;
			flex-direction:column;
			flex:1;
		}
		.name{
			margin:0 0 8px 0;
			font-size:18px;
			font-weight:600;
			line-height:1.3;
			min-height:48px;
			display:-webkit-box;
			-webkit-line-clamp:2;
			-webkit-box-orient:vertical;
			overflow:hidden;
		}
		.desc{
			margin:0 0 16px 0;
			color:#475569;
			font-size:14px;
			line-height:1.4;
			min-height:56px;
			display:-webkit-box;
			-webkit-line-clamp:3;
			-webkit-box-orient:vertical;
			overflow:hidden;
		}
		.meta{
			display:grid;
			grid-template-columns:1fr;
			gap:8px;
			margin-bottom:16px;
		}
		.meta > div{
			display:flex;
			justify-content:space-between;
			align-items:center;
		}
		.label{
			color:#64748b;
			font-size:13px;
		}
		.value{
			font-weight:600;
			font-size:13px;
		}
		.value.in-stock{color:#16a34a}
		.value.out-stock{color:#ef4444}
		
		.actions{
			display:flex;
			gap:6px;
			margin-top:auto;
			align-items:center;
		}
		
		/* Base button styles */
		button, a{
			cursor:pointer;
			border:none;
			border-radius:6px;
			font-size:12px;
			font-weight:500;
			transition:all 0.2s ease;
			text-decoration:none;
			text-align:center;
			display:inline-flex;
			align-items:center;
			justify-content:center;
		}
		
		/* View Details - First button (left corner) */
		a.view-details-btn{
			padding:8px 12px;
			background:#059669;
			color:#fff;
			flex:1;
			font-weight:500;
		}
		a.view-details-btn:hover{
			background:#047857;
		}
		
		/* Add to Cart - Second button */
		.add-to-cart-btn{
			padding:8px 12px;
			background:#2563eb;
			color:#fff;
			flex:1;
		}
		.add-to-cart-btn:hover:not(:disabled){
			background:#1d4ed8;
		}
		.add-to-cart-btn:disabled{
			background:#9ca3af;
			cursor:not-allowed;
		}
		
		/* Quantity Controls - Replaces Add to Cart */
		.quantity-controls{
			display:flex;
			align-items:center;
			background:transparent;
			border:1px solid #d1d5db;
			border-radius:4px;
			overflow:hidden;
			flex:1;
		}
		
		.quantity-btn-minus, .quantity-btn-plus{
			width:28px;
			height:28px;
			background:transparent;
			color:#374151;
			font-size:12px;
			font-weight:600;
			border:none;
			border-radius:0;
			padding:0;
			transition:all 0.2s;
		}
		
		.quantity-btn-minus:hover:not(:disabled), .quantity-btn-plus:hover:not(:disabled){
			background:rgba(0,0,0,0.05);
		}
		
		.quantity-btn-minus:disabled, .quantity-btn-plus:disabled{
			color:#9ca3af;
			cursor:not-allowed;
		}
		
		.quantity-display{
			flex:1;
			height:28px;
			background:transparent;
			color:#1f2937;
			font-size:11px;
			font-weight:600;
			display:flex;
			align-items:center;
			justify-content:center;
			border-left:1px solid #d1d5db;
			border-right:1px solid #d1d5db;
		}
		
		/* Wishlist heart - Last button (right corner) */
		.wishlist-btn{
			padding:8px;
			background:#f1f5f9;
			color:#111827;
			min-width:32px;
			font-size:14px;
			transition: all 0.2s ease;
		}
		.wishlist-btn:hover{
			background:#fce7f3;
			color:#ec4899;
			transform: scale(1.1);
		}
		.wishlist-btn.in-wishlist{
			background:#fce7f3;
			color:#ec4899;
		}
		.wishlist-btn.in-wishlist:hover{
			background:#f3e8ff;
			color:#a855f7;
		}
		
		/* Mobile responsive adjustments */
		@media (max-width: 768px) {
			.actions{
				gap:4px;
			}
			a.view-details-btn, .add-to-cart-btn{
				font-size:11px;
				padding:6px 8px;
			}
			.quantity-controls{
				scale:0.9;
			}
			.wishlist-btn{
				min-width:28px;
				padding:6px;
			}
		}
	`]
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
			// Remove from cart
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