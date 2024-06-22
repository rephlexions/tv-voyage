import ApiClient from './apiClient';
import type { HttpMethod, FetchOptions, JSONValue, QueryObject } from '@/types/types';
import type { MediaType } from '@/types/types';

const config = {
  BASE_URL: 'https://api.themoviedb.org/3/',
  API_TOKEN: import.meta.env.VITE_TMDB_TOKEN
};

const options: FetchOptions = {
  method: 'GET' as HttpMethod,
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${config.API_TOKEN}`
  }
};

export default class TmdbApi extends ApiClient {
  private apiClient: ApiClient;

  constructor(baseUrl: string, options: FetchOptions) {
    super(baseUrl, options);
    this.apiClient = new ApiClient(baseUrl, options);
  }

  async discover(): Promise<JSONValue | Error> {
    try {
      const config = {
        endpoint: 'discover/movie',
        options: options
      };
      const response = await this.apiClient.fetch(config);
      if (response instanceof Error) {
        throw response;
      }
      return response;
    } catch (error) {
      return error as Error;
    }
  }

  async topRated(): Promise<JSONValue | Error> {
    try {
      const config = {
        endpoint: 'movie/top_rated',
        options: options
      };
      const response = await this.apiClient.fetch(config);
      if (response instanceof Error) {
        throw response;
      }
      return response;
    } catch (error) {
      return error as Error;
    }
  }

  async nowPlaying(): Promise<JSONValue | Error> {
    try {
      const config = {
        endpoint: 'movie/now_playing',
        options: options
      };
      const response = await this.apiClient.fetch(config);
      if (response instanceof Error) {
        throw response;
      }
      return response;
    } catch (error) {
      return error as Error;
    }
  }

  async popular(): Promise<JSONValue | Error> {
    try {
      const config = {
        endpoint: 'movie/popular',
        options: options
      };
      const response = await this.apiClient.fetch(config);
      if (response instanceof Error) {
        throw response;
      }
      return response;
    } catch (error) {
      return error as Error;
    }
  }

  async upcoming(): Promise<JSONValue | Error> {
    try {
      const config = {
        endpoint: 'movie/upcoming',
        options: options
      };
      const response = await this.apiClient.fetch(config);
      if (response instanceof Error) {
        throw response;
      }
      return response;
    } catch (error) {
      return error as Error;
    }
  }

  async images(id: number): Promise<JSONValue | Error> {
    try {
      const config = {
        endpoint: `movie/${id}/images`,
        options: options
      };
      const response = await this.apiClient.fetch(config);
      if (response instanceof Error) {
        throw response;
      }
      return response;
    } catch (error) {
      return error as Error;
    }
  }

  async trending(mediaType: MediaType, query?: QueryObject): Promise<JSONValue | Error> {
    try {
      const config = {
        endpoint: `trending/${mediaType}/week`,
        options: options,
        queryParams: query
      };
      const response = await this.apiClient.fetch(config);
      if (response instanceof Error) {
        throw response;
      }
      return response;
    } catch (error) {
      return error as Error;
    }
  }

  async genres(mediaType: MediaType): Promise<JSONValue | Error> {
    try {
      const config = {
        endpoint: `genre/${mediaType}/list`,
        options: options
      };
      const response = await this.apiClient.fetch(config);
      if (response instanceof Error) {
        throw response;
      }
      return response;
    } catch (error) {
      return error as Error;
    }
  }

  async getDetails(mediaType: MediaType, id: string) {
    try {
      const config = {
        endpoint: `${mediaType}/${id}`,
        options: options
      };
      const response = await this.apiClient.fetch(config);
      if (response instanceof Error) {
        throw response;
      }
      return response;
    } catch (error) {
      return error as Error;
    }
  }

  async getVideos(mediaType: MediaType, id: string) {
    try {
      const config = {
        endpoint: `${mediaType}/${id}/videos`,
        options: options
      };
      const response = await this.apiClient.fetch(config);
      if (response instanceof Error) {
        throw response;
      }
      return response;
    } catch (error) {
      return error as Error;
    }
  }
  async credits(mediaType: MediaType, id: string) {
    try {
      const config = {
        endpoint: `${mediaType}/${id}/credits`,
        options: options
      };
      const response = await this.apiClient.fetch(config);
      if (response instanceof Error) {
        throw response;
      }
      return response;
    } catch (error) {
      return error as Error;
    }
  }

  async reviews(mediaType: MediaType, id: string) {
    try {
      const config = {
        endpoint: `${mediaType}/${id}/reviews`,
        options: options
      };
      const response = await this.apiClient.fetch(config);
      if (response instanceof Error) {
        throw response;
      }
      return response;
    } catch (error) {
      return error as Error;
    }
  }

  async recommendations(mediaType: MediaType, id: string) {
    try {
      const config = {
        endpoint: `${mediaType}/${id}/recommendations`,
        options: options
      };
      const response = await this.apiClient.fetch(config);
      if (response instanceof Error) {
        throw response;
      }
      return response;
    } catch (error) {
      return error as Error;
    }
  }
}
export const tmdb = new TmdbApi(config.BASE_URL, options);
