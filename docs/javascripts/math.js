const renderMath = (root) => {
  if (!window.renderMathInElement) return;
  renderMathInElement(root || document.body, {
    delimiters: [
      { left: "$$",  right: "$$",  display: true },
      { left: "$",   right: "$",   display: false },
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true }
    ],
  });
};

if (typeof document$ !== "undefined" && document$.subscribe) {
  document$.subscribe(({ body }) => renderMath(body));
} else {
  document.addEventListener("DOMContentLoaded", () => renderMath(document.body));
}
