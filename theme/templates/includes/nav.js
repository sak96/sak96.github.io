document.querySelector("#navbar-toggler").onclick = function (e) {
  document
    .querySelectorAll(".nav-start a,.nav-end a")
    .forEach((e) => e.classList.toggle("show"));
};
{
  let theme = localStorage.getItem("theme");
  if (
    theme === "light" ||
    window.matchMedia("(prefers-color-scheme: light)").matches
  ) {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }
}
document.querySelector("#theme").onclick = function (e) {
  if (document.documentElement.getAttribute("data-theme")) {
    document.documentElement.setAttribute("data-theme", "");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  }
};
