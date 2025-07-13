// import { useState, useRef, useEffect } from "react";
// import { URL } from "../Constants/Constants";
// import Answers from "../Answers/Answers";

// function Main() {
//   const [question, setQuestion] = useState("");
//   const [result, setResult] = useState([]);
//   const [chats, setChats] = useState([]);
//   const [showSidebar, setShowSidebar] = useState(false);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [result]);

//   const handleQuestion = (e) => setQuestion(e.target.value);

//   const askQuestion = async () => {
//     if (!question.trim()) return;

//     const userMsg = { text: question, isUser: true };
//     const typingMsg = { text: "Typing...", isUser: false, isTyping: true };

//     setResult((prev) => {
//       const clean = prev.filter((msg) => !msg.isTyping);
//       return [...clean, userMsg, typingMsg];
//     });

//     setQuestion("");

//     const historyParts = [...result, { text: question, isUser: true }]
//       .filter((msg) => !msg.isTyping)
//       .map((msg) => ({
//         role: msg.isUser ? "user" : "model",
//         text: msg.text,
//       }));

//     const payload = {
//       contents: [
//         { parts: historyParts.map((entry) => ({ text: entry.text })) },
//       ],
//     };

//     try {
//       const res = await fetch(URL, {
//         method: "POST",
//         body: JSON.stringify(payload),
//       });

//       const json = await res.json();
//       const data = json?.candidates[0]?.content?.parts?.[0]?.text || "";
//       const answers = data.split("* ").map((item) => item.trim());

//       setResult((prev) => {
//         const clean = prev.filter((msg) => !msg.isTyping);
//         return [...clean, ...answers.map((text) => ({ text, isUser: false }))];
//       });
//     } catch {
//       setResult((prev) => [
//         ...prev.filter((msg) => !msg.isTyping),
//         { text: "Error fetching response.", isUser: false },
//       ]);
//     }
//   };

//   const startNewChat = () => {
//     if (result.length > 0) {
//       const first = result.find((msg) => msg.isUser)?.text || "New Chat";
//       const title = first.length > 30 ? first.slice(0, 30) + "..." : first;
//       setChats((prev) => [...prev, { title, messages: result }]);
//     }
//     setResult([]);
//     setShowSidebar(false);
//   };

//   const deleteChat = (index) => {
//     setChats((prev) => prev.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="grid grid-cols-5 h-screen text-center relative overflow-hidden">
//       <button
//         onClick={() => setShowSidebar(true)}
//         className="sm:hidden fixed top-2 left-2 bg-zinc-800 text-white p-1 rounded-lg z-50"
//       >
//         ☰
//       </button>
//       <div
//         className={`${
//           showSidebar
//             ? "absolute top-0 left-0 h-screen w-full sm:relative sm:w-auto sm:h-auto"
//             : "hidden sm:block"
//         } z-40 bg-gradient-to-b from-[#2b2b2b] via-[#1f1f1f] to-[#0f0f0f] text-white pt-4 px-4 col-span-1`}
//       >
//         <div className="flex flex-col items-center mt-4 space-y-4">
//           <button
//             onClick={() => setShowSidebar(false)}
//             className="sm:hidden text-white text-2xl self-end"
//           >
//             ✕
//           </button>

//           <button
//             onClick={startNewChat}
//             className="mt-10 bg-gradient-to-r from-[#0f766e] to-[#10b981] hover:from-[#065f46] hover:to-[#047857]  transition-all duration-300 cursor-pointer text-white font-semibold py-2 px-6 rounded-xl "
//           >
//             New Chat +
//           </button>

//           <h2 className="text-lg font-semibold text-white mt-10 mb-2">
//             Previous Chats
//           </h2>
//         </div>

