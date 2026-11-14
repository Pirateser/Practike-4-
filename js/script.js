"use strict";

/* 
   1. Диагностика (ПР №3)
  */
const preparedComponents = document.querySelectorAll("[data-js]");
const status = document.querySelector("[data-js-status]");

console.log(`Подготовлено компонентов: ${preparedComponents.length}`);

if (status) {
  status.textContent = `JavaScript подключён, найдено компонентов: ${preparedComponents.length}`;
  status.classList.add("status--ready");
}

/* =
   2. Меню (бургер)
    */
function initMenu() {
  const header = document.querySelector('[data-js="menu"]');
  if (!header) return;

  const toggle = header.querySelector("[data-menu-toggle]");
  const mobileNav = header.querySelector("#mobile-nav");
  if (!toggle || !mobileNav) return;

  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    toggle.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
    mobileNav.hidden = !isOpen;
  });

  // Закрытие по клику вне меню
  document.addEventListener("click", (event) => {
    if (!header.contains(event.target) && header.classList.contains("is-open")) {
      header.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      mobileNav.hidden = true;
    }
  });

  // Закрытие по Esc
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && header.classList.contains("is-open")) {
      header.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      mobileNav.hidden = true;
      toggle.focus();
    }
  });
}

/*
   3. Табы
   */
function initTabs() {
  const section = document.querySelector('[data-js="tabs"]');
  if (!section) return;

  const buttons = Array.from(section.querySelectorAll(".tab-button"));
  const panels = Array.from(section.querySelectorAll(".tab-panel"));

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.tab;

      buttons.forEach((btn) => {
        const isActive = btn === button;
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
      });

      panels.forEach((panel) => {
        panel.hidden = panel.id !== targetId;
      });
    });
  });
}

/* 
   4. Аккордеон (одновременно открыт только один)
   */
function initAccordion() {
  const root = document.querySelector('[data-js="accordion"]');
  if (!root) return;

  const items = Array.from(root.querySelectorAll(".accordion-item"));

  items.forEach((item) => {
    const trigger = item.querySelector("[data-accordion-trigger]");
    const content = item.querySelector("[data-accordion-content]");
    if (!trigger || !content) return;

    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      // Закрыть все
      items.forEach((other) => {
        other.classList.remove("is-open");
        const t = other.querySelector("[data-accordion-trigger]");
        const c = other.querySelector("[data-accordion-content]");
        if (t) t.setAttribute("aria-expanded", "false");
        if (c) c.hidden = true;
      });

      // Открыть выбранный, если он был закрыт
      if (!isOpen) {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
        content.hidden = false;
      }
    });
  });
}

/* 
   5. Слайдер
   */
function initSlider() {
  const slider = document.querySelector("[data-slider]");
  if (!slider) return;

  const track = slider.querySelector("[data-slider-track]");
  const slides = Array.from(track.children);
  const prevBtn = slider.querySelector("[data-slider-prev]");
  const nextBtn = slider.querySelector("[data-slider-next]");
  const dots = Array.from(slider.querySelectorAll(".slider__dot"));
  const counter = slider.querySelector("[data-slider-counter]");
  const total = slider.querySelector("[data-slider-total]");

  let current = 0;
  const totalSlides = slides.length;
  if (total) total.textContent = totalSlides;

  function update(index) {
    current = (index + totalSlides) % totalSlides; // цикл
    track.style.transform = `translateX(-${current * 100}%)`;

    dots.forEach((dot, i) => {
      const active = i === current;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-selected", active ? "true" : "false");
    });

    if (counter) counter.textContent = current + 1;
  }

  prevBtn?.addEventListener("click", () => update(current - 1));
  nextBtn?.addEventListener("click", () => update(current + 1));
  dots.forEach((dot, i) => dot.addEventListener("click", () => update(i)));

  update(0);
}

/* 
   6. Модальное окно
   */
function initModal() {
  const modal = document.querySelector("[data-modal]");
  if (!modal) return;

  const openBtn = document.querySelector("[data-open-modal]");
  const closeBtn = modal.querySelector("[data-modal-close]");

  if (openBtn) {
    openBtn.addEventListener("click", () => {
      if (typeof modal.showModal === "function") {
        modal.showModal();
      } else {
        modal.setAttribute("open", "");
      }
    });
  }

  // Возврат фокуса при закрытии
  modal.addEventListener("close", () => {
    if (openBtn) openBtn.focus();
  });

  // Кнопка «Закрыть» внутри dialog
  if (closeBtn) {
    closeBtn.addEventListener("click", () => modal.close());
  }

  // Клик по фону (backdrop)
  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.close();
  });
}

/*
   7. Cookies
   */
function initCookies() {
  const block = document.querySelector('[data-js="cookies"]');
  if (!block) return;

  const acceptBtn = block.querySelector("[data-cookies-accept]");
  if (acceptBtn) {
    acceptBtn.addEventListener("click", () => {
      block.hidden = true;
    });
  }
}

/*
   8. Форма с валидацией
   */
function initForm() {
  const form = document.querySelector("[data-form]");
  if (!form) return;

  const name = form.querySelector('[data-field="name"]');
  const email = form.querySelector('[data-field="email"]');
  const consent = form.querySelector('[data-field="consent"]');
  const success = form.querySelector("[data-form-success]");

  const setError = (field, message) => {
    const box = form.querySelector(`[data-error="${field}"]`);
    if (box) box.textContent = message;
  };

  const clearErrors = () => {
    form.querySelectorAll("[data-error]").forEach((el) => (el.textContent = ""));
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors();
    if (success) success.hidden = true;

    let valid = true;

    if (!name.value.trim()) {
      setError("name", "Введите имя");
      valid = false;
    }

    const emailValue = email.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValue) {
      setError("email", "Введите e-mail");
      valid = false;
    } else if (!emailPattern.test(emailValue)) {
      setError("email", "Некорректный e-mail");
      valid = false;
    }

    if (!consent.checked) {
      setError("consent", "Нужно согласие на обработку данных");
      valid = false;
    }

    if (valid) {
      form.reset();
      if (success) success.hidden = false;
    }
  });
}

/* 
   9. Инициализация
    */
document.addEventListener("DOMContentLoaded", () => {
  initMenu();
  initTabs();
  initAccordion();
  initSlider();
  initModal();
  initCookies();
  initForm();
});
