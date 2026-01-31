#!/bin/bash

# Script to connect Git to Cloudflare Pages via API
# This is an alternative if you can't find the option in the dashboard

# You'll need:
# 1. Cloudflare Account ID (found in dashboard URL or account settings)
# 2. Cloudflare API Token with Pages:Edit permissions
# 3. GitHub token (for repository access)

echo "This script will create a new Cloudflare Pages project connected to GitHub"
echo ""
echo "You need:"
echo "1. Cloudflare Account ID"
echo "2. Cloudflare API Token (create at: https://dash.cloudflare.com/profile/api-tokens)"
echo "3. GitHub Personal Access Token (create at: https://github.com/settings/tokens)"
echo ""

read -p "Cloudflare Account ID: " CF_ACCOUNT_ID
read -p "Cloudflare API Token: " CF_API_TOKEN
read -p "GitHub Token: " GITHUB_TOKEN

# Create project with Git connection
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/pages/projects" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "swiftherb-git",
    "production_branch": "main",
    "build_config": {
      "build_command": "pnpm build",
      "destination_dir": ".next",
      "root_dir": "/",
      "web_analytics_tag": null,
      "web_analytics_token": null
    },
    "deployment_configs": {
      "production": {
        "env_vars": {}
      },
      "preview": {
        "env_vars": {}
      }
    }
  }'

echo ""
echo "Note: Git connection must be done via dashboard. This script creates the project,"
echo "but you'll still need to connect Git through the Cloudflare dashboard UI."
echo ""
echo "After running this, go to dashboard and connect Git to the new project."
