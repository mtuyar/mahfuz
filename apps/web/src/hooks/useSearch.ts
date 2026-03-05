import { queryOptions } from "@tanstack/react-query";
import { quranApi } from "~/lib/api";
import { CACHE_TTL } from "@mahfuz/shared/constants";

export const searchQueryOptions = (
  query: string,
  page: number = 1,
  size: number = 20
) =>
  queryOptions({
    queryKey: ["search", query, page, size],
    queryFn: () => quranApi.search.search(query, { page, size }),
    staleTime: CACHE_TTL.SEARCH,
    enabled: query.length > 0,
  });
