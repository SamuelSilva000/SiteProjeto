// ---------------------- Alternar formulários ----------------------
const loginBox = document.getElementById("login-box");
const cadastroBox = document.getElementById("cadastro-box");
const recuperarBox = document.getElementById("recuperar-box");

document.getElementById("ir-cadastro").onclick = () => {
  loginBox.classList.remove("active");
  cadastroBox.classList.add("active");
};

document.getElementById("voltar-login").onclick = () => {
  cadastroBox.classList.remove("active");
  loginBox.classList.add("active");
};

document.getElementById("esqueci").onclick = () => {
  loginBox.classList.remove("active");
  recuperarBox.classList.add("active");
};

document.getElementById("voltar-login2").onclick = () => {
  recuperarBox.classList.remove("active");
  loginBox.classList.add("active");
};

// ---------------------- Função de mensagem ----------------------
function mostrarMensagem(id, texto, tipo = "erro") {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = texto;
  el.className = "msg " + (tipo === "sucesso" ? "sucesso" : "erro");
  setTimeout(() => (el.textContent = ""), 3000);
}

// ---------------------- LOGIN ----------------------
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const senha = document.getElementById("login-senha").value.trim();

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const user = usuarios.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha
    );

    if (user) {
      mostrarMensagem("msg-login", "✅ Login realizado com sucesso!", "sucesso");

      // 👉 Salva a sessão do usuário logado
      localStorage.setItem("sessaoUsuario", JSON.stringify(user));

      // Redireciona para o perfil após 1s
      setTimeout(() => (window.location.href = "perfil.html"), 1000);
    } else {
      mostrarMensagem("msg-login", "❌ Email ou senha incorretos.");
    }
  });
}

// ---------------------- CADASTRO ----------------------
const cadastroForm = document.getElementById("cadastro-form");
if (cadastroForm) {
  cadastroForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const cidade = document.getElementById("cidade").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const confirmar = document.getElementById("confirmar").value.trim();

    if (!nome || !email || !cpf || !cidade || !senha || !confirmar) {
      mostrarMensagem("msg-cadastro", "⚠️ Preencha todos os campos.");
      return;
    }

    if (senha !== confirmar) {
      mostrarMensagem("msg-cadastro", "⚠️ As senhas não coincidem.");
      return;
    }

    if (cpf.length !== 11 || isNaN(cpf)) {
      mostrarMensagem("msg-cadastro", "⚠️ CPF inválido (use 11 números).");
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    if (usuarios.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      mostrarMensagem("msg-cadastro", "⚠️ Este e-mail já está cadastrado.");
      return;
    }

    usuarios.push({ nome, email, cpf, cidade, senha });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    mostrarMensagem("msg-cadastro", "✅ Cadastro realizado com sucesso!", "sucesso");

    cadastroForm.reset();
    setTimeout(() => {
      cadastroBox.classList.remove("active");
      loginBox.classList.add("active");
    }, 1000);
  });
}

// ---------------------- RECUPERAR SENHA ----------------------
const recForm = document.getElementById("recuperar-form");
if (recForm) {
  recForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("rec-email").value.trim();

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const user = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (user) {
      mostrarMensagem("msg-rec", "📧 Instruções enviadas para seu email.", "sucesso");
    } else {
      mostrarMensagem("msg-rec", "❌ Email não encontrado.");
    }

    recForm.reset();
    setTimeout(() => {
      recuperarBox.classList.remove("active");
      loginBox.classList.add("active");
    }, 2000);
  });
}
