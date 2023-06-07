describe("static test 1", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("serverapi works", () => {
    cy.get('[data-cy="nav-static1"]').click();
    cy.get('[data-cy="static-entry-E1"]').should("have.text", "E1 : false");
    cy.get('[data-cy="static-entry-E2"]').should("have.text", "E2 : true");
  });
});
