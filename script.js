const menuToggle = document.querySelector("#menu-toggle");
const nav = document.querySelector("#nav-principal");
const form = document.querySelector("#form-fale_conosco");
const formStatus = document.querySelector("#form-status");
const submitButton = document.querySelector("#botao-fale_conosco");
const faqItems = Array.from(document.querySelectorAll(".faq-item"));
const impactoCarousel = document.querySelector("[data-impacto-carousel]");
const imagens = document.querySelectorAll(".detalhe-imagem img");
const carrossel_fotos = document.querySelectorAll(".carrossel-fotos span");
const container = document.querySelector(".detalhe-imagem");

let index = 0;
let intervalo;

/* ===== MENU TOGGLE ===== */

if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        nav.classList.toggle("is-open", !isOpen);
    });

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            menuToggle.setAttribute("aria-expanded", "false");
            nav.classList.remove("is-open");
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && nav.classList.contains("is-open")) {
            menuToggle.setAttribute("aria-expanded", "false");
            nav.classList.remove("is-open");
            menuToggle.focus();
        }
    });
}

/* ===== FAQ ACCORDION ===== */

faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
        if (!item.open) {
            return;
        }

        faqItems.forEach((otherItem) => {
            if (otherItem !== item) {
                otherItem.open = false;
            }
        });
    });
});

/* ===== IMPACTO CAROUSEL ===== */

if (impactoCarousel) {
    const impactoSlides = Array.from(impactoCarousel.querySelectorAll("[data-impacto-slide]"));
    const impactoDots = Array.from(document.querySelectorAll("[data-impacto-dot]"));
    const prevButton = impactoCarousel.querySelector("[data-impacto-prev]");
    const nextButton = impactoCarousel.querySelector("[data-impacto-next]");
    let activeImpactoIndex = 0;

    const syncImpacto = (nextIndex) => {
        activeImpactoIndex = (nextIndex + impactoSlides.length) % impactoSlides.length;

        impactoSlides.forEach((slide, index) => {
            const isActive = index === activeImpactoIndex;
            slide.classList.toggle("is-active", isActive);
            slide.setAttribute("aria-hidden", String(!isActive));
        });

        impactoDots.forEach((dot, index) => {
            const isActive = index === activeImpactoIndex;
            dot.classList.toggle("is-active", isActive);
            dot.setAttribute("aria-current", String(isActive));
        });
    };

    prevButton?.addEventListener("click", () => {
        syncImpacto(activeImpactoIndex - 1);
    });

    nextButton?.addEventListener("click", () => {
        syncImpacto(activeImpactoIndex + 1);
    });

    impactoDots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            syncImpacto(index);
        });
    });

    syncImpacto(0);
}

/* ===== FORM ===== */

if (form && formStatus && submitButton) {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        formStatus.className = "form-status";

        if (!form.checkValidity()) {
            form.reportValidity();
            formStatus.textContent = "Revise os campos obrigatórios antes de enviar.";
            formStatus.classList.add("is-error");
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = "Enviando...";
        formStatus.textContent = "Preparando sua mensagem...";

        window.setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = "Enviar";
            form.reset();
            formStatus.textContent =
                "Fluxo validado com sucesso. Agora basta conectar este formulário ao canal oficial de envio.";
            formStatus.classList.add("is-success");
        }, 1200);
    });
}

/* ===== HERO SLIDER ===== */

const heroSlides = Array.from(document.querySelectorAll("[data-hero-slide]"));
const heroDots = Array.from(document.querySelectorAll("[data-hero-dot]"));
const heroPrev = document.querySelector("[data-hero-prev]");
const heroNext = document.querySelector("[data-hero-next]");
const heroLiveRegion = document.querySelector(".hero-live-region");
const heroSlider = document.querySelector("[data-hero-slider]");
let heroIndex = 0;
let heroTimer = null;
let heroPaused = false;

