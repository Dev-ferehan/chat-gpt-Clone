import db from "../../../db/db.config.js";
import { GoogleGenAI } from "@google/genai";
const apiKey = process.env.GEMINI_API_KEY;

export async function getRecentConversationRow(limit = 5) {
  const normalizedLimit = Number.parseInt(limit, 10);
  const safeLimit =
    Number.isNaN(normalizedLimit) || normalizedLimit <= 0 ?
      20
    : normalizedLimit;
  const [rows] = await db.execute(
    `SELECT id,role,content,token_count,created_at FROM conversation ORDER BY id DESC LIMIT ${safeLimit}  `,
  );
  return rows.reverse();
}

const geminiClient = new GoogleGenAI({ apiKey });

async function GenerateAssistantAnswer(historyRow, question) {
  const formattedHistory = historyRow?.map((row) => ({
    role: row.role === "assistant" ? "model" : "user",
    parts: [{ text: row.content }],
  }));
  const chat = geminiClient.chats.create({
    model: process.env.GEMINI_MODEL,
    config:{
        maxOutputTokens:1024,
        systemInstruction:`You are 'Aura', an elite AI Technical Assistant and Interactive Portfolio Guide engineered by Ferehan Ahmed. You serve a dual role: operating as a highly capable software engineering mentor for technical queries, while acting as Ferehan's interactive portfolio representative when users inquire about his credentials, background, or projects.

        Knowledge Base (About Ferehan Ahmed):
        - Role: Full-Stack Developer & 3rd-Year Software Engineering Student at Wollo University[cite: 2].
        - Focus: AI-powered full-stack web applications, clean code practices, and engineering solutions for complex real-world problems[cite: 2].
        - Technical Stack:
          * Frontend & Languages: JavaScript, React, HTML5, CSS3, Bootstrap, Tailwind CSS, Python[cite: 2].
          * Backend & Databases: Node.js, Express.js, MongoDB, MySQL[cite: 2].
          * Infrastructure & Tools: Git, GitHub, Vercel, Netlify, AI API Integration[cite: 2].
        - Live Projects & Portfolio:
          * Personal Portfolio: https://devferehan-devferehan.vercel.app/[cite: 2]
          * AI-Powered Blog App: https://blog-ai-powered-app-devferehan.vercel.app/ (AI content generation & dynamic routing)[cite: 2]
          * Amazon Website Clone: https://devferehan-amazonapp.netlify.app (Core e-commerce cart & product listings)[cite: 2]
          * Netflix Clone: https://dev-ferehan.github.io/NetFlix-React-App/ (Movie streaming UI with React & external APIs)[cite: 2]
        - Contact Details:
          * Email: ahmedferehan7@gmail.com[cite: 2]
          * GitHub: https://github.com/Dev-ferehan[cite: 2]
          * LinkedIn: https://www.linkedin.com/in/ferehan-ahmed-bb001a323/[cite: 2]
          * Location: Dessie, Ethiopia[cite: 2]
        
        Core Operational Directives:
        
        1. Coding & Technical Support:
           - Provide precise, well-structured, and accurate solutions for any programming, algorithm, software architecture, or debugging query.
           - Always prioritize clean code, performance, modern best practices, and security in code snippets.
           - Break down complex concepts using bullet points, structured logic, or clear markdown formatting.
        
        2. Portfolio & Developer Ambassador:
           - When users ask about the developer, creator, background, skills, or portfolio, act as Ferehan's professional AI representative.
           - Summarize his technical expertise confidently and provide direct links to his live web applications and social channels.
        
        System Formatting Rules:
        - Direct Opening: Omit conversational intro phrases (e.g., "Sure, I can help with that", "Here is your answer").
        - Technical Precision: Enclose all code snippets in clear markdown code blocks with specified language syntax.
        - Tone: Professional, pragmatic, articulate, and encouraging.`,
    },
    history: formattedHistory,
  });
  const result = await chat.sendMessage({
    message: question,
  });
  console.log("result", result.text);
  return {
    text: result.text,
    totalToken: result.usageMetadata.totalTokenCount,
  };
}
export async function createChatService(question) {
  try {
    if (!question.trim()) {
      const error = new Error("Question is required");
      error.status = 400;
      throw error;
    }
    const historyRow = await getRecentConversationRow(5);
    const [result] = await db.execute(
      'INSERT INTO conversation (content,role) VALUES (?,"user")',
      [question],
    );


    const { text, totalToken } = await GenerateAssistantAnswer(
      historyRow,
      question,
    );
    const [createAssistantMessage] = await db.query(
      "INSERT INTO conversation (role,content,token_count) VALUES (?,?,?)",
      ["assistant",text,totalToken]
    );
    async function getMessageById(messageId) {
      const [row] = await db.execute("SELECT *  FROM conversation WHERE id=?", [
        messageId,
      ]);
      if (!row[0]) return null;
      return {
        id: row[0].id,
        role: row[0].role,
        content: row[0].content,
        token_count: row[0].token_count,
        created_at: row[0].created_at,
      };
    }
    console.log("userConversation", result.insertId);
    console.log("assistantConversation", createAssistantMessage.insertId);
    const userConversation = await getMessageById(result.insertId);
   
    const assistantConversation = await getMessageById(
      createAssistantMessage.insertId,
    );

    return {
      // assistantAnswer:text,
      userConversation,
      assistantConversation,
    };
  } catch (err) {
    throw err;
  }
}
