"use strict";
// Funções mínimas para compatibilidade com botões já no HTML
/* App core: navegação dinâmica, estado de login simulado, renderers */
  const navItemsPublic = [
    { id: 'home', icon: '🏠', label: 'Início' },
    { id: 'explorar', icon: '🧭', label: 'Explorar' },
    { id: 'perfil', icon: '👤', label: 'Perfil' }
  ]

  const navItemsPrivate = [
    { id: 'home', icon: '🏠', label: 'Início' },
    { id: 'explorar', icon: '🧭', label: 'Explorar' },
    { id: 'missions', icon: '🎯', label: 'Missões' },
    { id: 'perfil', icon: '👤', label: 'Perfil' }
  ]

  let isLoggedIn = (localStorage.getItem('isLoggedIn') === '1')
  let currentSection = 'home'

  function saveLoginState(){ localStorage.setItem('isLoggedIn', isLoggedIn ? '1' : '0') }

  function renderNav(){
    const container = document.getElementById('bottom-nav')
    if(!container) return
    container.innerHTML = ''
    const items = isLoggedIn ? navItemsPrivate : navItemsPublic
    items.forEach(it=>{
      const btn = document.createElement('button')
      btn.id = `nav-${it.id}`
      btn.setAttribute('role','tab')
      btn.setAttribute('aria-label', it.label)
      btn.className = 'nav-btn'
      btn.onclick = ()=>{ animateSection(it.id) }
      const iconSpan = document.createElement('span')
      iconSpan.className = 'nav-icon'
      iconSpan.textContent = it.icon
      const labelSpan = document.createElement('span')
      labelSpan.className = 'nav-label'
      labelSpan.textContent = it.label
      btn.appendChild(iconSpan)
      btn.appendChild(labelSpan)
      if(it.id === currentSection) btn.classList.add('active')
      container.appendChild(btn)
    })
  }

  function showSection(id){
    document.querySelectorAll('[data-section]').forEach(s=>{
      s.classList.remove('active'); s.style.display = 'none'
    })
    const el = document.getElementById(id)
    if(el){
      el.style.display = 'block'
      // forçar reflow para garantir que a animação de entrada dispare
      void el.offsetWidth
      el.classList.add('active')
    }
    currentSection = id
    highlightNav(id)
    // render dynamic content when showing
    if(id === 'home') renderHome()
    if(id === 'explorar') renderExplorar()
    if(id === 'missions') renderMissions()
    if(id === 'perfil') renderPerfil()
  }

  function highlightNav(id){
    document.querySelectorAll('#bottom-nav button').forEach(b=>b.classList.remove('active'))
    const active = document.getElementById(`nav-${id}`)
    if(active) active.classList.add('active')
  }

  // Animação utilitária para troca de seções (centraliza comportamento)
  function animateSection(id){
    if(!id || id === currentSection) return
    document.body.classList.add('is-switching')
    // pequena margem para bloqueio de interação visual
    setTimeout(()=>{
      try{ showSection(id) }catch(e){}
      // remover flag após animação (de acordo com CSS: ~260ms)
      setTimeout(()=> document.body.classList.remove('is-switching'), 320)
    }, 8)
  }

  /* Home: shelves com mock data */
  const categories = [
    {key:'destaques', label:'⭐ Destaques'},
    {key:'financas', label:'💰 Finanças'},
    {key:'educacao', label:'🎓 Educação'},
    {key:'compras', label:'🛒 Compras'},
    {key:'saude', label:'🏥 Saúde'},
    {key:'apps', label:'🤖 Apps/IA'}
  ]

  function sampleArticles(category){
    const arr = []
    for(let i=1;i<=5;i++) arr.push({
      id: `${category}-${i}`,
      title: `${category} — Artigo ${i}`,
      img: 'https://picsum.photos/seed/'+encodeURIComponent(category+'-'+i)+'/400/300',
      summary: 'Resumo rápido do artigo para exibir na lista.'
    })
    return arr
  }

  function renderHome(){
    const container = document.getElementById('home-shelves')
    container.innerHTML = ''

    // Wallet: estado simulado salvo em localStorage (chave: lucro_wallet)
    function getWallet(){
      let w = JSON.parse(localStorage.getItem('lucro_wallet') || 'null')
      if(!w){ w = { available: 8.50, pending: 16.25 }; localStorage.setItem('lucro_wallet', JSON.stringify(w)) }
      return w
    }

    function saveWallet(w){ localStorage.setItem('lucro_wallet', JSON.stringify(w)) }

    const w = getWallet()
    const total = (w.available + (w.pending||0))
    const pct = total ? Math.round((w.available/total)*100) : 0

    const walletCard = document.createElement('div')
    walletCard.className = 'wallet-card'
    walletCard.innerHTML = `
      <div class="wallet-info">
        <div class="wallet-balance">R$ ${w.available.toFixed(2)}</div>
        <div class="wallet-sub">Disponível • Total R$ ${total.toFixed(2)}</div>
        <div class="wallet-bar"><div class="wallet-seg" style="width:${pct}%"></div></div>
      </div>
      <div>
        <button class="withdraw-btn ${w.available < 10 ? 'disabled' : ''}" ${w.available < 10 ? 'disabled' : ''} onclick="sacarPIX()">SACAR PIX</button>
      </div>
    `
    container.appendChild(walletCard)

    // Shelves abaixo da carteira
    categories.forEach(cat=>{
      const shelf = document.createElement('div'); shelf.className='shelf'
      const title = document.createElement('div'); title.className='shelf-title'; title.textContent = cat.label
      const row = document.createElement('div'); row.className='shelf-row'
      const arts = sampleArticles(cat.key)
      arts.forEach(a=>{
        const c = document.createElement('div'); c.className='card'
        c.innerHTML = `<img src="${a.img}" alt=""><h3>${a.title}</h3><p>${a.summary}</p><button onclick="openArticle('${a.id}')">Ler</button>`
        row.appendChild(c)
      })
      shelf.appendChild(title); shelf.appendChild(row); container.appendChild(shelf)
    })
  }

  function openArticle(id){ alert('Abrir artigo (simulação): '+id) }

  /* Explorar */
  function renderExplorar(){
    const list = document.getElementById('explorar-list')
    if(!list) return
    list.innerHTML = ''
    
    const articles = [
      { cat: 'financas', title: '5 Apps para controlar gastos', desc: 'Dicas práticas para economizar.', img: 'https://picsum.photos/seed/financas/120/120' },
      { cat: 'educacao', title: 'Cursos gratuitos de IA', desc: 'Aprenda IA sem pagar nada.', img: 'https://picsum.photos/seed/educacao/120/120' },
      { cat: 'ferramentas', title: 'Melhores ferramentas de produtividade', desc: 'Otimize seu tempo com apps úteis.', img: 'https://picsum.photos/seed/ferramentas/120/120' },
      { cat: 'apps', title: 'Aplicativos de cashback', desc: 'Ganhe recompensas em cada compra.', img: 'https://picsum.photos/seed/apps/120/120' },
      { cat: 'saude', title: 'Apps de bem-estar e fitness', desc: 'Cuidar de si mesmo nunca foi tão fácil.', img: 'https://picsum.photos/seed/saude/120/120' },
      { cat: 'compras', title: 'Guia de compras inteligentes', desc: 'Economize com as melhores ofertas.', img: 'https://picsum.photos/seed/compras/120/120' }
    ]
    
    articles.forEach(a => {
      const div = document.createElement('div')
      div.className = 'explorar-item'
      div.innerHTML = `
        <img src="${a.img}" alt="${a.title}">
        <div class="explorar-item-info">
          <h3>${a.title}</h3>
          <p>${a.desc}</p>
        </div>`
      list.appendChild(div)
    })
  }

  function openCategory(cat){
    // Placeholder para lógica futura de filtro por categoria
    animateSection('explorar')
  }

  /* Missions */
  function renderMissions(){
    const container = document.getElementById('missions-list')
    if(!container) return
    container.innerHTML = ''
    
    const missions = [
      { title: 'Compartilhe um curso', desc: 'Ganhe 50 pontos', progress: 60, points: 50 },
      { title: 'Avalie um app', desc: 'Ganhe 30 pontos', progress: 20, points: 30 },
      { title: 'Convide um amigo', desc: 'Ganhe 100 pontos', progress: 0, points: 100 }
    ]
    
    missions.forEach(m => {
      const div = document.createElement('div')
      div.className = 'mission-card'
      div.innerHTML = `
        <img src="https://picsum.photos/seed/${encodeURIComponent(m.title)}/100/100" alt="${m.title}">
        <div class="mission-info">
          <h4>${m.title}</h4>
          <p>${m.desc}</p>
          <div class="progress-bar"><div class="progress-fill" style="width:${m.progress}%"></div></div>
          <span class="mission-points">+${m.points} pontos</span>
        </div>`
      container.appendChild(div)
    })
  }

  function participar(id){ alert('Participar na missão (simulação): '+id) }

  /* Perfil */
  function renderPerfil(){
    const pontos = localStorage.getItem('lucro_pontos') || 0
    document.getElementById('perfil-pontos').innerText = pontos
    
    const historico = JSON.parse(localStorage.getItem('lucro_historico') || '[]')
    const ul = document.getElementById('perfil-historico')
    if(!ul) return
    ul.innerHTML = ''
    if(historico.length === 0){
      ul.innerHTML = '<li>Nenhuma missão concluída ainda.</li>'
    } else {
      historico.forEach(item => {
        const li = document.createElement('li')
        li.textContent = '✅ ' + item
        ul.appendChild(li)
      })
    }
    
    const btnLogout = document.getElementById('btn-logout')
    if(btnLogout){
      btnLogout.onclick = () => {
        localStorage.setItem('isLoggedIn', '0')
        isLoggedIn = false
        saveLoginState()
        renderNav()
        animateSection('home')
      }
    }
  }

  function toggleLogin(val){
    isLoggedIn = val
    saveLoginState()
    renderNav()
    // se entrou, navegar para missions automaticamente
    animateSection(isLoggedIn ? 'missions' : 'home')
  }

  /* site-footer web component */
  class SiteFooter extends HTMLElement{
    connectedCallback(){
      this.innerHTML = `<div class="site-footer-inner"><div class="legal-links"><a href="privacy.html">Privacidade</a> <a href="terms.html">Termos</a> <a href="cookies.html">Cookies</a> <a href="contact.html">Contato</a></div><small style="color:#777;display:block;margin-top:8px">© Lucro do Dia 2.0</small></div>`
    }
  }
  customElements.define('site-footer', SiteFooter)

  /* Inicialização consolidada */
  document.addEventListener('DOMContentLoaded', ()=>{
    try{ carregarDados(); }catch(e){}
    try{ renderNav(); }catch(e){}
    try{ showSection(currentSection || 'home'); }catch(e){}
    // removed legacy refreshAll call during cleanup
    try{ filtrarTarefas && filtrarTarefas('pendente'); }catch(e){}
    try{ atualizarRelatorio && atualizarRelatorio(); }catch(e){}
    // Ativar cliques nos botões rápidos da Home
    try{
      document.querySelectorAll('.quick-link-btn').forEach(btn => {
        btn.addEventListener('click', () => animateSection('explorar'))
      })
    }catch(e){}
    // Tornar cards de categoria clicáveis
    try{
      document.querySelectorAll('.cat-card').forEach(card => {
        card.addEventListener('click', () => openCategory(card.dataset.cat || card.dataset.category || 'geral'))
      })
    }catch(e){}
    // Busca simples: filtrar por texto em cards e itens de explorar
    try{
      const search = document.querySelector('.search-bar')
      if(search){
        search.addEventListener('input', (ev)=>{
          const term = (ev.target.value || '').toLowerCase()
          document.querySelectorAll('.card, .explorar-item, .trending-card').forEach(el=>{
            const ok = el.textContent.toLowerCase().indexOf(term) !== -1
            el.style.display = ok ? '' : 'none'
          })
        })
      }
    }catch(e){}
  })

