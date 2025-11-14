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

const renderCurrentPage = () => renderMath(document.body);

if (typeof document$ !== "undefined" && document$.subscribe) {
  document$.subscribe(({ body }) => renderMath(body));
} else {
  if (document.readyState !== "loading") {
    renderCurrentPage();
  } else {
    document.addEventListener("DOMContentLoaded", renderCurrentPage);
  }
}
