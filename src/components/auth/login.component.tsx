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
import { useDispatch, useSelector } from "react-redux";
import {
  setIsAuthenticated,
  setUserDetails,
  setUserStatus,
  toggleLoginView,
} from "../../context/slices/authSlice";
import { addNotification } from "../../context/slices/uiSlice";
import { RootState } from "../../context/store/store";

const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

const Login = () => {
  const [username, setUsername] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const dispatch = useDispatch();
  const { userStatus, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  const loginMutation = api.user.login.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleRegistrationClick = () => {
    dispatch(toggleLoginView(false));
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoggingIn(true); // Start loading

    loginMutation.mutate(values, {
      onSuccess: () => {
        dispatch(
          addNotification({
            type: "success",
          }),
        );
        dispatch(setIsAuthenticated(true));
        dispatch(setUserStatus("FULLY_AUTHENTICATED"));

        setIsLoggingIn(false); // Stop loading
      },
      onError: (error) => {
        dispatch(
          addNotification({
            type: "error",
            message: error.message,
            error: error,
          }),
        );
        setIsLoggingIn(false); // Stop loading
      },
    });
  }

  const validateUsername = (usrname: string): boolean => {
    return formSchema.shape.username.safeParse(usrname).success;
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const username = event.target.value;
    setUsername(username);

    setShowPasswordInput(validateUsername(username));

    form.setValue("username", username);
  };

  const showRegisterButton = !isAuthenticated && userStatus === "UNVERIFIED";

  return (
    <section className="grid grid-flow-col grid-cols-3 gap-0">
      <div className="col-span-1 h-screen bg-[url('/images/login.png')] bg-cover bg-center">
        <div className="h-full w-full backdrop-brightness-50 backdrop-sepia">
          <div className="flex h-full flex-col justify-between px-8 py-8">
            <Image
              src={Logo}
              alt="Reallist Journal Logo"
              width={75}
              height={75}
            />
            <p className="text-xs italic text-white">
              Nature's whisper, in the rustling leaves and murmuring brooks,
              speaks a cryptic language to our soul. Here, in this unspoken
              communion, we find our essence mirrored, a hidden dialogue with
              the earth. In this intimate dance, we are both a mystery and a
              revelation, intertwined with the wild's silent wisdom.
            </p>
          </div>
        </div>
      </div>
      <div className="col-span-2 h-screen bg-gray-200">
        <div className="grid h-full w-full px-8 py-8">
          <div className="">
            {showRegisterButton && (
              <button
                className="flex w-full flex-row-reverse text-xl"
                onClick={handleRegistrationClick}
              >
                Register
              </button>
            )}
          </div>
          <div className="grid h-2/4 text-center">
            <h1 className="text-4xl font-bold">Log-in into your account</h1>
            <h2 className="text-base text-gray-500">
              Enter your username below to access your account
            </h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder={showPasswordInput ? "" : "Your Username"}
                          {...field}
                          onChange={handleUsernameChange}
                          className="mx-auto w-1/4"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div
                  className={`transition-all delay-100 animate-in ${showPasswordInput ? "" : "hidden"}`}
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
                <Button type="submit" disabled={isLoggingIn}>
                  {isLoggingIn ? (
                    <>
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
