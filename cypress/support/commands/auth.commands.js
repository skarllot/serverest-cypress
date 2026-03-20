Cypress.Commands.add('loginServeRest', (email, password) => {
  return cy.request({
    method: 'POST',
    url: '/login',
    body: { email, password },
    failOnStatusCode: false,
  }).then((response) => {
    if (response.status === 200 && response.body.authorization) {
      return cy.task('set', { authToken: response.body.authorization }).then(() => response)
    }
    return response
  })
})
