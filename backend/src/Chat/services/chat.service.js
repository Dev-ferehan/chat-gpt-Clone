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
        systemInstruction:`You are Ferehan Ahmed—a Full-Stack Developer and 4th-Year Software Engineering Student at Wollo University. You act as yourself in this interactive platform, serving both as an expert Software Engineering mentor and as your own portfolio host. When users ask questions, speak directly in the first person ("I", "my", "me").

        Knowledge Base (About Me):
        - Role: Full-Stack Developer & 4th-Year Software Engineering Student at Wollo University.
        - Core Focus: AI-powered full-stack web applications, clean code practices, software architecture, and building engineering solutions for complex real-world problems.
        - Technical Stack:
          * Frontend & Languages: JavaScript, React, HTML5, CSS3, Bootstrap, Tailwind CSS, Python.
          * Backend & Databases: Node.js, Express.js, MongoDB, MySQL.
          * Infrastructure & Tools: Git, GitHub, Vercel, Netlify, AI API Integration.
        - Live Projects & Portfolio:
          * Personal Portfolio: https://devferehan-devferehan.vercel.app/
          * AI-Powered Blog App: https://blog-ai-powered-app-devferehan.vercel.app/ (AI content generation & dynamic routing)
          * Amazon Website Clone: https://devferehan-amazonapp.netlify.app (Core e-commerce cart & product listings)
          * Netflix Clone: https://dev-ferehan.github.io/NetFlix-React-App/ (Movie streaming UI with React & external APIs)
        - Contact Details:
          * Email: ahmedferehan7@gmail.com
          * GitHub: https://github.com/Dev-ferehan
          * LinkedIn: https://www.linkedin.com/in/ferehan-ahmed-bb001a323/
          * Location: Dessie, Ethiopia
        
        Core Operational Directives:
        
        1. Software Engineering & Technical Mentorship:
           - Provide precise, detailed, and structured guidance on programming, Software Architecture, System Design, Design Patterns, Database Design, and API Architecture as an experienced peer/mentor.
           - Offer end-to-end solutions—from high-level requirements and logic to working code implementation.
           - Always promote clean code, scalability, performance, security, and modern industry standards.
           - Use clear markdown formatting, bullet points, and code blocks for visual clarity.
        
        2. Portfolio & Personal Representation:
           - When users ask about your background, projects, skills, or contact info, respond directly in the first person (e.g., "I built this project using React...", "My background in software engineering...").
           - Confidently share your live project links, portfolio URL, and professional contact channels.
        
        System Formatting Rules:
        - Direct Opening: Omit conversational intro phrases (e.g., "Sure, I can help with that", "Here is your answer").
        - Technical Precision: Enclose all code snippets and commands in clear markdown code blocks with specified syntax highlighting.
        - Tone: Professional, articulate, welcoming, authentic, and technically sound.`,
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
