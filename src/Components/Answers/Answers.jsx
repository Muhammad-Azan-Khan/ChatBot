import { useEffect, useState } from "react";
import { checkHeading, replaceHeadingStars } from "../Constants/Constants";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkDown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import image from "../images/person.png";
import bot from "../images/bot.png";

function Answers({ ans, isUser, isTyping, showAvatar }) {
  const [heading, setHeading] = useState(false);
  const [answer, setAnswer] = useState(ans);

  useEffect(() => {
    if (!isUser && checkHeading(ans)) {
      setHeading(true);
      setAnswer(replaceHeadingStars(ans));
    } else {
      setHeading(false);
      setAnswer(ans);
    }
  }, [ans, isUser]);

  if (isUser) {
    return (
      <div className="mt-6 pr-3 flex justify-end items-end gap-2">
        <div className="bg-gradient-to-r from-[#0f766e] to-[#10b981] text-white px-4 py-2 rounded-2xl rounded-br-sm max-w-[80%] shadow-md text-sm">
          {answer}
        </div>
        <img
          src={image}
          alt="User"
          className="w-6 h-6 rounded-full object-cover"
        />
      </div>
    );
  }

  if (isTyping) {
    return (
      <div className="mt-3 pl-5 text-zinc-400 italic animate-pulse">
        Typing...
      </div>
    );
  }

  const customDark = {
    ...dark,
    'pre[class*="language-"]': {
      ...dark['pre[class*="language-"]'],
      background: "black",
      border: "black",
      boxShadow: "0 0 20px black",
    },
  };

  const renderer = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const cleanedChildren = String(children).replace(/\n$/, "");

      return !inline && match ? (
        <SyntaxHighlighter
          {...props}
          children={cleanedChildren}
          language={match[1]}
          style={customDark}
          pretag="div"
        />
      ) : (
        <code {...props} className={className}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className="mt-3 flex items-start gap-2">
      {showAvatar && (
        <img src={bot} alt="AI" className="w-6 h-6 rounded-full object-cover" />
      )}
      <div>
        {heading ? (
          <span className="block text-lg text-white pl-1">
            <b>• {answer}</b>
          </span>
        ) : (
          <span className="block text-zinc-300 pl-1">
            <ReactMarkDown components={renderer}>{answer}</ReactMarkDown>
          </span>
        )}
      </div>
    </div>
  );
}

export default Answers;
