it('detects angry sentiment', () => {
  cy.visit('/')
  cy.get('h1').should('contain', 'Om kurs-PM')
})
