describe('Items CRUD Flow', () => {
  beforeEach(() => {
    // Log in the user before each test
    cy.visit('http://localhost:5173/login');
    cy.get('input[name="email"]').type('sup@gmail.com');
    cy.get('input[name="password"]').type('1234567');
    cy.get('button[type="submit"]').contains('Login').click();
    cy.url().should('include', '/dashboard');
  });

  it('should perform a full CRUD cycle on a new item', () => {
    const newItemTitle = 'Test Task E2E';
    const updatedItemTitle = 'Updated Test Task E2E';
    
    // --- CREATE ---
    cy.log('Creating a new task...');
    cy.get('button').contains('Create New Item').click();
    cy.url().should('include', '/create');

    cy.get('input[name="title"]').type(newItemTitle);
    cy.get('button[type="submit"]').contains('Create Item').click();
    cy.url().should('include', '/dashboard');
    cy.contains(newItemTitle).should('be.visible');

    // --- READ ---
    cy.log('Reading the new task on the dashboard...');
    cy.contains(newItemTitle).should('be.visible');
    
    // --- UPDATE ---
    cy.log('Updating the task...');
    cy.contains(newItemTitle)
      .parents('[class*="TaskCard"]')
      .find('svg[data-lucide="edit"]')
      .click();

    cy.url().should('include', '/edit');
    cy.get('input[name="title"]').clear().type(updatedItemTitle);
    cy.get('button[type="submit"]').contains('Save Changes').click();
    cy.url().should('include', '/dashboard');
    cy.contains(updatedItemTitle).should('be.visible');
    
    // Add a short delay here to ensure the UI has time to re-render after the update
    cy.wait(500);

    // --- DELETE ---
    cy.log('Deleting the task...');
    cy.contains(updatedItemTitle)
      .parents('[class*="TaskCard"]')
      .find('svg[data-lucide="trash-2"]')
      .click();

    // Confirm the deletion in the browser's native dialog
    cy.on('window:confirm', () => true);

    // Wait for the task to be removed from the DOM
    cy.contains(updatedItemTitle).should('not.exist');
  });
});
