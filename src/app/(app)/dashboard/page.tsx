"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message, Url } from "@/model/user";
import { acceptMessagesSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, PlusCircle, RefreshCcw, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [uiUrls, setUiUrls] = useState<Url[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteUrl, setDeleteUrl] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const handlerDeleteMessage = (messageId: string) => {
    setMessages(
      messages.filter((message) => message._id.toString() !== messageId)
    );
  };

  const { data: session, status } = useSession();
  const form = useForm({
    resolver: zodResolver(acceptMessagesSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchUrls = useCallback(async () => {
    try {
      const response = await axios.get("/api/fetch-urls");
      setUiUrls(response.data.other.urls);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load URLs.",
        variant: "destructive",
      });
    }
  }, []);

  useEffect(() => {
    if (session && session.user) {
      fetchUrls();
    }
  }, [session]);
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
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

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.other.messages || []);
        toast({
          title: "Refreshed Messages",
          description: "Showing Latest Messages",
          variant: "success",
        });
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
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) {
      return;
    }
    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: response.data.message,
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
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copied",
      description: "URL copied to clipboard successfully.",
      variant: "success",
    });
  };

  const handlerNewUrlSubmit = async (e: any) => {
    e.preventDefault();
    if (newUrl.trim() === "") {
      toast({
        title: "Error",
        description: "URL cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    const breakedUrl = uiUrls[0].url.split("/");
    const createdNewUrl = `${process.env.NEXT_PUBLIC_BASE_PROVIDE_URL}${
      breakedUrl[breakedUrl.length - 1]
    }/${newUrl}`;
    try {
      const response = await axios.post<ApiResponse>("/api/add-new-url", {
        newUrl: createdNewUrl,
      });
      if (response.data.success) {
        fetchUrls();
        toast({
          title: "URL added",
          description: "The new URL has been successfully added.",
          variant: "success",
        });
        setNewUrl("");
        setIsDialogOpen(false); // Close the dialog
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to add URL",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUrl = (url: string) => {
    setDeleteUrl(url);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUrl = async () => {
    if (deleteUrl) {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-url/${deleteUrl}`
      );
      if (!response.data.success) {
        toast({
          title: "Url is not delete",
          description: response.data.message,
          variant: "destructive",
        });

        return;
      }
      fetchUrls();
      toast({
        title: "URL deleted",
        description: "The URL has been successfully removed.",
        variant: "success",
      });
      setIsDeleteDialogOpen(false); // Close the confirmation dialog
    }
  };

  if (!session || !session.user) {
    return <div>Please login</div>;
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        {uiUrls?.length > 0 ? (
          uiUrls.map((url) => (
            <div className="flex items-center" key={url._id.toString()}>
              <input
                type="text"
                value={url.url}
                disabled
                className="input input-bordered w-full p-2 mr-2 mb-2"
              />
              <Button onClick={() => copyToClipboard(url.url)} className="mr-2">
                Copy
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteUrl(url._id.toString())}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))
        ) : (
          <div>Nothing to show</div>
        )}
      </div>

      <div className="flex justify-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <PlusCircle className="h-8 w-8 p-1 hover:text-slate-500 hover:bg-slate-300 rounded-2xl" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create endpoint</DialogTitle>
              <DialogDescription>
                Add the endpoint you want to use in your new URL
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  URL-endpoint
                </Label>
                <Input
                  id="name"
                  value={newUrl}
                  className="col-span-3"
                  onChange={(e) => setNewUrl(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handlerNewUrlSubmit}>
                Create new
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

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

      <Separator className="my-4" />

      <h2 className="text-lg font-semibold mb-2">Messages</h2>
      {isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <div>
          {messages.map((message, i) => (
            <MessageCard
              key={i}
              message={message}
              onMessageDelete={handlerDeleteMessage}
            />
          ))}
        </div>
      )}

      <div className="flex justify-center">
        <Button onClick={() => fetchMessages(true)}>
          <RefreshCcw className="mr-2" />
          Refresh Messages
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this URL?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={confirmDeleteUrl}>
              Delete
            </Button>
            <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
