var popup = document.getElementById("popup");
window.onload = () => {
  popup.style.display = "block";
};

const exitButton = document.getElementById("bad-exit-button");
exitButton.addEventListener("click", function () {
  window.location.href = "./index.html";
});

const continueButton = document.getElementById("bad-continue-button");
continueButton.addEventListener("click", function () {
  popup.style.display = "none";
});
