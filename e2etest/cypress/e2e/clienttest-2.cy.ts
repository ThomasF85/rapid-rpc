describe("client test 1", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("useQuery works", () => {
    cy.get('[data-cy="nav-client2"]').click();
    cy.get('[data-cy="client-double"]').should("have.text", "Double: 30");
    cy.get('[data-cy="client-greeting1"]').should(
      "have.text",
      "Hi Max, you are 33 years old and you are hungry"
    );
    cy.get('[data-cy="client-greeting2"]').should(
      "have.text",
      "Hi Mario, you are 36 years old and you are not hungry"
    );
  });

  it("useQueryOptions works", () => {
    cy.get('[data-cy="nav-client2"]').click();
    cy.get('[data-cy="client-options-double"]').should(
      "have.text",
      "Double: 48"
    );
    cy.get('[data-cy="client-options-greeting1"]').should(
      "have.text",
      "Hi Max, you are 36 years old and you are hungry"
    );
    cy.get('[data-cy="client-options-greeting2"]').should(
      "have.text",
      "Hi Mario, you are 39 years old and you are not hungry"
    );
  });
});
