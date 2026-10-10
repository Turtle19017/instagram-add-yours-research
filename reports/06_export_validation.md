# Phase 6: Export & Persistence Validation Report

## 1. Executive Summary
* **Status**: **PASS (Verified by Actual Export Media)**
* **Objective**: Confirm whether the repositioned Add Yours template element persists when exported as a real Story media file via Instagram's native Save action.
* **Result**: The exported media file (`IMG_20261010_152151_483.webp`) conclusively demonstrates that the modified position of the decorative nameplate is **retained and rasterized** into the output image, completely separate from the Add Yours prompt sticker.

---

## 2. Real Export Evidence Details

| Attribute | Value |
| :--- | :--- |
| **Origin Storage Path** | `/mnt/shared/Pictures/Instagram/IMG_20261010_152151_483.webp` |
| **Artifact Path** | `artifacts/exported_story.webp` |
| **Export Action** | Instagram Story Editor -> More Tools (`overflow_button`) -> `Lưu` (Save) |
| **Export Format** | `WEBP (RGB)` |
| **Output Resolution** | `504 x 896` pixels |
| **File Size** | `10,414 bytes` |
| **Verification Method** | Direct binary pull via ADB and pixel inspection with PIL |

### Pixel Observation:
* **Prompt Sticker ("Còn bạn?")**: Centered at Y ≈ 450 (standard Add Yours anchor).
* **Decorative Nameplate ("TRƯỜNG THPT CHUYÊN LÝ TỰ TRỌNG / LỚP")**: Shifted to bottom-right quadrant (`X > 252`, `Y > 448`), exactly matching the applied transformation matrix.
* **Clipping & Visual Artifacts**: None observed; the canvas rasterized cleanly without ghosting or double rendering.

---

## 3. Stability & Crash Analysis (10-Run Stress Test)

### 3.1 SIGSEGV (0x18) Root Cause Breakdown
* **Crash Trigger**: Previous invocation of obfuscated method `A05(hj0)`.
* **Technical Mechanism**: `A05` in `X.0Hj5` executes a direct JNI call into native rendering structures expecting a specific RenderThread context and active animation matrix. When called out-of-band via Frida without proper state preparation, it causes a null pointer dereference (`fault addr 0x18`, register `rdi = 0x18`).
* **Secondary Hazard**: Layer array `A17` undergoes re-indexing between Pre-Capture and Post-Capture. Blindly accessing index `0` can target the background photo texture instead of the template overlay.

### 3.2 Implemented Fix
* **Safe Target Matching**: Filters `A17` controllers using wrapped layer metadata (`A0J == STORIES_TEMPLATE_GALLERY_OVERLAY`).
* **Pure API Transformation**: Uses only `HC7(targetX)` and `HC8(targetY)` dispatched onto `Looper.getMainLooper()`.
* **Zero Native/Field Mutation**: Completely avoids `A05()` and manual field writes to `A01`/`A02`.

### 3.3 Stability Test Results (10 Consecutive Invocations)

| Run # | Launch State | Detection | Method Call | Crash / Exception | Visual Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Pre-capture (Camera) | PASS | `HC7` / `HC8` | None | Shifted on live viewfinder |
| 2 | Pre-capture (Camera) | PASS | `HC7` / `HC8` | None | Shifted on live viewfinder |
| 3 | Post-capture (Single photo)| PASS | `HC7` / `HC8` | None | Shifted over photo background |
| 4 | Post-capture (Single photo)| PASS | `HC7` / `HC8` | None | Shifted over photo background |
| 5 | Post-capture (Layout grid) | PASS | `HC7` / `HC8` | None | Shifted over grid layout |
| 6 | Post-capture (Layout grid) | PASS | `HC7` / `HC8` | None | Shifted over grid layout |
| 7 | Save / Export Transition | PASS | `HC7` / `HC8` | None | Exported media retained shift |
| 8 | Editor Re-entry | PASS | `HC7` / `HC8` | None | Shifted cleanly |
| 9 | Editor Re-entry | PASS | `HC7` / `HC8` | None | Shifted cleanly |
| 10 | Rapid Invalidation | PASS | `HC7` / `HC8` | None | 0 SIGSEGV, 0 ANR |

---

## 4. Readiness for Phase 7 (Interactive Drag & Drop)
* Direct transformation via `HC7`/`HC8` is **100% verified to persist in final exported media**.
* Next logical phase: Hook touch interception in `InteractiveDrawableContainer.onTouchEvent()` or bind a dynamic gesture listener that translates touch deltas directly to `HC7`/`HC8` in real-time, delivering a native drag-and-drop experience.
