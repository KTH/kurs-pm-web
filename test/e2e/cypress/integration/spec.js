it('About course memo page should have a header', () => {
  cy.visit('/')
  cy.get('h1').should('contain', 'Kurs-PM')
})
