(() => {
  "use strict";

  const form = document.getElementById("roadmapForm");
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const fileSpecs = document.getElementById("fileSpecs");
  const fileName = document.getElementById("fileName");
  const removeFileButton = document.getElementById("removeFileBtn");
  const rawText = document.getElementById("rawText");
  const inputStatus = document.getElementById("inputStatus");
  const formMessage = document.getElementById("formMessage");
  const optimizeButton = document.getElementById("optimizeBtn");
  const optimizeButtonLabel = document.getElementById("optimizeBtnLabel");
  const loadingLogo = document.getElementById("loadingLogo");
  const outputWrapper = document.getElementById("outputWrapper");
  const outputHeading = document.getElementById("outputHeading");
  const outputBox = document.getElementById("outputBox");
  const editInputButton = document.getElementById("editInputBtn");
  const downloadButton = document.getElementById("downloadBtn");
  const copyButton = document.getElementById("copyBtn");
  const startOverButton = document.getElementById("startOverBtn");
  const copyMessage = document.getElementById("copyMessage");

  const allowedExtensions = new Set(["pdf", "docx", "png", "jpg", "jpeg", "txt"]);
  const maximumFileSize = 20 * 1024 * 1024;
  const maximumTextLength = 100_000;
  const defaultButtonLabel = "Optimize Learning Roadmap";
  const loadingButtonLabel = "Synthesizing Structural Outline...";
  const activeDropzoneClasses = [
    "border-cyan-400",
    "bg-cyan-500/10",
    "ring-1",
    "ring-cyan-400/20",
  ];

  let selectedFile = null;
  let roadmapMarkdown = "";
  let copyFeedbackTimer = 0;

  function showFormMessage(message) {
    formMessage.textContent = message;
    formMessage.classList.remove("hidden");
  }

  function clearFormMessage() {
    formMessage.textContent = "";
    formMessage.classList.add("hidden");
  }

  function setInputStatus(message) {
    inputStatus.textContent = message;
    inputStatus.classList.toggle("hidden", !message);
  }

  function formatFileSize(sizeInBytes) {
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function isSupportedFile(file) {
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    return allowedExtensions.has(extension);
  }

  function clearSelectedFile() {
    selectedFile = null;
    fileInput.value = "";
    fileName.textContent = "";
    fileSpecs.classList.add("hidden");
    fileSpecs.classList.remove("flex");
    setInputStatus("");
  }

  function displaySelectedFile(file) {
    selectedFile = file;
    rawText.value = "";
    fileName.textContent = `${file.name} · ${formatFileSize(file.size)}`;
    fileSpecs.classList.remove("hidden");
    fileSpecs.classList.add("flex");
    clearFormMessage();
    setInputStatus("File ready to process. This website does not retain uploads.");
  }

  function handleFile(file) {
    if (!isSupportedFile(file)) {
      clearSelectedFile();
      showFormMessage("Choose a PDF, DOCX, PNG, JPG, or TXT file.");
      return;
    }

    if (file.size > maximumFileSize) {
      clearSelectedFile();
      showFormMessage("This file is larger than 20 MB. Choose a smaller file.");
      return;
    }

    displaySelectedFile(file);
  }

  function setDropzoneActive(isActive) {
    activeDropzoneClasses.forEach((className) => {
      dropzone.classList.toggle(className, isActive);
    });
  }

  function setProcessing(isProcessing) {
    optimizeButton.disabled = isProcessing;
    optimizeButton.setAttribute("aria-busy", String(isProcessing));
    dropzone.setAttribute("aria-disabled", String(isProcessing));
    optimizeButtonLabel.textContent = isProcessing ? loadingButtonLabel : defaultButtonLabel;
    optimizeButton.classList.toggle("cursor-wait", isProcessing);
    loadingLogo.classList.toggle("hidden", !isProcessing);
    loadingLogo.classList.toggle("animate-spin", isProcessing);
    fileInput.disabled = isProcessing;
    rawText.disabled = isProcessing;
    removeFileButton.disabled = isProcessing;
  }

  async function requestRoadmap(file, text) {
    const formData = new FormData();
    if (file) {
      formData.append("syllabusFile", file, file.name);
    } else {
      formData.append("rawText", text);
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 90_000);

    try {
      const response = await fetch("/api/optimize", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      const data = await response.json();

      if (!data || typeof data !== "object") {
        throw new Error("The server returned an invalid response.");
      }

      if (!response.ok) {
        throw new Error(data.error || "The roadmap could not be generated.");
      }

      if (typeof data.markdownRoadmap !== "string" || !data.markdownRoadmap.trim()) {
        throw new Error("The server response did not include a roadmap.");
      }

      return data;
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("This request took too long. Please try again.");
      }
      if (error instanceof SyntaxError) {
        throw new Error("The server returned an unreadable response.");
      }
      if (error instanceof TypeError) {
        throw new Error("Unable to reach the roadmap service. Check your connection and try again.");
      }
      throw error;
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  function setOutputVisible(isVisible) {
    if (isVisible) {
      outputWrapper.classList.remove("hidden");
      requestAnimationFrame(() => outputWrapper.classList.add("opacity-100"));
    } else {
      outputWrapper.classList.add("hidden");
      outputWrapper.classList.remove("opacity-100");
    }
  }

  function resetWorkspace() {
    clearSelectedFile();
    rawText.value = "";
    roadmapMarkdown = "";
    outputBox.textContent = "";
    clearFormMessage();
    setInputStatus("");
    setOutputVisible(false);
    window.clearTimeout(copyFeedbackTimer);
    copyButton.textContent = "Copy Content";
    copyMessage.textContent = "";
    copyMessage.classList.remove("text-cyan-300", "text-amber-300");
    copyMessage.classList.add("text-zinc-500");
    rawText.focus();
  }

  dropzone.addEventListener("click", () => {
    if (!optimizeButton.disabled) fileInput.click();
  });

  dropzone.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!optimizeButton.disabled) fileInput.click();
    }
  });

  fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (file) handleFile(file);
  });

  removeFileButton.addEventListener("click", () => {
    clearSelectedFile();
    clearFormMessage();
    setInputStatus("Selected file removed.");
    dropzone.focus();
  });

  dropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    setDropzoneActive(true);
  });

  dropzone.addEventListener("dragleave", (event) => {
    if (!dropzone.contains(event.relatedTarget)) {
      setDropzoneActive(false);
    }
  });

  dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    setDropzoneActive(false);
    const file = event.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  });

  document.addEventListener("dragover", (event) => event.preventDefault());
  document.addEventListener("drop", (event) => event.preventDefault());

  rawText.addEventListener("input", () => {
    if (rawText.value.length > maximumTextLength) {
      rawText.value = rawText.value.slice(0, maximumTextLength);
    }

    if (rawText.value.trim()) {
      if (selectedFile) clearSelectedFile();
      clearFormMessage();
      setInputStatus("Outline text is ready to synthesize.");
    } else {
      setInputStatus("");
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearFormMessage();
    copyMessage.textContent = "";

    const inputText = rawText.value.trim();
    if (!selectedFile && !inputText) {
      showFormMessage("Add a syllabus file or paste your course outline to continue.");
      return;
    }

    const fileForRequest = selectedFile;
    setProcessing(true);
    setInputStatus("Preparing your course material...");
    setOutputVisible(false);

    try {
      const data = await requestRoadmap(fileForRequest, inputText);
      roadmapMarkdown = data.markdownRoadmap;
      outputBox.textContent = data.markdownRoadmap;
      outputHeading.textContent = "Roadmap ready";
      setOutputVisible(true);
      setInputStatus("Roadmap synthesized successfully.");
      outputWrapper.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch (error) {
      showFormMessage(error.message);
      setInputStatus("");
      console.error("Roadmap request failed:", error);
    } finally {
      setProcessing(false);
    }
  });

  editInputButton.addEventListener("click", () => {
    setOutputVisible(false);
    rawText.focus();
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  startOverButton.addEventListener("click", resetWorkspace);

  downloadButton.addEventListener("click", () => {
    if (!roadmapMarkdown) return;

    const file = new Blob([roadmapMarkdown], { type: "text/markdown;charset=utf-8" });
    const downloadUrl = URL.createObjectURL(file);
    const downloadLink = document.createElement("a");
    downloadLink.href = downloadUrl;
    downloadLink.download = "sabisyllabus-study-roadmap.md";
    downloadLink.click();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
  });

  copyButton.addEventListener("click", async () => {
    if (!roadmapMarkdown) return;

    try {
      await navigator.clipboard.writeText(roadmapMarkdown);
      copyButton.textContent = "Copied! ✓";
      copyMessage.textContent = "Roadmap copied to clipboard.";
      copyMessage.classList.remove("text-amber-300", "text-zinc-500");
      copyMessage.classList.add("text-cyan-300");
      window.clearTimeout(copyFeedbackTimer);
      copyFeedbackTimer = window.setTimeout(() => {
        copyButton.textContent = "Copy Content";
        copyMessage.textContent = "";
        copyMessage.classList.remove("text-cyan-300");
        copyMessage.classList.add("text-zinc-500");
      }, 2000);
    } catch (error) {
      copyMessage.textContent = "Clipboard access failed. Check browser permissions and try again.";
      copyMessage.classList.remove("text-cyan-300", "text-zinc-500");
      copyMessage.classList.add("text-amber-300");
      console.error("Clipboard copy failed:", error);
    }
  });
})();
