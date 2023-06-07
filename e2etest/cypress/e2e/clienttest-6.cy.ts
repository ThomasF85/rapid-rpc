describe("client test 1", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("calls context only once per batch", () => {
    cy.get('[data-cy="nav-client6"]').click();
    cy.get('[data-cy="client-entry-XYZ"]').should("have.text", "XYZ : false");
    cy.get('[data-cy="reset"]').click();
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
    cy.get('[data-cy="callcount"]').should(
      "have.text",
      "context: 1, middleware: 5"
    );

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
    cy.get('[data-cy="callcount"]').should(
      "have.text",
      "context: 3, middleware: 11"
    );
  });

  it("calls context on every call without batching", () => {
    cy.get('[data-cy="nav-client6-no-batching"]').click();
    cy.get('[data-cy="client-entry-XYZ"]').should("have.text", "XYZ : false");
    cy.get('[data-cy="reset"]').click();
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
    cy.get('[data-cy="callcount"]').should(
      "have.text",
      "context: 4, middleware: 4"
    );

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
    cy.get('[data-cy="callcount"]').should(
      "have.text",
      "context: 10, middleware: 10"
    );
  });
});
