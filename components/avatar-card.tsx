import { FC } from "react";
import AvatarStack from "./avatar-stack";
import ChatHome from "./home-chat";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";

interface AvatarCardProps {}

const AvatarCard: FC<AvatarCardProps> = ({}) => {
  return (
    <>
      <Card className="fixed right-8 max-w-[300px] bottom-4 p-3 border border-gray-500 flex flex-row items-center justify-center">
        <ChatHome channelName="main-chat" />
        <Separator
          orientation="vertical"
          className="bg-indigo-500 h-[30px] mx-2"
        />
        <AvatarStack />
      </Card>
    </>
  );
};

export default AvatarCard;
