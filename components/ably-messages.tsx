"use client";
import { Message } from "@/utils/helpers";
import { FC } from "react";
import { Button } from "./ui/button";

interface AblyMessagesProps {
  message: Message;
  isOwnMessage: boolean;
  isModerator: boolean;
  deleteMessage: (mid: string) => () => void;
}

const AblyMessages: FC<AblyMessagesProps> = ({
  message,
  isOwnMessage,
  isModerator,
  deleteMessage,
}) => {
  return (
    <>
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
            {message.deleted
              ? "This message has been deleted."
              : message.content}
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
    </>
  );
};

export default AblyMessages;
