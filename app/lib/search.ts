import { SearchClient, SearchProvider } from "@/app/lib/search/index";

const tavilySearchSingleton = () => {
  return new SearchClient({
    provider: SearchProvider.Tavily,
    providerConfig: {
      apiKey: process.env.TAVILY_API_KEY,
    },
  });
};

declare global {
  // eslint-disable-next-line no-var, no-unused-vars
  var cachedTavilySearch: undefined | ReturnType<typeof tavilySearchSingleton>;
}

const tavilySearch = globalThis.cachedTavilySearch ?? tavilySearchSingleton();

export default tavilySearch;

if (process.env.NODE_ENV === "development") {
  globalThis.cachedTavilySearch = tavilySearch;
}
