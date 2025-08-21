export interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	category: string;
	imageUrl: string;
	stock: number;
	status: 'active' | 'inactive';
	createdAt: Date;
	updatedAt: Date;
}

export interface ProductFilters {
	category?: string;
	status?: string;
	search?: string;
	minPrice?: number;
	maxPrice?: number;
	page?: number;
	pageSize?: number;
}

export interface PaginatedResult<T> {
	data: T[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
} 