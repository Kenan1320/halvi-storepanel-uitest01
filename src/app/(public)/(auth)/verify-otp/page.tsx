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
import { useEffect, useState } from "react";

interface VerifyOtpFormValues {
  otp: string;
}

const otpSchema = Yup.object().shape({
  otp: Yup.string()
    .required("OTP is required")
    .matches(/^\d{6}$/, "OTP must be 6 digits"),
});

export default function VerifyOtpPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem('resetPasswordEmail');
    if (!storedEmail) {
      router.push("/forgot-password");
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  const initialValues: VerifyOtpFormValues = {
    otp: "",
  };

  const handleSubmit = async (values: VerifyOtpFormValues, { setSubmitting }: any) => {
    try {
      if (!email) return;
      
      const response = await AuthApi.verifyOtp(email, values.otp);
      if (response) {
        toast.success("OTP verified successfully!");
        // Store OTP in localStorage
        localStorage.setItem('resetPasswordOtp', values.otp);
        router.push("/reset-password");
      }
    } catch (err) {
      showError(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!email) return null;

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Verify OTP</h2>
        <p className="text-gray-600">Enter the 6-digit code sent to your email</p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={otpSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Field
                as={Input}
                id="otp"
                name="otp"
                type="text"
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
              {errors.otp && touched.otp && (
                <div className="text-red-500 text-sm">{errors.otp}</div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Verifying..." : "Verify OTP"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
} 