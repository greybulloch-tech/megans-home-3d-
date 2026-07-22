# Training Label Schema and Model Input/Output

This document defines the exact training labels and model I/O for the first dorm-room AI path.

## Goal
Build a web-first AI that converts a single top-down or near-top-view dorm room photo into a true-scale 3D room layout.

The first domain is:
- dorm room
- twin bed
- desk
- small closet
- drawers/storage

## Training labels
Each training sample should contain:

### 1. Image metadata
- `width` and `height` in pixels
- `cameraOrientation`: `top_down`, `angled`, or `eye_level`
- optional `focalLengthMm`
- optional `deviceModel`

### 2. Reference anchor labels
These are known-size objects used for scale.

Each anchor label includes:
- `anchorType`: `twin_bed`, `desk`, `door`, `closet`, or `dresser`
- `measuredSize`: width and optional depth/height in inches
- `bbox`: normalized image box in `[0,1]` coordinates (`x`, `y`, `width`, `height`)
- optional `notes`

Example:
```json
{
  "anchorType": "twin_bed",
  "measuredSize": { "width": 39, "depth": 80 },
  "bbox": { "x": 0.22, "y": 0.38, "width": 0.42, "height": 0.18 }
}
```

### 3. Object detection labels
These are the target classes the model should detect.

Each object label includes:
- `id`
- `class`: `bed`, `desk`, `closet`, `dresser`, `nightstand`, `chair`, `door`, `window`, or `other`
- `bbox`: normalized image box in `[0,1]`
- optional `position`: room coordinates in inches
- optional `size`: width/depth in inches
- optional `rotation`: degrees
- optional `anchorType`
- optional `confidence`
- optional `attributes`

Example:
```json
{
  "id": "bed-1",
  "class": "bed",
  "bbox": { "x": 0.18, "y": 0.35, "width": 0.45, "height": 0.22 },
  "position": { "x": 42, "z": 72 },
  "size": { "x": 39, "z": 80 },
  "rotation": 0
}
```

### 4. Room boundary annotation
This describes the room footprint and door.

Fields:
- `wallCorners`: ordered polygon points in room coordinates (inches)
- `roomWidth`: inches
- `roomDepth`: inches
- optional `roomHeight`: inches
- optional `door`
- optional `fixedZones`

Example:
```json
{
  "wallCorners": [
    { "x": 0, "z": 0 },
    { "x": 120, "z": 0 },
    { "x": 120, "z": 144 },
    { "x": 0, "z": 144 }
  ],
  "roomWidth": 120,
  "roomDepth": 144,
  "roomHeight": 96,
  "door": {
    "id": "main-door",
    "wallIndex": 0,
    "offsetFromLeft": 60,
    "width": 36,
    "swing": "in_right"
  }
}
```

### 5. Training sample schema
```json
{
  "imageUrl": "https://...",
  "imageMetadata": {
    "width": 2048,
    "height": 1536,
    "cameraOrientation": "top_down",
    "focalLengthMm": 24,
    "deviceModel": "iPhone 15 Pro"
  },
  "referenceAnchors": [ ... ],
  "objectLabels": [ ... ],
  "roomAnnotation": { ... },
  "notes": "Top-down dorm room photo with twin bed and desk."
}
```

## Model input schema
The inference model should accept:
- `imageBase64` or `imageUrl`
- `cameraMetadata` (width, height, orientation, optional focal length, optional device)
- optional `selectedReferenceAnchor`
- optional `depthMapBase64`
- optional `lidarPointCloudUrl`

This allows the model to use both visual and scale-anchor signals.

## Model output schema
The model should output a structured `RoomLayout` and detection metadata.

### Primary fields
- `roomLayout`: exact layout in inches, including walls, door, and furniture
- `referenceAnchorUsed`: which reference anchor was used for scale
- `objectDetections`: the detected objects with image bounding boxes, room positions, size, rotation, and confidence
- optional `layoutConfidence`
- optional `errors`

### Example response
```json
{
  "roomLayout": {
    "units": "in",
    "room": {
      "width": 120,
      "depth": 144,
      "height": 96,
      "wallThickness": 6
    },
    "door": {
      "id": "main-door",
      "wallIndex": 0,
      "offsetFromLeft": 60,
      "width": 36,
      "swing": "in_right"
    },
    "walls": [ ... ],
    "doors": [ ... ],
    "furniture": [ ... ]
  },
  "referenceAnchorUsed": "twin_bed",
  "objectDetections": [
    {
      "id": "bed-1",
      "class": "bed",
      "bbox": { "x": 0.18, "y": 0.35, "width": 0.45, "height": 0.22 },
      "position": { "x": 42, "z": 72 },
      "size": { "x": 39, "z": 80 },
      "rotation": 0,
      "confidence": 0.92
    }
  ],
  "layoutConfidence": 0.86
}
```

## Anchor-first training strategy
The model should explicitly use known-size anchors to convert object detections into real-world inches.

Recommended anchors for the first dorm-room domain:
- twin bed: `39" × 80"`
- dorm desk: `48" × 24"`
- door: `30"` or `36"`
- closet opening: `30"–36"`
- dresser width/height when available

## Why this schema works
- it keeps the first model narrowly focused on dorm room structure
- it trains the model to infer scale from real reference objects
- it outputs the exact `RoomLayout` format the app already uses
- it supports later extensions for LiDAR, video, and brand/style recognition

## Next step after schema
1. build a stub backend that accepts `ModelInput`
2. return a generated `ModelOutput`
3. connect the UI to that flow
4. replace the stub with a real trained model
