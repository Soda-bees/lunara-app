"""Regenerate Lunara launcher icons with a light/dark background.

Source mark: black canvas + peach-rose rings. Near-black pixels are treated as
the background. The rings are cropped to their bounding box first so we do not
bake source padding into the adaptive icon (that caused a tiny glyph + thick
frame). Night-density launcher PNGs are not generated: they override
mipmap-anydpi-v26 adaptive XML in dark mode and make the splash icon huge.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SRC = Path(
    r"C:\Users\pc\.cursor\projects\d-New-folder-Apps-Project-Lunara\assets\lunara-app-icon-1024.png"
)
FALLBACK_SRC = ROOT / "assets" / "app-icon.png"

WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
THRESHOLD = 40
# Stay inside the 66% adaptive safe zone, with extra margin for OEM
# launchers (Realme/ColorOS) that use a tighter squircle than Pixel.
FOREGROUND_SCALE = 0.60
# Legacy PNGs are masked as a rounded square on many OEMs; keep the
# circle clearly inside those corners.
LEGACY_SCALE = 0.70

ANDROID_LEGACY = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}
ANDROID_FOREGROUND = {
    "mipmap-mdpi": 108,
    "mipmap-hdpi": 162,
    "mipmap-xhdpi": 216,
    "mipmap-xxhdpi": 324,
    "mipmap-xxxhdpi": 432,
}
IOS_ICONS = {
    "AppIcon-20@2x.png": 40,
    "AppIcon-20@3x.png": 60,
    "AppIcon-29@2x.png": 58,
    "AppIcon-29@3x.png": 87,
    "AppIcon-40@2x.png": 80,
    "AppIcon-40@3x.png": 120,
    "AppIcon-60@2x.png": 120,
    "AppIcon-60@3x.png": 180,
    "AppIcon-1024.png": 1024,
}


def load_source() -> Image.Image:
    path = SRC if SRC.exists() else FALLBACK_SRC
    return Image.open(path).convert("RGBA")


def is_background(r: int, g: int, b: int, a: int) -> bool:
    return a > 0 and r < THRESHOLD and g < THRESHOLD and b < THRESHOLD


def recolor(img: Image.Image, color: tuple[int, int, int] | None) -> Image.Image:
    rgba = img.convert("RGBA")
    pixels = rgba.load()
    w, h = rgba.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if is_background(r, g, b, a):
                pixels[x, y] = (*color, 255) if color is not None else (0, 0, 0, 0)
    return rgba


def crop_mark(img: Image.Image, pad: int = 16) -> Image.Image:
    """Square-crop to the non-background glyph so source padding is not reused."""
    rgba = img.convert("RGBA")
    pixels = rgba.load()
    w, h = rgba.size
    minx, miny, maxx, maxy = w, h, 0, 0
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a == 0 or is_background(r, g, b, a):
                continue
            minx = min(minx, x)
            miny = min(miny, y)
            maxx = max(maxx, x)
            maxy = max(maxy, y)
    if maxx < minx:
        return rgba
    cx = (minx + maxx) / 2
    cy = (miny + maxy) / 2
    half = max(maxx - minx, maxy - miny) / 2 + pad
    left = max(0, int(round(cx - half)))
    top = max(0, int(round(cy - half)))
    right = min(w, int(round(cx + half)))
    bottom = min(h, int(round(cy + half)))
    side = min(right - left, bottom - top)
    return rgba.crop((left, top, left + side, top + side))


def scale_on_canvas(img: Image.Image, canvas_size: int, scale: float) -> Image.Image:
    inner = max(1, int(round(canvas_size * scale)))
    resized = img.resize((inner, inner), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    offset = (canvas_size - inner) // 2
    canvas.paste(resized, (offset, offset), resized)
    return canvas


def save_rgb(image: Image.Image, path: Path, size: int, background: tuple[int, int, int]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    resized = image.resize((size, size), Image.Resampling.LANCZOS).convert("RGBA")
    canvas = Image.new("RGB", (size, size), background)
    canvas.paste(resized, mask=resized.split()[-1])
    canvas.save(path, "PNG")


def save_round(image: Image.Image, path: Path, size: int, background: tuple[int, int, int]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    resized = image.resize((size, size), Image.Resampling.LANCZOS).convert("RGBA")
    canvas = Image.new("RGBA", (size, size), (*background, 255))
    canvas.paste(resized, mask=resized.split()[-1])
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size - 1, size - 1), fill=255)
    canvas.putalpha(mask)
    canvas.convert("RGB").save(path, "PNG")


def save_rgba(image: Image.Image, path: Path, size: int) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.resize((size, size), Image.Resampling.LANCZOS).save(path, "PNG")


def main() -> None:
    source = load_source()
    mark = crop_mark(recolor(source, None))
    white_icon = crop_mark(recolor(source, WHITE))
    black_icon = crop_mark(recolor(source, BLACK))

    res = ROOT / "android" / "app" / "src" / "main" / "res"
    for folder, size in ANDROID_LEGACY.items():
        legacy = scale_on_canvas(mark, size, LEGACY_SCALE)
        save_rgb(legacy, res / folder / "ic_launcher.png", size, WHITE)
        save_round(legacy, res / folder / "ic_launcher_round.png", size, WHITE)

    for night_dir in res.glob("mipmap-night-*"):
        for png in night_dir.glob("ic_launcher*.png"):
            png.unlink()
        if not any(night_dir.iterdir()):
            night_dir.rmdir()

    for folder, size in ANDROID_FOREGROUND.items():
        fg = scale_on_canvas(mark, size, FOREGROUND_SCALE)
        save_rgba(fg, res / folder / "ic_launcher_foreground.png", size)

    ios = ROOT / "ios" / "Lunara" / "Images.xcassets" / "AppIcon.appiconset"
    for name, size in IOS_ICONS.items():
        light = scale_on_canvas(mark, size, LEGACY_SCALE)
        save_rgb(light, ios / name, size, WHITE)
        dark = scale_on_canvas(mark, size, LEGACY_SCALE)
        save_rgb(dark, ios / name.replace(".png", "-dark.png"), size, BLACK)

    master = ROOT / "assets" / "app-icon.png"
    save_rgb(scale_on_canvas(mark, 1024, LEGACY_SCALE), master, 1024, WHITE)
    print("generated cropped light/dark launcher icons")


if __name__ == "__main__":
    main()
