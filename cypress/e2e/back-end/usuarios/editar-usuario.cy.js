describe('PUT /usuarios/:id', () => {
  let usuario
  let usuarioId

  before(() => {
    usuario = {
      nome: 'Usuário Edição',
      email: `edicao.${Date.now()}@qa.com`,
      password: 'teste123',
      administrador: 'false',
    }

    cy.criarUsuario(usuario).then((response) => {
      usuarioId = response.body._id
    })
  })

  after(() => {
    if (usuarioId) {
      cy.deletarUsuario(usuarioId)
    }
  })

  context('when editing an existing user', () => {
    it('should return status 200 and confirmation message', () => {
      cy.editarUsuario(usuarioId, { ...usuario, nome: 'Usuário Editado' }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('message', 'Registro alterado com sucesso')
      })
    })

    it('should reflect the updated name when fetching the user', () => {
      cy.buscarUsuario(usuarioId).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('nome', 'Usuário Editado')
      })
    })
  })
})
