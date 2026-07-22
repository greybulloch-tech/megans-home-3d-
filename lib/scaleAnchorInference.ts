import type {
  ModelOutput,
  ReferenceAnchorType,
  RoomLayout,
  DetectionClass,
} from "./types";
import { normalizeModelData } from "./normalizeModelData";

const anchorDefaultSizes: Record<ReferenceAnchorType, { width: number; depth?: number }> = {
  twin_bed: { width: 39, depth: 80 },
  desk: { width: 48, depth: 24 },
  door: { width: 36 },
  closet: { width: 36, depth: 24 },
  dresser: { width: 30, depth: 18 },
};

function detectionClassForType(type: string): DetectionClass {
  if (type.includes("bed")) return "bed";
  if (type.includes("desk")) return "desk";
  if (type.includes("closet")) return "closet";
  if (type.includes("dresser") || type.includes("drawer")) return "dresser";
  if (type.includes("nightstand")) return "nightstand";
  return "other";
}

function createRoomLayout(anchor: ReferenceAnchorType | null): RoomLayout {
  const baseWidth = 120;
  const baseDepth = 144;

  const bedSize = anchor === "desk" ? { x: 39, z: 80 } : { x: 39, z: 80 };
  const deskSize = anchor === "twin_bed" ? { x: 48, z: 24 } : { x: 48, z: 24 };
  const closetSize = anchor === "door" ? { x: 36, z: 28 } : { x: 36, z: 24 };

  const furniture = [
    {
      type: "bed_twin",
      x: 42,
      z: 90,
      rotation: 90,
    },
    {
      type: "desk_standard",
      x: 60,
      z: 24,
      rotation: 0,
    },
    {
      type: "dresser_small",
      x: 100,
      z: 80,
      rotation: 0,
    },
  ];

  const rawLayout = {
    units: "in",
    room: {
      width: baseWidth,
      depth: baseDepth,
      height: 96,
      wallThickness: 6,
    },
    door: {
      wallIndex: 0,
      offsetFromLeft: baseWidth / 2,
      width: anchor === "door" ? anchorDefaultSizes.door.width : 36,
      swing: "in_right",
    },
    fixedZones: [
      {
        type: "closet",
        x: 0,
        z: 0,
        width: closetSize.x,
        depth: closetSize.z,
      },
    ],
    furniture: furniture.map((item, index) => ({
      id: `furn-${index + 1}`,
      name:
        item.type === "bed_twin"
          ? "Twin Bed"
          : item.type === "desk_standard"
          ? "Dorm Desk"
          : "Small Dresser",
      kind: item.type === "bed_twin" ? "bed" : item.type === "desk_standard" ? "desk" : "dresser",
      type: item.type,
      position: { x: item.x, z: item.z },
      size:
        item.type === "bed_twin"
          ? bedSize
          : item.type === "desk_standard"
          ? deskSize
          : { x: closetSize.x, z: closetSize.z },
      rotation: item.rotation,
      isWallHugger: item.type !== "bed_twin",
      isCenterpiece: item.type === "bed_twin",
    })),
  };

  return normalizeModelData(rawLayout);
}

function buildMockDetections(layout: RoomLayout): ModelOutput["objectDetections"] {
  return layout.furniture.map((furniture, index) => {
    const classType = detectionClassForType(furniture.type);
    return {
      id: furniture.id,
      class: classType,
      bbox: {
        x: 0.2 + (index * 0.15),
        y: 0.2 + (index * 0.08),
        width: 0.2,
        height: 0.15,
      },
      position: furniture.position,
      size: furniture.size,
      rotation: furniture.rotation,
      confidence: 0.75 + index * 0.05,
    };
  });
}

export function inferLayoutFromAnchor(
  anchor: ReferenceAnchorType | null,
): ModelOutput {
  const roomLayout = createRoomLayout(anchor);
  return {
    roomLayout,
    referenceAnchorUsed: anchor ?? "twin_bed",
    objectDetections: buildMockDetections(roomLayout),
    layoutConfidence: 0.72,
    errors: [],
  };
}
