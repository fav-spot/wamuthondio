

# Wamuthondio Cooking Gas Supply — Single-Page Website

## Overview
A mobile-first, single-page website for a local LPG gas delivery business in Karatina, Kenya. WhatsApp is the primary CTA throughout. The uploaded hero image will be used as the hero background.

## Design System
- **Colors**: Primary orange (#E85D04), navy (#0F1F3D), gold (#FFB703), off-white (#F8F6F1), WhatsApp green (#25D366)
- **Font**: Plus Jakarta Sans (Google Fonts)
- **Style**: Rounded cards (16-20px), smooth scroll-reveal animations via IntersectionObserver, mobile-first

## Sections (in order)
1. **Navbar** — Fixed top, business name + flame emoji, nav links with smooth scroll, green "Order Now" WhatsApp button, hamburger menu on mobile
2. **Hero** — Full-screen with uploaded image as background + dark navy overlay, headline, two CTA buttons (WhatsApp + Call), 4 pill badges
3. **Trust Bar** — Navy strip with hours, brands, phone, delivery info
4. **6kg Products** — Title, subtitle, 5 cylinder images in 3+2 grid (placeholder images styled as product cards with brand colors since we can't embed external images directly), hover zoom, two price cards (Refill / Full Cylinder) with WhatsApp CTAs
5. **13kg Products** — Same layout, 3 images in a row, two price cards
6. **Refilling Guide** — Two cards: red-bordered (brand-locked rules with brand grid) and green-bordered (universal exchange), WhatsApp CTA for photo
7. **How to Order** — Navy background, 3 steps with icons
8. **Why Choose Us** — 4 icon cards grid
9. **About** — Two columns: placeholder image with overlay badge + story text with checkmarks
10. **CTA Banner** — Orange gradient, WhatsApp button
11. **Contact** — Two columns: contact details + styled location card with Google Maps link
12. **Footer** — Navy, 3 columns, copyright bar
13. **Floating WhatsApp Button** — Fixed bottom-right, bounce animation, hover label

## Key Details
- All WhatsApp links use pre-filled messages specific to each section
- Product images will be styled placeholder cards showing brand name, color, and size (since we can't fetch external images at build time) — easy to swap for real photos later
- Brand logos in Refilling Guide shown as styled brand cards with their signature colors
- Hero uses the uploaded image (`WAMUTHONDIO_S_HEROES_PICTURE.png`) with navy overlay
- Scroll-reveal animations with staggered delays on grids
- No 35kg cylinders anywhere
- Phone: 0722 446 378 / WhatsApp: same number

