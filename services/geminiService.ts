
import { GoogleGenAI, Type } from "@google/genai";
import { Declaration, RiskAnalysisResponse, RiskLevel } from "../types";

const API_KEY = process.env.API_KEY || "";

export const analyzeDeclaration = async (declaration: Declaration): Promise<RiskAnalysisResponse> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const prompt = `Act as Customs Sentinel, a high-precision risk evaluation engine.
    Analyze the following declaration for structural integrity and fraud risk:
    
    DECLARATION DATA:
    ID: ${declaration.id}
    Exporter: ${declaration.exporter}
    Importer: ${declaration.importer}
    Commodity: ${declaration.itemDescription}
    Value: ${declaration.declaredValue} ${declaration.currency}
    Origin: ${declaration.originCountry}
    HS Code: ${declaration.hsCode}
    Document Status: ${JSON.stringify(declaration.documentStatus || [])}

    ANALYSIS REQUIREMENTS:
    1. VALUATION REGRESSION: Predict 'Expected Unit Value' based on HS Code and Origin. 
       Return 'valuationAnomaly' as (Actual - Expected) / Expected.
    
    2. DOCUMENT ANALYSIS: Compare provided 'Document Status' against legal requirements.
       - RI-001: Missing Bill of Lading (Check if 'Bill of Lading' is missing).
       - RI-002: Invoice Discrepancy (Check if 'Commercial Invoice' is INCONSISTENT).
       - RI-003: Missing Packing List.
       - RI-005: Missing Cert of Origin.
       - Flag any 'MISSING' or 'INCONSISTENT' items found in the 'Document Status' list.

    3. RISK SCORING: Provide a 0-100 score and categorical Risk Level (LOW, MEDIUM, HIGH, CRITICAL).
    
    4. FINDINGS: Detail the specific logic for each flag triggered.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          level: { type: Type.STRING },
          analysis: { type: Type.STRING },
          flags: { type: Type.ARRAY, items: { type: Type.STRING } },
          valuationAnomaly: { type: Type.NUMBER },
          documentAnalysis: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                indicator_id: { type: Type.STRING },
                finding: { type: Type.STRING },
                severity: { type: Type.STRING }
              },
              required: ["indicator_id", "finding", "severity"]
            }
          }
        },
        required: ["score", "level", "analysis", "flags"]
      }
    }
  });

  return JSON.parse(response.text.trim());
};

export const simulateScenario = async (scenario: string) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const prompt = `Act as a senior Customs Risk Analyst. Simulate the potential risk outcome for the following scenario: "${scenario}". 
  Provide a structured response including: 
  - Predicted Risk Level (LOW, MEDIUM, HIGH, CRITICAL)
  - Primary Risk Factors
  - Recommended Countermeasures
  - Historical Precedents if any.
  Return as Markdown.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt
  });

  return response.text;
};

export const chatWithSentinel = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "You are 'Sentinel', a Customs Intelligence Assistant. You help customs officers evaluate risk. Focus on regulatory compliance, fraud detection, and safety."
    }
  });

  const result = await chat.sendMessage({ message });
  return result.text;
};
