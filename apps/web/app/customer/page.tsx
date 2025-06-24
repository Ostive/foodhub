import { getHomePageRestaurants } from './_server-components/HomePageRestaurants';
import { Suspense } from 'react';
import ClientHomePage from './ClientHomePage';

export const dynamic = 'force-dynamic'; // Ensure the page is dynamic and not statically generated

export default async function CustomerHomePage() {
  // Fetch restaurant data on the server
  const { allRestaurants, popularRestaurants, restaurantsByCuisine } = await getHomePageRestaurants({
    popularLimit: 4,
    cuisineTypes: [] // Empty array to remove all cuisine-specific sections
  });
  
  // Pass data to the client component
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading restaurants...</div>}>
      <ClientHomePage 
        allRestaurants={allRestaurants}
        popularRestaurants={popularRestaurants} 
        restaurantsByCuisine={restaurantsByCuisine} 
      />
    </Suspense>
  );
}
