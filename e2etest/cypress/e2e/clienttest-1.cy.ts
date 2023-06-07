describe("client test 1", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("useQuery works", () => {
    cy.get('[data-cy="nav-client1"]').click();
    cy.get('[data-cy="client1-entry-E1"]').should("have.text", "E1 : false");
    cy.get('[data-cy="client1-entry-E2"]').should("have.text", "E2 : true");
  });

  it("useQueryOptions works", () => {
    cy.get('[data-cy="nav-client1"]').click();
    cy.get('[data-cy="client1-entry-options-E1"]').should(
      "have.text",
      "E1 : false"
    );
    cy.get('[data-cy="client1-entry-options-E2"]').should(
      "have.text",
      "E2 : true"
    );
  });
});
