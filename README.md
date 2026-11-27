# Brand Fashion — Manufacturing Website (Demo)

A presentation demo of a website for **Brand Fashion** (مصنع براند فاشون), a ready-made clothing factory in Tanta (Ikhnaway), Egypt, that manufactures to customer specifications.

> This is a **demo**. Photos are illustrative stock images, and the quotation request is simulated. No prices, capacities, minimum quantities or certifications are stated, because none were provided.

## Concept: From Thread to Shipment
A cinematic intro: an orange stitch line runs across a charcoal screen while THREAD, FABRIC, CUT, STITCH and PACK flip in sequence. The brand name then appears and two shutters open onto the site. It runs once per session, has a skip button, and respects `prefers-reduced-motion`.

## Sections
Hero, about the factory, capabilities, products (T-shirts, tracksuits, joggers/shirwal, half-col, sets), fabrics, production process, gallery with lightbox, why us, manufacturing request, and contact. Numbered sections with a side progress rail on desktop.

## Manufacturing request
An 8-step wizard: product, fabric, colors (including a custom color), quantity per size, design or logo upload (drag and drop, stays in the browser), notes, client details, and review. A live **work order ticket** fills in beside the wizard as you go. The final step generates a formatted quotation request with copy, a `wa.me` link, and an animated WhatsApp simulation.

## Tech
Plain HTML, CSS and JavaScript. No build step, no backend, no API keys. Uploaded files never leave the browser.

```
index.html
assets/css/style.css
assets/js/app.js
assets/img/
```

Run locally: open `index.html`, or serve the folder (for example `python -m http.server`).

## Image credits
All photos are from [Unsplash](https://unsplash.com) under the Unsplash License, used for illustration only. They are not the factory's own work.
