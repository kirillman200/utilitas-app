from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
ASSETS = PUBLIC / "assets"
ASSETS.mkdir(exist_ok=True)

INK = "#11120f"
PAPER = "#f2f0e9"
SIGNAL = "#d8ff3e"
WHITE = "#fffef9"


def font(size: int, bold: bool = False):
    candidates = [
        Path("C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf"),
        Path("C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


def draw_mark(draw: ImageDraw.ImageDraw, x: int, y: int, scale: int):
    draw.rectangle((x, y, x + scale, y + scale), fill=INK)
    inset = max(2, scale // 12)
    draw.rectangle((x + inset, y + inset, x + scale - inset, y + scale - inset), outline=SIGNAL, width=max(1, scale // 24))
    label_font = font(max(10, scale // 3), True)
    draw.text((x + scale // 2, y + scale // 2), "U/", anchor="mm", fill=WHITE, font=label_font)


def square_image(size: int):
    image = Image.new("RGB", (size, size), PAPER)
    draw = ImageDraw.Draw(image)
    inset = max(1, size // 16)
    draw_mark(draw, inset, inset, size - inset * 2)
    return image


def render_square(size: int, path: Path):
    image = square_image(size)
    image.save(path, optimize=True)


render_square(32, PUBLIC / "favicon-32.png")
square_image(64).save(
    PUBLIC / "favicon.ico",
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48), (64, 64)],
)
render_square(180, PUBLIC / "apple-touch-icon.png")
render_square(192, PUBLIC / "icon-192.png")
render_square(512, PUBLIC / "icon-512.png")

# The bespoke social card is generated separately and intentionally remains untouched.
