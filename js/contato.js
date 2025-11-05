const form = document.getElementById("mensagem-form");
const feedback = document.getElementById("feedback");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    if (nome && email && mensagem) {
      feedback.textContent = "✅ Mensagem enviada com sucesso! Obrigado pelo contato.";
      feedback.className = "feedback sucesso";
      form.reset();

      setTimeout(() => {
        feedback.textContent = "";
        feedback.className = "feedback";
      }, 4000);
    } else {
      feedback.textContent = "⚠️ Por favor, preencha todos os campos.";
      feedback.className = "feedback erro";
    }
  });
}
