describe('Notes Feature', () => {
  beforeEach(() => {
    // Log in the user before each test to ensure a clean session
    cy.visit('http://localhost:5173/login');
    cy.get('input[name="email"]').type('sup@gmail.com');
    cy.get('input[name="password"]').type('1234567');
    cy.get('button[type="submit"]').contains('Login').click();
    cy.url().should('include', '/dashboard');
  });

  it('should create a new note with Markdown and display it correctly', () => {
    // 1. Navigate to the notes page
    cy.get('a').contains('Notes').click();
    cy.url().should('include', '/notes');

    // 2. Fill out the form with a new note
    const noteTitle = 'My E2E Test Note';
    const noteContent = '# Test Heading\nThis is a **bold** and *italic* note.';

    cy.get('input[placeholder="Note Title"]').type(noteTitle);
    cy.get('textarea[placeholder="Write your note in Markdown..."]').type(noteContent);
    cy.get('button[type="submit"]').contains('Save Note').click();

    // 3. Verify the note is displayed in the list
    cy.contains(noteTitle).should('be.visible');

    // 4. Verify the Markdown is rendered as HTML
    cy.get('.prose').within(() => {
      cy.get('h1').should('have.text', 'Test Heading');
      cy.get('strong').should('have.text', 'bold text');
      cy.get('em').should('have.text', 'italic');
    });

    // 5. Clean up: delete the created note
    cy.contains(noteTitle)
      .parents('[class*="bg-white"]')
      .find('svg[data-lucide="trash-2"]')
      .click();
  });
});