// Dados
let usuarios = [];
let tarefas = [];
let distribuicoes = [];
let filtroAtualTarefas = 'pendente';

// MENU TOGGLE
function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('active');
}

// FECHAR MENU AO CLICAR FORA
// FECHAR MENU AO CLICAR FORA (seguro: checa existência dos elementos antes)
document.addEventListener('click', (e) => {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.querySelector('.menu-toggle');
  if (!sidebar || !toggle) return;
  if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
    sidebar.classList.remove('active');
  }
});

// MOSTRAR SEÇÃO (usamos `showSection(id)` definido acima para a SPA moderna)

// === DISTRIBUIÇÃO ===
function distribuir() {
    const valor = parseFloat(document.getElementById('valor').value);
    const qtd = parseInt(document.getElementById('qtd-usuarios').value);
    
    if (!valor || !qtd) {
        alert('Preencha todos os campos');
        return;
    }
    
    const porUsuario = (valor / qtd).toFixed(2);
    let html = `<h3>R$ ${valor.toLocaleString('pt-BR')} para ${qtd} usuários</h3><p>Cada um recebe: <strong>R$ ${parseFloat(porUsuario).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong></p>`;
    
    document.getElementById('resultado-distribuicao').innerHTML = html;
    
    distribuicoes.push({
        data: new Date().toLocaleString('pt-BR'),
        valor,
        qtd,
        porUsuario
    });
    
    salvarDados();
    atualizarRelatorio();
    atualizarHistoricoDistribuicoes();
    
    document.getElementById('valor').value = '';
    document.getElementById('qtd-usuarios').value = '';
}

