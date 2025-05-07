import { ApiRequestOptions, ApiResponse } from './http-rest.interface';

export class ApiClient {
	private baseUrl: string;
	private defaultHeaders: Record<string, string>;

	constructor(baseUrl: string, defaultHeaders: Record<string, string> = {}) {
		this.baseUrl = baseUrl;

		this.defaultHeaders = {
			'Content-Type': 'application/json',
			...defaultHeaders,
		};
	}

	public async request<T = any>(
		endpoint: string,
		options: ApiRequestOptions = {},
	): Promise<ApiResponse<T>> {
		const {
			method = 'GET',
			headers = {},
			body,
			params,
			credentials = 'same-origin',
			mode,
			cache,
		} = options;

		const url = new URL(this.baseUrl + endpoint);

		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					url.searchParams.append(key, String(value));
				}
			});
		}

		const config: RequestInit = {
			method,
			headers: {
				...this.defaultHeaders,
				...headers,
			},
			credentials,
			mode,
			cache,
		};

		if (body && method !== 'GET') {
			config.body = typeof body === 'object' ? JSON.stringify(body) : body;
		}

		try {
			const response = await fetch(url.toString(), config);

			let data: T | null = null;
			const contentType = response.headers.get('content-type');

			if (contentType && contentType.includes('application/json')) {
				data = await response.json();
			} else if (response.status !== 204) {
				// 204 - No Content
				data = (await response.text()) as any;
			}

			return {
				data,
				status: response.status,
				statusText: response.statusText,
				headers: response.headers,
				ok: response.ok,
			};
		} catch (error) {
			console.error('API request failed:', error);
			throw error;
		}
	}

	public async get<T = any>(
		endpoint: string,
		params?: Record<string, string | number | boolean>,
		options: Omit<ApiRequestOptions, 'method' | 'body' | 'params'> = {},
	): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, {
			...options,
			method: 'GET',
			params,
		});
	}

	public async post<T = any>(
		endpoint: string,
		body?: any,
		options: Omit<ApiRequestOptions, 'method' | 'body'> = {},
	): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, {
			...options,
			method: 'POST',
			body,
		});
	}

	public async put<T = any>(
		endpoint: string,
		body?: any,
		options: Omit<ApiRequestOptions, 'method' | 'body'> = {},
	): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, {
			...options,
			method: 'PUT',
			body,
		});
	}

	public async patch<T = any>(
		endpoint: string,
		body?: any,
		options: Omit<ApiRequestOptions, 'method' | 'body'> = {},
	): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, {
			...options,
			method: 'PATCH',
			body,
		});
	}

	public async delete<T = any>(
		endpoint: string,
		options: Omit<ApiRequestOptions, 'method'> = {},
	): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, {
			...options,
			method: 'DELETE',
		});
	}

	public setDefaultHeaders(headers: Record<string, string>): void {
		this.defaultHeaders = {
			...this.defaultHeaders,
			...headers,
		};
	}
}
