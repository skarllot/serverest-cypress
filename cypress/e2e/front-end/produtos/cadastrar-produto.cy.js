const { frontUrl } = Cypress.expose()

describe('Front-end: cadastrar produto', () => {
  let adminUser
  let adminUserId
  let novoProduto

  before(() => {
    const ts = Date.now()

    adminUser = {
      nome: `Admin Produto ${ts}`,
      email: `admin.produto.${ts}@qa.com`,
      password: 'teste',
      administrador: 'true',
    }

    novoProduto = {
      nome: `Produto Front ${ts}`,
      preco: 99,
      descricao: `Descrição do produto ${ts}`,
      quantidade: 10,
    }

    cy.criarUsuario(adminUser).then((response) => {
      expect(response.status).to.eq(201)
      adminUserId = response.body._id
    })
  })

  after(() => {
    cy.loginServeRest(adminUser.email, adminUser.password).then(() => {
      cy.listarProdutos().then((response) => {
        const produto = response.body.produtos.find((p) => p.nome === novoProduto.nome)
        if (produto) {
          cy.deletarProduto(produto._id)
        }
      })
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

  context('when the admin navigates to the register product page', () => {
    it('should reach the register product form via the home button', () => {
      loginAdmin()

      cy.visit(`${frontUrl}/admin/home`)
      cy.get('[data-testid=cadastrarProdutos]').click()
      cy.url().should('eq', `${frontUrl}/admin/cadastrarprodutos`)
    })
  })

  context('when the admin fills in and submits the product form', () => {
    it('should redirect to the products list after registration', () => {
      loginAdmin()

      cy.visit(`${frontUrl}/admin/cadastrarprodutos`)

      cy.get('[data-testid=nome]').type(novoProduto.nome)
      cy.get('[data-testid=preco]').type(novoProduto.preco)
      cy.get('[data-testid=descricao]').type(novoProduto.descricao)
      cy.get('[data-testid=quantity]').type(novoProduto.quantidade)
      cy.get('[data-testid=cadastarProdutos]').click()

      cy.url().should('eq', `${frontUrl}/admin/listarprodutos`)
    })

    it('should show the new product in the products table', () => {
      loginAdmin()

      cy.visit(`${frontUrl}/admin/listarprodutos`)

      cy.get('#root table tbody tr')
        .contains('td', novoProduto.nome)
        .parent()
        .within(() => {
          cy.get('td').eq(0).should('have.text', novoProduto.nome)
          cy.get('td').eq(1).should('have.text', String(novoProduto.preco))
          cy.get('td').eq(2).should('have.text', novoProduto.descricao)
          cy.get('td').eq(3).should('have.text', String(novoProduto.quantidade))
        })
    })
  })

  context('when the admin submits the form with a mandatory field empty', () => {
    beforeEach(() => {
      loginAdmin()
      cy.visit(`${frontUrl}/admin/cadastrarprodutos`)
    })

    const mandatoryFields = [
      {
        field: 'nome',
        fill: (p) => {
          cy.get('[data-testid=preco]').type(p.preco)
          cy.get('[data-testid=descricao]').type(p.descricao)
          cy.get('[data-testid=quantity]').type(p.quantidade)
        },
        error: 'Nome é obrigatório',
      },
      {
        field: 'preco',
        fill: (p) => {
          cy.get('[data-testid=nome]').type(p.nome)
          cy.get('[data-testid=descricao]').type(p.descricao)
          cy.get('[data-testid=quantity]').type(p.quantidade)
        },
        error: 'Preco é obrigatório',
      },
      {
        field: 'descricao',
        fill: (p) => {
          cy.get('[data-testid=nome]').type(p.nome)
          cy.get('[data-testid=preco]').type(p.preco)
          cy.get('[data-testid=quantity]').type(p.quantidade)
        },
        error: 'Descricao é obrigatório',
      },
      {
        field: 'quantidade',
        fill: (p) => {
          cy.get('[data-testid=nome]').type(p.nome)
          cy.get('[data-testid=preco]').type(p.preco)
          cy.get('[data-testid=descricao]').type(p.descricao)
        },
        error: 'Quantidade é obrigatório',
      },
    ]

    mandatoryFields.forEach(({ field, fill, error }) => {
      it(`should show a validation error when ${field} is empty`, () => {
        fill(novoProduto)
        cy.get('[data-testid=cadastarProdutos]').click()

        cy.get('div[role=alert] span').should('contain.text', error)
        cy.url().should('eq', `${frontUrl}/admin/cadastrarprodutos`)
      })
    })
  })
})
