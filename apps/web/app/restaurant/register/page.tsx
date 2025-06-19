"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateEstablishmentForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "", // Restaurant name
    lastName: "", // Additional restaurant info
    email: "",
    password: "",
    phone: "", // We'll add country code when submitting
    countryCode: "+33",
    address: "",
    profilePicture: "https://example.com/test-profile.jpg",
    website: "",
    rib: "",
    minimumPurchase: "10",
    deliveryRadius: "3",
    averagePreparationTime: "20-30 min",
    tags: "pizza, italian, pasta"
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(""); // Clear any previous errors

    try {
      // Validate form data before submission
      if (!formData.firstName || !formData.email || !formData.password || !formData.phone || !formData.address || !formData.rib) {
        setError("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      // Validate password strength
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        setError("Password must be at least 8 characters with uppercase, lowercase, and numbers");
        setIsSubmitting(false);
        return;
      }

      // Prepare data in the format expected by the API
      const apiData = {
        role: "restaurant",
        firstName: formData.firstName, // Restaurant name
        lastName: formData.lastName, // Additional restaurant info
        email: formData.email,
        password: formData.password,
        phone: formData.countryCode + formData.phone,
        address: formData.address,
        profilePicture: formData.profilePicture,
        website: formData.website || undefined,
        rib: formData.rib,
        minimumPurchase: Number(formData.minimumPurchase) || 10,
        deliveryRadius: Number(formData.deliveryRadius) || 3,
        averagePreparationTime: formData.averagePreparationTime || "20-30 min",
        tags: formData.tags ? formData.tags.split(",").map((tag) => tag.trim()) : ["pizza", "italian", "pasta"],
      };

      // Send the data to the API with timeout protection
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      try {
        const response = await fetch("http://localhost:3002/api/restaurants/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
          signal: controller.signal
        });

        clearTimeout(timeoutId); // Clear the timeout if request completes

        // Check for network errors
        if (!response) {
          throw new Error("Network error - no response received");
        }

        const data = await response.json().catch(e => {
          throw new Error("Error parsing server response");
        });

        if (!response.ok) {
          throw new Error(`Failed to create restaurant: ${data?.message || response.statusText || 'Unknown error'}`);
        }

        if (!data || !data.id || !data.token) {
          throw new Error("Invalid response data from server");
        }

        // Store user data in localStorage
        try {
          localStorage.setItem('user', JSON.stringify({
            userId: data.id,
            role: 'restaurant',
            token: data.token
          }));
        } catch (storageError) {
          console.warn("Could not store user data in localStorage", storageError);
          // Continue anyway as this is not critical
        }

        // Redirect to the restaurant dashboard
        router.push(`/restaurant-dashboard/${data.id}`);
      } catch (fetchError: any) {
        if (fetchError.name === 'AbortError') {
          throw new Error("Request timed out. Please try again.");
        }
        throw fetchError;
      }
    } catch (error: any) {
      console.error("Error creating restaurant:", error);
      setError(error.message || "An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative Background Images */}
      <div
        className="absolute top-0 left-0 w-1/2 h-full -z-10 opacity-20 blur-3xl"
        style={{
          backgroundImage: "url('/images/abstract-left.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      ></div>
      <div
        className="absolute top-0 right-0 w-1/3 h-full -z-10 opacity-30 blur-2xl"
        style={{
          backgroundImage: "url('/images/abstract-right.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
      ></div>

      {/* Form Card */}
      <div className="container mx-auto max-w-3xl bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6">
        <div className="flex items-center mb-6">
          <Link href="./" className="mr-4">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create Establishment</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Info */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                Restaurant Name*
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                maxLength={50}
                placeholder="e.g. Test Pizza"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum 50 characters
              </p>
            </div>

            <div className="w-full">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Info (optional)
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                maxLength={50}
                placeholder="e.g. Restaurant"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum 50 characters
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="e.g. example@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password*
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Create a secure password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Must contain at least 8 characters, including uppercase, lowercase, and numbers
            </p>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Phone Number*
            </label>
            <div className="flex">
              <select
                id="countryCode"
                name="countryCode"
                value={formData.countryCode}
                onChange={handleInputChange}
                className="w-20 px-2 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              >
                <option value="+33">+33</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+49">+49</option>
              </select>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="e.g. 612345678"
                className="w-full px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Restaurant Address*
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              maxLength={50}
              placeholder="e.g. 123 Main Street, Paris"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum 50 characters
            </p>
          </div>

          <div>
            <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 mb-1">
              Restaurant Picture URL*
            </label>
            <input
              type="url"
              id="profilePicture"
              name="profilePicture"
              value={formData.profilePicture}
              onChange={handleInputChange}
              required
              maxLength={50}
              placeholder="e.g. https://example.com/your-restaurant-image.jpg"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Provide a URL to your restaurant's logo or main image
            </p>
          </div>

          {/* Restaurant-specific fields start here */}

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
              Website URL
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              maxLength={50}
              placeholder="e.g. https://yourrestaurant.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum 50 characters
            </p>
          </div>

          <div>
            <label htmlFor="rib" className="block text-sm font-medium text-gray-700 mb-1">
              RIB (Relevé d'Identité Bancaire)*
            </label>
            <input
              type="text"
              id="rib"
              name="rib"
              value={formData.rib}
              onChange={handleInputChange}
              required
              maxLength={50}
              placeholder="e.g. FR7630006000011234567890189"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum 50 characters
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Your bank account information for receiving payments
            </p>
          </div>

          {/* Delivery Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="minimumPurchase" className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Order (€)*
              </label>
              <input
                type="number"
                id="minimumPurchase"
                name="minimumPurchase"
                value={formData.minimumPurchase}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="deliveryRadius" className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Radius (km)*
              </label>
              <input
                type="number"
                id="deliveryRadius"
                name="deliveryRadius"
                value={formData.deliveryRadius}
                onChange={handleInputChange}
                required
                min="0"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="averagePreparationTime" className="block text-sm font-medium text-gray-700 mb-1">
                Preparation Time*
              </label>
              <input
                type="text"
                id="averagePreparationTime"
                name="averagePreparationTime"
                value={formData.averagePreparationTime}
                onChange={handleInputChange}
                required
                placeholder="e.g. 20-30 min"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Cuisine Tags*
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              required
              placeholder="e.g. pizza, italian, pasta (comma separated)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter cuisine types separated by commas
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Link
              href="./"
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#4CAF50] hover:bg-[#388E3C] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
