document.addEventListener("DOMContentLoaded", () => {
  /* ================= ELEMENTS ================= */

  const header = document.querySelector(".header");
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  const themeToggle = document.getElementById("theme-toggle");
  const yearElement = document.getElementById("year");

  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

  const sections = document.querySelectorAll("main section[id]");

  /* ================= MOBILE NAVIGATION ================= */

  function closeMenu() {
    if (!menuToggle || !navMenu) return;

    navMenu.classList.remove("open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");

    menuToggle.innerHTML =
      '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
  }

  function openMenu() {
    if (!menuToggle || !navMenu) return;

    navMenu.classList.add("open");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");

    menuToggle.innerHTML =
      '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
  }

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.contains("open");

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      if (!navMenu.classList.contains("open")) return;

      const clickedInsideMenu = navMenu.contains(event.target);
      const clickedToggle = menuToggle.contains(event.target);

      if (!clickedInsideMenu && !clickedToggle) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 800) {
        closeMenu();
      }
    });
  }

  /* ================= STICKY HEADER ================= */

  function updateHeader() {
    if (!header) return;

    header.classList.toggle("scrolled", window.scrollY > 20);
  }

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true,
  });

  /* ================= THEME TOGGLE ================= */

  const themeStorageKey = "rishi-sir-theme";

  function getSavedTheme() {
    try {
      const savedTheme = localStorage.getItem(themeStorageKey);

      if (savedTheme === "dark" || savedTheme === "light") {
        return savedTheme;
      }
    } catch (error) {
      // Continue with the default theme if storage is unavailable.
    }

    return "light";
  }

  function applyTheme(theme) {
    const selectedTheme = theme === "dark" ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", selectedTheme);

    if (!themeToggle) return;

    const isDark = selectedTheme === "dark";

    themeToggle.innerHTML = isDark
      ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-moon" aria-hidden="true"></i>';

    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode",
    );

    themeToggle.setAttribute(
      "title",
      isDark ? "Switch to light mode" : "Switch to dark mode",
    );

    try {
      localStorage.setItem(themeStorageKey, selectedTheme);
    } catch (error) {
      // Theme switching still works for the current page.
    }
  }

  applyTheme(getSavedTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");

      applyTheme(currentTheme === "dark" ? "light" : "dark");
    });
  }

  /* ================= SCROLL REVEAL ================= */

  const revealItems = document.querySelectorAll(".reveal");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => {
      item.classList.add("visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");

            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px",
      },
    );

    revealItems.forEach((item) => {
      revealObserver.observe(item);
    });
  }

  /* ================= ACTIVE NAVIGATION ================= */

  function setActiveLink(id) {
    navLinks.forEach((link) => {
      const linkTarget = link.getAttribute("href");

      const isActive = linkTarget === `#${id}`;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  if ("IntersectionObserver" in window && sections.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleSections.length > 0) {
          setActiveLink(visibleSections[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.15, 0.3, 0.5],
      },
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  /* ================= SMOOTH INTERNAL LINKS ================= */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });

      closeMenu();
    });
  });

  /* ================= FOOTER YEAR ================= */

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* ================= CONTACT FORM ================= */

  const contactForm = document.getElementById("contact-form");
  const submitButton = document.getElementById("submit-button");
  const formStatus = document.getElementById("form-status");

  if (contactForm && submitButton && formStatus) {
    const originalButtonContent = submitButton.innerHTML;

    function showFormStatus(message, type) {
      formStatus.textContent = message;

      formStatus.classList.remove("success", "error");

      if (type) {
        formStatus.classList.add(type);
      }
    }

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!contactForm.reportValidity()) {
        return;
      }

      const accessKey = contactForm
        .querySelector('input[name="access_key"]')
        ?.value.trim();

      if (!accessKey || accessKey === "YOUR_WEB3FORMS_ACCESS_KEY") {
        showFormStatus(
          "The contact form has not been configured yet. Please contact us by email.",
          "error",
        );

        return;
      }

      const originalButtonText = originalButtonContent;

      submitButton.disabled = true;

      submitButton.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Sending...';

      showFormStatus("", "");

      try {
        const formData = new FormData(contactForm);

        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to send your message.");
        }

        showFormStatus(
          "Thank you! Your message has been sent successfully.",
          "success",
        );

        contactForm.reset();
      } catch (error) {
        console.error("Contact form error:", error);

        showFormStatus(
          "Your message could not be sent. Please try again or contact us directly by email.",
          "error",
        );
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      }
    });
  }
  /* ================= STUDENT FEEDBACK: SUPABASE ================= */

  const SUPABASE_URL = "https://muqecipmlxymqtvvcimr.supabase.co";
  const SUPABASE_KEY = "sb_publishable_qwkQN7f2io7A3syaFlGIig_0sh45iKh";

  const feedbackForm = document.getElementById("feedback-form");
  const feedbackSubmit = document.getElementById("feedback-submit");
  const feedbackStatus = document.getElementById("feedback-status");
  const reviewsList = document.getElementById("reviews-list");
  const reviewsCount = document.getElementById("reviews-count");

  const feedbackConfigured = () =>
    SUPABASE_URL.startsWith("https://") &&
    SUPABASE_URL.includes(".supabase.co") &&
    SUPABASE_KEY.length > 20 &&
    !SUPABASE_URL.includes("YOUR_SUPABASE") &&
    !SUPABASE_KEY.includes("YOUR_SUPABASE");

  const feedbackHeaders = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
  };

  function feedbackMessage(message, type = "") {
    if (!feedbackStatus) return;

    feedbackStatus.textContent = message;
    feedbackStatus.classList.remove("success", "error");

    if (type) feedbackStatus.classList.add(type);
  }

  async function loadApprovedFeedback() {
    if (!reviewsList || !reviewsCount) return;

    if (!feedbackConfigured()) {
      reviewsCount.textContent = "Not connected";
      reviewsList.textContent =
        "Student reviews will appear here after Supabase is connected.";
      return;
    }

    try {
      const url =
        `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/student_feedback` +
        "?select=id,student_name,course,rating,feedback,created_at" +
        "&approved=eq.true&order=created_at.desc&limit=12";

      const response = await fetch(url, {
        headers: feedbackHeaders,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Request failed: ${response.status}`);
      }

      const reviews = await response.json();

      reviewsList.replaceChildren();

      reviewsCount.textContent = `${reviews.length} ${reviews.length === 1 ? "review" : "reviews"}`;

      if (reviews.length === 0) {
        reviewsList.textContent = "No approved reviews yet.";
        return;
      }

      reviews.forEach((review) => {
        const card = document.createElement("article");
        card.className = "review-card";

        const heading = document.createElement("h4");
        heading.textContent = review.student_name;

        const course = document.createElement("p");
        course.textContent = review.course;

        const stars = document.createElement("p");
        stars.className = "review-stars";
        stars.textContent =
          "★".repeat(Number(review.rating)) +
          "☆".repeat(5 - Number(review.rating));

        const message = document.createElement("p");
        message.className = "review-text";
        message.textContent = review.feedback;

        card.append(heading, course, stars, message);
        reviewsList.append(card);
      });
    } catch (error) {
      console.error("Feedback loading error:", error);

      reviewsCount.textContent = "Unavailable";
      reviewsList.textContent =
        "Reviews could not be loaded. Please try again later.";
    }
  }

  if (feedbackForm && feedbackSubmit) {
    feedbackForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      feedbackMessage();

      if (!feedbackForm.reportValidity()) return;

      if (!feedbackConfigured()) {
        feedbackMessage(
          "Please configure your Supabase credentials in script.js.",
          "error",
        );
        return;
      }

      const formData = new FormData(feedbackForm);

      const studentName = String(formData.get("student_name") || "").trim();

      const course = String(formData.get("course") || "");
      const rating = Number(formData.get("rating"));

      const feedback = String(formData.get("feedback") || "").trim();

      if (
        studentName.length < 2 ||
        studentName.length > 80 ||
        !["JEE", "NEET", "Board Exams", "Other"].includes(course) ||
        !Number.isInteger(rating) ||
        rating < 1 ||
        rating > 5 ||
        feedback.length < 10 ||
        feedback.length > 1200
      ) {
        feedbackMessage(
          "Please check your name, course, rating, and feedback.",
          "error",
        );
        return;
      }

      feedbackSubmit.disabled = true;
      const originalButton = feedbackSubmit.innerHTML;

      feedbackSubmit.textContent = "Submitting...";
      feedbackMessage();

      try {
        const response = await fetch(
          `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/student_feedback`,
          {
            method: "POST",
            headers: {
              ...feedbackHeaders,
              Prefer: "return=minimal",
            },
            body: JSON.stringify({
              student_name: studentName,
              course,
              rating,
              feedback,
              approved: false,
            }),
          },
        );

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error.message || "Submission failed.");
        }

        feedbackForm.reset();

        feedbackMessage(
          "Thank you! Your feedback has been submitted for approval.",
          "success",
        );
      } catch (error) {
        console.error("Feedback submission error:", error);

        feedbackMessage(
          "Your feedback could not be submitted. Please try again.",
          "error",
        );
      } finally {
        feedbackSubmit.disabled = false;
        feedbackSubmit.innerHTML = originalButton;
      }
    });
  }

  loadApprovedFeedback();
});
