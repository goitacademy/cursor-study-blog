# Pre-commit Hook Setup

This project now has a pre-commit hook that automatically runs all unit tests before allowing commits.

## What was installed

1. **Husky** - Git hooks manager (installed at root level)
2. **Pre-commit hook** - Located at `.husky/pre-commit`

## How it works

When you try to commit changes:

1. Git triggers the pre-commit hook
2. The hook runs `npm test` (which executes `cd client && npm test -- --run`)
3. All unit tests in the client directory are executed
4. If **all tests pass** ✅ - the commit proceeds
5. If **any test fails** ❌ - the commit is blocked

## Testing the hook

### Successful commit (all tests pass)
```bash
git add .
git commit -m "feat: add new feature"
# Hook runs tests → Tests pass → Commit succeeds
```

### Blocked commit (tests fail)
```bash
# If you have failing tests:
git add .
git commit -m "feat: broken feature"
# Hook runs tests → Tests fail → Commit is blocked
```

## Manual test execution

You can run tests manually at any time:

```bash
# From root directory
npm test

# From client directory
cd client
npm test
```

## Test commands available

From the client directory:

- `npm test` - Run all tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report

## Files modified

1. `/package.json` - Added root package.json with test script
2. `/package-lock.json` - Added husky dependency
3. `/.husky/pre-commit` - Git hook that runs tests
4. `/node_modules/` - Husky package installed

## Bypassing the hook (not recommended)

If you absolutely need to commit without running tests (not recommended):

```bash
git commit -m "message" --no-verify
```

⚠️ **Warning**: Only use `--no-verify` in exceptional circumstances, as it defeats the purpose of the pre-commit hook.

## Benefits

- ✅ Prevents committing broken code
- ✅ Ensures all tests pass before code is committed
- ✅ Catches bugs early in development
- ✅ Maintains code quality in version control
- ✅ Automatic - no manual intervention needed

## Troubleshooting

### Hook not running
```bash
# Make sure the hook is executable
chmod +x .husky/pre-commit

# Verify husky is initialized
npm run prepare
```

### Tests taking too long
The tests run with the `--run` flag (no watch mode), so they execute once and exit. If tests are slow, consider optimizing them or splitting into unit/integration suites.

## Team setup

When a new developer clones the repository:

1. Run `npm install` in the root directory
2. The `prepare` script automatically sets up husky
3. Pre-commit hook is ready to use

No additional setup required! 🎉
