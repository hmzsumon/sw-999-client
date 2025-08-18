"use client";

import Checkbox from "@/components/register/Checkbox";
import FormInput from "@/components/register/FormInput";
import SocialButton from "@/components/register/SocialButton";
import Delimiter from "@/components/ui/Delimiter";
import Logo from "@/public/logo/logo.png";
import { useLoginUserMutation } from "@/redux/features/auth/authApi";
import { fetchBaseQueryError } from "@/redux/services/helpers";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaAngleLeft } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";

type FormState = {
  email: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormState, string>> & {
  acceptedTerms?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [loginUser, { isLoading, isError, isSuccess, error }] =
    useLoginUserMutation();

  const [receivePromo, setReceivePromo] = useState<boolean>(true);
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormState>({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const gradient = useMemo(
    () => ({
      background:
        "linear-gradient(180deg,#0b2e2e 0%, #0d3a36 50%, #0b2f2b 100%)",
    }),
    []
  );

  const handleChange = (field: keyof FormState, value: string) => {
    setFormData((p) => ({ ...p, [field]: value }));
    setFormErrors((p) => ({ ...p, [field]: "" }));
  };

  const validate = () => {
    const errs: FormErrors = {};
    if (!formData.email) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Invalid email format";

    if (!formData.password) {
      errs.password = "Password is required";
    } else if (formData.password.length < 6) {
      errs.password = "Minimum 6 characters";
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    console.log("Submitting form with data:", formData);

    try {
      await loginUser({
        ...formData,
        receivePromo,
        acceptedTerms,
      }).unwrap();
    } catch {
      // handled in useEffect
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Registration successful!");
      setFormData({
        email: "",
        password: "",
      });
      setAcceptedTerms(false);
      setReceivePromo(true);
      setFormErrors({});
      router.push("/dashboard");
    }
    if (isError) {
      toast.error((error as fetchBaseQueryError).data?.error);
    }
  }, [isSuccess, isError, error]);

  const isValid =
    !isLoading &&
    formData.email &&
    formData.password &&
    Object.values(formErrors).every((v) => !v);

  return (
    <div className="min-h-screen text-[#e6f2ef] relative" style={gradient}>
      <button
        onClick={() => router.back()}
        aria-label="Back"
        className="absolute left-3 top-3 p-2 rounded-full hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-[#0e6b5e] focus:ring-offset-2 focus:ring-offset-transparent"
      >
        <FaAngleLeft className="text-2xl hover:text-[#ffe600]" />
      </button>

      <div className="max-w-[360px] mx-auto px-5 py-6">
        <div className="pt-8 pb-4 text-center">
          <Link href="/">
            <Image
              src={Logo}
              alt="Logo"
              width={120}
              height={120}
              className="mx-auto mb-2"
            />
          </Link>
        </div>

        <h2 className="text-center text-2xl font-bold text-[#ffc403] mb-1">
          Login
        </h2>

        <Delimiter width="150px" />
        <p className="text-center text-sm text-[#b8d0cc] mb-5">
          No account yet?{" "}
          <Link href="/register" className="text-[#00b46f] underline">
            Register
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <FormInput
            name="email"
            type="email"
            placeholder="Enter Your Email"
            value={formData.email}
            onChange={(v) => handleChange("email", v)}
            onBlur={() =>
              setFormErrors((p) => ({
                ...p,
                email: formData.email ? "" : "Email is required",
              }))
            }
            error={formErrors.email || ""}
            icon={<MdOutlineMail />}
          />

          <FormInput
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(v) => handleChange("password", v)}
            onBlur={() =>
              setFormErrors((p) => ({
                ...p,
                password: formData.password ? "" : "Password is required",
              }))
            }
            error={formErrors.password || ""}
            secureToggle
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                className="fill-none"
              >
                <rect
                  x="3"
                  y="11"
                  width="18"
                  height="10"
                  rx="2"
                  stroke="#00b46f"
                  strokeWidth="1.6"
                />
                <path
                  d="M7 11V8a5 5 0 0 1 10 0v3"
                  stroke="#00b46f"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            }
          />

          <div className="flex items-center justify-between mt-2">
            <Checkbox
              checked={receivePromo}
              onChange={setReceivePromo}
              label={
                <span className="text-[13px] leading-5 text-[#e6f2ef]">
                  Remember
                </span>
              }
            />
            <Link
              href="/forgot-password"
              className="text-[#ffc403] text-sm underline ml-2"
            >
              <span>Forgot Password?</span>
            </Link>
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className="submit_btn w-full py-1"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="animate-spin"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#0b2e2e"
                    strokeWidth="3"
                    fill="none"
                    opacity="0.25"
                  />
                  <path
                    d="M22 12a10 10 0 0 1-10 10"
                    stroke="#0b2e2e"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
                Register
              </span>
            ) : (
              "Login"
            )}
          </button>

          <Delimiter width="350px" gap="22px" />

          <div className="flex items-center justify-center gap-6 pt-2">
            <SocialButton variant="facebook" />
            <SocialButton variant="google" />
          </div>
        </form>
      </div>
    </div>
  );
}
