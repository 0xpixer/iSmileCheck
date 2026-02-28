"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ImageUploaderProps = {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
};

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ImageUploader({ onFileSelect, disabled = false }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [localError, setLocalError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOpen(false);
    setCameraError(null);
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      streamRef.current = stream;
      setCameraOpen(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Camera access failed";
      setCameraError(message);
    }
  }, []);

  useEffect(() => {
    if (!cameraOpen) return;
    return () => {
      stopCamera();
    };
  }, [cameraOpen, stopCamera]);

  useEffect(() => {
    if (!cameraOpen || !streamRef.current || !videoRef.current) return;
    const video = videoRef.current;
    video.srcObject = streamRef.current;
    video.play().catch(() => {});
  }, [cameraOpen]);

  const validateFile = (file: File): boolean => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setLocalError("Please upload a JPG, PNG, or WEBP image.");
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      setLocalError("Image is too large. Please upload a file under 10MB.");
      return false;
    }
    setLocalError(null);
    return true;
  };

  const handleSelect = (file: File | null) => {
    if (!file) return;
    if (!validateFile(file)) {
      setPreview(null);
      setFileName(null);
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    setFileName(file.name);
    onFileSelect(file);
  };

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    if (!video || !streamRef.current || video.readyState < 2) return;

    const w = video.videoWidth;
    const h = video.videoHeight;
    const canvas = canvasRef.current ?? document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvasRef.current = canvas;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" });
        stopCamera();
        handleSelect(file);
      },
      "image/jpeg",
      0.92
    );
  }, [stopCamera]);

  return (
    <div className="space-y-3">
      {preview ? (
        <div className="relative rounded-2xl border-2 border-[#F75202] bg-orange-50 p-3">
          <div className="flex items-center gap-4">
            <img
              src={preview}
              alt="Upload preview"
              className="size-20 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-green-500 text-xs text-white">
                  ✓
                </span>
                <p className="text-sm font-semibold text-slate-800">Photo uploaded</p>
              </div>
              <p className="mt-1 truncate text-xs text-slate-500">{fileName}</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (disabled) return;
                  inputRef.current?.click();
                }}
                disabled={disabled}
                className="mt-2 text-xs font-medium text-[#F75202] hover:underline disabled:opacity-50"
              >
                Change photo
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            disabled={disabled}
            onClick={() => !disabled && startCamera()}
            className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-orange-200 bg-white p-6 text-center transition hover:border-[#F75202] hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <div className="flex size-12 items-center justify-center rounded-full bg-orange-100 text-[#F75202]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-700">Take a Photo</p>
            <p className="text-xs text-slate-500">Use your camera</p>
          </button>

          <span className="text-sm text-slate-600">
            or{" "}
            <button
              type="button"
              disabled={disabled}
              onClick={() => !disabled && inputRef.current?.click()}
              className="font-semibold text-[#F75202] underline decoration-[#F75202] decoration-2 underline-offset-2 hover:no-underline disabled:cursor-not-allowed disabled:opacity-60"
            >
              Upload a Photo
            </button>
          </span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          handleSelect(e.target.files?.[0] ?? null);
          if (inputRef.current) inputRef.current.value = "";
        }}
      />

      {localError ? (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2">
          <span className="flex size-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            ✕
          </span>
          <p className="text-sm text-red-700">{localError}</p>
        </div>
      ) : null}

      {/* Camera modal */}
      {cameraOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black"
          role="dialog"
          aria-modal="true"
          aria-label="Take a photo"
        >
          <div className="relative flex-1 flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 h-full w-full object-cover"
            />
            {!cameraError ? (
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                aria-hidden
              >
                <svg
                  viewBox="0 0 200 260"
                  className="w-[85%] max-w-[320px] text-white/70"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Face oval */}
                  <ellipse
                    cx="100"
                    cy="120"
                    rx="82"
                    ry="105"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                  />
                  {/* 8 teeth outline (upper front teeth in a gentle arc) */}
                  <g transform="translate(100, 158)">
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                      const w = 10;
                      const h = 14;
                      const gap = 2;
                      const totalWidth = 8 * w + 7 * gap;
                      const x = -totalWidth / 2 + i * (w + gap) + gap / 2;
                      const y = -4 - (i < 4 ? (3 - i) * 1.5 : (i - 4) * 1.5);
                      return (
                        <rect
                          key={i}
                          x={x}
                          y={y}
                          width={w}
                          height={h}
                          rx="1.5"
                          ry="1.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeDasharray="3 2"
                        />
                      );
                    })}
                  </g>
                </svg>
              </div>
            ) : null}
            {cameraError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/90 p-4 text-white">
                <p className="text-center text-sm">{cameraError}</p>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black"
                >
                  Close
                </button>
              </div>
            ) : null}
          </div>

          <div className="flex items-center justify-center gap-4 border-t border-white/20 bg-black/80 p-4">
            <button
              type="button"
              onClick={stopCamera}
              className="rounded-xl bg-white/20 px-4 py-2 text-sm font-medium text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={capturePhoto}
              className="flex size-14 items-center justify-center rounded-full bg-[#F75202] text-white shadow-lg"
              aria-label="Capture photo"
            >
              <span className="size-12 rounded-full border-4 border-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
