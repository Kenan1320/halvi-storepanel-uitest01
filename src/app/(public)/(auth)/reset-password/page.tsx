"use client"

import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthApi } from "@/api/auth-api";
import { showError } from "@/error/handler";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [otp, setOtp] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem('resetPasswordEmail');
    const storedOtp = localStorage.getItem('resetPasswordOtp');
    
    if (!storedEmail || !storedOtp) {
      router.push("/forgot-password");
    } else {
      setEmail(storedEmail);
      setOtp(storedOtp);
    }
  }, [router]);

  const initialValues: ResetPasswordFormValues = {
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = async (values: ResetPasswordFormValues, { setSubmitting }: any) => {
    try {
      if (!email || !otp) return;
      
      const response = await AuthApi.resetPassword(email, otp, values.password);
      if (response) {
        toast.success("Password reset successfully!");
        // Clear stored data
        localStorage.removeItem('resetPasswordEmail');
        localStorage.removeItem('resetPasswordOtp');
        router.push("/login");
      }
    } catch (err) {
      showError(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!email || !otp) return null;

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Reset Password</h2>
        <p className="text-gray-600">Create a new password for your account</p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={resetPasswordSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Field
                  as={Input}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && touched.password && (
                <div className="text-red-500 text-sm">{errors.password}</div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Field
                  as={Input}
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <div className="text-red-500 text-sm">{errors.confirmPassword}</div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
} 