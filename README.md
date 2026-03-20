# serverest-cypress

Cypress E2E test suite for the [ServeRest REST API](https://serverest.dev/) and its [front-end](https://front.serverest.dev/).

## Requirements

- Node.js 18+
- npm

## Setup

```bash
npm install
```

## Running Tests

```bash
# Headless
npm test

# Interactive Test Runner
npm run cy:open

# Single spec
npx cypress run --spec 'cypress/e2e/back-end/login/login.cy.js'
```

## Project Structure

```
cypress/
├── e2e/
│   ├── back-end/   # API specs (cy.request only)
│   └── front-end/  # UI specs
├── fixtures/       # Test data
└── support/
    └── commands/   # Custom cy.* commands
```
