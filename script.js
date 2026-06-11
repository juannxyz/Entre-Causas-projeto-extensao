const menuToggle = document.querySelector("#menu-toggle");
const nav = document.querySelector("#nav-principal");
const header = document.querySelector("#cabecalho");
const navHoverZone = document.querySelector("#nav-hover-zone");
const heroSection = document.querySelector("#hero");
const form = document.querySelector("#form-fale_conosco");
const formStatus = document.querySelector("#form-status");
const submitButton = document.querySelector("#botao-fale_conosco");
const faqItems = Array.from(document.querySelectorAll(".faq-item"));
const impactoCarousel = document.querySelector("[data-impacto-carousel]");

let imagens;
let carrossel_fotos;
let container;

let index = 0;
let intervalo;
let navHeaderHovered = false;
let navZoneHovered = false;
const desktopHoverNavMedia = window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine)");
let navInitialRevealActive = desktopHoverNavMedia.matches && window.scrollY <= 8;

if (navInitialRevealActive) {
    window.setTimeout(() => {
        navInitialRevealActive = false;
        syncFloatingNav();
    }, 1600);
}

function syncFloatingNav() {
    if (!header || !heroSection) {
        return;
    }

    const hasPassedHero = window.scrollY > heroSection.offsetHeight - header.offsetHeight;
    const canHideNav = desktopHoverNavMedia.matches;

    document.body.classList.toggle("hero-past", hasPassedHero);

    document.body.classList.toggle("nav-can-hide", canHideNav);

    if (!canHideNav && !navInitialRevealActive) {
        document.body.classList.remove("nav-reveal");
        return;
    }

    const menuIsOpen = menuToggle?.getAttribute("aria-expanded") === "true";
    const shouldReveal =
        navInitialRevealActive ||
        navHeaderHovered ||
        navZoneHovered ||
        menuIsOpen ||
        header.matches(":focus-within");
    document.body.classList.toggle("nav-reveal", shouldReveal);
}

/* ===== MENU TOGGLE ===== */

if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        nav.classList.toggle("is-open", !isOpen);
        syncFloatingNav();
    });

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            menuToggle.setAttribute("aria-expanded", "false");
            nav.classList.remove("is-open");
            syncFloatingNav();
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && nav.classList.contains("is-open")) {
            menuToggle.setAttribute("aria-expanded", "false");
            nav.classList.remove("is-open");
            menuToggle.focus();
            syncFloatingNav();
        }
    });
}

if (header && navHoverZone) {
    header.addEventListener("mouseenter", () => {
        navHeaderHovered = true;
        syncFloatingNav();
    });

    header.addEventListener("mouseleave", () => {
        navHeaderHovered = false;
        syncFloatingNav();
    });

    navHoverZone.addEventListener("mouseenter", () => {
        navZoneHovered = true;
        syncFloatingNav();
    });

    navHoverZone.addEventListener("mouseleave", () => {
        navZoneHovered = false;
        syncFloatingNav();
    });
}

window.addEventListener("scroll", syncFloatingNav, { passive: true });
window.addEventListener("resize", syncFloatingNav);
desktopHoverNavMedia.addEventListener?.("change", syncFloatingNav);
syncFloatingNav();

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
let heroTouchStartX = 0;
let heroTouchStartY = 0;
let heroTouchActive = false;

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
        heroSlider.addEventListener("touchstart", (event) => {
            const firstTouch = event.touches[0];
            if (!firstTouch) {
                return;
            }

            heroTouchStartX = firstTouch.clientX;
            heroTouchStartY = firstTouch.clientY;
            heroTouchActive = true;
            heroPaused = true;
            stopHeroAuto();
        }, { passive: true });

        heroSlider.addEventListener("touchend", (event) => {
            if (!heroTouchActive) {
                return;
            }

            const lastTouch = event.changedTouches[0];
            heroTouchActive = false;
            heroPaused = false;

            if (!lastTouch) {
                startHeroAuto();
                return;
            }

            const deltaX = lastTouch.clientX - heroTouchStartX;
            const deltaY = lastTouch.clientY - heroTouchStartY;
            const swipeThreshold = 45;

            if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
                goToHeroSlide(heroIndex + (deltaX < 0 ? 1 : -1));
            }

            startHeroAuto();
        }, { passive: true });

        heroSlider.addEventListener("touchcancel", () => {
            heroTouchActive = false;
            heroPaused = false;
            startHeroAuto();
        }, { passive: true });
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

