This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

1. Push this repo to GitHub and import it in [Vercel](https://vercel.com/new).
2. Add environment variables in the Vercel project settings:
   - **`GEMINI_API_KEY`** (required) — get an API key from [Google AI Studio](https://aistudio.google.com/apikey).
   - Optionally: `GEMINI_VALIDATION_MODEL`, `GEMINI_IMAGE_MODEL` (default: `gemini-2.5-flash`).
3. Deploy. The simulate API may take 10–30 seconds; the route is configured with `maxDuration: 60` for Vercel Pro. On the Hobby plan (10s limit), long runs may time out.

For local development, copy `.env.example` to `.env.local` and set `GEMINI_API_KEY`.

See [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for more.
