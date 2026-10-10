# Phase 6: Export & Persistence Validation

## 1. Objective
Verify whether the local on-screen repositioning of the Add Yours template nameplate survives post-capture rendering and local Story export/save.

## 2. Experimental Observations

### 2.1 Pre-Capture to Post-Capture Transition
* **Observation**: In Pre-Capture (camera mode), transforming Drawable #0 shifts the template immediately on the live viewfinder.
* **Photo Attachment**: When an image or grid layout is chosen, the template retains its offset relative to the underlying content.
* **Layer Re-indexing**: In Post-Capture, `InteractiveDrawableContainer` re-indexes its active controllers. Accessing by index #0 can target the background photo matrix instead of the template, requiring explicit tagging via `A0J == STORIES_TEMPLATE_GALLERY_OVERLAY`.

### 2.2 Crash Root Cause Analysis
* **Signal**: `SIGSEGV` (code 1, SEGV_MAPERR, fault addr 0x18).
* **Cause**: Invoking obfuscated method `A05(hj0)` across different thread/render contexts triggers a null pointer dereference in the native Skia/RenderThread pipeline.
* **Solution**: Mutate coordinates via `HC7`/`HC8` and translation fields directly on the UI thread (`Looper.getMainLooper()`) without calling `A05()`.

### 2.3 Export Behavior & Persistence Model
* When the Story editor renders the export surface (`StoryDraftExportSession` / RenderThread), drawables are rendered through their bound matrices (`A0o`).
* Modifying translation and bounds of the template layer directly affects the composited output bitmap.
* Published Story note: Server-side re-generation applies if an Add Yours sticker is clicked by another viewer; however, the author's local media rasterizes the modified layout cleanly.
