import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { Product, ProductFilters, PaginatedResult } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
	private products: Product[] = [
		// Electronics Category (12 products)
		{
			id: '1',
			name: 'Wireless Bluetooth Headphones',
			description: 'High-quality wireless headphones with noise cancellation',
			price: 299.99,
			category: 'Electronics',
			imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop',
			stock: 50,
			status: 'active',
			createdAt: new Date('2024-01-15'),
			updatedAt: new Date('2024-08-01')
		},
		{
			id: '2',
			name: 'Smart Fitness Watch',
			description: 'Advanced fitness tracking with heart rate monitor',
			price: 199.99,
			category: 'Electronics',
			imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop',
			stock: 60,
			status: 'active',
			createdAt: new Date('2024-02-10'),
			updatedAt: new Date('2024-07-15')
		},
		{
			id: '3',
			name: 'Laptop Stand Adjustable',
			description: 'Ergonomic aluminum laptop stand with heat dissipation',
			price: 59.99,
			category: 'Electronics',
			imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1200&auto=format&fit=crop',
			stock: 80,
			status: 'active',
			createdAt: new Date('2024-01-20'),
			updatedAt: new Date('2024-08-05')
		},
		{
			id: '4',
			name: 'USB-C Hub Multi-Port',
			description: '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader',
			price: 79.99,
			category: 'Electronics',
			imageUrl: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?q=80&w=1200&auto=format&fit=crop',
			stock: 45,
			status: 'active',
			createdAt: new Date('2024-02-15'),
			updatedAt: new Date('2024-08-10')
		},
		{
			id: '5',
			name: 'Wireless Phone Charger',
			description: '15W fast wireless charging pad with LED indicator',
			price: 39.99,
			category: 'Electronics',
			imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?q=80&w=1200&auto=format&fit=crop',
			stock: 90,
			status: 'active',
			createdAt: new Date('2024-03-01'),
			updatedAt: new Date('2024-08-12')
		},
		{
			id: '6',
			name: 'Gaming Mouse RGB',
			description: 'High-precision gaming mouse with customizable RGB lighting',
			price: 89.99,
			category: 'Electronics',
			imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=1200&auto=format&fit=crop',
			stock: 35,
			status: 'active',
			createdAt: new Date('2024-03-10'),
			updatedAt: new Date('2024-08-08')
		},
		{
			id: '7',
			name: 'Bluetooth Speaker Portable',
			description: 'Waterproof portable speaker with 12-hour battery life',
			price: 129.99,
			category: 'Electronics',
			imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1200&auto=format&fit=crop',
			stock: 25,
			status: 'active',
			createdAt: new Date('2024-04-01'),
			updatedAt: new Date('2024-08-20')
		},
		{
			id: '8',
			name: 'Webcam 4K HD',
			description: '4K webcam with auto-focus and noise-canceling microphone',
			price: 149.99,
			category: 'Electronics',
			imageUrl: 'https://images.unsplash.com/photo-1587827448132-46d5b43a0cfa?q=80&w=1200&auto=format&fit=crop',
			stock: 20,
			status: 'active',
			createdAt: new Date('2024-04-15'),
			updatedAt: new Date('2024-08-25')
		},
		{
			id: '9',
			name: 'Mechanical Keyboard',
			description: 'RGB mechanical keyboard with tactile switches',
			price: 159.99,
			category: 'Electronics',
			imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?q=80&w=1200&auto=format&fit=crop',
			stock: 40,
			status: 'active',
			createdAt: new Date('2024-05-01'),
			updatedAt: new Date('2024-08-30')
		},
		{
			id: '10',
			name: 'Smart Home Hub',
			description: 'Central hub for controlling all smart home devices',
			price: 199.99,
			category: 'Electronics',
			imageUrl: 'https://images.unsplash.com/photo-1558618047-7c0c44c5e8c7?q=80&w=1200&auto=format&fit=crop',
			stock: 15,
			status: 'active',
			createdAt: new Date('2024-05-15'),
			updatedAt: new Date('2024-09-01')
		},
		{
			id: '11',
			name: 'Wireless Earbuds Pro',
			description: 'True wireless earbuds with active noise cancellation and 24-hour battery',
			price: 179.99,
			category: 'Electronics',
			imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1200&auto=format&fit=crop',
			stock: 75,
			status: 'active',
			createdAt: new Date('2024-06-01'),
			updatedAt: new Date('2024-09-05')
		},
		{
			id: '12',
			name: 'Power Bank 20000mAh',
			description: 'High-capacity power bank with fast charging support',
			price: 69.99,
			category: 'Electronics',
			imageUrl: 'https://images.unsplash.com/photo-1609592999800-47b75ffa5d96?q=80&w=1200&auto=format&fit=crop',
			stock: 30,
			status: 'inactive',
			createdAt: new Date('2024-06-15'),
			updatedAt: new Date('2024-09-10')
		},

		// Clothing Category (12 products)
		{
			id: '13',
			name: 'Organic Cotton T-shirt',
			description: 'Comfortable organic cotton t-shirt in various colors',
			price: 29.99,
			category: 'Clothing',
			imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop',
			stock: 100,
			status: 'active',
			createdAt: new Date('2024-03-01'),
			updatedAt: new Date('2024-08-10')
		},
		{
			id: '14',
			name: 'Denim Jacket Classic',
			description: 'Vintage-style denim jacket with premium quality',
			price: 89.99,
			category: 'Clothing',
			imageUrl: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5c?q=80&w=1200&auto=format&fit=crop',
			stock: 45,
			status: 'active',
			createdAt: new Date('2024-01-10'),
			updatedAt: new Date('2024-08-15')
		},
		{
			id: '15',
			name: 'Wool Sweater Knit',
			description: 'Soft merino wool sweater perfect for cold weather',
			price: 119.99,
			category: 'Clothing',
			imageUrl: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=1200&auto=format&fit=crop',
			stock: 60,
			status: 'active',
			createdAt: new Date('2024-02-01'),
			updatedAt: new Date('2024-08-20')
		},
		{
			id: '16',
			name: 'Athletic Shorts',
			description: 'Quick-dry athletic shorts with side pockets',
			price: 39.99,
			category: 'Clothing',
			imageUrl: 'https://images.unsplash.com/photo-1561695095-f9c0133b7a1a?q=80&w=1200&auto=format&fit=crop',
			stock: 80,
			status: 'active',
			createdAt: new Date('2024-03-15'),
			updatedAt: new Date('2024-08-25')
		},
		{
			id: '17',
			name: 'Formal Dress Shirt',
			description: 'Professional dress shirt with wrinkle-free fabric',
			price: 69.99,
			category: 'Clothing',
			imageUrl: 'https://images.unsplash.com/photo-1602810320073-1230c46d89d4?q=80&w=1200&auto=format&fit=crop',
			stock: 50,
			status: 'active',
			createdAt: new Date('2024-04-01'),
			updatedAt: new Date('2024-09-01')
		},
		{
			id: '18',
			name: 'Men\'s Cotton Shirt',
			description: 'Classic fit cotton shirt in white, perfect for office wear',
			price: 59.99,
			category: 'Clothing',
			imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1200&auto=format&fit=crop',
			stock: 85,
			status: 'active',
			createdAt: new Date('2024-04-15'),
			updatedAt: new Date('2024-09-05')
		},
		{
			id: '19',
			name: 'Casual Polo Shirt',
			description: 'Comfortable polo shirt for everyday wear',
			price: 49.99,
			category: 'Clothing',
			imageUrl: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?q=80&w=1200&auto=format&fit=crop',
			stock: 70,
			status: 'active',
			createdAt: new Date('2024-05-01'),
			updatedAt: new Date('2024-09-10')
		},
		{
			id: '20',
			name: 'Winter Coat',
			description: 'Warm winter coat with water-resistant fabric',
			price: 199.99,
			category: 'Clothing',
			imageUrl: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=1200&auto=format&fit=crop',
			stock: 25,
			status: 'active',
			createdAt: new Date('2024-05-15'),
			updatedAt: new Date('2024-09-15')
		},
		{
			id: '21',
			name: 'Yoga Leggings',
			description: 'Stretchy yoga leggings with moisture-wicking fabric',
			price: 59.99,
			category: 'Clothing',
			imageUrl: 'https://images.unsplash.com/photo-1506629905270-11674283b58f?q=80&w=1200&auto=format&fit=crop',
			stock: 90,
			status: 'active',
			createdAt: new Date('2024-06-01'),
			updatedAt: new Date('2024-09-20')
		},
		{
			id: '22',
			name: 'Men\'s Graphic T-Shirt',
			description: 'Trendy graphic t-shirt with modern design, 100% cotton',
			price: 34.99,
			category: 'Clothing',
			imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1200&auto=format&fit=crop',
			stock: 95,
			status: 'active',
			createdAt: new Date('2024-06-15'),
			updatedAt: new Date('2024-09-25')
		},
		{
			id: '23',
			name: 'Women\'s Ethnic Kurti',
			description: 'Beautiful printed kurti with traditional embroidery work',
			price: 49.99,
			category: 'Clothing',
			imageUrl: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=1200&auto=format&fit=crop',
			stock: 65,
			status: 'active',
			createdAt: new Date('2024-07-01'),
			updatedAt: new Date('2024-09-30')
		},
		{
			id: '24',
			name: 'Cotton Socks Set',
			description: 'Pack of 6 cotton socks with reinforced heel and toe',
			price: 19.99,
			category: 'Clothing',
			imageUrl: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=1200&auto=format&fit=crop',
			stock: 120,
			status: 'inactive',
			createdAt: new Date('2024-07-15'),
			updatedAt: new Date('2024-10-01')
		},

		// Food & Beverage Category (12 products)
		{
			id: '25',
			name: 'Premium Coffee Beans',
			description: 'Single-origin arabica coffee beans, medium roast',
			price: 24.99,
			category: 'Food & Beverage',
			imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop',
			stock: 75,
			status: 'active',
			createdAt: new Date('2024-01-20'),
			updatedAt: new Date('2024-08-05')
		},
		{
			id: '26',
			name: 'Organic Green Tea',
			description: 'Premium organic green tea with antioxidants',
			price: 18.99,
			category: 'Food & Beverage',
			imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=1200&auto=format&fit=crop',
			stock: 100,
			status: 'active',
			createdAt: new Date('2024-02-01'),
			updatedAt: new Date('2024-08-10')
		},
		{
			id: '27',
			name: 'Artisan Chocolate Bar',
			description: 'Dark chocolate bar made with organic cocoa beans',
			price: 12.99,
			category: 'Food & Beverage',
			imageUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=1200&auto=format&fit=crop',
			stock: 60,
			status: 'active',
			createdAt: new Date('2024-02-15'),
			updatedAt: new Date('2024-08-15')
		},
		{
			id: '28',
			name: 'Natural Honey Raw',
			description: 'Pure raw honey harvested from local beehives',
			price: 16.99,
			category: 'Food & Beverage',
			imageUrl: 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ad?q=80&w=1200&auto=format&fit=crop',
			stock: 45,
			status: 'active',
			createdAt: new Date('2024-03-01'),
			updatedAt: new Date('2024-08-20')
		},
		{
			id: '29',
			name: 'Protein Powder Vanilla',
			description: 'Whey protein powder with natural vanilla flavoring',
			price: 39.99,
			category: 'Food & Beverage',
			imageUrl: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=1200&auto=format&fit=crop',
			stock: 80,
			status: 'active',
			createdAt: new Date('2024-03-15'),
			updatedAt: new Date('2024-08-25')
		},
		{
			id: '30',
			name: 'Olive Oil Extra Virgin',
			description: 'Cold-pressed extra virgin olive oil from Mediterranean',
			price: 22.99,
			category: 'Food & Beverage',
			imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=1200&auto=format&fit=crop',
			stock: 55,
			status: 'active',
			createdAt: new Date('2024-04-01'),
			updatedAt: new Date('2024-09-01')
		},
		{
			id: '31',
			name: 'Herbal Tea Blend',
			description: 'Relaxing herbal tea blend with chamomile and lavender',
			price: 15.99,
			category: 'Food & Beverage',
			imageUrl: 'https://images.unsplash.com/photo-1597318001725-db86d90af4d6?q=80&w=1200&auto=format&fit=crop',
			stock: 70,
			status: 'active',
			createdAt: new Date('2024-04-15'),
			updatedAt: new Date('2024-09-05')
		},
		{
			id: '32',
			name: 'Almond Butter Organic',
			description: 'Creamy organic almond butter with no added sugar',
			price: 28.99,
			category: 'Food & Beverage',
			imageUrl: 'https://images.unsplash.com/photo-1566842600175-97dca489844f?q=80&w=1200&auto=format&fit=crop',
			stock: 35,
			status: 'active',
			createdAt: new Date('2024-05-01'),
			updatedAt: new Date('2024-09-10')
		},
		{
			id: '33',
			name: 'Coconut Water Natural',
			description: 'Pure coconut water with natural electrolytes',
			price: 8.99,
			category: 'Food & Beverage',
			imageUrl: 'https://images.unsplash.com/photo-1581006852262-e6cf3d66d096?q=80&w=1200&auto=format&fit=crop',
			stock: 90,
			status: 'active',
			createdAt: new Date('2024-05-15'),
			updatedAt: new Date('2024-09-15')
		},
		{
			id: '34',
			name: 'Granola Mix Nuts',
			description: 'Homemade granola mix with nuts and dried fruits',
			price: 19.99,
			category: 'Food & Beverage',
			imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=1200&auto=format&fit=crop',
			stock: 65,
			status: 'active',
			createdAt: new Date('2024-06-01'),
			updatedAt: new Date('2024-09-20')
		},
		{
			id: '35',
			name: 'Kombucha Ginger',
			description: 'Probiotic kombucha with fresh ginger flavoring',
			price: 6.99,
			category: 'Food & Beverage',
			imageUrl: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=1200&auto=format&fit=crop',
			stock: 50,
			status: 'active',
			createdAt: new Date('2024-06-15'),
			updatedAt: new Date('2024-09-25')
		},
		{
			id: '36',
			name: 'Maple Syrup Pure',
			description: 'Grade A pure maple syrup from Canadian maple trees',
			price: 32.99,
			category: 'Food & Beverage',
			imageUrl: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?q=80&w=1200&auto=format&fit=crop',
			stock: 25,
			status: 'inactive',
			createdAt: new Date('2024-07-01'),
			updatedAt: new Date('2024-09-30')
		},

		// Home & Garden Category (12 products)
		{
			id: '37',
			name: 'Eco-Friendly Water Bottle',
			description: 'Stainless steel water bottle with temperature retention',
			price: 34.99,
			category: 'Home & Garden',
			imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1200&auto=format&fit=crop',
			stock: 85,
			status: 'active',
			createdAt: new Date('2024-04-01'),
			updatedAt: new Date('2024-08-01')
		},
		{
			id: '38',
			name: 'Indoor Plant Succulent',
			description: 'Low-maintenance succulent plant for indoor decoration',
			price: 19.99,
			category: 'Home & Garden',
			imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1200&auto=format&fit=crop',
			stock: 120,
			status: 'active',
			createdAt: new Date('2024-01-10'),
			updatedAt: new Date('2024-08-05')
		},
		{
			id: '39',
			name: 'Ceramic Plant Pot',
			description: 'Handmade ceramic plant pot with drainage holes',
			price: 29.99,
			category: 'Home & Garden',
			imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=1200&auto=format&fit=crop',
			stock: 60,
			status: 'active',
			createdAt: new Date('2024-02-01'),
			updatedAt: new Date('2024-08-10')
		},
		{
			id: '40',
			name: 'Garden Tool Set',
			description: 'Complete gardening tool set with trowel, pruner, and gloves',
			price: 49.99,
			category: 'Home & Garden',
			imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1200&auto=format&fit=crop',
			stock: 40,
			status: 'active',
			createdAt: new Date('2024-02-15'),
			updatedAt: new Date('2024-08-15')
		},
		{
			id: '41',
			name: 'Essential Oil Diffuser',
			description: 'Ultrasonic aromatherapy diffuser with LED lights',
			price: 59.99,
			category: 'Home & Garden',
			imageUrl: 'https://images.unsplash.com/photo-1610735552970-5d7c6c9fcba5?q=80&w=1200&auto=format&fit=crop',
			stock: 75,
			status: 'active',
			createdAt: new Date('2024-03-01'),
			updatedAt: new Date('2024-08-20')
		},
		{
			id: '42',
			name: 'Bamboo Cutting Board',
			description: 'Eco-friendly bamboo cutting board with juice groove',
			price: 39.99,
			category: 'Home & Garden',
			imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=1200&auto=format&fit=crop',
			stock: 95,
			status: 'active',
			createdAt: new Date('2024-03-15'),
			updatedAt: new Date('2024-08-25')
		},
		{
			id: '43',
			name: 'LED String Lights',
			description: 'Warm white LED string lights for indoor and outdoor use',
			price: 24.99,
			category: 'Home & Garden',
			imageUrl: 'https://images.unsplash.com/photo-1512909006721-3d6018887943?q=80&w=1200&auto=format&fit=crop',
			stock: 110,
			status: 'active',
			createdAt: new Date('2024-04-01'),
			updatedAt: new Date('2024-09-01')
		},
		{
			id: '44',
			name: 'Throw Pillow Set',
			description: 'Set of 2 decorative throw pillows with removable covers',
			price: 44.99,
			category: 'Home & Garden',
			imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop',
			stock: 70,
			status: 'active',
			createdAt: new Date('2024-04-15'),
			updatedAt: new Date('2024-09-05')
		},
		{
			id: '45',
			name: 'Storage Basket Wicker',
			description: 'Handwoven wicker storage basket with handles',
			price: 54.99,
			category: 'Home & Garden',
			imageUrl: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?q=80&w=1200&auto=format&fit=crop',
			stock: 35,
			status: 'active',
			createdAt: new Date('2024-05-01'),
			updatedAt: new Date('2024-09-10')
		},
		{
			id: '46',
			name: 'Wall Clock Modern',
			description: 'Silent wall clock with modern minimalist design',
			price: 69.99,
			category: 'Home & Garden',
			imageUrl: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?q=80&w=1200&auto=format&fit=crop',
			stock: 45,
			status: 'active',
			createdAt: new Date('2024-05-15'),
			updatedAt: new Date('2024-09-15')
		},
		{
			id: '47',
			name: 'Candle Set Soy',
			description: 'Set of 3 soy candles with natural essential oils',
			price: 36.99,
			category: 'Home & Garden',
			imageUrl: 'https://images.unsplash.com/photo-1602874801006-2ca6e62b8dcb?q=80&w=1200&auto=format&fit=crop',
			stock: 80,
			status: 'active',
			createdAt: new Date('2024-06-01'),
			updatedAt: new Date('2024-09-20')
		},
		{
			id: '48',
			name: 'Picture Frame Set',
			description: 'Set of 5 wooden picture frames in various sizes',
			price: 29.99,
			category: 'Home & Garden',
			imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=1200&auto=format&fit=crop',
			stock: 90,
			status: 'inactive',
			createdAt: new Date('2024-06-15'),
			updatedAt: new Date('2024-09-25')
		}
	];

	getProducts(filters?: ProductFilters): Observable<PaginatedResult<Product>> {
		let filteredProducts = [...this.products];

		if (filters) {
			if (filters.category) {
				filteredProducts = filteredProducts.filter(p =>
					p.category.toLowerCase().includes(filters.category!.toLowerCase())
				);
			}
			if (filters.status) {
				filteredProducts = filteredProducts.filter(p => p.status === filters.status);
			}
			if (filters.search) {
				const search = filters.search.toLowerCase();
				filteredProducts = filteredProducts.filter(p =>
					p.name.toLowerCase().includes(search) ||
					p.description.toLowerCase().includes(search)
				);
			}
			if (filters.minPrice !== undefined && filters.minPrice !== null) {
				filteredProducts = filteredProducts.filter(p => p.price >= (filters.minPrice as number));
			}
			if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
				filteredProducts = filteredProducts.filter(p => p.price <= (filters.maxPrice as number));
			}
		}

		// Implement pagination
		const pageSize = filters?.pageSize || 6;
		const page = filters?.page || 1;
		const startIndex = (page - 1) * pageSize;
		const endIndex = startIndex + pageSize;
		const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
		const totalPages = Math.ceil(filteredProducts.length / pageSize);

		const result: PaginatedResult<Product> = {
			data: paginatedProducts,
			total: filteredProducts.length,
			page: page,
			pageSize: pageSize,
			totalPages: totalPages
		};

		return of(result).pipe(delay(200));
	}

	getProduct(id: string): Observable<Product | undefined> {
		const product = this.products.find(p => p.id === id);
		return of(product).pipe(delay(150));
	}

	createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Observable<Product> {
		const newProduct: Product = {
			...product,
			id: (this.products.length + 1).toString(),
			createdAt: new Date(),
			updatedAt: new Date()
		};
		this.products.push(newProduct);
		return of(newProduct).pipe(delay(300));
	}

	updateProduct(id: string, product: Partial<Product>): Observable<Product> {
		const index = this.products.findIndex(p => p.id === id);
		if (index === -1) {
			return throwError(() => new Error('Product not found'));
		}
		this.products[index] = { ...this.products[index], ...product, id, updatedAt: new Date() };
		return of(this.products[index]).pipe(delay(300));
	}

	deleteProduct(id: string): Observable<boolean> {
		const index = this.products.findIndex(p => p.id === id);
		if (index === -1) {
			return throwError(() => new Error('Product not found'));
		}
		this.products.splice(index, 1);
		return of(true).pipe(delay(200));
	}

	getCategories(): Observable<string[]> {
		const categories = [...new Set(this.products.map(p => p.category))];
		return of(categories).pipe(delay(100));
	}
} 