/**
 * KALAKRITI Multilingual Auto-Cataloger Service
 * Generates professional, SEO-friendly descriptions in English and Hindi using Gemini API.
 */

const getApiKey = () => {
  return (
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ||
    (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
    (typeof window !== 'undefined' && window.GEMINI_API_KEY) ||
    ''
  );
};

/**
 * Generate bilingual (English + Hindi) SEO product descriptions using Gemini.
 * @param {Object} params
 * @param {string} params.productName
 * @param {string} params.craft
 * @param {string} params.material
 * @param {string} params.spokenText - Raw spoken description from artisan
 * @param {string} [params.mimeType] - Optional audio mimeType if sending audio blob
 * @param {string} [params.audioBase64] - Optional audio base64 if sending raw audio blob
 */
export const generateMultilingualCatalog = async ({
  productName = '',
  craft = '',
  material = '',
  spokenText = '',
  mimeType = null,
  audioBase64 = null
}) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY.');
  }

  const promptText = `You are a professional artisan marketplace cataloger in India.
An artisan has uploaded a handcrafted product photo and spoken/typed a description about it.

Product context:
- Initial Name: "${productName}"
- Initial Craft/Category: "${craft}"
- Initial Material: "${material}"
- Spoken/Typed description from artisan: "${spokenText}"

Your task:
1. Interpret the artisan's description regardless of input language (Hindi, Telugu, Tamil, Marathi, Bengali, English, etc.).
2. Extract or refine key product details: product name, craft category, materials used, estimated labour cost if mentioned.
3. Generate a professional, attractive, SEO-friendly product description in English.
4. Generate a professional, attractive, SEO-friendly product description in Hindi.

Return ONLY a JSON object in this exact format with no markdown formatting:
{
  "name": "<concise product name in English>",
  "craft": "<craft category name>",
  "material": "<materials used>",
  "labourCost": <integer estimated labour cost in INR or null>,
  "descriptionEn": "<professional SEO description in English>",
  "descriptionHi": "<professional SEO description in Hindi>"
}`;

  const textModels = ['gemini-2.5-flash', 'gemini-2.0-flash'];
  let lastError = null;

  for (const model of textModels) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const parts = [{ text: promptText }];
    if (audioBase64 && mimeType) {
      parts.push({ inlineData: { mimeType, data: audioBase64 } });
    }

    const body = {
      contents: [{ parts }],
      generationConfig: { responseModalities: ['TEXT'] }
    };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const errText = await res.text();
        lastError = `Model ${model} HTTP ${res.status}: ${errText.slice(0, 150)}`;
        continue;
      }

      const json = await res.json();
      const raw = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();

      try {
        const parsed = JSON.parse(cleaned);
        if (parsed.descriptionEn || parsed.descriptionHi) {
          return {
            name: parsed.name || productName,
            craft: parsed.craft || craft,
            material: parsed.material || material,
            labourCost: parsed.labourCost || null,
            descriptionEn: parsed.descriptionEn || spokenText,
            descriptionHi: parsed.descriptionHi || spokenText
          };
        }
      } catch {
        if (raw) {
          return {
            name: productName,
            craft: craft,
            material: material,
            labourCost: null,
            descriptionEn: raw.slice(0, 300),
            descriptionHi: raw.slice(0, 300)
          };
        }
      }
    } catch (err) {
      lastError = err.message;
    }
  }

  throw new Error(`Multilingual cataloging failed: ${lastError || 'Gemini service unreachable'}.`);
};
