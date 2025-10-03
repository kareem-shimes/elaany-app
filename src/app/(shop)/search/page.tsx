import SearchPageClient from "./SearchPageClient";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    location?: string;
  }>;
}

async function SearchPageContent({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const category = params.category || "";
  const location = params.location || "";

  return (
    <SearchPageClient
      initialQuery={query}
      initialCategory={category}
      initialLocation={location}
    />
  );
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return <SearchPageContent searchParams={searchParams} />;
}
