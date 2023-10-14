// "use client";

// import { Button } from "@/components/ui/button";
// import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Types } from "ably";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { ElementRef, useEffect, useRef, useState } from "react";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { formSchema } from "./constants";
// import { ScrollArea } from "./ui/scroll-area";
// import * as Ably from "ably/promises";
// import { redirect, useRouter } from "next/navigation";
// import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
// import { useUser } from "@clerk/clerk-react";
// import { useChannel } from "ably/react";

// type Message = {
//   author: string;
//   content: string;
//   timestamp: Date;
//   id: string;
//   deleted?: boolean;
//   isOwnMessage: boolean;
// };

// type MessageSendEvent = { type: "send"; message: Message; id: string };
// type MessageClearEvent = { type: "clear" };
// type MessageDeleteEvent = { type: "delete"; [key: string]: any };

// type MessageDispatch =
//   | MessageSendEvent
//   | MessageClearEvent
//   | MessageDeleteEvent;

// const RealtimeForm = ({
//   clientId,
//   channelName,
// }: {
//   clientId: string;
//   channelName: string;
// }) => {
//   //   const { toast } = useToast();
//   const [messages, setMessages] = useState<Message[]>([]);
//   const { user } = useUser();
//   if (!user) {
//     redirect("/sign-in");
//   }
//   const author = user.fullName;
//   const { channel } = useChannel(channelName, setMessages);
//   //   const handleMessage = (msg: Types.Message) => {
//   //     dispatchMessage({ type: msg.name, id: msg.id, ...msg.data });
//   //   };

//   // 💡 Handles pressing enter or the send button
//   //   const sendMessage = () => {
//   //     if (draft.length === 0) return;
//   //     channel.publish("send", {
//   //       message: { author, content: draft, timestamp: new Date() },
//   //     });
//   //     setDraft("");
//   //   };

//   // 💡 Handles pressing the delete button
//   const deleteMessage = (mid: string) => {
//     return () => {
//       // 💡 Send a message interaction for the target message with the `com.ably.delete` reference type
//       channel.publish("delete", {
//         user: author,
//         extras: {
//           ref: { type: "com.ably.delete", timeserial: mid },
//         },
//       });
//     };
//   };
//   const scrollRef = useRef<ElementRef<"div">>(null);
//   const router = useRouter();
//   useEffect(() => {
//     scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages.length]);

//   useEffect(() => {
//     channel.history((err: any, result: { items: Types.Message[] }) => {
//       if (err || !result) return;
//       if (result.items.length === 0) {
//         channel.publish("send", {
//           message: {
//             author: "Welcome",
//             content: "Send a message to chat.",
//             timestamp: new Date(),
//           },
//         });
//       } else {
       
//       }
//     });

//     return () => {
//       setMessages(messages);
//     };
//   }, []);
//   //   useEffect(() => {
//   //     const ably: Ably.Types.RealtimePromise = configureAbly({
//   //       authUrl: `/api/auth`,
//   //       // queryTime: true,
//   //     });
//   //     // const ably =  new Ably.Realtime({ key: process.env.ABLY_API_KEY });
//   //     const channel = ably.channels.get("my-channel");

//   //     // Subscribe to the channel
//   //     channel.subscribe((message: Ably.Types.Message) => {
//   //       // Check if the message was sent from the current tab
//   //       // // console.log(message.data.tabId);
//   //       const isOwnMessage = message.data.tabId === tabId;
//   //       setMessages((messages) => [
//   //         ...messages,
//   //         { text: message.data.text, isOwnMessage },
//   //       ]);
//   //     });

//   //     return () => {
//   //       // Unsubscribe when the component unmounts
//   //       channel.unsubscribe();
//   //     };
//   //   }, []);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       text: "",
//     },
//   });

//   const isLoading = form.formState.isSubmitting;

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//       const messageText = `${form.getValues().text}`;

//       form.reset();

//       //   toast({
//       //     title: "Message Sent",
//       //   });
//     } catch (error) {
//       console.error(error);
//       //   toast({
//       //     title: "Oops something went wrong",
//       //     variant: "destructive",
//       //   });
//     }
//   };

//   return (
//     <Sheet>
//       <SheetTrigger asChild>
//         <Button variant="outline">Open Shadcn Chat</Button>
//       </SheetTrigger>
//       <SheetContent className="mt-24">
//         <div className="mt-4 space-y-4">
//           <ScrollArea className="h-[300px] rounded-md border flex flex-col-reverse py-5 bg-text-muted">
//             {messages.map((message: Message, index: any) => (
//               <div key={index} className="my-3">
//                 <h1
//                   className={`p-1 px-3 rounded-lg max-w-[150px] ${
//                     message.isOwnMessage
//                       ? "ml-auto bg-indigo-400 mr-2"
//                       : "ml-2 bg-teal-500"
//                   }`}
//                 >
//                   {message.content}
//                 </h1>
//               </div>
//             ))}
//             <div ref={scrollRef} />
//           </ScrollArea>
//         </div>
//         <div className="mt-5">
//           <div>
//             <Form {...form}>
//               <form
//                 onSubmit={form.handleSubmit(onSubmit)}
//                 className="grid w-full grid-cols-12 gap-2 p-2 px-3 border rounded-lg md:px-6 focus-within:shadow-sm"
//               >
//                 <FormField
//                   name="text"
//                   render={({ field }) => (
//                     <FormItem className="col-span-12 lg:col-span-10">
//                       <FormControl className="p-0 m-0">
//                         <Input
//                           className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
//                           disabled={isLoading}
//                           placeholder="Your message"
//                           {...field}
//                         />
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />
//                 <Button
//                   className="w-24 col-span-12 lg:col-span-2"
//                   type="submit"
//                   disabled={isLoading}
//                   size="icon"
//                 >
//                   Send
//                 </Button>
//               </form>
//             </Form>
//           </div>
//         </div>
//       </SheetContent>
//     </Sheet>
//   );
// };

// export default RealtimeForm;
