import UniversityForm from './UniversityForm.vue';

describe('<UniversityForm />', () => {
  beforeEach(() => {
    cy.mount(UniversityForm);
  });

  it('should render all input fields and the Add University button', () => {
    cy.get('input[id="names"]').should('be.visible');
    cy.get('input[id="location"]').should('be.visible');
    cy.get('button.form-button').should('be.visible').and('contain', 'Add University');
  });

  it('should display suggestions for University Name after typing 3 characters', () => {
    cy.get('input[id="names"]').type('Univer');
    cy.get('ul.suggestions').should('be.visible');
    cy.get('li').should('have.length.greaterThan', 1);
  });

  it('should select a suggestion for University Name upon clicking it', () => {
    cy.get('input[id="names"]').type('Univer');
    cy.get('ul.suggestions').first().find('li').first().click();
    cy.get('input[id="names"]').should('have.value', 'Univerza v Ljubljani'); 
  });

  it('should display suggestions for Location after typing 3 characters', () => {
    cy.get('input[id="location"]').type('Mari');
    cy.get('ul.suggestions').should('be.visible');
    cy.get('li').should('have.length.greaterThan', 1);
  });

  it('should select a suggestion for Location upon clicking it', () => {
    cy.get('input[id="location"]').type('Mari');
    cy.get('ul.suggestions').first().find('li').first().click();
    cy.get('input[id="location"]').should('have.value', 'Maribor, Slovenia'); 
  });

  
});
