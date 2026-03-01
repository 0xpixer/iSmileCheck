"use client";

import { useEffect, useState } from "react";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { ImageUploader } from "@/components/ImageUploader";
import { LeadForm, type LeadFormData } from "@/components/LeadForm";
import { LoadingState } from "@/components/LoadingState";

type SimulateResponse = {
  processedImageUrl: string;
};

export function SmileSimulator() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [beforeImageUrl, setBeforeImageUrl] = useState<string | null>(null);
  const [afterImageUrl, setAfterImageUrl] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = useState(50);
  const [isUploadSectionExpanded, setIsUploadSectionExpanded] = useState(true);

  useEffect(() => {
    if (!sourceFile) {
      setBeforeImageUrl(null);
      return;
    }
    const url = URL.createObjectURL(sourceFile);
    setBeforeImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [sourceFile]);

  const simulateSmile = async () => {
    if (!sourceFile) {
      setError("Please upload a clear front-facing smile photo first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAfterImageUrl(null);

    try {
      const formData = new FormData();
      formData.append("image", sourceFile);

      const response = await fetch("/api/simulate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const details = (await response.json()) as { error?: string };
        throw new Error(details.error ?? "Unable to process this image.");
      }

      const payload = (await response.json()) as SimulateResponse;
      setAfterImageUrl(payload.processedImageUrl);
      setSliderValue(50);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unexpected error while processing your image.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const showAsCollapsible = !!sourceFile;
  const isExpanded = !showAsCollapsible || isUploadSectionExpanded;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <section className="rounded-3xl border border-orange-100 bg-white overflow-hidden">
        <button
          type="button"
          onClick={() => setIsUploadSectionExpanded((v) => !v)}
          className="flex w-full items-center justify-between p-5 text-left sm:p-8"
          aria-expanded={isExpanded}
        >
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            iSmile Check
          </h1>
          {showAsCollapsible ? (
            <span
              className={`inline-block text-slate-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}
              aria-hidden
            >
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          ) : null}
        </button>

        {isExpanded ? (
          <div className="border-t border-orange-100 px-5 pb-5 sm:px-8 sm:pb-8">
            <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
              Upload a clear front-facing smile photo to preview a realistic orthodontic
              alignment simulation.
            </p>

            <div className="mt-6">
              <ImageUploader onFileSelect={setSourceFile} disabled={isLoading} />
            </div>

            {!(afterImageUrl && !formSubmitted) ? (
              <button
                type="button"
                onClick={simulateSmile}
                disabled={isLoading || !sourceFile}
                className="mt-6 w-full rounded-xl bg-[#F75202] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#E04A00] disabled:cursor-not-allowed disabled:bg-orange-300"
              >
                {isLoading ? "Processing..." : "See My Future Smile"}
              </button>
            ) : null}

            {error ? (
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-white text-xs">✕</span>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      {isLoading ? <LoadingState /> : null}

      {beforeImageUrl && afterImageUrl && !formSubmitted ? (
        <LeadForm
          onSubmit={(data: LeadFormData) => {
            setFormSubmitted(true);
          }}
        />
      ) : null}

      {beforeImageUrl && afterImageUrl && formSubmitted ? (
        <section className="space-y-3 rounded-3xl border border-orange-100 bg-white p-4 sm:p-6">
          <BeforeAfterSlider
            beforeSrc={beforeImageUrl}
            afterSrc={afterImageUrl}
            value={sliderValue}
            onChange={setSliderValue}
          />
          <p className="mt-2 text-center text-xs text-slate-400">
            This is a simulation only. Actual treatment results vary.
          </p>
        </section>
      ) : null}
    </div>
  );
}
