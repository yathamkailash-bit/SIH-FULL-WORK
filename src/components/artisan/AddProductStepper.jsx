import React, { useState, useRef } from 'react';
import { Camera, Mic, Volume2, ChevronRight, Check, ArrowLeft, Upload, X, Loader2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { enhanceProductImage, checkAuthenticity } from '../../services/imageEnhancerService';
import { generateMultilingualCatalog } from '../../services/catalogerService';
import { PriceEstimatorView } from './PriceEstimatorView';
import { ProductListedSuccess } from './ProductListedSuccess';
import { useVoice } from '../../context/VoiceContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';

export const AddProductStepper = ({ onComplete, onCancel }) => {
  const { user } = useAuth();
  const { speakPrompt, startListening, isListening, voiceError, speechText, setVoiceError } = useVoice();
  const { t } = useLanguage();
  const { addProduct } = useAppData();

  const [step, setStep] = useState(1); // 1: Photo, 2: Details, 3: Price, 4: Done

  // Live Camera State & Refs
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Photo, Authenticity & AI Enhancement State
  const [photoSrc, setPhotoSrc] = useState('https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80');
  const [enhancedPhoto, setEnhancedPhoto] = useState(null);
  const [showEnhancementComparison, setShowEnhancementComparison] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authenticityResult, setAuthenticityResult] = useState(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementError, setEnhancementError] = useState(null);
  const [detectedProductInfo, setDetectedProductInfo] = useState(null);

  // Multilingual Auto-Cataloger State
  const [isCataloging, setIsCataloging] = useState(false);
  const [catalogError, setCatalogError] = useState(null);
  const [bilingualDescription, setBilingualDescription] = useState({ descriptionEn: '', descriptionHi: '' });

  const [guidedStepIndex, setGuidedStepIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: 'Kondapalli Wooden Toy Set',
    craft: 'Wooden Toys / Kondapalli',
    material: 'Tella Poniki Softwood & Natural Dyes',
    materialCost: 250,
    workersCount: 1,
    workingDays: 2,
    labourCost: 400,
    state: user?.state || 'Andhra Pradesh',
    price: 650
  });

  const [createdProduct, setCreatedProduct] = useState(null);

  const guidedQuestions = [
    { key: 'material', question: "What material did you use?", defaultVal: "Tella Poniki Softwood & Natural Dyes" },
    { key: 'materialCost', question: "How much did the material cost? (in ₹)", defaultVal: 250 },
    { key: 'workersCount', question: "How many workers helped you?", defaultVal: 1 },
    { key: 'workingDays', question: "How many days did you work?", defaultVal: 2 },
    { key: 'labourCost', question: "What is your estimated labour cost? (in ₹)", defaultVal: 400 }
  ];

  // Live Web Camera Control — 1080p High Quality Resolution
  const startCamera = async () => {
    try {
      setIsCameraOpen(true);
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } }
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 } } });
      }
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Unable to access camera device. Please allow camera permissions or use Gallery upload.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhotoFromCamera = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1920;
    canvas.height = video.videoHeight || 1080;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const capturedUrl = canvas.toDataURL('image/jpeg', 0.95);
    stopCamera();

    handlePhotoSelected(capturedUrl);
  };

  // Gallery File Upload
  const handleGalleryUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      handlePhotoSelected(evt.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoSelected = async (originalImgSrc) => {
    setPhotoSrc(originalImgSrc);
    setEnhancedPhoto(null);
    setAuthenticityResult(null);
    setEnhancementError(null);
    setDetectedProductInfo(null);
    setShowEnhancementComparison(true);
    setIsAuthenticating(true);
    setIsEnhancing(false);

    speakPrompt("Verifying photo authenticity...");

    try {
      // Step 1: Authenticity Check
      const authRes = await checkAuthenticity(originalImgSrc);
      setAuthenticityResult(authRes);
      setIsAuthenticating(false);

      const isUnauthentic = !authRes.isAuthentic || authRes.confidence === 'low';

      if (isUnauthentic) {
        speakPrompt("Warning: This photo appears to be a picture of a screen or print. Please take a direct photo of your actual product.");
        return;
      }

      // Step 2: AI Enhancement & Hand Removal
      setIsEnhancing(true);
      speakPrompt("Photo verified! AI is generating a professional product image...");

      const result = await enhanceProductImage(originalImgSrc);

      setEnhancedPhoto(result.dataUrl);
      setDetectedProductInfo(result.productInfo);
      if (result.productInfo?.product) {
        setFormData(prev => ({
          ...prev,
          name: result.productInfo.product,
          craft: result.productInfo.category || prev.craft
        }));
      }
      speakPrompt(`Product identified as ${result.productInfo?.product || 'handcrafted item'}. Studio image ready!`);

    } catch (err) {
      console.error('[KalaKriti] ❌ Enhancement pipeline error:', err.message);
      setEnhancementError(err.message || 'AI product isolation failed. Please try another photo.');
      setIsEnhancing(false);
      speakPrompt("AI processing failed. Please try another photo.");
    } finally {
      setIsAuthenticating(false);
      setIsEnhancing(false);
    }
  };

  const handleApplyEnhancement = () => {
    setShowEnhancementComparison(false);
    speakPrompt("Photo enhanced! Advancing to product details.");
    setStep(2);
  };

  // MULTILINGUAL AUTO-CATALOGER FLOW
  const [typedDescription, setTypedDescription] = useState('');

  const findNextGuidedIndex = (fromIndex, currentData) => {
    for (let i = fromIndex; i < guidedQuestions.length; i++) {
      const k = guidedQuestions[i].key;
      const val = currentData[k];
      if (val === undefined || val === null || val === '') {
        return i;
      }
    }
    return -1;
  };

  const processProductDescription = async (textInput) => {
    if (!textInput || !textInput.trim()) return;
    setIsCataloging(true);
    setCatalogError(null);
    speakPrompt("Analyzing description and generating product catalog...");

    try {
      const res = await generateMultilingualCatalog({
        productName: formData.name,
        craft: formData.craft,
        material: formData.material,
        spokenText: textInput.trim()
      });

      setBilingualDescription({
        descriptionEn: res.descriptionEn,
        descriptionHi: res.descriptionHi
      });

      const updatedFormData = {
        ...formData,
        name: res.name || formData.name,
        craft: res.craft || formData.craft,
        material: res.material || formData.material,
        labourCost: res.labourCost || formData.labourCost
      };

      setFormData(updatedFormData);
      setIsCataloging(false);

      const nextUnfilled = findNextGuidedIndex(0, updatedFormData);
      if (nextUnfilled !== -1) {
        setGuidedStepIndex(nextUnfilled);
      } else {
        setGuidedStepIndex(0);
      }

      speakPrompt("Product details auto-filled! Advancing to step 2.");
      setStep(2);
    } catch (err) {
      console.error('[KalaKriti] Auto-cataloger error:', err.message);
      setIsCataloging(false);
      setCatalogError(err.message || "Failed to generate AI descriptions. Please try again.");
      speakPrompt("Description generation failed. Please try again.");
    }
  };

  const handleSpokenDescriptionCatalog = () => {
    setCatalogError(null);
    if (setVoiceError) setVoiceError(null);
    speakPrompt("Tell me about the product", () => {
      startListening((transcript) => {
        if (transcript) {
          processProductDescription(transcript);
        }
      });
    });
  };

  // Voice Guided Q&A
  const handleStartGuidedVoice = () => {
    const qObj = guidedQuestions[guidedStepIndex];
    speakPrompt(qObj.question, () => {
      startListening((resultText) => {
        setFormData(prev => ({ ...prev, [qObj.key]: resultText }));
      });
    });
  };

  const handleNextGuidedQuestion = () => {
    const nextUnfilled = findNextGuidedIndex(guidedStepIndex + 1, formData);
    if (nextUnfilled !== -1) {
      setGuidedStepIndex(nextUnfilled);
      const nextQ = guidedQuestions[nextUnfilled];
      speakPrompt(nextQ.question);
    } else if (guidedStepIndex < guidedQuestions.length - 1) {
      setGuidedStepIndex(prev => prev + 1);
      const nextQ = guidedQuestions[guidedStepIndex + 1];
      speakPrompt(nextQ.question);
    } else {
      speakPrompt("Details saved! Let's calculate the suggested price.");
      setStep(3);
    }
  };

  const handleConfirmPrice = async (finalPrice, _estimateData) => {
    const finalProduct = {
      name: formData.name,
      artisanName: user?.name || 'Artisan',
      artisanId: user?.id || 'art-1',
      artisanLocation: formData.state || user?.state || 'Andhra Pradesh',
      craft: formData.craft,
      tags: ['Handmade', formData.craft || 'Craft', formData.state || 'Andhra Pradesh'],
      price: finalPrice,
      originalPrice: Math.round(finalPrice * 1.2),
      discountPercent: 17,
      rating: 5.0,
      reviewsCount: 1,
      image: enhancedPhoto || photoSrc,
      description: bilingualDescription.descriptionEn || `Authentic handcrafted ${formData.craft} made with ${formData.material}.`,
      descriptionEn: bilingualDescription.descriptionEn || `Authentic handcrafted ${formData.craft} made with ${formData.material}.`,
      descriptionHi: bilingualDescription.descriptionHi || `प्रामाणिक हस्तनिर्मित ${formData.craft} जो ${formData.material} से बना है।`,
      material: formData.material,
      inStock: true
    };

    const saved = await addProduct(finalProduct);
    setCreatedProduct(saved);
    setStep(4);
  };

  const isBlockedByAuthenticity = authenticityResult && (!authenticityResult.isAuthentic || authenticityResult.confidence === 'low');

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#FAF7F2] select-none relative">
      {/* Top Stepper Header */}
      <div className="bg-white border-b border-stone-200 px-4 py-3 sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-stone-200"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-base font-extrabold text-stone-900">
            {t('add_product')}
          </h2>
          <div className="w-8"></div>
        </div>

        {/* 4-Step Visual Stepper Bar */}
        <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-extrabold">
          {[
            { num: 1, label: '1 Photo' },
            { num: 2, label: '2 Details' },
            { num: 3, label: '3 Price' },
            { num: 4, label: '4 Done' }
          ].map(s => (
            <div key={s.num} className="flex flex-col items-center gap-1">
              <div
                className={`w-full h-2 rounded-full transition-all ${
                  step >= s.num ? 'bg-emerald-600' : 'bg-stone-200'
                }`}
              ></div>
              <span className={step >= s.num ? 'text-emerald-800' : 'text-stone-400'}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: PHOTO CAPTURE & VERIFICATION */}
      {step === 1 && (
        <div className="flex-1 p-5 flex flex-col justify-between overflow-y-auto no-scrollbar">
          <div>
            <h3 className="text-xl font-extrabold text-stone-900">Step 1: Take a Photo</h3>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              Capture via Live Camera or Choose from Gallery
            </p>

            {/* Main Photo Preview Box */}
            <div className="mt-4 relative w-full h-52 border-2 border-dashed border-emerald-600/40 rounded-3xl bg-white flex flex-col items-center justify-center overflow-hidden shadow-inner">
              {photoSrc ? (
                <img src={photoSrc} alt="Product upload preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 p-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Camera size={28} />
                  </div>
                  <span className="text-xs font-bold text-stone-700">No product photo selected</span>
                </div>
              )}
            </div>

            {/* TWO DISTINCT BUTTONS (TAKE PHOTO & CHOOSE FROM GALLERY) */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={startCamera}
                className="py-3.5 px-3 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white rounded-2xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition"
              >
                <Camera size={18} />
                <span>Take Photo</span>
              </button>

              <label className="py-3.5 px-3 bg-white border-2 border-emerald-700 text-emerald-800 hover:bg-emerald-50 active:scale-[0.99] rounded-2xl font-bold text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer transition">
                <Upload size={18} />
                <span>Choose Gallery</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleGalleryUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* LIVE CAMERA MODAL VIEW */}
            {isCameraOpen && (
              <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-between p-4 animate-in fade-in">
                <div className="w-full flex justify-between items-center text-white px-2 pt-2">
                  <span className="text-sm font-bold flex items-center gap-2">
                    <Camera size={18} className="text-emerald-400" /> Live Web Camera (1080p HD)
                  </span>
                  <button
                    onClick={stopCamera}
                    className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="w-full max-w-sm h-80 rounded-3xl overflow-hidden bg-stone-900 border-2 border-emerald-500 relative my-auto shadow-2xl">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  ></video>
                </div>

                <div className="w-full pb-6 flex justify-center">
                  <button
                    onClick={capturePhotoFromCamera}
                    className="w-20 h-20 rounded-full border-4 border-white bg-emerald-600 text-white flex items-center justify-center shadow-2xl active:scale-95 transition"
                    title="Snap Photo"
                  >
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                      <Camera size={26} className="text-emerald-700" />
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* FLOW ORDER & AI ENHANCEMENT / AUTHENTICITY SECTION */}
            {showEnhancementComparison && (
              <div className="mt-4 p-4 bg-emerald-950 text-white rounded-3xl shadow-xl border border-emerald-700 animate-in fade-in space-y-3">
                {/* 1. Authentic Verification Loading State */}
                {isAuthenticating ? (
                  <div className="py-6 flex flex-col items-center justify-center gap-2 text-center">
                    <Loader2 size={30} className="animate-spin text-amber-400" />
                    <p className="text-xs font-bold text-emerald-200">
                      Verifying photo authenticity...
                    </p>
                    <span className="text-[10px] text-stone-400">Checking for moire, glare, and screen reflections</span>
                  </div>
                ) : isBlockedByAuthenticity ? (
                  /* 2. AUTHENTICITY WARNING BANNER */
                  <div className="bg-amber-500/20 border-2 border-amber-400 text-amber-100 p-4 rounded-2xl space-y-2">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle size={22} className="text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">
                          Authenticity Check Flagged
                        </h4>
                        <p className="text-xs font-bold text-white mt-1 leading-snug">
                          ⚠️ This looks like a photo of a screen or printed image, not a real product photo. Please take a direct photo of your actual product.
                        </p>
                      </div>
                    </div>

                    {authenticityResult?.reason && (
                      <p className="text-[10px] text-amber-200 font-semibold bg-amber-950/60 p-2 rounded-xl border border-amber-600/40">
                        Reason: {authenticityResult.reason}
                      </p>
                    )}

                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={startCamera}
                        className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-xl font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                      >
                        <Camera size={14} />
                        <span>Retake Direct Photo</span>
                      </button>
                    </div>
                  </div>
                ) : enhancementError ? (
                  /* ERROR STATE */
                  <div className="bg-red-900/30 border-2 border-red-500 text-red-100 p-4 rounded-2xl space-y-2">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle size={22} className="text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-extrabold text-red-300 uppercase tracking-wider">
                          AI Processing Failed
                        </h4>
                        <p className="text-xs font-bold text-red-100 mt-1 leading-snug">
                          {enhancementError}
                        </p>
                      </div>
                    </div>
                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={startCamera}
                        className="flex-1 py-2.5 bg-red-500 hover:bg-red-400 text-white rounded-xl font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                      >
                        <Camera size={14} />
                        <span>Try Another Photo</span>
                      </button>
                    </div>
                  </div>
                ) : isEnhancing ? (
                  /* 3. AI Enhancement Loading State */
                  <div className="py-6 flex flex-col items-center justify-center gap-2 text-center">
                    <Loader2 size={30} className="animate-spin text-amber-400" />
                    <p className="text-xs font-bold text-emerald-200">
                      Generating professional product studio image via Gemini AI...
                    </p>
                    <span className="text-[10px] text-stone-400">Removing hands, isolating product, replacing background</span>
                  </div>
                ) : enhancedPhoto ? (
                  /* 4. Enhancement Complete Side-by-Side Comparison */
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={18} className="text-emerald-400" />
                        <span className="text-xs font-extrabold text-emerald-200">Gemini AI Studio Image Generated ✨</span>
                      </div>
                    </div>

                    {detectedProductInfo && (
                      <div className="mb-2 p-2 bg-emerald-900/60 rounded-xl text-[10px] font-semibold text-emerald-200 space-y-0.5 border border-emerald-700">
                        <div>🎨 Product: <span className="text-white font-bold">{detectedProductInfo.product}</span></div>
                        <div>📦 Category: <span className="text-amber-300 font-bold">{detectedProductInfo.category}</span></div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 my-2 text-center text-[10px] font-bold">
                      <div>
                        <span className="text-stone-300 block mb-1">Original Photo</span>
                        <img
                          src={photoSrc}
                          className="w-full h-28 object-cover rounded-xl border border-stone-700 shadow"
                          alt="Original"
                        />
                      </div>
                      <div>
                        <span className="text-amber-300 block mb-1">AI Studio Image ✨</span>
                        <img
                          src={enhancedPhoto}
                          className="w-full h-28 object-cover rounded-xl border-2 border-amber-400 shadow-md bg-white"
                          alt="AI Generated Studio Product"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleApplyEnhancement}
                      disabled={isBlockedByAuthenticity}
                      className="w-full mt-3 py-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-xl font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Check size={16} strokeWidth={3} />
                      <span>Use This AI Studio Image ✓</span>
                    </button>
                  </div>
                ) : null}
              </div>
            )}

            {/* GATED SPEAK OR WRITE PROMPT (Render ONLY after photo verification/enhancement succeeds) */}
            {enhancedPhoto && !isBlockedByAuthenticity && (
              <div className="mt-4 p-4 bg-white border-2 border-emerald-500/40 rounded-3xl shadow-md flex flex-col items-center gap-3 animate-in fade-in">
                <p className="text-xs font-extrabold text-stone-800 text-center">
                  Tap to speak or write a description of your product.
                </p>

                {isCataloging ? (
                  <div className="w-full py-3.5 bg-amber-50 border border-amber-300 text-amber-900 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold">
                    <Loader2 size={18} className="animate-spin text-amber-600" />
                    <span>Writing your AI product description...</span>
                  </div>
                ) : (
                  <div className="w-full space-y-2">
                    <button
                      onClick={handleSpokenDescriptionCatalog}
                      className={`w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition ${
                        isListening ? 'bg-red-600 animate-pulse' : ''
                      }`}
                    >
                      <Mic size={18} />
                      <span>{isListening ? 'Listening...' : '🎤 Tap to Speak Description'}</span>
                    </button>

                    {isListening && (
                      <div className="w-full p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-semibold text-center animate-pulse">
                        🎙️ Listening... {speechText ? <span className="font-bold text-emerald-950">"{speechText}"</span> : <em>Speak your product description clearly</em>}
                      </div>
                    )}

                    {voiceError && (
                      <div className="w-full p-2.5 bg-red-50 border border-red-300 rounded-xl text-xs font-semibold text-red-700 text-center flex items-center justify-center gap-1.5">
                        <AlertTriangle size={14} className="shrink-0" />
                        <span>{voiceError}</span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={typedDescription}
                        onChange={(e) => setTypedDescription(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            processProductDescription(typedDescription);
                          }
                        }}
                        placeholder="Or write description here..."
                        className="flex-1 px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:border-emerald-600"
                      />
                      <button
                        onClick={() => processProductDescription(typedDescription)}
                        disabled={!typedDescription.trim()}
                        className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-40"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}

                {catalogError && (
                  <div className="w-full p-3 bg-red-50 border border-red-200 rounded-2xl space-y-2 text-center">
                    <p className="text-xs font-semibold text-red-700">⚠️ {catalogError}</p>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={handleSpokenDescriptionCatalog}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs"
                      >
                        Retry Voice Input
                      </button>
                      <button
                        onClick={() => setStep(2)}
                        className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-xl"
                      >
                        Continue Manually
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-4 pb-2">
            <button
              onClick={() => setStep(2)}
              disabled={isEnhancing || isAuthenticating || isBlockedByAuthenticity}
              className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-base shadow-lg flex items-center justify-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Next: Product Details</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: DETAILS (VOICE GUIDED QUESTIONS ONE AT A TIME) */}
      {step === 2 && (
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-stone-900">Step 2: Product Details</h3>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              Answer 1-at-a-time guided questions (Voice or Type)
            </p>

            {/* Bilingual AI Generated Description Banner if available */}
            {(bilingualDescription.descriptionEn || bilingualDescription.descriptionHi) && (
              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1 text-xs">
                <span className="font-extrabold text-emerald-800 uppercase text-[10px] tracking-wider block">
                  ✨ AI Multilingual Auto-Cataloger Description
                </span>
                <p className="text-stone-800 font-medium"><strong className="text-emerald-700">EN:</strong> {bilingualDescription.descriptionEn}</p>
                <p className="text-stone-800 font-medium"><strong className="text-emerald-700">HI:</strong> {bilingualDescription.descriptionHi}</p>
              </div>
            )}

            {/* Guided Question Card */}
            <div className="mt-4 bg-white border-2 border-emerald-600/30 rounded-3xl p-5 shadow-lg relative">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Question {guidedStepIndex + 1} of {guidedQuestions.length}
                </span>

                <button
                  onClick={handleStartGuidedVoice}
                  className="flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950"
                >
                  <Volume2 size={16} className="animate-pulse" /> Listen & Speak
                </button>
              </div>

              <h4 className="text-base font-extrabold text-stone-900 mb-3">
                "{guidedQuestions[guidedStepIndex].question}"
              </h4>

              <input
                type="text"
                value={formData[guidedQuestions[guidedStepIndex].key] || ''}
                onChange={(e) => setFormData({ ...formData, [guidedQuestions[guidedStepIndex].key]: e.target.value })}
                className="w-full p-3 bg-stone-50 border border-stone-300 rounded-2xl text-sm font-bold text-stone-900 focus:outline-none focus:border-emerald-600"
                placeholder="Speak or type answer..."
              />
            </div>

            {/* Captured Details */}
            <div className="mt-4 p-4 bg-stone-100 rounded-2xl space-y-2 text-xs font-semibold text-stone-700">
              <div className="text-[10px] uppercase font-bold text-stone-400">Captured Details:</div>
              <div>Material: <span className="font-bold text-stone-900">{formData.material}</span></div>
              <div>Material Cost: <span className="font-bold text-stone-900">₹{formData.materialCost}</span></div>
              <div>Workers: <span className="font-bold text-stone-900">{formData.workersCount}</span></div>
              <div>Days Worked: <span className="font-bold text-stone-900">{formData.workingDays} days</span></div>
            </div>
          </div>

          <div className="pt-4 pb-2 space-y-2">
            <button
              onClick={handleNextGuidedQuestion}
              className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-base shadow-lg flex items-center justify-center gap-2"
            >
              <span>{guidedStepIndex < guidedQuestions.length - 1 ? 'Next Question' : 'Confirm & Calculate Price'}</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PRICE ESTIMATION */}
      {step === 3 && (
        <PriceEstimatorView
          formData={formData}
          detectedProductInfo={detectedProductInfo}
          description={bilingualDescription.descriptionEn}
          onConfirmPrice={handleConfirmPrice}
          onBack={() => setStep(2)}
        />
      )}

      {/* STEP 4: PRODUCT LISTED SUCCESS */}
      {step === 4 && (
        <ProductListedSuccess
          product={createdProduct || formData}
          onViewProduct={onComplete}
          onAddAnother={() => {
            setStep(1);
            setGuidedStepIndex(0);
          }}
        />
      )}
    </div>
  );
};
