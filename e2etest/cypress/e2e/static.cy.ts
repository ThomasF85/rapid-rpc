describe("template spec", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("statically generated elements are present", () => {
    cy.get('[data-cy="static-entry-E1"]').should("have.text", "E1 : false");
    cy.get('[data-cy="static-entry-E2"]').should("have.text", "E2 : true");
  });
});
