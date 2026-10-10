# Phase 5: Repositioning PoC & Experiment Results

## 1. Overview of Experiments

| Experiment | Target | Technique | Result | Evidence |
| :--- | :--- | :--- | :--- | :--- |
| **A. Controlled Transform** | Drawable #0 (`X.0Ilf`) | Frida hook on `X.0Hj5` (`HC7`, `HC8`, `A05`) | **PASS** | Nameplate shifted visibly to bottom-right independent of Prompt Sticker. |
| **B. Direct Manipulation** | Gesture Controller | Bitmask `A08=57`, `A07=6`, Hitbox `A0w` | **PASS / BLOCKED BY CAMERA** | Flags unlocked, but camera fragment intercepts vertical swipe as gallery drawer. |
| **C. Bitmap Compositing** | Fallback Asset | Pillow crop `[124, 346, 597, 535]` & translate | **PASS** | Generated `artifacts/repositioned_template_overlay.png` cleanly without artifacts. |
| **D. Runtime Substitution** | Bitmap Cache | In-memory map replacement on `X.0HGi.A0L` | **PASS** | Live bitmap can be swapped and refreshed via `container.postInvalidate()`. |
| **E. Persistence Validation**| Editor State | Background photo change & redraw | **PASS** | Repositioned nameplate retained its new position after background photo load. |

## 2. Key Findings
1. **Direct Layer Transform is 100% Viable**:
   Because the flattened template is packaged as its own `Drawable` in `InteractiveDrawableContainer`, transforming the Drawable object directly repositions the entire nameplate across the editor screen without needing to touch individual pixels.
2. **Independence from Prompt Sticker**:
   Modifying `Drawable #0` does not affect `Drawable #1` (the "Còn bạn?" sticker), preserving normal Add Yours functionality.
3. **Redraw & Persistence**:
   The transform change survived background photo selection in the editor canvas.
