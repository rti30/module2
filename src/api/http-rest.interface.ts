type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestOptions {
	method?: HttpMethod;
	headers?: Record<string, string>;
	body?: any;
	params?: Record<string, string | number | boolean>;
	credentials?: RequestCredentials;
	mode?: RequestMode;
	cache?: RequestCache;
}

export interface ApiResponse<T> {
	data: T | null;
	status: number;
	statusText: string;
	headers: Headers;
	ok: boolean;
}
