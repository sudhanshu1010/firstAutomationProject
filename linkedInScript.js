/* Basic idea of the script -
1. search for particular tag and send requests to those people 
2. send requests to leaders (max limit)
3. accept requests and send connection message 
4. withdraw all the pending requests */

const puppy = require("puppeteer");
const id = "hydrogenkumar1010@gmail.com";
const pass = "hydrogen";

// main function to start execution
async function main() {
    let browser = await puppy.launch({
        headless: false,
        defaultViewport: false,
        args: ["--start-maximized"]
    });
    let tabs = await browser.pages();
    let tab = tabs[0];
    await tab.goto("https://www.linkedin.com/login");

    // typing the username and password
    await tab.waitForSelector("#username");
    await tab.type("#username", id);
    await tab.waitForSelector("#password");
    await tab.type("#password", pass);

    // clicking on sign in button
    await tab.click(".btn__primary--large.from__button--floating");

    // now clicking on my network button
    await tab.waitForSelector('a[data-test-global-nav-link="mynetwork"]', { visible: true });
    await tab.click('a[data-test-global-nav-link="mynetwork"]');

    // going to the invitaion page
    await tab.goto("https://www.linkedin.com/mynetwork/invitation-manager/sent/");

    // getting all the links of profiles
    await tab.waitForSelector('time[class="time-badge time-ago"]');
    let allWithdrawButtons = await tab.$$(".invitation-card__action-btn.artdeco-button.artdeco-button--muted.artdeco-button--3.artdeco-button--tertiary.ember-view");
    // let allUrls = await tab.$$('time[class="time-badge time-ago"]');

    // calling function to withdraw all the requests
    // await withdrawAll(tab, allWithdrawButtons);

    // calling function to accept requests
    await acceptRequests(tab);

    // closing the browser
    // await browser.close();

}

async function acceptRequests(tab) {
    // clicking on receieved button
    // await tab.waitForSelector(".artdeco-tab.active.artdeco-tab--selected.ember-view");
    // await tab.click(".artdeco-tab.active.artdeco-tab--selected.ember-view");
    await tab.goto("https://www.linkedin.com/mynetwork/invitation-manager/"); 
    await tab.waitForSelector("button span.artdeco-button__text", {visible: true});
    let allRequests = await tab.$$("button span.artdeco-button__text");
    await allRequests[4].click();
}

// function to withdraw all the requests
async function withdrawAll(tab, allWithdrawButtons) {
    // loop to withdraw all the pending requests
    for (let i = 0; i < allWithdrawButtons.length; i++) {

        // to wait for 3 seconds to click withdraw again
        await new Promise(function (resolve) {
            setTimeout(resolve, 1000);
        });
        await allWithdrawButtons[i].click();
        await tab.waitForSelector(".artdeco-modal__confirm-dialog-btn.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view", { visible: true });
        await tab.click(".artdeco-modal__confirm-dialog-btn.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view");
    }
}

main();