const modal = document.getElementById("modal-redirect");
const btnContinuar = document.getElementById("btn-continuar");


let linkDestino = "#";

function abrirModal(link) {
    if (!modal) return;
    linkDestino = link;
    modal.classList.add("ativo");
}

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


/* ===== Criação de cards ===== */

const iconesCategorias = {
    Educacao: "fa-solid fa-graduation-cap",
    Solidariedade: "fa-solid fa-hand-holding-heart",
    Cultura: "fa-solid fa-people-group",
    Animais: "fa-solid fa-paw",
    MeioAmbiente: "fa-solid fa-leaf",
    Saude: "fa-solid fa-heart-pulse",
    Esporte: "fa-solid fa-futbol",
};

const nomesCategorias = {
    Educacao: "Educação",
    Solidariedade: "Solidariedade",
    Cultura: "Cultura",
    Animais: "Animais",
    MeioAmbiente: "Meio Ambiente",
    Saude: "Saúde",
    Esporte: "Esporte",
};

const lista_ongs = [
    {
        id: 1,
        nome: "Engenheiros sem Fronteiras",
        descricao: "Transformando conhecimento em impacto social por meio da engenharia, educação e sustentabilidade.",
        descricaoCompleta: "O Engenheiros sem Fronteiras - Núcleo Itapetininga utiliza conhecimentos da engenharia para promover melhorias para pessoas em situação de vulnerabilidade social, além de desenvolver projetos ambientais e educacionais. Entre as ações realizadas estão palestras em escolas, automação da irrigação da horta comunitária do IFSP e iniciativas de reaproveitamento de recursos hídricos.",
        categoriaPrincipal: "Educacao",
        categorias: ["Meio Ambiente", "Social"],
        local: "Instituto Federal de São Paulo - Campus Itapetininga",
        instagram: "https://instagram.com/esf_itapetininga",
        nome: "UIPA",
        descricao: "Organização voltada ao resgate, proteção e cuidado de animais.",
        descricaoCompleta: "A UIPA foi a ONG mais citada pelos respondentes da pesquisa. Atua no acolhimento e proteção de animais em situação de vulnerabilidade, sendo reconhecida pela população por seu trabalho em bairros como Vila Mazzei, Vale San Fernando, Chapadinha e Pacaembu.",
        categoriaPrincipal: "Animais",
        heroImagem: "./img/hero/ongs/uipa-capa.png",
        categorias: ["Proteção Animal"],
        local: "Vila Mazzei - Itapetininga/SP",
        instagram: "https://www.instagram.com/uipaitapetininga/",
        facebook: "",
        telefone: "(15) 3272-2111",
        mapa: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.689752794567!2d-48.07955829999999!3d-23.579583600000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c5cd4c9d112ddf%3A0x6cf2ec34d245baf5!2sUipa%20Itapetininga!5e0!3m2!1spt-BR!2sbr!4v1781130959957!5m2!1spt-BR!2sbr",
        imagens: [
            {
                src: "./img/cards/uipa/capa.png", alt: "Criancas participando de atividade educativa."
            },
            {
                src: "./img/cards/uipa/01.png", alt: "Criancas em atividade coletiva com educadores."
            },
            {
                src: "./img/cards/uipa/02.jpg", alt: "Criancas em atividade coletiva com educadores."
            }
        ]
    },

    {
        id: 2,
        nome: "APAE",
        descricao: "Instituição dedicada ao atendimento e inclusão de pessoas com deficiência.",
        descricaoCompleta: "A APAE foi apontada pelos participantes como uma organização essencial para diversas famílias da cidade. Desenvolve atividades de atendimento, inclusão social e apoio a pessoas com deficiência, dependendo de recursos externos e do apoio da comunidade.",
        categoriaPrincipal: "Solidariedade",
        heroImagem: "./img/hero/ongs/apae-capa.png",
        categorias: ["Inclusão Social", "Assistência Social"],
        local: "Vila Prado - Itapetininga/SP",
        instagram: "https://www.instagram.com/apaeitapetininga/",
        facebook: "",
        telefone: "(15) 3376-9444",
        mapa: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.0404692453076!2d-48.03496692489078!3d-23.56698997879596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c5cc51d680140b%3A0xe133dd5985960d92!2sAPAE%20-%20Associa%C3%A7%C3%A3o%20de%20Pais%20e%20Amigos%20dos%20Excepcionais!5e0!3m2!1spt-BR!2sbr!4v1781131064988!5m2!1spt-BR!2sbr",
        imagens: [
            {
                src: "./img/cards/apae/capa.png", alt: "Criancas participando de atividade educativa."
            },
            {
                src: "./img/cards/apae/01.png", alt: "Criancas em atividade coletiva com educadores."
            },
            {
                src: "./img/cards/apae/02.png", alt: "Criancas em atividade coletiva com educadores."
            }
        ]
    },

    {
        id: 3,
        nome: "Instituição Nosso Lar",
        descricao: "Acolhimento e apoio a crianças e adolescentes.",
        descricaoCompleta: "A Instituição Nosso Lar atua no atendimento de crianças e adolescentes, mantendo suas atividades por meio de doações e recursos arrecadados em eventos beneficentes. Os respondentes destacaram a necessidade de maior visibilidade para garantir a continuidade de suas ações.",
        categoriaPrincipal: "Solidariedade",
        heroImagem: "./img/hero/ongs/nosso-lar-capa.png",
        categorias: ["Assistência Social", "Educação"],
        local: "R. João Evangelista, 646 - Centro - Itapetininga/SP",
        instagram: "https://instagram.com/instituicao_nossolar",
        facebook: "",
        telefone: "(15) 99683-5275",
        mapa: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.520333015233!2d-48.04011279999998!3d-23.585664899999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c5cc61f99e1163%3A0x82001c60c2b027bc!2sR.%20Jo%C3%A3o%20Evangelista%2C%20646%20-%20Centro%2C%20Itapetininga%20-%20SP%2C%2018200-055!5e0!3m2!1spt-BR!2sbr!4v1781131825964!5m2!1spt-BR!2sbr",
        imagens: [
            {
                src: "./img/cards/nosso_lar/capa.png", alt: "Criancas participando de atividade educativa."
            },
            {
                src: "./img/cards/nosso_lar/01.png", alt: "Criancas em atividade coletiva com educadores."
            },
            {
                src: "./img/cards/nosso_lar/02.png", alt: "Criancas em atividade coletiva com educadores."
            }
        ]
    },

    {
        id: 4,
        nome: "Engenheiros sem Fronteiras - Núcleo Itapetininga",
        descricao: "Projetos de engenharia voltados para impacto social e ambiental.",
        descricaoCompleta: "O Engenheiros sem Fronteiras desenvolve projetos voltados à melhoria da qualidade de vida de pessoas em situação de vulnerabilidade, utilizando conhecimentos de engenharia, sustentabilidade e educação. A organização atua dentro do IFSP Campus Itapetininga.",
        categoriaPrincipal: "MeioAmbiente",
        heroImagem: "./img/hero/ongs/esf-itapetininga-capa.png",
        categorias: ["Educação", "Meio Ambiente"],
        local: "IFSP Campus Itapetininga",
        instagram: "https://instagram.com/esf.itapetininga",
        facebook: "",
        telefone: "",
        mapa: "https://www.google.com/maps?q=IFSP+Campus+Itapetininga&output=embed",
        imagens: [
            {
                src: "./img/cards/esf_itapetininga/capa.png", alt: "Criancas participando de atividade educativa."
            },
            {
                src: "./img/cards/esf_itapetininga/01.png", alt: "Criancas em atividade coletiva com educadores."
            },
            {
                src: "./img/cards/esf_itapetininga/02.png", alt: "Criancas estudando com professora."
            }
        ]
    },

    {
        id: 5,
        nome: "Sexta é Nóis",
        descricao: "Projeto social voltado para crianças e adolescentes.",
        descricaoCompleta: "A organização Sexta é Nóis promove atividades, eventos e ações de apoio para crianças e adolescentes da comunidade do Taboãozinho. Os participantes destacaram seu papel no acolhimento e desenvolvimento social dos jovens.",
        categoriaPrincipal: "Educacao",
        heroImagem: "./img/hero/ongs/sexta-enois-capa.png",
        categorias: ["Social", "Educação"],
        local: "Taboãozinho - Itapetininga/SP",
        instagram: "https://www.instagram.com/sexta.e.nois",
        facebook: "",
        telefone: "",
        mapa: "",
        imagens: [
            {
                src: "./img/cards/sexta_enois/capa.png", alt: "Criancas participando de atividade educativa."
            },
        ]
    },

    {
        id: 6,
        nome: "CEPREVI",
        descricao: "Instituição voltada ao atendimento de pessoas com deficiência.",
        descricaoCompleta: "O CEPREVI foi citado pelos participantes como uma organização atuante na região da Bela Vista, oferecendo serviços e suporte para pessoas com deficiência.",
        categoriaPrincipal: "Saude",
        heroImagem: "./img/hero/ongs/ceprevi-capa.png",
        categorias: ["Inclusão Social"],
        local: "Bela Vista - Itapetininga/SP",
        instagram: "https://www.instagram.com/cepreviitape/",
        facebook: "",
        telefone: "",
        mapa: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3655.72068372939!2d-48.07622287089155!3d-23.614348269851313!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c5cb6296070caf%3A0xbdb60fa674327d42!2sCeprevi!5e0!3m2!1spt-BR!2sbr!4v1781134399948!5m2!1spt-BR!2sbr",
        imagens: [
            {
                src: "./img/cards/ceprevi/capa.png", alt: "Criancas participando de atividade educativa."
            },
            {
                src: "./img/cards/ceprevi/01.png", alt: "Criancas em atividade coletiva com educadores."
            },
            {
                src: "./img/cards/ceprevi/02.png", alt: "Criancas estudando com professora."
            }
        ]
    },

    {
        id: 7,
        nome: "Lar São Vicente de Paulo",
        descricao: "Instituição de longa permanência para idosos.",
        descricaoCompleta: "O Lar São Vicente de Paulo realiza o acolhimento e cuidado de idosos da região de Itapetininga. A instituição aceita doações de alimentos, fraldas geriátricas e produtos de higiene para manter suas atividades.",
        categoriaPrincipal: "Saude",
        heroImagem: "./img/hero/ongs/sao-vicente-capa.png",
        categorias: ["Assistência Social", "Saúde"],
        local: "Itapetininga/SP",
        instagram: "https://www.instagram.com/lsvpitapetininga/",
        facebook: "",
        telefone: "(15) 3271-0201",
        mapa: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.1713405906107!2d-48.06702432488995!3d-23.598187278774475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c5ccbcdd4b7a21%3A0xe71bb32f7b94e043!2sLar%20S%C3%A3o%20Vicente%20de%20Paulo%20de%20Itapetininga!5e0!3m2!1spt-BR!2sbr!4v1781134321350!5m2!1spt-BR!2sbr",
        imagens: [
            {
                src: "./img/cards/sao_vicente/capa.png", alt: "Criancas participando de atividade educativa."
            },
            {
                src: "./img/cards/sao_vicente/01.png", alt: "Criancas em atividade coletiva com educadores."
            },
            {
                src: "./img/cards/sao_vicente/02.png", alt: "Criancas estudando com professora."
            }
        ]
    },

    {
        id: 8,
        nome: "GAADI",
        descricao: "Organização voltada ao atendimento de crianças e adolescentes.",
        descricaoCompleta: "O GAADI foi citado pelos participantes por seu trabalho com crianças e adolescentes, atuando possivelmente na região da Vila Rio Branco.",
        categoriaPrincipal: "Solidariedade",
        heroImagem: "./img/hero/ongs/gaadi-capa.png",
        categorias: ["Assistência Social"],
        local: "Vila Rio Branco - Itapetininga/SP",
        instagram: "https://www.instagram.com/gaadiitapetininga/",
        facebook: "",
        telefone: "",
        mapa: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.39346119689!2d-48.07192132488997!3d-23.590217978780057!2m3!1f0!1f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c5ccc7e2925feb%3A0x4115d50039212e79!2sGAADI%20-%20Grupo%20de%20Apoio%20%C3%A0%20Ado%C3%A7%C3%A3o%20de%20Itapetininga!5e0!3m2!1spt-BR!2sbr!4v1781134282435!5m2!1spt-BR!2sbr",
        imagens: [
            {
                src: "./img/cards/gaadi/capa.png", alt: "Criancas participando de atividade educativa."
            },
            {
                src: "./img/cards/gaadi/01.png", alt: "Criancas em atividade coletiva com educadores."
            },
            {
                src: "./img/cards/gaadi/02.png", alt: "Criancas estudando com professora."
            }
        ]
    },
    {
        id: 9,
        nome: "SOS Animais",
        descricao: "Organização voltada à proteção e bem-estar animal.",
        descricaoCompleta: "O SOS Animais atua no resgate, cuidado e encaminhamento para adoção responsável de animais em situação de abandono ou maus-tratos, além de promover campanhas de conscientização sobre posse responsável.",
        categoriaPrincipal: "Animais",
        heroImagem: "./img/hero/ongs/sos-animais-capa.jpg",
        categorias: ["Social", "Animais"],
        local: "Itapetininga - SP",
        instagram: "https://www.instagram.com/sosanimaisitapetininga/",
        facebook: "",
        telefone: "",
        mapa: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d467860.13643749594!2d-48.43755363269386!3d-23.634536532224544!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c4349052f42cb3%3A0x2475ddf08b656e3f!2sItapetininga%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1781134153260!5m2!1spt-BR!2sbr",
        imagens: [
            {
                src: "./img/cards/sos_animais/capa.jpg", alt: "Criancas participando de atividade educativa."
            },
            {
                src: "./img/cards/sos_animais/01.jpg", alt: "Criancas em atividade coletiva com educadores."
            },
            {
                src: "./img/cards/sos_animais/02.jpg", alt: "Criancas estudando com professora."
            }
        ]
    }
];

