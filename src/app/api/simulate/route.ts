import { NextResponse } from "next/server";
import { ORTHODONTIC_TRANSFORM_PROMPT, QUALITY_CHECK_PROMPT } from "@/lib/prompts";

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

type ValidationResult = {
  ok: boolean;
  code: "OK" | "NO_TEETH_VISIBLE" | "BLURRY_PHOTO" | "NOT_FRONT_FACING" | "POOR_LIGHTING";
  message: string;
};

const HUMAN_ERRORS: Record<ValidationResult["code"], string> = {
  OK: "",
  NO_TEETH_VISIBLE: "Teeth are not clearly visible. Please upload a smile photo with visible teeth.",
  BLURRY_PHOTO: "The photo appears blurry. Please upload a sharper image.",
  NOT_FRONT_FACING: "Please upload a more front-facing smile photo.",
  POOR_LIGHTING: "Lighting is too low. Please upload a brighter photo.",
};

function safeParseValidation(jsonString: string): ValidationResult | null {
  try {
    const parsed = JSON.parse(jsonString) as ValidationResult;
    if (!parsed || typeof parsed.ok !== "boolean" || typeof parsed.code !== "string") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

type GeminiPart = {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: GeminiPart[];
    };
  }>;
  error?: {
    message?: string;
  };
};

async function callGemini({
  apiKey,
  model,
  parts,
  generationConfig,
}: {
  apiKey: string;
  model: string;
  parts: GeminiPart[];
  generationConfig?: Record<string, unknown>;
}): Promise<GeminiResponse> {
  const response = await fetch(
    `${GEMINI_BASE_URL}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts }],
        generationConfig,
      }),
    }
  );

  const payload = (await response.json()) as GeminiResponse;
  if (!response.ok) {
    throw new Error(payload.error?.message || "Gemini request failed.");
  }

  return payload;
}

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const validationModel = process.env.GEMINI_VALIDATION_MODEL ?? "gemini-2.5-flash";
    const imageModel = process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.5-flash";

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY on server." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    }

    if (!ACCEPTED_TYPES.has(image.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Use JPG, PNG, or WEBP." },
        { status: 400 }
      );
    }

    if (image.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image is too large. Please upload a file under 10MB." },
        { status: 400 }
      );
    }

    const base64 = Buffer.from(await image.arrayBuffer()).toString("base64");

    const validation = await callGemini({
      apiKey,
      model: validationModel,
      parts: [
        { text: QUALITY_CHECK_PROMPT },
        { inlineData: { mimeType: image.type, data: base64 } },
      ],
      generationConfig: {
        temperature: 0,
        responseMimeType: "application/json",
      },
    });

    const validationJson =
      validation.candidates?.[0]?.content?.parts?.find((part) => part.text)?.text?.trim() ?? "";
    const validationResult = safeParseValidation(validationJson);

    if (validationResult && !validationResult.ok) {
      const errorMessage =
        HUMAN_ERRORS[validationResult.code] || "Unable to use this photo. Please upload another.";
      return NextResponse.json({ error: errorMessage }, { status: 422 });
    }

    const transformed = await callGemini({
      apiKey,
      model: imageModel,
      parts: [
        { text: ORTHODONTIC_TRANSFORM_PROMPT },
        { inlineData: { mimeType: image.type, data: base64 } },
      ],
      generationConfig: {
        temperature: 0.4,
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    const generatedImagePart = transformed.candidates?.[0]?.content?.parts?.find(
      (part) => part.inlineData?.data
    );
    const b64Image = generatedImagePart?.inlineData?.data;
    const mimeType = generatedImagePart?.inlineData?.mimeType ?? "image/png";

    if (!b64Image) {
      return NextResponse.json(
        {
          error:
            "The selected Gemini model did not return an image. Please verify GEMINI_IMAGE_MODEL supports image output.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      processedImageUrl: `data:${mimeType};base64,${b64Image}`,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unexpected server error while generating simulation.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
