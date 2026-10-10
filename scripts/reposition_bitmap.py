"""
reposition_bitmap.py - Local Image Compositing Fallback & Utility
Extracts the nameplate bounding box from the template overlay,
clears the original area with transparency, and composites it at a target (dx, dy).
"""
import sys
import os
from PIL import Image

def reposition_overlay(input_path, output_path, dx=0, dy=-150):
    if not os.path.exists(input_path):
        print(f"Error: input file {input_path} not found.")
        return False

    img = Image.open(input_path).convert("RGBA")
    w, h = img.size
    print(f"[+] Loaded overlay: {w}x{h}")

    # Accurate detected bounding box of the nameplate: (124, 346, 597, 535)
    bbox = (124, 346, 597, 535)
    print(f"[+] Extracting nameplate bbox: {bbox}")

    # Crop nameplate
    nameplate = img.crop(bbox)

    # Create new blank transparent image
    out_img = img.copy()
    
    # Erase original nameplate area
    blank = Image.new("RGBA", (bbox[2] - bbox[0], bbox[3] - bbox[1]), (0, 0, 0, 0))
    out_img.paste(blank, (bbox[0], bbox[1]))

    # Paste at new target coordinates
    new_x = max(0, min(w - nameplate.width, bbox[0] + dx))
    new_y = max(0, min(h - nameplate.height, bbox[1] + dy))
    print(f"[+] Pasting nameplate to new position: ({new_x}, {new_y})")
    out_img.paste(nameplate, (new_x, new_y), nameplate)

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    out_img.save(output_path, "PNG")
    print(f"[+] Successfully saved repositioned overlay to: {output_path}")
    return True

if __name__ == "__main__":
    inp = sys.argv[1] if len(sys.argv) > 1 else "d:/ins/dumped_template_overlay.png"
    out = sys.argv[2] if len(sys.argv) > 2 else "d:/ins/instagram-add-yours-research/artifacts/repositioned_template_overlay.png"
    dx = int(sys.argv[3]) if len(sys.argv) > 3 else 80
    dy = int(sys.argv[4]) if len(sys.argv) > 4 else -100
    reposition_overlay(inp, out, dx, dy)
