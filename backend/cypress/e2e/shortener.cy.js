describe('URL Shortener Feature', () => {
  beforeEach(() => {
    
    cy.visit('http://localhost:5173/login');
    cy.get('input[name="email"]').type('sup@gmail.com');
    cy.get('input[name="password"]').type('1234567');
    cy.get('button[type="submit"]').contains('Login').click();
    cy.url().should('include', '/dashboard');
  });

  it('should successfully shorten a URL and redirect to it', () => {
    const longUrl = 'https://www.example.com';
    
    
    cy.get('a').contains('Shorten URL').click();
    cy.url().should('include', '/shorten');

    
    cy.get('input[type="url"]').type(longUrl);
    cy.get('button[type="submit"]').contains('Shorten URL').click();
    
    
    cy.get('a').should('have.attr', 'href').and('match', /http:\/\/localhost:3000\/.{8}/);
    
    
    cy.get('a').invoke('attr', 'href').then(shortUrl => {
      cy.request(shortUrl).then(response => {
    
        expect(response.status).to.eq(200);
    
        expect(response.redirects[0]).to.eq(longUrl);
      });
    });
  });
});