//         <div className="text-left space-y-2 overflow-y-auto max-h-[75vh] mt-2 px-1">
//           {chats.map((chat, index) => (
//             <div
//               key={index}
//               className="bg-zinc-700 p-2 rounded-lg flex justify-between items-center"
//             >
//               <button
//                 className="text-left truncate w-full"
//                 onClick={() => {
//                   setResult(chat.messages);
//                   setShowSidebar(false);
//                 }}
//               >
//                 {chat.title}
//               </button>
//               <button
//                 onClick={() => deleteChat(index)}
//                 className="ml-2 hover: cursor-pointer"
//               >
//                 🗑
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="col-span-5 sm:col-span-4 flex flex-col">
//         <div className="sticky top-0 z-30 backdrop-blur-md bg-white/10 bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-[#000000] text-white py-3 px-5 font-semibold text-2xl ">
//           ChatBot AI
//         </div>

//         <div className="text-white overflow-y-auto pl-5 pr-5 pt-5 pb-28 h-[calc(100vh-7rem)] ">
//           {result.length === 0 && (
//             <div className="flex flex-col items-center justify-center h-full text-center text-white">
//               <img
//                 src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
//                 alt="AI Assistant"
//                 className="w-28 h-28 mb-4"
//               />
//               <h2 className="text-2xl font-semibold mb-2">
//                 Welcome to AI Chat
//               </h2>
//               <p className="text-zinc-400">
//                 I'm your smart assistant. Ask me anything to get started!
//               </p>
//             </div>
//           )}

//           <ul>
//             {result.map((item, index) => {
//               const isFirstAIBubble =
//                 !item.isUser &&
//                 !item.isTyping &&
//                 (index === 0 ||
//                   result[index - 1]?.isUser ||
//                   result[index - 1]?.isTyping);

//               return (
//                 <li key={index} className="text-left p-2">
//                   <Answers
//                     ans={item.text}
//                     isUser={item.isUser}
//                     isTyping={item.isTyping}
//                     showAvatar={isFirstAIBubble}
//                   />
//                 </li>
//               );
//             })}

//             <div ref={messagesEndRef} />
//           </ul>
//         </div>

//         <div className="sticky bottom-0 bg-none pt-4 pb-4 px-4 ">
//           <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 w-full sm:w-[90%] md:w-1/2 h-14 p-1 pr-5 text-white mx-auto rounded-4xl border border-zinc-700 flex">
//             <input
//               type="text"
//               placeholder="Ask me anything..."
//               className="w-full h-full p-3 outline-none bg-transparent text-white placeholder-zinc-400 "
//               onChange={handleQuestion}
//               value={question}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") askQuestion();
//               }}
//             />
//             <button
//               onClick={askQuestion}
//               className="px-3 hover:bg-zinc-700 rounded-xl flex items-center justify-center"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-5 h-5 text-white"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M4 4l16 8-16 8V4z"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Main;

import { useState, useRef, useEffect } from "react";
import { URL } from "../Constants/Constants";
import Answers from "../Answers/Answers";

