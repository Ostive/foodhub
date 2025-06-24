'use client';

/**
 * Example of using TanStack Query in a client component
 */

import { useState } from 'react';
import { useUsers, useUser, useCreateUser, useUpdateUser, useDeleteUser } from '@/lib/hooks/use-users';

export default function UsersClientComponent() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  // Fetch all users with TanStack Query
  const { 
    data: users, 
    isLoading, 
    error, 
    refetch 
  } = useUsers();
  
  // Fetch a single user when selected
  const { 
    data: selectedUser 
  } = useUser(selectedUserId || '', { 
    enabled: !!selectedUserId 
  });
  
  // Create user mutation
  const createUser = useCreateUser({
    onSuccess: (data) => {
      console.log('User created:', data);
      // Toast notification could be added here
    },
  });
  
  // Update user mutation
  const updateUser = useUpdateUser({
    onSuccess: (data) => {
      console.log('User updated:', data);
      // Toast notification could be added here
    },
  });
  
  // Delete user mutation
  const deleteUser = useDeleteUser({
    onSuccess: () => {
      console.log('User deleted');
      setSelectedUserId(null);
      // Toast notification could be added here
    },
  });
  
  // Handle create user form submission
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    createUser.mutate({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      role: formData.get('role') as string,
    });
    
    form.reset();
  };
  
  // Handle update user
  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    updateUser.mutate({
      id: selectedUserId,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as string,
    });
  };
  
  // Handle delete user
  const handleDeleteUser = () => {
    if (!selectedUserId) return;
    if (confirm('Are you sure you want to delete this user?')) {
      deleteUser.mutate(selectedUserId);
    }
  };
  
  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users: {error.message}</div>;
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Users Management (Client Component)</h2>
      
      {/* Users List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Users</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users?.map(user => (
            <div 
              key={user.id} 
              className={`p-4 border rounded-lg cursor-pointer ${
                selectedUserId === user.id ? 'border-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => setSelectedUserId(user.id)}
            >
              <h3 className="font-medium">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded inline-block mt-2">
                {user.role}
              </p>
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => refetch()} 
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
        >
          Refresh Users
        </button>
      </div>
      
      {/* Create User Form */}
      <div className="p-6 border rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Create New User</h3>
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input 
              type="text" 
              name="name" 
              required 
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              name="email" 
              required 
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select name="role" required className="w-full p-2 border rounded">
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="restaurant">Restaurant</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={createUser.isPending}
          >
            {createUser.isPending ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>
      
      {/* Edit User Form (only shown when a user is selected) */}
      {selectedUser && (
        <div className="p-6 border rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Edit User</h3>
            <button 
              onClick={handleDeleteUser} 
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              disabled={deleteUser.isPending}
            >
              {deleteUser.isPending ? 'Deleting...' : 'Delete User'}
            </button>
          </div>
          
          <form onSubmit={handleUpdateUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input 
                type="text" 
                name="name" 
                defaultValue={selectedUser.name}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input 
                type="email" 
                name="email" 
                defaultValue={selectedUser.email}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select 
                name="role" 
                defaultValue={selectedUser.role}
                className="w-full p-2 border rounded"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="restaurant">Restaurant</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>
            <button 
              type="submit" 
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              disabled={updateUser.isPending}
            >
              {updateUser.isPending ? 'Updating...' : 'Update User'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
