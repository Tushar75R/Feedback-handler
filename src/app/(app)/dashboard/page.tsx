"use client";

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
import { useToast } from "@/hooks/use-toast";
import { Message, Url } from "@/model/user";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { PlusCircle, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
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
    const breakedUrl = session?.user.username;
    console.log(breakedUrl);
    const createdNewUrl = `${process.env.NEXT_PUBLIC_BASE_PROVIDE_URL}${breakedUrl}/${newUrl}`;
    try {
      const response = await axios.post<ApiResponse>("/api/add-new-url", {
        newUrl: createdNewUrl,
        endpoint: newUrl,
      });
      if (response.data.success) {
        fetchUrls();
        toast({
          title: "URL added",
          description: "The new URL has been successfully added.",
          variant: "success",
        });
        setNewUrl("");
        setIsDialogOpen(false);
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
      setIsDeleteDialogOpen(false);
    }
  };

  if (!session || !session.user) {
    return <div>Please login</div>;
  }

  return (
    <div className="p-6 w-full h-full bg-white rounded max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Open The Link In Browser</h2>
        {uiUrls?.length > 0 ? (
          uiUrls.map((url) => (
            <div className="flex items-center" key={url._id.toString()}>
              <input
                type="text"
                value={url.url}
                disabled
                className="input input-bordered bg-slate-200 rounded-xl text-center w-full p-2 mr-2 mb-2"
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

      <Separator className="my-4" />

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
