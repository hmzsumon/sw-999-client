"use client";

import React from "react";

type Props = {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: React.ReactNode;
  error?: string | null;
};

export default function Checkbox({ checked, onChange, label, error }: Props) {
  return (
    <div>
      <label className="flex items-start gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-[2px] w-5 h-5 rounded-full border-2 border-[#0e6b5e] bg-[#07383a] accent-[#00b46f] outline-none"
        />
        <span>{label}</span>
      </label>
      {error && (
        <p className="mt-1 text-sm text-red-300" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
