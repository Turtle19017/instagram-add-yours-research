# Instagram Add Yours Pinned Template Reverse Engineering

This repository contains the complete reverse engineering findings, instrumentation scripts, hooks, and reports for investigating pinned/locked elements in Instagram Add Yours Story templates on Android (LDPlayer 9).

## Project Structure
```text
instagram-add-yours-research/
├── artifacts/
│   └── repositioned_template_overlay.png
├── hooks/
│   ├── observations.js
│   ├── inspect_views.js
│   ├── inspect_drawables.js
│   ├── dump_bitmap.js
│   ├── test_drawable_transform.js
│   ├── test_gesture_unlock.js
│   └── test_bitmap_substitution.js
├── reports/
│   ├── 01_environment.md
│   ├── 02_rendering_analysis.md
│   ├── 03_experiment_results.md
│   └── 05_repositioning_poc.md
├── scripts/
│   ├── detect_environment.ps1
│   ├── check_frida.ps1
│   ├── inspect_editor.py
│   └── reposition_bitmap.py
└── README.md
```

## Quick Start
1. Ensure LDPlayer 9 is running with `com.instagram.android` open.
2. Start Frida server on emulator:
   ```powershell
   .\scripts\check_frida.ps1
   ```
3. Test direct Drawable transform repositioning:
   ```powershell
   frida -U -n Instagram -l .\hooks\test_drawable_transform.js -q
   ```
4. Run image compositing fallback:
   ```powershell
   python .\scripts\reposition_bitmap.py
   ```
