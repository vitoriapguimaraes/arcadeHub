# ArcadeHub

> ArcadeHub é uma plataforma web moderna que consolida diversos jogos clássicos e interativos em uma única interface unificada. Este projeto representa a evolução e persistência no aprendizado de desenvolvimento Fullstack, migrando jogos originalmente criados em diferentes tecnologias (Python, JS puro, HTML/CSS) para uma aplicação React robusta e responsiva.

![Demonstração do ArcadeHub](https://github.com/vitoriapguimaraes/arcadeHub/blob/main/demonstrations/printshot_home.png)

## 🎮 Jogos Incluídos

O ArcadeHub reúne versões aprimoradas dos seguintes jogos:

### 1. Força (Hangman) e a Evolução do Python

Originalmente desenvolvido como um jogo de terminal em Python (v1 a v3 com POO), foi **totalmente portado para React**.

- **Funcionalidade**: Adivinhe a palavra secreta antes que o boneco seja enforcado.
- **Categorias**: Frutas, Animais, Países, etc.

### 2. Cabo de Guerra (Tug of War)

Inspirado no League of Legends.

- **Funcionalidade**: Monte um time de 3 campeões e dispute força contra um time aleatório.
- **Destaque**: Uso da API do LoL para dados reais e sistema de batalha visual.

### 3. Jogo da Ponte (Bridge)

Inspirado na série Round 6.

- **Funcionalidade**: Atravesse uma ponte de vidro onde cada passo é uma chance de 50/50.
- **Destaque**: Sistema de 3 vidas com memória de caminho, câmera dinâmica que acompanha o jogador, e 4 níveis de dificuldade (Intro/Fácil/Médio/Difícil).

### 4. Adivinhação (Guessing)

Fusão dos projetos "Mentalista" e "Número Secreto".

- **Funcionalidade**: Tente acertar o número gerado pelo sistema com dicas de "Quente/Frio" ou "Maior/Menor".
- **Destaque**: Dois modos de jogo (0-10 e 1-100) com feedback visual instantâneo.

### 5. Jokenpô (Rock, Paper, Scissors)

- **Funcionalidade**: O clássico Pedra, Papel e Tesoura com uma interface moderna.
- **Destaque**: Arena persistente com revelação dramática da escolha da CPU e animações de vitória/derrota.

---

## 🏛️ Legado e Persistência

> _Este repositório contém não apenas a versão final moderna, mas também o histórico da minha jornada._

As versões originais de cada jogo foram preservadas na pasta `original_games_versions` como um registro do meu aprendizado:

- **Python-JogoForca**: De scripts simples a POO.
- **HTML_CSS_Javascript-CaboDeGuerra**: Manipulação de DOM e APIs.
- **HTML_CSS_Javascript-JogoPonte**: Lógica de jogo e estilização.
- **HTML_CSS_Javascript-JogosAdivinhacao**: Lógica algorítmica básica.
- **HTML_CSS_Javascript-Jokenpo**: Simulação de partidas e lógica condicional.

Esses projetos serviram de base para a refatoração completa encontrada na pasta `original_games_versions`, demonstrando a capacidade de **adaptar, migrar e modernizar código legado**.

---

## Funcionalidades Principais

- **Dashboard Unificado**: Acesso centralizado a todos os jogos com uma UI moderna e tema dark.
- **Navegação Fluida**: Sidebar responsiva com transições suaves entre páginas usando Framer Motion.
- **Backgrounds Temáticos**: Cada jogo possui gradientes dinâmicos que mudam conforme a navegação.
- **Sistema de Placar**: Rastreamento de vitórias e derrotas por sessão em todos os jogos.
- **Animações Avançadas**: Micro-interações, efeitos hover, e feedback visual em tempo real.
- **100% Client-Side**: Sem necessidade de backend, facilitando deploy e hospedagem.
- **Responsividade**: Layout adaptável para desktop e mobile (em desenvolvimento).

## Tecnologias Utilizadas

- **Frontend**: React 18 + Vite
- **Estilização**: Tailwind CSS 3, Framer Motion (animações)
- **Roteamento**: React Router Dom v6
- **Ícones**: Lucide React
- **API Externa**: Riot Games API (League of Legends - Tug of War)
- **Linguagens**: JavaScript (ES6+), HTML5, CSS3

## Como Executar

1. Clone o repositório:
   ```bash
   git clone https://github.com/vitoriapguimaraes/arcadeHub.git
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Execute o projeto:
   ```bash
   npm run dev
   ```
4. Acesse em `http://localhost:5173`

## Estrutura de Diretórios

```
/arcadeHub
├── src/
│   ├── components/      # Componentes globais (Sidebar, Layout)
│   ├── games/           # Código fonte de cada jogo (Hangman, Bridge, etc)
│   └── pages/           # Dashboard e páginas principais
├── original_games_versions/ # Histórico dos projetos originais (Legado)
└── README.md                # Documentação atual
```

## Status

✅ Concluído

> Veja as [issues abertas](https://github.com/vitoriapguimaraes/arcadeHub/issues) para sugestões de melhorias.

## Mais Sobre Mim

Acesse os arquivos disponíveis na [Pasta Documentos](https://github.com/vitoriapguimaraes/vitoriapguimaraes/tree/main/DOCUMENTOS) para mais informações sobre minhas qualificações e certificações.
