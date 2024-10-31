import Toast from "bootstrap/js/src/toast";

document.addEventListener("DOMContentLoaded", function () {
  const toastElements = document.querySelectorAll(".toast");
  toastElements.forEach((element) => {
    const toast = new Toast(element);
    toast.show();
  });
});
