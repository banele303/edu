import os
import shutil

src_images = {
    'car_paint_spray': r'C:\Users\Mr Ness\.gemini\antigravity\brain\05cf5346-ae2b-40a9-8a95-cc68ba9150ec\car_paint_spray_1773341755339.png',
    'mechanical_repairs': r'C:\Users\Mr Ness\.gemini\antigravity\brain\05cf5346-ae2b-40a9-8a95-cc68ba9150ec\mechanical_repairs_1773341780848.png',
    'panel_beating': r'C:\Users\Mr Ness\.gemini\antigravity\brain\05cf5346-ae2b-40a9-8a95-cc68ba9150ec\panel_beating_1773341806514.png',
    'hero_auto_body': r'C:\Users\Mr Ness\.gemini\antigravity\brain\05cf5346-ae2b-40a9-8a95-cc68ba9150ec\hero_auto_body_1773341837628.png'
}

dest_dir = r'c:\Users\Mr Ness\Documents\Ai\outreach\cc-auto-body\public'
os.makedirs(dest_dir, exist_ok=True)

for name, src in src_images.items():
    dest = os.path.join(dest_dir, f"{name.replace('_', '-')}.png")
    shutil.copy2(src, dest)
    print(f"Copied {src} to {dest}")
