from pathlib import Path

import cv2
import numpy as np


# Run from the project root so Windows console encoding never touches the
# non-ASCII workspace path embedded in __file__.
ROOT = Path.cwd() / "public" / "avatars"


def extract(source: Path, target: Path) -> None:
    # cv2.imread has a Unicode-path issue on Windows; decode bytes instead.
    image = cv2.imdecode(np.fromfile(str(source), dtype=np.uint8), cv2.IMREAD_COLOR)
    if image is None:
        raise RuntimeError(f"cannot read {source}")
    height, width = image.shape[:2]
    scale = min(1.0, 640 / max(height, width))
    work = cv2.resize(image, (int(width * scale), int(height * scale)), interpolation=cv2.INTER_AREA)
    work_height, work_width = work.shape[:2]
    mask = np.zeros((work_height, work_width), np.uint8)
    rectangle = (int(work_width * 0.035), int(work_height * 0.02), int(work_width * 0.93), int(work_height * 0.95))
    background = np.zeros((1, 65), np.float64)
    foreground = np.zeros((1, 65), np.float64)
    cv2.grabCut(work, mask, rectangle, background, foreground, 4, cv2.GC_INIT_WITH_RECT)
    alpha = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)
    alpha = cv2.resize(alpha, (width, height), interpolation=cv2.INTER_LINEAR)
    kernel = np.ones((3, 3), np.uint8)
    alpha = cv2.morphologyEx(alpha, cv2.MORPH_CLOSE, kernel, iterations=1)
    alpha = cv2.GaussianBlur(alpha, (0, 0), 0.7)
    rgba = cv2.cvtColor(image, cv2.COLOR_BGR2BGRA)
    rgba[:, :, 3] = alpha
    ok, encoded = cv2.imencode(".png", rgba)
    if not ok:
        raise RuntimeError(f"cannot encode {target}")
    encoded.tofile(str(target))


for source in sorted(ROOT.glob("*-3d.png")):
    target = source.with_name(source.name.replace("-3d.png", "-cutout.png"))
    if source.name.startswith("01-") or target.exists():
        continue
    extract(source, target)
    print(target.name)
