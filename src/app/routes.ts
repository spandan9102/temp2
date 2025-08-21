import { Routes } from '@angular/router';
import { ProductsPageComponent } from './pages/products/products-page.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';

export const routes: Routes = [
	{ path: '', redirectTo: '/products', pathMatch: 'full' },
	{ path: 'products', component: ProductsPageComponent },
	{ path: 'product/:id', component: ProductDetailComponent },
	{ path: '**', redirectTo: '/products' }
]; 