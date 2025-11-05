(function (window, document) {
  'use strict';

  // ---------------------- Armazenamento Local ----------------------
  const Armazenamento = {
    ler(chave, padrao = null) {
      try {
        const bruto = localStorage.getItem(chave);
        return bruto ? JSON.parse(bruto) : padrao;
      } catch (e) {
        return padrao;
      }
    },
    escrever(chave, valor) {
      localStorage.setItem(chave, JSON.stringify(valor));
    },
    remover(chave) {
      localStorage.removeItem(chave);
    }
  };

  // ---------------------- Repositórios ------------------------------
  const UsuariosRepositorio = {
    CHAVE: 'usuarios',
    obterTodos() {
      return Armazenamento.ler(this.CHAVE, []);
    },
    salvarTodos(lista) {
      Armazenamento.escrever(this.CHAVE, lista);
    },
    removerPorEmail(email) {
      const novaLista = this.obterTodos().filter(u => u.email !== email);
      this.salvarTodos(novaLista);
    }
  };

  const AnunciosRepositorio = {
    CHAVE: 'anuncios',
    obterTodos() {
      return Armazenamento.ler(this.CHAVE, []);
    },
    salvarTodos(lista) {
      Armazenamento.escrever(this.CHAVE, lista);
    },
    removerPorEmail(email) {
      const novaLista = this.obterTodos().filter(a => a.email !== email);
      this.salvarTodos(novaLista);
    }
  };

  // ---------------------- Sessão do Usuário -------------------------
  const Sessao = {
    CHAVE: 'sessaoUsuario',
    obter() {
      return Armazenamento.ler(this.CHAVE, null);
    },
    limpar() {
      Armazenamento.remover(this.CHAVE);
    }
  };

  const IU = {
    navegar(url) {
      window.location.href = url;
    },
    alerta(txt) {
      alert(txt);
    }
  };

  // ---------------------- Página de Perfil -------------------------
  document.addEventListener('DOMContentLoaded', () => {
    const usuario = Sessao.obter();

    // Se não estiver logado, volta para a tela de login
    if (!usuario) {
      IU.navegar('entrar.html');
      return;
    }

    // Preenche as informações do perfil
    document.getElementById('perfil-nome').textContent = usuario.nome || '';
    document.getElementById('perfil-email').textContent = usuario.email || '';
    document.getElementById('perfil-cpf').textContent = usuario.cpf || '';
    document.getElementById('perfil-cidade').textContent = usuario.cidade || '';

    const btnExcluirAnuncios = document.getElementById('excluir-anuncios');
    const btnExcluirPerfil = document.getElementById('excluir-perfil');
    const btnSair = document.getElementById('sair');

    // Excluir todos os anúncios do usuário
    if (btnExcluirAnuncios) {
      btnExcluirAnuncios.addEventListener('click', () => {
        if (confirm('Deseja realmente excluir todos os seus anúncios?')) {
          AnunciosRepositorio.removerPorEmail(usuario.email);
          IU.alerta('Seus anúncios foram excluídos.');
        }
      });
    }

    // Excluir o perfil do usuário (e anúncios)
    if (btnExcluirPerfil) {
      btnExcluirPerfil.addEventListener('click', () => {
        if (confirm('Deseja realmente excluir seu perfil? Esta ação é irreversível.')) {
          UsuariosRepositorio.removerPorEmail(usuario.email);
          AnunciosRepositorio.removerPorEmail(usuario.email);
          Sessao.limpar();
          IU.alerta('Perfil excluído com sucesso.');
          IU.navegar('entrar.html');
        }
      });
    }

    // Botão sair — limpa a sessão e volta à tela de login
    if (btnSair) {
      btnSair.addEventListener('click', () => {
        Sessao.limpar();
      });
    }
  });

})(window, document);
