/// <reference types="Cypress" />

const _ = require('lodash')
const lookup = require('../../result.json');

describe('Mobiles', () => {
    // it('Loop through', () => {
    //     cy.visit('https://uae.sharafdg.com/c/mobiles_tablets/mobiles/');
    //     cy.get('.product-scroller .product-items').then((productContainer) => {
    //         const productLength = Cypress.$(productContainer.children()).length;
    //         cy.infiniteScroll(productLength, '.product-scroller .product-items');
    //     });
    // }),

    // it('Collect URLs', ()=> {
    //     cy.get('.product-scroller .product-items').children().its('length').then(r => (r)).print();
    //     cy.get('.product-scroller .product-items')
    //         .children()
    //         .map((product) => {
    //             const productNode = Cypress.$(product);
    //             const productInfo = productNode.find('.sdg-ratio a');
    //             return {
    //                     title: productInfo.attr('title'),
    //                     href: productInfo.attr('href')
    //                 }
    //         }).save();
    // });


        lookup.forEach(itm => {

            it('Fetch Details - ' + itm.href, () => {

            let url = "https:" + itm.href;
            cy.visit(url);
            debugger;
            cy.get('ul.prd-Specs').scrollIntoView({ duration: 1000 }).find('li.prd-Specs a').click({ animationDistanceThreshold: 20, force: true });
            cy.get('#prodcut-tab2 tbody')
                .children()
                .map((tableRows) => {
                    const tr = Cypress.$(tableRows);
                    const infoTr = tr.find('tbody tr').not(':eq(0)');
                    return _.map(infoTr, function (r) {
                        return {
                            [r.children[0].innerText.replace(/\s/g, "")]: r.children[1].innerText
                        }
                    });
                })
                .flatMap(x => x)
                .reduce((x, y) => ({ ...x, ...y }))
                .then(x => {
                    const prodSpecs = {};
                    let connectivity = "";
                    connectivity = x.WiFiType !== "No" ? "WiFi - Yes" : "WiFi - No"
                    connectivity = connectivity + ", " + (x["4GNetwork"] && x["4GNetwork"] !== "No" ? "4G - Yes" : "4G - " + x["4GNetwork"]);
                    prodSpecs.Connectivity = connectivity;
                    prodSpecs.ScreenSize = x.ScreenSize || "NA";
                    prodSpecs.Resolution = x.Resolution || "NA";
                    prodSpecs.InternalMemory = x.InternalMemory || "NA";
                    prodSpecs.RAM = x.RAM || "NA",
                    prodSpecs["Rear/FrontCamera"] = x["Rear/FrontCamera"] || "NA",
                    prodSpecs.BatteryCapacity = x.BatteryCapacity || "NA",
                    prodSpecs.Brand = x.Brand || "NA",
                    prodSpecs.Color = x.Color || "NA"
                    return prodSpecs;
                })
                .then(prodSpecs => {

                    return cy.get('.mainproduct-info').find('h1.product_title').should(($h1) => {
                        prodSpecs["Title"] = $h1.text()
                    }).then(() => (prodSpecs));

                }).then(prodSpecs => {

                    return cy.get('.mainproduct-info .prod-extra').contains('Model').siblings("span").should($span => {
                        prodSpecs["Model"] = $span.text()
                    }).then(() => (prodSpecs));

                }).then(prodSpecs => {

                    return cy.get('.mainproduct-info .prod-extra').contains('SKU').siblings("span").should($span => {
                        prodSpecs["SKU"] = $span.text()
                    }).then(() => (prodSpecs));

                }).then(prodSpecs => {

                    return cy.get('div.product-detail div.mainproduct-slider div.slick-track').children().then(mediaLists => {

                        const list = _.map(mediaLists, function (mediaDiv) {
                            const iframe = Cypress.$(mediaDiv).find('iframe');
                            if (iframe.length > 0) {
                                return iframe.attr('src');
                            }
                            const img = Cypress.$(mediaDiv).find('img');
                            if (img.length > 0) {
                                return img.attr('src');
                            }
                        });

                        prodSpecs.MediaLinks = list;
                        prodSpecs.Href = itm.href;
                        return prodSpecs;

                    });


                }).save();

            });

        });

})