function embaralharONGs(lista) {
    const itens = [...lista];

    for (let i = itens.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [itens[i], itens[j]] = [itens[j], itens[i]];
    }

    return itens;
}

function popularHeroComONGsAleatorias(ongs) {
    if (!heroSlides.length || !Array.isArray(ongs) || !ongs.length) {
        return;
    }

    const selecionadas = embaralharONGs(ongs).slice(0, heroSlides.length);

    heroSlides.forEach((slide, index) => {
        const ong = selecionadas[index % selecionadas.length];
        const imagemPrincipal = ong.heroImagem || ong.imagens?.[0]?.src;
        const titulo = slide.querySelector("h1");
        const descricao = slide.querySelector(".hero-sub");
        const botao = slide.querySelector(".hero-actions .btn");

        if (imagemPrincipal) {
            slide.style.backgroundImage = `url('${imagemPrincipal}')`;
        }

        if (titulo) {
            titulo.textContent = ong.nome;
        }

        if (descricao) {
            descricao.textContent = ong.descricao;
        }

        if (botao) {
            botao.href = `detalhes.html?id=${ong.id}`;
            botao.innerHTML = 'Conhecer Causa <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>';
        }

        slide.dataset.ongId = String(ong.id);
        slide.setAttribute("aria-label", `Slide ${index + 1} de ${heroSlides.length}: ${ong.nome}`);
    });

    heroDots.forEach((dot, index) => {
        const ong = selecionadas[index % selecionadas.length];
        dot.setAttribute("aria-label", `Ver destaque de ${ong.nome}`);
    });

    goToHeroSlide(0);
}

