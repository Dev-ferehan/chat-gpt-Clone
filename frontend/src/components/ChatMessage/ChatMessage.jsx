import React from "react";
import { User, Bot } from "lucide-react";
import styles from "./chatMessage.module.css";
import ReactMarkdown from "react-markdown";
function ChatMessage({ content, role }) {
  return (
    <div className={`${styles.message} ${styles[role]}`}>
      <div className={`${styles.avatar} ${styles[role]}`}>
        {role === "user" ?
          <User size={18} color="white" />
        : <Bot size={18} color="white" />}
      </div>


      <div className={styles.content}>
        {role === "user" ?
       ( content )
        :( <div className={styles.markdownBody}>
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>)
        }
      </div>
    </div>
  );
}

export default ChatMessage;
