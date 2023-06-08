describe("client test 1", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("calls context only once per batch with combined api", () => {
    cy.get('[data-cy="nav-client7"]').click();
    cy.get('[data-cy="client-entry-XYZ"]').should("have.text", "XYZ : false");
    cy.get('[data-cy="setCount"]').click();
    cy.get('[data-cy="reset"]').click();
    cy.get('[data-cy="double"]').should("have.text", "Double: 24");
    cy.get('[data-cy="triple"]').should("have.text", "Triple: 36");
    cy.get('[data-cy="count"]').should("have.text", "Count: 1337");
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
    cy.get('[data-cy="client-entry-XYZX4"]').should(
      "have.text",
      "XYZX4 : false"
    );
    cy.get('[data-cy="client-entry-XYZX5"]').should(
      "have.text",
      "XYZX5 : false"
    );
    cy.get('[data-cy="client-entry-options-XYZX3"]').should(
      "have.text",
      "XYZX3 : false"
    );
    cy.get('[data-cy="client-entry-options-XYZX4"]').should(
      "have.text",
      "XYZX4 : false"
    );
    cy.get('[data-cy="client-entry-options-XYZX5"]').should(
      "have.text",
      "XYZX5 : false"
    );
    cy.get('[data-cy="callcount"]').should(
      "have.text",
      "context: 3, middleware: 13"
    );
  });

  it("calls context on every call without batching with combined api", () => {
    cy.get('[data-cy="nav-client7-no-batching"]').click();
    cy.get('[data-cy="client-entry-XYZ"]').should("have.text", "XYZ : false");
    cy.get('[data-cy="setCount"]').click();
    cy.get('[data-cy="reset"]').click();
    cy.get('[data-cy="double"]').should("have.text", "Double: 24");
    cy.get('[data-cy="triple"]').should("have.text", "Triple: 36");
    cy.get('[data-cy="count"]').should("have.text", "Count: 1337");
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
    cy.get('[data-cy="callcount"]')
      .invoke("text")
      .then((text) => {
        if (text.startsWith("context: 11")) {
          expect(text).to.eq("context: 11, middleware: 11");
        } else {
          expect(text).to.eq("context: 10, middleware: 10");
        }
      });

    cy.get('[data-cy="mutation"]').click();
    cy.get('[data-cy="entry2"]').should("have.text", "X1 : false");
    cy.get('[data-cy="client-entry-XYZX3"]').should(
      "have.text",
      "XYZX3 : false"
    );
    cy.get('[data-cy="client-entry-XYZX4"]').should(
      "have.text",
      "XYZX4 : false"
    );
    cy.get('[data-cy="client-entry-XYZX5"]').should(
      "have.text",
      "XYZX5 : false"
    );
    cy.get('[data-cy="client-entry-options-XYZX3"]').should(
      "have.text",
      "XYZX3 : false"
    );
    cy.get('[data-cy="client-entry-options-XYZX4"]').should(
      "have.text",
      "XYZX4 : false"
    );
    cy.get('[data-cy="client-entry-options-XYZX5"]').should(
      "have.text",
      "XYZX5 : false"
    );
    cy.get('[data-cy="callcount"]')
      .invoke("text")
      .then((text) => {
        if (text.startsWith("context: 11")) {
          expect(text).to.eq("context: 11, middleware: 11");
        } else if (text.startsWith("context: 10")) {
          expect(text).to.eq("context: 10, middleware: 10");
        } else {
          expect(text).to.eq("context: 17, middleware: 17");
        }
      });
  });
});
