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

  // Determine card size dynamically based on content length (e.g., larger for longer messages)
  const cardSize =
    message.content && message.content.length > 150
      ? "row-span-2"
      : "row-span-1";

  return (
    <Card
      className={`relative flex flex-col space-y-2 p-5 border-2 border-gray-200 shadow-md rounded-xl h-auto ${cardSize}`}
    >
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-lg font-bold text-white">
          {message?.title || "Untitled Message"}
        </CardTitle>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="text-red-950 bg-gray-300 absolute top-0 right-0 m-4 hover:text-red-600 hover:bg-slate-400  p-2 rounded-full">
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
        <CardDescription className="mb-2 text-white">
          <strong>Content:</strong> {message.content}
        </CardDescription>

        <CardDescription className="mb-2 text-white">
          <strong>Email:</strong> {message.email}
        </CardDescription>

        {/* Timestamp */}
        <Separator className="my-4" />
        <div className="text-sm text-white">
          <span>
            <strong>Date:</strong> {date}
          </span>
          <br />
          <span className="ml-4">
            <strong>Time:</strong> {time}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageCard;
