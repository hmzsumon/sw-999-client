"use client";

type Props = {
  variant: "facebook" | "google";
  onClick?: () => void;
};

export default function SocialButton({ variant, onClick }: Props) {
  const isFb = variant === "facebook";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isFb ? "Continue with Facebook" : "Continue with Google"}
      className="w-12 h-12 rounded-full border border-[#0e6b5e] bg-[#07383a] flex items-center justify-center hover:opacity-90"
    >
      {isFb ? (
        <svg width="22" height="22" viewBox="0 0 24 24">
          <path
            fill="#1877F2"
            d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.093 10.125 24v-8.437H7.078v-3.49h3.047V9.356c0-3.007 1.792-4.669 4.533-4.669 1.313 0 2.686.235 2.686.235v2.953h-1.513c-1.49 0-1.953.927-1.953 1.878v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
          />
        </svg>
      ) : (
        <svg width="22" height="22" viewBox="0 0 24 24">
          <path
            d="M23.49 12.27c0-.82-.07-1.42-.22-2.04H12.24v3.71h6.44c-.13.92-.83 2.3-2.39 3.23l-.02.12 3.47 2.69.24.02c2.19-2.02 3.41-4.99 3.41-7.95z"
            fill="#4285F4"
          />
          <path
            d="M12.24 24c3.11 0 5.72-1.02 7.63-2.78l-3.64-2.83c-.97.62-2.27 1.05-3.99 1.05-3.05 0-5.64-2.02-6.56-4.83l-.11.01-3.56 2.76-.05.11C2.98 21.53 7.28 24 12.24 24z"
            fill="#34A853"
          />
          <path
            d="M5.68 14.61a7.33 7.33 0 0 1-.4-2.42c0-.84.15-1.66.39-2.42l-.01-.16L2.05 6.82l-.12.06A11.723 11.723 0 0 0 0 12.19c0 1.9.45 3.7 1.25 5.31l3.43-2.89z"
            fill="#FBBC05"
          />
          <path
            d="M12.24 4.74c2.16 0 3.61.92 4.45 1.7l3.25-3.18C17.94 1.25 15.35 0 12.24 0 7.28 0 2.98 2.47 1.13 6.31l3.54 2.96c.92-2.81 3.51-4.83 6.56-4.83z"
            fill="#EA4335"
          />
        </svg>
      )}
    </button>
  );
}
