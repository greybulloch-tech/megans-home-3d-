const fs = require("fs");
const path = require("path");

const anchors = ["twin_bed", "desk", "door", "closet", "dresser"];
const roomWidth = 120;
const roomDepth = 144;
const roomHeight = 96;

const randomBetween = (min, max) => Math.random() * (max - min) + min;

const createRandomBBox = () => {
  const width = randomBetween(0.18, 0.35);
  const height = randomBetween(0.15, 0.28);
  return {
    x: Number(randomBetween(0.05, 0.65).toFixed(4)),
    y: Number(randomBetween(0.05, 0.55).toFixed(4)),
    width: Number(width.toFixed(4)),
    height: Number(height.toFixed(4)),
  };
};

const anchorSizes = {
  twin_bed: { width: 39, depth: 80 },
  desk: { width: 48, depth: 24 },
  door: { width: 36 },
  closet: { width: 36, depth: 24 },
  dresser: { width: 30, depth: 18 },
};

const createReferenceAnchorLabel = (anchorType) => ({
  anchorType,
  measuredSize: anchorSizes[anchorType],
  bbox: createRandomBBox(),
  notes: `Reference anchor for ${anchorType}`,
});

const buildObjectLabels = (anchorType) => {
  return [
    {
      id: "bed-1",
      class: "bed",
      bbox: createRandomBBox(),
      position: { x: 42, z: 90 },
      size: { x: 39, z: 80 },
      rotation: 0,
      anchorType: anchorType === "twin_bed" ? "twin_bed" : undefined,
    },
    {
      id: "desk-1",
      class: "desk",
      bbox: createRandomBBox(),
      position: { x: 60, z: 24 },
      size: { x: 48, z: 24 },
      rotation: 0,
      anchorType: anchorType === "desk" ? "desk" : undefined,
    },
    {
      id: "closet-1",
      class: "closet",
      bbox: createRandomBBox(),
      position: { x: 6, z: 6 },
      size: { x: 36, z: 24 },
      rotation: 0,
      anchorType: anchorType === "closet" ? "closet" : undefined,
    },
    {
      id: "door-1",
      class: "door",
      bbox: createRandomBBox(),
      position: { x: 60, z: 0 },
      size: { x: 36, z: 1 },
      rotation: 0,
      anchorType: anchorType === "door" ? "door" : undefined,
    },
    {
      id: "dresser-1",
      class: "dresser",
      bbox: createRandomBBox(),
      position: { x: 100, z: 80 },
      size: { x: 30, z: 18 },
      rotation: 0,
      anchorType: anchorType === "dresser" ? "dresser" : undefined,
    },
  ];
};

const buildRoomAnnotation = () => ({
  wallCorners: [
    { x: 0, z: 0 },
    { x: roomWidth, z: 0 },
    { x: roomWidth, z: roomDepth },
    { x: 0, z: roomDepth },
  ],
  roomWidth,
  roomDepth,
  roomHeight,
  door: {
    id: "main-door",
    wallIndex: 0,
    offsetFromLeft: 60,
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
});

const generateDormRoomTrainingSample = (anchorType) => ({
  imageMetadata: {
    width: 2048,
    height: 1536,
    cameraOrientation: "top_down",
    focalLengthMm: 24,
    deviceModel: "iPhone 15 Pro",
  },
  referenceAnchors: [createReferenceAnchorLabel(anchorType)],
  objectLabels: buildObjectLabels(anchorType),
  roomAnnotation: buildRoomAnnotation(),
  notes: `Synthetic dorm room sample with ${anchorType} as a scale anchor.`,
});

const count = Number(process.argv[2] || 10);
const dataset = Array.from({ length: count }, () => {
  const anchorType = anchors[Math.floor(Math.random() * anchors.length)];
  return generateDormRoomTrainingSample(anchorType);
});

const outputDir = path.join(__dirname, "..", "data");
fs.mkdirSync(outputDir, { recursive: true });
const outputPath = path.join(outputDir, "synthetic-dorm-dataset.json");
fs.writeFileSync(outputPath, JSON.stringify(dataset, null, 2));
console.log(`Generated ${dataset.length} synthetic training samples to ${outputPath}`);
