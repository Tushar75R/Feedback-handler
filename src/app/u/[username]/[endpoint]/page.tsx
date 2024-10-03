"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptMessagesSchema } from "@/schemas/acceptMessageSchema";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

const Page = () => {
  const [url, setUrl] = useState("");
  const { toast } = useToast();
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(acceptMessagesSchema),
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlArray = currentUrl.split("/");

    const baseUrl = urlArray.slice(0, urlArray.length - 3).join("/") + "/";

    const newUrl =
      baseUrl +
      "api/" +
      urlArray[urlArray.length - 3] +
      "/" +
      urlArray[urlArray.length - 2] +
      "/" +
      urlArray[urlArray.length - 1];

    setUrl(newUrl);
  }, []);
  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
      console.log("here");
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: "response.data.message",
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to update message setting",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copied",
      description: "URL copied to clipboard successfully.",
      variant: "success",
    });
  };

  return (
    <>
      <div className="bg-slate-100 h-screen -mt-4 p-4 ">
        <div className="relative mt-4 flex justify-center items-center bg-gray-200 p-4">
          <div className="flex items-center">
            <div className="text-xl mr-6 border-white rounded-lg p-2 border-2">
              <p>{url}</p>
            </div>
            <Button onClick={copyToClipboard}>Copy</Button>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="mb-4">
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="ml-2">
            {isSwitchLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Accept Messages"
            )}
          </span>
        </div>
      </div>
    </>
  );
};

export default Page;
