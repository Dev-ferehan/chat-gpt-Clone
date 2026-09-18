import { ArrowUp, Plus,Mic } from "lucide-react";
import styles from "./chatInput.module.css";
import { useState } from "react";

export default function ChatInput({submitHandler,isLoading}) {
  const [Input, setInput] = useState("");
  async function HandleSubmit(e) {
    e.preventDefault();
        submitHandler(Input)
        setInput('')
  }
  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={HandleSubmit}>
        <div className={styles.icon}>
          <Plus size={20} />
        </div>
        <input
          type="text"
          className={styles.input}
          placeholder="Ask anything"
          value={Input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        {
          Input?.trim()!=='' ?(
            <button type="submit" className={styles.submitBtn}>
            <ArrowUp size={18} />
          </button>
          ):(
         <>
            <div className={styles.icon}>
            <Mic size={18} />
          </div>
         
         </>
          )
        }
       
      </form>
    </div>
  );
}
