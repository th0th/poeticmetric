import Cookies from "js-cookie";

const cookieName = "colorMode";
const iconElementClasses = {
  auto: "bi-circle-half",
  dark: "bi-moon-stars-fill",
  light: "bi-sun-fill",
};

function getSystemColorMode() {
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setColorMode() {
  const colorModeFromCookie = Cookies.get(cookieName);
  const iconElement = document.body.querySelector("[data-color-mode-icon]");
  const colorMode = colorModeFromCookie || getSystemColorMode();

  iconElement.setAttribute("class", iconElementClasses[colorModeFromCookie || "auto"]);

  document.body.setAttribute("data-bs-theme", colorMode);

  document.body.querySelectorAll(`[data-color-mode]`).forEach(function (element) {
    element.classList.remove("active");

    const checkIconElement = element.querySelector("i.bi-check2");

    checkIconElement && checkIconElement.remove();
  });

  const colorModeDropdownItem = document.body.querySelector(`[data-color-mode='${colorModeFromCookie || "auto"}']`);

  colorModeDropdownItem.classList.add("active");

  const checkIconElement = document.createElement("i");
  checkIconElement.classList.add("bi-check2", "ms-auto");

  colorModeDropdownItem.appendChild(checkIconElement);
}

document.addEventListener("DOMContentLoaded", function () {
  setColorMode();

  document.body.addEventListener("setColorMode", function (event) {
    const colorMode = event.target.getAttribute("data-color-mode");

    if (["dark", "light"].includes(colorMode)) {
      Cookies.set(cookieName, colorMode);
    } else {
      Cookies.remove(cookieName);
    }

    setColorMode();
  });
});

window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
  setColorMode();
});