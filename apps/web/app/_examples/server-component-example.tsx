/**
 * Example of using server components for data fetching
 */

import { fetchData } from '@/lib/api/server-actions';

// Define types
type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Server component for fetching and displaying users
 */
export default async function UsersServerComponent() {
  // Fetch data using server component
  // This runs on the server and the data is sent to the client pre-rendered
  const users = await fetchData<User[]>('user', 'users', {
    // Revalidate every 60 seconds
    next: { revalidate: 60 }
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Users (Server Component)</h2>
      <div className="grid gap-4">
        {users.map(user => (
          <div key={user.id} className="p-4 border rounded-lg">
            <h3 className="font-medium">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded inline-block mt-2">
              {user.role}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
