# KalaKriti — Artisan Heritage Marketplace & AI Assistant

An intelligent, multilingual role-based (Artisan, Customer, Admin) marketplace platform empowering Indian master artisans with AI studio photography, fair price estimation, and voice navigation.

## Key Features

1. **AI Studio Product Isolation & Enhancement (Gemini)**:
   - Authenticity detection for direct craft vs screen/print re-photographs.
   - Background removal, hand isolation, and e-commerce lighting generation powered by Google Gemini (`gemini-3.1-flash-image`, `imagen-3.0-generate-002`, `gemini-2.5-flash`).

2. **Multilingual Voice Assistant (Speech-to-Text & Text-to-Speech)**:
   - Voice-guided listing and navigation in Indian regional languages (Hindi, Telugu, Tamil, Kannada, Malayalam, Bengali, Gujarati, Marathi, Odia, English).

3. **Fair Price Calculator**:
   - Transparent cost calculation based on raw materials, daily artisan labour rates by Indian state, and fair profit margins.

4. **Patron / Customer Experience**:
   - GI-tagged handcrafted catalog browsing, cart with quantity stepper controls, live multi-step order tracking, and profile management with instant role switching / logout.

---

## ⚠️ Architecture & Prototype Notes (Hackathon Scope)

- **Data Persistence**: In this prototype, data (products, orders, cart, favorites, user PIN credentials) is persisted per-device via `localStorage` for rapid demonstration. A production deployment would connect `AppDataContext` and `AuthContext` to Firebase Firestore or Supabase for real-time cross-device sync.
- **API Key Security**: For client-side demos, `VITE_GEMINI_API_KEY` is referenced. For production deployments, all generative AI calls should be routed through a lightweight backend/serverless proxy (e.g., Vercel Functions, Cloudflare Workers, or Express) to keep keys server-side.
