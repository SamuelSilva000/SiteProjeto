document.addEventListener('DOMContentLoaded', function() {

    // --- VARIÁVEIS GLOBAIS ---
    const formLogin = document.getElementById('formLogin');
    const formCadastro = document.getElementById('formCadastro');
    const formEsqueciSenha = document.getElementById('formEsqueciSenha');

    const areaPerfil = document.querySelector('.area-perfil');
    const linkConta = document.getElementById('linkConta');
    
    const linkCadastro = document.getElementById('linkCadastro');
    const linkVoltarLogin = document.getElementById('linkVoltarLogin');
    const linkVoltarLogin2 = document.getElementById('linkVoltarLogin2');
    const linkEsqueciSenha = document.getElementById('linkEsqueciSenha');

    const inputCep = document.getElementById('cep');
    const inputEndereco = document.getElementById('endereco');
    const inputBairro = document.getElementById('bairro');
    const inputCidade = document.getElementById('cidade');
    const inputEstado = document.getElementById('estado');

    const inputBusca = document.getElementById('campoPesquisa');
    const listaCarros = document.querySelectorAll('.card-carro');
    
    const formAnunciarCarro = document.getElementById('formAnunciarCarro');
    const btnExcluirConta = document.getElementById('btnExcluirConta');


    // --- FUNÇÕES DE UTILIDADE GERAL ---
    
    // Feedback Sutil (Pop-up) - Fundo Preto e Texto Branco
    const msgFeedback = document.createElement('div');
    msgFeedback.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background-color: var(--preto); color: var(--branco); padding: 10px 20px; z-index: 1000; border-radius: 5px; opacity: 0; transition: opacity 0.5s; font-size: 14px;';
    document.body.appendChild(msgFeedback);

    function mostrarFeedback(mensagem) {
        if (window.location.pathname.includes('contato.html')) {
            return; 
        }
        
        msgFeedback.textContent = mensagem;
        msgFeedback.style.opacity = '1';
        setTimeout(() => {
            msgFeedback.style.opacity = '0';
        }, 3000);
    }
    
    function validarSenhaForte(senha) {
        const regexMinLength = /.{6,}/; 
        const regexUpperCase = /[A-Z]/;
        const regexSpecialChar = /[!@#$%^&*]/; 

        return regexMinLength.test(senha) && regexUpperCase.test(senha) && regexSpecialChar.test(senha);
    }
    

    // --- LÓGICA DE LOCALSTORAGE (Simulação de Back-end) ---

    function inicializarLocalStorage() {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const adminExists = users.some(user => user.email === 'admin@garagem.com');
        if (!adminExists) {
            users.push({
                nome: 'Admin',
                email: 'admin@garagem.com',
                senha: 'Admin@123', 
                cep: '01001000',
                endereco: 'Praça da Sé',
                bairro: 'Sé',
                cidade: 'São Paulo',
                estado: 'SP',
                numero: '123'
            });
            localStorage.setItem('users', JSON.stringify(users));
        }

        if (!localStorage.getItem('carrosAVenda')) {
             localStorage.setItem('carrosAVenda', JSON.stringify([]));
        }
    }
    
    // --- FUNÇÕES DE NAVEGAÇÃO E EXIBIÇÃO ---

    function redirecionarParaPerfil() {
        window.location.href = 'perfil.html';
    }
    
    function redirecionarParaLogin() {
        window.location.href = 'conta.html';
    }
    
    function mostrarLogin() {
        if (formLogin) formLogin.classList.remove('oculto');
        if (formCadastro) formCadastro.classList.add('oculto');
        if (formEsqueciSenha) formEsqueciSenha.classList.add('oculto');
    }

    function mostrarCadastro() {
        if (formLogin) formLogin.classList.add('oculto');
        if (formCadastro) formCadastro.classList.remove('oculto');
        if (formEsqueciSenha) formEsqueciSenha.classList.add('oculto');
    }

    function mostrarEsqueciSenha() {
        if (formLogin) formLogin.classList.add('oculto');
        if (formCadastro) formCadastro.classList.add('oculto');
        if (formEsqueciSenha) formEsqueciSenha.classList.remove('oculto');
    }
    
    function verificarStatusLogin() {
        const usuarioLogado = localStorage.getItem('usuarioLogado');
        
        if (linkConta) {
            if (usuarioLogado) {
                linkConta.textContent = 'Meu Perfil'; 
                linkConta.href = 'perfil.html';
            } else {
                linkConta.textContent = 'Minha Conta';
                linkConta.href = 'conta.html';
            }
        }

        if (areaPerfil && !usuarioLogado) {
            redirecionarParaLogin();
        }
    }


    // --- LÓGICA DA PÁGINA CONTA.HTML (LOGIN/CADASTRO/RECUPERAÇÃO/VIA CEP) ---
    
    if (formLogin) { 
        inicializarLocalStorage(); 
        mostrarLogin(); 

        if (linkCadastro) linkCadastro.addEventListener('click', function(e) {
            e.preventDefault();
            mostrarCadastro();
        });

        if (linkVoltarLogin) linkVoltarLogin.addEventListener('click', function(e) {
            e.preventDefault();
            mostrarLogin();
        });
        
        if (linkVoltarLogin2) linkVoltarLogin2.addEventListener('click', function(e) {
            e.preventDefault();
            mostrarLogin();
        });
        
        if (linkEsqueciSenha) linkEsqueciSenha.addEventListener('click', function(e) {
            e.preventDefault();
            mostrarEsqueciSenha();
        });

        formLogin.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = document.getElementById('loginEmail').value;
            const senhaInput = document.getElementById('loginSenha').value;
            let users = JSON.parse(localStorage.getItem('users')) || [];
            const usuarioEncontrado = users.find(user => 
                user.email === emailInput && user.senha === senhaInput
            );

            if (usuarioEncontrado) {
                localStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));
                mostrarFeedback(`Bem-vindo, ${usuarioEncontrado.nome}!`);
                redirecionarParaPerfil();
            } else {
                mostrarFeedback('Email ou senha inválidos.');
            }
        });
        
        if (formCadastro) {
            formCadastro.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const nome = document.getElementById('cadastroNome').value;
                const email = document.getElementById('cadastroEmail').value;
                const senha = document.getElementById('cadastroSenha').value;
                const confirmaSenha = document.getElementById('cadastroConfirmaSenha').value; // NOVO CAMPO
                
                const cep = inputCep ? inputCep.value : '';
                const endereco = inputEndereco ? inputEndereco.value : '';
                const bairro = inputBairro ? inputBairro.value : '';
                const cidade = inputCidade ? inputCidade.value : '';
                const estado = inputEstado ? inputEstado.value : '';
                const numero = document.getElementById('numero').value;

                let users = JSON.parse(localStorage.getItem('users')) || [];

                if (users.some(user => user.email === email)) {
                    mostrarFeedback('Este email já está cadastrado!');
                    return;
                }
                
                // VALIDAÇÃO DE SENHAS IGUAIS
                if (senha !== confirmaSenha) {
                    mostrarFeedback('As senhas digitadas não coincidem.');
                    return;
                }
                
                if (!validarSenhaForte(senha)) {
                    mostrarFeedback('A senha deve ter no mínimo 6 caracteres, 1 letra maiúscula e incluir 1 caractere especial.');
                    return;
                }

                const novoUsuario = {
                    nome: nome, email: email, senha: senha, cep: cep, endereco: endereco, 
                    bairro: bairro, cidade: cidade, estado: estado, numero: numero
                };

                users.push(novoUsuario);
                localStorage.setItem('users', JSON.stringify(users));
                mostrarFeedback('Cadastro realizado com sucesso! Faça o Login.');
                mostrarLogin();
            });
        }
        
        if (formEsqueciSenha) {
            formEsqueciSenha.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const emailRecuperacao = document.getElementById('esqueciEmail').value; // Corrigido ID para 'esqueciEmail'
                let users = JSON.parse(localStorage.getItem('users')) || [];
                const usuarioEncontrado = users.find(user => user.email === emailRecuperacao);

                mostrarFeedback('Se o email estiver cadastrado, as instruções de recuperação de senha foram enviadas.');
                
                formEsqueciSenha.reset(); 
                mostrarLogin(); 
            });
        }
        
        if (inputCep) {
            function limparEndereco() {
                if(inputEndereco) inputEndereco.value = "";
                if(inputBairro) inputBairro.value = "";
                if(inputCidade) inputCidade.value = "";
                if(inputEstado) inputEstado.value = "";
            }

            inputCep.addEventListener('blur', function() {
                const cep = inputCep.value.replace(/\D/g, ''); 

                if (cep.length != 8) {
                    limparEndereco();
                    return;
                }

                const url = `https://viacep.com.br/ws/${cep}/json/`;

                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        if (!data.erro) {
                            if(inputEndereco) inputEndereco.value = data.logradouro;
                            if(inputBairro) inputBairro.value = data.bairro;
                            if(inputCidade) inputCidade.value = data.localidade;
                            if(inputEstado) inputEstado.value = data.uf;
                        } else {
                            mostrarFeedback("CEP não encontrado.");
                            limparEndereco();
                        }
                    })
                    .catch(error => {
                        console.error('Erro na busca do CEP:', error);
                        mostrarFeedback("Erro ao conectar com a API ViaCEP.");
                        limparEndereco();
                    });
            });
        }
    }


    // --- LÓGICA DA PÁGINA PERFIL.HTML ---
    if (areaPerfil) {
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
        
        document.getElementById('nomeUsuario').textContent = usuarioLogado.nome;
        document.getElementById('perfilEmail').textContent = usuarioLogado.email;
        document.getElementById('perfilCep').textContent = usuarioLogado.cep;
        
        const enderecoCompleto = 
            `${usuarioLogado.endereco || 'N/A'}, Nº ${usuarioLogado.numero || 'N/A'} - ${usuarioLogado.bairro || 'N/A'} - ${usuarioLogado.cidade || 'N/A'}/${usuarioLogado.estado || 'N/A'}`;
            
        document.getElementById('perfilEndereco').textContent = enderecoCompleto;

        document.getElementById('btnSair').addEventListener('click', function() {
            localStorage.removeItem('usuarioLogado'); 
            mostrarFeedback('Você saiu da sua conta.'); 
            redirecionarParaLogin();
        });
        
        if (btnExcluirConta) {
            btnExcluirConta.addEventListener('click', function() {
                const confirmacao = confirm("ATENÇÃO: Você tem certeza que deseja excluir sua conta permanentemente? Esta ação é irreversível.");
                
                if (confirmacao) {
                    const emailAtual = usuarioLogado.email;
                    let users = JSON.parse(localStorage.getItem('users')) || [];
                    
                    const novaListaUsers = users.filter(user => user.email !== emailAtual);
                    
                    localStorage.setItem('users', JSON.stringify(novaListaUsers));
                    localStorage.removeItem('usuarioLogado'); 
                    
                    mostrarFeedback('Conta excluída com sucesso. Redirecionando...');
                    redirecionarParaLogin();
                }
            });
        }
        
        if (formAnunciarCarro) {
            formAnunciarCarro.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const modelo = document.getElementById('anuncioModelo').value;
                const preco = document.getElementById('anuncioPreco').value;
                const descricao = document.getElementById('anuncioDescricao').value; 
                const imagemInput = document.getElementById('anuncioImagem');
                
                if (imagemInput.files.length === 0) {
                     mostrarFeedback('Por favor, selecione uma imagem.');
                     return;
                }
                
                const reader = new FileReader();
                reader.onload = function(event) {
                    const imagemBase64 = event.target.result;
                    
                    let carrosAVenda = JSON.parse(localStorage.getItem('carrosAVenda')) || [];
                    
                    const novoCarro = {
                        id: Date.now(), 
                        vendedorEmail: usuarioLogado.email,
                        modelo: modelo,
                        preco: preco,
                        descricao: descricao, 
                        imagem: imagemBase64 
                    };
                    
                    carrosAVenda.push(novoCarro);
                    localStorage.setItem('carrosAVenda', JSON.stringify(carrosAVenda));
                    
                    mostrarFeedback(`Carro ${modelo} anunciado com sucesso!`);
                    formAnunciarCarro.reset(); 
                };
                
                reader.readAsDataURL(imagemInput.files[0]);
            });
        }
    }


    // --- LÓGICA DA PÁGINA CARROS.HTML (PESQUISA) ---
    if (inputBusca) {
        inputBusca.addEventListener('keyup', function() {
            const termoDigitado = inputBusca.value.toLowerCase();
            listaCarros.forEach(function(carro) {
                const nomeCarro = carro.querySelector('.nome-carro').innerText.toLowerCase();
                if (nomeCarro.includes(termoDigitado)) {
                    carro.style.display = 'flex'; 
                } else {
                    carro.style.display = 'none'; 
                }
            });
        });
    }

    // --- LÓGICA DA PÁGINA CONTATO.HTML ---
    const formContato = document.getElementById('formContato');
    const msgFeedbackContato = document.getElementById('msgFeedbackContato');

    if (formContato) {
        formContato.addEventListener('submit', function(e) {
            e.preventDefault(); 
            
            const nome = document.getElementById('contatoNome').value;
            
            msgFeedbackContato.textContent = `Obrigado, ${nome}! Sua mensagem foi enviada com sucesso e responderemos em breve.`;
            msgFeedbackContato.classList.remove('oculto');
            
            setTimeout(() => {
                formContato.reset();
            }, 500);

            setTimeout(() => {
                msgFeedbackContato.classList.add('oculto');
            }, 5000);
        });
    }

    // --- EXECUÇÃO INICIAL ---
    verificarStatusLogin(); 
});
