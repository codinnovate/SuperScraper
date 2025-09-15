import { searchStylesApi } from "@/lib/api/search"
import useSWR from "swr"

export const useSearch = () => {

    const searchStyles = (q: string) => {
        const { data, error, isLoading, mutate } = useSWR(
            [`search-styles`, q],
            () => searchStylesApi(q)
        )

        return {
            searchResults: data || [],
            isLoading,
            error,
            mutate
        }
    }

    return { searchStyles }
}