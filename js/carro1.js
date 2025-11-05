document.querySelector("#formMensagem")?.addEventListener("submit", e => {
  e.preventDefault();
  alert("Mensagem enviada ao vendedor!");
  e.target.reset();
});
