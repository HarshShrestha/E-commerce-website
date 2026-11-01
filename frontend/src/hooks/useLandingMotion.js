import { useEffect, useRef } from "react";
/** Progressive enhancement: content is never CSS-hidden; once-only, short animations. */
export function useLandingMotion(scope, revision) {
  const seen = useRef(new WeakSet());
  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer;
    const animations = new Set();
    const animate = (node, frames, options) => {
      if (preference.matches || !node.animate) return;
      const animation = node.animate(frames, options);
      animations.add(animation);
      animation.finished
        .then(() => animations.delete(animation))
        .catch(() => {});
    };
    const reveal = (node) => {
      if (seen.current.has(node)) return;
      seen.current.add(node);
      animate(
        node,
        [
          { opacity: 0, transform: "translateY(14px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 560,
          delay: Number(node.dataset.delay || 0),
          easing: "cubic-bezier(.2,.65,.3,1)",
          fill: "backwards",
        },
      );
    };
    if (!preference.matches && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              reveal(entry.target);
              observer.unobserve(entry.target);
            }
          }),
        { threshold: 0.08 },
      );
      root
        .querySelectorAll("[data-reveal]")
        .forEach((node) => observer.observe(node));
    }
    const imageCleanups = [];
    root.querySelectorAll("img").forEach((image) => {
      if (seen.current.has(image)) return;
      const loaded = () => {
        if (!image.naturalWidth || seen.current.has(image)) return;
        seen.current.add(image);
        animate(image, [{ opacity: 0.45 }, { opacity: 1 }], {
          duration: 480,
          easing: "ease-out",
        });
      };
      if (image.complete) loaded();
      else {
        image.addEventListener("load", loaded, { once: true });
        imageCleanups.push(() => image.removeEventListener("load", loaded));
      }
    });
    const stop = () => {
      if (preference.matches) {
        observer?.disconnect();
        animations.forEach((animation) => animation.cancel());
      }
    };
    preference.addEventListener("change", stop);
    return () => {
      observer?.disconnect();
      imageCleanups.forEach((cleanup) => cleanup());
      animations.forEach((animation) => animation.cancel());
      preference.removeEventListener("change", stop);
    };
  }, [scope, revision]);
}
