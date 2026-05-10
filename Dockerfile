FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

# =========================
# Build arguments
# =========================

ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG SUPABASE_SERVICE_ROLE_KEY

ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY

# =========================
# Build environment
# =========================

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY

ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY

COPY package.json pnpm-lock.yaml ./

COPY prisma ./prisma

RUN pnpm install

COPY . .

RUN pnpm build

# =========================
# Production Image
# =========================

FROM node:20-alpine

WORKDIR /app~

RUN npm install -g pnpm

COPY --from=builder /app ./

ENV NODE_ENV=production

EXPOSE 3000

CMD ["pnpm", "start"]