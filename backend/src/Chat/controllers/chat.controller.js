import { createChatService ,getRecentConversationRow} from "../services/chat.service.js";
export async  function createConversationController(req,res) {
   try{
    // res.send("create conversation api")
    const  { question } = req.body;
const result= await createChatService(question);
res.status(200).json({
    status:true,
 message:"conversation posted successfully",
    data:result
})
   }catch(err){
    console.log("error happened",err)
   }
    
}
export async function createConversationGet(req,res){
 try{
    const result=await getRecentConversationRow(100);
    res.status(200).json({
success:true,
message:"conversation fetched successfully",
data:result
    })
 }catch(err){
    console.log("get fetch error ",err)
 }

}
