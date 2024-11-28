"use client";

import Link from "next/link";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import {
  authFormSchema,
  // storeSessionInLocalStorage,
  generateAvatar,
  storeSessionInLocalStorage,
} from "@/lib/utils";

import CustomFormField, { FormFieldType } from "../utilities/CustomInput";
import Loader from "../utilities/Loader";
import { useSignIn, useSignUp } from "@/lib/react-query/queriesAndMutation";
// import { useUserContext } from "@/context/AuthContext";
import { redirect, useRouter } from "next/navigation";
import { createScratchCard } from "@/lib/actions/scratchCard.actions";
// import { createSubject } from "@/lib/actions/subjects.actions";
import CustomRadio from "../utilities/CustomRoleRadio";

const AuthForm = ({
  type,
  role,
}: {
  type: string;
  role: "admin" | "teacher" | "student";
}) => {
  // const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // const { checkAuthUser } = useUserContext();
  const formSchema = authFormSchema(type, role);
  const { mutateAsync: createUser } = useSignUp();
  const { mutateAsync: signUser } = useSignIn();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "student", // default role
    },
  });
  const selectedRole = form.watch("role");
  const router = useRouter();
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    console.log("Auth data ", data);

    // const isLoggedIn = await checkAuthUser();
    try {
      if (type === "sign-up") {
        const avatarUrl = generateAvatar(
          data.firstName || data.lastName || "Administrator"
        );

        const userData = {
          email: data.email,
          password: data.password,
          role: data.role!,
          image: avatarUrl!,
          name: `${data.firstName!} ${data.lastName!}` || "Administrator",
          ...(data.role === "admin" && {
            adminCode: data.adminCode!,

            adminId: data.adminId!, // Generate ID dynamically
            adminContact: data.adminContact!,
          }),
          ...(data.role === "teacher" && {
            subject: data.subject!,
            phone: data.phone!,
          }),
          ...(data.role === "student" && {
            dob: data.dob!,
            guardianContact: data.guardianContact!,
          }),
        };
        try {
          console.log("userData", userData);
          const newUser = await createUser(userData);
          const scratchCard = await createScratchCard();
          // const subject = await createSubject({
          //   name: "English",
          //   classRoom: ["ss1", "ss2"],
          // });
          console.log(scratchCard, "thats scratch card");
          setUser(newUser);
          form.reset();
          storeSessionInLocalStorage()
          redirect("/");
        } catch (error) {
          console.error("Sign-up failed:", error);
        }
      } else if (type === "sign-in") {
        const response = await signUser({
          email: data.email,
          password: data.password,
        });
        if (!response) {
          return null;
        } else {
          form.reset();
          storeSessionInLocalStorage()
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderRoleSpecificFields = () => {
    switch (selectedRole) {
      case "admin":
        return (
          <>
            {" "}
            <div className="flex gap-3 items-center">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="firstName"
                label="First Name"
                placeholder="Enter your first name."
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="lastName"
                label="Last Name"
                placeholder="Enter your last name."
              />
            </div>
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="adminContact"
              label="Admin Contact"
              placeholder="Enter admin contact number."
            />
            <div className="flex gap-3 items-center">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="adminCode"
                label="Admin Code"
                placeholder="Enter your admin code."
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="adminId"
                label="Admin ID"
                placeholder="Enter your admin ID."
              />
            </div>
          </>
        );
      case "teacher":
        return (
          <>
            <div className="flex gap-3 items-center">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="firstName"
                label="First Name"
                placeholder="Enter your first name."
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="lastName"
                label="Last Name"
                placeholder="Enter your last name."
              />
            </div>

            <div className="flex gap-3 items-center">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="subject"
                label="Subject Specialization"
                placeholder="Enter your subject."
              />{" "}
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="phone"
                label="Phone"
                placeholder="Enter your phone number."
              />
            </div>
          </>
        );
      case "student":
        return (
          <>
            <div className="flex gap-3 items-center">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="firstName"
                label="First Name"
                placeholder="Enter your first name."
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="lastName"
                label="Last Name"
                placeholder="Enter your last name."
              />
            </div>
            <div className="flex gap-3 items-center">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="dob"
                label="Date of Birth"
                placeholder="DD-MM-YYYY"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="guardianContact"
                label="Guardian Contact"
                placeholder="+234 901 234 56"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <section className="auth-form min-h-screen flex flex-col justify-start">
      <header className="flex flex-col gap-5 md:gap-8">
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900 dark:text-neutral-300">
            {type === "sign-in" ? "Sign In" : "Sign Up"}
          </h1>
          <p className="text-16 font-normal text-gray-600 dark:text-neutral-300">
            Please enter your details.
          </p>
        </div>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {type === "sign-up" && (
            <>
              <CustomRadio
                name="role"
                control={form.control}
                options={[
                  { label: "Admin", value: "admin" },
                  { label: "Teacher", value: "teacher" },
                  { label: "Student", value: "student" },
                ]}
                className="space-y-2"
              />
              {renderRoleSpecificFields()}
            </>
          )}
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email"
            placeholder="user@example.com."
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="password"
            label="Password"
            placeholder="Enter your password."
          />
          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center px-8 py-8 text-lg font-semibold text-white bg-purple-600 rounded-full hover:bg-purple-700 focus:outline-none"
            >
              {isLoading ? (
                <div className="items-center flex gap-4">
                  {" "}
                  <Loader /> Loading...
                </div>
              ) : type === "sign-in" ? (
                "Sign In"
              ) : (
                "Sign Up"
              )}
            </Button>
          </div>
        </form>
        <footer className="flex justify-center gap-1">
          <p className="text-14 font-normal text-gray-600 dark:text-neutral-200">
            {type === "sign-in"
              ? "Don't have an account?"
              : "Already have an account?"}
          </p>
          <Link
            href={type === "sign-in" ? "/sign-up" : "/sign-in"}
            className="text-purple-600 underline"
          >
            {type === "sign-in" ? "Sign up." : "Sign in."}
          </Link>
        </footer>{" "}
        <div className="flex-col bottom-0 gap-3 mt-2 mb-0 sticky items-center justify-center text-center">
          <p className="flex text-center items-center justify-center  text-gray-400 dark:text-neutral-500 text-sm font-nunito">
            By Signing in, you accept our{" "}
          </p>
          <Link href="/privacy-policy" className="">
            <p className="flex text-center text-gray-400 items-center justify-center dark:text-neutral-500 text-sm underline font-nunito">
              Privacy Policy and Terms of Use.
            </p>
          </Link>
        </div>
      </Form>
    </section>
  );
};

export default AuthForm;
