import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser middleware
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Lazy GoogleGenAI initialization
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// 1. Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// 2. Crop Disease Diagnosis Endpoint (Multimodal)
app.post("/api/gemini/diagnose-crop", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", cropName, symptoms, language = "English" } = req.body;

    if (!imageBase64 && !symptoms) {
      return res.status(400).json({ error: "Please provide a crop image or description of symptoms." });
    }

    const ai = getGeminiClient();

    const parts: any[] = [];
    if (imageBase64) {
      // Strip data url prefix if present
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      parts.push({
        inlineData: {
          mimeType: mimeType || "image/jpeg",
          data: cleanBase64,
        },
      });
    }

    const promptText = `You are a world-class senior agricultural pathologist and crop specialist.
Analyze this plant/crop sample thoroughly.
Target Crop: ${cropName || "Unknown / Detect from image"}
Observed Symptoms: ${symptoms || "Visual leaf/fruit/stem analysis"}
Output Language: ${language}

Provide a comprehensive diagnosis formatted as JSON with the following schema:
- cropIdentified: Name of the crop
- diseaseName: Primary disease/pest name (e.g. "Early Blight", "Yellow Mosaic Virus", "Fall Armyworm", or "Healthy Crop")
- scientificName: Pathogen or pest scientific name (e.g. Alternaria solani)
- confidenceScore: integer percentage 0-100
- severity: "Healthy" | "Low" | "Moderate" | "Severe" | "Critical"
- affectedPart: "Leaves" | "Stem" | "Roots" | "Fruit/Grain" | "Whole Plant"
- primaryCause: Detailed explanation of pathogen, nutrient deficiency, or pest vector
- favorableConditions: Weather or soil conditions that triggered this (e.g. high humidity >85%, warm nights)
- organicRemedies: Array of 3-5 organic/bio-control treatments (e.g., Neem oil 5ml/L, Trichoderma viride, Cow urine extract, Bordeaux mixture)
- chemicalRemedies: Array of 2-4 standard agrochemical treatments with exact dosage per acre/liter and safety instructions
- preventativeMeasures: Array of 3-5 actions for next crop cycle (crop rotation, resistant cultivars, seed treatment)
- irrigationAdvice: Specific watering recommendation during this disease stage
- summaryAdvice: A concise, empathetic, high-clarity 2-sentence summary instructions in ${language}`;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cropIdentified: { type: Type.STRING },
            diseaseName: { type: Type.STRING },
            scientificName: { type: Type.STRING },
            confidenceScore: { type: Type.INTEGER },
            severity: { type: Type.STRING },
            affectedPart: { type: Type.STRING },
            primaryCause: { type: Type.STRING },
            favorableConditions: { type: Type.STRING },
            organicRemedies: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            chemicalRemedies: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            preventativeMeasures: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            irrigationAdvice: { type: Type.STRING },
            summaryAdvice: { type: Type.STRING },
          },
          required: [
            "cropIdentified",
            "diseaseName",
            "confidenceScore",
            "severity",
            "primaryCause",
            "organicRemedies",
            "chemicalRemedies",
            "preventativeMeasures",
            "summaryAdvice",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, diagnosis: parsed });
  } catch (error: any) {
    console.error("Diagnosis error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to analyze crop pathology",
    });
  }
});

// 3. Agronomist AI Chat Advisor (Multilingual with agricultural expertise)
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages, farmContext, language = "English" } = req.body;

    const ai = getGeminiClient();

    const systemInstruction = `You are "AgriSmart Expert", a top-tier digital agronomist and practical farming companion for smallholder and commercial farmers worldwide.
Your goal is to give direct, high-value, actionable, cost-effective agricultural solutions.
User's Preferred Language: ${language} (Always respond naturally in ${language}, with local terminology like mandi, kharif, rabi, zayed, jeevamrut, bigha/acre where relevant).
Farm Context: ${JSON.stringify(farmContext || {})}

Guidelines:
- Give clear step-by-step advice (dosages per acre or liter, application timings, soil test interpretation).
- Emphasize sustainable, regenerative, and IPM (Integrated Pest Management) methods alongside safe conventional options.
- Keep tone respectful, encouraging, and easy to understand for working farmers.
- Use formatting (bullet points, bold key steps) for maximum readability in the field.`;

    const chatHistory = (messages || []).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: chatHistory,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({
      success: true,
      reply: response.text,
    });
  } catch (error: any) {
    console.error("Chat error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Agronomist chat failed",
    });
  }
});

