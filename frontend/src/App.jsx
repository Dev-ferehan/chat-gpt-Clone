import React,{useState} from 'react'
import axios from 'axios'
import Sidebar from './components/SideBar/SideBar.jsx'
import ChatHeader from './components/ChatHeader/ChatHeader.jsx'
import MessageList from './components/MessageList/MessageList.jsx'
import { useEffect,useRef } from 'react'
import ChatInput from './components/ChatInput/ChatInput.jsx'

function App() {
  const [conversation, setConversation] = useState([]);
  const [isLoading,setIsLoading]=useState(false)
  const LastMessageEndRef=useRef(null);

async function fetchConversation(){
try{
  const result=await axios.get('http://localhost:9000/api/chat/conversation');
 setConversation(result?.data?.data)
}catch(err){
  console.log("error",err)
}
}
async function submitHandler(question){
  if(question.trim()===''){
    return
  }
  const tempQuestion={
    id:Date.now(),
    content:question.trim(),
    role:'user'
  }
  setConversation(prev=>[...prev,tempQuestion])
try{
  setIsLoading(true)
  const {data}=await axios.post('http://localhost:9000/api/chat/conversation',{
    question:question.trim()
  })
  setConversation(prev=>[...prev,data?.data?.assistantConversation])
}catch(err){
  console.log(err.message)
}finally{
  setIsLoading(false)

}
}
useEffect(()=>{
  fetchConversation();
},[])
useEffect(()=>{
  LastMessageEndRef.current?.scrollIntoView({  behavior: 'smooth'})   
},[conversation,LastMessageEndRef])
  return (
    <div className="app">
      <Sidebar />
      <main className='main'>
<ChatHeader/>
<MessageList conversation={conversation} isLoading={isLoading}  LastMessageEndRef={LastMessageEndRef}/>
<ChatInput submitHandler={submitHandler} isLoading={isLoading}/>
      </main>
    </div>

  )
}

export default App
