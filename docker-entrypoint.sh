#!/bin/sh
set -e

# Determine API base URL from environment, with sensible default
API_BASE="${VITE_API_BASE_URL:-${API_BASE_URL:-http://localhost:5000}}"

# Write runtime config for the SPA
mkdir -p /app/dist
cat > /app/dist/config.js <<EOF
// Generated at container start
window.__APP_CONFIG__ = { API_BASE_URL: "${API_BASE}" };
EOF

echo "Runtime API base: ${API_BASE}"

exec npm run preview -- --host 0.0.0.0 --port 8080