popularHeroComONGsAleatorias(lista_ongs);

const div_ongs = document.querySelector("#ongs");


if (div_ongs) {
    renderizarONGs(lista_ongs);
}

/* ===== PAGINA DETALHES ===== */

const detalheContainer = document.querySelector("#detalhe-ong");

if (detalheContainer) {
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));
    const ong = lista_ongs.find(item => item.id === id);
    if (!ong) {
        detalheContainer.innerHTML = `
            <div class="detalhe-card">
                <h2>ONG não encontrada</h2>
                <a href="index.html">Voltar</a>
            </div>
        `;
    } else {
        document.title = `EntreCausas | ${ong.nome}`;
        document.querySelector("#titulo-ong").textContent = ong.nome;
        document.querySelector(".local").innerHTML = `<i class="fa-solid fa-location-dot"></i>${ong.local}`;
        document.querySelector(".descricao").textContent = ong.descricaoCompleta || ong.descricao;
        const socialActions = document.querySelector("#social-actions");
        socialActions.innerHTML = "";


        if (ong.instagram) {
            const btnInstagram = document.createElement("button");
            btnInstagram.classList.add("btn-instagram");
            btnInstagram.innerHTML = `
                <svg fill="#ffffff" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width="25px" height="25px">
                    <path d="M22.3,8.4c-0.8,0-1.4,0.6-1.4,1.4c0,0.8,0.6,1.4,1.4,1.4c0.8,0,1.4-0.6,1.4-1.4C23.7,9,23.1,8.4,22.3,8.4z"/>
                    <path d="M16,10.2c-3.3,0-5.9,2.7-5.9,5.9s2.7,5.9,5.9,5.9s5.9-2.7,5.9-5.9S19.3,10.2,16,10.2z M16,19.9c-2.1,0-3.8-1.7-3.8-3.8c0-2.1,1.7-3.8,3.8-3.8c2.1,0,3.8,1.7,3.8,3.8C19.8,18.2,18.1,19.9,16,19.9z"/>
                    <path d="M20.8,4h-9.5C7.2,4,4,7.2,4,11.2v9.5c0,4,3.2,7.2,7.2,7.2h9.5c4,0,7.2-3.2,7.2-7.2v-9.5C28,7.2,24.8,4,20.8,4z M25.7,20.8c0,2.7-2.2,5-5,5h-9.5c-2.7,0-5-2.2-5-5v-9.5c0-2.7,2.2-5,5-5h9.5c2.7,0,5,2.2,5,5V20.8z"/>
                </svg>
                Instagram
            `;
            btnInstagram.addEventListener("click", () => abrirModal(ong.instagram));
            socialActions.appendChild(btnInstagram);
        }

        if (ong.facebook) {
            const btnFacebook = document.createElement("button");
            btnFacebook.classList.add("btn-facebook");
            btnFacebook.innerHTML = `
                <svg fill="#ffffff" height="25px" width="25px" viewBox="-143 145 512 512" xmlns="http://www.w3.org/2000/svg">
                    <path d="M113,145c-141.4,0-256,114.6-256,256s114.6,256,256,256s256-114.6,256-256S254.4,145,113,145z M169.5,357.6l-2.9,38.3h-39.3v133H77.7v-133H51.2v-38.3h26.5v-25.7c0-11.3,0.3-28.8,8.5-39.7c8.7-11.5,20.6-19.3,41.1-19.3c33.4,0,47.4,4.8,47.4,4.8l-6.6,39.2c0,0-11-3.2-21.3-3.2c-10.3,0-19.5,3.7-19.5,14v29.9H169.5z"/>
                </svg>
                Facebook
            `;
            btnFacebook.addEventListener("click", () => abrirModal(ong.facebook));
            socialActions.appendChild(btnFacebook);
        }

        if (ong.linkVoluntario) {
            const btnVoluntario = document.createElement("button");
            btnVoluntario.classList.add("btn-voluntario");
            btnVoluntario.innerHTML = `<i class="fa-solid fa-user"></i> Voluntariar-se`;
            btnVoluntario.addEventListener("click", () => abrirModal(ong.linkVoluntario));
            socialActions.appendChild(btnVoluntario);
        }
        const temInstagram = !!ong.instagram;
        const temFacebook = !!ong.facebook;

        if (temInstagram && !temFacebook) {
            socialActions.querySelector(".btn-instagram").classList.add("sozinho");
        }

        if (temFacebook && !temInstagram) {
            socialActions.querySelector(".btn-facebook").classList.add("sozinho");
        }
        const iframe = document.querySelector(".mapa iframe");
        iframe.src = ong.mapa;
        const detalheImagem = document.querySelector(".detalhe-imagem");

        detalheImagem.innerHTML = "";

        ong.imagens.forEach((imagem, i) => {
            const img = document.createElement("img");
            img.src = imagem.src;
            img.alt = imagem.alt;
            if (i === 0) {
                img.classList.add("ativa");
            }
            detalheImagem.appendChild(img);
        });

        const dots = document.createElement("div");
        dots.classList.add("carrossel-fotos");
        ong.imagens.forEach((_, i) => {
            const span = document.createElement("span");
            if (i === 0) {
                span.classList.add("ativo");
            }
            dots.appendChild(span);
        });
        detalheImagem.appendChild(dots);
        iniciarCarrosselDetalhes();
    }
}

