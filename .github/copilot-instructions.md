# Instruções para Agentes de IA - site-renda-

## Visão Geral

**Projeto**: Site "Lucro do Dia 2.0" - Plataforma de distribuição de renda
**Tipo**: Site responsivo com visual de app (HTML/CSS/JavaScript simples)
**Objetivo**: Gerenciar usuários, tarefas, leads e distribuição de renda
**Deploy**: Exportável para qualquer hosting (WordPress, etc)

## O que NÃO fazer

❌ Não criar PWA (sem manifest.json, sw.js, etc)
❌ Não usar frameworks (React, Vue, Angular)
❌ Não usar build tools (webpack, rollup)
❌ Não usar TypeScript
❌ Não criar complexidades técnicas

## O que FAZER

✅ HTML5 simples e semântico
✅ CSS3 apenas (sem SASS/LESS)
✅ JavaScript vanilla puro
✅ Dados em localStorage (persistência local)
✅ Design responsivo tipo app mobile
✅ Código limpo e copiável

## Estrutura de Arquivos

```
/public/
├── index.html          # Única página (SPA simples)
├── style.css           # Todo CSS em um arquivo
├── app.js              # Todo JavaScript em um arquivo
└── (vazio - pronto para hosting)
```

## Funcionalidades Principais

### 1. Distribuição de Renda
- Input: valor total e quantidade de usuários
- Output: valor por usuário calculado
- Salva no histórico automaticamente

### 2. Gerenciamento de Usuários
- Adicionar/remover usuários
- Lista com nomes
- Persistência em localStorage

### 3. Tarefas (Leads)
- Criar tarefas
- Marcar como concluídas
- Listar ativas e concluídas
- Persistência em localStorage

### 4. Relatórios
- Total distribuído
- Usuários cadastrados
- Tarefas concluídas
- Histórico completo

## Convenções Técnicas

**HTML**: Usar IDs com `data-` attributes, classes simples
**CSS**: Variáveis CSS para cores, mobile-first
**JS**: Funções nomeadas claramente, comentários onde necessário
**Storage**: localStorage com chaves: `lucro_usuarios`, `lucro_tarefas`, `lucro_distribuicoes`

## Cores e Visual

- **Preto**: #000000 (background)
- **Amarelo**: #FFFF00 (acentos, botões)
- **Cinza**: #333333 (borders, separadores)
- **Branco**: #FFFFFF (texto)

## Como Exportar para Hosting

1. Copiar `index.html` → raiz ou subdiretório
2. Copiar `style.css` → mesmo diretório
3. Copiar `app.js` → mesmo diretório
4. Pronto! Não precisa build, compile ou processo de deploy

## Exemplo de Uso

```javascript
// Salvando dados
localStorage.setItem('lucro_usuarios', JSON.stringify(usuarios));

// Carregando dados
const usuarios = JSON.parse(localStorage.getItem('lucro_usuarios') || '[]');
```

## Limitações Conhecidas

- localStorage = apenas no navegador local (não sincroniza entre dispositivos)
- Sem autenticação (caso precise, deve implementar no backend da hospedagem)
- Sem API real (dados offline apenas)

## Próximos Passos

1. Criar index.html com layout base
2. Criar style.css com design app
3. Criar app.js com lógica
4. Testar no navegador
5. Exportar para hosting
