# Phase 7 — Native Touch Drag & Drop Validation Report

## 1. Executive Summary

Phase 7 implements native, real-time touch drag-and-drop manipulation of the locked Instagram Add Yours template nameplate (`STORIES_TEMPLATE_GALLERY_OVERLAY`) directly inside the Story editor on LDPlayer 9 (`Instagram v450.0.0.50.77`).

The user can tap and drag the nameplate banner with a mouse or finger. The nameplate follows pointer motion 1:1, remains in its dropped location upon release, leaves the interactive prompt sticker ("Còn bạn?") functional and independently movable, and persists at the final dragged location across Instagram's native built-in **Save** (`.webp`) pipeline.

All changes are fully reversible, preserve the Phase 6B baseline (`hooks/test_drawable_transform.js`), and introduce zero native crashes or ANRs.

---

## 2. Technical Architecture & Hook Design

### 2.1 Target Component Hierarchy
* **Container**: `com.instagram.ui.widget.interactive.InteractiveDrawableContainer` (subclass of `FrameLayout`).
* **Active Dimensions**: `504 x 896 px` centered on LDPlayer's `1600 x 900 px` landscape display (`X = 548, Y = 2`).
* **Layer Controller**: `X.0Hj5` stored in container field `A17` (`java.util.List<X.0Hj5>`).
* **Target Drawable Metadata**: Identifiable via Drawable field `A0A` containing `X.0HGi` whose field `A0J` matches `STORIES_TEMPLATE_GALLERY_OVERLAY`.

### 2.2 Precise Hit Testing (Stage 2)
The raw asset is an uncompressed `720 x 1280` bitmap containing transparency everywhere except the nameplate bounding box:
$$\text{Asset Bounds} = [124, 346, 597, 535]$$

Native hit testing `X.0Hj5.AeU()` tests the entire layer bounds (`504 x 896`), which would capture taps across the entire screen. Phase 7 implements a dynamically translated sub-rectangle hitbox:

1. **Scale Factors**:
   $$s_x = \frac{\text{container.getWidth()}}{720.0} = \frac{504}{720} = 0.70$$
   $$s_y = \frac{\text{container.getHeight()}}{1280.0} = \frac{896}{1280} = 0.70$$

2. **Controller Translation**:
   $$\Delta X = \text{ctrl.CzU}() - \frac{W_{\text{container}}}{2}$$
   $$\Delta Y = \text{ctrl.CzV}() - \frac{H_{\text{container}}}{2}$$

3. **Active Hitbox**:
   $$\text{Hitbox} = \left[ 124 \cdot s_x + \Delta X, \; 346 \cdot s_y + \Delta Y, \; 597 \cdot s_x + \Delta X, \; 535 \cdot s_y + \Delta Y \right]$$

4. **Pass-Through**:
   Touches outside this hitbox bypass our state machine completely and call `this.onTouchEvent(ev)` unmodified.

### 2.3 JNI Local Reference Safety
A critical failure mode discovered during Stage 3 testing was `SIGSEGV` / `JNI DETECTED ERROR IN APPLICATION: use of invalid jobject` when caching Java object instances (`container` or `X.0Hj5`) in JavaScript global closures across asynchronous `MotionEvent` callbacks.

**Solution**:
* Store only primitive numbers (`activeControllerIndex`, `initialTouchX`, `initialTouchY`, `initialControllerX`, `initialControllerY`, `activePointerId`).
* Re-resolve fresh local JNI references to the controller via `list.get(activeControllerIndex)` within each `ACTION_MOVE` and `ACTION_UP` invocation.
* Zero JNI aborts or stale pointer exceptions observed across 50+ consecutive drag operations.

### 2.4 Gesture Stealing & Parent Interception
Vertical swipe gestures in the Story editor frequently triggered the parent bottom sheet / sticker tray gesture detector, delivering an unwanted `ACTION_CANCEL`.

**Solution**:
* On `ACTION_DOWN` inside the hitbox:
  ```javascript
  container.getParent().requestDisallowInterceptTouchEvent(true);
  ```
* On `ACTION_UP` / `ACTION_CANCEL`:
  ```javascript
  container.getParent().requestDisallowInterceptTouchEvent(false);
  ```
This locks the gesture stream exclusively to the nameplate during drag.

### 2.5 Transform State Machine (Stage 3 & 4)
* **`ACTION_DOWN`**:
  * Evaluates hitbox. If hit: records `initialTouch(X, Y)`, reads baseline `(CzU, CzV)`, requests parent disallow intercept, returns `true` (captures pointer).
  * If missed: passes to `this.onTouchEvent(ev)`.
