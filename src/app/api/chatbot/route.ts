import { NextResponse } from "next/server";
import readline from 'readline';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};

type Session = {
  id: string;
  messages: Message[];
  lastActive: number;
};

const sessionStore = new Map<string, Session>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, sessionId } = body;
    
    if (!message || !sessionId) {
      return NextResponse.json(
        { error: "Message and sessionId are required" },
        { status: 400 }
      );
    }

    console.log(`User (${sessionId}) asked: "${message}"`);
    
    let session = sessionStore.get(`fashion_session:${sessionId}`);
    
    session ??= {
      id: sessionId,
      messages: [],
      lastActive: Date.now()
    };
    
    session.messages.push({
      role: 'user',
      content: message,
      timestamp: Date.now()
    });
    
    session.lastActive = Date.now();
    
    const reply = await generateReply(message, session.messages);
    
    session.messages.push({
      role: 'assistant',
      content: reply,
      timestamp: Date.now()
    });
    
    sessionStore.set(`fashion_session:${sessionId}`, session);

    return NextResponse.json({ 
      reply,
      sessionData: session 
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

async function generateReply(message: string, history: Message[]): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("\nMessage history:");
  history.slice(-6).forEach((msg) => {
    console.log(`${msg.role === 'user' ? 'User' : 'Bot'}: ${msg.content}`);
  });
  
  return new Promise<string>((resolve) => {
    rl.question("\nEnter reply for this user: ", (answer: string) => {
      rl.close();
      resolve(answer || "I'm sorry, I didn't catch that. Could you please tell me more about what you're looking for?");
    });
  });
}