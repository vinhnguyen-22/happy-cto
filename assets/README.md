# Tea Realms – CTO Birthday Web Game: Full Asset Package

Contains **28 core assets** across 5 groups, plus high-resolution sprite/source references, a legacy sprite, and concept previews.

## Folders
- `01_Characters/`: 2 dialogue portraits + player sprite. Default sprite is the later CTO-inspired version; backup `player_spritesheet_old_traveler.png` is also retained.
- `02_Tea_Temple_Hub/`: 2 doors, 1 hall background (PNG) + 1 looping MP4 video background (`bg_hub_tea_temple.mp4` with rising teapot steam), 1 tea table, 6 tea boxes.
- `03_Six_Tea_Realms/`: 6 backgrounds at 1920×1080 (PNG) + 6 looping MP4 video backgrounds (`bg_realm1_pho_nhi.mp4` to `bg_realm6_mat_tra.mp4`) rendered dynamically with seamless looping and aspect-ratio cover.
- `04_Interactive_Nodes/`: 6 standalone transparent click icons 64×64; original source images in `highres_sources/`.
- `05_Grand_Finale/`: main Knowledge Tea Tree, birthday cake, red banner.
- `concept_previews/`: original composite art directions and reference sheets; NOT ready-to-use stand-alone PNG icons.

## Sprite coordinates
Player: 128×192 PNG grid (4 columns × 4 rows), each frame 32×48 px. Rows (top-down): Down, Up, Left, Right; columns = 4 animation phases. Choose nearest-neighbor upscaling, CSS `image-rendering: pixelated`.

## Integration guidance
- Keep CSS/HTML text and click targets separate from the PNG artwork.
- Interactive icons are intended to be overlayed with 44–64px clickable regions.
- Six realm backgrounds are concept-derived and should be inspected for tight cropping or scene-specific text before production release.
- The artistically generated banner contains text; verify all Vietnamese accents manually before public display.
- Some generated sprite frames may not form perfectly loopable walking cycles; test gameplay animations.
- All core assets are normalized to the requested dimensions. The background PNG files are intentionally opaque; other sprites are RGBA.
- `asset_manifest.json` lists all core assets, dimensions, and SHA256 checksums.

Original input photos supplied by the user have been excluded from the package; only stylized game assets are included.
