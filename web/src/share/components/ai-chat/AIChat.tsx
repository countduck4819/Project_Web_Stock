// "use client";

// import { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import axios from "axios";
// import { pushUserMessage } from "@/store/ai-chat/aiChat.reducer";
// import { askAIQuery } from "@/store/ai-chat/aiChat.api";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";

// export default function AIChat() {
//     const [open, setOpen] = useState(false);
//     const [question, setQuestion] = useState("");

//     const dispatch = useAppDispatch();
//     const { messages, loading } = useAppSelector((s) => s.aiChat);

//     const boxRef = useRef<HTMLDivElement | null>(null);

//     const sendMessage = () => {
//         if (!question.trim()) return;

//         dispatch(pushUserMessage(question));
//         dispatch(askAIQuery({ userId: 1, question }));
//         setQuestion("");
//     };

//     useEffect(() => {
//         if (boxRef.current) {
//             boxRef.current.scrollTop = boxRef.current.scrollHeight;
//         }
//     }, [messages, loading]);

//     return (
//         <>
//             <div className="fixed left-[3.125rem] bottom-[3.125rem] z-[9999]">
//                 {!open && (
//                     <div
//                         onClick={() => setOpen(true)}
//                         className="cursor-pointer group relative animate-bounce"
//                     >
//                         {/* Glow */}
//                         <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-xl blur-xl opacity-30 animate-pulse" />
//                         <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 rounded-xl blur-lg opacity-50 animate-ping" />

//                         {/* Nút chính */}
//                         <div className="relative w-[2.5rem] h-[2.5rem] bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 rounded-xl shadow-xl hover:scale-110 transition-all duration-300">
//                             <div className="absolute inset-[0.125rem] bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-500 rounded-xl opacity-80" />

