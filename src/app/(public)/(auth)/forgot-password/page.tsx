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

interface ForgotPasswordFormValues {
  email: string;
}

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

export default function ForgotPasswordPage() {
  const router = useRouter();

  const initialValues: ForgotPasswordFormValues = {
    email: "",
  };

  const handleSubmit = async (values: ForgotPasswordFormValues, { setSubmitting }: any) => {
    try {
      const response = await AuthApi.forgotPassword(values.email);
      if (response) {
        // Store email in localStorage
        localStorage.setItem('resetPasswordEmail', values.email);
        toast.success("OTP has been sent to your email!");
        router.push("/verify-otp");
      }
    } catch (err) {
      showError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Forgot Password?</h2>
        <p className="text-gray-600">Enter your email to receive a verification code</p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={forgotPasswordSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Field
                as={Input}
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
              />
              {errors.email && touched.email && (
                <div className="text-red-500 text-sm">{errors.email}</div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending OTP..." : "Send OTP"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
} 