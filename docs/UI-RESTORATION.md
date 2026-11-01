# Original Forever UI + minimalist landing-page motion

## Restored reference

Reference: https://e-commerce-website-theta-blush.vercel.app/ and original repository component source.

- Original black Forever/pink-dot logo, left-aligned in the header.
- Home / Collection / About / Contact links, original-style search/account/bag controls and mobile menu.
- Bordered 50/50 Latest Arrivals hero, serif title, line accents and pink portrait. On mobile, copy stacks above the photograph.
- Centered Latest Collections and Best Sellers headings with trailing rules.
- Ten latest products and five bestsellers; five columns on large screens, four/three on intermediate widths and two on small screens.
- Original image/name/price product tiles; saved favorites remain available as a functional enhancement.
- Three service icons, centered newsletter form, three-column white footer.
- Original-style About/Contact content layouts and centered Login/Sign up form. Working commerce screens inherit the original white canvas, Outfit typography, restrained borders and black actions.
- Original Outfit and Prata font files are self-hosted, with their OFL licenses included.

The earlier H&M-style navigation/campaigns and fancy crimson logo are not active. Old custom logo concepts remain under branding/alternatives only. The backend structure, Cloudinary initializer, upload support and shopping fixes remain intact.

## Motion vocabulary

| Element | Minimalist effect |
| --- | --- |
| Hero image | Once-only 1.025→1 settle over 1.1 seconds |
| Hero rule | Short scale-in, no repeated sweep |
| Hero copy / section headings | Once-only 14px upward fade over 560ms |
| Product tiles | Same subtle reveal, staggered by 45ms within a row |
| Loaded imagery | Brief opacity fade, no placeholder shimmer loop |
| Product hover | 1.035 zoom over 650ms, only on hover-capable devices |
| Shop-now rule | Small extension on hover/keyboard focus |
| Service icons | 3px lift on hover |
| Favorites / buttons | Short hover and press feedback |
| Newsletter | Soft focus-within outline transition |
| Navigation | Thin underline reveal |

No continuous motion, bouncing, marquee, flashing, cursor effects, parallax or scroll interception. Motion stays subordinate to the original UI.

## Safety and accessibility

- The original visible state is the default. IntersectionObserver adds animation without leaving content hidden if unsupported or disabled.
- Each element is revealed once. Observers unobserve revealed nodes and disconnect on teardown.
- All scripted motion honors prefers-reduced-motion; turning it on cancels active animations.
- CSS motion is fully disabled under reduced motion, and touch devices do not depend on hover to operate.
- Focus remains visible. Buttons/links use real controls rather than clickable text.
- No nonfunctional forgotten-password control, invented support contact, automatic discount or unconfigured return policy is restored.

## Testing

Run `npm run lint`, `npm run build`, `npm test`, then start the demo apps and run `npm run test:e2e` and `npm run test:motion`. Set CHROMIUM_PATH if using system Chromium. The motion suite verifies original section counts, grid columns, finite durations, once-only reveals, and no hidden/overflowing content under reduced motion at desktop/mobile widths. Browser captures wait for fonts, images and active animations to settle before screenshots.
