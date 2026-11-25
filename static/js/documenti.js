// Documenti (regolamento, privacy): si aprono in un riquadro con «Chiudi» sopra la pagina, così il modulo resta lì.
// Le pagine sono immagini già pronte (static/documenti/<nome>/1.png ...): si vedono uguali su PC e telefono.
let docPages = null;
document.addEventListener("click", async e => {
  const link = e.target.closest(".legal-links a");
  if (!link) return;
  e.preventDefault();
  const name = link.pathname.split("/").pop().replace(/\.pdf$/, "");
  try {
    docPages = docPages || await (await fetch(link.pathname.replace(/[^/]+$/, "pagine.json"), {cache: "no-store"})).json();
  } catch (err) { docPages = {}; }
  if (!docPages[name]) { window.open(link.href, "_blank"); return; }  // documento senza immagini: si apre il PDF
  let viewer = document.getElementById("doc-viewer");
  if (!viewer) {
    viewer = document.createElement("dialog");
    viewer.id = "doc-viewer";
    viewer.className = "doc-viewer";
    viewer.innerHTML = '<div class="doc-viewer-head"><strong></strong>' +
      '<button type="button" class="btn btn-primary">Chiudi</button></div><div class="doc-viewer-pages"></div>';
    viewer.querySelector("button").addEventListener("click", () => viewer.close());
    viewer.addEventListener("click", ev => { if (ev.target === viewer) viewer.close(); });  // clic fuori dal riquadro
    document.body.appendChild(viewer);
  }
  viewer.querySelector("strong").textContent = link.textContent.replace("📄", "").trim();
  const pages = viewer.querySelector(".doc-viewer-pages");
  pages.innerHTML = "";
  const base = link.pathname.replace(/\.pdf$/, "/");
  for (let i = 1; i <= docPages[name]; i++) {
    const img = document.createElement("img");
    img.src = base + i + ".png";
    img.alt = "Pagina " + i;
    pages.appendChild(img);
  }
  viewer.showModal();
  pages.scrollTop = 0;
});
