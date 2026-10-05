/**
 * Nexus PobreFlix - Gamepad Support & Navigation (Xbox / Steam Deck Controller)
 * Handles D-pad/Analog navigation in TV layout and playback controls.
 */

import { resolveSliderAssetHref } from "./assetLinks.js";

let activeGamepadIndex = null;
let animationFrameId = null;
let lastVolumeTime = 0; // Throttle holding triggers for volume adjust
let lastInputTime = 0;
const INPUT_COOLDOWN_MS = 200; // Cooldown between navigation movements (D-pad/Axes)
const AXIS_THRESHOLD = 0.5; // Threshold for analog stick movement detection
const previousButtonStates = {};
let lastDomUpdateTime = 0; // Throttle DOM injections (headers, exit link)

// Add global listener to smoothly scroll focused elements into view on TV mode
if (typeof document !== 'undefined') {
  document.addEventListener("focus", (event) => {
    const focusedEl = event.target;
    if (focusedEl && focusedEl !== document.body) {
      const isTv = document.body.classList.contains("layout-tv") || window.location.href.includes("layout=tv");
      if (isTv) {
        // Redirecionar foco se o elemento for inválido ou invisível (evita cair no "abismo")
        const rect = focusedEl.getBoundingClientRect();
        if (focusedEl.offsetWidth === 0 || focusedEl.offsetHeight === 0 || rect.width === 0 || rect.height === 0 || window.getComputedStyle(focusedEl).display === "none") {
          console.warn("[Nexus Gamepad] Elemento focado inválido/invisível. Retornando foco para área visível.");
          focusedEl.blur();
          const fallback = document.querySelector("#indexPage:not(.hide) .focusable, #homePage:not(.hide) .focusable, .focusable");
          if (fallback) fallback.focus();
          return;
        }

        const isInSlider = !!focusedEl.closest("#monwui-slides-container, .monwui-slide, .monwui-slider-container");
        if (isInSlider) {
          // Pinar a tela no topo para evitar que o banner role e saia da tela
          const containers = document.querySelectorAll(".page, .skinHeader, .skinLayout, .mainDrawer, html, body");
          containers.forEach(c => {
            if (c) c.scrollTop = 0;
          });
        }

        const isDetailPage = !!focusedEl.closest(".detailPage, #itemDetailPage, .itemDetailPage");
        if (isDetailPage) {
          // Scroll standard focus items smoothly using nearest-fit (prevents detail page cut-offs)
          if (focusedEl.scrollIntoViewIfNeeded) {
            focusedEl.scrollIntoViewIfNeeded(false);
          } else {
            focusedEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
          }
        }
      }
    }
  }, true);
}

function removeGamepadPrompts() {
  if (typeof document === 'undefined') return;
  const footer = document.getElementById("jms-gamepad-footer");
  if (footer) footer.remove();
}

