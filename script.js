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

    // Variáveis da busca e dos cards
    const inputBusca = document.getElementById('campoPesquisa');
    
    const formAnunciarCarro = document.getElementById('formAnunciarCarro');
    const btnExcluirConta = document.getElementById('btnExcluirConta');
    
    // Variáveis da Modal 
    const modal = document.getElementById('carroModal');
    const fecharModal = document.getElementById('fecharModal');
    const modalBody = document.getElementById('modalBody');


    // --- FUNÇÕES DE UTILIDADE GERAL ---
    
    // Feedback Sutil (Pop-up) - Fundo Preto e Texto Branco
    const msgFeedback = document.createElement('div');
    msgFeedback.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background-color: #000; color: #fff; padding: 10px 20px; z-index: 1000; border-radius: 5px; opacity: 0; transition: opacity 0.5s; font-size: 14px;';
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
                const confirmaSenha = document.getElementById('cadastroConfirmaSenha').value; 
                
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
                
                const emailRecuperacao = document.getElementById('esqueciEmail').value; 
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
                
                const modeloCompleto = document.getElementById('anuncioModelo').value;
                const preco = parseFloat(document.getElementById('anuncioPreco').value);
                const descricao = document.getElementById('anuncioDescricao').value; 
                const imagemInput = document.getElementById('anuncioImagem');
                
                if (imagemInput.files.length === 0) {
                     mostrarFeedback('Por favor, selecione uma imagem.');
                     return;
                }
                
                // Simulação de extração de dados para o card/modal
                const modeloPartes = modeloCompleto.split(' ');
                const ano = parseInt(modeloPartes.pop()) || new Date().getFullYear();
                const nomeCarro = modeloPartes.join(' ');
                const marca = nomeCarro.split(' ')[0]; // Simples extração da marca

                const reader = new FileReader();
                reader.onload = function(event) {
                    const imagemBase64 = event.target.result;
                    
                    let carrosAVenda = JSON.parse(localStorage.getItem('carrosAVenda')) || [];
                    
                    const novoCarro = {
                        id: Date.now(), // ID único
                        vendedor: usuarioLogado.nome, // Nome do vendedor
                        nome: nomeCarro, // Nome do carro
                        marca: marca,
                        ano: ano,
                        estado: usuarioLogado.estado, 
                        preco: preco,
                        km: 0, // Quilometragem padrão para novo anúncio
                        descricao: descricao, 
                        imagem: imagemBase64 
                    };
                    
                    carrosAVenda.push(novoCarro);
                    localStorage.setItem('carrosAVenda', JSON.stringify(carrosAVenda));
                    
                    mostrarFeedback(`Carro ${nomeCarro} anunciado com sucesso!`);
                    formAnunciarCarro.reset(); 
                };
                
                reader.readAsDataURL(imagemInput.files[0]);
            });
        }
    }

    // --- NOVO: DADOS E LÓGICA DE GERAÇÃO DE CARDS (Para carros.html e index.html) ---

    // Dados base (Simulação de um estoque inicial)
    const dadosCarros = [
        { 
            id: 11, nome: "Nissan Versa", marca: "Nissan", ano: 2020, estado: "DF", preco: 68000, 
            km: 55000, vendedor: "João Silva", descricao: "Carro de único dono, muito novo, todas as revisões feitas na concessionária.", 
            imagem: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Nissan_Tiida_%E2%80%93_Frontansicht%2C_7._Juni_2011%2C_Mettmann.jpg" 
        },
        { 
            id: 3, nome: "Fiat Uno Mille", marca: "Fiat", ano: 2013, estado: "MG", preco: 25000, 
            km: 120000, vendedor: "Maria Oliveira", descricao: "O clássico Uno, excelente para o dia a dia. Documentação em ordem.", 
            imagem: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Fiat_uno.jpg" 
        },
        { 
            id: 1, nome: "Hyundai HB20 Sedan", marca: "Hyundai", ano: 2016, estado: "SP", preco: 40000, 
            km: 80000, vendedor: "Pedro Costa", descricao: "Versão sedan, confortável e econômico. Pneus novos.", 
            imagem: "https://upload.wikimedia.org/wikipedia/commons/3/30/2023_Hyundai_HB20_1.0_T-GDi_Platinum_Plus_%28Brazil%29_front_view.png" 
        },
        { 
            id: 6, nome: "Kia Besta Pregio", marca: "Kia", ano: 2006, estado: "PR", preco: 11000, 
            km: 250000, vendedor: "Ana Pereira", descricao: "Ótima para transporte de cargas ou passageiros. Precisa de alguns reparos.", 
            imagem: "https://upload.wikimedia.org/wikipedia/commons/9/90/Kia_Besta_II_2.7d_Cargo_Van_2006_%2814901165220%29.jpg" 
        },
        { 
            id: 2, nome: "Toyota Hatch Yaris", marca: "Toyota", ano: 2017, estado: "SP", preco: 55000, 
            km: 45000, vendedor: "Lucas Fernandes", descricao: "Carro compacto, seguro e com baixa quilometragem. Perfeito estado.", 
            imagem: "https://upload.wikimedia.org/wikipedia/commons/5/53/2018_Toyota_Yaris_%28NCP130R%29_Ascent_5-door_hatchback_%282018-10-01%29_01.jpg" 
        },
        { 
            id: 12, nome: "Ford Fiesta", marca: "Ford", ano: 2016, estado: "MT", preco: 39000, 
            km: 95000, vendedor: "Fernanda Lima", descricao: "Motor 1.6, completo. Pequenos detalhes na pintura.", 
            imagem: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Ford_Fiesta_ST-Line_%28VII%2C_Facelift%29_%E2%80%93_f_30012023.jpg" 
        },
        { 
            id: 10, nome: "Chevrolet Corsa", marca: "Chevrolet", ano: 2008, estado: "CE", preco: 15000, 
            km: 180000, vendedor: "Rafael Santos", descricao: "Carro popular, econômico e manutenção barata. Ideal para iniciantes.", 
            imagem: "https://upload.wikimedia.org/wikipedia/commons/6/60/Corsa_sport_2004.jpg" 
        },
        { 
            id: 4, nome: "Sedan Lada Samara", marca: "Lada", ano: 2012, estado: "RS", preco: 30000, 
            km: 110000, vendedor: "Patrícia Souza", descricao: "Sedan espaçoso, mecânica robusta. Clássico para colecionadores.", 
            imagem: "https://upload.wikimedia.org/wikipedia/commons/b/b2/1991_Lada_Samara_1300_5-door_hatchback_%282015-07-16%29_01.jpg" 
        },
        { 
            id: 8, nome: "Volkswagen Fusca Typ1", marca: "Volkswagen", ano: 2003, estado: "ES", preco: 18000, 
            km: 75000, vendedor: "Fábio Junior", descricao: "Fusca em ótimo estado de conservação. Motor revisado.", 
            imagem: "https://upload.wikimedia.org/wikipedia/commons/7/77/MHV_VW_K%C3%A4fer_Typ_82_01.jpg" 
        },
        { 
            id: 9, nome: "Renault Sandero", marca: "Renault", ano: 2019, estado: "BA", preco: 42000, 
            km: 60000, vendedor: "Carla Nunes", descricao: "Carro familiar, grande porta-malas. Documentos ok.", 
            imagem: "https://upload.wikimedia.org/wikipedia/commons/8/80/2023_Dacia_Sandero_Stepway_III_DSC_7295.jpg" 
        },
        { 
            id: 7, nome: "Lada Laika Riva", marca: "Lada", ano: 2012, estado: "PE", preco: 35000, 
            km: 90000, vendedor: "André Guedes", descricao: "Perfeito para quem busca um carro único e estiloso. Raridade!", 
            imagem: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Lada_2107_aka_Lada_Riva_October_1995_1452cc.jpg" 
        },
        { 
            id: 5, nome: "Toyota Etios Liva", marca: "Toyota", ano: 2018, estado: "RJ", preco: 40000, 
            km: 70000, vendedor: "Viviane Rosa", descricao: "Hatchback confiável e muito econômico. Revisão em dia.", 
            imagem: "https://upload.wikimedia.org/wikipedia/commons/f/ff/2013_Toyota_Etios_Valco_E_%28Indonesia%29_front_view.jpg" 
        },
    ];

    // Combina carros iniciais + carros anunciados por usuários
    const carrosAnunciados = JSON.parse(localStorage.getItem('carrosAVenda')) || [];
    const todosCarros = [...dadosCarros, ...carrosAnunciados];

    // Elemento onde os cards serão adicionados
    const containerCarros = document.getElementById('listaCarros') || document.querySelector('.grid-destaques');


    // Função para preencher a modal com os dados
    function preencherModal(carro) {
        const precoFormatado = carro.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });
        const kmFormatado = carro.km.toLocaleString('pt-BR');

        modalBody.innerHTML = `
            <div class="modal-conteudo-grid">
                <div class="modal-imagem">
                    <img src="${carro.imagem}" alt="${carro.nome}">
                </div>
                
                <div class="modal-info-principal">
                    <h3>${carro.nome}</h3>
                    <p class="modal-preco">${precoFormatado}</p>
                    <p><strong>Vendedor:</strong> ${carro.vendedor}</p>
                    <p><strong>Marca:</strong> ${carro.marca}</p>
                    <p><strong>Ano:</strong> ${carro.ano}</p>
                    <p><strong>KM Rodado:</strong> ${kmFormatado} km</p>
                    <p><strong>Estado:</strong> ${carro.estado}</p>
                </div>

                <div class="modal-descricao">
                    <h4>Descrição do Vendedor:</h4>
                    <p>${carro.descricao}</p>
                </div>
            </div>

            <div class="modal-acoes">
                <button id="btnInteresse" class="btn-principal">
                    💬 Tenho Interesse (Enviar WhatsApp)
                </button>
                <button id="btnDenuncia" class="btn-denuncia">
                    ⚠️ Denunciar Anúncio
                </button>
            </div>
        `;
        
        // Lógica para os botões de Ação
        
        // Botão "Tenho Interesse" (Simulação de WhatsApp)
        document.getElementById('btnInteresse').addEventListener('click', function() {
            const mensagem = encodeURIComponent(`Olá, vi o anúncio do carro ${carro.nome} (${carro.ano}) na Garagem do Alemão e tenho interesse. Poderia me passar mais detalhes?`);
            // Número de WhatsApp genérico, substitua pelo do vendedor se fosse real
            const linkWhatsApp = `https://wa.me/5511999999999?text=${mensagem}`;
            window.open(linkWhatsApp, '_blank');
            mostrarFeedback(`Redirecionando para o WhatsApp do vendedor ${carro.vendedor}...`);
            fecharCarroModal();
        });

        // Botão "Denunciar Anúncio"
        document.getElementById('btnDenuncia').addEventListener('click', function() {
            if (confirm(`Tem certeza que deseja denunciar o anúncio do ${carro.nome} do vendedor ${carro.vendedor}?`)) {
                mostrarFeedback(`O anúncio do ${carro.nome} foi denunciado. Analisaremos em breve.`);
                fecharCarroModal();
            }
        });
    }

    // Fecha a modal
    function fecharCarroModal() {
        if (modal) {
            modal.classList.add('oculto');
            document.body.style.overflow = ''; // Restaura a rolagem
        }
    }

    // Função para adicionar os Listeners da Modal nos botões de "Ver detalhes"
    function adicionarListenersModal() {
        const botoesDetalhes = document.querySelectorAll('.btn-detalhes-modal');
        botoesDetalhes.forEach(botao => {
            botao.addEventListener('click', function(e) {
                e.preventDefault();
                const carroId = parseInt(this.getAttribute('data-id'));
                const carroSelecionado = todosCarros.find(carro => carro.id === carroId);
                
                if (carroSelecionado) {
                    preencherModal(carroSelecionado); 
                    modal.classList.remove('oculto');
                    document.body.style.overflow = 'hidden'; 
                }
            });
        });
    }

    // Função para renderizar os cards no HTML
    function renderizarCarros(lista, maxCards = null) {
        if (!containerCarros) return;
        containerCarros.innerHTML = ''; // Limpa o container
        
        const listaRenderizar = maxCards ? lista.slice(0, maxCards) : lista;

        listaRenderizar.forEach(carro => {
            const card = document.createElement('div');
            card.classList.add('card-carro');
            card.setAttribute('data-id', carro.id); 
            
            // Formatando o preço para BRL
            const precoFormatado = carro.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });

            card.innerHTML = `
                <img src="${carro.imagem}" alt="${carro.nome}">
                <div class="card-info">
                    <h4 class="nome-carro">${carro.nome}</h4>
                    <p>${carro.ano} | ${carro.estado} | ${precoFormatado}</p>
                    <a href="#" class="btn-detalhes-modal" data-id="${carro.id}">Ver detalhes</a>
                </div>
            `;
            containerCarros.appendChild(card);
        });
        
        adicionarListenersModal(); // Adiciona os listeners nos novos botões
    }
    
    // Configura o fechamento da Modal
    if (fecharModal) {
        fecharModal.addEventListener('click', fecharCarroModal);
    }
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                fecharCarroModal();
            }
        });
    }

    // --- LÓGICA DA PÁGINA CARROS.HTML (PESQUISA) ---
    if (inputBusca) {
        // Renderiza todos os carros na página "carros.html"
        renderizarCarros(todosCarros); 
        
        // Adiciona o listener para a pesquisa (Busca)
        inputBusca.addEventListener('keyup', function() {
            const termoDigitado = inputBusca.value.toLowerCase();
            
            // Filtra o array de dados por nome, marca, ano ou estado
            const carrosFiltrados = todosCarros.filter(carro => {
                const termoBusca = `${carro.nome} ${carro.marca} ${carro.ano} ${carro.estado}`.toLowerCase();
                return termoBusca.includes(termoDigitado);
            });
            
            renderizarCarros(carrosFiltrados);
            
            if (carrosFiltrados.length === 0 && termoDigitado.length > 0) {
                 mostrarFeedback('Nenhum carro encontrado com esse termo.');
            }
        });
    }
    
    // --- LÓGICA DA PÁGINA HOME.HTML (DESTAQUES) ---
    // Verifica se estamos na index.html pelo caminho da URL
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || containerCarros && !inputBusca) {
        // Renderiza apenas os 8 primeiros carros na página inicial (Destaques)
        renderizarCarros(todosCarros, 8); 
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
