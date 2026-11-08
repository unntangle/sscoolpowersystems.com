# Site photography

Drop image files here with these exact names. Each one replaces its placeholder automatically
(restart `pnpm dev` if it doesn't appear). Use photos you own or have licensed: brand dealer media kits,
your own installation shoots, or paid stock. Do not use other retailers' website images.

| File | Where it shows | Size |
| --- | --- | --- |
| sscool-logo.webp | Site logo (header, footer) | 1200×255, already in place |
| categories/air-conditioners.png, washing-machines.png, refrigerators.png, televisions.png, inverters.png | The five category circles on the homepage (png, webp or jpg) | 800×800, transparent cut-out |
| brands/panasonic, mitsubishi-heavy-industries, daikin, mitsubishi-electric, haier (.svg/.png/.webp) | Brand row and Brands menu | SVG preferred, transparent |
| home/hero-ac.jpg, hero-convertible.jpg, hero-home.jpg | Hero carousel | 2400×1200 |
| home/offer-exchange.png, offer-all-in.png, offer-emi.png, offer-returns.png | Spotlight cards (product cut-out, transparent) | 1200×1200 |
| home/banner-living.jpg, banner-kitchen.jpg, banner-laundry.jpg | Full-width banners (AC, refrigerator, washing machine) | 2400×1100 |
| home/everyday-feature.jpg | "Your everyday, made easier" wide photo | 2400×1000 |
| home/brand.jpg | "Authorised brands" banner | 2000×900 |
| stories/ac-tonnage.jpg, convertible.jpg, split-vs-window.jpg, fridge-size.jpg, inverter.jpg | Guide cards on the dark rail | 1200×1500 |
| installations/install-1.jpg … install-4.jpg | Real installations (then set `sample: false` in src/content/home.ts) | 1200×1600 |

Tips: keep the subject on the right third for hero and banners (text sits on the left), export JPG at
quality 80, and keep files under 500 KB. Next.js converts them to AVIF/WebP automatically.
