# Desenvolvimento Local

Para executar a PWA localmente, você pode usar um servidor HTTP:

## Opção 1: Python (pré-instalado em muitos sistemas)

```bash
# Python 3
python -m http.server 8000

# Python 2 (legado)
python -m SimpleHTTPServer 8000
```

Depois, acesse http://localhost:8000/public/

## Opção 2: Node.js com http-server

```bash
npm install -g http-server
http-server ./public -p 8000
```

## Opção 3: Usando Live Server no VS Code

Instale a extensão "Live Server" e clique com botão direito em `public/index.html` → "Open with Live Server"

## Testando Funcionalidades PWA

### Service Worker
- Abra DevTools (F12)
- Vá para Application → Service Workers
- Verifique se o SW está registrado e ativo

### Modo Offline
- DevTools → Network → Throttling → "Offline"
- Atualize a página - ela deve carregar do cache

### Instalação da PWA
- Em navegadores Chrome/Edge, clique no ícone de instalação na barra de endereço
- Em Firefox, clique no botão de menu → "Instalar este site"

### Notificações
- DevTools → Application → Manifest
- Verifique permissões de notificação

## Estrutura de Arquivos

- `index.html` - Página principal com layout responsivo
- `style.css` - Tema preto/amarelo com animações
- `app.js` - Lógica principal (inicialização, notificações)
- `sw.js` - Service Worker (cache, offline, sync)
- `manifest.json` - Configuração PWA e ícones
