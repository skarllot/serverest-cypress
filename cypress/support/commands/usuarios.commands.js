Cypress.Commands.add('listarUsuarios', () => {
  return cy.request({
    method: 'GET',
    url: '/usuarios',
    failOnStatusCode: false,
  })
})

Cypress.Commands.add('criarUsuario', (usuario) => {
  return cy.request({
    method: 'POST',
    url: '/usuarios',
    body: usuario,
    failOnStatusCode: false,
  })
})

Cypress.Commands.add('buscarUsuario', (id) => {
  return cy.request({
    method: 'GET',
    url: `/usuarios/${id}`,
    failOnStatusCode: false,
  })
})

Cypress.Commands.add('editarUsuario', (id, usuario) => {
  return cy.request({
    method: 'PUT',
    url: `/usuarios/${id}`,
    body: usuario,
    failOnStatusCode: false,
  })
})

Cypress.Commands.add('deletarUsuario', (id) => {
  return cy.request({
    method: 'DELETE',
    url: `/usuarios/${id}`,
    failOnStatusCode: false,
  })
})
