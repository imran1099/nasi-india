import React from "react";

export interface FormFieldProps {
  label: string;
  id: string;
  name: string;
  type?: "text" | "email" | "tel" | "password" | "url" | "textarea" | "select";
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  options?: Array<{ label: string; value: string }>;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  className?: string;
  autoComplete?: string;
  icon?: React.ReactNode;
}

export function FormField({
  label,
  id,
  name,
  type = "text",
  placeholder,
  helperText,
  errorMessage,
  required = false,
  disabled = false,
  rows = 4,
  options = [],
  value,
  defaultValue,
  onChange,
  className = "",
  autoComplete,
  icon,
}: FormFieldProps) {
  const helperId = helperText ? `${id}-helper` : undefined;
  const errorId = errorMessage ? `${id}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;

  const baseInputStyles =
    "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-forest-950 placeholder:text-forest-400 shadow-2xs transition-all duration-150 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-1 disabled:bg-sand-100 disabled:cursor-not-allowed";

  const stateStyles = errorMessage
    ? "border-rose-400 focus-visible:ring-rose-600 focus-visible:border-rose-600 bg-rose-50/20"
    : "border-sand-300 hover:border-forest-400 focus-visible:ring-forest-800 focus-visible:border-forest-800 focus-visible:bg-white";

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label
        htmlFor={id}
        className="text-sm font-medium text-forest-900 flex items-center gap-1"
      >
        <span>{label}</span>
        {required && <span className="text-red-600 font-bold" aria-hidden="true">*</span>}
      </label>

      {type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          aria-invalid={!!errorMessage}
          aria-describedby={describedBy}
          className={`${baseInputStyles} ${stateStyles} resize-y`}
        />
      ) : type === "select" ? (
        <select
          id={id}
          name={name}
          required={required}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          aria-invalid={!!errorMessage}
          aria-describedby={describedBy}
          className={`${baseInputStyles} ${stateStyles}`}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            type={type}
            id={id}
            name={name}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            autoComplete={autoComplete}
            aria-invalid={!!errorMessage}
            aria-describedby={describedBy}
            className={`${baseInputStyles} ${stateStyles} ${icon ? "pl-10" : ""}`}
          />
        </div>
      )}

      {helperText && !errorMessage && (
        <p id={helperId} className="text-xs text-forest-700/70">
          {helperText}
        </p>
      )}

      {errorMessage && (
        <p id={errorId} className="text-xs text-red-600 font-medium" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
