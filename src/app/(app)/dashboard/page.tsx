"use client";

import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/user";
import { acceptMessagesSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { resolve } from "path";
import { useState } from "react";
import { useForm } from "react-hook-form";

const page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  const handlerDeleteMessage = (messageId: string) => {
    setMessages(
      messages.filter((message) => message._id.toString() !== messageId)
    );
  };

  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(acceptMessagesSchema),
  });

  const {register, watch, setValue} = form;

  const acceptMessages = watch("acceptMessages");

  
  return <div>page</div>;
};

export default page;
