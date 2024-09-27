import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/user";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Separator } from "@radix-ui/react-separator";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const { toast } = useToast();
  const Iso = new Date(message.createdAt).toISOString();
  const time = Iso.split("T")[1].split(".")[0];
  const date = Iso.split("T")[0];

  const handleDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponse>(
      `/api/delete-message/${message._id}`
    );
    toast({
      title: response.data.message,
    });
    onMessageDelete(message._id.toString());
  };

  return (
    <Card className="relative flex flex-col space-y-2 p-5 border border-gray-200 shadow-md rounded-md">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-lg font-bold">
          {message?.title || "Untitled Message"}
        </CardTitle>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="text-red-600 absolute top-0 right-0 m-4 hover:text-red-800 p-2 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently delete the message and cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>

      {/* Content */}
      <CardContent>
        <CardDescription className="mb-2 text-gray-700">
          <strong>Content:</strong> {message.content}
        </CardDescription>

        <CardDescription className="mb-2 text-gray-700">
          <strong>Email:</strong> {message.email}
        </CardDescription>

        {/* Timestamp */}
        <Separator className="my-4" />
        <div className="text-sm text-gray-500">
          <span>
            <strong>Date:</strong> {date}
          </span>
          <span className="ml-4">
            <strong>Time:</strong> {time}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageCard;
