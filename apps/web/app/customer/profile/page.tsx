import { getProfileData } from "./_components/ProfileServer";
import { Suspense } from "react";
import ProfileWrapper from "./_components/ProfileWrapper";

export const dynamic = 'force-dynamic'; // Ensure the page is dynamic and not statically generated

/**
 * Profile page that uses server components to fetch data
 * and passes it to a client component for rendering
 */
export default async function ProfilePage() {
  try {
    // Fetch profile data using server component helper
    const { userData, paymentMethods, notificationSettings, error } = await getProfileData();
    
    // Render the profile client component with the fetched data
    return (
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      }>
        <ProfileWrapper 
          initialUserData={userData} 
          initialPaymentMethods={paymentMethods} 
          initialNotificationSettings={notificationSettings} 
          error={error} 
        />
      </Suspense>
    );
  } catch (error) {
    // Handle errors gracefully
    console.error('Error in profile page:', error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl font-semibold mb-4">Failed to load profile</p>
        <a href="/customer" className="text-primary hover:underline">
          Back to home
        </a>
      </div>
    );
  }
}
