# 🎮 Runetasks Web (Frontend)

![Next.js](https://img.shields.io/badge/Next.js-15.x-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-blue)
![React Query](https://img.shields.io/badge/React_Query-5.x-red)

---

## 📑 Tabela de Conteúdos

1. [Visão Geral](#-visão-geral)
2. [Tecnologias e Ferramentas](#-tecnologias-e-ferramentas)
3. [Arquitetura e Padrões](#-arquitetura-e-padrões)
4. [Estrutura de Diretórios](#-estrutura-de-diretórios)
5. [Decisões de Design e Negócio (ADRs)](#-decisões-de-design-e-negócio-adrs)
6. [Guia de Início Rápido](#-guia-de-início-rápido)
7. [Segurança e Acesso](#-segurança-e-acesso)

---

## 📋 Visão Geral

O **Runetasks Web** é a interface de usuário (Frontend) desenvolvida em Next.js e React para consumir a API gamificada do Runetasks. O objetivo principal é fornecer uma experiência interativa, intuitiva e fluida para:

1.  **Gerenciamento de Tarefas diárias:** Criação, edição, bloqueio e conclusão de tarefas atreladas a habilidades.
2.  **Evolução de Habilidades (Skills):** Acompanhamento visual de progresso (XP e Nível) através de barras de progresso dinâmicas.
3.  **Economia Gamificada (Loja e Recompensas):** Aquisição de Avatares cosméticos com moedas virtuais e resgate de recompensas customizadas.
4.  **Feedback Visual Contínuo:** Celebração de "Level Up" e atualizações de status em tempo real.
5.  **Gerenciamento de Perfil:** Atualização segura de credenciais de acesso (alteração de senha) utilizando modais interativos diretamente no painel do usuário.

---

## 🚀 Tecnologias e Ferramentas

O projeto utiliza uma stack moderna de desenvolvimento web, focada em performance, tipagem e gerenciamento de estado eficiente.

| Tecnologia | Versão | Propósito | Principal Vantagem |
| :--- | :--- | :--- | :--- |
| **Next.js** | `15.1.4` | Framework React com sistema de roteamento App Router. | **Otimização nativa e roteamento simplificado.** |
| **React** | `^19.0.0` | Biblioteca principal para a construção da interface. | Desenvolvimento baseado em componentes declarativos. |
| **TypeScript** | `^5.x` | Adiciona tipagem estática, aumentando a robustez do código. | **Redução de bugs em produção e melhor autocompletar.** |
| **Tailwind CSS** | `^3.4.1` | Framework CSS *utility-first* para estilização rápida. | **Velocidade de desenvolvimento e design responsivo.** |
| **React Query** | `^5.64.1` | Gerenciamento de estado do servidor, cache e sincronização. | **Elimina a dor de cabeça com loading states e refetching.** |
| **Axios** | `^1.7.9` | Cliente HTTP baseado em Promise para comunicação com a API. | Facilidade de uso de *interceptors* (para injeção do JWT). |
| **Sonner** | `^1.7.2` | Sistema moderno de *Toasts* para alertas e notificações. | **Excelente UX e consistência visual nas respostas.** |
| **Lucide React** | `^0.471.0` | Biblioteca de ícones SVG. | Ícones limpos, personalizáveis e de carregamento rápido. |

---

## 🏛️ Arquitetura e Padrões

A arquitetura do Frontend foca na **Separação de Preocupações (SoC)** para escalabilidade e testabilidade.

### Padrões de Componentes

| Padrão | O que é | Por que foi utilizado | Benefício |
| :--- | :--- | :--- | :--- |
| **Componentes UI vs Domínio** | Separação entre componentes genéricos de UI (botões, inputs) contidos em `src/components/ui/` e componentes de domínio de negócio. | Garante que os componentes de UI sejam puramente funcionais e reutilizáveis em qualquer parte do sistema. | **Reusabilidade e Consistência de Design.** |
| **Server/Client Components** | Divisão do Next.js entre renderização no servidor ou no cliente (diretiva `"use client"`). | Páginas com alta interatividade (Modais, Formulários, Hooks do React Query) são sinalizadas como cliente. | **Performance inicial otimizada e interatividade rica.** |

### Gerenciamento de Estado e Lógica

| Padrão/Ferramenta | O que é | Por que foi utilizado | Benefício |
| :--- | :--- | :--- | :--- |
| **React Query (Server State)** | Abstração completa do ciclo de vida das requisições (Loading, Error, Success) via hooks como `useQuery` e `useMutation`. | Para substituir o `useEffect` + `useState` na busca de dados. | **Cache automático, *Refetch* em background e código limpo.** |
| **Context API (`AuthContext`)** | Gerenciamento global do estado de autenticação (Login, Logout, Token do usuário). | Para evitar **Prop Drilling** na checagem de rotas privadas. | **Acesso global aos dados da sessão.** |
| **Custom Hooks** | Hooks como `useTasks.ts` ou `useSkills.ts` que encapsulam as chamadas do React Query. | Mantém os componentes focados na renderização e esconde a complexidade de mutação e invalidação de cache. | **Separação de Lógica e Reusabilidade (DRY).** |

### Comunicação com a API

| Padrão/Ferramenta | O que é | Por que foi utilizado | Benefício |
| :--- | :--- | :--- | :--- |
| **Service Modules (`src/services/`)** | Funções de API agrupadas por entidade (ex: `taskService.ts`, `storeService.ts`). | Isola a complexidade da comunicação HTTP, facilitando manutenções se a API mudar. | **Manutenibilidade e Configuração Centralizada.** |
| **Axios com Interceptors** | Configuração do Axios em `api.ts` para injetar o JWT token automaticamente e tratar erros 401. | Garante comunicação segura em rotas protegidas sem repetir código de autenticação em cada requisição. | **Segurança Consistente e Tratamento Global de Erros.** |

---

## 📂 Estrutura de Diretórios

A estrutura do projeto foi desenhada para facilitar a navegação em um ambiente Next.js:

```text
runetasks-frontend/
├── app/              # Roteamento Next.js App Router (Dashboard, Profile, Store, etc.)
├── src/
│   ├── assets/       # Recursos estáticos (ex: logo.png)
│   ├── components/   # Componentes React (PasswordChangeModal, AuthModal, Sidebar)
│   │   └── ui/       # Componentes primitivos genéricos (Button, Card, Badge, Progress)
│   ├── contexts/     # Contextos globais (AuthContext para autenticação)
│   ├── hooks/        # Hooks de negócio encapsulando React Query (useAvatars, useTasks)
│   ├── providers/    # Wrappers de Providers (ReactQueryProvider)
│   ├── services/     # Serviços de comunicação HTTP com o Backend (api.ts)
│   ├── types/        # Definições de Tipos e Interfaces do TypeScript (DTOs)
│   └── utils/        # Funções utilitárias puras (formatação de data, parser de avatar)
└── public/           # Arquivos públicos e ícones base
```

---

## 🧠 Decisões de Design e Negócio (ADRs)

Nesta seção, documentamos as escolhas estratégicas e arquiteturais feitas no ecossistema do Frontend para otimizar a **usabilidade**, potencializar a **gamificação** e garantir total **aderência às regras e fluxos de dados da API**. A intenção principal foi criar uma experiência de Single Page Application (SPA) robusta, reativa e altamente resiliente a falhas de rede e inconsistências de estado.

### 1. Sincronização de Estado Gamificado (React Query Invalidation)
* **O Problema:** A plataforma possui um estado de "Economia e Progresso" altamente interconectado. Quando um usuário completa uma tarefa (`PATCH /api/tasks/{id}/complete`), não apenas o status dessa tarefa muda, mas ocorrem diversas reações em cadeia no Backend: o usuário ganha XP, o usuário ganha Moedas virtuais, a sua Habilidade (Skill) respectiva ganha XP e os níveis globais e específicos podem subir. O Frontend precisa refletir todas essas alterações simultaneamente, em diferentes partes da tela (Barra Superior, Dashboard Principal e Lista de Skills), sem causar atrasos perceptíveis ao usuário.
* **A Decisão:** Adotamos o padrão de mutação inteligente do **React Query (TanStack Query)**, utilizando a funcionalidade `onSuccess` para acionar a invalidação de múltiplas chaves de cache (`queryClient.invalidateQueries`). 
* **Por quê:** Ao invés de tentarmos calcular e manipular manualmente o estado local (o que geraria código propenso a falhas de sincronia e duplicação de lógicas de negócio no frontend), nós simplesmente sinalizamos ao React Query: *"Atenção: os dados de `tasks`, `user-profile` e `skills` estão agora obsoletos. Dispare novas requisições em background e atualize a UI automaticamente."* Essa abordagem garante que a interface seja sempre um reflexo **100% fiel e sincronizado com o Backend**. Além disso, o usuário não sofre interrupções bruscas, não percebe o *refetching* em andamento, e a tela nunca "pisca" ou exige um recarregamento completo da página.

### 2. Celebração de "Level Up" Desacoplada e Reativa
* **O Problema:** Uma experiência gamificada engajante exige que um Modal de Celebração ("Você Subiu de Nível!") apareça imediatamente toda vez que o usuário ultrapassar a meta de XP necessária. Porém, como a ação que gera XP pode vir de múltiplas interações em páginas distintas (concluir tarefa pelo Dashboard, pela visualização de Skills, etc.), atrelar a verificação de "Level Up" aos cliques dos botões geraria muito código repetitivo.
* **A Decisão:** Criamos o componente observador invisível `LevelUpWatcher.tsx`. Posicionado na raiz do *layout* protegido do usuário, ele observa continuamente as flutuações da variável `user.level` oriunda do cache global do React Query. Se o nível atual se tornar matematicamente maior que o nível histórico armazenado em uma referência local silenciosa (`useRef`), o componente automaticamente invoca o `CelebrationModal`.
* **Por quê:** Esse padrão arquitetural (Observer) remove completamente a necessidade de checar manualmente as consequências de uma ação na interface após cada requisição individual. Ele centraliza a lógica de recompensa de forma global e reativa, mantendo os componentes de listas de tarefas totalmente ignorantes sobre as mecânicas de nivelamento do sistema.

### 3. Feedback Centralizado e Unificado (Toasts com Sonner)
* **O Problema:** Fornecer *feedback* assíncrono instantâneo (notificações de sucesso, alertas ou falhas ao comprar um Avatar ou ao errar uma senha) normalmente exige um complexo controle de estado (`isLoading`, `hasError`, `errorMessage`) dentro de dezenas de componentes e formulários.
* **A Decisão:** Integramos a biblioteca de notificações toast **Sonner** (`<Toaster />`), instanciada na raiz do sistema. O disparo das mensagens de alerta, como `toast.success("Tarefa concluída com maestria!")` ou `toast.error("Moedas insuficientes para esta compra.")`, ocorre de forma injetada diretamente dentro dos blocos `onSuccess` ou `onError` dos *custom hooks* de mutação (ex: `useTasks`, `useStore`).
* **Por quê:** Mantém o ciclo de vida dos componentes limpo. Os formulários passam a ter como única responsabilidade capturar a intenção do usuário e renderizar campos, delegando totalmente o feedback visual e a exibição de respostas HTTP da API para os ganchos da aplicação. Isso promove um alinhamento rigoroso à consistência visual.

### 4. Modularização da Interface: Design System Customizado
* **A Decisão:** Evitamos utilizar grandes bibliotecas de componentes acopladas (como Material-UI ou AntDesign) que trazem fardos excessivos no pacote (bundle size) e forçam o design a parecer padronizado. Todos os elementos atômicos da interface — como Botões (`Button.tsx`), Entradas de Texto (`FormField.tsx`), Cartões (`Card.tsx`), Rótulos (`Badge.tsx`) e Barras de Progresso (`Progress.tsx`) — foram construídos do zero usando Tailwind CSS e isolados meticulosamente dentro de `src/components/ui/`.
* **Por quê:** Isso nos permite construir nosso próprio **Design System** encapsulado e aderente à temática do projeto. Caso seja necessário arredondar drasticamente os botões, alterar a cor de destque base, ou adicionar animações de hover globais, o desenvolvedor precisa modificar apenas um único arquivo no repositório, garantindo a propagação atômica da mudança em cada visualização do sistema.

---

## ⚡ Guia de Início Rápido

O Frontend do Runetasks depende de forma estrita de uma conexão ativa e estável com a **Runetasks API (Backend em Spring Boot)** para operar e carregar seus catálogos essenciais.

### 🛠️ Pré-requisitos do Ambiente

* **Node.js**: Recomenda-se a versão *Long-Term Support* (LTS) **v18 ou superior**.
* **Gerenciador de Pacotes**: `npm` (incluído no Node) ou compatíveis como `yarn`/`pnpm`.
* **Ambiente Backend**: A API Java conectada ao MySQL rodando simultaneamente (geralmente escutando na porta `8080`).

### 🚀 Como Inicializar e Rodar (Passo a Passo)

1.  **Obtenha o Código Fonte:**
    Clone o repositório oficial na sua área de desenvolvimento local através do terminal.
    ```bash
    git clone [https://github.com/Lutava2245/runetasks-frontend.git](https://github.com/Lutava2245/runetasks-frontend.git)
    cd runetasks-frontend
    ```

2.  **Instalação dos Pacotes e Dependências:**
    Baixe a árvore completa de bibliotecas necessárias para o projeto através do package manager.
    ```bash
    npm install
    ```

3.  **Configuração do Ambiente (Opcional, porém recomendado):**
    O serviço Axios que criamos, por padrão, já mira em `http://localhost:8080/api`. Caso o seu backend esteja escutando em outro caminho porta ou ambiente (ex: container Docker), crie um arquivo `.env.local` na raiz e sobrescreva a URL de base conforme a estrutura de serviços definida no módulo `api.ts`.

4.  **Inicie o Servidor de Desenvolvimento:**
    O Next.js inicializará com o compilador otimizado Turbopack (no ambiente de dev) garantindo recarregamentos super-rápidos (HMR).
    ```bash
    npm run dev
    ```

5.  **Acesse a Aplicação Interativa:**
    Aguarde as mensagens no console e abra o seu navegador web moderno de preferência na URL designada localmente:
    👉 **http://localhost:3000**

---

## 🔒 Segurança e Acesso

O painel de aplicação do usuário é tratado como uma zona de acesso restrito, gerenciando a sua criptografia e a identificação do portador por intermédio do rigoroso padrão **JWT (JSON Web Token)** de arquitetura stateless:

* **Gerenciamento e Persistência do Token:** O ciclo de credenciais não depende de cookies e sessões acopladas no backend. O token de sessão emitido via resposta de autenticação é criptografado pelo serviço, capturado e armazenado seguramente no cofre local do navegador (Web Storage API - `localStorage`) via funções utilitárias unificadas presentes no pacote `src/utils/auth.ts`.
* **Injeção Transparente via Interceptors:** O módulo HTTP personalizado (criado em cima do Axios dentro do `src/services/api.ts`) atua como um Middleware do cliente. Todas as requisições destinadas à API Backend são interceptadas antes do envio para anexar autonomamente o Cabeçalho de Segurança HTTP: `Authorization: Bearer <SEU_TOKEN>`.
* **Tratamento Resiliente de Expiração (Status 401):** Um token corrompido, adulterado ou que já tenha expirado o tempo limite parametrizado pelo servidor lançará uma resposta `HTTP 401 Unauthorized`. O nosso interceptor intercepta ativamente o erro antes de quebrar a aplicação. Ele dispara um alerta visível ao usuário `toast.error`, sanitiza de maneira forçada todos os registros contidos no armazenamento de sessão e executa o redirecionamento (kick) preventivo para a landing page (Login), estabilizando o ambiente sem travar a interface.
* **Blindagem de Rotas (Router Guard):** O ecossistema dentro do escopo de caminho `app/dashboard/` é totalmente supervisionado pelo Layout Global que assina e consome os dados do `AuthContext`. O acesso digitado por barra de endereço, tentando burlar o fluxo natural sem um token viável ativo, não renderiza as telas; em vez disso, as rotas de layout redirecionam e expulsam forçadamente o acesso indesejado de volta à rota de abertura `/`.```
* **Gestão Segura de Credenciais:** O fluxo de alteração de senha (`PasswordChangeModal`) realiza validações locais na interface (ex: garantir que a "Nova Senha" e a "Confirmação" sejam idênticas) antes mesmo de disparar a requisição HTTP segura (`PATCH /api/users/password`) pelo interceptor Axios, economizando processamento de rede para erros de digitação.
