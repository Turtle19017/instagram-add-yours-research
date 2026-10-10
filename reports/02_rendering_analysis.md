# Rendering Analysis Report

## 1. Executive Summary
Instagram Add Yours Story templates render locked decorative elements as **Category 1: Flattened Bitmaps** encapsulated inside a specialized sticker layer (`STORIES_TEMPLATE_GALLERY_OVERLAY`).

## 2. Component Hierarchy & Structure
* **Host Activity**: `com.instagram.modal.TransparentModalActivity`
* **Canvas Container**: `com.instagram.ui.widget.interactive.InteractiveDrawableContainer`
  * Resource ID: `app:id/capture_interactive_drawable_container`
  * Display dimensions: `504 x 896` pixels (scaled for 9:16 portrait in landscape viewport)
* **Layer Composition**:
  * **Drawable #0 (`X.0Ilf`)**: Template Gallery Overlay wrapper. Contains `X.0HGi` (`STORIES_TEMPLATE_GALLERY_OVERLAY`) holding a 720x1280 ARGB_8888 bitmap with full-canvas transparency.
  * **Drawable #1 (`X.0KiJ`)**: Add Yours Prompt Sticker (`PromptStickerModel`), interactive widget responding to gestures.

## 3. Nameplate Geometry
* **Raw Bitmap Dimensions**: `720 x 1280` pixels
* **Bounding Box**: `[Left: 124, Top: 346, Right: 597, Bottom: 535]`
* **Pixel Area**: 473px wide, 189px tall.
* **Alpha Distribution**: All pixels outside this bounding box have `alpha = 0`.

## 4. Transform and Coordinate Space
* Local container center: `(252, 448)`
* Translation methods: `CzU()` (X) and `CzV()` (Y) on controller `X.0Hj5`
* Transformation Matrix: Managed by `X.0Hj5.A0o`
* View-to-Bitmap scale factor: `s = 504 / 720 = 0.7`
