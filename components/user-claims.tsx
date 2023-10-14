"use client";
import { useUser } from "@clerk/clerk-react";
import { Types } from "ably";
import { useChannel } from "ably/react";
import { ElementRef, useEffect, useReducer, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

type Message = {
  author: string;
  content: string;
  timestamp: Date;
  id: string;
  deleted?: boolean;
};

type MessageSendEvent = { type: "send"; message: Message; id: string };
type MessageClearEvent = { type: "clear" };
type MessageDeleteEvent = { type: "delete"; [key: string]: any };

type MessageDispatch =
  | MessageSendEvent
  | MessageClearEvent
  | MessageDeleteEvent;

const UserClaims = ({
  clientId,
  channelName,
  creatorId,
}: {
  clientId: string;
  channelName: string;
  creatorId: string;
}) => {
  console.log(clientId, channelName, creatorId);
  const { user } = useUser();
  const isModerator = user?.id === creatorId;
  const scrollRef = useRef<ElementRef<"div">>(null);
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
        // 💡 Delete the message by remapping the message list with the target message deleted
        //    checking that the user who sent the delete action has the privilege to do so
        //    action.extras.userClaim will be populated automatically with the claim from the JWT when claims are active
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

  // 💡 Transforms the message from ably into the format that the reducer expects
  const handleMessage = (msg: Types.Message) => {
    dispatchMessage({ type: msg.name, id: msg.id, ...msg.data });
  };

  // 💡 Handles pressing enter or the send button
  const sendMessage = () => {
    if (draft.length === 0) return;
    channel.publish("send", {
      message: { author, content: draft, timestamp: new Date() },
    });
    setDraft("");
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

  const author = user?.fullName || "Anonymous";
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, dispatchMessage] = useReducer(messageReducer, []);
  const { channel, ably } = useChannel(channelName, handleMessage);

  // 💡 Effect to replay the message history, and add an initial message to new sessions
  useEffect(() => {
    channel.history((err: any, result: { items: Types.Message[] }) => {
      if (err || !result) return;
      if (result.items.length === 0) {
        channel.publish("send", {
          message: {
            author: "Welcome",
            content: "Send a message to chat.",
            timestamp: new Date(),
          },
        });
      } else {
        result.items.reverse().forEach(handleMessage);
      }
    });

    return () => {
      dispatchMessage({ type: "clear" });
    };
  }, []);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Chat</Button>
      </SheetTrigger>
      <SheetContent className="w-[100vw] md:w-[50vw] lg:w-[80vw] mt-24">
        <div className="w-fill flex-col">
          <div
            className={`bg-text-muted w-full rounded-lg ${
              isModerator ? "bg-pink-300" : ""
            } transition flex text-sm flex-col`}
          >
            <ScrollArea className="border-none max-h-[70vh] pb-5 overflow-y-auto px-5">
              {messages.map((message) => (
                <Message
                  message={message}
                  isOwnMessage={message.author === author}
                  deleteMessage={deleteMessage}
                  isModerator={isModerator}
                  key={message.id}
                />
              ))}
              <div ref={scrollRef} />
            </ScrollArea>
            <Input
              type="text"
              disabled={loading}
              className="mt-5"
              placeholder="Send a Message"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

function Message({
  message,
  isOwnMessage,
  isModerator,
  deleteMessage,
}: {
  message: Message;
  isOwnMessage: boolean;
  isModerator: boolean;
  deleteMessage: (mid: string) => () => void;
}) {
  return (
    <div
      className={`mb-12 mt-5  items-baseline relative ${
        isOwnMessage ? "flex flex-col justify-end" : "flex-row"
      }`}
    >
      <div
        className={`${
          isOwnMessage ? "ml-auto bg-indigo-400" : " bg-teal-500"
        } py-1 px-2 rounded-lg w-[350px]`}
      >
        <p
          className={`${
            isOwnMessage ? "text-blue-400" : "text-slate-400"
          } font-bold`}
        >
          {message.author} {isOwnMessage ? "(you)" : ""}
        </p>
        <p
          className={`text-base text-slate-600 ${
            message.deleted ? "italic" : ""
          }`}
        >
          {message.deleted ? "This message has been deleted." : message.content}
        </p>
      </div>
      <div className="flex justify-between w-[350px]">
        <h1> {message.author}</h1>
        <Button
          className={`text-red-600 bg-red-100 rounded-bl-lg rounded-br-lg my-1 py-1 px-2 cursor-pointer disabled:cursor-default absolute -bottom-10 ${
            isOwnMessage
              ? "text-right rounded-tr-sm rounded-tl-lg right-0"
              : "ml-1 rounded-tr-lg rounded-tl-sm"
          } ${
            (!isModerator && !isOwnMessage) || message.deleted
              ? "opacity-0"
              : ""
          } transition`}
          disabled={!isModerator && !isOwnMessage}
          onClick={deleteMessage(message.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default UserClaims;
