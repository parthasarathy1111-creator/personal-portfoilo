(function () {
  const phone = "919894549760";
  const topics = new Set(["General message", "Internship opportunity", "Collaboration", "Project question"]);
  const projects = new Set(["Nellai Mart", "JARVIS", "Anime World"]);

  function buildMessage({ name = "", topic = "General message", message = "", project = "" } = {}) {
    const sender = String(name).replace(/\s+/g, " ").trim().slice(0, 80);
    const body = String(message).replace(/\r\n?/g, "\n").trim().slice(0, 700);
    const lines = ["Hi Partha,", "I found your portfolio and would like to connect.", "", `Topic: ${topics.has(topic) ? topic : "General message"}`];
    if (projects.has(project)) lines.push(`Project: ${project}`);
    if (sender) lines.push(`From: ${sender}`);
    if (body) lines.push("", body);
    return lines.join("\n");
  }

  function buildWhatsAppUrl(message) {
    const url = new URL(`https://wa.me/${phone}`);
    url.searchParams.set("text", String(message));
    return url.href;
  }

  function initContact(doc) {
    const dialog = doc.getElementById("contact-dialog");
    if (!dialog || typeof dialog.showModal !== "function") return;
    const form = doc.getElementById("contact-form");
    const name = doc.getElementById("contact-name");
    const topic = doc.getElementById("contact-topic");
    const message = doc.getElementById("contact-message");
    const draft = doc.getElementById("whatsapp-draft");
    const preview = doc.getElementById("contact-preview");
    const context = doc.getElementById("contact-context");
    const count = doc.getElementById("message-count");
    let activeProject = "";
    let opener;

    function updateDraft() {
      message.setCustomValidity("");
      const text = buildMessage({ name: name.value, topic: topic.value, message: message.value, project: activeProject });
      draft.value = text;
      preview.textContent = message.value.trim() ? text : "Your message preview will appear here.";
      count.textContent = `${message.value.length} / 700`;
    }

    for (const trigger of doc.querySelectorAll("[data-contact-open]")) {
      trigger.addEventListener("click", (event) => {
        try { if (!dialog.open) dialog.showModal(); }
        catch { return; }
        event.preventDefault();
        opener = trigger;
        activeProject = projects.has(trigger.dataset.contactProject) ? trigger.dataset.contactProject : "";
        if (activeProject) topic.value = "Project question";
        else if (topic.value === "Project question") topic.value = "General message";
        context.hidden = !activeProject;
        context.textContent = activeProject ? `Discussing ${activeProject}` : "";
        doc.documentElement.classList.add("dialog-open");
        updateDraft();
        topic.focus();
      });
    }

    doc.getElementById("contact-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("close", () => {
      doc.documentElement.classList.remove("dialog-open");
      if (opener?.isConnected) opener.focus();
    });
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    form.addEventListener("input", updateDraft);
    form.addEventListener("change", updateDraft);
    form.addEventListener("submit", (event) => {
      if (!message.value.trim()) {
        event.preventDefault();
        message.setCustomValidity("Please write a message before continuing.");
        message.reportValidity();
        message.focus();
        return;
      }
      updateDraft();
    });
    updateDraft();
  }

  const api = { buildMessage, buildWhatsAppUrl, initContact };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof document !== "undefined") initContact(document);
})();
