const testing = false; // Set to true to enable debug mode

// #debug
/*
// #enddebug
let userAccess = <?!= userAccess ?>;
if (userAccess < 100) Array.from(document.getElementsByClassName("tutor-vis-only")).forEach(x => x.remove());
if (userAccess < 999) Array.from(document.getElementsByClassName("admin-vis-only")).forEach(x => x.remove());
// #debug
*/
// #enddebug

let dropdownHamburger = document.getElementById("topnav-hamburger");
let dropdown = document.getElementById("topnav-dropdown");
if (dropdown) document.addEventListener("click", () => {
    dropdown.classList.remove("visible");
}, true);
function toggleTopnavDropdown() {
    dropdown.classList.toggle("visible");
}

/**
 * Deletes all the children of the specified element.
 * @param {HTMLElement} element The element to delete the children of.
 */
function deleteChildren(element) {
    while (element.children.length > 0) {
        element.children.item(element.children.length - 1).remove();
    }
}

let timeFormatter = new Intl.DateTimeFormat('en-US', {timeStyle:"short"});

function formatTime(dateObject) {
    return timeFormatter.format(dateObject);
}

function sendAPIReq(data, thenLambda = () => {}, errorLambda = () => {}) {
  google.script.run.withSuccessHandler(apiReqResponseHandler.bind(null, thenLambda, errorLambda)).handleWebAppRequest(JSON.stringify(data));
}

function apiReqResponseHandler(thenLambda, errorLambda, res) {
    res = JSON.parse(res);
    if (res.error) {
      let handled = errorLambda(res);
      if (!handled) showErrorModal(`Error ${res.errorCode}. Something went wrong, please try again later.`);
      return;
    }
    thenLambda(res);
}

function showErrorModal(errorText) {
    console.error(errorText);
}

// Past this point is debug only territory
const API = "https://script.google.com/macros/s/AKfycbzH2I8MzlMi4M8a3GN2bWbl6kPatlXiZzjcSlTi5rxrgjiqEXL_dMjGY1YTIMDMwzG2GA/exec";
const APIKey = "9ayWk9voW6WIWiNwpVK4l7AeN3EEBnYHzZk1XIkDDfYXcA8K3Gioxk2sSgplxR4HpOxzosgKmBDewIwAWAKgbYE4kkPyp80WG5kAbFN28rUMi3cGQqGlsD5qorSry15W";

function sendAPIReq(data, thenLambda = () => {}, errorLambda = () => {}) {
    console.info("Sending API request with the following data:", data);
    data.key = APIKey;
    fetch(API, {
        redirect: "follow",
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        }
    }).then((val) => {
        val.json().then((res) => {
            console.log("Received the following response:", res);
            if (res.error == "apiKeyInvalid") {
                showErrorModal("API key invalid.");
                return;
            }
            if (res.error) {
                let handled = errorLambda(res);
                if (!handled) {
                    showErrorModal("Something went wrong, please try again later.");
                }
                return;
            }
            thenLambda(res);
        });
    }).catch(() => {
        let handled = errorLambda({errorCode: "no-connection"});
        if (!handled) showErrorModal("Failed to access API. Please try again later.");
        return;
    });
}

function showErrorModal(errorText) {
    console.error(errorText);
    alert(errorText);
}