// /assets/js/site.js
(function () {
  const C = window.CHEF_HANTU;
  if (!C) return;

  // Fill text placeholders: <span data-text="address.full"></span>
  function getPath(obj, path) {
    return path.split(".").reduce((o, k) => (o && o[k] != null ? o[k] : null), obj);
  }

  function applyTextBindings() {
    document.querySelectorAll("[data-text]").forEach(el => {
      const val = getPath(C, el.getAttribute("data-text"));
      if (val != null) el.textContent = val;
    });
  }

  // Fill links: <a data-href="whatsappMY"></a>
  function applyLinkBindings() {
    document.querySelectorAll("[data-href]").forEach(el => {
      const key = el.getAttribute("data-href");

      if (key === "whatsappMY") {
        el.href = `https://wa.me/${C.phones.whatsappMY_e164}`;
        return;
      }
      if (key === "emailPrimary") {
        el.href = `mailto:${C.emails[0]}`;
        return;
      }
      if (key === "emailAll") {
        el.href = `mailto:${C.emails.join(",")}`;
        return;
      }
      if (C.socials[key]) {
        el.href = C.socials[key];
        return;
      }
    });
  }
  function applySrcBindings() {
  document.querySelectorAll("[data-src]").forEach(el => {
    const val = getPath(C, el.getAttribute("data-src"));
    if (!val) return;
    el.setAttribute("src", val);
  });
}

  function applyYear() {
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  // Inject ONE JSON-LD (remove duplicates elsewhere)
  function injectJsonLd() {
    const ld = {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      "name": C.name,
      "servesCuisine": C.cuisine,
      "image": C.images.hero,
      "url": C.url,
      "email": C.emails,
      "telephone": [`+${C.phones.whatsappMY_e164}`],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": C.address.street,
        "addressLocality": C.address.city,
        "addressRegion": C.address.region,
        "postalCode": C.address.postalCode,
        "addressCountry": C.address.country
      },
      "openingHours": [C.hours.schema],
      "priceRange": C.priceRange,
      "sameAs": [C.socials.facebook, C.socials.instagram, C.socials.tiktok]
    };

    // Avoid duplicates
    const existing = document.getElementById("jsonld-chefhantu");
    if (existing) existing.remove();

    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.id = "jsonld-chefhantu";
    s.textContent = JSON.stringify(ld);
    document.head.appendChild(s);
  }

  // Your existing language logic can stay — but it should NOT store business info.
  // Keep your t/en/ms dictionary approach from scripts.html :contentReference[oaicite:5]{index=5}
  // We just run your applyLang(...) after includes are loaded.
  function initLanguageAfterIncludes() {
    // If you keep applyLang global, call it here.
    // If not, ignore.
    if (typeof window.applyLang === "function") {
      window.applyLang(localStorage.getItem("chefHantuLang") || "en");
    }
  }

  // Run after includes are injected
  document.addEventListener("partials:loaded", () => {
    applyTextBindings();
    applyLinkBindings();
    applySrcBindings();
    applyYear();
    injectJsonLd();
    initLanguageAfterIncludes();
  });

  // Fallback if no include system on a page
  window.addEventListener("DOMContentLoaded", () => {
    applyTextBindings();
    applyLinkBindings();
    applySrcBindings();
    applyYear();
    injectJsonLd();
  });
})();
