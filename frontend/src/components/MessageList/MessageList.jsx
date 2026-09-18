import React from "react";
import ChatMessage from "../ChatMessage/ChatMessage";
import styles from './messageList.module.css'
import { Bot } from "lucide-react";
function MessageList({ conversation,isLoading,LastMessageEndRef }) {
  return (
    <div className={styles.messages}>
      {
        conversation.length===0 ? (
<div className={styles.empty}>what are you working on?</div>
        ):(
          conversation.map((msg) => (
            <ChatMessage key={msg.id} content={msg.content} role={msg.role} />
            ))
        )
      }
          {isLoading && (
              <div className={styles.loadingContainer}>
                <div className={styles.loadingAvatar}>
                  <Bot size={18} color='white' />
                </div>
                <div className={styles.loading}>
                  <div className={styles.loadingDot}></div>
                  <div className={styles.loadingDot}></div>
                  <div className={styles.loadingDot}></div>
                </div>
              </div>
            )}
      <div ref={LastMessageEndRef}/>
    </div>

  );
}

export default MessageList;