function iniciarCarrosselDetalhes() {

    imagens = document.querySelectorAll(".detalhe-imagem img");

    carrossel_fotos = document.querySelectorAll(".carrossel-fotos span");

    container = document.querySelector(".detalhe-imagem");
    if (
        imagens.length > 0 &&
        container &&
        carrossel_fotos.length > 0
    ) {
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
}

/* ===== Busca ===== */
const inputBusca = document.querySelector("#pesquisa-ong");

function renderizarONGs(lista) {

    div_ongs.innerHTML = "";

    lista.forEach((ong) => {
        const card_ong = document.createElement("a");
        card_ong.classList.add("cards");
        card_ong.href = `detalhes.html?id=${ong.id}`;
        const span_ong = document.createElement("span");
        span_ong.classList.add("card-badge");
        const icone = iconesCategorias[ong.categoriaPrincipal] || "fa-solid fa-circle-info";
        span_ong.innerHTML = `<i class="${icone}"></i>${nomesCategorias[ong.categoriaPrincipal] || ong.categoriaPrincipal}`;
        const img_ong = document.createElement("img");
        img_ong.src = ong.imagens[0].src;
        img_ong.alt = ong.imagens[0].alt;
        const nome_ong = document.createElement("h3");
        nome_ong.textContent = ong.nome;
        const descricao_ong = document.createElement("p");
        descricao_ong.textContent = ong.descricao;
        const categorias_ong = document.createElement("h4");
        categorias_ong.textContent = ong.categorias.map(cat => nomesCategorias[cat] || cat).join(" • ");

        card_ong.appendChild(span_ong);
        card_ong.appendChild(img_ong);
        card_ong.appendChild(nome_ong);
        card_ong.appendChild(descricao_ong);
        card_ong.appendChild(categorias_ong);

        div_ongs.appendChild(card_ong);
    });
}


inputBusca?.addEventListener("input", () => {
    const termo = inputBusca.value.toLowerCase().trim();
    const ongsFiltradas = lista_ongs.filter((ong) => {
        return (
            ong.nome.toLowerCase().includes(termo) || ong.descricao.toLowerCase().includes(termo) || ong.categorias.some(cat => (nomesCategorias[cat] || cat).toLowerCase().includes(termo))
        );
    });
    renderizarONGs(ongsFiltradas);
});


const btnAumentar = document.querySelector("#aumentar-fonte");
const btnDiminuir = document.querySelector("#diminuir-fonte");
const btnContraste = document.querySelector("#alto-contraste");

let tamanhoFonte = 100;

btnAumentar.addEventListener("click", () =>{
    tamanhoFonte += 10;
    document.documentElement.style.fontSize = tamanhoFonte + "%";
});

btnDiminuir.addEventListener("click", () =>{
    tamanhoFonte -= 10;
    document.documentElement.style.fontSize = tamanhoFonte + "%";
});

btnContraste.addEventListener("click", () =>{
    document.body.classList.toggle("alto-contraste");
});
