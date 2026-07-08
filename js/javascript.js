"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const CHAVE_TEMA = "tema-despedida-entra21";
    const botaoTema = document.getElementById("alternarTema");
    const textoTema = document.getElementById("textoTema");
    const iconeTema = botaoTema?.querySelector("[aria-hidden='true']");
    const metaTema = document.querySelector("meta[name='theme-color']");
    const anoAtual = document.getElementById("anoAtual");

    function lerTemaSalvo() {
        try {
            return localStorage.getItem(CHAVE_TEMA);
        } catch {
            return null;
        }
    }

    function salvarTema(tema) {
        try {
            localStorage.setItem(CHAVE_TEMA, tema);
        } catch {
            // O tema continua funcionando mesmo sem acesso ao armazenamento local.
        }
    }

    function aplicarTema(temaEscuro) {
        document.body.classList.toggle("escuro", temaEscuro);
        document.documentElement.classList.toggle("tema-escuro", temaEscuro);
        document.documentElement.classList.toggle("tema-claro", !temaEscuro);

        if (botaoTema && textoTema) {
            botaoTema.setAttribute("aria-pressed", String(temaEscuro));
            botaoTema.setAttribute("aria-label", temaEscuro ? "Ativar tema claro" : "Ativar tema escuro");
            textoTema.textContent = temaEscuro ? "Tema claro" : "Tema escuro";
        }

        if (iconeTema) {
            iconeTema.textContent = temaEscuro ? "☀" : "☾";
        }

        metaTema?.setAttribute("content", temaEscuro ? "#050507" : "#f7f5fb");
    }

    const temaSalvo = lerTemaSalvo();
    const prefereTemaEscuro = window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
    aplicarTema(temaSalvo ? temaSalvo === "escuro" : prefereTemaEscuro);

    botaoTema?.addEventListener("click", () => {
        const temaEscuro = !document.body.classList.contains("escuro");
        aplicarTema(temaEscuro);
        salvarTema(temaEscuro ? "escuro" : "claro");
    });

    if (anoAtual) {
        anoAtual.textContent = String(new Date().getFullYear());
    }

    const album = document.querySelector(".album-grid");
    const visualizador = document.getElementById("visualizadorFoto");
    const fotoAmpliada = document.getElementById("fotoAmpliada");
    const legendaFoto = document.getElementById("legendaFoto");
    const fecharVisualizador = document.getElementById("fecharVisualizador");

    function abrirFoto(foto) {
        if (!visualizador || !fotoAmpliada || !legendaFoto) return;

        fotoAmpliada.src = foto.currentSrc || foto.src;
        fotoAmpliada.alt = foto.alt;
        legendaFoto.textContent = foto.alt;
        visualizador.showModal();
    }

    if (album && visualizador) {
        const fotos = album.querySelectorAll(".album-item");

        fotos.forEach((foto) => {
            foto.tabIndex = 0;
            foto.setAttribute("role", "button");
            foto.setAttribute("aria-label", `Ampliar foto: ${foto.alt}`);

            foto.addEventListener("click", () => abrirFoto(foto));
            foto.addEventListener("keydown", (evento) => {
                if (evento.key === "Enter" || evento.key === " ") {
                    evento.preventDefault();
                    abrirFoto(foto);
                }
            });
        });

        fecharVisualizador?.addEventListener("click", () => visualizador.close());
        visualizador.addEventListener("click", (evento) => {
            if (evento.target === visualizador) {
                visualizador.close();
            }
        });

        visualizador.addEventListener("close", () => {
            fotoAmpliada?.removeAttribute("src");
        });
    }
});
