import type { ModelInput, ModelOutput, ReferenceAnchorLabel, ReferenceAnchorType } from "./types";
import { inferLayoutFromAnchor } from "./scaleAnchorInference";

function normalizeReferenceAnchor(
  selectedReferenceAnchor?: ReferenceAnchorType | ReferenceAnchorLabel,
): ReferenceAnchorType | null {
  if (!selectedReferenceAnchor) {
    return null;
  }

  if (typeof selectedReferenceAnchor === "string") {
    return selectedReferenceAnchor;
  }

  return selectedReferenceAnchor.anchorType;
}

export function runInferencePipeline(input: ModelInput): ModelOutput {
  const anchor = normalizeReferenceAnchor(input.selectedReferenceAnchor);
  const inference = inferLayoutFromAnchor(anchor);

  const confidenceModifier = anchor ? 0.1 : 0;
  const layoutConfidence = Math.min(1, (inference.layoutConfidence ?? 0.6) + confidenceModifier);

  return {
    ...inference,
    layoutConfidence,
  };
}
