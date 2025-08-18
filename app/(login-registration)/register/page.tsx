"use client";

import CaptchaBox from "@/components/register/CaptchaBox";
import Checkbox from "@/components/register/Checkbox";
import FormInput from "@/components/register/FormInput";
import SocialButton from "@/components/register/SocialButton";
import Delimiter from "@/components/ui/Delimiter";
import Logo from "@/public/logo/logo.png";
import { useRegisterUserMutation } from "@/redux/features/auth/authApi";
import { fetchBaseQueryError } from "@/redux/services/helpers";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaAngleLeft, FaUser } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  referralCode: string;
  captcha: string;
};

type FormErrors = Partial<Record<keyof FormState, string>> & {
  acceptedTerms?: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [registerUser, { isLoading, isError, isSuccess, error }] =
    useRegisterUserMutation();

  const [receivePromo, setReceivePromo] = useState<boolean>(true);
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
    captcha: "",
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
    if (!formData.fullName) errs.fullName = "Full name is required";
    if (!formData.email) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Invalid email format";

    const phoneSanitized = formData.phone.replace(/[()\s-]/g, "");
    if (!phoneSanitized) errs.phone = "Phone number is required";
    else if (!/^\+?\d{10,14}$/.test(phoneSanitized))
      errs.phone = "Enter a valid phone (10–14 digits)";

    if (!formData.password) {
      errs.password = "Password is required";
    } else if (formData.password.length < 6) {
      errs.password = "Minimum 6 characters";
    }

    if (!formData.confirmPassword)
      errs.confirmPassword = "Please confirm your password";
    else if (formData.confirmPassword !== formData.password)
      errs.confirmPassword = "Passwords do not match";

    if (!formData.captcha) errs.captcha = "Captcha is required";
    else if (formData.captcha.trim() !== "22277")
      errs.captcha = "Captcha does not match";

    if (!acceptedTerms) errs.acceptedTerms = "You must accept the terms";

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    console.log("Submitting form with data:", formData);

    try {
      await registerUser({
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
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        referralCode: "",
        captcha: "",
      });
      setAcceptedTerms(false);
      setReceivePromo(true);
      setFormErrors({});
      router.push("/login");
    }
    if (isError) {
      toast.error((error as fetchBaseQueryError).data?.error);
    }
  }, [isSuccess, isError, error]);

  const isValid =
    !isLoading &&
    formData.phone &&
    formData.password &&
    formData.confirmPassword &&
    formData.captcha &&
    acceptedTerms &&
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
        {/* Start Logo */}
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
          Register
        </h2>
        <Delimiter width="150px" />
        <p className="text-center text-sm text-[#b8d0cc] mb-5">
          Already have an account?{" "}
          <Link href="/login" className="text-[#00b46f] underline">
            Login
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <FormInput
            name="fullName"
            type="text"
            placeholder="Enter Your Full Name"
            value={formData.fullName}
            onChange={(v) => handleChange("fullName", v)}
            onBlur={() =>
              setFormErrors((p) => ({
                ...p,
                fullName: formData.fullName ? "" : "Full name is required",
              }))
            }
            error={formErrors.fullName || ""}
            icon={<FaUser />}
          />

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
            name="phone"
            type="tel"
            placeholder="Phone number"
            value={formData.phone}
            onChange={(v) => handleChange("phone", v)}
            onBlur={() =>
              setFormErrors((p) => ({
                ...p,
                phone: formData.phone ? "" : "Phone number is required",
              }))
            }
            error={formErrors.phone || ""}
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                className="fill-none"
              >
                <path
                  d="M22 16.92v2a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.11 3.1 2 2 0 0 1 4.1 1h2a2 2 0 0 1 2 1.72c.12.9.32 1.77.59 2.61a2 2 0 0 1-.45 2.11L7 8.6a16 16 0 0 0 6 6l1.16-1.24a2 2 0 0 1 2.11-.45c.84.27 1.71.47 2.61.59A2 2 0 0 1 22 16.92z"
                  stroke="#00b46f"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
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

          <FormInput
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={(v) => handleChange("confirmPassword", v)}
            onBlur={() =>
              setFormErrors((p) => ({
                ...p,
                confirmPassword:
                  formData.confirmPassword === formData.password
                    ? ""
                    : "Passwords do not match",
              }))
            }
            error={formErrors.confirmPassword || ""}
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
          {/* Start Captcha */}
          <div className="relative">
            <div className="from_input flex items-center justify-between px-2 py-1">
              <div className="pl-1 pr-1">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  className="fill-none"
                >
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="16"
                    rx="2"
                    stroke="#00b46f"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M7 9h10M7 13h6"
                    stroke="#00b46f"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <input
                name="captcha"
                aria-invalid={!!formErrors.captcha}
                className="flex-1 bg-transparent outline-none text-[15px] placeholder-[#b8d0cc] caret-[#e6f2ef] selection:bg-transparent"
                placeholder="Enter a captcha"
                value={formData.captcha}
                onChange={(e) => handleChange("captcha", e.target.value)}
                onBlur={() =>
                  setFormErrors((p) => ({
                    ...p,
                    captcha: formData.captcha ? "" : "Captcha is required",
                  }))
                }
              />
              <CaptchaBox />
            </div>
            {formErrors.captcha && (
              <p className="mt-1 text-sm text-red-300" role="alert">
                {formErrors.captcha}
              </p>
            )}
          </div>

          <Checkbox
            checked={acceptedTerms}
            onChange={(v) => {
              setAcceptedTerms(v);
              setFormErrors((p) => ({ ...p, acceptedTerms: "" }));
            }}
            label={
              <span className="text-[13px] leading-5 text-[#e6f2ef]">
                I am over 18 years of age and have read and accepted{" "}
                <span className="text-[#ffd262]">Terms &amp; Conditions</span>,
                <span className="text-[#ffd262]"> Privacy Policy</span> &amp;{" "}
                <span className="text-[#ffd262]">Betting Rules</span> as
                published on the site.
              </span>
            }
            error={formErrors.acceptedTerms}
          />

          <Checkbox
            checked={receivePromo}
            onChange={setReceivePromo}
            label={
              <span className="text-[13px] leading-5 text-[#e6f2ef]">
                I would like to receive details of special offers, free bets and
                other promotions.
              </span>
            }
          />

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
              "Register"
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
