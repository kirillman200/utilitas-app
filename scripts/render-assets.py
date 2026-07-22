from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
ASSETS = PUBLIC / "assets"
ASSETS.mkdir(exist_ok=True)

INK = "#18201d"
PAPER = "#f4f0e7"
CORAL = "#eb6f52"
GOLD = "#f4c95d"
GREEN = "#67a89c"


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
    draw.rounded_rectangle((x, y, x + scale, y + scale), radius=scale // 5, fill=INK)
    pad = scale // 4
    unit = scale // 5
    draw.rectangle((x + pad, y + pad, x + pad + unit, y + pad + unit), fill=CORAL)
    draw.ellipse((x + scale - pad - unit, y + pad, x + scale - pad, y + pad + unit), fill=GOLD)
    cx = x + scale // 2
    cy = y + scale - pad - unit // 2
    draw.polygon([(cx, cy - unit // 2), (cx + unit // 2, cy), (cx, cy + unit // 2), (cx - unit // 2, cy)], fill=GREEN)


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

image = Image.new("RGB", (1200, 630), PAPER)
draw = ImageDraw.Draw(image)
draw.ellipse((830, -180, 1310, 300), fill="#eadfcf")
draw.ellipse((950, 390, 1260, 700), fill="#d7e5df")
draw_mark(draw, 84, 76, 104)
draw.text((216, 82), "UTILITAS", fill=INK, font=font(44, True))
draw.text((84, 246), "Small tools.", fill=INK, font=font(72, True))
draw.text((84, 326), "Real utility.", fill=CORAL, font=font(72, True))
draw.text((88, 444), "Focused browser tools for creating, planning,", fill="#4f5a55", font=font(28))
draw.text((88, 482), "and protecting everyday work.", fill="#4f5a55", font=font(28))

for x, colour, label in [(770, CORAL, "CREATE"), (900, "#6f98bd", "PLAN"), (1030, GREEN, "PROTECT")]:
    draw.rounded_rectangle((x, 286, x + 104, 390), radius=24, fill=colour)
    draw.text((x + 52, 416), label, anchor="mm", fill=INK, font=font(15, True))

image.save(ASSETS / "utilitas-share.png", optimize=True)
