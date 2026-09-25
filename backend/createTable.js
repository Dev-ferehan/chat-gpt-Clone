import db from "./db/db.config.js";

const createConversationTableSQL = `
CREATE TABLE IF NOT EXISTS conversation (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role ENUM ('user','assistant') NOT NULL,
    content TEXT NOT NULL,
    token_count INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;

async function createTable() {
  try {  
    await db.query(createConversationTableSQL);
    console.log("conversation Table created successfully!");

    process.exit(0);
  } catch (err) {
    console.error("Failed to create table:", err.message);
    process.exit(1);
  }
}

createTable();