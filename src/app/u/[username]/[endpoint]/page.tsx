"use client";
import React, { use, useCallback, useEffect, useState } from "react";
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
import { useSession } from "next-auth/react";
import { Message } from "@/model/user";
import MessageCard from "@/components/MessageCard";

const Page = () => {
  const { data: session, status } = useSession();
  const [url, setUrl] = useState("");
  const { toast } = useToast();
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const form = useForm({
    resolver: zodResolver(acceptMessagesSchema),
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");
  const currentUrl = window.location.href;
  const urlArray = currentUrl.split("/");

  useEffect(() => {
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
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        endpoint: urlArray[urlArray.length - 1],
      });
      setValue("acceptMessages", response.data.other.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message setting",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);
  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
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
  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>(
        urlArray.slice(0, urlArray.length - 3).join("/") +
          "/api/u/" +
          `${urlArray[urlArray.length - 2]}/${urlArray[urlArray.length - 1]}`
      );
      setMessages(response.data.other.messages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Failed to fetch messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setMessages]);
  const onMessageDelete = (messageId: string) => {
    setMessages(
      messages.filter((message) => message._id.toString() !== messageId)
    );
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copied",
      description: "URL copied to clipboard successfully.",
      variant: "success",
    });
  };
  useEffect(() => {
    fetchMessages();
  }, []);
  useEffect(() => {}, [session, fetchAcceptMessage, acceptMessages]);
  if (!session || !session.user) {
    return <div>Please login</div>;
  }
  return (
    <>
      <div className="bg-slate-100 min-h-screen -mt-4 p-4 ">
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
        <h2 className="text-lg font-semibold mb-2">Messages</h2>
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {messages.map((message) => (
              <MessageCard
                key={message._id.toString()}
                message={message}
                onMessageDelete={onMessageDelete}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Page;
