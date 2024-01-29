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
import { useToast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import { useDispatch } from "react-redux";
import { addNotification } from "../../context/slices/uiSlice";
import { setUserStatus } from "../../context/slices/authSlice";

const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" }),
});

const Verification = () => {
  const finalizationMutation = api.user.finalizeAccount.useMutation();
  const dispatch = useDispatch();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const username = values.username;

    finalizationMutation.mutate(
      { username },
      {
        onSuccess: async () => {
          dispatch(
            addNotification({
              type: "success",
            }),
          );
          dispatch(setUserStatus("FULLY_AUTHENTICATED"));
        },
        onError: (error) => {
          dispatch(
            addNotification({
              type: "error",
              message: error.message,
              error: error,
            }),
          );
        },
      },
    );
  }

  return (
    <section className="grid grid-flow-col grid-cols-3 gap-0">
      <div className="col-span-1 h-screen bg-[url('/images/username.png')] bg-cover bg-center">
        <div className="h-full w-full backdrop-brightness-50 backdrop-sepia">
          <div className="flex h-full flex-col justify-between px-8 py-8">
            <Image
              src={Logo}
              alt="Reallist Journal Logo"
              width={75}
              height={75}
            />
            <p className="text-xs italic text-white">
              Within the whispers of the void, our essence flickers—a silent
              pulse in the cosmic dance. It's a clandestine waltz of energy,
              where consciousness weaves through the tapestry of the unseen. In
              this labyrinth of stars and shadows, our inner fire kindles,
              speaking in the language of light and echoes. Here, we are
              fragments and whole, entwined in the universe's enigmatic embrace,
              our existence a subtle symphony in the grand orchestra of being.
            </p>
          </div>
        </div>
      </div>
      <div className="col-span-2 h-screen bg-gray-200">
        <div className="grid h-full w-full px-8 py-8">
          <div className=""></div>
          <div className="grid h-2/4 text-center">
            <h1 className="text-4xl font-bold">Set-up your username</h1>
            <h2 className="text-base text-gray-500">
              Enter your username below to finalize your account.
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
                          placeholder={"Your username"}
                          {...field}
                          className="mx-auto w-1/4"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">Continue</Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Verification;
