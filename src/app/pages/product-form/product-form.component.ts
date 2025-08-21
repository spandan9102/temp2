import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductFilters } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
	selector: 'app-product-form',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	template: `
		<div class="product-form">
			<div class="form-header">
				<div class="header-content">
					<h1>{{ isEditMode ? 'Edit Product' : 'Add New Product' }}</h1>
					<p>{{ isEditMode ? 'Update product information' : 'Add a new product to your catalog' }}</p>
				</div>
				<button class="back-btn" (click)="onCancel()"><span class="btn-icon">←</span>Back to Products</button>
			</div>

			<div *ngIf="loading()" class="loading"><div class="spinner"></div><p>Loading product data...</p></div>

			<div *ngIf="!loading()" class="form-container">
				<form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="product-form-content">
					<div class="form-group">
						<label for="name">Product Name *</label>
						<input id="name" type="text" formControlName="name" placeholder="Enter product name" [class.error]="invalid('name')" />
						<div class="error-message" *ngIf="getFieldError('name')">{{ getFieldError('name') }}</div>
					</div>

					<div class="form-group">
						<label for="description">Description *</label>
						<textarea id="description" formControlName="description" placeholder="Enter product description" rows="4" [class.error]="invalid('description')"></textarea>
						<div class="error-message" *ngIf="getFieldError('description')">{{ getFieldError('description') }}</div>
					</div>

					<div class="form-row">
						<div class="form-group">
							<label for="price">Price * ($)</label>
							<input id="price" type="number" step="0.01" min="0" formControlName="price" placeholder="0.00" [class.error]="invalid('price')" />
							<div class="error-message" *ngIf="getFieldError('price')">{{ getFieldError('price') }}</div>
						</div>
						<div class="form-group">
							<label for="category">Category *</label>
							<select id="category" formControlName="category" [class.error]="invalid('category')">
								<option value="">Select a category</option>
								<option *ngFor="let c of categories()" [value]="c">{{ c }}</option>
								<option value="Electronics">Electronics</option>
								<option value="Clothing">Clothing</option>
								<option value="Home & Garden">Home & Garden</option>
								<option value="Food & Beverage">Food & Beverage</option>
								<option value="Sports & Outdoors">Sports & Outdoors</option>
								<option value="Books">Books</option>
								<option value="Health & Beauty">Health & Beauty</option>
							</select>
							<div class="error-message" *ngIf="getFieldError('category')">{{ getFieldError('category') }}</div>
						</div>
					</div>

					<div class="form-group">
						<label for="imageUrl">Image URL *</label>
						<input id="imageUrl" type="url" formControlName="imageUrl" placeholder="https://example.com/image.jpg" [class.error]="invalid('imageUrl')" />
						<div class="error-message" *ngIf="getFieldError('imageUrl')">{{ getFieldError('imageUrl') }}</div>
						<div *ngIf="productForm.get('imageUrl')?.value && productForm.get('imageUrl')?.valid" class="image-preview">
							<img [src]="productForm.get('imageUrl')?.value" alt="Product preview" />
						</div>
					</div>

					<div class="form-row">
						<div class="form-group">
							<label for="stock">Stock Quantity *</label>
							<input id="stock" type="number" min="0" formControlName="stock" placeholder="0" [class.error]="invalid('stock')" />
							<div class="error-message" *ngIf="getFieldError('stock')">{{ getFieldError('stock') }}</div>
						</div>
						<div class="form-group">
							<label for="status">Status *</label>
							<select id="status" formControlName="status" [class.error]="invalid('status')">
								<option value="active">Active</option>
								<option value="inactive">Inactive</option>
							</select>
							<div class="error-message" *ngIf="getFieldError('status')">{{ getFieldError('status') }}</div>
						</div>
					</div>

					<div class="form-actions">
						<button type="button" class="cancel-btn" (click)="onCancel()" [disabled]="saving()">Cancel</button>
						<button type="submit" class="save-btn" [disabled]="productForm.invalid || saving()">
							<span *ngIf="saving()" class="spinner-small"></span>
							{{ saving() ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product') }}
						</button>
					</div>
				</form>
			</div>
		</div>
	`,
	styles: [`
		.product-form{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:16px}
		.form-header{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e5e7eb;padding-bottom:12px;margin-bottom:12px}
		.back-btn{border:1px solid #e5e7eb;background:#f8fafc;border-radius:8px;padding:8px 12px;cursor:pointer}
		.form-group{display:grid;gap:6px;margin-bottom:12px}
		.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
		@media (max-width: 960px){.form-row{grid-template-columns:1fr}}
		input, textarea, select{padding:10px 12px;border:1px solid #e5e7eb;border-radius:8px}
		.error{border-color:#ef4444}
		.error-message{color:#ef4444;font-size:12px}
		.image-preview{margin-top:8px}
		.image-preview img{max-width:320px;border-radius:8px;border:1px solid #e5e7eb}
		.form-actions{display:flex;justify-content:flex-end;gap:8px}
		.cancel-btn{border:1px solid #e5e7eb;background:#f8fafc;border-radius:8px;padding:10px 12px}
		.save-btn{border:none;background:#2563eb;color:#fff;border-radius:8px;padding:10px 16px}
		.loading{display:flex;gap:8px;align-items:center}
		.spinner{width:18px;height:18px;border:3px solid #e5e7eb;border-top-color:#2563eb;border-radius:50%;animation:spin 1s linear infinite}
		.spinner-small{width:14px;height:14px;border:2px solid #e5e7eb;border-top-color:#fff;border-radius:50%;display:inline-block;vertical-align:middle;margin-right:6px;animation:spin 1s linear infinite}
		@keyframes spin{to{transform:rotate(360deg)}}
	`]
})
export class ProductFormComponent implements OnInit {
	productForm!: FormGroup;
	isEditMode = false;
	loading = signal<boolean>(false);
	saving = signal<boolean>(false);
	categories = signal<string[]>([]);

