const { defineConfig } = require('cypress')

const store = {}

module.exports = defineConfig({
  allowCypressEnv: false,
  requestTimeout: 10000,
  responseTimeout: 30000,
  retries: { runMode: 2, openMode: 0 },
  video: false,
  screenshotOnRunFailure: true,
  e2e: {
    baseUrl: 'https://serverest.dev',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    setupNodeEvents(on) {
      on('task', {
        set(values) {
          Object.assign(store, values)
          return null
        },
        get(keys) {
          return Object.fromEntries(keys.map((k) => [k, store[k]]))
        },
      })
    },
  },
})
