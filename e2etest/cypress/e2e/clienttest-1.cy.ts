describe("serverapi test", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("statically generated elements are present", () => {
    cy.get('[data-cy="nav-client1"]').click();
    cy.get('[data-cy="client1-entry-E1"]').should("have.text", "E1 : false");
    cy.get('[data-cy="client1-entry-E2"]').should("have.text", "E2 : true");
  });
});