	constructor(private fb: FormBuilder, private productService: ProductService, private route: ActivatedRoute, private router: Router) {}

	ngOnInit(): void {
		this.productForm = this.fb.group({
			name: ['', [Validators.required, Validators.minLength(3)]],
			description: ['', [Validators.required, Validators.minLength(10)]],
			price: [0, [Validators.required, Validators.min(0)]],
			category: ['', Validators.required],
			imageUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
			stock: [0, [Validators.required, Validators.min(0)]],
			status: ['active', Validators.required]
		});

		this.productService.getCategories().subscribe(c => this.categories.set(c));

		const id = this.route.snapshot.paramMap.get('id');
		this.isEditMode = !!id;
		if (id) {
			this.loading.set(true);
			this.productService.getProduct(id).subscribe(p => {
				if (p) {
					this.productForm.patchValue(p);
				}
				this.loading.set(false);
			});
		}
	}

	invalid(controlName: string): boolean {
		const control = this.productForm.get(controlName);
		return !!(control && control.invalid && control.touched);
	}

	getFieldError(controlName: string): string | null {
		const c = this.productForm.get(controlName);
		if (!c || !c.touched) return null;
		if (c.hasError('required')) return 'This field is required';
		if (c.hasError('minlength')) return 'Please enter more characters';
		if (c.hasError('min')) return 'Value must be 0 or greater';
		if (c.hasError('pattern')) return 'Please enter a valid URL';
		return null;
	}

	onCancel(): void {
		this.router.navigate(['/products']);
	}

	onSubmit(): void {
		if (this.productForm.invalid) {
			this.productForm.markAllAsTouched();
			return;
		}
		this.saving.set(true);
		const id = this.route.snapshot.paramMap.get('id');
		const payload = this.productForm.value as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
		if (this.isEditMode && id) {
			this.productService.updateProduct(id, payload).subscribe(() => {
				this.saving.set(false);
				this.router.navigate(['/products']);
			});
		} else {
			this.productService.createProduct(payload).subscribe(() => {
				this.saving.set(false);
				this.router.navigate(['/products']);
			});
		}
	}
} 