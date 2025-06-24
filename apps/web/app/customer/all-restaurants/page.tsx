import { getAllRestaurantsData } from "./_components/AllRestaurantsServer";
import AllRestaurantsClient from "./_components/AllRestaurantsClient";
import { Suspense } from "react";

export const dynamic = 'force-dynamic'; // Ensure the page is dynamic and not statically generated

export default async function AllRestaurantsPage() {
  // Fetch restaurant data on the server
  const { restaurants, error } = await getAllRestaurantsData();

  // Pass data to the client component with a loading fallback
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading restaurants...</div>}>
      <AllRestaurantsClient 
        initialRestaurants={restaurants} 
        error={error}
      />
    </Suspense>
  );
}
