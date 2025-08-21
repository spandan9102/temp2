import { Component, OnInit, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductFilters, PaginatedResult } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
	selector: 'app-products-page',
	standalone: true,
	imports: [CommonModule, FormsModule, ProductCardComponent],
	template: `
		<div class="layout">
			<!-- Fixed Filters Sidebar -->
			<aside class="filters-sidebar">
				<div class="filters-content">
					<h3>Filters</h3>
					<div class="filters-grid">
						<div class="filter-group">
							<label for="search">Search</label>
							<input id="search" type="text" [(ngModel)]="filters.search" placeholder="Search products..." (input)="applyFilters()" />
						</div>
						<div class="filter-group">
							<label for="category">Category</label>
							<select id="category" [(ngModel)]="filters.category" (change)="applyFilters()">
								<option value="">All Categories</option>
								<option *ngFor="let category of categories()" [value]="category">{{ category }}</option>
							</select>
						</div>
						<div class="filter-group">
							<label for="minPrice">Min Price</label>
							<input id="minPrice" type="number" [(ngModel)]="filters.minPrice" placeholder="0" (input)="applyFilters()" />
						</div>
						<div class="filter-group">
							<label for="maxPrice">Max Price</label>
							<input id="maxPrice" type="number" [(ngModel)]="filters.maxPrice" placeholder="1000" (input)="applyFilters()" />
						</div>
						<div class="filter-actions">
							<button class="clear-btn" (click)="clearFilters()">Clear Filters</button>
						</div>
					</div>
				</div>
			</aside>

			<!-- Scrollable Product Listing -->
			<main class="content-area">
				<div class="scrollable-content">
					<div class="grid">
						<app-product-card
							*ngFor="let p of displayed()"
							[product]="p"
							(addToCart)="onAddToCart($event)"
							(addToWishlist)="onAddToWishlist($event)"
						></app-product-card>
					</div>
					
					<!-- Pagination Controls -->
					<div class="pagination" *ngIf="totalPages() > 1">
						<button 
							class="pagination-btn" 
							[disabled]="currentPage() <= 1" 
							(click)="goToPage(currentPage() - 1)">
							Previous
						</button>
						
						<button 
							*ngFor="let page of getPageNumbers()" 
							class="pagination-btn" 
							[class.active]="page === currentPage()" 
							(click)="goToPage(page)">
							{{ page }}
						</button>
						
						<button 
							class="pagination-btn" 
							[disabled]="currentPage() >= totalPages()" 
							(click)="goToPage(currentPage() + 1)">
							Next
						</button>
					</div>
				</div>
			</main>
		</div>
	`,
	styles: [`
		.layout {
			display: flex;
			height: 100vh;
			overflow: hidden;
		}
		
		.filters-sidebar {
			position: fixed;
			top: 0;
			left: 0;
			width: 320px;
			height: 100vh;
			background: #fff;
			border-right: 1px solid #e5e7eb;
			z-index: 1000;
			overflow-y: auto;
			/* Hide scrollbar while maintaining scroll functionality */
			scrollbar-width: none; /* Firefox */
			-ms-overflow-style: none; /* IE and Edge */
		}
		
		/* Hide scrollbar for Chrome, Safari and Opera */
		.filters-sidebar::-webkit-scrollbar {
			display: none;
		}
		
		.filters-content {
			padding: 100px 24px 24px 24px; /* Increased top padding to avoid header overlap */
		}
		
		.filters-sidebar h3 {
			margin: 0 0 20px 0;
			font-size: 18px;
			font-weight: 600;
			color: #1f2937;
		}
		
		.filters-grid {
			display: grid;
			gap: 16px;
		}
		
		.filter-group {
			display: grid;
			gap: 8px;
		}
		
		.filter-group label {
			font-weight: 500;
			color: #374151;
			font-size: 14px;
		}
		
		.filter-group input,
		.filter-group select {
			padding: 12px;
			border: 1px solid #e5e7eb;
			border-radius: 8px;
			background: #fff;
			font-size: 14px;
			transition: border-color 0.2s;
		}
		
		.filter-group input:focus,
		.filter-group select:focus {
			outline: none;
			border-color: #2563eb;
			box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
		}
		
		.clear-btn {
			padding: 12px;
			border-radius: 8px;
			border: 1px solid #e5e7eb;
			background: #f8fafc;
			cursor: pointer;
			font-weight: 500;
			transition: all 0.2s;
		}
		
		.clear-btn:hover {
			background: #e2e8f0;
		}
		
		.content-area {
			margin-left: 320px; /* Account for fixed sidebar */
			width: calc(100% - 320px);
			height: calc(100vh - 60px); /* Account for top navigation */
			display: flex;
			flex-direction: column;
		}
		
		.scrollable-content {
			flex: 1;
			overflow-y: auto;
			padding: 100px 24px 24px 24px; /* Increased top padding to avoid header overlap */
			background: #f8fafc;
			/* Hide scrollbar while maintaining scroll functionality */
			scrollbar-width: none; /* Firefox */
			-ms-overflow-style: none; /* IE and Edge */
		}
		
		/* Hide scrollbar for Chrome, Safari and Opera */
		.scrollable-content::-webkit-scrollbar {
			display: none;
		}
		
		.grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
			gap: 24px;
			max-width: 1200px;
			margin-bottom: 24px;
		}
		
		.pagination {
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 12px;
			padding: 32px 0;
			background: #f8fafc;
			border-top: 1px solid #f1f5f9;
		}
		
		.pagination-btn {
			padding: 10px 16px;
			border: 1px solid #e5e7eb;
			background: #fff;
			border-radius: 8px;
			cursor: pointer;
			font-weight: 500;
			color: #374151;
			font-size: 14px;
			transition: all 0.2s;
			box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
		}
		
		.pagination-btn:hover:not(:disabled) {
			background: #f8fafc;
			border-color: #2563eb;
			color: #2563eb;
			transform: translateY(-1px);
			box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		}
		
		.pagination-btn.active {
			background: #2563eb;
			color: white;
			border-color: #2563eb;
			box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
		}
		
		.pagination-btn:disabled {
			background: #f9fafb;
			color: #9ca3af;
			cursor: not-allowed;
			opacity: 0.6;
		}
		
		/* Responsive Design */
		@media (max-width: 1024px) {
			.filters-sidebar {
				width: 280px;
			}
			
			.content-area {
				margin-left: 280px;
				width: calc(100% - 280px);
			}
			
			.grid {
				grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
			}
		}
		
		@media (max-width: 768px) {
			.filters-sidebar {
				transform: translateX(-100%);
				transition: transform 0.3s ease;
			}
			
			.filters-sidebar.mobile-open {
				transform: translateX(0);
			}
			
			.content-area {
				margin-left: 0;
				width: 100%;
			}
			
			.grid {
				grid-template-columns: 1fr;
			}
			
			.pagination {
				flex-wrap: wrap;
			}
			
			.pagination-btn {
				min-width: 44px;
			}
		}
	`]
})
export class ProductsPageComponent implements OnInit {
	filters: ProductFilters = { page: 1, pageSize: 6 };
	displayed = signal<Product[]>([]);
	categories = signal<string[]>([]);
	currentPage = signal<number>(1);
	totalPages = signal<number>(1);
	totalProducts = signal<number>(0);
	pageSize = 6;
	Math = Math;

