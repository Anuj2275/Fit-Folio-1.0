describe('Authentication Flow', () => {
  it('should successfully log in a user and redirect to the dashboard', () => {
    
    cy.visit('http://localhost:5173/login');

    cy.get('input[name="email"]').type('sup@gmail.com');
    cy.get('input[name="password"]').type('1234567');

    cy.get('button[type="submit"]').contains('Login').click();

    cy.url().should('include', '/dashboard');
    
    cy.contains('Your Dashboard').should('be.visible');
  });
});
