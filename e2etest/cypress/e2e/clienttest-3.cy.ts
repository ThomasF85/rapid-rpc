describe("client test 1", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("mutation without arguments works", () => {
    cy.get('[data-cy="nav-client3"]').click();
    cy.get('[data-cy="mutation1"]').click();
    cy.get('[data-cy="client-entry-X1"]').should("have.text", "X1 : false");
    cy.get('[data-cy="client-entry-X2"]').should("have.text", "X2 : true");
    cy.get('[data-cy="client-entry-X3"]').should("have.text", "X3 : false");
    cy.get('[data-cy="client-entry-options-X1"]').should(
      "have.text",
      "X1 : false"
    );
    cy.get('[data-cy="client-entry-options-X2"]').should(
      "have.text",
      "X2 : true"
    );
    cy.get('[data-cy="client-entry-options-X3"]').should(
      "have.text",
      "X3 : false"
    );
  });

  it("mutation with one arguments works", () => {
    cy.get('[data-cy="nav-client3"]').click();
    cy.get('[data-cy="mutation2"]').click();
    cy.get('[data-cy="client-entry-X1"]').should("have.text", "X1 : false");
    cy.get('[data-cy="client-entry-X2"]').should("have.text", "X2 : true");
    cy.get('[data-cy="client-entry-mario"]').should(
      "have.text",
      "mario : false"
    );
    cy.get('[data-cy="client-entry-options-X1"]').should(
      "have.text",
      "X1 : false"
    );
    cy.get('[data-cy="client-entry-options-X2"]').should(
      "have.text",
      "X2 : true"
    );
    cy.get('[data-cy="client-entry-options-mario"]').should(
      "have.text",
      "mario : false"
    );
  });

  it("mutation with two arguments works", () => {
    cy.get('[data-cy="nav-client3"]').click();
    cy.get('[data-cy="mutation3"]').click();
    cy.get('[data-cy="client-entry-X1"]').should("have.text", "X1 : false");
    cy.get('[data-cy="client-entry-X2"]').should("have.text", "X2 : true");
    cy.get('[data-cy="client-entry-luigi"]').should(
      "have.text",
      "luigi : true"
    );
    cy.get('[data-cy="client-entry-options-X1"]').should(
      "have.text",
      "X1 : false"
    );
    cy.get('[data-cy="client-entry-options-X2"]').should(
      "have.text",
      "X2 : true"
    );
    cy.get('[data-cy="client-entry-options-luigi"]').should(
      "have.text",
      "luigi : true"
    );
  });

  it("mutation with object argument works", () => {
    cy.get('[data-cy="nav-client3"]').click();
    cy.get('[data-cy="mutation4"]').click();
    cy.get('[data-cy="client-entry-X1"]').should("have.text", "X1 : false");
    cy.get('[data-cy="client-entry-X2"]').should("have.text", "X2 : true");
    cy.get('[data-cy="client-entry-max"]').should("have.text", "max : true");
    cy.get('[data-cy="client-entry-options-X1"]').should(
      "have.text",
      "X1 : false"
    );
    cy.get('[data-cy="client-entry-options-X2"]').should(
      "have.text",
      "X2 : true"
    );
    cy.get('[data-cy="client-entry-options-max"]').should(
      "have.text",
      "max : true"
    );
  });
});
