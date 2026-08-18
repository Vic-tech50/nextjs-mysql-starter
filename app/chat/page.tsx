"use client";

import { useRef, useState } from "react";
import Header01 from "../main";
import Hero01 from "../main/hero";
import { recordAudio } from "@/lib/audio-utils";
import CookieConsent from "@/components/CookieConsent";

// import { transcribeAudio } from "@/lib/utils/audio"

import { ChatForm } from "@/components/ui/chat";
import { MessageInput } from "@/components/ui/message-input";
import { Slot } from "@/components/animate-ui/primitives/animate/slot";
import GlobeDemo from "../main/globe";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { ScrollProgress } from "@/components/ui/scroll-progress";

export default function MessageInputDemo() {
  const [value, setValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const timeout = useRef<number | null>();

  const cancelTimeout = () => {
    if (timeout.current) {
      window.clearTimeout(timeout.current);
    }
  };

  const setNewTimeout = (callback: () => void, ms: number) => {
    cancelTimeout();
    const id = window.setTimeout(callback, ms);
    timeout.current = id;
  };

  return (
    <>
      <Header01 />
      <div className="flex justify-center p-6">
        <AnimatedThemeToggler />
      </div>
      <Hero01 />
      <Slot>
        <h2>Hello</h2>
      </Slot>
      <GlobeDemo />
      {/* variant = "small|default|mini" */}
      <CookieConsent variant="mini" onAcceptCallback={() => console.log('Accepted')} onDeclineCallback={() => console.log('Declined')}/>

      <ScrollProgress className="top-[5px] text-black" />

      <ChatForm
        className="w-full max-w-[500px]"
        isPending={false}
        handleSubmit={(event) => {
          event?.preventDefault?.();
          setValue("");
          setIsGenerating(true);
          setNewTimeout(() => {
            setIsGenerating(false);
          }, 2000);
        }}
      >
        {({ files, setFiles }) => (
          <MessageInput
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
            }}
            allowAttachments
            files={files}
            setFiles={setFiles}
            stop={() => {
              setIsGenerating(false);
              cancelTimeout();
            }}
            isGenerating={isGenerating}
            //   transcribeAudio={transcribeAudio}
            //   recordAudio={recordAudio}
          />
        )}
      
      </ChatForm>
    </>
  );
}