function Main() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [chats, setChats] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [result]);

  const handleQuestion = (e) => setQuestion(e.target.value);

  const askQuestion = async () => {
    if (!question.trim()) return;

    const userMsg = { text: question, isUser: true };
    const typingMsg = { text: "Typing...", isUser: false, isTyping: true };

    setResult((prev) => {
      const clean = prev.filter((msg) => !msg.isTyping);
      return [...clean, userMsg, typingMsg];
    });

    setQuestion("");

    const historyParts = [...result, { text: question, isUser: true }]
      .filter((msg) => !msg.isTyping)
      .map((msg) => ({
        role: msg.isUser ? "user" : "model",
        text: msg.text,
      }));

    const payload = {
      contents: [
        { parts: historyParts.map((entry) => ({ text: entry.text })) },
      ],
    };

    try {
      const res = await fetch(URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      const data = json?.candidates[0]?.content?.parts?.[0]?.text || "";
      const answers = data.split("* ").map((item) => item.trim());

      setResult((prev) => {
        const clean = prev.filter((msg) => !msg.isTyping);
        return [...clean, ...answers.map((text) => ({ text, isUser: false }))];
      });
    } catch {
      setResult((prev) => [
        ...prev.filter((msg) => !msg.isTyping),
        { text: "Error fetching response.", isUser: false },
      ]);
    }
  };

  const startNewChat = () => {
    if (result.length > 0) {
      const first = result.find((msg) => msg.isUser)?.text || "New Chat";
      const title = first.length > 30 ? first.slice(0, 30) + "..." : first;
      setChats((prev) => [...prev, { title, messages: result }]);
    }
    setResult([]);
    setShowSidebar(false);
  };

  const deleteChat = (index) => {
    setChats((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      className="grid grid-cols-5 text-center overflow-hidden"
      style={{ height: "100dvh" }}
    >
      <button
        onClick={() => setShowSidebar(true)}
        className="sm:hidden fixed top-2 left-2 bg-zinc-800 text-white p-1 rounded-lg z-50"
      >
        ☰
      </button>

      <div
        className={`${
          showSidebar
            ? "absolute top-0 left-0 w-full sm:relative sm:w-auto"
            : "hidden sm:block"
        } z-40 bg-gradient-to-b from-[#2b2b2b] via-[#1f1f1f] to-[#0f0f0f] text-white pt-4 px-4 col-span-1`}
        style={{ height: "100dvh" }}
      >
        <div className="flex flex-col items-center mt-4 space-y-4">
          <button
            onClick={() => setShowSidebar(false)}
            className="sm:hidden text-white text-2xl self-end"
          >
            ✕
          </button>

          <button
            onClick={startNewChat}
            className="mt-10 bg-gradient-to-r from-[#0f766e] to-[#10b981] hover:from-[#065f46] hover:to-[#047857]  transition-all duration-300 cursor-pointer text-white font-semibold py-2 px-6 rounded-xl "
          >
            New Chat +
          </button>

          <h2 className="text-lg font-semibold text-white mt-10 mb-2">
            Previous Chats
          </h2>
        </div>

        <div className="text-left space-y-2 overflow-y-auto max-h-[75vh] mt-2 px-1">
          {chats.map((chat, index) => (
            <div
              key={index}
              className="bg-zinc-700 p-2 rounded-lg flex justify-between items-center"
            >
              <button
                className="text-left truncate w-full"
                onClick={() => {
                  setResult(chat.messages);
                  setShowSidebar(false);
                }}
              >
                {chat.title}
              </button>
              <button
                onClick={() => deleteChat(index)}
                className="ml-2 hover: cursor-pointer"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      </div>

      <div
        className="col-span-5 sm:col-span-4 flex flex-col"
        style={{ height: "100dvh" }}
      >
        <div className="shrink-0 sticky top-0 z-30 backdrop-blur-md bg-white/10 bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-[#000000] text-white py-3 px-5 font-semibold text-2xl">
          ChatBot AI
        </div>

        <div className="flex-grow overflow-y-auto pl-5 pr-5 pt-5 pb-28">
          {result.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-white">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
                alt="AI Assistant"
                className="w-28 h-28 mb-4"
              />
              <h2 className="text-2xl font-semibold mb-2">
                Welcome to AI Chat
              </h2>
              <p className="text-zinc-400">
                I'm your smart assistant. Ask me anything to get started!
              </p>
            </div>
          )}

          <ul>
            {result.map((item, index) => {
              const isFirstAIBubble =
                !item.isUser &&
                !item.isTyping &&
                (index === 0 ||
                  result[index - 1]?.isUser ||
                  result[index - 1]?.isTyping);

              return (
                <li key={index} className="text-left p-2">
                  <Answers
                    ans={item.text}
                    isUser={item.isUser}
                    isTyping={item.isTyping}
                    showAvatar={isFirstAIBubble}
                  />
                </li>
              );
            })}
            <div ref={messagesEndRef} />
          </ul>
        </div>

        <div className="shrink-0 sticky bottom-0 bg-none pt-4 pb-4 px-4">
          <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 w-full sm:w-[90%] md:w-1/2 h-14 p-1 pr-5 text-white mx-auto rounded-4xl border border-zinc-700 flex">
            <input
              type="text"
              placeholder="Ask me anything..."
              className="w-full h-full p-3 outline-none bg-transparent text-white placeholder-zinc-400 "
              onChange={handleQuestion}
              value={question}
              onKeyDown={(e) => {
                if (e.key === "Enter") askQuestion();
              }}
            />
            <button
              onClick={askQuestion}
              className="px-3 hover:bg-zinc-700 rounded-xl flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4l16 8-16 8V4z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
