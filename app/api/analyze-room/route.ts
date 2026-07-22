import { NextResponse } from "next/server";
import type { ModelInput } from "../../../lib/types";
import { runInferencePipeline } from "../../../lib/modelPipeline";

// AI placeholder endpoint for early scale-anchor inference.
// It accepts a room photo upload and selected metadata, then returns a
// mock `ModelOutput` that follows the real model contract.

export const runtime = "edge";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Expected multipart/form-data with a `files` field." },
      { status: 400 },
    );
  }

  const formData = await request.formData();
  const fileEntries = formData
    .getAll("files")
    .filter((entry) => entry instanceof Blob) as Blob[];

  if (fileEntries.length === 0) {
    return NextResponse.json(
      { error: "Missing file upload." },
      { status: 400 },
    );
  }

  if (fileEntries.length > 5) {
    return NextResponse.json(
      { error: "Please upload up to 5 images per room." },
      { status: 400 },
    );
  }

  const tooLarge = fileEntries.find((file) => file.size > 10 * 1024 * 1024);
  if (tooLarge) {
    return NextResponse.json(
      { error: "Each file must be 10MB or smaller." },
      { status: 400 },
    );
  }

  const selectedReferenceAnchor = formData.get("selectedReferenceAnchor");
  const cameraOrientation = formData.get("cameraOrientation");
  const focalLengthMm = formData.get("focalLengthMm");
  const deviceModel = formData.get("deviceModel");
  const imageWidth = formData.get("imageWidth");
  const imageHeight = formData.get("imageHeight");
  const imageBase64 = formData.get("imageBase64");

  const modelInput: ModelInput = {
    imageBase64: typeof imageBase64 === "string" ? imageBase64 : undefined,
    cameraMetadata: {
      width: imageWidth ? Number(imageWidth) : 0,
      height: imageHeight ? Number(imageHeight) : 0,
      cameraOrientation:
        typeof cameraOrientation === "string" &&
        ["top_down", "angled", "eye_level"].includes(cameraOrientation)
          ? (cameraOrientation as "top_down" | "angled" | "eye_level")
          : "top_down",
      focalLengthMm: typeof focalLengthMm === "string" ? Number(focalLengthMm) : undefined,
      deviceModel: typeof deviceModel === "string" ? deviceModel : undefined,
    },
    selectedReferenceAnchor:
      typeof selectedReferenceAnchor === "string"
        ? (selectedReferenceAnchor as any)
        : undefined,
  };

  const inference = runInferencePipeline(modelInput);

  // Allow an external model endpoint to be used. Set MODEL_ENDPOINT in env.
  const modelEndpoint = process.env.MODEL_ENDPOINT;
  if (modelEndpoint) {
    try {
      const resp = await fetch(modelEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modelInput),
      });
      if (resp.ok) {
        const json = await resp.json();
        return NextResponse.json(json);
      }
    } catch (e) {
      // If proxy fails, continue with internal inference as fallback
    }
  }

  return NextResponse.json(inference);
}
