# Design QA — 实验室前线官网

## Visual truth

- Selected direction: `Frontier Observatory / 前沿观测站`
- Reference image: `design/reference-option-1.png`
- Reference dimensions: 1487 × 1058 px
- Desktop implementation: `design/implementation-desktop-final.png`
- Desktop screenshot dimensions: 1487 × 979 px
- Mobile implementation: `design/implementation-mobile.png`
- Mobile screenshot dimensions: 375 × 812 px
- Side-by-side comparison: `design/qa-comparison-final.png`
- Focused hero comparison: `design/qa-comparison-hero.png`

## Verification state

- Desktop viewport: 1502 × 1103 CSS px; captured content viewport: 1487 × 979 px
- Mobile viewport: 390 × 844 CSS px; captured content viewport: 375 × 812 px
- Desktop state: page loaded at the hero, navigation visible, no modal open
- Mobile state: page loaded at the hero, menu closed
- Full site inspected at hero, research frontiers, scientist feature, technology timeline, field note, manifesto, and footer

## Comparison history

1. First comparison found the hero headline wrapping to three lines, an oversized brand lockup, and missing feature-strip metadata/action.
2. The brand lockup was reduced from 208 px to 184 px, the hero copy measure widened, and the desktop headline maximum was reduced from 104 px to 86 px.
3. Feature tags and the `阅读文章` action were restored to match the selected composition and hierarchy.
4. Final side-by-side and focused hero comparisons confirmed the navy laboratory field, cyan signal accent, bilingual navigation, headline scale, editorial strip, and visual density closely match the approved direction.

## Interaction and quality checks

- Desktop and mobile navigation scroll to the correct content sections.
- Mobile menu opens and exposes the primary subscription action.
- Search opens, accepts a query, returns realistic results, and opens a story preview.
- Subscription form accepts a valid email and displays a success state.
- Story preview, search, and subscription dialogs close correctly.
- Keyboard focus styling and reduced-motion behavior are present.
- Mobile body has no horizontal overflow.
- Browser console errors: none.
- Production build: passed.
- Site worker tests: 4/4 passed.

## Final assessment

No P0, P1, or P2 visual or interaction issues remain. The implementation is faithful to the selected target while extending it into a complete responsive editorial site.

final result: passed
