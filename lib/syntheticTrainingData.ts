import type {
  TrainingSample,
  ReferenceAnchorLabel,
  TrainingObjectLabel,
  RoomBoundaryAnnotation,
  ReferenceAnchorType,
} from "./types";

const randomBetween = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const anchorSizes: Record<string, { width: number; depth?: number }> = {
  twin_bed: { width: 39, depth: 80 },
  desk: { width: 48, depth: 24 },
  door: { width: 36 },
  closet: { width: 36, depth: 24 },
  dresser: { width: 30, depth: 18 },
};

const createRandomBBox = () => {
  const width = randomBetween(0.12, 0.4);
  const height = randomBetween(0.12, 0.35);
  return {
    x: Number(randomBetween(0.05, 0.75).toFixed(4)),
    y: Number(randomBetween(0.05, 0.7).toFixed(4)),
    width: Number(width.toFixed(4)),
    height: Number(height.toFixed(4)),
  };
};

const buildObjectLabels = (anchorType: ReferenceAnchorType, roomW: number, roomD: number): TrainingObjectLabel[] => {
  // Place objects with simple heuristics so positions make sense relative to room size
  const bedWidth = anchorSizes.twin_bed.width;
  const bedDepth = anchorSizes.twin_bed.depth ?? 80;
  const deskWidth = anchorSizes.desk.width;
  const deskDepth = anchorSizes.desk.depth ?? 24;
  const closetWidth = anchorSizes.closet.width;
  const dresserWidth = anchorSizes.dresser.width;

  const bedX = clamp(randomBetween(bedWidth / 2 + 6, roomW - bedWidth / 2 - 6), bedWidth / 2, roomW - bedWidth / 2);
  const bedZ = clamp(randomBetween(bedDepth / 2 + 6, roomD - bedDepth / 2 - 6), bedDepth / 2, roomD - bedDepth / 2);
  const deskX = clamp(randomBetween(deskWidth / 2 + 6, roomW - deskWidth / 2 - 6), deskWidth / 2, roomW - deskWidth / 2);
  const deskZ = clamp(randomBetween(12, roomD - deskDepth - 6), deskDepth / 2 + 6, roomD - deskDepth / 2 - 6);

  return [
    {
      id: "bed-1",
      class: "bed",
      bbox: createRandomBBox(),
      position: { x: Math.round(bedX), z: Math.round(bedZ) },
      size: { x: bedWidth, z: bedDepth },
      rotation: Math.random() > 0.5 ? 90 : 0,
      anchorType: anchorType === "twin_bed" ? "twin_bed" : undefined,
    },
    {
      id: "desk-1",
      class: "desk",
      bbox: createRandomBBox(),
      position: { x: Math.round(deskX), z: Math.round(deskZ) },
      size: { x: deskWidth, z: deskDepth },
      rotation: 0,
      anchorType: anchorType === "desk" ? "desk" : undefined,
    },
    {
      id: "closet-1",
      class: "closet",
      bbox: createRandomBBox(),
      position: { x: Math.round(6 + closetWidth / 2), z: Math.round(6 + (closetWidth / 2)) },
      size: { x: closetWidth, z: anchorSizes.closet.depth ?? 24 },
      rotation: 0,
      anchorType: anchorType === "closet" ? "closet" : undefined,
    },
    {
      id: "door-1",
      class: "door",
      bbox: createRandomBBox(),
      position: { x: Math.round(roomW / 2), z: 0 },
      size: { x: anchorSizes.door.width, z: 1 },
      rotation: 0,
      anchorType: anchorType === "door" ? "door" : undefined,
    },
    {
      id: "dresser-1",
      class: "dresser",
      bbox: createRandomBBox(),
      position: { x: Math.round(roomW - dresserWidth - 6), z: Math.round(roomD / 2) },
      size: { x: dresserWidth, z: anchorSizes.dresser.depth ?? 18 },
      rotation: 0,
      anchorType: anchorType === "dresser" ? "dresser" : undefined,
    },
  ];
};

const createReferenceAnchorLabel = (anchorType: ReferenceAnchorType): ReferenceAnchorLabel => ({
  anchorType,
  measuredSize: anchorSizes[anchorType],
  bbox: createRandomBBox(),
  notes: `Reference anchor for ${anchorType}`,
});

export function generateDormRoomTrainingSample(anchorType: ReferenceAnchorType): TrainingSample {
  // randomize room size a bit to increase variability
  const roomW = Math.round(randomBetween(100, 140));
  const roomD = Math.round(randomBetween(120, 180));
  const roomHeight = Math.round(randomBetween(84, 120));
  const selectedAnchor = createReferenceAnchorLabel(anchorType);

  return {
    imageMetadata: {
      width: 2048,
      height: 1536,
      cameraOrientation: "top_down",
      focalLengthMm: 24,
      deviceModel: "iPhone 15 Pro",
    },
    referenceAnchors: [selectedAnchor],
    objectLabels: buildObjectLabels(anchorType, roomW, roomD),
    roomAnnotation: {
      wallCorners: [
        { x: 0, z: 0 },
        { x: roomW, z: 0 },
        { x: roomW, z: roomD },
        { x: 0, z: roomD },
      ],
      roomWidth: roomW,
      roomDepth: roomD,
      roomHeight: roomHeight,
      door: {
        id: "main-door",
        wallIndex: 0,
        offsetFromLeft: Math.round(roomW / 2),
        width: 36,
        swing: "in_right",
      },
      fixedZones: [
        {
          type: "closet",
          x: 6,
          z: 6,
          width: 36,
          depth: 24,
        },
      ],
    },
    notes: `Synthetic dorm room sample with ${anchorType} as a scale anchor.`,
  };
}

export function generateDormRoomDataset(count: number) {
  const anchors: ReferenceAnchorType[] = [
    "twin_bed",
    "desk",
    "door",
    "closet",
    "dresser",
  ];
  return Array.from({ length: count }, () => {
    const anchorType = anchors[Math.floor(Math.random() * anchors.length)];
    return generateDormRoomTrainingSample(anchorType);
  });
}
