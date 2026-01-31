document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("[data-nav]");
  const toggle = nav?.querySelector(".nav-toggle");
  const navLinks = nav?.querySelector(".nav-links");
  const submenuParent = nav?.querySelector(".has-submenu");
  const submenuToggle = submenuParent?.querySelector(".submenu-toggle");
  const submenu = submenuParent?.querySelector(".submenu");

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open", !expanded);
      document.body.classList.toggle("scroll-lock", !expanded);
    });
  }

  if (submenuToggle && submenu) {
    const closeSubmenu = () => {
      submenuParent?.setAttribute("aria-expanded", "false");
      submenuToggle.setAttribute("aria-expanded", "false");
      submenuParent?.classList.remove("dropdown-open", "is-active");
    };

    submenuToggle.addEventListener("click", (event) => {
      event.preventDefault();
      const parentIsOpen = submenuParent?.classList.toggle("dropdown-open");
      submenuToggle.setAttribute("aria-expanded", String(parentIsOpen));
      submenuParent?.setAttribute("aria-expanded", String(parentIsOpen));
      submenuParent?.classList.toggle("is-active", Boolean(parentIsOpen));
    });

    document.addEventListener("click", (event) => {
      if (!submenuParent?.contains(event.target)) {
        closeSubmenu();
      }
    });

    navLinks?.querySelectorAll("a").forEach((link) => {
      if (link.closest(".has-submenu")) return;
      link.addEventListener("click", () => {
        closeSubmenu();
      });
    });

    submenu.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeSubmenu();
        submenuToggle.focus();
      }
    });
  }

  const faqList = document.querySelector("[data-faq]");
  if (faqList) {
    faqList.querySelectorAll(".faq-item").forEach((item) => {
      item.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");
        faqList.querySelectorAll(".faq-item").forEach((other) => {
          other.classList.remove("is-open");
          other.setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          item.classList.add("is-open");
          item.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  // Scrollspy for Terms/Privacy/Refund pages
  const tosSection = document.querySelector(".tos");
  if (tosSection) {
    const blocks = Array.from(document.querySelectorAll(".tos-block[id]"));
    const indexLinks = Array.from(document.querySelectorAll(".tos-index a[href^='#']"));

    // Smooth scroll for index clicks
    indexLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const targetId = link.getAttribute("href");
        if (!targetId) return;
        const targetEl = document.querySelector(targetId);
        if (!targetEl) return;
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", targetId);
      });
    });

    // Observer to toggle active link
    const linkById = new Map(indexLinks.map((a) => [a.getAttribute("href"), a]));

    const setActive = (id) => {
      indexLinks.forEach((a) => a.classList.remove("is-active"));
      const link = linkById.get(`#${id}`);
      if (link) {
        link.classList.add("is-active");
        // Keep the active link visible inside the sidebar list
        link.scrollIntoView({ block: "nearest", inline: "nearest" });
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        // Prefer the entry with highest visibility; fallback to the nearest to top
        const visible = entries.filter((en) => en.isIntersecting);
        let candidate = null;
        if (visible.length) {
          candidate = visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        } else {
          candidate = entries.sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0];
        }
        if (candidate?.target?.id) setActive(candidate.target.id);
      },
      {
        root: null,
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    blocks.forEach((el) => observer.observe(el));
  }
});
