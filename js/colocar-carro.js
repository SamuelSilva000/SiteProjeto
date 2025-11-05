document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("venda-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const marca = document.getElementById("marca").value.trim();
    const modelo = document.getElementById("modelo").value.trim();
    const ano = document.getElementById("ano").value.trim();
    const cidade = document.getElementById("cidade").value.trim();
    const km = document.getElementById("km").value.trim();
    const preco = document.getElementById("preco").value.trim();
    const imagem = document.getElementById("imagem").files[0];

    if (marca && modelo && ano && cidade && km && preco && imagem) {
      alert(`✅ Anúncio "${marca} ${modelo}" Enviado para análise!`);
      form.reset();
      // Redirecionar após envio, se quiser:
      // window.location.href = "perfil.html";
    } else {
      alert("⚠️ Por favor, preencha todos os campos corretamente.");
    }
  });
});
