import { getStateLabourRate } from '../data/stateLabourRates';

const getApiKey = () => {
  return (
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ||
    (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
    (typeof window !== 'undefined' && window.GEMINI_API_KEY) ||
    ''
  );
};

export const calculateSuggestedPrice = ({
  materialCost = 250,
  workersCount = 1,
  workingDays = 1,
  state = 'Andhra Pradesh',
  craftCategory = 'Wooden Toys / Kondapalli',
  customLabourRate = null
}) => {
  const parsedMaterial = Number(materialCost) || 0;
  const parsedWorkers = Number(workersCount) || 1;
  const parsedDays = Number(workingDays) || 1;

  // Determine daily labour rate based on state database
  const dailyRate = getStateLabourRate(state, craftCategory);

  // If custom estimated total labour cost is supplied, use it directly without re-multiplying by days/workers
  const totalLabourCost = customLabourRate 
    ? Number(customLabourRate) 
    : (dailyRate * parsedWorkers * parsedDays);

  const logisticsAndPlatformFee = 100;

  const estimatedCost = parsedMaterial + totalLabourCost + logisticsAndPlatformFee;

  // Recommended price adds ~18% artisan fair profit margin (Cost Floor Price)
  const recommendedPrice = Math.round((estimatedCost * 1.18) / 10) * 10;
  const minPrice = Math.round((recommendedPrice * 0.92) / 10) * 10;
  const maxPrice = Math.round((recommendedPrice * 1.08) / 10) * 10;

  return {
    costFloorPrice: recommendedPrice, // Fair-cost floor
    materialCost: parsedMaterial,
    labourCost: totalLabourCost,
    dailyLabourRate: dailyRate,
    logisticsAndPlatformFee,
    estimatedCost,
    recommendedPrice,
    minPrice,
    maxPrice,
    state,
    craftCategory,
    tipText: "This cost floor covers your material, labour, and minimum fair margin."
  };
};

/**
 * AI Market Trend Price Suggestion via Gemini API.
 * Suggests a competitive market price range (min – max) based on product category, artwork, and description.
 */
export const getAIMarketPriceSuggestion = async ({
  productInfo = {},
  description = '',
  costFloorPrice = 650
}) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return {
      success: false,
      note: 'Market suggestion unavailable, showing cost-based price',
      minMarketPrice: Math.round(costFloorPrice * 1.1),
      maxMarketPrice: Math.round(costFloorPrice * 1.35)
    };
  }

  const prompt = `You are an expert Indian artisan market pricing analyst.
Analyze the following product details and cost floor:

- Product Name: "${productInfo.product || 'Artisan Craft'}"
- Category: "${productInfo.category || 'Craft'}"
- Description: "${description}"
- Fair-Cost Floor Price: ₹${costFloorPrice}

Your task:
Analyze current e-commerce market trends in India for similar authentic handcrafted items (FabIndia, Craftsvilla, Etsy India, Cottage Industries).
Suggest a competitive market selling price range for this item in INR (₹).
CRITICAL: The suggested price MUST be equal to or HIGHER than the cost floor price of ₹${costFloorPrice}.

Return ONLY a JSON object in this exact format with no extra text:
{
  "minMarketPrice": <integer in INR, e.g. 850>,
  "maxMarketPrice": <integer in INR, e.g. 1200>,
  "reasoning": "<1 short sentence explaining market demand and artisan craftsmanship value>"
}`;

  const textModels = ['gemini-2.5-flash', 'gemini-1.5-flash'];

  for (const model of textModels) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['TEXT'] }
    };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) continue;

      const json = await res.json();
      const raw = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();

      const parsed = JSON.parse(cleaned);
      if (parsed.minMarketPrice && parsed.maxMarketPrice) {
        const minPrice = Math.max(parsed.minMarketPrice, costFloorPrice);
        const maxPrice = Math.max(parsed.maxMarketPrice, minPrice);

        return {
          success: true,
          minMarketPrice: minPrice,
          maxMarketPrice: maxPrice,
          reasoning: parsed.reasoning || 'Based on Indian artisan marketplace pricing standards.'
        };
      }
    } catch (err) {
      console.warn(`[KalaKriti] ⚠️ Market price AI failed on ${model}:`, err.message);
    }
  }

  return {
    success: false,
    note: 'Market suggestion unavailable, showing cost-based price',
    minMarketPrice: Math.round(costFloorPrice * 1.1),
    maxMarketPrice: Math.round(costFloorPrice * 1.35)
  };
};