function loadGamepadCSS() {
  try {
    const cssHref = resolveSliderAssetHref("/slider/src/gamepad.css");
    if (!document.querySelector(`link[href^="${cssHref.split('?')[0]}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = cssHref;
      document.head.appendChild(link);
      console.log("[Nexus Gamepad] Style injected successfully");
    }
  } catch (err) {
    console.warn("Failed to load gamepad.css dynamically:", err);
  }
}

function initGamepadSupport() {
  if (typeof window === 'undefined') return;

  // Desativar APENAS se for o aplicativo nativo Jellyfin Media Player para evitar duplo mapeamento
  if (window.jellyfinmediaplayer) {
    console.log("[Nexus Gamepad] Jellyfin Media Player nativo detectado. Mapeamento JS desativado.");
    return;
  }

  loadGamepadCSS();
  
  // Garantir remoção do rodapé de atalhos visuais indesejado
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", removeGamepadPrompts);
  } else {
    removeGamepadPrompts();
  }

  // Alternar modo controle/mouse dinamicamente com base em atividade física
  let lastMouseX = 0;
  let lastMouseY = 0;
  window.addEventListener("mousemove", (e) => {
    if (Math.abs(e.screenX - lastMouseX) > 8 || Math.abs(e.screenY - lastMouseY) > 8) {
      if (document.body.classList.contains("jms-gamepad-mode")) {
        document.body.classList.remove("jms-gamepad-mode");
      }
    }
    lastMouseX = e.screenX;
    lastMouseY = e.screenY;
  });

  window.addEventListener("gamepadconnected", (e) => {
    console.log("[Nexus Gamepad] Controller connected:", e.gamepad.id);
    activeGamepadIndex = e.gamepad.index;
    document.body.classList.add("jms-gamepad-mode");
    startPollingLoop();
  });

  window.addEventListener("gamepaddisconnected", (e) => {
    if (activeGamepadIndex === e.gamepad.index) {
      console.log("[Nexus Gamepad] Controller disconnected");
      activeGamepadIndex = null;
      document.body.classList.remove("jms-gamepad-mode");
    }
  });

  // Iniciar loop de monitoramento imediatamente para garantir detecção instantânea
  startPollingLoop();
}

function startPollingLoop() {
  if (animationFrameId) return;

  function poll() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    
    // Auto-detectar controle ativo
    let gp = null;
    for (let i = 0; i < gamepads.length; i++) {
      if (gamepads[i]) {
        gp = gamepads[i];
        activeGamepadIndex = i;
        break;
      }
    }

    if (gp) {
      document.body.classList.add("jms-gamepad-mode");
      handleInputs(gp);
    } else {
      activeGamepadIndex = null;
    }

    animationFrameId = requestAnimationFrame(poll);
  }
  
  animationFrameId = requestAnimationFrame(poll);
}

function handleInputs(gamepad) {
  const now = Date.now();
  const videoElement = document.querySelector("video");
  const isVideoPlaying = !!videoElement;

  // Atualizar injeções DOM periodicamente (uma vez por segundo)
  if (now - lastDomUpdateTime > 1000) {
    makeHeadersFocusable();
    injectSidebarExitLink();
    lastDomUpdateTime = now;
  }

  // Redirecionar foco para dentro de diálogos / modais abertos se o foco do controle estiver perdido
  const activeDialog = document.querySelector("#jms-details-modal-root, .dialog, .actionSheet, .dialogContainer, .popup, .monwui-castmodal");
  if (activeDialog && window.getComputedStyle(activeDialog).visibility !== "hidden" && window.getComputedStyle(activeDialog).display !== "none") {
    const activeEl = document.activeElement;
    if (!activeEl || !activeDialog.contains(activeEl)) {
      const focusable = activeDialog.querySelector(".jmsdm-btn.primary, .jmsdm-btn, .jmsdm-close, button, a, [focusable], .focusable, .card, input");
      if (focusable) {
        focusable.focus();
        console.log("[Nexus Gamepad] Focus locked into dialog/modal:", focusable);
      }
    }
  }

  // Ajuste contínuo do volume ao segurar os gatilhos LT (6) ou RT (7) no player de vídeo
  if (isVideoPlaying) {
    const ltBtn = gamepad.buttons[6];
    const rtBtn = gamepad.buttons[7];
    if (ltBtn?.pressed && now - lastVolumeTime > 120) {
      adjustVolume(videoElement, -0.05);
      lastVolumeTime = now;
      document.dispatchEvent(new MouseEvent("mousemove", { bubbles: true }));
    } else if (rtBtn?.pressed && now - lastVolumeTime > 120) {
      adjustVolume(videoElement, 0.05);
      lastVolumeTime = now;
      document.dispatchEvent(new MouseEvent("mousemove", { bubbles: true }));
    }
  }

  // 1. Directional Axis Navigation (Analog Sticks) - Habilitado em todos os layouts para garantir navegação universal
  if (now - lastInputTime > INPUT_COOLDOWN_MS && !isVideoPlaying) {
    const axisX = gamepad.axes[0]; // Left stick horizontal
    const axisY = gamepad.axes[1]; // Left stick vertical

    if (axisY < -AXIS_THRESHOLD) {
      simulateKeyEvent("ArrowUp", 38);
      lastInputTime = now;
      document.body.classList.add("jms-gamepad-mode");
    } else if (axisY > AXIS_THRESHOLD) {
      simulateKeyEvent("ArrowDown", 40);
      lastInputTime = now;
      document.body.classList.add("jms-gamepad-mode");
    } else if (axisX < -AXIS_THRESHOLD) {
      simulateKeyEvent("ArrowLeft", 37);
      lastInputTime = now;
      document.body.classList.add("jms-gamepad-mode");
    } else if (axisX > AXIS_THRESHOLD) {
      simulateKeyEvent("ArrowRight", 39);
      lastInputTime = now;
      document.body.classList.add("jms-gamepad-mode");
    }
  }

  // Helper for tracking button clicks (triggers once per press)
  const isButtonPressedOnce = (btnIndex, isPressed) => {
    const wasPressed = !!previousButtonStates[btnIndex];
    previousButtonStates[btnIndex] = isPressed;
    return isPressed && !wasPressed;
  };

  // Atalho de Fechamento via Gamepad (Select + Start)
  const selectBtn = gamepad.buttons[8]?.pressed;
  const startBtn = gamepad.buttons[9]?.pressed;
  if (selectBtn && startBtn) {
    console.log("[Nexus Gamepad] Select + Start shortcut detected. Sending exit command to host.");
    if (window.chrome?.webview) {
      window.chrome.webview.postMessage("exit_app");
    }
  }
  // 2. Button Mappings
  gamepad.buttons.forEach((btn, index) => {
    const isPressed = btn.pressed;

    if (isButtonPressedOnce(index, isPressed)) {
      document.body.classList.add("jms-gamepad-mode");
      
      // Simular movimento do mouse a cada pressionada de botão para despertar os controles na tela no player
      document.dispatchEvent(new MouseEvent("mousemove", { bubbles: true }));

      if (isVideoPlaying) {
        // --- Atalhos de Vídeo (Funcionam em qualquer layout quando assistindo) ---
        switch (index) {
          case 0: // Button A - Toggle Play/Pause
          case 9: // Button Start/Menu - Toggle Play/Pause
            togglePlayPause(videoElement);
            break;
          case 1: // Button B - Back (Close Video Player)
            exitVideoPlayer();
            break;
          case 4: // LB - Seek backward 10s
            seekVideo(videoElement, -10);
            break;
          case 5: // RB - Seek forward 10s
            seekVideo(videoElement, 10);
            break;
        }
      } else {
        // --- Navegação Geral do Menu (Habilitada em todos os layouts para garantir compatibilidade) ---
        switch (index) {
          case 0: // Botão A - Confirmar / Selecionar (Simula Enter para navegar de forma nativa e robusta)
            simulateKeyEvent("Enter", 13);
            break;
          case 1: // Botão B - Voltar Universal
            handleUniversalBack();
            break;
          case 3: // Botão Y - Abrir Menu Lateral / Hambúrguer
            const sidebarBtn = document.querySelector(".btnHeader-sidebar, .btnMenu, [data-action='menu'], .headerButton[title='Menu']");
            if (sidebarBtn) {
              console.log("[Nexus Gamepad] Y Button clicked sidebar button.");
              sidebarBtn.click();
            }
            break;
          case 4: // LB - Slide Banner Anterior
            {
              const dots = document.querySelectorAll(".monwui-dot, .monwui-poster-dot");
              if (dots.length > 0) {
                const activeDot = document.querySelector(".monwui-dot.active, .monwui-poster-dot.active");
                const activeIndex = activeDot ? Array.from(dots).indexOf(activeDot) : 0;
                const prevIndex = (activeIndex - 1 + dots.length) % dots.length;
                dots[prevIndex]?.click();
                console.log("[Nexus Gamepad] LB: Clicked prev banner slide:", prevIndex);
              }
            }
            break;
          case 5: // RB - Slide Banner Próximo
            {
              const dots = document.querySelectorAll(".monwui-dot, .monwui-poster-dot");
              if (dots.length > 0) {
                const activeDot = document.querySelector(".monwui-dot.active, .monwui-poster-dot.active");
                const activeIndex = activeDot ? Array.from(dots).indexOf(activeDot) : 0;
                const nextIndex = (activeIndex + 1) % dots.length;
                dots[nextIndex]?.click();
                console.log("[Nexus Gamepad] RB: Clicked next banner slide:", nextIndex);
              }
            }
            break;
          case 9: // Button Start/Menu
            togglePlayPause(videoElement);
            break;
          // D-Pad Navigation (Buttons 12, 13, 14, 15)
          case 12: // D-pad Up
            simulateKeyEvent("ArrowUp", 38);
            break;
          case 13: // D-pad Down
            simulateKeyEvent("ArrowDown", 40);
            break;
          case 14: // D-pad Left
            simulateKeyEvent("ArrowLeft", 37);
            break;
          case 15: // D-pad Right
            simulateKeyEvent("ArrowRight", 39);
            break;
        }
      }
    }
  });
}

function simulateKeyEvent(keyName, keyCode) {
  const activeEl = document.activeElement || document.body;
  
  // Create and dispatch keydown event
  const keydownEvent = new KeyboardEvent("keydown", {
    key: keyName,
    keyCode: keyCode,
    code: keyName,
    which: keyCode,
    bubbles: true,
    cancelable: true
  });
  
  activeEl.dispatchEvent(keydownEvent);
}

function simulateClick() {
  const activeEl = document.activeElement;
  if (activeEl && activeEl !== document.body) {
    console.log("[Nexus Gamepad] Clicking focused element:", activeEl);
    activeEl.click();
  }
}

function togglePlayPause(video) {
  if (!video) return;
  if (video.paused) {
    console.log("[Nexus Gamepad] Video Play");
    video.play().catch(err => console.warn(err));
  } else {
    console.log("[Nexus Gamepad] Video Pause");
    video.pause();
  }
}

function seekVideo(video, seconds) {
  if (!video) return;
  console.log(`[Nexus Gamepad] Seek ${seconds}s`);
  video.currentTime = Math.max(0, Math.min(video.duration || 0, video.currentTime + seconds));
}

function adjustVolume(video, delta) {
  if (!video) return;
  const newVol = Math.max(0, Math.min(1, video.volume + delta));
  console.log(`[Nexus Gamepad] Volume set to: ${Math.round(newVol * 100)}%`);
  video.volume = newVol;
}

function exitVideoPlayer() {
  console.log("[Nexus Gamepad] Exit video player");
  // Try triggering native Jellyfin back buttons
  const backBtn = document.querySelector(".btnHeader-back, .btnHeader-back-active, .button-flat[data-action='back']");
  if (backBtn) {
    backBtn.click();
  } else {
    // Fallback: simulate escape key and back history
    simulateKeyEvent("Escape", 27);
    setTimeout(() => {
      if (document.querySelector("video")) {
        history.back();
      }
    }, 100);
  }
}

function handleUniversalBack() {
  console.log("[Nexus Gamepad] B Button triggered universal back");
  
  // 1. Fechar modais e diálogos abertos primeiro
  const activeDialog = document.querySelector(".dialog, .actionSheet, .dialogContainer, .popup, .monwui-castmodal");
  const dialogClose = document.querySelector(".btnModalClose, .btnDialogClose, .dialogCloseBtn, [data-action='close']");
  if (activeDialog && dialogClose) {
    dialogClose.click();
    return;
  }
  if (activeDialog) {
    simulateKeyEvent("Escape", 27);
    return;
  }
  
  // 2. Procurar botão de voltar visível no header
  const backBtn = document.querySelector(".btnHeader-back, .btnHeader-back-active, .button-flat[data-action='back'], .btnHeader-backContainer");
  if (backBtn && backBtn.offsetParent !== null) {
    backBtn.click();
    return;
  }
  
  // 3. Fallback nativo: Voltar no histórico de navegação
  history.back();
}

function makeHeadersFocusable() {
  const isTv = document.body.classList.contains("layout-tv") || window.location.href.includes("layout=tv");
  if (!isTv) return;

  const headers = document.querySelectorAll(".sectionTitle, .sectionTitleContainer, .monwuiwl-section-title, .dir-row-title, .gh-title, .prc-title");
  headers.forEach(h => {
    if (!h.classList.contains("focusable")) {
      h.classList.add("focusable");
      h.setAttribute("tabindex", "0");
      h.style.cursor = "pointer";
      h.style.outline = "none";
      
      h.addEventListener("click", () => {
        const link = h.querySelector("a, button, .sectionHeaderLink, .nextButton, .seeAllButton");
        if (link) {
          link.click();
        }
      });
    }
  });
}

function injectSidebarExitLink() {
  const isTv = document.body.classList.contains("layout-tv") || window.location.href.includes("layout=tv");
  if (!isTv) return;

  const linksContainer = document.querySelector(".mainDrawer .scrollContainer, .mainDrawer .drawerContent, .mainDrawer .drawer-content");
  if (linksContainer) {
    const exitId = "nexus-exit-drawer-link";
    if (!document.getElementById(exitId)) {
      const exitLink = document.createElement("a");
      exitLink.id = exitId;
      exitLink.className = "navLink focusable drawerLink";
      exitLink.setAttribute("tabindex", "0");
      exitLink.style.color = "#ff4d4d";
      exitLink.style.fontWeight = "bold";
      
      exitLink.innerHTML = `
        <span class="material-icons navLinkIcon" style="color: #ff4d4d !important;">power_settings_new</span>
        <span class="navLinkText">Sair do Aplicativo</span>
      `;
      
      exitLink.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("[Nexus Gamepad] Clicked Exit from Drawer. Exiting app...");
        if (window.chrome?.webview) {
          window.chrome.webview.postMessage("exit_app");
        }
      });
      
      linksContainer.appendChild(exitLink);
      console.log("[Nexus Gamepad] Injected 'Sair do Aplicativo' to sidebar");
    }
  }
}

export { initGamepadSupport };
