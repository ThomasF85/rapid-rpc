describe("static test 1", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("serverapi works with combined api", () => {
    cy.get('[data-cy="nav-static8"]').click();
    cy.get('[data-cy="static-double"]').should("have.text", "Double: 24");
    cy.get('[data-cy="static-triple"]').should("have.text", "Triple: 36");
    cy.get('[data-cy="static-count"]').should("have.text", "Count: 0");
    cy.get('[data-cy="static-entry"]').should("have.text", "XYZ : false");
    cy.get('[data-cy="static-value"]').should("have.text", "Value: 42XYZ");
  });
});