function goToHeroSlide(index) {
    heroIndex = (index + heroSlides.length) % heroSlides.length;

    heroSlides.forEach((s, i) => {
        const isActive = i === heroIndex;
        s.classList.toggle("is-active", isActive);
        s.setAttribute("aria-hidden", String(!isActive));

        s.querySelectorAll("a, button").forEach((el) => {
            el.setAttribute("tabindex", isActive ? "0" : "-1");
        });
    });

    heroDots.forEach((d, i) => {
        const isActive = i === heroIndex;
        d.classList.toggle("is-active", isActive);
        d.setAttribute("aria-selected", String(isActive));
    });

    if (heroLiveRegion) {
        heroLiveRegion.textContent = "Slide " + (heroIndex + 1) + " de " + heroSlides.length;
    }
}

function startHeroAuto() {
    stopHeroAuto();
    if (!heroPaused) {
        heroTimer = setInterval(() => goToHeroSlide(heroIndex + 1), 5000);
    }
}

function stopHeroAuto() {
    if (heroTimer) {
        clearInterval(heroTimer);
        heroTimer = null;
    }
}

if (heroSlides.length > 1) {
    heroPrev?.addEventListener("click", () => { goToHeroSlide(heroIndex - 1); startHeroAuto(); });
    heroNext?.addEventListener("click", () => { goToHeroSlide(heroIndex + 1); startHeroAuto(); });

    heroDots.forEach((dot, i) => {
        dot.addEventListener("click", () => { goToHeroSlide(i); startHeroAuto(); });
    });

    if (heroSlider) {
        heroSlider.addEventListener("mouseenter", () => { heroPaused = true; stopHeroAuto(); });
        heroSlider.addEventListener("mouseleave", () => { heroPaused = false; startHeroAuto(); });
        heroSlider.addEventListener("focusin", () => { heroPaused = true; stopHeroAuto(); });
        heroSlider.addEventListener("focusout", () => { heroPaused = false; startHeroAuto(); });
    }

    goToHeroSlide(0);
    startHeroAuto();
}

/* ===== BACK TO TOP ===== */

const backToTop = document.querySelector("#back-to-top");
if (backToTop) {
    window.addEventListener("scroll", () => {
        backToTop.classList.toggle("is-visible", window.scrollY > 400);
    }, { passive: true });
    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/* ===== Carrosel Detalhes ===== */

function mostrarImagem(i) {

    imagens.forEach(img => img.classList.remove("ativa"));
    carrossel_fotos.forEach(dot => dot.classList.remove("ativo"));

    imagens[i].classList.add("ativa");
    carrossel_fotos[i].classList.add("ativo");

    index = i;
}

function iniciarAutoPlay() {
    intervalo = setInterval(() => {
        let proximo = (index + 1) % imagens.length;
        mostrarImagem(proximo);
    }, 3000);
}

function pararAutoPlay() {
    clearInterval(intervalo);
}

if (imagens.length > 0 && container && carrossel_fotos.length > 0) {

    carrossel_fotos.forEach((fotos, i) => {
        fotos.addEventListener("click", () => {
            pararAutoPlay();
            mostrarImagem(i);
            iniciarAutoPlay();
        });
    });

    container.addEventListener("mouseenter", pararAutoPlay);
    container.addEventListener("mouseleave", iniciarAutoPlay);

    iniciarAutoPlay();
}

const modal = document.getElementById("modal-redirect");
const btnContinuar = document.getElementById("btn-continuar");

const btnDoar = document.querySelector(".btn-doar");
const btnVoluntario = document.querySelector(".btn-voluntario");

let linkDestino = "#";

function abrirModal(link) {
    if (!modal) return;
    linkDestino = link;
    modal.classList.add("ativo");
}

btnDoar?.addEventListener("click", () => {
    abrirModal("https://exemplo-doacao.com");
});

btnVoluntario?.addEventListener("click", () => {
    abrirModal("https://exemplo-voluntario.com");
});

btnContinuar?.addEventListener("click", () => {
    window.open(linkDestino, "_blank");
    modal.classList.remove("ativo");
});

modal?.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.remove("ativo");
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        modal?.classList.remove("ativo");
    }
});