const testing = false; // Set to true to enable debug mode

// #debug
let userAccess = 200;
// #enddebug

// #debug
/*
// #enddebug
let userAccess = <?!= userAccess ?>;
// #debug
*/
// #enddebug

if (userAccess > 0) Array.from(document.getElementsByClassName("no-user-vis-only")).forEach(x => x.remove()); // Only for non-users, NO ONE ELSE
if (userAccess < 1) Array.from(document.getElementsByClassName("user-vis-only")).forEach(x => x.remove()); // For users and up
if (userAccess < 100) Array.from(document.getElementsByClassName("tutor-vis-only")).forEach(x => x.remove()); // For tutors and up
if (userAccess < 200) Array.from(document.getElementsByClassName("data-analyst-vis-only")).forEach(x => x.remove()); // For data analysts and up
if (userAccess < 999) Array.from(document.getElementsByClassName("admin-vis-only")).forEach(x => x.remove()); // For admin and up

let dropdownHamburger = document.getElementById("topnav-hamburger");
let dropdown = document.getElementById("topnav-dropdown");
if (dropdown) document.addEventListener("click", () => {
    dropdown.classList.remove("visible");
}, true);
function toggleTopnavDropdown() {
    dropdown.classList.toggle("visible");
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        document.querySelectorAll("input:focus, textarea:focus").forEach((el) => {
            el.blur();
        });
    }
}, true);

document.querySelectorAll(".text-input-wrapper").forEach((tiw) => {
    let textInput = tiw.querySelector("input, textarea");
    tiw.onclick = () => {
        textInput.focus();
    };
});

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove("active");
    document.body.classList.remove("no-scroll");
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

function formatDateTime(time, formatShort) {
    return `${formatDate(time, formatShort)} ${formatTime(time)}`;
}

function formatDate(time, formatShort) {
    let options = { dateStyle: "full" };
    if (formatShort) options.dateStyle = "medium";
    let dateFormatter = Intl.DateTimeFormat({ region: "en-us" }, options);
    return dateFormatter.format(new Date(time));
}
function formatTime(time) { return timeFormatter.format(new Date(time)); }

function sendAPIReq(data, thenLambda = () => {}, errorLambda = () => {}, finallyLambda = () => {}) {
  google.script.run.withSuccessHandler(apiReqResponseHandler.bind(null, thenLambda, errorLambda, finallyLambda)).handleWebAppRequest(JSON.stringify(data));
}

function apiReqResponseHandler(thenLambda, errorLambda, finallyLambda, res) {
    res = JSON.parse(res);
    if (res.error) {
      let handled = errorLambda(res);
      if (!handled) showErrorModal(`Error ${res.errorCode}. Something went wrong, please try again later.\nDetails: ${res.error}`);
      finallyLambda();
      return;
    }
    thenLambda(res);
    finallyLambda();
}

function showErrorModal(errorText) {
    console.error(errorText);
    alert(errorText);
}

// Past this point is debug only territory
const API = "https://script.google.com/macros/s/AKfycbzH2I8MzlMi4M8a3GN2bWbl6kPatlXiZzjcSlTi5rxrgjiqEXL_dMjGY1YTIMDMwzG2GA/exec";
const APIKey = "9ayWk9voW6WIWiNwpVK4l7AeN3EEBnYHzZk1XIkDDfYXcA8K3Gioxk2sSgplxR4HpOxzosgKmBDewIwAWAKgbYE4kkPyp80WG5kAbFN28rUMi3cGQqGlsD5qorSry15W";

function sendAPIReq(data, thenLambda = () => {}, errorLambda = () => {}, finallyLambda = () => {}) {
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
                finallyLambda();
                return;
            }
            if (res.error) {
                let handled = errorLambda(res);
                if (!handled) showErrorModal(`Error ${res.errorCode}.\nSomething went wrong, please try again later.\n\nDetails:\n${res.error}`);
                finallyLambda();
                return;
            }
            thenLambda(res);
            finallyLambda();
        });
    }).catch(() => {
        let handled = errorLambda({errorCode: "no-connection"});
        if (!handled) showErrorModal("Failed to access server. Please try again later.");
        finallyLambda();
        return;
    });
}