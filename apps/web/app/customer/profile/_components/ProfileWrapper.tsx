"use client";

import dynamic from "next/dynamic";

// Import the profile client component with dynamic import to avoid SSR
const ProfileClient = dynamic(() => import("../ProfileClient"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  )
});

interface ProfileWrapperProps {
  initialUserData: any;
  initialPaymentMethods: any[];
  initialNotificationSettings: any[];
  error: string | null;
}

export default function ProfileWrapper({
  initialUserData,
  initialPaymentMethods,
  initialNotificationSettings,
  error
}: ProfileWrapperProps) {
  return (
    <ProfileClient
      initialUserData={initialUserData}
      initialPaymentMethods={initialPaymentMethods}
      initialNotificationSettings={initialNotificationSettings}
      error={error}
    />
  );
}
