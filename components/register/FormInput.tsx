"use client";

import React, { useState } from "react";

type Props = {
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string | null;
  icon?: React.ReactNode;
  secureToggle?: boolean;
  isEdit?: boolean;
};

export default function FormInput({
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  icon,
  secureToggle,
  isEdit,
}: Props) {
  const [show, setShow] = useState(false);
  const realType = secureToggle ? (show ? "text" : "password") : type;

  return (
    <div>
      <div className="from_input flex items-center   px-2 focus-within:ring-2 ">
        <div className="pl-1 pr-1">{icon}</div>
        <input
          name={name}
          type={realType}
          aria-invalid={!!error}
          className="flex-1 bg-transparent border-none outline-none text-sm disabled:cursor-not-allowed disabled:text-gray-500 text-gray-200 placeholder:text-gray-400 focus:ring-0"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={isEdit ? true : false}
          autoComplete="off"
        />
        {secureToggle && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Hide password" : "Show password"}
            className="p-2 rounded-md hover:bg-black/10 focus:outline-none "
          >
            {show ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                className="fill-none"
              >
                <path
                  d="M2 2l20 20"
                  stroke="#e6f2ef"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M12 5c5 0 9 5 9 7s-4 7-9 7-9-5-9-7c0-.7.4-1.8 1.2-3"
                  stroke="#e6f2ef"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                className="fill-none"
              >
                <path
                  d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
                  stroke="#e6f2ef"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="#e6f2ef"
                  strokeWidth="1.8"
                />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-300" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
