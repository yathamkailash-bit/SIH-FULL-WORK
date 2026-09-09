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
An artisan has uploaded a handcrafted product and spoken about it.

Product context:
- Product Name: "${productName}"
- Craft / Category: "${craft}"
- Material: "${material}"
- Spoken description from artisan (may be in Hindi, Telugu, Tamil, Marathi, Bengali, or English): "${spokenText}"

Your task:
1. Interpret the spoken description regardless of input language.
2. Generate a professional, attractive, SEO-friendly product description in English.
3. Generate a professional, attractive, SEO-friendly product description in Hindi.

Return ONLY a JSON object in this exact format, with no extra text or markdown formatting:
{
  "descriptionEn": "<professional SEO-friendly description in English, 2-3 sentences>",
  "descriptionHi": "<professional SEO-friendly description in Hindi, 2-3 sentences>"
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
        if (parsed.descriptionEn && parsed.descriptionHi) {
          return {
            descriptionEn: parsed.descriptionEn,
            descriptionHi: parsed.descriptionHi
          };
        }
      } catch {
        // Fall back to simple text split if JSON parse fails
        if (raw) {
          return {
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
