// Corner pizza opens overlay: animated reveal, rotating pizza + side nav inside.
(function () {
  var trigger = document.querySelector(".home-pizza-trigger");
  var overlay = document.getElementById("home-pizza-overlay");
  var closeBtn = document.querySelector(".home-pizza-close");
  if (!trigger || !overlay) return;

  function open() {
    overlay.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function close() {
    overlay.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    trigger.focus();
  }

  trigger.addEventListener("click", function () {
    if (overlay.hidden) open();
    else close();
  });

  if (closeBtn) closeBtn.addEventListener("click", close);

  overlay.addEventListener("click", function (e) {
    var sheet = overlay.querySelector(".home-pizza-sheet");
    if (sheet && sheet.contains(e.target)) return;
    close();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !overlay.hidden) close();
  });
})();
