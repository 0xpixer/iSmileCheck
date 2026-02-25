"use client";

import { useEffect, useState } from "react";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { ImageUploader } from "@/components/ImageUploader";
import { LoadingState } from "@/components/LoadingState";

type SimulateResponse = {
  processedImageUrl: string;
};

export function SmileSimulator() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [beforeImageUrl, setBeforeImageUrl] = useState<string | null>(null);
  const [afterImageUrl, setAfterImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = useState(50);

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

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <section className="rounded-3xl border border-orange-100 bg-white p-5 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Orthodontic Smile Simulation
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
          Upload a clear front-facing smile photo to preview a realistic orthodontic
          alignment simulation.
        </p>

        <div className="mt-6">
          <ImageUploader onFileSelect={setSourceFile} disabled={isLoading} />
        </div>

        <button
          type="button"
          onClick={simulateSmile}
          disabled={isLoading || !sourceFile}
          className="mt-6 w-full rounded-xl bg-[#F75202] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#E04A00] disabled:cursor-not-allowed disabled:bg-orange-300"
        >
          {isLoading ? "Processing..." : "See My Future Smile"}
        </button>

        {error ? (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-white text-xs">✕</span>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        ) : null}
      </section>

      {isLoading ? <LoadingState /> : null}

      {beforeImageUrl && afterImageUrl ? (
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
