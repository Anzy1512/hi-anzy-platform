# syntax=docker/dockerfile:1

# ---- build ------------------------------------------------------------------
FROM node:20-alpine AS build
WORKDIR /app

# Dependencies first so a source-only change does not reinstall the tree.
COPY package.json package-lock.json* yarn.lock* ./

# `npm ci` would be preferable — it is the reproducible one — but the committed
# lockfile does not satisfy it here. The tree was resolved on Windows, where
# postcss-load-config takes a hoisted yaml@1.10.3; on linux npm wants a nested
# yaml@2.9.0 that the lockfile has no entry for, and `npm ci` refuses rather
# than resolving it. Regenerating the lockfile on Windows does not add the
# entry, because that platform never needs it.
#
# `npm install` resolves the difference at build time. The semver ranges in
# package.json still bound what can be installed, so this is not unpinned — but
# it is not byte-identical between builds either. To get `npm ci` back, commit
# a lockfile generated inside this image:
#   docker compose run --rm --entrypoint sh web -c "npm install --package-lock-only && cat package-lock.json" > frontend/package-lock.json
RUN npm install --no-audit --no-fund

COPY . .

# The build runs three gates via prebuild: the opacity-scale guard, the SEO
# output check, and the sitemap generator. SITE_URL must be the real origin or
# the sitemap advertises a placeholder. REACT_APP_BACKEND_URL is baked in at
# build time — CRA inlines env vars, so it cannot be changed at container start.
ARG SITE_URL=http://localhost:8080
ARG REACT_APP_BACKEND_URL=http://localhost:8010
ENV SITE_URL=$SITE_URL \
    REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL \
    GENERATE_SOURCEMAP=false \
    CI=true

RUN npm run build

# ---- serve ------------------------------------------------------------------
FROM nginx:1.27-alpine AS serve

# ARGs do not cross stages; re-declare so the CSP default can reference it.
ARG REACT_APP_BACKEND_URL=http://localhost:8010

COPY --from=build /app/build /usr/share/nginx/html
# The template, not a finished conf. nginx:alpine's entrypoint renders
# /etc/nginx/templates/*.template through envsubst into /etc/nginx/conf.d, and
# substitutes only names present in the environment — so ${CSP_CONNECT_SRC} is
# filled in while nginx's own $uri survives untouched.
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# The CSP has to allow the origin the bundle was told to call. Default it from
# the same build arg so the two cannot drift; compose can override at runtime.
ENV CSP_CONNECT_SRC=$REACT_APP_BACKEND_URL

EXPOSE 80

# Probe 127.0.0.1, not localhost. Inside the container localhost resolves to
# [::1] first and `listen 80` binds IPv4 only, so the probe was refused on IPv6
# while the site served every request fine and the container reported unhealthy.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
