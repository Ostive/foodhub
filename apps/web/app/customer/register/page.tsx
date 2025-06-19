"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1 = form, 2 = success

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required");
      return false;
    }
    
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    
    if (!formData.agreeToTerms) {
      setError("You must agree to the terms and conditions");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success state
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, text: "", color: "bg-gray-200" };
    
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);
    const length = password.length;
    
    let strength = 0;
    if (length >= 8) strength += 1;
    if (hasLower && hasUpper) strength += 1;
    if (hasNumber) strength += 1;
    if (hasSpecial) strength += 1;
    
    let text = "";
    let color = "";
    
    switch (strength) {
      case 0:
        text = "Weak";
        color = "bg-red-500";
        break;
      case 1:
        text = "Fair";
        color = "bg-orange-500";
        break;
      case 2:
        text = "Good";
        color = "bg-yellow-500";
        break;
      case 3:
        text = "Strong";
        color = "bg-blue-500";
        break;
      case 4:
        text = "Very Strong";
        color = "bg-green-500";
        break;
      default:
        text = "";
        color = "bg-gray-200";
    }
    
    return { strength: (strength / 4) * 100, text, color };
  };
  
  const passwordStrength = getPasswordStrength(formData.password);

  if (step === 2) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-md">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Registration Successful!</h2>
            <p className="text-gray-600 mb-6">Your account has been created. You can now sign in with your credentials.</p>
            <Link 
              href="/customer/login" 
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-xs text-sm font-medium text-white bg-[#009E73] hover:bg-[#388e3c] focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-[#009E73] transition-colors"
            >
              Go to Login <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          <div className="text-center mb-8">
            <Link href="/customer" className="inline-block">
              <span className="text-4xl font-bold text-[#009E73]">FoodHUB</span>
            </Link>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create your account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/customer/login" className="font-medium text-[#009E73] hover:text-[#388e3c]">
                Sign in
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-xs placeholder-gray-400 focus:outline-hidden focus:ring-[#009E73] focus:border-[#009E73] sm:text-sm"
                    placeholder="John"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-xs placeholder-gray-400 focus:outline-hidden focus:ring-[#009E73] focus:border-[#009E73] sm:text-sm"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-xs placeholder-gray-400 focus:outline-hidden focus:ring-[#009E73] focus:border-[#009E73] sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl shadow-xs placeholder-gray-400 focus:outline-hidden focus:ring-[#009E73] focus:border-[#009E73] sm:text-sm"
                  placeholder="u2022u2022u2022u2022u2022u2022u2022u2022"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  )}
                </button>
              </div>
              
              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                    <div 
                      className={`h-1.5 rounded-full ${passwordStrength.color}`} 
                      style={{ width: `${passwordStrength.strength}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Password strength: <span className="font-medium">{passwordStrength.text}</span>
                  </p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl shadow-xs placeholder-gray-400 focus:outline-hidden focus:ring-[#009E73] focus:border-[#009E73] sm:text-sm"
                  placeholder="u2022u2022u2022u2022u2022u2022u2022u2022"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                required
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="h-4 w-4 text-[#009E73] focus:ring-[#009E73] border-gray-300 rounded"
              />
              <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
                I agree to the{" "}
                <Link href="#" className="font-medium text-[#009E73] hover:text-[#388e3c]">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="font-medium text-[#009E73] hover:text-[#388e3c]">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-xs text-sm font-medium text-white bg-[#009E73] hover:bg-[#388e3c] focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-[#009E73] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Create account <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-xl shadow-xs bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-[#009E73]"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                  <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.63 12 18.63C9.05 18.63 6.57 16.65 5.71 13.97H2.03V16.82C3.84 20.43 7.62 23 12 23Z" fill="#34A853"/>
                  <path d="M5.71 13.97C5.49 13.31 5.37 12.61 5.37 11.89C5.37 11.17 5.49 10.47 5.71 9.81V6.96H2.03C1.37 8.44 1 10.12 1 11.89C1 13.66 1.37 15.34 2.03 16.82L5.71 13.97Z" fill="#FBBC05"/>
                  <path d="M12 5.16C13.62 5.16 15.07 5.74 16.21 6.82L19.36 3.67C17.45 1.89 14.97 0.890015 12 0.890015C7.62 0.890015 3.84 3.46 2.03 7.07L5.71 9.92C6.57 7.24 9.05 5.16 12 5.16Z" fill="#EA4335"/>
                </svg>
                Google
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-xl shadow-xs bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-[#009E73]"
              >
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.203 2.397.1 2.65.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.934.359.31.678.92.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.418 20 10 20 4.477 15.523 0 10 0z" clipRule="evenodd" />
                </svg>
                GitHub
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden md:block md:flex-1 relative">
        <div className="absolute inset-0 bg-linear-to-r from-[#009E73]/90 to-[#2E7D32]/90 z-10"></div>
        <Image
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1740&auto=format&fit=crop"
          alt="Food delivery"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center z-20 p-12">
          <div className="max-w-md text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Join our food community today</h2>
            <p className="text-white/90 text-lg">
              Create an account to order delicious meals, save your favorite restaurants, and get exclusive offers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
