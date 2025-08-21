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
	templateUrl: './products-page.component.html',
	styleUrls: ['./products-page.component.css']
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