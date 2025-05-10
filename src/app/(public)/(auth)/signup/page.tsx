"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Formik, Form, Field } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthApi } from "@/api/auth-api";
import { setCookie } from "cookies-next";
import { showError } from "@/error/handler";
import { toast } from "react-toastify";
import { signupSchema } from "@/validations/auth.validation";
import { Eye, EyeOff } from "lucide-react";
import { Icons } from "@/components/icons";

interface SignupFormValues {
  name: string;
  email: string;
  password: string;
}

export default function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const initialValues: SignupFormValues = {
    name: "",
    email: "",
    password: "",
  };

  const handleSubmit = async (
    values: SignupFormValues,
    { setSubmitting }: any
  ) => {
    try {
      const response = await AuthApi.register(values);
      if (response) {
        setCookie("token", response.token);
        toast.success("Welcome to Halvi Store! 🎉");
        router.refresh()
      }
    } catch (err) {
      showError(err);
    } finally {
      setSubmitting(false);
    }
  };


  const handleGoogleLogin = async () => {
    try {
      const response = await AuthApi.login({ provider: "google"});
      console.log(response);
    } catch (err) {
      showError(err);
    } finally {
      // setSubmitting(false);
    }
  };
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Start Selling with Halvi Store 🛍️</h2>
        <p className="text-gray-600 text-sm">
          Create your vendor account to open your store and start selling online.
        </p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={signupSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="grid gap-5">
            {/* Vendor Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Vendor Name</Label>
              <Field
                as={Input}
                id="name"
                name="name"
                placeholder="Your Store Name or Full Name"
              />
              {errors.name && touched.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Business Email</Label>
              <Field
                as={Input}
                id="email"
                name="email"
                type="email"
                placeholder="vendor@halvistore.com"
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label htmlFor="password">Create Password</Label>
              <div className="relative">
                <Field
                  as={Input}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && touched.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Setting up your store..." : "Create Vendor Account"}
            </Button>

<div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={handleGoogleLogin}
              >
                <Icons.google className="w-4 h-4 mr-2" />
                Google
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}