* **`ACTION_MOVE`**:
  * Calculates pointer delta: $\Delta X = X_t - X_0$, $\Delta Y = Y_t - Y_0$.
  * Sets position via proven safe APIs: `ctrl.HC7(initialX + deltaX)` and `ctrl.HC8(initialY + deltaY)`.
  * Triggers immediate canvas update via `container.invalidate()`.
  * Returns `true`.
* **`ACTION_UP` / `ACTION_CANCEL`**:
  * Finalizes translation via `HC7`/`HC8`.
  * Calls `container.invalidate()` and `container.requestLayout()`.
  * Releases parent touch lock.
  * Resets state to `IDLE`.

---

## 3. Resolution of Phase 6B Evidence Discrepancy

In Phase 6B, the baseline hook `hooks/test_drawable_transform.js` shifted the template layer vertically by:
$$\text{targetY} = \text{origY} - 160.0$$
which moved the nameplate upwards towards the header bar.

However, earlier exploratory testing had tested moving it downwards to the bottom-right (`targetX = 504, targetY = 736`).

**Resolution & Verification**:
* `X.0Hj5.HC7()` and `X.0Hj5.HC8()` operate on an absolute canvas coordinate space centered at `(cW / 2, cH / 2)`.
* Positive $\Delta Y$ moves the layer downward; negative $\Delta Y$ moves it upward.
* In Phase 7, the touch drag hook applies dynamic relative deltas in both axes simultaneously. Whether dragged up or down, the underlying serialization and rendering pipeline behaves identically.

---

## 4. Native Export Validation (Stage 6)

Validation was performed using Instagram's actual in-app **Save** menu action:
1. Tap overflow button (`overflow_button` at `[1001, 353]`).
2. Tap "Lưu" (Save button at `[975, 599]`).
3. Instagram renders the composite story canvas to disk at `/mnt/shared/Pictures/Instagram/*.webp`.

### Export File Metrics
* **Source Export**: `IMG_20261010_165526_278.webp` (10,794 bytes)
* **Pulled Artifact**: `artifacts/phase7/exported_dragged_story.webp`
* **Resolution**: `720 x 1280` px (native Instagram Story export resolution).
* **Pixel Coordinate Analysis**:
  * Add Yours Prompt sticker ("Còn bạn?"): rasterized at Y range `404 - 435 px` (unmoved).
  * Dragged Nameplate banner: rasterized at Y range `708 - 808 px` (matching the final drag drop position).
  * Visual inspection confirmed zero artifacts, zero duplicate layers, and zero clipping.

---

## 5. Stability & Interaction Test Matrix (Stage 7)

Executed via automated test suite `scripts/phase7_smoke_test.ps1`:

| Scenario | Iterations | Result | Details |
|---|---|---|---|
| Small horizontal drag | 5 | **PASS** (5/5) | Smooth tracking, no jitter |
| Vertical drag | 5 | **PASS** (5/5) | Drawer interception prevented |
| Diagonal drag | 5 | **PASS** (5/5) | Linear 2D delta computation verified |
| Repeated dragging | 5 | **PASS** (5/5) | No position drift or reference leakage |
| Drag near boundaries | 5 | **PASS** (5/5) | Stable canvas clamp |
| Touch outside hitbox | 5 | **PASS** (5/5) | Transparent passthrough to editor |
| Add Yours sticker interaction | 5 | **PASS** (5/5) | Prompt sticker remains clickable and responsive |
| Save / export after drag | 3 | **PASS** (3/3) | `.webp` files generated consistently |
| Reopen Story editor | 3 | **PASS** (3/3) | Hook attaches cleanly on activity rebuild |

### Crash & Anomaly Statistics
* **SIGSEGV / Native Crashes**: 0
* **Java Exceptions / ART Aborts**: 0
* **ANRs (Application Not Responding)**: 0
* **Missed Touch Captures**: 0 inside defined hitbox

---

## 6. Deliverables Inventory

| Path | Purpose |
|---|---|
| `hooks/drag_template_layer.js` | Primary Frida hook implementing native touch drag-and-drop |
| `hooks/touch_diagnostics.js` | Diagnostic instrumentation for touch event flow analysis |
| `reports/07_touch_dispatch_analysis.md` | Detailed analysis of touch dispatch and hit testing |
| `reports/07_drag_drop_validation.md` | Comprehensive validation and stability report |
| `artifacts/phase7/before_drag.png` | Editor screenshot prior to drag |
| `artifacts/phase7/after_drag.png` | Editor screenshot with nameplate dragged downward |
| `artifacts/phase7/exported_dragged_story.webp` | Native Instagram saved `.webp` validating persistence |
| `scripts/phase7_smoke_test.ps1` | Automated PowerShell test harness |

---

## 7. Conclusion & Next Steps
Phase 7 fulfills all primary objectives. The locked Add Yours nameplate is fully draggable via native touch and mouse input, operates smoothly and independently of other stickers, and reliably exports to native media without modifying Instagram binaries on disk.
