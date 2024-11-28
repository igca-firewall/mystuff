import Image from "next/image";
import React, { useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an class",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  const selectedLabel = options.find((option) => option.value === value)?.label;

  return (
    <div className={`relative w-full ${className}`}>
      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
      >
        {selectedLabel || placeholder}
        <span className="float-right material-icons"><Image src="icons/arrow-down.svg" alt="" height={10} width={10}/> 
        </span>
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <ul className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto z-10">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className={`px-4 py-2 cursor-pointer hover:bg-purple-100 ${
                value === option.value ? "bg-purple-500 text-white" : ""
              }`}
            >
              {option.label}
            </li>
          ))}
          {options.length === 0 && (
            <li className="px-4 py-2 text-gray-500">No options available</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Select;
