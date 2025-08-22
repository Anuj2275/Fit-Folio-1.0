describe('URL Shortener Feature', () => {
  beforeEach(() => {
    // Log in the user before each test
    cy.visit('http://localhost:5173/login');
    cy.get('input[name="email"]').type('sup@gmail.com');
    cy.get('input[name="password"]').type('1234567');
    cy.get('button[type="submit"]').contains('Login').click();
    cy.url().should('include', '/dashboard');
  });

  it('should successfully shorten a URL and redirect to it', () => {
    const longUrl = 'https://www.example.com';
    
    // Navigate to the URL shortener page
    cy.get('a').contains('Shorten URL').click();
    cy.url().should('include', '/shorten');

    // Input the long URL and submit the form
    cy.get('input[type="url"]').type(longUrl);
    cy.get('button[type="submit"]').contains('Shorten URL').click();
    
    // Assert that the short URL is displayed
    cy.get('a').should('have.attr', 'href').and('match', /http:\/\/localhost:3000\/.{8}/);
    
    // Capture the short URL and test the redirect
    cy.get('a').invoke('attr', 'href').then(shortUrl => {
      cy.request(shortUrl).then(response => {
        // The redirect status should be 200 after following the redirect
        expect(response.status).to.eq(200);
        // The final URL should be the long URL we provided
        expect(response.redirects[0]).to.eq(longUrl);
      });
    });
  });
});
