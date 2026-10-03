const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const CONTACT_KEY = 23;
const protectedContacts = {
  heroPhone: [63, 37, 34, 39, 62, 55, 34, 33, 34, 58, 34, 36, 33, 39],
  heroEmail: [125, 118, 116, 124, 96, 96, 114, 99, 122, 120, 101, 114, 87, 112, 122, 118, 126, 123, 57, 116, 120, 122],
  heroAddress: [36, 32, 47, 55, 69, 126, 123, 114, 110, 55, 83, 101, 59, 55, 71, 101, 126, 121, 116, 114, 55, 80, 114, 120, 101, 112, 114, 59, 55, 85, 84],
  refOnePhone: [63, 37, 34, 39, 62, 55, 33, 35, 39, 58, 32, 32, 39, 36],
  refTwoPhone: [63, 37, 34, 39, 62, 55, 46, 47, 38, 58, 47, 34, 32, 33]
};

const decodeProtectedText = (encodedValue) =>
  encodedValue.map((value) => String.fromCharCode(value ^ CONTACT_KEY)).join("");

const drawProtectedText = (canvas, text) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const style = getComputedStyle(canvas);
  const fontSize = Number.parseFloat(style.fontSize) || 16;
  const fontWeight = style.fontWeight || "500";
  const fontFamily = style.fontFamily || '"Inter", sans-serif';
  const font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  const verticalPadding = 3;
  const horizontalPadding = 2;
  const dpr = window.devicePixelRatio || 1;

  ctx.font = font;
  const textWidth = Math.ceil(ctx.measureText(text).width);
  const width = textWidth + horizontalPadding * 2;
  const height = Math.ceil(fontSize * 1.5 + verticalPadding * 2);

  canvas.width = Math.ceil(width * dpr);
  canvas.height = Math.ceil(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.font = font;
  ctx.fillStyle = style.color || "#e2e8f0";
  ctx.textBaseline = "middle";
  ctx.fillText(text, horizontalPadding, height / 2);
};

document.querySelectorAll("canvas[data-protected-contact]").forEach((canvas) => {
  const contactKey = canvas.getAttribute("data-protected-contact");
  const encodedValue = contactKey ? protectedContacts[contactKey] : undefined;
  if (!encodedValue) {
    return;
  }
  drawProtectedText(canvas, decodeProtectedText(encodedValue));
});

const revealItems = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

revealItems.forEach((item) => observer.observe(item));

const navLinks = document.querySelectorAll(".nav-links a");
const sections = [...navLinks]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) =>
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`)
        );
      }
    });
  },
  { threshold: 0.45 }
);

sections.forEach((section) => sectionObserver.observe(section));
