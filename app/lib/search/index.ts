import { TavilySearchConfig, TavilySearchOptions, tavily } from "./tavily";

/** Supported search providers */
export enum SearchProvider {
  Tavily,
}

export interface SearchProviderConfigMap {
  [SearchProvider.Tavily]: TavilySearchConfig;
}

export type SearchProviderConfig<T> = T extends SearchProvider
  ? SearchProviderConfigMap[T]
  : object;

export interface SearchProviderSearchOptionsMap {
  [SearchProvider.Tavily]: TavilySearchOptions;
}

export type SearchProviderSearchOptions<T> = T extends SearchProvider
  ? SearchProviderSearchOptionsMap[T]
  : object;

/**
 * Common search options shared by all providers
 */
export interface CommonSearchOptions {
  /**
   * Search query
   */
  query: string;
  /**
   * Max search count
   */
  count?: number;
}

/**
 * Standardized search result page
 */
export type PageResult = {
  /**
   * Page title
   */
  title: string;
  /**
   * Page URL
   */
  url: string;
  /**
   * Page content or snippet
   */
  content: string;
};

/** Unified search result interface */

export interface SearchResult {
  /** Search result pages */
  pages: PageResult[];
}

/** Search provider class */
export class SearchClient<T extends SearchProvider> {
  constructor(
    private config: {
      /** Search provider to use */
      provider: T;
      /** Provider-specific configuration */
      providerConfig: SearchProviderConfig<T>;
    },
  ) {}

  /**
   * Performs a search using the configured provider
   * @param options Common search options
   * @param originalOptions Provider-specific search options
   * @returns Standardized search results
   */
  async search(
    options: CommonSearchOptions,
    originalOptions: Partial<SearchProviderSearchOptions<T>>,
  ): Promise<SearchResult> {
    switch (this.config.provider) {
      case SearchProvider.Tavily:
        const client = tavily(this.config.providerConfig as TavilySearchConfig);
        const searchOptions: TavilySearchOptions = {
          maxResults: options.count,
          ...((originalOptions as TavilySearchOptions) || {}),
        };

        const response = await client.search(options.query, searchOptions);

        return {
          pages: (response.results || []).map((item) => ({
            title: item.title || "",
            url: item.url,
            content: item.content,
          })),
        };
        default:
            throw new Error(`Unsupported search provider: ${this.config.provider}`);
    }
  }
}

export * from './tavily';