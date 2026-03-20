const { frontUrl } = Cypress.expose()

describe('Front-end: cadastrar usuário', () => {
  let adminUser
  let adminUserId
  let novoUsuario

  before(() => {
    const ts = Date.now()

    adminUser = {
      nome: `Admin Front ${ts}`,
      email: `admin.front.${ts}@qa.com`,
      password: 'teste',
      administrador: 'true',
    }

    novoUsuario = {
      nome: `Novo Front ${ts}`,
      email: `novo.front.${ts}@qa.com`,
      password: 'senha123',
      administrador: 'true',
    }

    cy.criarUsuario(adminUser).then((response) => {
      expect(response.status).to.eq(201)
      adminUserId = response.body._id
    })
  })

  after(() => {
    cy.listarUsuarios().then((response) => {
      const user = response.body.usuarios.find((u) => u.email === novoUsuario.email)
      if (user) {
        cy.deletarUsuario(user._id)
      }
    })
    if (adminUserId) {
      cy.deletarUsuario(adminUserId)
    }
  })

  function loginAdmin() {
    cy.session(
      adminUser.email,
      () => {
        cy.visit(`${frontUrl}/login`)
        cy.get('[data-testid=email]').type(adminUser.email)
        cy.get('[data-testid=senha]').type(adminUser.password)
        cy.get('[data-testid=entrar]').click()
        cy.url().should('eq', `${frontUrl}/admin/home`)
      },
    )
  }

  context('when the admin logs in and registers a new user', () => {
    it('should complete the registration flow and redirect to the users list', () => {
      loginAdmin()

      cy.visit(`${frontUrl}/admin/home`)
      cy.get('[data-testid=cadastrarUsuarios]').click()
      cy.url().should('eq', `${frontUrl}/admin/cadastrarusuarios`)

      cy.get('[data-testid=nome]').type(novoUsuario.nome)
      cy.get('[data-testid=email]').type(novoUsuario.email)
      cy.get('[data-testid=password]').type(novoUsuario.password)
      cy.get('[data-testid=checkbox]').check()
      cy.get('[data-testid=cadastrarUsuario]').click()

      cy.url().should('eq', `${frontUrl}/admin/listarusuarios`)
    })

    it('should show the new user with all columns in the users table', () => {
      loginAdmin()

      cy.visit(`${frontUrl}/admin/listarusuarios`)

      cy.get('#root table tbody tr')
        .contains('td', novoUsuario.nome)
        .parent()
        .within(() => {
          cy.get('td').eq(0).should('have.text', novoUsuario.nome)
          cy.get('td').eq(1).should('have.text', novoUsuario.email)
          cy.get('td').eq(2).should('have.text', novoUsuario.password)
          cy.get('td').eq(3).should('have.text', 'true')
        })

    })
  })
})
