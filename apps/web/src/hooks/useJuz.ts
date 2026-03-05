import { queryOptions } from "@tanstack/react-query";
import { quranApi } from "~/lib/api";

export const juzListQueryOptions = () =>
  queryOptions({
    queryKey: ["juzs"],
    queryFn: () => quranApi.juz.list(),
  });
