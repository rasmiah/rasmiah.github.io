async function includeHTML(selector, file) {
  const element = document.querySelector(selector);
  if (element) {
    const response = await fetch(file);
    const html = await response.text();
    element.innerHTML = html;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await includeHTML("header", "partials/ header.html");
  await includeHTML("footer", "partials/footer.html");

  // Set year after footer loads
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});
