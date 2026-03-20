describe('POST /login', () => {
  let usuarios

  before(() => {
    cy.fixture('usuarios').then((data) => {
      usuarios = data
    })
  })

  context('when credentials are valid', () => {
    it('should return status 200 and an authorization token', () => {
      cy.loginServeRest(usuarios.fulano.email, usuarios.fulano.password).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('authorization')
        expect(response.body.authorization).to.match(/^Bearer\s.+/)
      })
    })

    it('should store the token for later use', () => {
      cy.loginServeRest(usuarios.fulano.email, usuarios.fulano.password)
      cy.task('get', ['authToken']).then(({ authToken }) => {
        expect(authToken).to.match(/^Bearer\s.+/)
      })
    })
  })

  context('when credentials are invalid', () => {
    it('should return status 401 with an error message', () => {
      cy.request({
        method: 'POST',
        url: '/login',
        body: { email: usuarios.credenciaisInvalidas.email, password: usuarios.credenciaisInvalidas.password },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401)
        expect(response.body).to.have.property('message')
      })
    })
  })

  context('when required fields are missing', () => {
    it('should return status 400 when password is missing', () => {
      cy.request({
        method: 'POST',
        url: '/login',
        body: { email: usuarios.credenciaisIncompletas.email },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body).to.have.property('password')
      })
    })

    it('should return status 400 when email is missing', () => {
      cy.request({
        method: 'POST',
        url: '/login',
        body: { password: 'qualquer' },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body).to.have.property('email')
      })
    })
  })
})
