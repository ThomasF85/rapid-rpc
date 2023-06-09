describe("client test 1", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("errors with batching are handled correctly", () => {
    cy.get('[data-cy="nav-client11"]').click();
    cy.get('[data-cy="client-double"]').should("have.text", "Double: 24");
    cy.get('[data-cy="client-triple"]').should("have.text", "error");
    cy.get('[data-cy="client-nothing"]').should("have.text", "error");
    cy.get('[data-cy="client-greeting"]').should(
      "have.text",
      "Greeting: Hi Max, you are 33 years old and you are hungry"
    );
    cy.get('[data-cy="client-double2"]').should("have.text", "Double: 66");
    cy.get('[data-cy="client-triple2"]').should("have.text", "error");
    cy.get('[data-cy="client-greeting2"]').should(
      "have.text",
      "Greeting: Hi Max, you are 75 years old and you are hungry"
    );
  });

  it("errors without batching are handled correctly", () => {
    cy.get('[data-cy="nav-client11-no-batching"]').click();
    cy.get('[data-cy="client-double"]').should("have.text", "Double: 24");
    cy.get('[data-cy="client-triple"]').should("have.text", "error");
    cy.get('[data-cy="client-nothing"]').should("have.text", "error");
    cy.get('[data-cy="client-greeting"]').should(
      "have.text",
      "Greeting: Hi Max, you are 33 years old and you are hungry"
    );
    cy.get('[data-cy="client-double2"]').should("have.text", "Double: 66");
    cy.get('[data-cy="client-triple2"]').should("have.text", "error");
    cy.get('[data-cy="client-greeting2"]').should(
      "have.text",
      "Greeting: Hi Max, you are 75 years old and you are hungry"
    );
  });
});
