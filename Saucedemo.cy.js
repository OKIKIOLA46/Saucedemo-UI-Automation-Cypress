describe('SauceDemo Authentication and Checkout Flow', () => {

  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/');
  });

  // =========================
  // INVALID LOGIN SCENERIOS
  // =========================

  it('Verify that user cannot login with invalid username', () => {
    cy.get('#user-name').type('Okikiola');
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();

    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain.text', 'Username and password do not match any user');
  });

  it('Verify that user cannot login with invalid password', () => {
    cy.get('#user-name').type('standard_user');
    cy.get('#password').type('youverify');
    cy.get('#login-button').click();

    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain.text', 'Username and password do not match any user');
  });

  it('Verify that user cannot login with blank username', () => {
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();

    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain.text', 'Username is required');
  });

  it('Verify that user cannot login with blank password', () => {
    cy.get('#user-name').type('standard_user');
    cy.get('#login-button').click();

    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain.text', 'Password is required');
  });

  // =========================
  // VALID LOGIN
  // =========================

  it('Verify that user can login successfully', () => {
    cy.get('#user-name').type('standard_user');
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();

    cy.contains('Products').should('be.visible');
  });

  // =========================
  // CHECKOUT VALIDATION (NEGATIVE)
  // =========================

  describe('Checkout Information Field Validation', () => {

    beforeEach(() => {
      // Login
      cy.get('#user-name').type('standard_user');
      cy.get('#password').type('secret_sauce');
      cy.get('#login-button').click();

      // Add product and navigate to checkout info page
      cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      cy.get('.shopping_cart_link').click();
      cy.get('[data-test="checkout"]').click();

      cy.contains('Checkout: Your Information').should('be.visible');
    });

});
  // =========================
  // SUCCESSFUL CHECKOUT FLOW
  // =========================

  it('Verify that user can complete checkout successfully', () => {

    // Login
    cy.get('#user-name').type('standard_user');
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();

    cy.contains('Products').should('be.visible');

    // Add product to cart
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('.shopping_cart_badge').should('contain', '1');

    // Navigate to cart
    cy.get('.shopping_cart_link').click();
    cy.contains('Your Cart').should('be.visible');

    // Proceed to checkout
    cy.get('[data-test="checkout"]').click();
    cy.contains('Checkout: Your Information').should('be.visible');

    // Enter valid checkout info
    cy.get('[data-test="firstName"]').type('Okikiola');
    cy.get('[data-test="lastName"]').type('Youverify');
    cy.get('[data-test="postalCode"]').type('100001');
    cy.get('[data-test="continue"]').click();

    // Overview
    cy.contains('Checkout: Overview').should('be.visible');
    cy.contains('Sauce Labs Backpack').should('be.visible');
    cy.get('.inventory_item_price').should('contain', '$29.99');
    cy.get('.summary_total_label').should('contain', 'Total');

    // Finish checkout
    cy.get('[data-test="finish"]').click();

    // Confirmation
    cy.contains('Checkout: Complete!').should('be.visible');
    cy.contains('Thank you for your order').should('be.visible');
  });

});
