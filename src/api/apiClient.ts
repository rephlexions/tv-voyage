import type { FetchOptions, JSONValue, QueryObject } from '@/types/types';

class NetworkError extends Error {
	constructor(message: string) {
		super(message);
		Object.setPrototypeOf(this, new.target.prototype);

		this.name = 'network_error';
	}
}

class ServerError extends Error {
	status: number;

	constructor(status: number, message: string) {
		super(message);
		Object.setPrototypeOf(this, new.target.prototype);

		this.name = 'server_error';
		this.status = status;
	}
}

export { NetworkError, ServerError };

export default class ApiClient {
	private baseUrl: string;
	private options: FetchOptions;

	constructor(baseUrl: string, options: FetchOptions) {
		this.baseUrl = baseUrl;
		this.options = options;
	}

	async fetch({
		endpoint,
		options,
		queryParams,
		timeout = 10000,
	}: {
		endpoint: string;
		options?: FetchOptions;
		queryParams?: QueryObject;
		timeout?: number;
	}): Promise<JSONValue> {
		try {
			let fullEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

			if (queryParams) {
				const query = new URLSearchParams(queryParams).toString();
				fullEndpoint = `${fullEndpoint}?${query}`;
			}

			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), timeout);

			const response: Response = await fetch(`${this.baseUrl}${fullEndpoint}`, {
				...this.options,
				...options,
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				const errorText = await response.text();
				throw new ServerError(response.status, `Server error ${response.status}: ${errorText}`);
			}

			try {
				return (await response.json()) as JSONValue;
			} catch (jsonError) {
				throw new Error(`Invalid JSON response: ${jsonError}`);
			}
		} catch (error) {
			if (error instanceof ServerError) {
				throw error;
			} else if (error instanceof TypeError) {
				throw new NetworkError(`Network error: ${error.message}`);
			} else {
				throw new Error(`An unknown error occurred: ${error}`);
			}
		}
	}
}
