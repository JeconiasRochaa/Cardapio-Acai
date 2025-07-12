document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const tipoRadios = document.querySelectorAll('input[name="tipo"]');
    const tamanhoAcaiSection = document.getElementById('tamanho-acai');
    const tamanhoSorveteSection = document.getElementById('tamanho-sorvete');
    const acompSection = document.getElementById('acompanhamentos-section');
    const extrasSection = document.getElementById('extras-section');
    const caldasSection = document.getElementById('caldas-section');
    const limiteAcompSpan = document.querySelector('#limite-acomp span');
    const resumoDiv = document.getElementById('pedido-resumo');
    const totalSpan = document.querySelector('#total span');
    const finalizarBtn = document.getElementById('finalizar');
    const adicionarCarrinhoBtn = document.getElementById('adicionar-carrinho');
    const finalizarPedidoBtn = document.getElementById('finalizar-pedido');
    const carrinhoSection = document.getElementById('carrinho-section');
    const carrinhoItens = document.getElementById('carrinho-itens');
    const carrinhoTotalSpan = document.querySelector('#carrinho-total span');

    // Estado do pedido
    let pedido = {
        tipo: "Açaí",
        tamanho: null,
        acompanhamentos: [],
        extras: [],
        caldas: [],
        pagamento: "Dinheiro",
        endereco: null,
        total: 0
    };

    let carrinho = [];

    // Inicialização
    function init() {
        // Event listeners para tipo de produto
        tipoRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                pedido.tipo = this.value;
                pedido.tamanho = null;
                pedido.acompanhamentos = [];
                pedido.extras = [];
                pedido.caldas = [];
                
                // Mostra/esconde seções conforme o tipo
                if (pedido.tipo === "Açaí") {
                    tamanhoAcaiSection.style.display = 'block';
                    tamanhoSorveteSection.style.display = 'none';
                    acompSection.style.display = 'block';
                    extrasSection.style.display = 'block';
                } else {
                    tamanhoAcaiSection.style.display = 'none';
                    tamanhoSorveteSection.style.display = 'block';
                    acompSection.style.display = 'none';
                    extrasSection.style.display = 'none';
                }
                
                // Desmarca todos os tamanhos
                document.querySelectorAll('input[name="tamanho-acai"], input[name="tamanho-sorvete"]').forEach(input => {
                    input.checked = false;
                });
                
                // Atualiza limites
                atualizarLimites();
                atualizarResumo();
            });
        });

        // Event listeners para tamanhos
        document.querySelectorAll('input[name="tamanho-acai"], input[name="tamanho-sorvete"]').forEach(input => {
            input.addEventListener('change', function() {
                const dataset = this.dataset;
                pedido.tamanho = {
                    nome: this.value,
                    valor: parseFloat(dataset.valor),
                    acompMax: dataset.acomp ? parseInt(dataset.acomp) : 0
                };
                
                // Limpa seleções anteriores
                if (pedido.tipo === "Açaí") {
                    pedido.acompanhamentos = [];
                    document.querySelectorAll('input[name="acompanhamentos"]').forEach(cb => {
                        cb.checked = false;
                    });
                }
                
                pedido.caldas = [];
                document.querySelectorAll('input[name="caldas"]').forEach(cb => {
                    cb.checked = false;
                });
                
                atualizarLimites();
                atualizarResumo();
            });
        });

        // Event listeners para acompanhamentos
        document.querySelectorAll('input[name="acompanhamentos"]').forEach(input => {
            input.addEventListener('change', function() {
                const valorExtra = this.dataset.extra ? parseFloat(this.dataset.extra) : 0;
                
                if (this.checked) {
                    if (pedido.acompanhamentos.length < pedido.tamanho?.acompMax || 0) {
                        pedido.acompanhamentos.push({
                            nome: this.value,
                            valorExtra: valorExtra
                        });
                    } else {
                        this.checked = false;
                        alert(`Limite de ${pedido.tamanho.acompMax} acompanhamentos atingido!`);
                    }
                } else {
                    pedido.acompanhamentos = pedido.acompanhamentos.filter(a => a.nome !== this.value);
                }
                
                atualizarResumo();
            });
        });

        // Event listeners para extras
        document.querySelectorAll('input[name="extras"]').forEach(input => {
            input.addEventListener('change', function() {
                const valor = parseFloat(this.dataset.valor);
                
                if (this.checked) {
                    pedido.extras.push({
                        nome: this.value,
                        valor: valor
                    });
                } else {
                    pedido.extras = pedido.extras.filter(e => e.nome !== this.value);
                }
                
                atualizarResumo();
            });
        });

        // Event listeners para caldas
        document.querySelectorAll('input[name="caldas"]').forEach(input => {
            input.addEventListener('change', function() {
                if (this.checked) {
                    pedido.caldas.push(this.value);
                } else {
                    pedido.caldas = pedido.caldas.filter(c => c !== this.value);
                }
                
                atualizarResumo();
            });
        });

        // Event listeners para pagamento
        document.querySelectorAll('input[name="pagamento"]').forEach(input => {
            input.addEventListener('change', function() {
                pedido.pagamento = this.value;
                atualizarResumo();
            });
        });

        // Event listeners para botões
        adicionarCarrinhoBtn.addEventListener('click', adicionarAoCarrinho);
        finalizarBtn.addEventListener('click', finalizarPedido);
        finalizarPedidoBtn.addEventListener('click', finalizarTodosPedidos);
    }

    // Atualiza os limites exibidos
    function atualizarLimites() {
        if (pedido.tipo === "Açaí" && pedido.tamanho) {
            limiteAcompSpan.textContent = pedido.tamanho.acompMax;
        } else {
            limiteAcompSpan.textContent = '0';
        }
    }

    // Atualiza o resumo do pedido
    function atualizarResumo() {
        resumoDiv.innerHTML = '';
        
        if (!pedido.tamanho) {
            resumoDiv.innerHTML = '<p class="empty">Selecione um tamanho para ver o resumo</p>';
            totalSpan.textContent = '0,00';
            pedido.total = 0;
            return;
        }
        
        // Calcula o total
        let total = pedido.tamanho.valor;
        
        // Verifica se é cartão para adicionar acréscimo
        const acrescimoCartao = pedido.pagamento === "Cartão" ? 1 : 0;
        
        // Adiciona extras do açaí
        if (pedido.tipo === "Açaí") {
            // Acompanhamentos com valor extra
            total += pedido.acompanhamentos.reduce((sum, a) => sum + a.valorExtra, 0);
            
            // Extras premium
            total += pedido.extras.reduce((sum, e) => sum + e.valor, 0);
        }
        
        // Adiciona acréscimo do cartão
        total += acrescimoCartao;
        pedido.total = total;
        
        // Monta o resumo
        let html = `<p><strong>${pedido.tipo}:</strong> ${pedido.tamanho.nome} - R$ ${pedido.tamanho.valor.toFixed(2)}</p>`;
        
        if (pedido.tipo === "Açaí" && pedido.acompanhamentos.length > 0) {
            html += `<p><strong>Acompanhamentos (${pedido.acompanhamentos.length}/${pedido.tamanho.acompMax}):</strong> `;
            html += pedido.acompanhamentos.map(a => `${a.nome}${a.valorExtra > 0 ? ` (+R$ ${a.valorExtra.toFixed(2)})` : ''}`).join(', ');
            html += `</p>`;
        }
        
        if (pedido.caldas.length > 0) {
            html += `<p><strong>Caldas:</strong> ${pedido.caldas.join(', ')}</p>`;
        }
        
        if (pedido.tipo === "Açaí" && pedido.extras.length > 0) {
            html += `<p><strong>Extras:</strong> `;
            html += pedido.extras.map(e => `${e.nome} (+R$ ${e.valor.toFixed(2)})`).join(', ');
            html += `</p>`;
        }
        
        html += `<p><strong>Pagamento:</strong> ${pedido.pagamento}`;
        
        if (acrescimoCartao > 0) {
            html += ` <small>(+R$ ${acrescimoCartao.toFixed(2)})</small>`;
        }
        
        html += `</p>`;
        
        resumoDiv.innerHTML = html;
        totalSpan.textContent = total.toFixed(2);
    }

    // Adiciona pedido ao carrinho
    function adicionarAoCarrinho() {
        if (!pedido.tamanho) {
            alert('Selecione um tamanho antes de adicionar ao carrinho!');
            return;
        }

        // Cria cópia do pedido atual
        const novoItem = JSON.parse(JSON.stringify(pedido));
        novoItem.id = Date.now();
        
        carrinho.push(novoItem);
        atualizarCarrinho();
        resetarFormulario();
        
        carrinhoSection.style.display = 'block';
        finalizarPedidoBtn.style.display = 'block';
    }

    // Atualiza a exibição do carrinho
    function atualizarCarrinho() {
        carrinhoItens.innerHTML = '';
        let totalCarrinho = 0;
        
        carrinho.forEach(item => {
            totalCarrinho += item.total;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'carrinho-item';
            itemElement.innerHTML = `
                <h3>${item.tipo} ${item.tamanho.nome} - R$ ${item.total.toFixed(2)}</h3>
                ${item.acompanhamentos.length > 0 ? `<p><strong>Acomp:</strong> ${item.acompanhamentos.map(a => a.nome).join(', ')}</p>` : ''}
                ${item.caldas.length > 0 ? `<p><strong>Caldas:</strong> ${item.caldas.join(', ')}</p>` : ''}
                ${item.extras.length > 0 ? `<p><strong>Extras:</strong> ${item.extras.map(e => e.nome).join(', ')}</p>` : ''}
                <p><strong>Pagamento:</strong> ${item.pagamento}</p>
                <button class="remover-item" data-id="${item.id}"><i class="fas fa-times"></i></button>
            `;
            
            carrinhoItens.appendChild(itemElement);
        });
        
        carrinhoTotalSpan.textContent = totalCarrinho.toFixed(2);
        
        document.querySelectorAll('.remover-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                carrinho = carrinho.filter(item => item.id !== itemId);
                atualizarCarrinho();
                
                if (carrinho.length === 0) {
                    carrinhoSection.style.display = 'none';
                    finalizarPedidoBtn.style.display = 'none';
                }
            });
        });
    }

    // Reseta o formulário
    function resetarFormulario() {
        pedido = {
            tipo: document.querySelector('input[name="tipo"]:checked').value,
            tamanho: null,
            acompanhamentos: [],
            extras: [],
            caldas: [],
            pagamento: document.querySelector('input[name="pagamento"]:checked').value,
            endereco: null,
            total: 0
        };
        
        document.querySelectorAll('input[name="tamanho-acai"], input[name="tamanho-sorvete"]').forEach(input => {
            input.checked = false;
        });
        
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        
        atualizarResumo();
    }

    // Finaliza um único pedido
    function finalizarPedido() {
        if (!pedido.tamanho) {
            alert('Selecione um tamanho antes de finalizar!');
            return;
        }
        
        const endereco = document.getElementById('endereco').value;
        const bairro = document.getElementById('bairro').value;
        const telefone = document.getElementById('telefone').value;
        
        if (!endereco || !bairro || !telefone) {
            alert('Preencha todos os campos obrigatórios do endereço!');
            return;
        }
        
        pedido.endereco = {
            rua: endereco,
            complemento: document.getElementById('complemento').value,
            bairro: bairro,
            telefone: telefone,
            observacoes: document.getElementById('observacoes').value
        };
        
        enviarPedidoWhatsApp([pedido]);
    }

    // Finaliza todos os pedidos do carrinho
    function finalizarTodosPedidos() {
        if (carrinho.length === 0) {
            alert('Adicione itens ao carrinho antes de finalizar!');
            return;
        }
        
        const endereco = document.getElementById('endereco').value;
        const bairro = document.getElementById('bairro').value;
        const telefone = document.getElementById('telefone').value;
        
        if (!endereco || !bairro || !telefone) {
            alert('Preencha todos os campos obrigatórios do endereço!');
            return;
        }
        
        // Adiciona endereço a todos os itens
        carrinho.forEach(item => {
            item.endereco = {
                rua: endereco,
                complemento: document.getElementById('complemento').value,
                bairro: bairro,
                telefone: telefone,
                observacoes: document.getElementById('observacoes').value
            };
        });
        
        enviarPedidoWhatsApp(carrinho);
    }

    // Envia pedido para WhatsApp
    function enviarPedidoWhatsApp(pedidos) {
        let mensagem = `🍇 *PEDIDO${pedidos.length > 1 ? 'S' : ''} - ${pedidos[0].tipo.toUpperCase()}* 🍇\n\n`;
        
        let totalGeral = 0;
        let totalCartoes = 0;
        
        pedidos.forEach((pedido, index) => {
            mensagem += `*Pedido ${index + 1}:*\n`;
            mensagem += `📏 ${pedido.tipo} ${pedido.tamanho.nome} - R$ ${pedido.tamanho.valor.toFixed(2)}\n`;
            
            if (pedido.tipo === "Açaí" && pedido.acompanhamentos.length > 0) {
                mensagem += `🍫 Acomp: ${pedido.acompanhamentos.map(a => a.nome).join(', ')}\n`;
            }
            
            if (pedido.caldas.length > 0) {
                mensagem += `🍯 Caldas: ${pedido.caldas.join(', ')}\n`;
            }
            
            if (pedido.tipo === "Açaí" && pedido.extras.length > 0) {
                mensagem += `✨ Extras: ${pedido.extras.map(e => e.nome).join(', ')}\n`;
            }
            
            const acrescimoCartao = pedido.pagamento === "Cartão" ? 1 : 0;
            totalCartoes += acrescimoCartao;
            
            mensagem += `💳 Pagamento: ${pedido.pagamento}`;
            
            if (acrescimoCartao > 0) {
                mensagem += ` (+R$ ${acrescimoCartao.toFixed(2)})`;
            }
            
            mensagem += `\n💰 Total: R$ ${pedido.total.toFixed(2)}\n\n`;
            
            totalGeral += pedido.total;
        });
        
        mensagem += `🏠 *Endereço de Entrega:*\n`;
        mensagem += `📍 ${pedidos[0].endereco.rua}`;
        mensagem += pedidos[0].endereco.complemento ? `, ${pedidos[0].endereco.complemento}` : '';
        mensagem += `\n🏘️ ${pedidos[0].endereco.bairro}\n`;
        mensagem += `📞 ${pedidos[0].endereco.telefone}\n`;
        
        if (pedidos[0].endereco.observacoes) {
            mensagem += `\n📝 *Observações:*\n${pedidos[0].endereco.observacoes}\n`;
        }
        
        mensagem += `\n💰 *TOTAL GERAL:* R$ ${totalGeral.toFixed(2)}`;
        
        if (totalCartoes > 0) {
            mensagem += `\n💳 *Acréscimos por cartão:* R$ ${totalCartoes.toFixed(2)}`;
            mensagem += `\n💰 *TOTAL FINAL:* R$ ${(totalGeral + totalCartoes).toFixed(2)}`;
        }
        
        mensagem += `\n\n⏰ *Horário:* ${new Date().toLocaleTimeString()}`;
        
        const numeroWhatsApp = "5511919926172"; // Substitua pelo número real
        const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
        
        // Limpa o carrinho após envio
        carrinho = [];
        carrinhoSection.style.display = 'none';
        finalizarPedidoBtn.style.display = 'none';
        resetarFormulario();
    }

    // Inicializa a aplicação
    init();
});