import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, RouterLink, RouterLinkActive],
	template: `
		<nav class="top-nav">
			<div class="brand">E-Commerce Platform</div>
			<div class="nav-links">
				<a routerLink="/products" routerLinkActive="active">Products</a>
			</div>
		</nav>
		<main class="main-content">
			<router-outlet></router-outlet>
		</main>
	`,
	styles: [`
		:host{display:block;font-family:Inter,system-ui,Segoe UI,Roboto,Arial,sans-serif;color:#0f172a;background:#f8fafc;min-height:100vh;overflow:hidden}
		.main-content{height:calc(100vh - 60px);overflow:hidden}
		.top-nav{position:fixed;top:0;left:0;right:0;z-index:1001;background:#ffffffcc;backdrop-filter:saturate(1.2) blur(8px);display:flex;align-items:center;justify-content:space-between;padding:12px 24px;border-bottom:1px solid #e5e7eb;height:60px}
		.brand{font-weight:700}
		.nav-links a{margin-left:16px;text-decoration:none;color:#1f2937}
		.nav-links a.active{color:#2563eb}
	`]
})
export class AppComponent {} 