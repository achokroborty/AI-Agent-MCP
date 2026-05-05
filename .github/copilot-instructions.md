# Playwright Project - Copilot Instructions

## Project Overview
This is a Playwright testing project with TypeScript support, configured for end-to-end testing across multiple browsers (Chromium, Firefox, WebKit).

## Key Commands
- `npm install` - Install dependencies
- `npx playwright install` - Install Playwright browsers
- `npm test` - Run all tests
- `npm run test:ui` - Run tests in UI mode (interactive)
- `npm run test:debug` - Run tests in debug mode
- `npm run test:headed` - Run tests with visible browser window

## Project Structure
- `tests/` - Test files (*.spec.ts)
- `playwright.config.ts` - Playwright configuration
- `tsconfig.json` - TypeScript settings
- `package.json` - Dependencies and scripts

## Testing Best Practices
1. Use page locators with semantic selectors (getByRole, getByLabel, etc.)
2. Organize tests in describe blocks
3. Use fixtures for common setup/teardown
4. Enable trace collection for debugging failed tests
5. Configure baseURL in playwright.config.ts for your application

## Browser Support
Tests run on:
- Chromium
- Firefox
- WebKit

## Debugging
- View HTML reports: `npx playwright show-report`
- Debug single test: `npx playwright test tests/example.spec.ts --debug`
- Run in headed mode to see browser: `npm run test:headed`

## Configuration Notes
- Base URL is set to `http://localhost:3000` (update as needed)
- HTML reporter generates in `playwright-report/`
- Test results stored in `test-results/`
- Traces are collected on first retry for failed tests