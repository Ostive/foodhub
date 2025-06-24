import { getPopularRestaurantsData } from "./_components/PopularRestaurantsServer";
import PopularRestaurantsClient from "./_components/PopularRestaurantsClient";
import { Suspense } from "react";

export const dynamic = 'force-dynamic'; // Ensure the page is dynamic and not statically generated

export default async function PopularRestaurantsPage() {
  // Fetch restaurant data on the server
  const { restaurants, error } = await getPopularRestaurantsData();

  // Pass data to the client component with a loading fallback
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading popular restaurants...</div>}>
      <PopularRestaurantsClient 
        initialRestaurants={restaurants} 
        error={error}
      />
    </Suspense>
  );
}
