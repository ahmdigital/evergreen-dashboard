# https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

FROM node:lts-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM node:lts-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM node:lts-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# the "nextjs" user in the docker container doesn't have create new file capability
# but the application dynamically generates dynamicCache file at runtime
# which means these files won't be bundled at build time, i.e. files won't be created at runtime 
# so, to make this work with docker container, we manually include them in the build step
COPY --from=builder --chown=nextjs:nodejs /app/defaultDynamicCache.json ./defaultDynamicCache.json
COPY --from=builder --chown=nextjs:nodejs /app/defaultDynamicCache.json ./dynamicCache.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Install OpenSSH and set the password for root to "Docker!". In this example, "apk add" is the install instruction for an Alpine Linux-based image.
RUN apk add openssh \
     && echo "root:Docker!" | chpasswd \
     && cd /etc/ssh/ \
     && ssh-keygen -A

# Copy the sshd_config file to the /etc/ssh/ directory
COPY ./sshd_config /etc/ssh/

# Copy and configure the ssh_setup file
RUN mkdir -p /tmp
COPY ./ssh_setup.sh /tmp
RUN chmod +x /tmp/ssh_setup.sh \
    && (sleep 1;/tmp/ssh_setup.sh 2>&1 > /dev/null)

COPY run.sh ./
RUN chmod +x ./run.sh
# Open port 2222 for SSH access
EXPOSE 80 2222


# USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ./run.sh
