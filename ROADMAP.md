# Dorm Room 3D Reconstruction Roadmap

## Goal
Build a web-first AI room understanding experience focused on the dorm room use case. The first version should predict room geometry, placement, and scale for:
- twin bed
- desk
- small closet
- drawers/storage

The experience should optimize for measurement accuracy, not color or style.

## Phase 1: AI-first dorm room model

### MVP objective
Accept a single top-view or near-top-view photo and return a true-scale room layout with correctly sized and placed furniture.

### What to predict
- room footprint and wall positions
- door location and width
- bed position, orientation, and size
- desk position, orientation, and size
- closet/drawer zone position and size
- room scale anchored by known object sizes

### Core idea
Use reference objects with known dimensions as scale anchors.
For example:
- Twin bed: 39" × 80"
- Standard dorm desk: ~48" × 24"
- Closet width: ~30"–36"
- Standard door width: 30" or 36"

This lets the model infer true scale from a photo instead of guessing.

## Phase 2: Data and training approach

### Label format
Each training sample should include:
- photo image
- object bounding boxes for the room elements
- object class labels (bed, desk, closet, dresser, door)
- known size anchors for one or more objects
- room dimensions or wall boundary polygons

### Data sources
- real dorm room images with top/near-top views
- synthetic dorm room renders for faster iteration
- reference objects labeled with actual measured sizes

### Training targets
- object detection + classification for furniture
- dimension regression for object width/depth/height
- room layout prediction (walls and door position)
- scale calibration using anchor objects

## Phase 3: Conversion to your 3D editor

### Output format
Convert model predictions into the app's internal `RoomLayout` structure:
- `room.width`, `room.depth`, `room.height`
- `walls` and `door`
- `furniture` with `position`, `size`, and `rotation`

### UI flow
- upload one photo
- optionally confirm a reference object size
- preview the generated room layout
- allow lightweight correction (if needed)

## Phase 4: Iteration and quality

### First priority
- make measurement and placement accurate
- ensure the bed and desk sizes are correct
- keep the room model physically coherent

### Later priorities
- better object detection for drawers and storage
- brand/style recognition from furniture images
- support short video input and LiDAR-enhanced reconstruction

## Next immediate step
1. add UI support for reference-object anchors in the current web app
2. define the first training label schema
3. build a small prototype pipeline for converting detection outputs into `RoomLayout`

## Where I need your feedback
- confirm the set of reference objects you want to use first
- choose whether the site should ask users to confirm one anchor object after upload
- agree on whether the first version should be "top-down only" or allow small camera tilt
- provide a sample of real dorm room measurement references when available