//                             {/* ICON AI chính chủ */}
//                             <div className="relative flex items-center justify-center w-full h-full">
//                                 <div className="relative w-[1.75rem] h-[1.75rem]">
//                                     {/* SVG AI */}
//                                     <svg
//                                         width="100%"
//                                         height="100%"
//                                         viewBox="0 0 32 32"
//                                         className="drop-shadow-sm"
//                                     >
//                                         <defs>
//                                             <radialGradient
//                                                 id="radial-gradient"
//                                                 cx="36.22"
//                                                 cy="5.33"
//                                                 r="39.36"
//                                                 gradientUnits="userSpaceOnUse"
//                                             >
//                                                 <stop
//                                                     offset="0"
//                                                     stopColor="#05e6fd"
//                                                 />
//                                                 <stop
//                                                     offset="1"
//                                                     stopColor="#157cff"
//                                                 />
//                                             </radialGradient>
//                                             <linearGradient
//                                                 id="linear-gradient"
//                                                 x1="10.43"
//                                                 y1="16.55"
//                                                 x2="13.14"
//                                                 y2="24.88"
//                                                 gradientUnits="userSpaceOnUse"
//                                             >
//                                                 <stop
//                                                     offset="0"
//                                                     stopColor="#fff"
//                                                     stopOpacity="0"
//                                                 />
//                                                 <stop
//                                                     offset="0.12"
//                                                     stopColor="#fff"
//                                                     stopOpacity="0.17"
//                                                 />
//                                                 <stop
//                                                     offset="0.3"
//                                                     stopColor="#fff"
//                                                     stopOpacity="0.42"
//                                                 />
//                                                 <stop
//                                                     offset="0.47"
//                                                     stopColor="#fff"
//                                                     stopOpacity="0.63"
//                                                 />
//                                                 <stop
//                                                     offset="0.64"
//                                                     stopColor="#fff"
//                                                     stopOpacity="0.79"
//                                                 />
//                                                 <stop
//                                                     offset="0.78"
//                                                     stopColor="#fff"
//                                                     stopOpacity="0.9"
//                                                 />
//                                                 <stop
//                                                     offset="0.91"
//                                                     stopColor="#fff"
//                                                     stopOpacity="0.97"
//                                                 />
//                                                 <stop
//                                                     offset="1"
//                                                     stopColor="#fff"
//                                                 />
//                                             </linearGradient>
//                                             <linearGradient
//                                                 id="linear-gradient-2"
//                                                 x1="15.93"
//                                                 y1="25.47"
//                                                 x2="16.27"
//                                                 y2="8.37"
//                                                 gradientUnits="userSpaceOnUse"
//                                             >
//                                                 <stop
//                                                     offset="0"
//                                                     stopColor="#fff"
//                                                     stopOpacity="0"
//                                                 />
//                                                 <stop
//                                                     offset="1"
//                                                     stopColor="#fff"
//                                                 />
//                                             </linearGradient>
//                                         </defs>
//                                         <rect
//                                             fill="url(#radial-gradient)"
//                                             width="32"
//                                             height="32"
//                                             rx="5.63"
//                                         />
//                                         <path
//                                             fill="url(#linear-gradient)"
//                                             d="M9,26.16h.92A4.56,4.56,0,0,0,14.4,22L15,15.33h0s-1.19-.9-3.57,2.71-3,4.93-3,5.72c0,.49-.05,1.3-.07,1.84A.54.54,0,0,0,9,26.16Z"
//                                         />
//                                         <path
//                                             fill="url(#linear-gradient-2)"
//                                             d="M17.4,10.83l.92-.16h0c-.39-.35-.8-.69-1.22-1A.35.35,0,0,1,17,9.29a.34.34,0,0,1,.32-.23h.07a18.59,18.59,0,0,1,2.7.81c.32.13.65.26,1,.41a.94.94,0,0,0,.37.07h.07A.87.87,0,0,0,22,9.87h0v0l1.61-3.7h0c-.5-.07-1-.13-1.51-.18-.27,0-.54,0-.82-.06h0c-.64,0-1.28-.07-1.93-.07a29.37,29.37,0,0,0-7.13.87l-.15,0h0A4.21,4.21,0,0,0,9,10.53H9v.27H9l-.11,3.07h0c.32-.18.64-.34,1-.5A29.1,29.1,0,0,1,17.4,10.83Z"
//                                         />
//                                         <path
//                                             fill="#fff"
//                                             d="M22.18,11.24s0,0,0,0v.05c-.09.28-.19.55-.3.83s-.13.35-.21.52-.25.6-.39.88A18.06,18.06,0,0,1,19,17.13h0a18.36,18.36,0,0,0,.89-4.41h0a18.25,18.25,0,0,0-11,10.73,2,2,0,0,0-.08.22c-.15.39-.28.79-.39,1.19h0l.05-1.32.25-6.91a1.38,1.38,0,0,1,.32-.84l0-.06a11.17,11.17,0,0,1,3.94-2.86,26,26,0,0,1,5.12-1.69,7.11,7.11,0,0,1,1-.13h0c-.19-.19-.38-.38-.58-.56A16.81,16.81,0,0,0,17.3,9.4h0a18.41,18.41,0,0,1,2.65.8,17.47,17.47,0,0,1,2.23,1.05Z"
//                                         />
//                                     </svg>

//                                     {/* Sparkles */}
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         width="0.9rem"
//                                         height="0.9rem"
//                                         viewBox="0 0 24 24"
//                                         fill="none"
//                                         stroke="currentColor"
//                                         strokeWidth="2"
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         className="text-yellow-200 absolute -top-[0.125rem] -right-[0.125rem] animate-pulse drop-shadow-sm"
//                                     >
//                                         <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
//                                         <path d="M20 3v4" />
//                                         <path d="M22 5h-4" />
//                                         <path d="M4 17v2" />
//                                         <path d="M5 18H3" />
//                                     </svg>
//                                 </div>
//                             </div>

//                             <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-all" />
//                         </div>

//                         {/* Ping dots */}
//                         <div className="absolute -top-[0.25rem] -right-[0.25rem] w-[0.5rem] h-[0.5rem] bg-cyan-400 rounded-full animate-ping opacity-70" />
//                         <div
//                             className="absolute -bottom-[0.25rem] -left-[0.25rem] w-[0.375rem] h-[0.375rem] bg-blue-400 rounded-full animate-ping opacity-60"
//                             style={{ animationDelay: "0.5s" }}
//                         />
//                         <div
//                             className="absolute top-[0.25rem] -left-[0.25rem] w-[0.375rem] h-[0.375rem] bg-indigo-400 rounded-full animate-ping opacity-60"
//                             style={{ animationDelay: "1s" }}
//                         />

