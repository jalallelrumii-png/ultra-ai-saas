import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { masterData, pertanyaan } = await req.json();
    
    const groq = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: `Anda adalah AI Spesialis Data. Tugas Anda adalah membantu menjawab pertanyaan 
          HANYA berdasarkan MASTER DATA yang diberikan di bawah ini. 
          Jika user bertanya di luar konteks data, jawab bahwa Anda tidak memiliki informasi tersebut.
          
          MASTER DATA:
          ${masterData}` 
        },
        { role: "user", content: pertanyaan }
      ],
      model: "llama-3.3-70b-versatile",
    });

    return NextResponse.json({ jawaban: completion.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: "Gagal olah data server" }, { status: 500 });
  }
}