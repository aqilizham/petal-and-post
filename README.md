# Seroja Studio

A responsive florist storefront concept inspired by the user's mobile shopping reference. The brand, imagery, product names, and copy are original.

**Live preview:** [aqilizham.github.io/petal-and-post](https://aqilizham.github.io/petal-and-post/)

## Run locally

```sh
npm install
npm run dev
```

## What's included

- Responsive storefront with search, collection filters, product details, favourites, and a persistent shopping bag.
- Address and delivery-date checkout, delivery fee calculation, payment-method selection, and an order confirmation screen.
- Generated, project-local floral photography in `public/images/`.
- GitHub Pages workflow in `.github/workflows/deploy.yml`.

## Payment status

The checkout is deliberately a **demo**: it validates customer and delivery details and walks through order confirmation, but does not charge a card or send an order to a florist. Real payments require a server-side payment provider integration and the merchant's credentials; never put payment secrets in this static website.

## Deploy

Push to `main`; GitHub Actions builds the Vite site and publishes the `dist/` directory to GitHub Pages. The Vite base path is configured for the repository name `petal-and-post`.