//                         {/* Outer ring */}
//                         <div className="absolute inset-0 w-[2.5rem] h-[2.5rem] border border-cyan-400 rounded-xl animate-ping opacity-30" />
//                         <div
//                             className="absolute inset-0 w-[2.5rem] h-[2.5rem] border border-blue-400 rounded-xl animate-ping opacity-20"
//                             style={{ animationDelay: "0.3s" }}
//                         />
//                     </div>
//                 )}

//                 {open && (
//                     <div
//                         onClick={() => setOpen(false)}
//                         className="cursor-pointer group relative animate-bounce"
//                     >
//                         {/* Glow */}
//                         <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-xl blur-xl opacity-30 animate-pulse" />
//                         <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 rounded-xl blur-lg opacity-50 animate-ping" />

//                         <div className="relative w-[2.5rem] h-[2.5rem] bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 rounded-xl shadow-xl hover:scale-110 transition-all duration-300">
//                             <div className="absolute inset-[0.125rem] bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-500 rounded-xl opacity-80" />

//                             <div className="relative flex items-center justify-center w-full h-full">
//                                 <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     width="1.5rem"
//                                     height="1.5rem"
//                                     viewBox="0 0 24 24"
//                                     fill="none"
//                                     stroke="white"
//                                     strokeWidth="2"
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     className="drop-shadow-sm"
//                                 >
//                                     <path d="M18 6 6 18" />
//                                     <path d="m6 6 12 12" />
//                                 </svg>
//                             </div>

//                             <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-80 transition-all" />
//                         </div>

//                         {/* Ping dots */}
//                         <div className="absolute -top-[0.25rem] -right-[0.25rem] w-[0.5rem] h-[0.5rem] bg-cyan-400 rounded-full animate-ping opacity-70" />
//                         <div
//                             className="absolute -bottom-[0.25rem] -left-[0.25rem] w-[0.375rem] h-[0.375rem] bg-blue-400 rounded-full animate-ping opacity-60"
//                             style={{ animationDelay: "0.5s" }}
//                         />
//                         <div
//                             className="absolute top-[0.25rem] -left-[0.25rem] w-[0.375rem] h-[0.375rem] bg-indigo-400 rounded-full animate-ping opacity-60"
//                             style={{ animationDelay: "1s" }}
//                         />

//                         {/* Outer ring */}
//                         <div className="absolute inset-0 w-[2.5rem] h-[2.5rem] border border-cyan-400 rounded-xl animate-ping opacity-30" />
//                         <div
//                             className="absolute inset-0 w-[2.5rem] h-[2.5rem] border border-blue-400 rounded-xl animate-ping opacity-20"
//                             style={{ animationDelay: "0.3s" }}
//                         />
//                     </div>
//                 )}
//             </div>

//             <AnimatePresence>
//                 {open && (
//                     <motion.div
//                         initial={{ opacity: 0, y: "2.5rem" }}
//                         animate={{ opacity: 1, y: "0rem" }}
//                         exit={{ opacity: 0, y: "2.5rem" }}
//                         className="fixed left-[2.1875rem] bottom-[7.5rem] w-[28.125rem] xl:w-[37.5rem] h-[40rem] bg-white rounded-xl shadow-2xl border border-neutral-200 z-[9998]"
//                     >
//                         <div className="px-3 py-2 border-b border-neutral-200 flex items-center justify-between">
//                             <span className="text-sm font-medium">
//                                 Trợ lý AI
//                             </span>
//                             <button
//                                 onClick={() => setOpen(false)}
//                                 className="text-gray-400 hover:text-gray-600"
//                             >
//                                 ✕
//                             </button>
//                         </div>

//                         {/* BODY */}
//                         <div
//                             ref={boxRef}
//                             className="flex-1 overflow-y-auto p-3 space-y-3"
//                         >
//                             {messages.map((msg, i) =>
//                                 msg.sender === "user" ? (
//                                     <div key={i} className="text-right">
//                                         <span className="inline-block bg-blue-600 text-white px-3 py-2 rounded-lg">
//                                             {msg.text}
//                                         </span>
//                                     </div>
//                                 ) : (
//                                     <div key={i} className="text-left">
//                                         <div
//                                             className="inline-block bg-gray-100 px-3 py-2 rounded-lg"
//                                             dangerouslySetInnerHTML={{
//                                                 __html: msg.text,
//                                             }}
//                                         />
//                                     </div>
//                                 )
//                             )}

