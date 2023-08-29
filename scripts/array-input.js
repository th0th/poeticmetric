const elements = document.querySelectorAll(".array-input");

elements.forEach((arrayInputElement) => {
  const name = arrayInputElement.getAttribute("data-name");
  const entryElement = arrayInputElement.querySelector("input[data-entry]");

  entryElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      const existingInputElement = arrayInputElement.querySelector(`input[value="${entryElement.value}"]`);

      if (existingInputElement) {
        return;
      }

      const inputElement = document.createElement("input");

      inputElement.setAttribute("name", name);
      inputElement.setAttribute("type", "hidden");
      inputElement.setAttribute("value", entryElement.value);

      const badgeElement = document.createElement("div");

      badgeElement.classList.add("align-items-center", "badge", "bg-primary", "d-flex", "flex-row", "gap-1");
      badgeElement.innerText = entryElement.value;
      badgeElement.setAttribute("title", entryElement.value);

      const badgeDeleteButtonElement = document.createElement("button");
      badgeDeleteButtonElement.classList.add("btn-close", "btn-close-white");
      badgeDeleteButtonElement.setAttribute("data-bs-theme", "dark");
      badgeDeleteButtonElement.setAttribute("type", "button");
      badgeDeleteButtonElement.setAttribute("style", "width: 0.25rem; height: 0.25rem;");

      badgeElement.appendChild(badgeDeleteButtonElement);

      arrayInputElement.insertBefore(inputElement, arrayInputElement.firstChild);
      arrayInputElement.insertBefore(badgeElement, arrayInputElement.lastElementChild);
      entryElement.value = "";
    }
  });

  arrayInputElement.addEventListener("click", (event) => {
    const badgeDeleteButtonElement = event.target.closest(".btn-close");

    if (badgeDeleteButtonElement) {
      const badgeElement = badgeDeleteButtonElement.closest(".badge");
      const value = badgeElement.getAttribute("title");

      const inputElement = arrayInputElement.querySelector(`input[value="${value}"]`);

      inputElement.remove();
      badgeElement.remove();
    }
  });
});