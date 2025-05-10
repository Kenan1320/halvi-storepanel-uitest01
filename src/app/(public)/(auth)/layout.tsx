'use client';

import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/' || pathname === '/login';
  const isSignupPage = pathname === '/signup';
  const isForgotPasswordPage = pathname === '/forgot-password';
  const isResetPasswordPage = pathname === '/reset-password';
  const isVerifyOtpPage = pathname === '/verify-otp';

  const imageSrc = isLoginPage ? 'https://images.unsplash.com/photo-1601598851547-4302969d0614' : 
                  isSignupPage ? 'https://images.unsplash.com/photo-1472851294608-062f824d29cc' : 
                  isForgotPasswordPage ? '/auth/forgot-password-bg.png' : 
                  isResetPasswordPage ? '/auth/reset-password-bg.jpg' : 
                  isVerifyOtpPage ? '/auth/verify-otp-bg.jpg' : 
                  'https://images.unsplash.com/photo-1601598851547-4302969d0614';

  const altText = isLoginPage ? 'Vendor login background' : 
                 isSignupPage ? 'Vendor signup background' : 
                 isForgotPasswordPage ? 'Forgot password background' : 
                 isResetPasswordPage ? 'Reset password background' : 
                 isVerifyOtpPage ? 'Verify OTP background' : 
                 'Halvi Store background';

  const getOverlayContent = () => {
    if (isLoginPage) {
      return {
        title: 'Welcome Back to Halvi Store! 🛍️',
        subtitle: 'Manage your stores and products seamlessly',
        description: 'Login to start selling smarter and faster.'
      };
    }
    if (isSignupPage) {
      return {
        title: 'Start Selling with Halvi Store! 🛒',
        subtitle: 'Create your vendor account in minutes',
        description: 'Open your store, list products, and grow your business.'
      };
    }
    if (isForgotPasswordPage) {
      return {
        title: 'Trouble Logging In? 🔐',
        subtitle: 'Let’s help you reset your password',
        description: 'We’ll get you back to selling in no time.'
      };
    }
    if (isVerifyOtpPage) {
      return {
        title: 'Verify Your Email 🔎',
        subtitle: 'Secure your vendor account',
        description: 'Enter the OTP sent to your email to continue.'
      };
    }
    if (isResetPasswordPage) {
      return {
        title: 'Reset Your Password 🔁',
        subtitle: 'Choose a new password for your account',
        description: 'Security is important — set a strong one!'
      };
    }
    return {
      title: 'Welcome to Halvi Store! 🌟',
      subtitle: 'Empowering vendors, one store at a time',
      description: 'Manage everything from product listings to orders in one place.'
    };
  };

  const content = getOverlayContent();

  return (
    <div className="min-h-screen flex">
      {/* Left side with dynamic image */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/80 z-10" />
        <Image
          src={imageSrc}
          alt={altText}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center p-12 z-20">
          <div className="text-white text-center">
            <h1 className="text-4xl font-bold mb-4">
              {content.title}
            </h1>
            <p className="text-xl opacity-90 mb-4">
              {content.subtitle}
            </p>
            <p className="text-lg opacity-80">
              {content.description}
            </p>  
          </div>
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Top row with back button and auth link */}
        <div className="p-6 flex justify-between items-center mt-4 text-sm">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back
          </button>
          {isLoginPage && (
            <div className='flex items-center gap-1'>
              Don&apos;t have a vendor account?{" "}
              <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                Get started now!
              </Link>
            </div>
          )}
          {isSignupPage && (
            <div className='flex items-center gap-1'>
              Already selling on Halvi?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Login here
              </Link>
            </div>
          )}
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center px-6 w-full">
          {children}
        </div>
      </div>
    </div>
  );
}