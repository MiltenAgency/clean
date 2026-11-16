# Clear & Gleam

A fictional cleaning service website for home, deep, office, moving, and recurring cleaning. Content, navigation, service spotlights, checklist illustrations, quote form, metadata, and imagery have been adapted from the earlier language coaching concept. The yellow, cyan, blue, and indigo palette, circular cleaning logo, scrolling navbar, and orbiting service stickers are retained.

Run `npm ci` and `npm run dev`, then open http://localhost:3000. Production: `npm run build` followed by `npm start`.

The quote form validates required fields and previews a cleaning request locally. It does not send an enquiry, reserve a visit, or collect payment. Quotes depend on the agreed scope; the site makes no fixed pricing, availability, or customer review claims.

Cleaning photography is downloaded from Pexels and stored locally in `public/assets/cleaning/`. These are illustrative stock photos, not company employees or completed company projects. See `public/assets/cleaning/SOURCES.md` for provenance. Cleaning checklist artwork and service icons are original SVGs. Earlier assets and screenshots document the previous concept and are not used on this site.

Agentation is enabled only in development for page feedback. The existing Manrope font and license are retained.

The spray bottle logo was generated with the built-in image tool from the two user-supplied reference images. The transparent master and optimized website exports are in `public/assets/cleaning/`; see `LOGO-PROMPTS.md` for the generation and refinement prompts.

Hero interaction: hovering pauses the photo gallery; drag vertically to explore and release outside the gallery to resume. The gallery repeats seamlessly in both directions, with no drag limits or bounce at the ends. Keyboard users can focus the gallery and use arrow keys or Page Up and Page Down; Home resets the loop position. Headline letters and supporting words respond to nearby mouse movement, then settle back. Reduced motion disables automatic movement and text scattering while keeping manual gallery navigation available.

The website opens directly on the animated hero, with no loading screen or entry interaction.

Desktop heroes fit within one viewport. Gallery dragging follows the pointer with smoothing and a decaying release velocity; all photo sequences wrap seamlessly using measured fractional positions. Hover pauses automatic movement, and reduced motion keeps direct manual navigation without inertia.

The About section uses oversized editorial type, a tilted three-photo deck, and an indexed service card inspired by the supplied reference. Photos gently float and respond to the pointer; previous/next controls support manual exploration. Automatic rotation runs only while the section is visible and not hovered or focused, and is disabled for reduced motion. Manual navigation pauses automatic rotation.

The Process section pins the central preview image while the page scrolls. Four surrounding panels emerge from behind it at staggered scroll positions and return behind it when scrolling upward. The sequence uses scroll progress rather than one-time reveals. Mobile panels settle into two rows below the image; reduced motion shows the complete composition without a pinned scroll sequence.

The Benefits section is a native React scroll-driven stack of four photo cards. A sticky frame holds the viewport as incoming cards slide up and outgoing cards shrink, tilt, and sink behind them. The counter reflects scroll position and lets visitors jump to a card with the mouse or arrow/Home/End keys. Reduced motion uses an ordinary visible card list. The section preserves the original benefit copy and local photography; it adds no animation dependency.

The footer has a rounded white navigation panel over an angled blue backdrop, with original SVG spray bottle, sponge, and droplet characters inspired by the supplied layout reference. Service links open the existing service details; Contact us opens the local quote preview. Privacy, terms, FAQs, and back-to-top remain functional. Decorative entrance motion respects reduced-motion preferences.
