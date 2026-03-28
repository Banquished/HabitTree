# Design System Specification: Technical Brutalism



## 1. Overview & Creative North Star: "The Kinetic Console"

This design system rejects the "friendly SaaS" aesthetic in favor of **Technical Brutalism**. The Creative North Star is **The Kinetic Console**: an interface that feels like a high-performance terminal—precise, authoritative, and illuminated from within.



We move beyond standard grids by using intentional asymmetry and "data-dense" layouts. By pairing the clinical precision of **Inter** with the utilitarian soul of **Space Grotesk** (monospaced accents), we create an environment that feels like a mission-critical dashboard. The experience is defined by high-contrast neon highlights (`#ABFF02`) cutting through deep, layered charcoal surfaces, evoking the glow of a phosphor monitor.



---



## 2. Colors & Surface Architecture

The palette is rooted in a "void" state, using neon luminescence for functional signaling.



### The "No-Line" Rule

**Strict Mandate:** Prohibit the use of 1px solid borders for sectioning. Structural boundaries must be defined solely through background shifts (e.g., a `surface-container-low` section resting on a `surface` background). This creates a sophisticated, "molded" look rather than a boxed-in layout.



### Surface Hierarchy

Utilize the Material tiers to create an architectural "stack." Instead of flat cards, treat the UI as nested hardware components:

* **Base Layer:** `surface` (#131313) – The primary canvas.

* **In-set Details:** `surface-container-lowest` (#0e0e0e) – Use for recessed data-wells or input fields.

* **Elevated Modules:** `surface-container-high` (#2a2a2a) – Use for floating utility panels.



### The Glow & Glass Rule

To achieve the "Terminal" feel without looking dated, use **Glassmorphism** for floating elements (overlays/modals).

* **Implementation:** Use `surface_container` with a `backdrop-filter: blur(12px)`.

* **Signature Texture:** Apply a subtle `linear-gradient` from `primary` (#ABFF02) to `primary_container` (#a7fa00) at 15% opacity for active states to simulate the "light bleed" of a CRT screen.



---



## 3. Typography: The Editorial Engine

The system uses a dual-font strategy to balance readability with technical flavor.



* **Primary Identity (Inter):** Used for all `display`, `headline`, and `body` scales. Inter provides the "Neutral Swiss" foundation that ensures metrics remain legible at small sizes.

* **The Technical Accent (Space Grotesk):** Reserved exclusively for `label-md` and `label-sm`. These are your monospaced "data tags." Use them for timestamps, ID strings, and small metadata to reinforce the terminal aesthetic.



**Hierarchy Note:** Use wide tracking (letter-spacing: 0.05rem) on `label` styles to enhance the "coded" look, while keeping `body-lg` tight for maximum editorial impact.



---



## 4. Elevation & Depth: Tonal Layering

We achieve depth through light physics, not drop shadows.



* **The Layering Principle:** To lift a component, transition from `surface-container-low` to `surface-container-highest`. This "step-up" in luminosity mimics an object being closer to the screen's "phosphor source."

* **Ambient Shadows:** When a float is required (e.g., a Command Palette), use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6)`. Do not use grey; use the `surface_container_lowest` value as the shadow tint.

* **The "Ghost Border":** If accessibility requires a stroke (WCAG 2.1 AA+), use the `outline_variant` (#414a34) at **20% opacity**. It should be felt, not seen.



---



## 5. Component Guidelines



### Buttons (The "Power Switches")

* **Primary:** Background `primary` (#ABFF02), text `on_primary` (#213600). No rounded corners (`0px`). Add a `box-shadow: 0 0 10px rgba(171, 255, 2, 0.4)` on hover to simulate a power-on state.

* **Secondary:** Ghost style. No background, `outline` stroke (#8b947a). On hover, fill with `surface_container_highest`.



### Cards & Lists (Data Clusters)

* **Rule:** Forbid divider lines.

* **Structure:** Separate list items using `0.4rem` (`spacing.2`) of vertical padding and a subtle shift to `surface_container_low` on hover. Use the spacing scale to create "breathable" clusters of data.



### Input Fields (Command Entry)

* **State:** Background `surface_container_lowest`. Bottom-border only (2px) using `primary` for focus.

* **Micro-interaction:** Include a blinking cursor (0.75s animation) in the text-primary color when focused to reinforce the terminal logic.



### Signature Component: "The Scanline Overlay"

For hero sections or dashboard headers, apply a fixed overlay:

`background: repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 1px, transparent 1px, transparent 2px);`

This adds the "Terminal" texture without sacrificing WCAG contrast.



---



## 6. Do's and Don'ts



### Do:

* **Do** use `primary_fixed_dim` (#92db00) for large text blocks to avoid "retina burn" while maintaining the neon brand.

* **Do** use asymmetrical spacing (e.g., `spacing.16` on the left, `spacing.8` on the right) for dashboard layouts to create an editorial, non-templated feel.

* **Do** ensure all interactive icons have a minimum 44px hit target, even if the visual icon is small.



### Don't:

* **Don't** use border-radius. Every element in this system is `0px`.

* **Don't** use standard blue for links. Use `secondary` (#a4d65b) or `primary`.

* **Don't** use generic "Grey" (#808080). Always use the tonal neutrals provided in the `surface` and `on_surface` tokens to maintain the charcoal/lime temperature.

* **Don't** use 100% opaque borders to separate content; the system relies on tonal shifts.
