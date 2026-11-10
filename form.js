(function () {
  var ENDPOINT = "https://formsubmit.co/ajax/johnwickcrypto@outlook.com";

  function wireForm(formId, thanksId, subject) {
    var form = document.getElementById(formId);
    var thanks = document.getElementById(thanksId);
    if (!form || !thanks) return;

    var errorEl = form.querySelector(".form-error");
    if (!errorEl) {
      errorEl = document.createElement("p");
      errorEl.className = "form-error";
      errorEl.hidden = true;
      errorEl.setAttribute("data-i18n", "send_error");
      errorEl.textContent = "the message could not be sent. please try again, or write me at johnwickcrypto@outlook.com.";
      form.appendChild(errorEl);
    }

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      errorEl.hidden = true;
      var btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;

      var data = new FormData(form);
      data.append("_subject", subject);
      data.append("_template", "table");
      data.append("_captcha", "false");

      try {
        var res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data
        });
        var json = await res.json().catch(function () { return {}; });
        if (!res.ok || json.success === "false" || json.success === false) {
          throw new Error("submit failed");
        }
        form.hidden = true;
        thanks.hidden = false;
      } catch (err) {
        if (btn) btn.disabled = false;
        var lang = document.documentElement.getAttribute("data-lang") || "en";
        var pack = (window.I18N && window.I18N[lang]) || {};
        if (pack.send_error) errorEl.textContent = pack.send_error;
        errorEl.hidden = false;
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    wireForm("talent-form", "talent-thanks", "the continental · open table");
    wireForm("company-form", "company-thanks", "the continental · right room");
  });
})();
