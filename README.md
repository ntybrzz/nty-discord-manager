<div align="center">

<img src="https://cdn.discordapp.com/emojis/1234567890.png" width="80" height="80" alt="Bot Logo">

# 🤖 nty-discord-manager

> Bot multifuncional para Discord desenvolvido em **TypeScript** com **discord.js v14**, focado em organização, automação e experiência de atendimento.

<br>

[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

</div>

---

## 📋 Sumário

- [✨ Funcionalidades](#-funcionalidades)
- [🗂️ Estrutura do Projeto](#️-estrutura-do-projeto)
- [⚙️ Configuração](#️-configuração)
- [🚀 Instalação e Execução](#-instalação-e-execução)
- [🎫 Sistema de Tickets](#-sistema-de-tickets)
- [📊 Sistema de Logs](#-sistema-de-logs)
- [🛠️ Painel Administrativo](#️-painel-administrativo)
- [🧩 Tecnologias](#-tecnologias)

---

## ✨ Funcionalidades

### 🎫 Sistema de Tickets
- Abertura de tickets por categorias: **Dúvidas**, **Suporte** e **Parcerias**
- Verificação automática de ticket já aberto (impede duplicatas)
- Painel interativo com **Components V2** (discord.js v14+)
- Botão de **Notificação via DM** com cooldown de 5 minutos (anti-spam)
- Botão de **Encerramento** com aviso e exclusão automática do canal após 5 segundos
- Envio automático de **log de encerramento** no canal configurado
- Permissões automáticas por canal: apenas o dono do ticket e a equipe têm acesso

### 📊 Sistema de Logs
- **Log de Entrada** — registra membros que entram no servidor
- **Log de Saída** — registra membros que saem do servidor
- **Log de Mensagens** — monitora mensagens editadas e excluídas
- **Log de Canais** — registra criação, exclusão e modificações de canais
- **Log de Cargos** — registra criação, exclusão e alterações de cargos

### 🛠️ Painel Administrativo
- Painel de configuração visual e interativo com Components V2
- Configuração de tickets (categoria, cargos autorizados, canal de logs)
- Configuração de logs por canal específico
- Carregamento automático de emojis personalizados via Application Emojis

---

## 🗂️ Estrutura do Projeto

```
Bot/
├── src/
│   ├── base/              # Abstrações base (eventos e slash commands)
│   │   ├── event.ts
│   │   └── slashcommand.ts
│   │
│   ├── commands/
│   │   └── slash/
│   │       └── admin/     # Comandos administrativos
│   │           ├── logs.ts
│   │           ├── panel.ts
│   │           └── ticket.ts
│   │
│   ├── database/
│   │   ├── data.json      # Banco de dados JSON (wio.db)
│   │   └── index.ts       # Instância do banco
│   │
│   ├── events/
│   │   ├── client/        # Eventos de cliente (ready, slash)
│   │   ├── Config/        # Eventos de configuração do painel admin
│   │   ├── Guild/         # Eventos do servidor (entry, exit, mensagens, cargos)
│   │   ├── logs/          # Eventos de logs (buttons, selects)
│   │   └── Ticket/        # Eventos do sistema de tickets
│   │       ├── buttons.ts # Notificar usuário & fechar ticket
│   │       └── selects.ts # Abertura de tickets por categoria
│   │
│   ├── functions/
│   │   └── Admin/         # Funções de UI dos painéis
│   │       ├── NChannel.ts
│   │       ├── NConfig.ts
│   │       ├── NLog.ts
│   │       ├── NPTticket.ts
│   │       └── NTicket.ts
│   │
│   ├── handlers/
│   │   ├── client.ts      # Classe NtyClient (extends Client)
│   │   ├── emojis.ts      # Carregamento de emojis customizados
│   │   └── loader.ts      # Loader de events e commands
│   │
│   └── index.ts           # Ponto de entrada
│
├── emojis/                # Emojis personalizados da aplicação (.png, .gif, .webp)
├── .env                   # Variáveis de ambiente (não versionado)
├── .gitignore
├── package.json
├── tsconfig.json
└── LICENSE
```

---

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
BOT_TOKEN=seu_token_aqui
```

> **Nunca compartilhe seu token publicamente.**

---

## 🚀 Instalação e Execução

### Pré-requisitos

- [Node.js](https://nodejs.org/) **v20+**
- [npm](https://www.npmjs.com/) ou outro gerenciador de pacotes

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/ntybrzz/bot.git
cd bot

# 2. Instale as dependências
npm install

# 3. Configure o .env
cp .env.example .env
# Edite o arquivo .env com seu token

# 4. Execute em modo de desenvolvimento (com hot-reload)
npm run dev

# OU compile e execute em produção
npm run build
npm start
```

### Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia em modo desenvolvimento com hot-reload (`tsx --watch`) |
| `npm run build` | Compila o TypeScript para `dist/` |
| `npm start` | Executa o build compilado |

---

## 🎫 Sistema de Tickets

### Como funciona

1. Um administrador envia o painel com `/ticket`
2. O usuário seleciona uma categoria no menu suspenso
3. Um canal privado é criado automaticamente na categoria configurada
4. O canal exibe as orientações de atendimento e os botões de ação

### Categorias disponíveis

| Categoria | Descrição |
|---|---|
| 🎟️ Dúvidas | Esclarecimento de dúvidas gerais |
| 🛠️ Suporte | Problemas técnicos e assistência |
| 🤝 Parcerias | Propostas de colaboração e parcerias |

### Botões do ticket

| Botão | Permissão | Descrição |
|---|---|---|
| 🔔 Notificar usuário | Staff / Admin | Envia DM ao dono do ticket. Cooldown de 5 min |
| ❌ Excluir ticket | Staff / Admin | Encerra e deleta o canal após 5 segundos |

### Configuração via painel

```
/panel → Tickets → Categoria / Cargos / Logs
```

---

## 📊 Sistema de Logs

### Configuração

```
/panel → Logs → selecione o canal para cada tipo de log
```

### Tipos de log suportados

| Tipo | Evento Discord |
|---|---|
| Entrada | `guildMemberAdd` |
| Saída | `guildMemberRemove` |
| Mensagens | `messageDelete`, `messageUpdate` |
| Canais | `channelCreate`, `channelDelete` |
| Cargos | `roleCreate`, `roleDelete`, `roleUpdate` |

---

## 🛠️ Painel Administrativo

Acesse com `/panel`. Requer permissão de **Administrador**.

```
/panel
├── 🎫 Tickets
│   ├── Categoria    → Canal onde os tickets serão criados
│   ├── Cargos       → Cargo da equipe de atendimento
│   └── Logs         → Canal para registros de encerramento
│
└── 📊 Logs
    ├── Log Entrada
    ├── Log Saída
    ├── Log Mensagens
    ├── Log Canais
    └── Log Cargos
```

---

## 🧩 Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| [discord.js](https://discord.js.org/) | v14.28+ | Framework principal do bot |
| [TypeScript](https://www.typescriptlang.org/) | v7.0 | Linguagem e tipagem |
| [tsx](https://github.com/privatenumber/tsx) | v4.23+ | Execução em desenvolvimento com hot-reload |
| [wio.db](https://github.com/WillianSants/wio.db) | v4.0+ | Banco de dados JSON local |
| [dotenv](https://github.com/motdotla/dotenv) | v18+ | Carregamento de variáveis de ambiente |

---

## 📄 Licença

Este projeto está licenciado sob a licença **MIT**. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

<div align="center">

Desenvolvido por [ntybrzz](https://github.com/ntybrzz)

</div>