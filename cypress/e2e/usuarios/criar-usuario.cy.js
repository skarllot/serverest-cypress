describe('POST /usuarios', () => {
  let novoUsuario
  let usuarioCriadoId

  before(() => {
    novoUsuario = {
      nome: 'Usuário Teste',
      email: `teste.${Date.now()}@qa.com`,
      password: 'teste123',
      administrador: 'false',
    }
  })

  after(() => {
    if (usuarioCriadoId) {
      cy.deletarUsuario(usuarioCriadoId)
    }
  })

  context('when adding a new user', () => {
    it('should list users before adding the new one', () => {
      cy.listarUsuarios().then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('quantidade')
        expect(response.body.usuarios).to.be.an('array')

        const emails = response.body.usuarios.map((u) => u.email)
        expect(emails).not.to.include(novoUsuario.email)
      })
    })

    it('should create the user and return status 201', () => {
      cy.criarUsuario(novoUsuario).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso')
        expect(response.body).to.have.property('_id')

        usuarioCriadoId = response.body._id
      })
    })

    it('should list users after adding and include the new user', () => {
      cy.listarUsuarios().then((response) => {
        expect(response.status).to.eq(200)

        const emails = response.body.usuarios.map((u) => u.email)
        expect(emails).to.include(novoUsuario.email)
      })
    })
  })
})
