import { FC } from "react";
import { Card } from "./ui/card";
import { MessageCircle } from "lucide-react";
import { Separator } from "./ui/separator";
import AvatarStack from "./AvatarStack";

interface AvatarCardProps {}

const AvatarCard: FC<AvatarCardProps> = ({}) => {
  return (
    <>
      <Card className="fixed right-8 w-80 bottom-8 p-3 border border-gray-500 flex flex-row items-center justify-center space-x-5 ">
        <MessageCircle />
        <Separator orientation="vertical" className="bg-indigo-500 h-[30px]" />
        <AvatarStack />
      </Card>
    </>
  );
};

export default AvatarCard;