// 4. Precision NPK & Fertilizer/Irrigation Schedule Generator
app.post("/api/gemini/fertilizer-plan", async (req, res) => {
  try {
    const { crop, acreage, unit, soilType, stage, soilTest, language = "English" } = req.body;

    const ai = getGeminiClient();

    const prompt = `Generate a precision agronomic fertilization and irrigation schedule.
Crop: ${crop}
Land Area: ${acreage} ${unit || "Acres"}
Soil Type: ${soilType}
Growth Stage: ${stage}
Soil Test / NPK Status: ${JSON.stringify(soilTest || {})}
Language: ${language}

Return structured JSON with:
- cropSummary: overview of nutrient demands for this stage
- npkRatioRecommended: (e.g., "120:60:40 kg/ha")
- basalApplication: list of fertilizers (Urea, DAP, SSP, MOP, Compost) with exact quantity in kg/bags
- topDressingStages: array of objects with { stageName, daysAfterSowing, fertilizer, quantity, applicationMethod }
- organicAlternatives: array of bio-fertilizers (Azotobacter, PSB, Vermicompost, Neem cake)
- micronutrientsNeeded: array of needed micronutrients (Zinc sulphate, Borax, Ferrous sulphate) with foliar spray dosage
- irrigationSchedule: { waterNeedLitersPerDay, dripDurationHours, frequencyDays, criticalWateringStages: string[] }
- costEstimateRange: estimated fertilizer investment range in USD/INR
- warnings: crucial safety or soil salinity precautions`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cropSummary: { type: Type.STRING },
            npkRatioRecommended: { type: Type.STRING },
            basalApplication: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  item: { type: Type.STRING },
                  quantity: { type: Type.STRING },
                  purpose: { type: Type.STRING },
                },
                required: ["item", "quantity", "purpose"],
              },
            },
            topDressingStages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stageName: { type: Type.STRING },
                  daysAfterSowing: { type: Type.STRING },
                  fertilizer: { type: Type.STRING },
                  quantity: { type: Type.STRING },
                  applicationMethod: { type: Type.STRING },
                },
                required: ["stageName", "daysAfterSowing", "fertilizer", "quantity", "applicationMethod"],
              },
            },
            organicAlternatives: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            micronutrientsNeeded: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            irrigationSchedule: {
              type: Type.OBJECT,
              properties: {
                waterNeedLitersPerDay: { type: Type.STRING },
                dripDurationHours: { type: Type.STRING },
                frequencyDays: { type: Type.STRING },
                criticalWateringStages: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ["waterNeedLitersPerDay", "dripDurationHours", "frequencyDays", "criticalWateringStages"],
            },
            costEstimateRange: { type: Type.STRING },
            warnings: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            "cropSummary",
            "npkRatioRecommended",
            "basalApplication",
            "topDressingStages",
            "organicAlternatives",
            "irrigationSchedule",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, plan: parsed });
  } catch (error: any) {
    console.error("Fertilizer plan error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate fertilizer plan",
    });
  }
});

// 5. Market Commodity Price AI Forecast & Selling Strategy
app.post("/api/gemini/market-forecast", async (req, res) => {
  try {
    const { commodity, region, currentPrice, language = "English" } = req.body;
    const ai = getGeminiClient();

    const prompt = `You are a leading agricultural market economist and commodity strategist.
Commodity: ${commodity}
Region/Mandi: ${region || "Major Agricultural Hubs"}
Current Mandi Price: ${currentPrice || "Market Standard"}
Language: ${language}

Provide an insightful market forecast analysis formatted as JSON:
- marketSentiment: "Bullish (Prices Rising)" | "Bearish (Prices Falling)" | "Stable / Consolidating"
- expectedPriceRange15Days: estimated price range in next 15-30 days
- strategicRecommendation: "Sell immediately" | "Hold in warehouse (Cold storage/Pledge loan)" | "Sell 50% now, hold remainder"
- demandDrivers: array of 3 key domestic/export/seasonal drivers
- supplyFactors: array of harvest arrival influx, weather impacts, or import policies
- valueAdditionTip: 1 actionable post-harvest grading/processing trick to earn 15-25% higher margin
- summary: 2-sentence executive advice in ${language}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            marketSentiment: { type: Type.STRING },
            expectedPriceRange15Days: { type: Type.STRING },
            strategicRecommendation: { type: Type.STRING },
            demandDrivers: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            supplyFactors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            valueAdditionTip: { type: Type.STRING },
            summary: { type: Type.STRING },
          },
          required: [
            "marketSentiment",
            "expectedPriceRange15Days",
            "strategicRecommendation",
            "demandDrivers",
            "supplyFactors",
            "valueAdditionTip",
            "summary",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, forecast: parsed });
  } catch (error: any) {
    console.error("Market forecast error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate market forecast",
    });
  }
});

// Vite Middleware for SPA development & static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Smart Farmer Assistance Platform running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
