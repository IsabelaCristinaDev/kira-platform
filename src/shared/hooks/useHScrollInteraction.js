// Rolagem horizontal sem barra visível: no computador, arrastar com o mouse e girar a roda movem as linhas `.k-hscroll`.
// No celular o toque já rola sozinho. Um único ouvinte no documento atende todas as linhas · API: nenhuma
import { useEffect } from "react";

const DRAG_THRESHOLD = 5;

export function useHScrollInteraction() {
  useEffect(() => {
    let row = null;
    let startX = 0;
    let startScroll = 0;
    let moved = false;

    const rowOf = (target) => (target instanceof Element ? target.closest(".k-hscroll") : null);
    const scrollable = (el) => el.scrollWidth > el.clientWidth;

    const onDown = (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      const el = rowOf(e.target);
      if (!el || !scrollable(el)) return;
      row = el;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      moved = false;
    };
    const onMove = (e) => {
      if (!row) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) < DRAG_THRESHOLD) return;
      moved = true;
      row.classList.add("k-dragging");
      row.scrollLeft = startScroll - dx;
    };
    const onUp = () => {
      if (row) row.classList.remove("k-dragging");
      row = null;
    };
    // depois de arrastar, o clique que o navegador dispara no chip é descartado
    const onClick = (e) => {
      if (!moved) return;
      moved = false;
      e.preventDefault();
      e.stopPropagation();
    };
    const onWheel = (e) => {
      const el = rowOf(e.target);
      if (!el || !scrollable(el) || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = el.scrollWidth - el.clientWidth;
      const next = Math.min(max, Math.max(0, el.scrollLeft + e.deltaY));
      if (next === el.scrollLeft) return; // já no fim: a página continua rolando
      e.preventDefault();
      el.scrollLeft = next;
    };

    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    document.addEventListener("pointercancel", onUp);
    document.addEventListener("click", onClick, true);
    document.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("wheel", onWheel);
    };
  }, []);
}
