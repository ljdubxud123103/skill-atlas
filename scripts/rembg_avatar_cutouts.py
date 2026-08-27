from pathlib import Path
import sys

from rembg import new_session, remove


ROOT = Path.cwd() / "public" / "avatars"
session = new_session("u2net_human_seg")

for source in sorted(ROOT.glob("*-3d.png")):
    target = source.with_name(source.name.replace("-3d.png", "-cutout.png"))
    if source.name.startswith("01-"):
        continue
    result = remove(source.read_bytes(), session=session, alpha_matting=True, alpha_matting_foreground_threshold=240, alpha_matting_background_threshold=10)
    target.write_bytes(result)
    print(target.name, file=sys.stderr, flush=True)
