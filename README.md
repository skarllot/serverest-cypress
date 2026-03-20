# serverest-cypress

Cypress E2E test suite for the [ServeRest REST API](https://serverest.dev/) using `cy.request()`.

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
npx cypress run --spec 'cypress/e2e/login/login.cy.js'
```

## Project Structure

```
cypress/
├── e2e/          # Test specs
├── fixtures/     # Test data
└── support/
    └── commands/ # Custom cy.* commands
```

## Custom Commands

| Command | Description |
|---|---|
| `cy.loginServeRest(email, password)` | POST /login and store the Bearer token via `cy.task` for later use |

## Notes

- Commands use `failOnStatusCode: false` — assertions are made inside `.then()`.
