// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const _ = require('lodash');
const commands = ['chunk', 'map', 'flatMap', 'values', 'reduce'];

const results = require('../../result2.json');
const lookups = require('../../result.json');

_.each(commands, (fn) => {
    Cypress.Commands.add(fn, {prevSubject: true}, (...args) => {
        return _[fn](...args);
    })
});

Cypress.Commands.add('save', {prevSubject: true}, (args) => {
    results.push(args);
    return cy.writeFile('result2.json', JSON.stringify(results, null, 3));
});

Cypress.Commands.add('print', { prevSubject: true }, (msg) => {
    return console.log(msg);
});

Cypress.Commands.add('infiniteScroll', (initialLength, parentSelector) => {
    cy.get(parentSelector).children().last().scrollIntoView({ duration: 300 }).then(() => {
        cy.wait(3000);
        cy.get('.product-scroller .product-items').children().its('length').then(l => {
            console.log(l);
            if (l > initialLength) {
                cy.infiniteScroll(l, parentSelector);
            }
        })
    })
})

Cypress.Commands.add('forOwn', (...args) => {
    return _.forOwn(...args);
});

Cypress.Commands.add('getLookup', () => {
    return cy.wrap(lookups)
})