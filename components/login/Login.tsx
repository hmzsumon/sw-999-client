"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginUserMutation } from "@/redux/features/auth/authApi";
import { Toaster, toast } from 'react-hot-toast';
import { fetchBaseQueryError } from '@/redux/services/helpers';

export default function Login() {
  const router = useRouter();
  
  const [loginUser, { isLoading , error}] = useLoginUserMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      
        const data = {
            email,
            password
        }

        const res = await loginUser(data).unwrap();

      router.push("/dashboard");
    } catch (err: any) {
        const errorMessage = err?.data?.message || err?.error || "Login failed. Please try again.";
        toast.error(errorMessage);
        console.error("Login error:", errorMessage);
      
    }
  };

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-1 text-2xl font-bold">Welcome back</h1>
        <p className="mb-6 text-sm text-gray-600">Sign in to your account</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-gray-500"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-sm outline-none transition focus:border-gray-500"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-0 mr-2 inline-flex items-center rounded-md px-2 text-xs text-gray-600 hover:bg-gray-100"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          By signing in you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </main>
  );
}