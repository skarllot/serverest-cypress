describe('DELETE /carrinhos/concluir-compra', () => {
  const ts = Date.now()
  let usuarioId
  let produtoId

  before(() => {
    const adminUser = {
      nome: 'Admin Carrinho',
      email: `admin.carrinho.${ts}@qa.com`,
      password: 'teste123',
      administrador: 'true',
    }

    cy.criarUsuario(adminUser)
      .then((response) => {
        usuarioId = response.body._id
        return cy.loginServeRest(adminUser.email, adminUser.password)
      })
      .then(() => {
        return cy.criarProduto({
          nome: `Produto Carrinho ${ts}`,
          preco: 100,
          descricao: 'Produto para teste de carrinho',
          quantidade: 10,
        })
      })
      .then((response) => {
        produtoId = response.body._id
        return cy.criarCarrinho([{ idProduto: produtoId, quantidade: 1 }])
      })
  })

  after(() => {
    if (produtoId) {
      cy.deletarProduto(produtoId)
    }
    if (usuarioId) {
      cy.deletarUsuario(usuarioId)
    }
  })

  context('when concluding a purchase', () => {
    it('should return status 200 and success message', () => {
      cy.concluirCompra().then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('message', 'Registro excluído com sucesso')
      })
    })

    it('should report no cart found when concluding again', () => {
      cy.concluirCompra().then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property(
          'message',
          'Não foi encontrado carrinho para esse usuário'
        )
      })
    })
  })
})
