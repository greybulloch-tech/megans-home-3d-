"use client";

import * as React from "react";
import { RoomPlan } from "./RoomPlan";
import { Room3DScene } from "./Room3DScene";
import type { RoomLayout, Furniture } from "../lib/types";
import { normalizeModelData } from "../lib/normalizeModelData";

type HistoryState = {
  layout: RoomLayout;
};

export function RoomExperienceClient() {
  const [layout, setLayout] = React.useState<RoomLayout | null>(() =>
    normalizeModelData(),
  );
  const [past, setPast] = React.useState<HistoryState[]>([]);
  const [future, setFuture] = React.useState<HistoryState[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedFurniture, setSelectedFurniture] = React.useState<Furniture | null>(null);
  const [referenceAnchor, setReferenceAnchor] = React.useState<"twin_bed" | "desk" | "door" | null>(null);
  const [inferenceInfo, setInferenceInfo] = React.useState<{
    anchorUsed?: string;
    layoutConfidence?: number;
    objectCount?: number;
  } | null>(null);
  const [detectedObjects, setDetectedObjects] = React.useState<Array<{ id: string; class: string }>>([]);
  const [highlightedId, setHighlightedId] = React.useState<string | null>(null);
  const [cameraView, setCameraView] = React.useState<"default" | "top" | "front" | "side" | "isometric">("default");

  const referenceAnchors = [
    {
      id: "twin_bed",
      label: "Twin bed (39\" × 80\")",
      description: "Use the bed as a scale anchor for the room.",
    },
    {
      id: "desk",
      label: "Standard dorm desk (~48\" × 24\")",
      description: "Use the desk size to help infer the layout.",
    },
    {
      id: "door",
      label: "Standard door (30\" / 36\")",
      description: "Use the door width to anchor the room scale.",
    },
  ] as const;

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const pushLayout = (next: RoomLayout) => {
    if (layout) {
      setPast((prev) => [...prev, { layout }]);
    }
    setFuture([]);
    setLayout(next);
  };

  const handleUndo = () => {
    if (!canUndo || !layout) return;
    const prev = past[past.length - 1];
    setPast((p) => p.slice(0, -1));
    setFuture((f) => [{ layout }, ...f]);
    setLayout(prev.layout);
  };

  const handleRedo = () => {
    if (!canRedo || !layout) return;
    const [next, ...rest] = future;
    setFuture(rest);
    setPast((p) => [...p, { layout }]);
    setLayout(next.layout);
  };

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleUploadChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (files.length > 5) {
      setError("Please upload up to 5 photos for a single room.");
      return;
    }

    const oversized = Array.from(files).find((f) => f.size > 10 * 1024 * 1024);
    if (oversized) {
      setError("Each file must be 10MB or smaller.");
      return;
    }

    setError(null);
    setIsLoading(true);
    setInferenceInfo(null);

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      const firstFile = files[0];
      const imageDataUrl = await readFileAsDataUrl(firstFile);
      const image = new Image();
      const imageDimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
        image.onload = () => resolve({ width: image.width, height: image.height });
        image.onerror = reject;
        image.src = imageDataUrl;
      });

      formData.append("imageBase64", imageDataUrl);
      formData.append("imageWidth", String(imageDimensions.width));
      formData.append("imageHeight", String(imageDimensions.height));
      formData.append("cameraOrientation", "top_down");
      if (referenceAnchor) {
        formData.append("selectedReferenceAnchor", referenceAnchor);
      }

      const res = await fetch("/api/analyze-room", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong while analyzing.");
      }

      const data = (await res.json()) as {
        roomLayout: RoomLayout;
        referenceAnchorUsed?: string;
        layoutConfidence?: number;
        objectDetections?: { id: string; class: string }[];
      };
      pushLayout(data.roomLayout);
      setInferenceInfo({
        anchorUsed: data.referenceAnchorUsed,
        layoutConfidence: data.layoutConfidence,
        objectCount: data.objectDetections?.length,
      });
      setDetectedObjects(data.objectDetections ?? []);
      // clear previous highlight when new inference arrives
      setHighlightedId(null);
    } catch (e: any) {
      setError(e.message ?? "Unexpected error during analysis.");
    } finally {
      setIsLoading(false);
      // reset input so same file can be selected again
      event.target.value = "";
    }
  };

  const handleFurnitureClick = (furniture: Furniture) => {
    setSelectedFurniture(furniture);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/30 p-3">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={!canUndo}
            className="inline-flex items-center justify-center rounded-full border border-zinc-700 bg-zinc-950/70 px-3 py-1.5 text-[11px] font-medium text-zinc-200 transition disabled:cursor-not-allowed disabled:border-zinc-800 disabled:text-zinc-600"
          >
            Undo
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={!canRedo}
            className="inline-flex items-center justify-center rounded-full border border-zinc-700 bg-zinc-950/70 px-3 py-1.5 text-[11px] font-medium text-zinc-200 transition disabled:cursor-not-allowed disabled:border-zinc-800 disabled:text-zinc-600"
          >
            Redo
          </button>
          <span className="text-[11px] text-zinc-500">
            Upload new photos any time to regenerate the layout.
          </span>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/45 p-4">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/45 px-4 py-7 text-center text-xs text-zinc-400 transition hover:border-zinc-600 hover:bg-zinc-900">
            <span className="font-medium text-zinc-200">
              Drop up to 5 room photos
            </span>
            <span className="text-[11px] text-zinc-500">
              JPG, PNG, WEBP · each ≤ 10MB
            </span>
            <input
              type="file"
              name="files"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleUploadChange}
            />
          </label>
          {isLoading && (
            <p className="text-[11px] text-zinc-400">
              Analyzing your room with the demo AI… This may take a few seconds.
            </p>
          )}
          {error && (
            <p className="text-[11px] text-rose-400">
              {error}
            </p>
          )}
          {!isLoading && !error && (
            <p className="text-[11px] text-zinc-500">
              The current prototype uses a deterministic AI stub. Swapping in a
              real model later will not change the experience.
            </p>
          )}

          <div className="mt-3 rounded-2xl border border-zinc-700 bg-zinc-950/40 p-3 text-[11px] text-zinc-300">
            <p className="mb-2 font-medium text-zinc-100">Choose a reference object for scale</p>
            <div className="flex flex-wrap gap-2">
              {referenceAnchors.map((anchor) => (
                <button
                  key={anchor.id}
                  type="button"
                  onClick={() => setReferenceAnchor(anchor.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    referenceAnchor === anchor.id
                      ? "border-blue-500 bg-blue-500/15 text-white"
                      : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-900/90"
                  }`}
                >
                  {anchor.label}
                </button>
              ))}
            </div>
            {referenceAnchor && (
              <p className="mt-2 text-[11px] text-zinc-400">
                Selected scale anchor: {referenceAnchors.find((a) => a.id === referenceAnchor)?.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <RoomPlan
          layoutOverride={layout}
          onLayoutChange={(next) => setLayout(next)}
          highlightId={highlightedId ?? undefined}
        />
        <div className="flex flex-col gap-3">
          {/* Camera Controls */}
          <div className="flex flex-wrap gap-2">
            <button
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                cameraView === "default"
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
              }`}
              onClick={() => setCameraView("default")}
            >
              Default
            </button>
            <button
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                cameraView === "top"
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
              }`}
              onClick={() => setCameraView("top")}
            >
              Top View
            </button>
            <button
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                cameraView === "front"
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
              }`}
              onClick={() => setCameraView("front")}
            >
              Front View
            </button>
            <button
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                cameraView === "side"
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
              }`}
              onClick={() => setCameraView("side")}
            >
              Side View
            </button>
            <button
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                cameraView === "isometric"
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
              }`}
              onClick={() => setCameraView("isometric")}
            >
              Isometric
            </button>
          </div>

          <Room3DScene
            layout={layout ?? undefined}
            onFurnitureClick={handleFurnitureClick}
            cameraView={cameraView}
          />

          {/* Predicted objects list */}
          {detectedObjects.length > 0 && (
            <div className="rounded-lg border border-zinc-700 bg-zinc-900/60 p-3">
              <p className="text-xs font-medium text-zinc-400">Predicted objects</p>
              <ul className="mt-2 space-y-2">
                {detectedObjects.map((d) => (
                  <li key={d.id}>
                    <button
                      onClick={() => {
                        setHighlightedId(d.id);
                        const f = layout?.furniture.find((f) => f.id === d.id);
                        if (f) setSelectedFurniture(f);
                      }}
                      className={`w-full rounded-md px-3 py-1 text-left text-xs transition ${highlightedId === d.id ? "bg-blue-600 text-white" : "bg-zinc-900/70 text-zinc-200"}`}
                    >
                      {d.class} • {d.id}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Furniture Info Panel */}
          {selectedFurniture && (
            <div className="rounded-lg border border-zinc-700 bg-zinc-900/60 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs font-medium text-zinc-400">Selected Furniture</p>
                  <h3 className="mt-1 text-base font-semibold text-zinc-100">
                    {selectedFurniture.name}
                  </h3>
                  <div className="mt-2 space-y-1 text-xs text-zinc-400">
                    <p>
                      <span className="font-medium">Type:</span> {selectedFurniture.kind}
                    </p>
                    <p>
                      <span className="font-medium">Size:</span> {selectedFurniture.size.x}" × {selectedFurniture.size.z}"
                    </p>
                    <p>
                      <span className="font-medium">Rotation:</span> {selectedFurniture.rotation}°
                    </p>
                    <p>
                      <span className="font-medium">Position:</span> ({selectedFurniture.position.x}", {selectedFurniture.position.z}")
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFurniture(null)}
                  className="text-zinc-500 hover:text-zinc-300 transition"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

