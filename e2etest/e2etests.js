const cypress = require("cypress");

cypress.run({
  reporter: "junit",
  browser: "chrome",
});
