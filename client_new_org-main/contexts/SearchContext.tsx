import React from "react";

// Create a context to share search query
export const SearchContext = React.createContext<{
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}>({
  searchQuery: "",
  setSearchQuery: () => {},
});
