let display = document.getElementById("display");

let shouldReset = false; // 🔥 important fix

// 👉 Append value
function append(value) {
  if (shouldReset) {
    display.value = "";
    shouldReset = false;
  }

  display.value += value;

  // ✨ soft premium animation
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



function clearHistory() {
  history = [];
  localStorage.removeItem("calcHistory");
  renderHistory();
}






// 👉 Clear screen
function clearDisplay() {
  display.value = "";
  shouldReset = false;
}

// 👉 Delete last character
function deleteLast() {
  display.value = display.value.slice(0, -1);
}

// 👉 Calculate result
function calculate() {
  const result = evaluateExpression(display.value);
  addToHistory(display.value + " = " + result);
  display.value = result;
  shouldReset = true;
}

// ⌨️ Keyboard support
document.addEventListener("keydown", function (event) {

  if (!isNaN(event.key) || "+-*/.".includes(event.key)) {
    append(event.key);
  }

  else if (event.key === "Enter") {
    calculate();
  }

  else if (event.key === "Backspace") {
    deleteLast();
  }

  else if (event.key === "Escape") {
    clearDisplay();
  }
});

// 🌙 Dark mode toggle
const toggleBtn = document.getElementById("themeToggle");

let isDark = false;

toggleBtn.addEventListener("click", function () {
  document.body.classList.toggle("dark");
  isDark = !isDark;

  toggleBtn.textContent = isDark ? "☀️" : "🌙";
});

function evaluateExpression(expr) {
  try {
    // replace symbols
    expr = expr.replace(/×/g, "*").replace(/÷/g, "/");

    // only allow safe characters
    if (!/^[0-9+\-*/(). ]+$/.test(expr)) {
      return "Error";
    }

    return Function('"use strict"; return (' + expr + ")")();
  } catch {
    return "Error";
  }
}




let historyBox = document.getElementById("history");

// load history on start
let history = JSON.parse(localStorage.getItem("calcHistory")) || [];
renderHistory();

// add history
function addToHistory(entry) {
  history.unshift(entry);

  // keep only last 10
  if (history.length > 10) {
    history.pop();
  }

  localStorage.setItem("calcHistory", JSON.stringify(history));
  renderHistory();
}

// render history
function renderHistory() {
  historyBox.innerHTML = "";

  history.forEach(item => {
    const div = document.createElement("div");
    div.textContent = item;
    historyBox.appendChild(div);
  });
}