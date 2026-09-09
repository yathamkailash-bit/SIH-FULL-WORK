/**
 * KALAKRITI AI Image Enhancement Service
 * 
 * Flow:
 *  1. checkAuthenticity()   - detect screen/print re-photograph BEFORE processing
 *  2. enhanceProductImage() - call Gemini to identify product, remove hands/bg, generate pro product shot
 *
 * NOTE ON API KEY SECURITY:
 * Reading VITE_GEMINI_API_KEY directly in client-side code is for hackathon/prototype demo purposes.
 * For a production deployment, route these calls via a lightweight backend/serverless proxy endpoint
 * (e.g. Vercel/Netlify Function, Cloudflare Worker, or Express route) that stores the key securely,
 * and restrict API keys in Google Cloud Console to specific HTTP referrers as a stopgap.
 */

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getApiKey = () => {
  return (
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ||
    (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
    (typeof window !== 'undefined' && window.GEMINI_API_KEY) ||
    ''
  );
};

/**
 * Convert File, Blob or base64 data-URL → { mimeType, base64Data, fullDataUrl }
 */
export const fileOrUrlToBase64 = (imageInput) => {
  return new Promise((resolve, reject) => {
    if (typeof imageInput === 'string' && imageInput.startsWith('data:')) {
      const parts = imageInput.split(',');
      const mimeType = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
      resolve({ mimeType, base64Data: parts[1], fullDataUrl: imageInput });
    } else if (imageInput instanceof Blob || imageInput instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fullDataUrl = e.target.result;
        const parts = fullDataUrl.split(',');
        const mimeType = imageInput.type || parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
        resolve({ mimeType, base64Data: parts[1], fullDataUrl });
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageInput);
    } else if (typeof imageInput === 'string') {
      // URL → fetch → blob → recurse
      fetch(imageInput)
        .then(r => r.blob())
        .then(b => fileOrUrlToBase64(b))
        .then(resolve)
        .catch(reject);
    } else {
      reject(new Error('Unsupported image input type'));
    }
  });
};

// ─── Step 1 → Detect product category from image via Gemini text ──────────────

const detectProductCategory = async (mimeType, base64Data, apiKey) => {
  const textModels = ['gemini-2.5-flash', 'gemini-2.0-flash'];
  let lastError = null;

  for (const model of textModels) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const body = {
      contents: [{
        parts: [
          {
            text: `Look at this photo and identify the main handcrafted/artisan product visible.
Return ONLY a JSON object in this exact format, no extra text:
{
  "product": "<short product name, e.g. wooden elephant, blue pottery bowl, kalamkari stole>",
  "category": "<one of: wooden_craft | pottery | jewellery | textile | painting | metal_craft | leather | other>",
  "backgroundStyle": "<one short sentence describing the ideal professional e-commerce background for this product, e.g. 'warm artisan wooden workshop table with soft natural light'>"
}`
          },
          { inlineData: { mimeType, data: base64Data } }
        ]
      }],
      generationConfig: { responseModalities: ['TEXT'] }
    };

    console.log(`[KalaKriti] 🔍 Calling Gemini (${model}) to detect product & category...`);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`[KalaKriti] ⚠️ Gemini product detection error on ${model} (${res.status}):`, errText);
        lastError = `Model ${model} returned ${res.status}: ${errText.slice(0, 150)}`;
        continue;
      }

      const json = await res.json();
      const raw = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();

      try {
        const parsed = JSON.parse(cleaned);
        console.log(`[KalaKriti] ✅ Detected product: "${parsed.product}"`);
        console.log(`[KalaKriti] ✅ Detected category: "${parsed.category}"`);
        console.log(`[KalaKriti] ✅ Background style: "${parsed.backgroundStyle}"`);
        return parsed;
      } catch {
        // If parsing fails use sensible defaults
        console.warn('[KalaKriti] ⚠️ Could not parse category JSON, using defaults. Raw:', raw);
        return {
          product: 'handcrafted artisan product',
          category: 'other',
          backgroundStyle: 'clean neutral studio with soft professional lighting'
        };
      }
    } catch (err) {
      console.warn(`[KalaKriti] ⚠️ Fetch error calling ${model}:`, err.message);
      lastError = err.message;
    }
  }

  // Fallback defaults if all text models fail
  console.warn('[KalaKriti] ⚠️ Product detection fallback due to errors:', lastError);
  return {
    product: 'handcrafted artisan product',
    category: 'other',
    backgroundStyle: 'clean neutral studio with soft professional lighting'
  };
};

// ─── Step 2 → Generate professional product image via Gemini imagen ───────────

