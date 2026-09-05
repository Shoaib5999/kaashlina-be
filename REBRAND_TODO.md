# Kaashlina Backend — Go-Live TODO

This repo was rebranded from the faithful-be (Faithful Meat) codebase into the
Kaashlina backend (flowers, cakes, and gifting). The code, schema, and seed
data are ready, but this **cannot go live** until the business owner completes
the following:

## 1. Infrastructure — provision brand-new resources (never reuse Faithful Meat's)

- [ ] Provision a **new** Supabase (or other Postgres) database dedicated to Kaashlina.
      Fill in `DATABASE_URL` and `DIRECT_URL` in `.env` (or your hosting provider's
      env var UI) with the real pooled and direct connection strings.
- [ ] Set up a **new** Cloudflare R2 bucket for Kaashlina product/CMS images.
      Fill in `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`,
      `R2_BUCKET_NAME`, `R2_PUBLIC_URL`, `R2_ENDPOINT`.
- [ ] (If still using Cloudinary anywhere) set up a **new** Cloudinary account
      and fill in its credentials — do not reuse Faithful Meat's account.
- [ ] Set up a **new** Redis instance (Railway/Upstash/etc.) and fill in `REDIS_URL`.
      Optional — the app runs with caching disabled if left unset.

## 2. Payments & shipping

- [ ] Get real **Razorpay** keys (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`) for the
      Kaashlina business account and fill them in.
- [ ] If using Razorpay Magic Checkout, enable it on the Razorpay dashboard and
      register the `magic/shipping-info`, `magic/promotions`, and
      `magic/promotions/apply` callback URLs shown in `.env.example`.
- [ ] Get real **Shiprocket** API credentials (`SHIPROCKET_EMAIL`,
      `SHIPROCKET_PASSWORD`, `SHIPROCKET_CHANNEL_ID`) for the Kaashlina store.

## 3. Email & OTP

- [ ] Set up **Resend** with a verified `kaashlina.in` sending domain, then fill
      in `RESEND_API_KEY` and confirm `RESEND_FROM` uses the verified domain.
- [ ] If phone-number OTP login is wanted, get real **MSG91** credentials
      (`MSG91_AUTH_KEY`, `MSG91_TEMPLATE_ID`) with a DLT-approved template.
      Otherwise leave unset — phone login returns a clean 503 and the rest of
      the app works fine without it.
- [ ] Set up real **Google OAuth** credentials (`GOOGLE_CLIENT_ID`,
      `GOOGLE_CLIENT_SECRET`) and register the production callback URL.

## 4. Real business info (replace all placeholders)

- [ ] Replace the placeholder `STORE_PHONE`, `STORE_ADDRESS`, `STORE_CITY`,
      `STORE_STATE`, `STORE_PINCODE` in `.env` with Kaashlina's real registered
      address and phone number.
- [ ] Replace `CONTACT_INBOX` / `STORE_EMAIL` with a real, monitored inbox.
- [ ] Replace `UPI_VPA` with the real UPI handle if UPI is offered outside Razorpay.
- [ ] Pick a real, hard-to-guess `NTFY_TOPIC` for order push notifications (or
      self-host ntfy and set `NTFY_BASE_URL`).
- [ ] Set a strong, unique `ADMIN_PASSWORD` before running `seed:admin` — never
      ship the placeholder value.
- [ ] Any social handles / phone numbers referenced by the frontend or CMS copy
      should be filled in with real Kaashlina accounts, not left as placeholders.

## 5. Database setup (first deploy only)

Run these once, in order, against the **real**, freshly-provisioned database:

```bash
npx prisma migrate deploy   # or `migrate dev` in a local/dev environment
npm run seed:master
npm run seed:flower-types
node prisma/seed-occasions.js
npm run seed:products
npm run seed:admin
```

`seed:indexes` (`npm run seed:indexes`) is optional but recommended once — it
creates the Postgres full-text search index used by `/api/search`.

## 6. Content review

- [ ] Replace the Unsplash placeholder product photography with real Kaashlina
      product photos via the admin upload UI once available.
- [ ] Review all seeded product descriptions/prices — they're realistic
      placeholders, not final catalog data.
- [ ] Review CMS home image slots, hero banners, and sliders once real brand
      photography is ready.
