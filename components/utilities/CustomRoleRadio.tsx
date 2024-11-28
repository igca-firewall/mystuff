import React from "react";
import { Controller } from "react-hook-form";

type RadioOption = {
  label: string;
  value: string;
  description?: string;
};

type CustomRadioProps = {
  options: RadioOption[];
  name: string;
  control: any; // From react-hook-form
  className?: string;
};

const CustomRadio: React.FC<CustomRadioProps> = ({ options, name, control, className }) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((option) => (
        <Controller
          key={option.value}
          name={name}
          control={control}
          render={({ field }) => (
            <label
              className={`flex items-center gap-2 px-3 py-2 border rounded-full cursor-pointer transition-all text-sm
                ${
                  field.value === option.value
                    ? "border-purple-500 bg-purple-100 dark:bg-purple-900 dark:border-purple-400"
                    : "border-gray-300 bg-white dark:bg-neutral-800 dark:border-neutral-600"
                } hover:shadow-md`}
            >
              <input
                type="radio"
                value={option.value}
                checked={field.value === option.value}
                onChange={(e) => field.onChange(e.target.value)}
                className="hidden"
              />
              <div
                className={`w-4 h-4 flex items-center justify-center rounded-full border transition-all
                  ${
                    field.value === option.value
                      ? "border-purple-500 bg-purple-500"
                      : "border-gray-300 bg-transparent"
                  }`}
              >
                {field.value === option.value && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-800 dark:text-neutral-200">{option.label}</span>
                {option.description && (
                  <span className="text-xs text-gray-500 dark:text-neutral-400">{option.description}</span>
                )}
              </div>
            </label>
          )}
        />
      ))}
    </div>
  );
};

export default CustomRadio;