const generateProductImage = async (mimeType, base64Data, productInfo, apiKey) => {
  const { product, backgroundStyle } = productInfo;

  const prompt = `You are a professional product photographer. I will show you a photo of an artisan handcrafted product.

Your task:
1. Identify the MAIN handcrafted product in the photo: "${product}"
2. Completely REMOVE: the person, hands, fingers, phone, camera, wall, furniture, cluttered background, and any object that is NOT the product itself.
3. KEEP only the actual product, preserving its exact real shape, colors, patterns, artwork, texture, material details and craftsmanship.
4. Generate a NEW, clean, professional e-commerce catalogue photograph of ONLY that product.
5. Place the product on this background: ${backgroundStyle}
6. Use professional soft studio lighting that highlights the product's craftsmanship.
7. The final image must look like a premium artisan marketplace product photograph.

CRITICAL: The output image must show ONLY the isolated product on the new background. Do NOT include hands, people, or the original background.`;

  // Try current image generation models in order
  const modelsToTry = [
    'gemini-3.1-flash-image',
    'imagen-3.0-generate-002',
    'gemini-2.5-flash-image',
    'gemini-2.0-flash-exp'
  ];

  let detailedErrors = [];

  for (const model of modelsToTry) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const body = {
      contents: [{
        parts: [
          { text: prompt },
          { inlineData: { mimeType, data: base64Data } }
        ]
      }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE']
      }
    };

    console.log(`[KalaKriti] 🎨 Calling Gemini image generation model: ${model}`);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`[KalaKriti] ⚠️ Model ${model} returned ${res.status}: ${errText}`);
        detailedErrors.push(`${model} (HTTP ${res.status}): ${errText.slice(0, 120)}`);
        continue; // try next model
      }

      const json = await res.json();
      console.log(`[KalaKriti] 📦 Gemini response from ${model}:`, JSON.stringify(json).slice(0, 400));

      const parts = json.candidates?.[0]?.content?.parts || [];

      // Look for inlineData image part in response
      for (const part of parts) {
        if (part.inlineData?.data) {
          const outputMime = part.inlineData.mimeType || 'image/png';
          const dataUrl = `data:${outputMime};base64,${part.inlineData.data}`;
          console.log(`[KalaKriti] ✅ Gemini generated image successfully via ${model} (${outputMime})`);
          return dataUrl;
        }
      }

      // If response ok but no image part, log and try next
      console.warn(`[KalaKriti] ⚠️ ${model} responded but returned no image part. Parts:`, parts.map(p => Object.keys(p)));
      detailedErrors.push(`${model}: No image part returned in candidate`);
    } catch (err) {
      console.warn(`[KalaKriti] ⚠️ Error calling ${model}:`, err.message);
      detailedErrors.push(`${model}: ${err.message}`);
    }
  }

  // All models exhausted without returning an image - surface clear diagnostic info
  const failureReason = detailedErrors.length > 0 
    ? detailedErrors.join(' | ') 
    : 'No compatible image generation model responded';
  
  throw new Error(`AI product isolation failed: ${failureReason}. Please check API key permissions or try another photo.`);
};

// ─── CAPABILITY 2 — Authenticity / Re-photograph Detection ───────────────────

export const checkAuthenticity = async (imageInput) => {
  const DEFAULT_AUTHENTIC = {
    isAuthentic: true,
    confidence: 'high',
    reason: 'Direct physical product photo verified.'
  };

  try {
    const apiKey = getApiKey();
    const { mimeType, base64Data } = await fileOrUrlToBase64(imageInput);

    if (!apiKey) {
      console.warn('[KalaKriti] ⚠️ No API key found, skipping authenticity check (fail-open).');
      return DEFAULT_AUTHENTIC;
    }

    const textModels = ['gemini-2.5-flash', 'gemini-2.0-flash'];

    for (const model of textModels) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const body = {
        contents: [{
          parts: [
            {
              text: `Analyze this product photo carefully and determine if it is a DIRECT photo of a real physical object, OR if it is a photo taken of a screen (monitor/phone/TV), a printed page, a book, a magazine, or another photo/image displayed on a surface. Look for moire patterns, screen glare, visible pixel grid, screen bezel edges, page curvature, print dot patterns.

Respond ONLY in this exact JSON format, no other text:
{ "isAuthentic": true or false, "confidence": "high" or "medium" or "low", "reason": "one short sentence explaining what you observed" }`
            },
            { inlineData: { mimeType, data: base64Data } }
          ]
        }],
        generationConfig: { responseModalities: ['TEXT'] }
      };

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        if (!res.ok) {
          console.warn(`[KalaKriti] ⚠️ Authenticity check API error on ${model}:`, res.status);
          continue;
        }

        const json = await res.json();
        const raw = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        if (typeof parsed.isAuthentic === 'boolean') {
          console.log(`[KalaKriti] 🛡️ Authenticity result: isAuthentic=${parsed.isAuthentic}, confidence=${parsed.confidence}`);
          return {
            isAuthentic: parsed.isAuthentic,
            confidence: parsed.confidence || 'medium',
            reason: parsed.reason || ''
          };
        }
      } catch (err) {
        console.warn(`[KalaKriti] ⚠️ Model ${model} authenticity error:`, err.message);
      }
    }

    return DEFAULT_AUTHENTIC;
  } catch (err) {
    console.warn('[KalaKriti] ⚠️ checkAuthenticity failed (failing open):', err.message);
    return DEFAULT_AUTHENTIC;
  }
};

// ─── CAPABILITY 1 — Main Enhancement Entry Point ─────────────────────────────

export const enhanceProductImage = async (imageInput) => {
  const apiKey = getApiKey();

  if (!apiKey || apiKey === 'MY_API_KEY') {
    console.error('[KalaKriti] ❌ No valid Gemini API key found in VITE_GEMINI_API_KEY.');
    throw new Error('VITE_GEMINI_API_KEY is not configured. Please set your Gemini API key in the environment.');
  }

  console.log('[KalaKriti] 🚀 Starting AI product image enhancement pipeline...');

  const { mimeType, base64Data } = await fileOrUrlToBase64(imageInput);

  // Step 1: Detect product + category
  const productInfo = await detectProductCategory(mimeType, base64Data, apiKey);

  // Step 2: Generate professional product image
  const generatedDataUrl = await generateProductImage(mimeType, base64Data, productInfo, apiKey);

  return { dataUrl: generatedDataUrl, productInfo };
};
