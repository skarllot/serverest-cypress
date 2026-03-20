Cypress.Commands.add('criarCarrinho', (produtos) => {
  return cy.task('get', ['authToken']).then(({ authToken }) => {
    return cy.request({
      method: 'POST',
      url: '/carrinhos',
      headers: { Authorization: authToken },
      body: { produtos },
      failOnStatusCode: false,
    })
  })
})

Cypress.Commands.add('concluirCompra', () => {
  return cy.task('get', ['authToken']).then(({ authToken }) => {
    return cy.request({
      method: 'DELETE',
      url: '/carrinhos/concluir-compra',
      headers: { Authorization: authToken },
      failOnStatusCode: false,
    })
  })
})

Cypress.Commands.add('cancelarCompra', () => {
  return cy.task('get', ['authToken']).then(({ authToken }) => {
    return cy.request({
      method: 'DELETE',
      url: '/carrinhos/cancelar-compra',
      headers: { Authorization: authToken },
      failOnStatusCode: false,
    })
  })
})
