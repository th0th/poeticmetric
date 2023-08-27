import Toast from "bootstrap/js/src/toast";

const toastsStoreElement = document.querySelector("#toasts-store");
const toastsElement = document.querySelector("#toasts");

const toastElements = toastsStoreElement.querySelectorAll(".toast")

toastElements.forEach((e) => {
  toastsElement.appendChild(e);

  const toast = new Toast(e);

  e.addEventListener("hidden.bs.toast", () => {
    e.remove();
  });

  toast.show();
});