'use client'
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Edit, X, User, Mail, Phone, MapPin, Save, Camera } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Types
type ProfileTab = "personal";

// Mock login state (replace with actual auth logic)
const isLoggedIn = { value: true };

export default function Page() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab] = useState<ProfileTab>("personal");

  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, New York, NY 10001",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  });

  const [formData, setFormData] = useState({ ...userData });

  useEffect(() => {
    if (!isLoggedIn.value) {
      router.push("/customer/login");
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserData({ ...formData });
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setFormData({ ...userData });
    setIsEditing(false);
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2 p-4 md:p-6">
            {activeTab === "personal" && (
             <Card className="@container/card bg-gradient-to-t from-primary/5 to-card shadow-xs rounded-xl overflow-hidden">
                <CardHeader className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Personal Information
                  </CardTitle>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center text-sm font-medium"
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </button>
                  ) : (
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center text-sm font-medium"
                    >
                      <X className="h-4 w-4 mr-1" /> Cancel
                    </button>
                  )}
                </CardHeader>

                <div className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center mb-8">
                    <div className="relative mb-4 sm:mb-0 sm:mr-6">
                      <div className="h-24 w-24 rounded-full overflow-hidden">
                        <Image
                          src={userData.avatar}
                          alt={userData.name}
                          width={96}
                          height={96}
                          className="object-cover"
                        />
                      </div>
                      {isEditing && (
                        <button className="absolute bottom-0 right-0 bg-[#4CAF50] text-white p-2 rounded-full shadow-md hover:bg-[#388E3C] transition-colors">
                          <Camera className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{userData.name}</h3>
                      <p className="text-gray-500 dark:text-gray-400">Update your profile photo and personal details</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                          <User className="inline h-4 w-4" /> Full Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#4CAF50] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-gray-100 py-2">{userData.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                          <Mail className="inline h-4 w-4" /> Email Address
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#4CAF50] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-gray-100 py-2">{userData.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                          <Phone className="inline h-4 w-4" /> Phone Number
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#4CAF50] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-gray-100 py-2">{userData.phone}</p>
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <div className="mt-6">
                        <button
                          type="submit"
                          className="px-6 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#388E3C] transition-colors flex items-center"
                        >
                          <Save className="h-4 w-4 mr-2" /> Save Changes
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </Card>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
