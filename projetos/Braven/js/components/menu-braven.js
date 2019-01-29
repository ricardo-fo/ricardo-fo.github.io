// IIFE
/* Funcionalidade: fazer o menu animado
 * 1. Pegar o menu hamburguer; (OK)
 * 2. Adicionar um evento de click no menu; (OK)
 * 3. Pegar o items; (OK)
 * 4. Adicionar a class -active no items quando o menu for clicado;
*/

"use strict";
(function () {
    const $menuBraven = document.querySelector(".menu-braven");
    const $menu = $menuBraven.querySelector(".menu");
    const $items = $menuBraven.querySelector(".items");

    $menu.addEventListener("click", event => {
        event.preventDefault();

        $items.classList.add("-active");
    });

    $items.addEventListener("click", event => {
        event.preventDefault();

        $items.classList.remove("-active");
    });
})();