"use client";

import * as React from "react";
import { autoFixLayout } from "../lib/autoFixLayout";
import { normalizeModelData } from "../lib/normalizeModelData";
import { validateLayout } from "../lib/designRules";
import type { LayoutValidationResult, RoomLayout } from "../lib/types";
import { getFurnitureSize } from "../lib/furnitureCatalog";

type RoomPlanProps = {
  initialLayout?: Partial<RoomLayout>;
  layoutOverride?: RoomLayout | null;
  onLayoutChange?: (layout: RoomLayout) => void;
  highlightId?: string;
};

const INCHES_PER_UNIT = 4; // scale for SVG

export function RoomPlan({
  initialLayout,
  layoutOverride,
  onLayoutChange,
  highlightId,
}: RoomPlanProps) {
  const [room, setRoom] = React.useState<RoomLayout>(() =>
    normalizeModelData(initialLayout),
  );
  const [validation, setValidation] = React.useState<LayoutValidationResult>(
    () => validateLayout(normalizeModelData(initialLayout)),
  );

  React.useEffect(() => {
    const base = normalizeModelData(initialLayout);
    const next = layoutOverride ?? base;
    setRoom(next);
    setValidation(validateLayout(next));
  }, [initialLayout, layoutOverride]);

  const hasViolations = validation.violations.length > 0;

  const handleAutoFix = () => {
    const fixed = autoFixLayout(room);
    setRoom(fixed);
    setValidation(validateLayout(fixed));
    onLayoutChange?.(fixed);
  };

  const width = room.room.width;
  const depth = room.room.depth;
  const widthUnits = width / INCHES_PER_UNIT;
  const depthUnits = depth / INCHES_PER_UNIT;

  // Calculate door position for rendering
  const door = room.door;
  let doorX = 0;
  let doorZ = 0;
  let doorWidthUnits = door.width / INCHES_PER_UNIT;
  
  if (door.wallIndex === 0) {
    // Front wall
    doorX = door.offsetFromLeft / INCHES_PER_UNIT - doorWidthUnits / 2;
    doorZ = 0;
  } else if (door.wallIndex === 1) {
    // Right wall
    doorX = widthUnits;
    doorZ = door.offsetFromLeft / INCHES_PER_UNIT - doorWidthUnits / 2;
  } else if (door.wallIndex === 2) {
    // Back wall
    doorX = widthUnits - door.offsetFromLeft / INCHES_PER_UNIT - doorWidthUnits / 2;
    doorZ = depthUnits;
  } else {
    // Left wall
    doorX = 0;
    doorZ = depthUnits - door.offsetFromLeft / INCHES_PER_UNIT - doorWidthUnits / 2;
  }

  return (
    <div className="flex w-full flex-col gap-3 rounded-2xl border border-zinc-200 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Room Layout Preview
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Top-down 2D plan with live validation. 1 square ≈ 4"
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${
              validation.score >= 80
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"
                : validation.score >= 50
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-emerald-200"
                  : "bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200"
            }`}
          >
            Score: {validation.score}/100
          </span>
          {hasViolations && (
            <button
              type="button"
              onClick={handleAutoFix}
              className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Auto‑Fix Layout
            </button>
          )}
        </div>
      </div>

      <div className="relative mt-1 aspect-[4/3] w-full overflow-hidden rounded-xl border border-dashed border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950">
        <svg
          viewBox={`0 0 ${widthUnits} ${depthUnits}`}
          className="h-full w-full"
        >
          {/* Grid */}
          <defs>
            <pattern
              id="grid"
              x="0"
              y="0"
              width="4"
              height="4"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 4 0 L 0 0 0 4"
                fill="none"
                stroke="rgba(148,163,184,0.35)"
                strokeWidth="0.1"
              />
            </pattern>
          </defs>
          <rect
            x="0"
            y="0"
            width={widthUnits}
            height={depthUnits}
            fill="url(#grid)"
          />

          {/* Room boundary */}
          <rect
            x="0.5"
            y="0.5"
            width={widthUnits - 1}
            height={depthUnits - 1}
            fill="rgba(15,23,42,0.02)"
            stroke="rgba(15,23,42,0.45)"
            strokeWidth="0.6"
            rx="1"
          />

          {/* Door */}
          {door.wallIndex === 0 && (
            <rect
              x={doorX}
              y={doorZ}
              width={doorWidthUnits}
              height={0.4}
              fill="rgba(59,130,246,0.9)"
              rx="0.2"
            />
          )}
          {door.wallIndex === 1 && (
            <rect
              x={doorX}
              y={doorZ}
              width={0.4}
              height={doorWidthUnits}
              fill="rgba(59,130,246,0.9)"
              rx="0.2"
            />
          )}
          {door.wallIndex === 2 && (
            <rect
              x={doorX}
              y={doorZ - 0.4}
              width={doorWidthUnits}
              height={0.4}
              fill="rgba(59,130,246,0.9)"
              rx="0.2"
            />
          )}
          {door.wallIndex === 3 && (
            <rect
              x={doorX}
              y={doorZ}
              width={0.4}
              height={doorWidthUnits}
              fill="rgba(59,130,246,0.9)"
              rx="0.2"
            />
          )}

          {/* Furniture */}
          {room.furniture.map((f) => {
            const actualSize = getFurnitureSize(f.type, f.rotation);
            const w = actualSize.width / INCHES_PER_UNIT;
            const h = actualSize.depth / INCHES_PER_UNIT;
            const centerX = f.position.x / INCHES_PER_UNIT;
            const centerZ = f.position.z / INCHES_PER_UNIT;
            const x = centerX - w / 2;
            const y = centerZ - h / 2;

            const isAnchor =
              f.kind === "bed" || f.kind === "sofa" || f.kind === "desk";

            const isHighlighted = highlightId === f.id;

            return (
              <g
                key={f.id}
                transform={`rotate(${f.rotation} ${centerX} ${centerZ})`}
              >
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  fill={
                    isAnchor
                      ? "rgba(15,118,110,0.9)"
                      : "rgba(37,99,235,0.85)"
                  }
                  rx="0.6"
                  stroke={isHighlighted ? "#60A5FA" : "none"}
                  strokeWidth={isHighlighted ? 0.5 : 0}
                />
                <text
                  x={centerX}
                  y={centerZ}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="1.2"
                  fill="white"
                >
                  {f.kind}
                </text>
              </g>
            );
          })}

          {/* Violations */}
          {validation.violations.map((v) => {
            const x = v.position.x / INCHES_PER_UNIT;
            const y = v.position.z / INCHES_PER_UNIT;
            const color =
              v.severity === "error"
                ? "rgba(239,68,68,0.95)"
                : v.severity === "warning"
                  ? "rgba(245,158,11,0.95)"
                  : "rgba(59,130,246,0.9)";
            return (
              <g key={v.id}>
                <circle cx={x} cy={y} r={0.8} fill={color} />
                <circle
                  cx={x}
                  cy={y}
                  r={1.3}
                  fill="none"
                  stroke={color}
                  strokeWidth="0.2"
                  strokeDasharray="0.4 0.4"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {hasViolations ? (
        <ul className="mt-1 space-y-1 text-xs text-zinc-600 dark:text-zinc-300">
          {validation.violations.slice(0, 4).map((v) => (
            <li key={v.id} className="flex items-start gap-1.5">
              <span
                className={`mt-0.5 inline-flex h-1.5 w-1.5 rounded-full ${
                  v.severity === "error"
                    ? "bg-rose-500"
                    : v.severity === "warning"
                      ? "bg-amber-500"
                      : "bg-sky-500"
                }`}
              />
              <span>{v.message}</span>
            </li>
          ))}
          {validation.violations.length > 4 && (
            <li className="text-[11px] text-zinc-400">
              + {validation.violations.length - 4} more checks
            </li>
          )}
        </ul>
      ) : (
        <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-300">
          Perfect layout. All physics and design rules are satisfied.
        </p>
      )}
    </div>
  );
}