function atualizarHistoricoDistribuicoes() {
    let html = '<h3>Histórico de Distribuições</h3>';
    if (distribuicoes.length === 0) {
        html += '<p class="lista-vazia">Nenhuma distribuição registrada</p>';
    } else {
        html += '<div class="lista">';
        distribuicoes.slice().reverse().forEach(d => {
            html += `<div class="item"><div class="item-content"><div class="item-name">${d.data}</div><div class="item-desc">R$ ${d.valor.toLocaleString('pt-BR')} ÷ ${d.qtd} = R$ ${parseFloat(d.porUsuario).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div></div></div>`;
        });
        html += '</div>';
    }
    document.getElementById('historico-distribuicoes').innerHTML = html;
}

// === USUÁRIOS ===
function adicionarUsuario() {
    const nome = document.getElementById('nome-usuario').value.trim();
    if (!nome) {
        alert('Digite um nome');
        return;
    }
    
    usuarios.push({ id: Date.now(), nome });
    salvarDados();
    listarUsuarios();
    atualizarSelectUsuarios();
    document.getElementById('nome-usuario').value = '';
    atualizarRelatorio();
}

function listarUsuarios() {
    const lista = document.getElementById('lista-usuarios');
    if (usuarios.length === 0) {
        lista.innerHTML = '<p class="lista-vazia">Nenhum usuário cadastrado</p>';
        return;
    }
    
    let html = '<div class="lista">';
    usuarios.forEach(u => {
        html += `<div class="item"><div class="item-content"><div class="item-name">${u.nome}</div></div><div class="item-actions"><button class="btn-remove" onclick="removerUsuario(${u.id})">Remover</button></div></div>`;
    });
    html += '</div>';
    lista.innerHTML = html;
}

