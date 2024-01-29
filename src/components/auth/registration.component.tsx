"use client";

import React, { useState } from "react";
import Image from "next/image";
import Logo from "public/images/logo.png";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { api } from "~/utils/api";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useDispatch } from "react-redux";
import { addNotification } from "../../context/slices/uiSlice";
import { toggleLoginView } from "../../context/slices/authSlice";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

const Registration = () => {
  const [email, setEmail] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const dispatch = useDispatch();

  const registrationMutation = api.user.register.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLoginClick = () => {
    dispatch(toggleLoginView(true));
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsRegistering(true); // Start loading

    registrationMutation.mutate(values, {
      onSuccess: () => {
        dispatch(
          addNotification({
            type: "success",
            message: "Check your email for a verification link.",
          }),
        );

        setIsRegistering(false); // Stop loading
      },
      onError: (error) => {
        dispatch(
          addNotification({
            type: "error",
            message: "There was a problem with your request.",
            error: error,
          }),
        );
      },
    });
  }

  const validateEmail = (email: string): boolean => {
    return formSchema.shape.email.safeParse(email).success;
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value;
    setEmail(newEmail);

    setShowPasswordInput(validateEmail(newEmail));

    form.setValue("email", newEmail);
  };

  return (
    <section className="grid grid-flow-col grid-cols-3 gap-0">
      <div className="col-span-1 h-screen bg-[url('/images/register.png')] bg-cover bg-center">
        <div className="h-full w-full backdrop-brightness-50 backdrop-sepia">
          <div className="flex h-full flex-col justify-between px-8 py-8">
            <Image
              src={Logo}
              alt="Reallist Journal Logo"
              width={75}
              height={75}
            />
            <p className="text-xs italic text-white">
              In the wandering whispers of the cosmos, we dance with shadows of
              ourselves, unearthing truths hidden in stardust. Each step, a
              silent conversation with eternity, where existential wonders bloom
              from the heart’s uncharted depths. Here, in the embrace of the
              infinite, we are both the seekers and the sought, unraveling the
              poetry of our own existence.
            </p>
          </div>
        </div>
      </div>
      <div className="col-span-2 h-screen bg-gray-200">
        <div className="grid h-full w-full px-8 py-8">
          <div className="">
            <button
              className="flex w-full flex-row-reverse text-xl"
              onClick={handleLoginClick}
            >
              Login
            </button>
          </div>
          <div className="grid h-2/4 text-center">
            <h1 className="text-4xl font-bold">Create an Account</h1>
            <h2 className="text-base text-gray-500">
              Enter your email below to create your account
            </h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder={showPasswordInput ? "" : "Your Email"}
                          {...field}
                          onChange={handleEmailChange}
                          className="mx-auto w-1/4"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div
                  className={`animate-in transition-all delay-100 ${showPasswordInput ? "" : "hidden"}`}
                >
                  {showPasswordInput && (
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Your Password"
                              {...field}
                              className="mx-auto w-1/4"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                <Button type="submit" disabled={isRegistering}>
                  {isRegistering ? (
                    <>
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Register"
                  )}
                </Button>
              </form>
            </Form>

            <p className="text-wrap text-xs">
              By clicking continue, you agree to our{" "}
              <span className="cursor-pointer underline">Terms of Service</span>{" "}
              and{" "}
              <span className="cursor-pointer underline">Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Registration;
