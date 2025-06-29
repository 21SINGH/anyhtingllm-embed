import ChatWindowHeader from "./Header";
import useChatHistory from "@/hooks/chat/useChatHistory";
import ChatContainer from "./ChatContainer";
import { ChatHistoryLoading } from "./ChatContainer/ChatHistory";
import { useState } from "react";
import { embedderSettings } from "@/main";
import ReactMarkdown from "react-markdown";

export default function ChatWindow({
  closeChat,
  settings,
  sessionId,
  isLargeScreen,
  nudgeText,
  followUpQuestion,
  loadingFollowUpQuestion,
}) {
  const { chatHistory, setChatHistory, loading } = useChatHistory(
    settings,
    sessionId
  );
  const [openBottomSheet, setOpenBottomSheet] = useState(false);

  if (loading) {
    return (
      <div className="allm-flex allm-flex-col allm-h-full md:allm-rounded-[24px] allm-overflow-hidden ">
        <ChatWindowHeader
          chatHistory={chatHistory}
          sessionId={sessionId}
          settings={settings}
          iconUrl={settings.brandImageUrl}
          closeChat={closeChat}
          setChatHistory={setChatHistory}
          setOpenBottomSheet={setOpenBottomSheet}
          isLargeScreen={isLargeScreen}
        />
        <div
          className="allm-flex-grow allm-overflow-y-auto allm-overscroll-contain"
          style={{ backgroundColor: settings.bgColor }}
        >
          <ChatHistoryLoading />
        </div>
      </div>
    );
  } 
  // else if (loadingFollowUpQuestion) {
  //   return (
  //     <div className="allm-flex allm-flex-col allm-h-full md:allm-rounded-[24px] allm-overflow-hidden ">
  //       <ChatWindowHeader
  //         chatHistory={chatHistory}
  //         sessionId={sessionId}
  //         settings={settings}
  //         iconUrl={settings.brandImageUrl}
  //         closeChat={closeChat}
  //         setChatHistory={setChatHistory}
  //         setOpenBottomSheet={setOpenBottomSheet}
  //         isLargeScreen={isLargeScreen}
  //       />
  //       <div
  //         className="allm-flex-grow allm-overflow-y-auto allm-overscroll-contain"
  //         style={{ backgroundColor: settings.bgColor }}
  //       >
  //         <div
  //           className={`allm-flex allm-items-start allm-w-full allm-h-fit allm-justify-start `}
  //         >
  //           <div
  //             style={{
  //               wordBreak: "break-word",
  //               backgroundColor: settings.assistantBgColor,
  //             }}
  //             className={`allm-py-[11px] allm-px-[16px] allm-flex allm-flex-col  allm-max-w-[80%] ${`${embedderSettings.ASSISTANT_STYLES.base} allm-anything-llm-assistant-message allm-mt-[12px] allm-ml-[4px]`}`}
  //           >
  //             <div className="allm-flex allm-flex-col">
  //               <ReactMarkdown
  //                 children={nudgeText}
  //                 components={{
  //                   p: ({ node, ...props }) => (
  //                     <p
  //                       className="allm-m-0 allm-text-[14px] allm-leading-[20px]"
  //                       style={{
  //                         color: settings.botTextColor,
  //                       }}
  //                       {...props}
  //                     />
  //                   ),
  //                 }}
  //               />
  //             </div>
  //           </div>
  //         </div>
  //         <div className="allm-flex allm-items-end allm-justify-end allm-w-[420px]">
  //           <PromptShimmer />
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  setEventDelegatorForCodeSnippets();

  return (
    <div className="allm-flex allm-flex-col allm-h-full md:allm-rounded-[24px] allm-overflow-hidden ">
      <ChatWindowHeader
        chatHistory={chatHistory}
        sessionId={sessionId}
        settings={settings}
        iconUrl={settings.brandImageUrl}
        closeChat={closeChat}
        setChatHistory={setChatHistory}
        setOpenBottomSheet={setOpenBottomSheet}
        isLargeScreen={isLargeScreen}
      />
      <div
        className="allm-flex-grow allm-overflow-y-auto allm-overscroll-contain"
        style={{ backgroundColor: settings.bgColor }}
      >
        <ChatContainer
          sessionId={sessionId}
          settings={settings}
          knownHistory={chatHistory}
          openBottomSheet={openBottomSheet}
          setOpenBottomSheet={setOpenBottomSheet}
          nudgeText={nudgeText}
          followUpQuestion={followUpQuestion}
          loadingFollowUpQuestion={loadingFollowUpQuestion}
        />
      </div>
    </div>
  );
}

// Enables us to safely markdown and sanitize all responses without risk of injection
// but still be able to attach a handler to copy code snippets on all elements
// that are code snippets.
function copyCodeSnippet(uuid) {
  const target = document.querySelector(`[data-code="${uuid}"]`);
  if (!target) return false;

  const markdown =
    target.parentElement?.parentElement?.querySelector(
      "pre:first-of-type"
    )?.innerText;
  if (!markdown) return false;

  window.navigator.clipboard.writeText(markdown);

  target.classList.add("allm-text-green-500");
  const originalText = target.innerHTML;
  target.innerText = "Copied!";
  target.setAttribute("disabled", true);

  setTimeout(() => {
    target.classList.remove("allm-text-green-500");
    target.innerHTML = originalText;
    target.removeAttribute("disabled");
  }, 2500);
}

// Listens and hunts for all data-code-snippet clicks.
function setEventDelegatorForCodeSnippets() {
  document?.addEventListener("click", function (e) {
    const target = e.target.closest("[data-code-snippet]");
    const uuidCode = target?.dataset?.code;
    if (!uuidCode) return false;
    copyCodeSnippet(uuidCode);
  });
}
