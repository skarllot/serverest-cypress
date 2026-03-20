Cypress.Commands.add('listarProdutos', () => {
  return cy.request({
    method: 'GET',
    url: '/produtos',
    failOnStatusCode: false,
  })
})

Cypress.Commands.add('criarProduto', (produto) => {
  return cy.task('get', ['authToken']).then(({ authToken }) => {
    return cy.request({
      method: 'POST',
      url: '/produtos',
      headers: { Authorization: authToken },
      body: produto,
      failOnStatusCode: false,
    })
  })
})

Cypress.Commands.add('deletarProduto', (id) => {
  return cy.task('get', ['authToken']).then(({ authToken }) => {
    return cy.request({
      method: 'DELETE',
      url: `/produtos/${id}`,
      headers: { Authorization: authToken },
      failOnStatusCode: false,
    })
  })
})