function removerUsuario(id) {
    if (confirm('Remover este usuário?')) {
        usuarios = usuarios.filter(u => u.id !== id);
        tarefas = tarefas.filter(t => t.usuarioId !== id);
        salvarDados();
        listarUsuarios();
        atualizarSelectUsuarios();
        atualizarRelatorio();
    }
}

function atualizarSelectUsuarios() {
    const select = document.getElementById('usuario-tarefa');
    select.innerHTML = '<option value="">Selecione um usuário</option>';
    usuarios.forEach(u => {
        select.innerHTML += `<option value="${u.id}">${u.nome}</option>`;
    });
}

// === TAREFAS ===
function adicionarTarefa() {
    const descricao = document.getElementById('descricao-tarefa').value.trim();
    const usuarioId = parseInt(document.getElementById('usuario-tarefa').value);
    
    if (!descricao || !usuarioId) {
        alert('Preencha todos os campos');
        return;
    }
    
    const usuario = usuarios.find(u => u.id === usuarioId);
    tarefas.push({
        id: Date.now(),
        descricao,
        usuarioId,
        usuarioNome: usuario.nome,
        status: 'pendente',
        data: new Date().toLocaleString('pt-BR')
    });
    
    salvarDados();
    atualizarListaTarefas();
    document.getElementById('descricao-tarefa').value = '';
    document.getElementById('usuario-tarefa').value = '';
    atualizarRelatorio();
}

function filtrarTarefas(status, ev) {
  filtroAtualTarefas = status;
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  try{ if(ev && ev.target) ev.target.classList.add('active') }catch(e){}
  atualizarListaTarefas();
}

