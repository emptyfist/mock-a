# AllWeb3 landing page

Plain HTML, CSS, and JavaScript. No build step or runtime dependencies.

## Preview

Open `index.html` directly, or run:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Then visit http://127.0.0.1:4173.

The role switch changes the headline, copy, illustration, calls to action, and feature cards. The theme button switches the complete color and image system. Both choices persist locally. The carousel and FAQ are keyboard accessible, and the mobile navigation is collapsible.

Use `?role=creator&theme=dark`, `?role=brand&theme=dark`, `?role=creator&theme=light`, or `?role=brand&theme=light` to open a specific state for review.

## Figma references

The labels in the supplied message are reversed relative to the actual selected role and content in the frames. Implementation follows the visible design:

| Actual state | Figma node |
| --- | --- |
| Dark Creator | 11595:36457 |
| Dark Brand | 11592:31353 |
| Light Creator | 11604:2829 |
| Light Brand | 11612:818 |

The desktop reference is 1440px wide. Mobile layout and the theme switch are additions. “on-chian” in the closing banner was corrected to “on-chain”; the Creator steps heading consistently uses “Start earning”. The repeated LayerZero logos and 1K+ statistics are retained from the supplied design.

`design-reference/` contains the retrieved reference code, not production components. `assets/` contains the original exported Figma images and icons, plus the Inter font. `assets.js` maps these to the four states. Asset files are local so the page does not depend on expiring Figma URLs. `scripts/download-assets.py` can re-download the original assets while those source URLs remain valid.

## Preview content and destinations

As requested, no external destinations are connected. Buttons open a local preview notice. Fill in `destinations` at the top of `app.js` when URLs are available.

The designs supply only the first carousel slide and the first expanded FAQ answer. Slides 2–4 and the remaining FAQ answers are provisional copy for demonstrating interactions; review them before publishing. The Brand first slide preserves the supplied “Browse Campaigns” content.
