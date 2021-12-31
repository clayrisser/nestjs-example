const OPEN_MODAL_BUTTON_SELECTOR =
  "#swagger-ui div.swagger-ui div.scheme-container section button";
const AUTHORIZE_BUTTON_SELECTOR =
  "#swagger-ui div.swagger-ui div.scheme-container section div.modal-ux div.modal-ux-content > div:nth-child(2) button[type=submit]";
const INPUT_SELECTOR =
  "#swagger-ui div.swagger-ui div.scheme-container section div.modal-ux div.modal-ux-content > div:nth-child(2) section input[type=text]";
const CLOSE_MODAL_SELECTOR =
  "#swagger-ui div.swagger-ui div.scheme-container section div.modal-ux div.modal-ux-header button";

const urlParams = new URLSearchParams(window.location.search);
const logger = console;

window.setTimeout(() => {
  const accessToken = urlParams.get("access_token");
  const openModalElement = window.document.querySelector(
    OPEN_MODAL_BUTTON_SELECTOR
  );
  if (
    openModalElement.innerHTML.toLowerCase().indexOf('href="#locked"') <= -1 &&
    accessToken
  ) {
    openModalElement.click();
    const inputElement = window.document.querySelector(INPUT_SELECTOR);
    if (inputElement) {
      setInputValue(inputElement, accessToken);
      window.document.querySelector(AUTHORIZE_BUTTON_SELECTOR).click();
    }
    const closeModalElement =
      window.document.querySelector(CLOSE_MODAL_SELECTOR);
    if (closeModalElement) closeModalElement.click();
    logger.info("authorized");
  }
  if (accessToken) {
    logger.info("access token ->");
    logger.info(accessToken);
  }
}, 500);

function setInputValue(inputElement, value) {
  const previousInputValue = inputElement.value;
  inputElement.value = value;
  const inputEvent = new Event("input", {
    view: window,
    bubbles: true,
    cancelable: false,
  });
  inputEvent.simulated = true;
  const inputTracker = inputElement._valueTracker;
  if (inputTracker) {
    inputTracker.setValue(previousInputValue);
  }
  inputElement.dispatchEvent(inputEvent);
}
