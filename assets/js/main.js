// ROTLAND — wspólny skrypt strony
(function () {
  "use strict";

  var LANG_KEY = "rotland-lang";

  /* ---------- Język PL/EN ---------- */
  function applyLang(lang) {
    document.documentElement.setAttribute("lang", lang === "en" ? "en" : "pl");

    document.querySelectorAll("[data-lang]").forEach(function (el) {
      if (el.getAttribute("data-lang") === lang) {
        el.removeAttribute("hidden");
      } else {
        el.setAttribute("hidden", "");
      }
    });

    document.querySelectorAll(".lang-switch button").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-set-lang") === lang);
    });

    document.title = lang === "en" && document.documentElement.dataset.titleEn
      ? document.documentElement.dataset.titleEn
      : document.documentElement.dataset.titlePl || document.title;
  }

  function initLang() {
    var stored = localStorage.getItem(LANG_KEY);
    var lang = stored === "en" ? "en" : "pl";
    applyLang(lang);

    document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var chosen = btn.getAttribute("data-set-lang");
        localStorage.setItem(LANG_KEY, chosen);
        applyLang(chosen);
      });
    });
  }

  /* ---------- Menu mobilne ---------- */
  function initNavToggle() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".main-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Kopiowanie IP serwera ---------- */
  function initIpCopy() {
    document.querySelectorAll("[data-copy-ip]").forEach(function (btn) {
      var original = btn.textContent;
      btn.addEventListener("click", function () {
        var ip = btn.getAttribute("data-copy-ip");
        navigator.clipboard.writeText(ip).then(function () {
          btn.classList.add("copied");
          btn.textContent = btn.getAttribute("data-copied-label") || "Skopiowano!";
          setTimeout(function () {
            btn.classList.remove("copied");
            btn.textContent = original;
          }, 1800);
        }).catch(function () {
          window.prompt("Skopiuj adres serwera:", ip);
        });
      });
    });
  }

  /* ---------- Scrollspy dla menu bocznego (regulamin, o serwerze) ---------- */
  function initSideNavScrollspy() {
    var sideNav = document.querySelector(".side-nav");
    if (!sideNav) return;

    var links = Array.prototype.slice.call(sideNav.querySelectorAll('a[href^="#"]'));
    if (!links.length) return;

    var sections = [];
    links.forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      var el = document.getElementById(id);
      if (el) sections.push({ id: id, el: el });
    });
    if (!sections.length) return;

    function setActive(id) {
      links.forEach(function (link) {
        link.classList.toggle("active", link.getAttribute("href") === "#" + id);
      });
    }

    if (!("IntersectionObserver" in window)) {
      setActive(sections[0].id);
      return;
    }

    var current = sections[0].id;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            current = entry.target.id;
          }
        });
        setActive(current);
      },
      { rootMargin: "-110px 0px -65% 0px", threshold: 0 }
    );

    sections.forEach(function (s) {
      observer.observe(s.el);
    });

    setActive(current);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLang();
    initNavToggle();
    initIpCopy();
    initSideNavScrollspy();
  });
})();
