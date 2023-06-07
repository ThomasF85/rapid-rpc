describe("static test 1", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("serverapi works", () => {
    cy.get('[data-cy="nav-static2"]').click();
    cy.get('[data-cy="static-double"]').should("have.text", "Double: 24");
    cy.get('[data-cy="static-greeting1"]').should(
      "have.text",
      "Hi Max, you are 36 years old and you are hungry"
    );
    cy.get('[data-cy="static-greeting2"]').should(
      "have.text",
      "Hi Mario, you are 39 years old and you are not hungry"
    );
  });
});
