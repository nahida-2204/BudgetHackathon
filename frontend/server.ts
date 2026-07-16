import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini client successfully initialized.");
  } catch (err) {
    console.error("Failed to initialize Gemini client:", err);
  }
} else {
  console.log("GEMINI_API_KEY is not defined. Using smart local fallback for budget simplification.");
}

// Simple fallback dataset for common examples to ensure instant/stable offline responses when API key is missing
const FALLBACK_SIMPLIFICATIONS: Record<string, { english: string; kreol: string }> = {
  "tax relief": {
    english: "The tax exemption threshold is being raised, meaning you will pay less income tax, leaving more money in your pocket each month.",
    kreol: "Peyman taks pe baise, sa vedir ou pou gagne plis kas dan ou poset sak lafin de mwa."
  },
  "pension reform": {
    english: "The basic retirement pension is increased to Rs 13,500 monthly, guaranteeing a more dignified retirement with better financial stability for our seniors.",
    kreol: "Pansyon retret pe monte ziska Rs 13,500 sak mwa, sa pou permet nou bann gran dimoune viv pli dygne ek pli bien."
  },
  "special allowance": {
    english: "Workers will get an extra Rs 1,000 allowance to help with the rising cost of living. There are new rules on who earns enough to qualify.",
    kreol: "Travayer pou gagn enn ekstra Rs 1,000 allowance pou ed zot ar lavi ki pe vinn ser. Ena nouvo regleman lor komie ou bizin gagne pou kalifie."
  }
};

// API Endpoint for simplifying budget measures
app.post("/api/simplify", async (req: Request, res: Response) => {
  const { text } = req.body;

  if (!text || typeof text !== "string") {
    res.status(400).json({ error: "Text prompt is required." });
    return;
  }

  const normalizedText = text.toLowerCase().trim();

  // 1. Check if we can use a quick fallback for mock demo keywords if Gemini is not set up
  if (!ai) {
    let matched = FALLBACK_SIMPLIFICATIONS["special allowance"]; // Default fallback
    if (normalizedText.includes("tax") || normalizedText.includes("relief") || normalizedText.includes("threshold")) {
      matched = FALLBACK_SIMPLIFICATIONS["tax relief"];
    } else if (normalizedText.includes("pension") || normalizedText.includes("reform") || normalizedText.includes("retirement")) {
      matched = FALLBACK_SIMPLIFICATIONS["pension reform"];
    } else if (normalizedText.includes("allowance") || normalizedText.includes("worker") || normalizedText.includes("increased")) {
      matched = FALLBACK_SIMPLIFICATIONS["special allowance"];
    } else {
      // Dynamic fallback template
      matched = {
        english: `Simplified: We are updating the measures to assist citizens. Let's make sure public funds are allocated transparently to support local development.`,
        kreol: `Tradiksion: Pe aziste bann mezir pou ed tou dimounn. Nou bizin fer sir ki depans piblik pe al ver progre ek devlopman lokal.`
      };
    }
    res.json({
      success: true,
      simplifiedText: matched.english,
      kreolText: matched.kreol,
      usingFallback: true
    });
    return;
  }

  // 2. Query Gemini API
  try {
    const prompt = `You are a public relations expert for the Republic of Mauritius Ministry of Finance.
Analyze this technical or legalese national budget statement:
"${text}"

Provide a highly accessible, jargon-free explanation:
1. "english": A simplified, clear, friendly 1-2 sentence explanation in English that an ordinary citizen can immediately understand.
2. "kreol": A natural, accurate, and easy-to-read translation of the simplified explanation in Mauritian Kreol (Kreol Morisien).

Use the requested JSON schema. Do not include any formatting or other text.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            english: {
              type: Type.STRING,
              description: "The simplified budget explanation in English."
            },
            kreol: {
              type: Type.STRING,
              description: "The simplified budget explanation translated to Mauritian Kreol (Kreol Morisien)."
            }
          },
          required: ["english", "kreol"]
        }
      }
    });

    const resultText = response.text?.trim() || "";
    const parsed = JSON.parse(resultText);

    res.json({
      success: true,
      simplifiedText: parsed.english,
      kreolText: parsed.kreol,
      usingFallback: false
    });
  } catch (error: any) {
    console.error("Gemini simplify error:", error);
    // Graceful error fallback
    res.json({
      success: true,
      simplifiedText: `We are analyzing this measure. It involves fiscal changes designed to adjust public contributions and social funding to better match the current economic climate.`,
      kreolText: `Nou pe analiz sa mezir-la. Li konsern sanzman fiskal pou aziste kontribision piblik ek bann finansman sosial pou pli bien adapte ar sitiasion ekonomis zordi.`,
      usingFallback: true,
      error: error.message
    });
  }
});
// Proxy FastAPI spendings through the React/Express server
app.get("/api/spendings", async (_req: Request, res: Response) => {
  try {
    const backendResponse = await fetch("http://127.0.0.1:8000/api/spendings");
    res.status(backendResponse.status).json(await backendResponse.json());
  } catch (error) {
    console.error("FastAPI spendings proxy error:", error);
    res.status(502).json({ error: "Could not connect to the FastAPI backend." });
  }
});

app.get("/api/measures", async (_req: Request, res: Response) => {
  try {
    const r = await fetch("http://127.0.0.1:8000/api/measures");
    res.status(r.status).json(await r.json());
  } catch (error) {
    console.error("FastAPI measures proxy error:", error);
    res.status(502).json({ error: "Could not connect to the FastAPI backend." });
  }
});

app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const r = await fetch("http://127.0.0.1:8000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    res.status(r.status).json(await r.json());
  } catch (error) {
    console.error("FastAPI chat proxy error:", error);
    res.status(502).json({ error: "Could not connect to the FastAPI backend." });
  }
});
// Configure Vite integration for dev, static serving for prod
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite development middleware...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving production build from dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Smart Budget Moris server listening on port ${PORT}`);
  });
}

setupServer();
