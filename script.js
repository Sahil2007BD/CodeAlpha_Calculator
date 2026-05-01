// getting display input field
let display = document.getElementById("display");

// used to reset screen after showing result
let shouldReset = false;

// 👉 add number/operator to display
function append(value) {
  // if result was just shown, clear first
  if (shouldReset) {
    display.value = "";
    shouldReset = false;
  }

  display.value += value;

  // small animation effect when typing
  display.animate(
    [
      { transform: "scale(1)", opacity: 1 },
      { transform: "scale(1.01)", opacity: 0.98 },
      { transform: "scale(1)", opacity: 1 }
    ],
    {
      duration: 120,
      easing: "ease-out"
    }
  );
}

// 👉 clear all history
function clearHistory() {
  history = [];
  localStorage.removeItem("calcHistory");
  renderHistory();
}

// 👉 clear display screen
function clearDisplay() {
  display.value = "";
  shouldReset = false;
}

// 👉 delete last character
function deleteLast() {
  display.value = display.value.slice(0, -1);
}

// 👉 calculate result
function calculate() {
  const result = evaluateExpression(display.value);

  // save to history
  addToHistory(display.value + " = " + result);

  display.value = result;

  // next input should reset
  shouldReset = true;
}

// ⌨️ keyboard support
document.addEventListener("keydown", function (event) {

  // numbers and operators
  if (!isNaN(event.key) || "+-*/.".includes(event.key)) {
    append(event.key);
  }

  // enter = calculate
  else if (event.key === "Enter") {
    calculate();
  }

  // backspace = delete
  else if (event.key === "Backspace") {
    deleteLast();
  }

  // escape = clear
  else if (event.key === "Escape") {
    clearDisplay();
  }
});

// 🌙 dark mode toggle
const toggleBtn = document.getElementById("themeToggle");

let isDark = false;

toggleBtn.addEventListener("click", function () {
  document.body.classList.toggle("dark");
  isDark = !isDark;

  // change icon
  toggleBtn.textContent = isDark ? "☀️" : "🌙";
});

// 👉 evaluate math expression safely
function evaluateExpression(expr) {
  try {
    // convert symbols to JS format
    expr = expr.replace(/×/g, "*").replace(/÷/g, "/");

    // allow only safe characters
    if (!/^[0-9+\-*/(). ]+$/.test(expr)) {
      return "Error";
    }

    // calculate result
    return Function('"use strict"; return (' + expr + ")")();
  } catch {
    return "Error";
  }
}

// 👉 history box
let historyBox = document.getElementById("history");

// load saved history from browser
let history = JSON.parse(localStorage.getItem("calcHistory")) || [];

// show history on page load
renderHistory();

// 👉 add new history item
function addToHistory(entry) {
  history.unshift(entry);

  // keep only last 10 items
  if (history.length > 10) {
    history.pop();
  }

  // save in browser storage
  localStorage.setItem("calcHistory", JSON.stringify(history));

  renderHistory();
}

// 👉 display history on screen
function renderHistory() {
  historyBox.innerHTML = "";

  history.forEach(item => {
    const div = document.createElement("div");
    div.textContent = item;
    historyBox.appendChild(div);
  });
}