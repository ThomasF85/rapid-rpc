describe("client test 1", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("calls context only once per batch with combined api", () => {
    cy.get('[data-cy="nav-client8"]').click();
    cy.get('[data-cy="client-entry-XYZ"]').should("have.text", "XYZ : false");
    cy.get('[data-cy="double"]').should("have.text", "Double: 24");
    cy.get('[data-cy="value"]').should("have.text", "Value: 42XYZ");
    cy.get('[data-cy="client-entry-XYZ"]').should("have.text", "XYZ : false");
    cy.get('[data-cy="client-entry-X1"]').should("have.text", "X1 : false");
    cy.get('[data-cy="client-entry-X2"]').should("have.text", "X2 : true");
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
    cy.get('[data-cy="entry1"]').should("have.text", "XYZ : false");
    cy.get('[data-cy="entry2"]').should("have.text", "X1 : false");
    cy.get('[data-cy="mutation"]').click();
    cy.get('[data-cy="entry2"]').should("have.text", "X1 : false");
    cy.get('[data-cy="client-entry-XYZX3"]').should(
      "have.text",
      "XYZX3 : false"
    );
    cy.get('[data-cy="client-entry-options-XYZX3"]').should(
      "have.text",
      "XYZX3 : false"
    );
  });

  it("calls context on every call without batching with combined api", () => {
    cy.get('[data-cy="nav-client8-no-batching"]').click();
    cy.get('[data-cy="client-entry-XYZ"]').should("have.text", "XYZ : false");
    cy.get('[data-cy="double"]').should("have.text", "Double: 24");
    cy.get('[data-cy="value"]').should("have.text", "Value: 42XYZ");
    cy.get('[data-cy="client-entry-XYZ"]').should("have.text", "XYZ : false");
    cy.get('[data-cy="client-entry-X1"]').should("have.text", "X1 : false");
    cy.get('[data-cy="client-entry-X2"]').should("have.text", "X2 : true");
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
    cy.get('[data-cy="entry1"]').should("have.text", "XYZ : false");
    cy.get('[data-cy="entry2"]').should("have.text", "X1 : false");

    cy.get('[data-cy="mutation"]').click();
    cy.get('[data-cy="entry2"]').should("have.text", "X1 : false");
    cy.get('[data-cy="client-entry-XYZX3"]').should(
      "have.text",
      "XYZX3 : false"
    );
    cy.get('[data-cy="client-entry-options-XYZX3"]').should(
      "have.text",
      "XYZX3 : false"
    );
  });
});
