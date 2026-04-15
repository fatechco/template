import { invokeLLM, invokeLLMWithSchema } from "@/server/lib/ai-client";

export const aiService = {
  async generateContent(entityType: string, data: Record<string, any>, language: string = "en") {
    const systemPrompts: Record<string, string> = {
      property: "You are an expert Egyptian real estate copywriter. Generate compelling property descriptions.",
      project: "You are an expert real estate project marketer. Generate compelling project descriptions.",
      service: "You are a home services marketing specialist. Generate service descriptions.",
      product: "You are a building materials marketing specialist. Generate product descriptions.",
      buy_request: "You are a real estate buyer's agent. Help craft a clear property search request.",
    };

    const systemPrompt = systemPrompts[entityType] || "You are a content generation assistant.";
    const langInstruction = language === "ar"
      ? "Write in Modern Standard Arabic (MSA). Ensure high-quality Arabic grammar."
      : "Write in clear, professional English.";

    const result = await invokeLLM(
      `${langInstruction}\n\nGenerate content for this ${entityType}:\n${JSON.stringify(data, null, 2)}`,
      { systemPrompt, maxTokens: 2000 }
    );

    return { content: result.content, language };
  },

  async analyzeDocument(documentUrl: string, documentType: string) {
    const result = await invokeLLMWithSchema<{
      isAuthentic: boolean;
      confidence: number;
      extractedData: Record<string, any>;
      warnings: string[];
      documentCategory: string;
    }>(
      `Analyze this ${documentType} document for authenticity and extract key information.\nDocument URL: ${documentUrl}\n\nCheck for: forgery indicators, data consistency, official stamps/signatures, registration numbers.`,
      {
        type: "object",
        properties: {
          isAuthentic: { type: "boolean" },
          confidence: { type: "number" },
          extractedData: { type: "object" },
          warnings: { type: "array" },
          documentCategory: { type: "string" },
        },
      },
      { systemPrompt: "You are an expert document verification specialist for Egyptian real estate documents." }
    );

    return result;
  },

  async processPropertySearch(query: string, userPreferences?: Record<string, any>) {
    const result = await invokeLLMWithSchema<{
      filters: {
        categoryId?: string;
        purposeId?: string;
        cityName?: string;
        minPrice?: number;
        maxPrice?: number;
        minBedrooms?: number;
        minArea?: number;
        features?: string[];
      };
      interpretation: string;
      suggestions: string[];
    }>(
      `Parse this natural language real estate search query into structured filters:\n\n"${query}"\n\n` +
        (userPreferences ? `User preferences: ${JSON.stringify(userPreferences)}` : ""),
      {
        type: "object",
        properties: {
          filters: { type: "object" },
          interpretation: { type: "string" },
          suggestions: { type: "array" },
        },
      },
      { systemPrompt: "You are a real estate search query parser for the Egyptian market. Extract structured search filters from natural language." }
    );

    return result;
  },

  async generateBuyerStrategy(propertyData: Record<string, any>, marketData: Record<string, any>) {
    return invokeLLMWithSchema<{
      suggestedOpeningOffer: number;
      walkAwayPrice: number;
      negotiationTips: string[];
      leveragePoints: string[];
      marketAnalysis: string;
      timeline: string;
    }>(
      `Generate a buyer negotiation strategy for this Egyptian real estate purchase:\n\nProperty: ${JSON.stringify(propertyData)}\nMarket Data: ${JSON.stringify(marketData)}`,
      {
        type: "object",
        properties: {
          suggestedOpeningOffer: { type: "number" },
          walkAwayPrice: { type: "number" },
          negotiationTips: { type: "array" },
          leveragePoints: { type: "array" },
          marketAnalysis: { type: "string" },
          timeline: { type: "string" },
        },
      },
      { systemPrompt: "You are an expert Egyptian real estate negotiation coach." }
    );
  },

  async generateSellerStrategy(propertyData: Record<string, any>, marketData: Record<string, any>) {
    return invokeLLMWithSchema<{
      suggestedListingPrice: number;
      minimumAcceptablePrice: number;
      positioningAdvice: string;
      marketingTips: string[];
      expectedTimeToSell: string;
    }>(
      `Generate a seller strategy for this Egyptian real estate listing:\n\nProperty: ${JSON.stringify(propertyData)}\nMarket Data: ${JSON.stringify(marketData)}`,
      {
        type: "object",
        properties: {
          suggestedListingPrice: { type: "number" },
          minimumAcceptablePrice: { type: "number" },
          positioningAdvice: { type: "string" },
          marketingTips: { type: "array" },
          expectedTimeToSell: { type: "string" },
        },
      },
      { systemPrompt: "You are an expert Egyptian real estate seller advisor." }
    );
  },

  async draftOfferMessage(context: {
    propertyTitle: string;
    offerPrice: number;
    buyerName: string;
    conditions?: string[];
    language?: string;
    tone?: string;
  }) {
    const lang = context.language === "ar" ? "Arabic (MSA)" : "English";
    const tone = context.tone || "professional";

    const result = await invokeLLM(
      `Draft a ${tone} property purchase offer message in ${lang}:\n\n` +
        `Property: ${context.propertyTitle}\n` +
        `Offer Price: ${context.offerPrice} EGP\n` +
        `Buyer: ${context.buyerName}\n` +
        `Conditions: ${context.conditions?.join(", ") || "None"}\n\n` +
        `Write a concise, respectful offer message.`,
      { maxTokens: 500 }
    );

    return { message: result.content };
  },
};