//                             {loading && (
//                                 <p className="text-sm text-gray-400">
//                                     AI đang trả lời...
//                                 </p>
//                             )}
//                         </div>

//                         {/* INPUT */}
//                         <div className="border-t border-neutral-200 p-3 flex gap-2">
//                             <input
//                                 value={question}
//                                 onChange={(e) => setQuestion(e.target.value)}
//                                 className="flex-1 border rounded-lg px-3 py-2 text-sm"
//                                 placeholder="Nhập câu hỏi…"
//                             />
//                             <button
//                                 onClick={sendMessage}
//                                 className="bg-black text-white px-4 rounded-lg"
//                             >
//                                 Gửi
//                             </button>
//                         </div>
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </>
//     );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { pushUserMessage } from "@/store/ai-chat/aiChat.reducer";
import { askAIQuery, fetchAIHistoryQuery } from "@/store/ai-chat/aiChat.api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useAuth } from "@/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import "@/css/chat-ai.css";

export default function AIChat() {
    const [open, setOpen] = useState(false);
    const [question, setQuestion] = useState("");
    const boxRef = useRef<HTMLDivElement | null>(null);
    const dispatch = useAppDispatch();
    const { user } = useAuth();
    const router = useRouter();
    console.log(user);

    const { messages, loading } = useAppSelector((s) => s.aiChat);

    useEffect(() => {
        if (!open) return;

        if (!user) {
            router.push("/login");
            return;
        }

        dispatch(fetchAIHistoryQuery(user.id));
    }, [open, user]);

    const sendMessage = () => {
        if (!question.trim() || !user) return;

        dispatch(pushUserMessage(question));
        dispatch(askAIQuery({ userId: user.id, question }));
        setQuestion("");
    };

    useEffect(() => {
        if (!boxRef.current) return;

        requestAnimationFrame(() => {
            boxRef.current!.scrollTo({
                top: boxRef.current!.scrollHeight,
                behavior: "smooth",
            });
        });
    }, [messages]);

    return (
        <>
            <div className="fixed right-[3.125rem] bottom-[3.125rem] z-[9999]">
                {!open && (
                    <div
                        onClick={() => setOpen(true)}
                        className="cursor-pointer group relative animate-bounce"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-xl blur-xl opacity-30 animate-pulse" />
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 rounded-xl blur-lg opacity-50 animate-ping" />

                        <div className="relative w-[2.5rem] h-[2.5rem] bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 rounded-xl shadow-xl hover:scale-110 transition-all duration-300">
                            <div className="absolute inset-[0.125rem] bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-500 rounded-xl opacity-80" />

                            <div className="relative flex items-center justify-center w-full h-full">
                                <div className="relative w-[1.75rem] h-[1.75rem]">
                                    <svg
                                        width="100%"
                                        height="100%"
                                        viewBox="0 0 32 32"
                                        className="drop-shadow-sm"
                                    >
                                        <defs>
                                            <radialGradient
                                                id="radial-gradient"
                                                cx="36.22"
                                                cy="5.33"
                                                r="39.36"
                                                gradientUnits="userSpaceOnUse"
                                            >
                                                <stop
                                                    offset="0"
                                                    stopColor="#05e6fd"
                                                />
                                                <stop
                                                    offset="1"
                                                    stopColor="#157cff"
                                                />
                                            </radialGradient>
                                            <linearGradient
                                                id="linear-gradient"
                                                x1="10.43"
                                                y1="16.55"
                                                x2="13.14"
                                                y2="24.88"
                                                gradientUnits="userSpaceOnUse"
                                            >
                                                <stop
                                                    offset="0"
                                                    stopColor="#fff"
                                                    stopOpacity="0"
                                                />
                                                <stop
                                                    offset="0.12"
                                                    stopColor="#fff"
                                                    stopOpacity="0.17"
                                                />
                                                <stop
                                                    offset="0.3"
                                                    stopColor="#fff"
                                                    stopOpacity="0.42"
                                                />
                                                <stop
                                                    offset="0.47"
                                                    stopColor="#fff"
                                                    stopOpacity="0.63"
                                                />
                                                <stop
                                                    offset="0.64"
                                                    stopColor="#fff"
                                                    stopOpacity="0.79"
                                                />
                                                <stop
                                                    offset="0.78"
                                                    stopColor="#fff"
                                                    stopOpacity="0.9"
                                                />
                                                <stop
                                                    offset="0.91"
                                                    stopColor="#fff"
                                                    stopOpacity="0.97"
                                                />
                                                <stop
                                                    offset="1"
                                                    stopColor="#fff"
                                                />
                                            </linearGradient>
                                            <linearGradient
                                                id="linear-gradient-2"
                                                x1="15.93"
                                                y1="25.47"
                                                x2="16.27"
                                                y2="8.37"
                                                gradientUnits="userSpaceOnUse"
                                            >
                                                <stop
                                                    offset="0"
                                                    stopColor="#fff"
                                                    stopOpacity="0"
                                                />
                                                <stop
                                                    offset="1"
                                                    stopColor="#fff"
                                                />
                                            </linearGradient>
                                        </defs>
                                        <rect
                                            fill="url(#radial-gradient)"
                                            width="32"
                                            height="32"
                                            rx="5.63"
                                        />
                                        <path
                                            fill="url(#linear-gradient)"
                                            d="M9,26.16h.92A4.56,4.56,0,0,0,14.4,22L15,15.33h0s-1.19-.9-3.57,2.71-3,4.93-3,5.72c0,.49-.05,1.3-.07,1.84A.54.54,0,0,0,9,26.16Z"
                                        />
                                        <path
                                            fill="url(#linear-gradient-2)"
                                            d="M17.4,10.83l.92-.16h0c-.39-.35-.8-.69-1.22-1A.35.35,0,0,1,17,9.29a.34.34,0,0,1,.32-.23h.07a18.59,18.59,0,0,1,2.7.81c.32.13.65.26,1,.41a.94.94,0,0,0,.37.07h.07A.87.87,0,0,0,22,9.87h0v0l1.61-3.7h0c-.5-.07-1-.13-1.51-.18-.27,0-.54,0-.82-.06h0c-.64,0-1.28-.07-1.93-.07a29.37,29.37,0,0,0-7.13.87l-.15,0h0A4.21,4.21,0,0,0,9,10.53H9v.27H9l-.11,3.07h0c.32-.18.64-.34,1-.5A29.1,29.1,0,0,1,17.4,10.83Z"
                                        />
                                        <path
                                            fill="#fff"
                                            d="M22.18,11.24s0,0,0,0v.05c-.09.28-.19.55-.3.83s-.13.35-.21.52-.25.6-.39.88A18.06,18.06,0,0,1,19,17.13h0a18.36,18.36,0,0,0,.89-4.41h0a18.25,18.25,0,0,0-11,10.73,2,2,0,0,0-.08.22c-.15.39-.28.79-.39,1.19h0l.05-1.32.25-6.91a1.38,1.38,0,0,1,.32-.84l0-.06a11.17,11.17,0,0,1,3.94-2.86,26,26,0,0,1,5.12-1.69,7.11,7.11,0,0,1,1-.13h0c-.19-.19-.38-.38-.58-.56A16.81,16.81,0,0,0,17.3,9.4h0a18.41,18.41,0,0,1,2.65.8,17.47,17.47,0,0,1,2.23,1.05Z"
                                        />
                                    </svg>

                                    {/* Sparkles */}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="0.9rem"
                                        height="0.9rem"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-yellow-200 absolute -top-[0.125rem] -right-[0.125rem] animate-pulse drop-shadow-sm"
                                    >
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                                        <path d="M20 3v4" />
                                        <path d="M22 5h-4" />
                                        <path d="M4 17v2" />
                                        <path d="M5 18H3" />
                                    </svg>
                                </div>
                            </div>

                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-all" />
                        </div>

                        {/* Ping dots */}
                        <div className="absolute -top-[0.25rem] -right-[0.25rem] w-[0.5rem] h-[0.5rem] bg-cyan-400 rounded-full animate-ping opacity-70" />
                        <div
                            className="absolute -bottom-[0.25rem] -left-[0.25rem] w-[0.375rem] h-[0.375rem] bg-blue-400 rounded-full animate-ping opacity-60"
                            style={{ animationDelay: "0.5s" }}
                        />
                        <div
                            className="absolute top-[0.25rem] -left-[0.25rem] w-[0.375rem] h-[0.375rem] bg-indigo-400 rounded-full animate-ping opacity-60"
                            style={{ animationDelay: "1s" }}
                        />

                        {/* Outer ring */}
                        <div className="absolute inset-0 w-[2.5rem] h-[2.5rem] border border-cyan-400 rounded-xl animate-ping opacity-30" />
                        <div
                            className="absolute inset-0 w-[2.5rem] h-[2.5rem] border border-blue-400 rounded-xl animate-ping opacity-20"
                            style={{ animationDelay: "0.3s" }}
                        />
                    </div>
                )}

                {open && (
                    <div
                        onClick={() => setOpen(false)}
                        className="cursor-pointer group relative animate-bounce"
                    >
                        {/* Glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-xl blur-xl opacity-30 animate-pulse" />
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 rounded-xl blur-lg opacity-50 animate-ping" />

                        <div className="relative w-[2.5rem] h-[2.5rem] bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 rounded-xl shadow-xl hover:scale-110 transition-all duration-300">
                            <div className="absolute inset-[0.125rem] bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-500 rounded-xl opacity-80" />

                            <div className="relative flex items-center justify-center w-full h-full">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="1.5rem"
                                    height="1.5rem"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="drop-shadow-sm"
                                >
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                </svg>
                            </div>

                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-80 transition-all" />
                        </div>

                        {/* Ping dots */}
                        <div className="absolute -top-[0.25rem] -right-[0.25rem] w-[0.5rem] h-[0.5rem] bg-cyan-400 rounded-full animate-ping opacity-70" />
                        <div
                            className="absolute -bottom-[0.25rem] -left-[0.25rem] w-[0.375rem] h-[0.375rem] bg-blue-400 rounded-full animate-ping opacity-60"
                            style={{ animationDelay: "0.5s" }}
                        />
                        <div
                            className="absolute top-[0.25rem] -left-[0.25rem] w-[0.375rem] h-[0.375rem] bg-indigo-400 rounded-full animate-ping opacity-60"
                            style={{ animationDelay: "1s" }}
                        />

                        <div className="absolute inset-0 w-[2.5rem] h-[2.5rem] border border-cyan-400 rounded-xl animate-ping opacity-30" />
                        <div
                            className="absolute inset-0 w-[2.5rem] h-[2.5rem] border border-blue-400 rounded-xl animate-ping opacity-20"
                            style={{ animationDelay: "0.3s" }}
                        />
                    </div>
                )}
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: "2rem" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "2rem" }}
                        className="fixed right-[7rem] bottom-[3rem] w-[28rem] xl:w-[37rem] h-[35rem] bg-white rounded-xl shadow-2xl border border-neutral-200 z-[9998] flex flex-col"
                    >
                        <div className="px-3 py-2 border-b border-neutral-200 flex items-center justify-between">
                            <span className="text-[1.2rem] font-medium">
                                Trợ lý AI
                            </span>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>
                        <div
                            ref={boxRef}
                            className="flex-1 overflow-y-auto p-3 space-y-3"
                        >
                            {messages.map((msg, i) =>
                                msg.sender === "user" ? (
                                    <div key={i} className="text-right">
                                        <span className="inline-block bg-blue-600 text-white px-3 py-2 rounded-lg">
                                            {msg.text}
                                        </span>
                                    </div>
                                ) : (
                                    <div key={i} className="text-left">
                                        <div
                                            className={cn(
                                                "inline-block bg-gray-100 px-3 py-2 rounded-lg",
                                                "ai-answer"
                                            )}
                                            dangerouslySetInnerHTML={{
                                                __html: msg.text,
                                            }}
                                        />
                                    </div>
                                )
                            )}

                            {loading && (
                                <p className="text-[1rem] text-gray-400">
                                    AI đang trả lời…
                                </p>
                            )}
                        </div>
                        <div className="border-t border-neutral-200 p-3 flex gap-2">
                            <input
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === "Enter" && sendMessage()
                                }
                                className="flex-1 border rounded-lg px-3 py-2 text-sm"
                                placeholder="Nhập câu hỏi…"
                            />
                            <button
                                onClick={sendMessage}
                                className="bg-[linear-gradient(90deg,#6A5CF5_0%,#5A32EA_100%)] text-[0.875rem] text-white px-4 rounded-lg"
                            >
                                Gửi
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