function atualizarListaTarefas() {
    const lista = document.getElementById('lista-tarefas');
    const filtradas = tarefas.filter(t => t.status === filtroAtualTarefas);
    
    if (filtradas.length === 0) {
        lista.innerHTML = `<p class="lista-vazia">Nenhuma tarefa ${filtroAtualTarefas === 'pendente' ? 'pendente' : 'concluída'}</p>`;
        return;
    }
    
    let html = '<div class="lista">';
    filtradas.forEach(t => {
        const statusClass = t.status === 'concluida' ? 'concluida' : 'pendente';
        html += `<div class="item"><div class="item-content"><div class="item-name">${t.descricao}</div><div class="item-desc">👤 ${t.usuarioNome}</div><div class="item-status">${t.status === 'pendente' ? '⏳ Pendente' : '✓ Concluída'}</div></div><div class="item-actions">`;
        
        if (t.status === 'pendente') {
            html += `<button class="btn-complete" onclick="completarTarefa(${t.id})">Concluir</button>`;
        }
        
        html += `<button class="btn-remove" onclick="removerTarefa(${t.id})">Remover</button></div></div>`;
    });
    html += '</div>';
    lista.innerHTML = html;
}

function completarTarefa(id) {
    const tarefa = tarefas.find(t => t.id === id);
    if (tarefa) {
        tarefa.status = 'concluida';
        salvarDados();
        atualizarListaTarefas();
        atualizarRelatorio();
    }
}

function removerTarefa(id) {
    if (confirm('Remover esta tarefa?')) {
        tarefas = tarefas.filter(t => t.id !== id);
        salvarDados();
        atualizarListaTarefas();
        atualizarRelatorio();
    }
}

// === RELATÓRIO ===
function atualizarRelatorio() {
    const totalDistribuido = distribuicoes.reduce((acc, d) => acc + parseFloat(d.valor), 0);
    const tarefasConcluidas = tarefas.filter(t => t.status === 'concluida').length;
    
    document.getElementById('stat-total').textContent = 'R$ ' + totalDistribuido.toLocaleString('pt-BR', {minimumFractionDigits: 2});
    document.getElementById('stat-usuarios').textContent = usuarios.length;
    document.getElementById('stat-tarefas').textContent = tarefas.length;
    document.getElementById('stat-concluidas').textContent = tarefasConcluidas;
}

function exportarDados() {
    const dados = {
        usuarios,
        tarefas,
        distribuicoes,
        dataExportacao: new Date().toLocaleString('pt-BR')
    };
    
    const json = JSON.stringify(dados, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lucro_dados_${Date.now()}.json`;
    a.click();
}

function limparTudo() {
    if (confirm('ATENÇÃO! Isso vai deletar TUDO. Tem certeza?')) {
        usuarios = [];
        tarefas = [];
        distribuicoes = [];
        salvarDados();
        location.reload();
    }
}

// === STORAGE ===
function salvarDados() {
    localStorage.setItem('lucro_usuarios', JSON.stringify(usuarios));
    localStorage.setItem('lucro_tarefas', JSON.stringify(tarefas));
    localStorage.setItem('lucro_distribuicoes', JSON.stringify(distribuicoes));
}

function carregarDados() {
    usuarios = JSON.parse(localStorage.getItem('lucro_usuarios') || '[]');
    tarefas = JSON.parse(localStorage.getItem('lucro_tarefas') || '[]');
    distribuicoes = JSON.parse(localStorage.getItem('lucro_distribuicoes') || '[]');
    
    atualizarSelectUsuarios();
    atualizarHistoricoDistribuicoes();
}
// Ação de saque (simulação). Habilitada só com disponível >= R$10
window.sacarPIX = function(){
    let w = JSON.parse(localStorage.getItem('lucro_wallet') || 'null');
    if(!w){ alert('Saldo indisponível'); return }
    if(w.available < 10){ alert('Saque mínimo R$10,00'); return }
    if(!confirm('Confirmar saque de R$ '+w.available.toFixed(2)+' (simulação)?')) return
    w.pending = (w.pending||0) + 0
    w.available = 0
    localStorage.setItem('lucro_wallet', JSON.stringify(w))
    alert('Saque solicitado (simulação). Saldo disponível agora R$0,00')
    if(typeof renderHome === 'function') renderHome()
}

// Inicialização de log (polimento)
window.addEventListener('DOMContentLoaded',()=>{
  console.log('%cLucro do Dia 2.0 iniciado com sucesso ✅','color:#3D5AFE;font-weight:bold;')
})