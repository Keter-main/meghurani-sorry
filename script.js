const noBtn = document.getElementById("noBtn");

if (noBtn) {

  function moveButton() {

    const viewportWidth = window.visualViewport 
      ? window.visualViewport.width 
      : window.innerWidth;

    const viewportHeight = window.visualViewport 
      ? window.visualViewport.height 
      : window.innerHeight;

    const btnWidth = noBtn.offsetWidth;
    const btnHeight = noBtn.offsetHeight;

    const safePadding = 20;

    const maxX = viewportWidth - btnWidth - safePadding;
    const maxY = viewportHeight - btnHeight - safePadding;

    let randomX = Math.random() * maxX;
    let randomY = Math.random() * maxY;

    // Clamp values (extra safety)
    randomX = Math.max(safePadding, Math.min(randomX, maxX));
    randomY = Math.max(safePadding, Math.min(randomY, maxY));

    noBtn.style.position = "fixed";
    noBtn.style.left = randomX + "px";
    noBtn.style.top = randomY + "px";
    noBtn.style.transition = "all 0.25s ease";
  }

  noBtn.addEventListener("touchstart", function (e) {
    e.preventDefault();
    moveButton();
  });

  noBtn.addEventListener("click", function (e) {
    e.preventDefault();
    moveButton();
  });
}

function forgive() {
  const yay = document.getElementById("yayScreen");
  yay.classList.add("show");

  if (navigator.vibrate) {
    navigator.vibrate(200);
  }
}
