describe("client test 1", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("mutation without arguments works with context", () => {
    cy.get('[data-cy="nav-client4"]').click();
    cy.get('[data-cy="mutation1"]').click();
    cy.get('[data-cy="client-entry-XYZ"]').should("have.text", "XYZ : false");
    cy.get('[data-cy="client-entry-X1"]').should("have.text", "X1 : false");
    cy.get('[data-cy="client-entry-X2"]').should("have.text", "X2 : true");
    cy.get('[data-cy="client-entry-XYZX3"]').should(
      "have.text",
      "XYZX3 : false"
    );
    cy.get('[data-cy="client-entry-options-XYZ"]').should(
      "have.text",
      "XYZ : false"
    );
    cy.get('[data-cy="client-entry-options-X1"]').should(
      "have.text",
      "X1 : false"
    );
    cy.get('[data-cy="client-entry-options-X2"]').should(
      "have.text",
      "X2 : true"
    );
    cy.get('[data-cy="client-entry-options-XYZX3"]').should(
      "have.text",
      "XYZX3 : false"
    );
  });

  it("mutation with one arguments works with context", () => {
    cy.get('[data-cy="nav-client4"]').click();
    cy.get('[data-cy="mutation2"]').click();
    cy.get('[data-cy="client-entry-XYZ"]').should("have.text", "XYZ : false");
    cy.get('[data-cy="client-entry-X1"]').should("have.text", "X1 : false");
    cy.get('[data-cy="client-entry-X2"]').should("have.text", "X2 : true");
    cy.get('[data-cy="client-entry-XYZmario"]').should(
      "have.text",
      "XYZmario : false"
    );
    cy.get('[data-cy="client-entry-options-XYZ"]').should(
      "have.text",
      "XYZ : false"
    );
    cy.get('[data-cy="client-entry-options-X1"]').should(
      "have.text",
      "X1 : false"
    );
    cy.get('[data-cy="client-entry-options-X2"]').should(
      "have.text",
      "X2 : true"
    );
    cy.get('[data-cy="client-entry-options-XYZmario"]').should(
      "have.text",
      "XYZmario : false"
    );
  });

  it("mutation with two arguments works with context", () => {
    cy.get('[data-cy="nav-client4"]').click();
    cy.get('[data-cy="mutation3"]').click();
    cy.get('[data-cy="client-entry-XYZ"]').should("have.text", "XYZ : false");
    cy.get('[data-cy="client-entry-X1"]').should("have.text", "X1 : false");
    cy.get('[data-cy="client-entry-X2"]').should("have.text", "X2 : true");
    cy.get('[data-cy="client-entry-XYZluigi"]').should(
      "have.text",
      "XYZluigi : true"
    );
    cy.get('[data-cy="client-entry-options-XYZ"]').should(
      "have.text",
      "XYZ : false"
    );
    cy.get('[data-cy="client-entry-options-X1"]').should(
      "have.text",
      "X1 : false"
    );
    cy.get('[data-cy="client-entry-options-X2"]').should(
      "have.text",
      "X2 : true"
    );
    cy.get('[data-cy="client-entry-options-XYZluigi"]').should(
      "have.text",
      "XYZluigi : true"
    );
  });

  it("mutation with object argument works with context", () => {
    cy.get('[data-cy="nav-client4"]').click();
    cy.get('[data-cy="mutation4"]').click();
    cy.get('[data-cy="client-entry-XYZ"]').should("have.text", "XYZ : false");
    cy.get('[data-cy="client-entry-X1"]').should("have.text", "X1 : false");
    cy.get('[data-cy="client-entry-X2"]').should("have.text", "X2 : true");
    cy.get('[data-cy="client-entry-XYZmax"]').should(
      "have.text",
      "XYZmax : true"
    );
    cy.get('[data-cy="client-entry-options-XYZ"]').should(
      "have.text",
      "XYZ : false"
    );
    cy.get('[data-cy="client-entry-options-X1"]').should(
      "have.text",
      "X1 : false"
    );
    cy.get('[data-cy="client-entry-options-X2"]').should(
      "have.text",
      "X2 : true"
    );
    cy.get('[data-cy="client-entry-options-XYZmax"]').should(
      "have.text",
      "XYZmax : true"
    );
  });
});
