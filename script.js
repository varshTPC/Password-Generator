// elements
const passdisplay = document.querySelector(".password-input");
const inputslider = document.querySelector(".slider");
const displaylength = document.querySelector(".password-length-value");
const upperchkbox = document.querySelector("#uppercase");
const lowerchkbox = document.querySelector("#lowercase");
const numberchkbox = document.querySelector("#number");
const symbolchkbox = document.querySelector("#symbol");
const allchkboxes = document.querySelectorAll(".check");
const indicator = document.querySelector(".indicator");
const generatebtn = document.querySelector(".generate-btn");
const copyBtn = document.querySelector(".copybtn");
const copyMsg = document.querySelector(".copytext");

// variables
let password = "";
let passwordlen = 10;
let checkboxcount = 0;
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// functions
function handleSlider() {
    inputslider.value = passwordlen;
    displaylength.innerText = passwordlen;

    // the portion of slider to be highlighted
    const min = inputslider.min;
    const max = inputslider.max;
    inputslider.style.backgroundSize = ( (passwordlen - min)*100/(max - min)) + "% 100%";
}
handleSlider();
setIndicator("#ccc");

function handleCheckboxChange() {
    checkboxcount = 0;
    allchkboxes.forEach ((checkbox) => {
        if (checkbox.checked) {
            checkboxcount++;
        }
    });
}

function getRandInt(min, max) {
    return Math.floor(Math.random()*(max-min) + min);
}

function getRandUppercase() {
    return String.fromCharCode(getRandInt(65, 91));
}

function getRandLowercase() {
    return String.fromCharCode(getRandInt(97, 123));
}

function getRandNumber() {
    return getRandInt(0, 9);
}

function getRandSymbol() {
    return symbols.charAt(getRandInt(0, symbols.length))
}

function generatePassword() {
    // console.log("entered generate pass");
    let include = [];
    password = "";

    if (checkboxcount == 0) return;

    // special condition
    if (passwordlen < checkboxcount) {
        passwordlen = checkboxcount;
        handleSlider();
    }

    if (upperchkbox.checked) include.push(getRandUppercase);
    if (lowerchkbox.checked) include.push(getRandLowercase);
    if (numberchkbox.checked) include.push(getRandNumber);
    if (symbolchkbox.checked) include.push(getRandSymbol);
    
    // compulsory options
    for (let i = 0; i < include.length; i++) {
        password += include[i]();
    }

    // remaining options
    for (let i = 0; i < passwordlen-include.length; i++) {
        let randIndex = getRandInt(0, include.length);
        password += include[randIndex]();
    }

    // shuffle password
    password = shufflePassword(Array.from(password));

    // display password
    passdisplay.value = password;

    // calculate strenth
    calcStrength();
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if (upperchkbox.checked) hasUpper = true;
    if (lowerchkbox.checked) hasLower = true;
    if (numberchkbox.checked) hasNumber = true;
    if (symbolchkbox.checked) hasSymbol = true;

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordlen >= 8) {
        setIndicator("#0f0"); // strong - green
    } else if ((hasLower || hasUpper) && (hasNumber || hasSymbol) && passwordlen >= 6) {
        setIndicator("#ff0"); // neutral - yellow
    } else {
        setIndicator("#f00"); // weak - red
    }
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

async function copyPassword() {
    try {
        await navigator.clipboard.writeText(passdisplay.value);
        copyMsg.innerText = "Copied!";
    } catch (e) {
        copyMsg.innerText = "Failed";
    }

    // to make copyMsg visible and invisible after 2sec
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array) {
    // Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

// event listeners
inputslider.addEventListener("input", (e) => {
    passwordlen = e.target.value;
    handleSlider();
})

generatebtn.addEventListener("click", () => {
    generatePassword();
});

copyBtn.addEventListener("click", () => {
    if (passdisplay.value != "PASSWORD") {
        copyPassword();
    }
});

allchkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
        handleCheckboxChange();
    });
})