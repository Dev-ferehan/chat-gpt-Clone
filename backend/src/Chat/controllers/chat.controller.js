import { createChatService ,getRecentConversationRow} from "../services/chat.service.js";
export async  function createConversationController(req,res) {
    console.log("create conversation controller");
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
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: err.message
    });
   }
    
}
export async function createConversationGet(req,res){
    console.log("create conversation get controller");
 try{
    const result=await getRecentConversationRow(100);
    res.status(200).json({
success:true,
message:"conversation fetched successfully",
data:result
    })
 }catch(err){
    console.log("get fetch error ",err)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
      error: err.message
    });
 }

}
