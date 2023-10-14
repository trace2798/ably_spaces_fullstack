"use client";
import { useUser } from "@clerk/clerk-react";
import { Types } from "ably";
import { useChannel } from "ably/react";
import { ElementRef, useEffect, useReducer, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import AblyMessages from "./ably-messages";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";
import { Message } from "@/utils/helpers";

type MessageSendEvent = { type: "send"; message: Message; id: string };
type MessageClearEvent = { type: "clear" };
type MessageDeleteEvent = { type: "delete"; [key: string]: any };

type MessageDispatch =
  | MessageSendEvent
  | MessageClearEvent
  | MessageDeleteEvent;

const ChatSheet = ({
  channelName,
  creatorId,
}: {
  channelName: string;
  creatorId: string;
}) => {
  const { user } = useUser();
  if (!user) {
    redirect("/");
  }
  const isModerator = user.id === creatorId;
  const scrollRef = useRef<ElementRef<"div">>(null);
  const author = user.fullName;
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  // Function to start typing
  const startTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      channel.presence.update({ typing: true });
    }
  };

  // Function to stop typing
  const stopTyping = () => {
    if (isTyping) {
      setIsTyping(false);
      channel.presence.update({ typing: false });
    }
  };

  const handleKeyDown = () => {
    startTyping();
    // After user stops typing for one second, send stopTyping event
    setTimeout(stopTyping, 1000);
  };

  // 💡 Used to handle incoming events and action the changes against the message list

  const messageReducer = (
    state: Message[],
    action: MessageDispatch
  ): Message[] => {
    switch (action.type) {
      case "send":
        action.message.id = action.id;
        return state.concat(action.message);
      case "delete":
        return state.map((m) =>
          !(m.author !== author && action.extras?.userClaim === "user") &&
          m.id === action.extras.ref.timeserial
            ? { ...m, deleted: true }
            : m
        );
      case "clear":
        return [];
      default:
        return state;
    }
  };
  const [messages, dispatchMessage] = useReducer(messageReducer, []);

  // 💡 Transforms the message from ably into the format that the reducer expects
  const handleMessage = (msg: Types.Message) => {
    dispatchMessage({ type: msg.name, id: msg.id, ...msg.data });
  };

  const { channel } = useChannel(channelName, handleMessage);
  console.log(channel, "CHANNEl");
  useEffect(() => {
    const onPresenceUpdate = (member: any) => {
      if (member.data.typing) {
        setTypingUsers((users) => [...users, member.clientId]);
      } else {
        setTypingUsers((users) => users.filter((id) => id !== member.clientId));
      }
    };
    {
      console.log(onPresenceUpdate, "PRESENCE UPDATE");
    }
    channel.presence.subscribe("update", onPresenceUpdate);

    return () => {
      channel.presence.unsubscribe("update", onPresenceUpdate);
    };
  }, [channel]);

  // 💡 Handles pressing enter or the send button
  const sendMessage = () => {
    if (message.length === 0) return;

    channel.publish("send", {
      message: { author, content: message, timestamp: new Date() },
    });
    setMessage("");
  };

  // 💡 Handles pressing the delete button
  const deleteMessage = (mid: string) => {
    return () => {
      // 💡 Send a message interaction for the target message with the `com.ably.delete` reference type
      channel.publish("delete", {
        user: author,
        extras: {
          ref: { type: "com.ably.delete", timeserial: mid },
        },
      });
    };
  };

  // 💡 Effect to replay the message history, and add an initial message to new sessions
  useEffect(() => {
    channel.history((err: any, result: { items: Types.Message[] }) => {
      if (err || !result) return;
      if (result.items.length === 0) {
        // channel.publish("send", {
        //   message: {
        //     author: "Welcome",
        //     content: "Send a message to chat.",
        //     timestamp: new Date(),
        //   },
        // });
      } else {
        result.items.reverse().forEach(handleMessage);
      }
    });

    return () => {
      dispatchMessage({ type: "clear" });
    };
  }, []);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Chat</Button>
      </SheetTrigger>
      <SheetContent className="w-[100vw] md:w-[50vw] lg:w-[80vw] mt-24">
        <ScrollArea
          className={cn(
            "border-none max-h-[70vh] overflow-y-auto px-5 bg-text-muted w-full transition flex text-sm flex-col rounded-2xl",
            {
              "bg-slate-900": isModerator,
            }
          )}
        >
          {messages.length === 0 ? (
            <div className="w-full h-24 flex text-center justify-center items-center">
              <h1>Oops. Looks like you have not started chatting.</h1>
            </div>
          ) : (
            messages.map((message, index) => (
              <AblyMessages
                message={message}
                isOwnMessage={message.author === author}
                deleteMessage={deleteMessage}
                isModerator={isModerator}
                key={index}
              />
            ))
          )}

          <div ref={scrollRef} />
        </ScrollArea>
        {typingUsers.length > 0 && <p>{typingUsers.join(", ")} is typing...</p>}
        <Input
          type="text"
          disabled={loading}
          className="mt-5"
          placeholder="Send a Message to get started"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          // onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          onKeyDown={handleKeyDown}
        />
      </SheetContent>
    </Sheet>
  );
};

export default ChatSheet;
