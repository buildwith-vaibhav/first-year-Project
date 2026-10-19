# Remaining large source files

These four files are complete in the local enhanced package (`vkart-storefront-enhanced.tar.gz`) but are large for API upload. Copy them into this repo after cloning the branch:

```bash
# From the extracted local package:
cp path/to/vkart/src/app/shop/ShopClient.tsx        Vkart/src/app/shop/
cp path/to/vkart/src/app/page.tsx                  Vkart/src/app/
cp path/to/vkart/src/app/checkout/CheckoutClient.tsx Vkart/src/app/checkout/
cp path/to/vkart/src/db/seed.ts                    Vkart/src/db/

git add Vkart
git commit -m "feat(vkart): add remaining large source files"
git push origin feature/vkart-storefront
```

| File | Purpose |
|------|--------|
| `src/app/shop/ShopClient.tsx` | Shop filters, search, sort |
| `src/app/page.tsx` | Home page |
| `src/app/checkout/CheckoutClient.tsx` | Checkout form |
| `src/db/seed.ts` | Product catalog seed data |

Everything else (wishlist, image fixes, cart, layout, product detail, etc.) is already on this branch.
