import React, { useEffect } from "react";

const ChatBody = ({ messages, typing, lastMessageRef }) => {
    const currentUser = sessionStorage.getItem("username");
    
    // Log messages array whenever it changes
    useEffect(() => {
        console.log("Messages:", messages);
    }, [messages]);

    // Log when the component renders
    console.log("Rendering ChatBody");

    return (
        <div className="chat__body overflow-y-auto h-[80vh] p-4 bg-gray-100 rounded-lg shadow-inner">
            {messages.map((message, index) => {
                const isSender = message.name === currentUser;
                const isLastMessage = index === messages.length - 1;

                console.log(
                    `Message: ${message.text}, From: ${message.name}, IsSender: ${isSender}`
                );

                return (
                    <div
                        className={`my-2 flex ${
                            isSender ? "justify-end" : "justify-start"
                        }`}
                        key={message.id}
                    >
                        <div>
                            <p
                                className={`sender__name text-sm ${
                                    isSender ? "text-right" : "text-left"
                                }`}
                            >
                                {isSender ? "You" : message.name}
                            </p>
                            <div
                                className={`w-fit break-words p-3 max-w-80 rounded-2xl shadow-md ${
                                    isSender
                                        ? "rounded-br-none bg-green-200"
                                        : "rounded-tl-none bg-blue-200"
                                }`}
                            >
                                <p>{message.text}</p>
                                {isLastMessage && isSender && message.seenBy && (
                                    <p className="message__seen text-xs text-right text-gray-500 mt-1">
                                        Seen
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
            <div ref={lastMessageRef} />
            <div className="message__status text-sm text-gray-500 italic">
                <p>{typing}</p>
            </div>
        </div>
    );
};

export default ChatBody;
