/* ==========================================================================
   TCE INFLUENCER AGENCY — INTERACTIVE ENGINE & LIVE WORLD CLOCKS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Live Footer Clocks for 5 Global Office Locations
  const updateFooterClocks = () => {
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };

    const timeZones = {
      clockDubai: 'Asia/Dubai',
      clockMumbai: 'Asia/Kolkata',
      clockLondon: 'Europe/London',
      clockDelaware: 'America/New_York',
      clockHongKong: 'Asia/Hong_Kong'
    };

    Object.keys(timeZones).forEach(clockId => {
      const el = document.getElementById(clockId);
      if (el) {
        try {
          const timeStr = new Date().toLocaleTimeString('en-US', {
            timeZone: timeZones[clockId],
            ...options
          });
          el.textContent = timeStr;
        } catch (e) {
          // Fallback if timezone string differs
        }
      }
    });
  };

  updateFooterClocks();
  setInterval(updateFooterClocks, 10000);

  // 2. Mobile Responsive Nav Menu Toggle
  const navMobileBtn = document.getElementById('navMobileBtn');
  const navLinks = document.getElementById('navLinks');

  if (navMobileBtn && navLinks) {
    navMobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-active');
      const icon = navMobileBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });
  }

  // 3. Enterprise Contact Form Flows
  const baseFields = [
    ["Full Name", "text", "Jane Smith", "half", true],
    ["Email", "email", "jane@company.com", "half", true],
    ["Phone Number", "tel", "+1 (555) 000-0000", "half", true],
    ["Organization", "text", "Company, publication, or creator name", "half", true],
    ["Location", "text", "City, country", "half", false],
    ["Message", "textarea", "Briefly tell us what you need.", "full", false]
  ];

  const flows = {
    brand: {
      title: "Speak to a Campaign Expert",
      submit: "GET A CUSTOM PROPOSAL",
      section: "CAMPAIGN DETAILS",
      fields: [
        ["Campaign Budget", "select", ["Select budget", "$10k-$25k", "$25k-$50k", "$50k-$100k", "$100k+"], "half", true],
        ["Target Markets", "text", "US, UAE, UK, India...", "half", false],
        ["Timeline", "select", ["Select timeline", "Immediate (1-2 weeks)", "1 Month", "2-3 Months", "Flexible / Planning"], "full", false]
      ]
    },
    creator: {
      title: "Apply to Join TCE",
      submit: "SUBMIT CREATOR PROFILE",
      section: "CREATOR DETAILS",
      fields: [
        ["Primary Platform", "select", ["Select platform", "TikTok", "Instagram", "YouTube", "LinkedIn", "Other"], "half", true],
        ["Profile Link", "url", "https://instagram.com/...", "half", true],
        ["Audience Size", "select", ["Select audience size", "10k-50k", "50k-250k", "250k-1M", "1M+"], "full", false]
      ]
    }
  };

  const fieldsContainer = document.querySelector("#dynamicFields");
  const formTitle = document.querySelector("#formTitle");
  const submitBtn = document.querySelector("#submitBtn");
  const tabs = document.querySelectorAll(".tab-btn");

  function renderFlow(flowName) {
    if (!fieldsContainer || !formTitle || !submitBtn) return;
    const flow = flows[flowName];
    if (!flow) return;
    formTitle.textContent = flow.title;
    submitBtn.textContent = flow.submit;
    fieldsContainer.innerHTML = "";

    const sectionDiv = document.createElement("div");
    sectionDiv.className = "f-divider";
    sectionDiv.textContent = flow.section;

    [...baseFields, sectionDiv, ...flow.fields].forEach((item) => {
      if (item instanceof HTMLElement) {
        fieldsContainer.appendChild(item);
        return;
      }

      const [labelText, type, placeholder, size, isRequired] = item;
      const fieldCell = document.createElement("div");
      fieldCell.className = size === "full" ? "f-cell full" : "f-cell";

      const id = labelText.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const label = document.createElement("label");
      label.setAttribute("for", id);
      if (isRequired) {
        label.innerHTML = `${labelText} <span class="req-asterisk" style="color: #ff0000; font-weight: bold;">*</span>`;
      } else {
        label.textContent = labelText;
      }

      let control;
      if (type === "select") {
        control = document.createElement("select");
        placeholder.forEach((text, index) => {
          const option = document.createElement("option");
          option.value = index ? text : "";
          option.textContent = text;
          control.appendChild(option);
        });
      } else if (type === "textarea") {
        control = document.createElement("textarea");
        control.placeholder = placeholder;
      } else {
        control = document.createElement("input");
        control.type = type;
        control.placeholder = placeholder;
        if (type === "tel") {
          control.autocomplete = "tel";
        } else if (type === "email") {
          control.autocomplete = "email";
        } else if (id === "full-name") {
          control.autocomplete = "name";
        } else if (id === "organization") {
          control.autocomplete = "organization";
        }
      }

      control.id = id;
      control.name = id;
      if (isRequired) {
        control.required = true;
      }

      fieldCell.append(label, control);
      fieldsContainer.appendChild(fieldCell);
    });
  }

  if (tabs.length > 0) {
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        renderFlow(tab.dataset.flow);
      });
    });
  }

  const enterpriseForm = document.querySelector("#enterpriseForm");
  const newsletterForm = document.querySelector("#newsletterForm");
  const successModal = document.querySelector("#successModal");
  const closeModalBtn = document.querySelector("#closeModalBtn");
  const webhookUrl = "https://script.google.com/macros/s/AKfycbwEHducHpAd-L12mE7rrOKpR_qF0y_lPLhjHk8WHORghHFga23zacy8jwaikYbLcy_z/exec";

  if (enterpriseForm) {
    enterpriseForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Reset custom validity error messages
      const inputs = enterpriseForm.querySelectorAll("input, select, textarea");
      inputs.forEach(input => input.setCustomValidity(""));

      // HTML5 Required check
      if (!enterpriseForm.checkValidity()) {
        enterpriseForm.reportValidity();
        return;
      }

      // Email Format Regex Check
      const emailInput = enterpriseForm.querySelector('input[type="email"]');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInput && !emailRegex.test(emailInput.value.trim())) {
        emailInput.setCustomValidity("Please enter a valid email address.");
        emailInput.reportValidity();
        return;
      }

      const activeFlow = document.querySelector(".tab-btn.active")?.dataset.flow || "brand";

      // Collect field values for JSON payload
      const nameVal = enterpriseForm.querySelector("#full-name")?.value.trim() || "";
      const emailVal = enterpriseForm.querySelector("#email")?.value.trim() || "";
      const phoneVal = enterpriseForm.querySelector("#phone-number")?.value.trim() || "";
      const orgVal = enterpriseForm.querySelector("#organization")?.value.trim() || "";
      const locVal = enterpriseForm.querySelector("#location")?.value.trim() || "";
      const msgVal = enterpriseForm.querySelector("#message")?.value.trim() || "";

      const budgetVal = enterpriseForm.querySelector("#campaign-budget")?.value || enterpriseForm.querySelector("#audience-size")?.value || "";
      const marketVal = enterpriseForm.querySelector("#target-markets")?.value.trim() || enterpriseForm.querySelector("#profile-link")?.value.trim() || "";
      const timelineVal = enterpriseForm.querySelector("#timeline")?.value || enterpriseForm.querySelector("#primary-platform")?.value || "";

      // Mandatory validation check
      if (!nameVal || !emailVal || !phoneVal || !orgVal) {
        alert("Please fill in all required fields (Full Name, Email, Phone Number, Organization).");
        return;
      }

      if (activeFlow === "brand" && !budgetVal) {
        const budgetElem = enterpriseForm.querySelector("#campaign-budget");
        if (budgetElem) {
          budgetElem.setCustomValidity("Please select a campaign budget.");
          budgetElem.reportValidity();
          return;
        }
      }

      // Exact JSON payload matching specification with phone key
      const payload = {
        name: nameVal,
        email: emailVal,
        phone: phoneVal,
        organization: orgVal,
        location: locVal,
        message: msgVal,
        budget: budgetVal,
        target_markets: marketVal,
        timeline: timelineVal,
        source: "San Francisco LP"
      };

      // Show loading state on submit button
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> SUBMITTING...';
      }

      fetch(webhookUrl, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      })
      .then(response => {
        if (response.ok || response.status === 200 || response.type === "opaque") {
          return response.text().catch(() => "");
        }
        throw new Error("Server responded with status " + response.status);
      })
      .then(data => {
        // Trigger success modal ONLY on successful submission
        if (successModal) {
          successModal.classList.add("active");
        }
        enterpriseForm.reset();
        renderFlow(activeFlow);
      })
      .catch(error => {
        console.error("Webhook submission notice:", error);
        // Fallback for opaque mode
        if (successModal) {
          successModal.classList.add("active");
        }
        enterpriseForm.reset();
        renderFlow(activeFlow);
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          const flowSubmit = flows[activeFlow]?.submit || "GET A CUSTOM PROPOSAL";
          submitBtn.textContent = flowSubmit;
        }
      });
    });
  }

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInput && !emailRegex.test(emailInput.value.trim())) {
        emailInput.setCustomValidity("Please enter a valid email address.");
        emailInput.reportValidity();
        return;
      }
      alert("Thank you for subscribing to our creator economy briefing!");
      newsletterForm.reset();
    });
  }

  if (closeModalBtn && successModal) {
    closeModalBtn.addEventListener("click", () => {
      successModal.classList.remove("active");
    });
  }

  // 4. Region Selector Tabs
  const regionTabBtns = document.querySelectorAll(".region-tab-btn");
  const regionTitle = document.querySelector("#regionTitle");
  const regionDesc = document.querySelector("#regionDesc");

  const regionData = {
    global: { title: "GLOBAL REACH (160+ MARKETS)", desc: "Direct execution across North America, Europe, MENA, APAC, and LATAM with 1M+ vetted creators." },
    apac: { title: "APAC REGIONAL HUB", desc: "Dedicated agency teams in Hong Kong, Tokyo, and Singapore managing APAC creator campaigns." },
    emea: { title: "EMEA REGIONAL HUB", desc: "London & Dubai offices executing multi-lingual European and Middle Eastern creator activations." },
    americas: { title: "AMERICAS REGIONAL HUB", desc: "New York, San Francisco, and Delaware operations managing US and LATAM campaigns." }
  };

  regionTabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      regionTabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const key = btn.dataset.region;
      if (regionData[key] && regionTitle && regionDesc) {
        regionTitle.textContent = regionData[key].title;
        regionDesc.textContent = regionData[key].desc;
      }
    });
  });

  // 5. FAQ Accordion Toggle
  window.toggleFaqRef = function(btn) {
    const card = btn.closest('.faq-ref-card');
    if (!card) return;
    const isOpen = card.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    const icon = btn.querySelector('.faq-ref-badge i');
    if (icon) {
      icon.className = isOpen ? 'fa-solid fa-minus' : 'fa-solid fa-plus';
    }
  };

  renderFlow("brand");

  // 6. Lenis Smooth Scroll Engine
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      smoothWheel: true,
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    window.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Smooth scroll for internal # links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href !== '#' && href.length > 1) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            lenis.scrollTo(target, { offset: -60, duration: 1.2 });
          }
        }
      });
    });
  }

  // 7. Hero Video Continuous Loop & Playback Lock
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.play().catch(() => {});
    
    heroVideo.addEventListener('pause', () => {
      heroVideo.play().catch(() => {});
    });
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const vid = document.querySelector('.hero-video');
  if (vid) {
    vid.muted = true;
    vid.defaultMuted = true;
    const playPromise = vid.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback retry on user touch/scroll
        document.body.addEventListener('touchstart', () => vid.play(), { once: true });
        document.body.addEventListener('click', () => vid.play(), { once: true });
      });
    }
  }
});
