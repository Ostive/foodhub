"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateEstablishmentForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobilePhone: "",
    countryCode: "+33",
    address: "",
    floorSuite: "",
    establishmentName: "",
    brandName: "",
    businessType: "",
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

    try {
      console.log("Submitting establishment data:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push("/dashboard");
    } catch (error) {
      console.error("Error submitting form:", error);
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
                First Name*
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                placeholder="e.g. John"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              />
            </div>

            <div className="w-full">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name*
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                placeholder="e.g. Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              />
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Send by Email*
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
            <label htmlFor="mobilePhone" className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Phone Number*
            </label>
            <div className="flex space-x-2">
              <select
                id="countryCode"
                name="countryCode"
                value={formData.countryCode}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent max-w-[80px]"
              >
                <option value="+33">🇫🇷 +33</option>
              </select>
              <input
                type="tel"
                id="mobilePhone"
                name="mobilePhone"
                value={formData.mobilePhone}
                onChange={handleInputChange}
                required
                placeholder="e.g. 612345678"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Establishment Address*
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              placeholder="Start typing..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="floorSuite" className="block text-sm font-medium text-gray-700 mb-1">
              Floor/Suite (optional)
            </label>
            <input
              type="text"
              id="floorSuite"
              name="floorSuite"
              value={formData.floorSuite}
              onChange={handleInputChange}
              placeholder="e.g. 2nd floor, Suite 4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            />
          </div>

          {/* Establishment Info */}
          <div>
            <label htmlFor="establishmentName" className="block text-sm font-medium text-gray-700 mb-1">
              Establishment Name*
            </label>
            <input
              type="text"
              id="establishmentName"
              name="establishmentName"
              value={formData.establishmentName}
              onChange={handleInputChange}
              required
              placeholder="e.g. Sam's Pizza (123 Main Street)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-1">
              Brand Name*
            </label>
            <input
              type="text"
              id="brandName"
              name="brandName"
              value={formData.brandName}
              onChange={handleInputChange}
              required
              placeholder="e.g. Sam's Pizza"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              We will use this to organize shared info between establishments, such as menus.
            </p>
          </div>

          <div>
            <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-1">
              Business Type*
            </label>
            <select
              id="businessType"
              name="businessType"
              value={formData.businessType}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            >
              <option value="">Select...</option>
              <option value="restaurant">Restaurant</option>
              <option value="cafe">Cafe</option>
              <option value="bar">Bar</option>
              <option value="bakery">Bakery</option>
              <option value="food_truck">Food Truck</option>
              <option value="other">Other</option>
            </select>
          </div>

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
