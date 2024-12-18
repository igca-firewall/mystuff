"use client"
import React, { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import "tailwindcss/tailwind.css"; // Ensure Tailwind CSS is set up in your project.
import { useScratchCards } from "@/lib/actions/scratchCard.actions";
import {createScratchCard} from "@/lib/actions/scratchCard.actions"
const ScratchCardOTP: React.FC = () => {
  const [code, setCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const handleSubmit = async () => {
     await createScratchCard()
    // if (code.trim().length !== 8 || !/^[0-9]{8}$/.test(code)) {
    //   setFeedback({ message: "Please enter a valid 8-digit scratch card code.", type: "error" });
    //   return;
    // }

    setIsLoading(true);
    setFeedback({ message: "Processing your scratch card...", type: "info" });

    try {
      const result = await useScratchCards({ code });

      if (result) {
        setFeedback({ message: "Scratch card validated and processed successfully!", type: "success" });
        setCode(""); // Reset the input field
      } else {
        setFeedback({ message: "Invalid or expired scratch card. Please try again.", type: "error" });
      }
    } catch (error) {
      setFeedback({ message: "An unexpected error occurred. Please try again.", type: "error" });
      console.error("Error in scratch card submission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen justify-items-center w-full bg-gray-100 px-32">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Scratch Card Verification</h2>

        {feedback && (
          <div
            className={`my-4 p-3 text-sm rounded-lg text-center 
              ${feedback.type === "success" ? "bg-green-100 text-green-800" : ""}
              ${feedback.type === "error" ? "bg-red-100 text-red-800" : ""}
              ${feedback.type === "info" ? "bg-blue-100 text-blue-800" : ""}`}
          >
            {feedback.message}
          </div>
        )}

        <InputOTP
          maxLength={8}
          value={code}
          onChange={(value) => setCode(value)}
        >
          <InputOTPGroup className="flex justify-between gap-2 w-full">
            {Array.from({ length: 8 }, (_, index) => (
              <InputOTPSlot
                key={index}
                className="w-16 h-16 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-200"
                index={index}
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <button
          onClick={handleSubmit}
          className={`w-full p-3 px-6 py-5 mt-4 text-white font-semibold rounded-full transition 
            ${isLoading ? "bg-purple-300" : "bg-purple-600 hover:bg-purple-700"}`}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Verify Code"}
        </button>
      </div>
    </div>
  );
};

export default ScratchCardOTP;