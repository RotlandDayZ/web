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

  /* ---------- Status serwera (BattleMetrics) ---------- */
  var BM_SERVER_ID = "33543431";
  var BM_REFRESH_MS = 60000;

  function initServerStatus() {
    var dot = document.getElementById("bm-dot");
    var statusPl = document.getElementById("bm-status-pl");
    var statusEn = document.getElementById("bm-status-en");
    var playersEl = document.getElementById("bm-players");
    if (!dot && !playersEl) return; // strona bez widgetu statusu — nic do zrobienia

    var hasLoadedOnce = false;

    function render(payload) {
      var attrs = payload && payload.data && payload.data.attributes;
      if (!attrs) throw new Error("Nieoczekiwana odpowiedź BattleMetrics");

      hasLoadedOnce = true;
      var isOnline = attrs.status === "online";

      if (dot) {
        dot.classList.remove("is-unknown");
        dot.classList.toggle("is-offline", !isOnline);
      }
      if (statusPl) statusPl.textContent = isOnline ? "SERWER ONLINE" : "SERWER OFFLINE";
      if (statusEn) statusEn.textContent = isOnline ? "SERVER ONLINE" : "SERVER OFFLINE";

      if (playersEl) {
        var max = attrs.maxPlayers || "?";
        playersEl.textContent = isOnline ? (attrs.players + " / " + max) : ("— / " + max);
      }
    }

    function fail() {
      if (dot) dot.classList.add("is-unknown");
      if (!hasLoadedOnce) {
        // pierwsze zapytanie się nie powiodło — pokaż neutralny komunikat zamiast "Sprawdzanie..." w nieskończoność
        if (statusPl) statusPl.textContent = "Status niedostępny";
        if (statusEn) statusEn.textContent = "Status unavailable";
      }
      // przy kolejnych nieudanych odświeżeniach zostawiamy ostatnie znane dane bez zmian
    }

    function fetchStatus() {
      fetch("https://api.battlemetrics.com/servers/" + BM_SERVER_ID)
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          return res.json();
        })
        .then(render)
        .catch(fail);
    }

    fetchStatus();
    setInterval(fetchStatus, BM_REFRESH_MS);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLang();
    initNavToggle();
    initIpCopy();
    initServerStatus();
  });
})();
