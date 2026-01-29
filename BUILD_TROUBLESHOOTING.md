# Build Troubleshooting Guide

## Common Build Issues & Solutions

### Issue 1: Version Mismatch Warning

**Warning**: `Mismatching @next/swc version`

**Solution**:
```bash
# Clean install
rm -rf node_modules .next
pnpm install
pnpm build
```

### Issue 2: Permission Errors

**Error**: `EPERM: operation not permitted`

**Solution**:
```bash
# Fix permissions
sudo chown -R $(whoami) node_modules .next
# Or reinstall
rm -rf node_modules .next
pnpm install
```

### Issue 3: pnpm Store Location Error

**Error**: `ERR_PNPM_UNEXPECTED_STORE`

**Solution**:
```bash
# Option 1: Reinstall
rm -rf node_modules
pnpm install

# Option 2: Fix store location
pnpm config set store-dir ~/.pnpm-store --global
pnpm install
```

### Issue 4: TypeScript Errors

**Error**: Type errors during build

**Solution**:
```bash
# Check for type errors
pnpm run lint

# Fix common issues:
# - Missing imports
# - Type mismatches
# - Undefined variables
```

### Issue 5: Module Not Found

**Error**: `Cannot find module` or `Module not found`

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules
pnpm install

# Check package.json has all required dependencies
```

### Issue 6: Build Hangs or Times Out

**Solution**:
```bash
# Clear cache and rebuild
rm -rf .next
pnpm build

# If still hanging, try with verbose output
NODE_OPTIONS='--max-old-space-size=4096' pnpm build
```

## Step-by-Step Clean Build

If nothing else works, try this complete reset:

```bash
# 1. Clean everything
rm -rf node_modules .next .pnpm-store

# 2. Clear pnpm cache (optional)
pnpm store prune

# 3. Reinstall
pnpm install

# 4. Build
pnpm build
```

## Check Your Environment

Make sure you have:
- Node.js 18+ (check with `node --version`)
- pnpm installed (check with `pnpm --version`)
- Sufficient disk space
- Write permissions in project directory

## Get Detailed Error Output

If build fails, get full error details:

```bash
# Verbose build output
pnpm build --debug

# Or check logs
pnpm build 2>&1 | tee build.log
```

## Still Not Working?

1. **Check the exact error message** - Share it for help
2. **Check Node.js version**: `node --version` (needs 18+)
3. **Check pnpm version**: `pnpm --version`
4. **Try npm instead**: `npm install && npm run build`
5. **Check disk space**: `df -h`

## Quick Fixes

```bash
# Fix most common issues
rm -rf node_modules .next
pnpm install --no-frozen-lockfile
pnpm build
```

---

**If you're seeing a specific error, please share:**
1. The exact error message
2. Your Node.js version (`node --version`)
3. Your pnpm version (`pnpm --version`)
4. The command you ran
