import "../array-input";

// google search console
const gscCheckboxElement = document.querySelector("input[name='EnableGoogleSearchConsoleIntegration']");
const gscWrapperElement = document.querySelector("#google-search-console-site");
const gscButtonElement = gscWrapperElement.querySelector("#connect-with-google-button");

gscCheckboxElement.addEventListener("change", (event) => {
  if (event.target.checked) {
    gscWrapperElement.classList.remove("d-none");
  } else {
    gscWrapperElement.classList.add("d-none");
  }
});

if (gscButtonElement) {
  gscButtonElement.addEventListener("click", () => {
    google.accounts.oauth2.initCodeClient({
      callback: (response) => {
        console.log(response);
        htmx.trigger(gscButtonElement, "googleOauthComplete", { code: response.code });
      },
      client_id: gscButtonElement.getAttribute("data-google-client-id"),
      error_callback: (error) => {
        console.log(error);
      },
      scope: "https://www.googleapis.com/auth/webmasters.readonly",
    }).requestCode();
  });
}