	constructor(private productService: ProductService) {}

	ngOnInit(): void {
		this.load();
	}

	private load(): void {
		this.productService.getCategories().subscribe(cs => this.categories.set(cs));
		this.applyFilters();
	}

	applyFilters(): void {
		this.filters.page = 1; // Reset to first page on new filter
		this.currentPage.set(1);
		this.loadProducts();
	}

	private loadProducts(): void {
		this.productService.getProducts(this.filters).subscribe((result: PaginatedResult<Product>) => {
			this.displayed.set(result.data);
			this.totalPages.set(result.totalPages);
			this.totalProducts.set(result.total);
			this.currentPage.set(result.page);
		});
	}

	clearFilters(): void {
		this.filters = { page: 1, pageSize: 6 };
		this.currentPage.set(1);
		this.loadProducts();
	}

	goToPage(page: number): void {
		if (page >= 1 && page <= this.totalPages()) {
			this.filters.page = page;
			this.currentPage.set(page);
			this.loadProducts();
		}
	}

	getPageNumbers(): number[] {
		const total = this.totalPages();
		const current = this.currentPage();
		const pages: number[] = [];
		
		// Show up to 5 page numbers
		const start = Math.max(1, current - 2);
		const end = Math.min(total, start + 4);
		
		for (let i = start; i <= end; i++) {
			pages.push(i);
		}
		
		return pages;
	}

	onAddToCart(event: {product: Product, quantity: number}): void {
		if (event.quantity === 0) {
			// Item removed from cart
		} else {
			// Item added or quantity updated in cart
		}
	}

	onAddToWishlist(event: {product: Product, inWishlist: boolean}): void {
		if (event.inWishlist) {
			// Item added to wishlist
		} else {
			// Item removed from wishlist
		}
	}
} 