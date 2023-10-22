import Register from './Register.vue';

describe('<Register />', () => {
  beforeEach(() => {
    cy.mount(Register);
  });

  it('should render all input fields and the Register button', () => {
    cy.get('input[placeholder="Name"]').should('be.visible');
    cy.get('input[placeholder="Email"]').should('be.visible');
    cy.get('input[placeholder="Password (minimum 3 characters)"]').should('be.visible');
    cy.get('button.submit-btn').should('be.visible');
  });

  it('should highlight password in red if its length is less than 3 characters', () => {
    cy.get('input[placeholder="Password (minimum 3 characters)"]').type('12').should('have.class', 'red');
  });

  it('should move the register button upon hovering with a short password', () => {
    cy.get('input[placeholder="Password (minimum 3 characters)"]').type('12');
    cy.get('button.submit-btn').trigger('mouseover').should('have.class', 'move-right'); 
  });
});
