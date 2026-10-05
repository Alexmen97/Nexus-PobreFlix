# 📦 Nexus PobreFlix Plugin — Build v1.0.0.4 (Jellyfin 12.1 & .NET 10)

Esta atualização oficial v1.0.0.4 resolve o problema de instalação via repositório no Jellyfin, restaura a exibição da logo Nexus PobreFlix no cabeçalho superior esquerdo com link dinâmico, elimina os prompts flutuantes de gamepad ativados indevidamente pelo teclado, corrige a navegação de "Top Séries" para a biblioteca correta, desativa a prévia automática de vídeo no hover e consolida o pacote com um único arquivo CSS oficial.

---

### ⏱️ Ajustes e Novidades desta Versão (v1.0.0.4 - 05/10/2026):
* **Correção Definitiva da Instalação via Repositório no Jellyfin**: Alinhamento estrito da URL do repositório no `manifest.json` com a tag `v1.0.0.4` (evitando erro 404 retornado pelo GitHub) e empacotamento higienizado com arquivo CSS único.
* **Remoção Total dos Prompts e Rodapé Flutuante de Controle (`#jms-gamepad-footer`)**: O rodapé flutuante com prompts de botões (A, B, Y, LB/RB) foi completamente desativado e removido do fluxo visual, não disparando mais sob atalhos normais de digitação ou navegação (`Ctrl+Shift`, `Win+Shift`).
* **Restauração Dinâmica da Logo Nexus PobreFlix no Cabeçalho**: Injetado elemento de logo oficial no topo esquerdo (`.skinHeader .headerLeft`) ao lado do botão hambúrguer com clique funcional redirecionando para a tela inicial (`#/home`).
* **Correção da Rota de "Top Séries"**: Implementada priorização inteligente na resolução da biblioteca de séries (filtrando e priorizando bibliotecas reais de séries como "Séries", "Series" ou "TV Shows" em vez de redirecionar incorretamente para "Animes" ou "Desenhos").
* **Desativação Padrão de Prévia de Vídeo (Hover)**: A reprodução automática de vídeos ao passar o mouse sobre cards e slider foi desligada por padrão nas configurações (`none`), mantendo a navegação limpa, silenciosa e sem janelas modais indesejadas.
* **Ergonomia e Acessibilidade do Botão Hambúrguer (`≡`)**: Ampliada a área de toque e clique para 44x44px com espaçamento à esquerda de 10px (desktop) e 6px (mobile/TV), tornando o botão fácil de acionar em telas touch e televisores.
* **Purgação Completa de Fallbacks Residuais em Turco**: Ajustados fallbacks em `recentRows.js` e `genreExplorer.js` para garantir 100% de localização em PT-BR.
* **Pacote de Distribuição Consolidado com CSS Único**: O arquivo `.zip` da release agora contém estritamente `Jellyfin.Plugin.JMSFusion.dll`, `meta.json` e a folha de estilos consolidada `PobreFlix - v1.css`.

---

### 🛠️ Detalhes do Build:
- **Arquivo**: `NexusPobreFlix-1.0.0.4.zip`
- **Versão**: `1.0.0.4`
- **MD5**: `90f201bc18041b2a1f2a76e15d5e3dd9`
- **Status**: Pronta para Publicação
- **Data**: 05/10/2026

---

# 📦 Nexus PobreFlix Plugin — Build v1.0.0.3 (Jellyfin 12.1 & .NET 10)

Esta build oficial traz a resiliência total do slider para bibliotecas recém-criadas ou com poucas mídias (como acervos com 1 única série), eliminação definitiva de todos os termos em turco (100% PT-BR) e novo empacotamento para distribuição.

---

### ⏱️ Ajustes e Novidades desta Versão (v1.0.0.3 - 04/10/2026):
* **Resiliência Total do Slider para Bibliotecas com Poucas Mídias**: Removidas travas rígidas de `hasOverview=true` e `imageTypes=Logo,Backdrop` que impediam a exibição do banner quando itens novos não possuíam logo ou sinopse. Adicionadas consultas de contingência automáticas em camadas no `main.js`.
* **Suporte Robusto a Biblioteca com 1 Único Item**: O slider agora renderiza perfeitamente acervos com apenas 1 série ou filme, com suporte a fallback de Logo para título estilizado e timer estável sem conflitos de animação.
* **Purgação Completa de Termos em Turco (100% PT-BR)**: Eliminados todos os textos em turco remanescentes (`Rastgele İçerik Oluştur`, `ayarlar`, splash screen, fallbacks de configuração e logs de console).
* **Compatibilidade Nativa com Jellyfin 12.1 (.NET 10)**: Compilado nativamente para .NET 10 com targetAbi `12.0.0.0`.
* **Refinamento dos Controles (Xbox / Steam Deck)**: Rolagem suave (`scrollIntoView`) ao focar elementos no modo TV, bordas de foco inset arredondadas roxas sem cortes e atalhos com LB/RB no carrossel.

---

### 🛠️ Detalhes do Build:
- **Arquivo**: `NexusPobreFlix-1.0.0.3.zip`
- **Versão**: `1.0.0.3`
- **MD5**: `44e4e140b0780ea7687adcffffa95be1`
- **Status**: Pronta para Publicação
- **Data**: 04/10/2026

---

# 📦 Nexus PobreFlix Plugin — Build v1.0.0.2 (Jellyfin 12.1 & .NET 10)

Esta build oficial traz a compatibilidade definitiva com a nova geração do Jellyfin 12.0 e 12.1, recompilada nativamente em .NET 10 com correção na instalação via repositório e refinamento do suporte a controles.

---

### ⏱️ Ajustes e Novidades da Versão 1.0.0.2:
* **Suporte Nativo ao Jellyfin 12.1 (.NET 10)**: Migração e retargeting completo para .NET 10 e `Jellyfin.* 12.1.0`. `targetAbi` atualizado para `12.0.0.0`.
* **Adaptação da API de Usuários**: Correção de chamadas legadas de `_userManager.Users` para `_userManager.GetUsers()`, compatível com a nova arquitetura do Jellyfin 12.
* **Resolução do Erro de Instalação**: Sincronização e validação dos hashes MD5 no `manifest.json`.

---

### 🛠️ Detalhes do Build:
- **Arquivo**: `NexusPobreFlix-1.0.0.2.zip`
- **Versão**: `1.0.0.2`
- **MD5**: `e995cc6f31855ce03eb0cd5018dd0bf6`
- **Data**: 28/09/2026

---

# 📦 Nexus PobreFlix Plugin — Build v1.0.0.1 (Industrial)

Esta build oficial traz a implementação da integração portátil com a Steam, suporte nativo para Controles de Xbox / Steam Deck e melhorias importantes de privacidade e persistência de sessão.

---

### ⏱️ Ajustes e Atualizações Incrementais da Versão:

#### 🟢 [01/07/2026 - 04:30] — Ajustes de Navegação TV, Botão B e Foco Neon
* **Foco Neon Redondo (`box-shadow`)**: Removemos a borda de seleção (`outline`) padrão quadrada que ficava desalinhada. Adicionamos um efeito roxo neon com `box-shadow` que segue perfeitamente o arredondamento (`border-radius`) de posters, botões e listas no modo TV.
* **Navegação D-Pad Universal**: O script do controle agora simula teclas direcionais físicas de teclado tanto no modo TV quanto no modo Desktop. Isso resolveu o problema em que o controle não conseguia navegar pelas listas "Top 10" ou no modal de detalhes da mídia.
* **Botão B Universal (Voltar/Fechar)**: O botão B agora clica em botões de fechar ativos (como no diálogo de detalhes). Se não houver, simula `Escape` e aciona o histórico do navegador para fechar popups de forma segura.
* **Build Final de Produção**: DLL compilada em Release e ZIP re-gerado em `dist's/NexusPobreFlix-1.0.0.1.zip` com o hash MD5 `05e97bd92d30657e432ef71d2cda2e13`.

#### 🟢 [30/06/2026 - 21:00] — Lançamento Inicial do Suporte a Controles
* **Suporte Nativo a Gamepad**: Mapeamento básico da Gamepad API para navegação direcionada no Jellyfin TV.
* **Controles do Reprodutor**: Gatilhos LT/RT ajustam volume, bumpers LB/RB avançam/retrocedem 10s e Start alterna play/pause.
* **CSS Xbox Buttons**: Injeção da classe `jms-gamepad-mode` para indicar atalhos com botões visuais roxos de Xbox na tela.

---

### 🛠️ Detalhes do Build:

- **Arquivo**: `NexusPobreFlix-1.0.0.1.zip`
- **Versão**: `1.0.0.1`
- **MD5**: `05e97bd92d30657e432ef71d2cda2e13`
- **Status**: Pronta para Publicação
- **Data**: 01/07/2026

---

### 📄 Notas de Publicação:

Todos os arquivos foram empacotados no workspace local em `dist's/NexusPobreFlix-1.0.0.1.zip`. O snapshot CSS correspondente (`PobreFlix - v1.css`) está armazenado de forma incremental na mesma pasta. Para fazer deploy no servidor Jellyfin, extraia os conteúdos do ZIP (`Jellyfin.Plugin.JMSFusion.dll`, `meta.json` e `PobreFlix - v1.css`) na pasta de plugins do seu servidor, reinicie o Jellyfin e aproveite!

*Build processada e validada via Script Industrial por ONeithan e Antigravity.*

---

# 📦 Nexus PobreFlix Plugin — Build v1.0.0.0 (Industrial)

Esta é a primeira build estável oficial do fork **Nexus PobreFlix** para o Jellyfin. Ela traz a consolidação completa do motor visual premium roxo, layout imersivo baseado no Abyss, tela de login centralizada, suporte nativo offline para todos os recursos de marca e localização 100% absoluta para o Português do Brasil.

### 🚀 Changelog Industrial:

* **🟣 Branding e Identidade Visual Nexus**: Substituição total de cores rosadas e azuis pela paleta roxa oficial do Nexus (`#7a5cff`) em todos os sliders, botões, modais e menus de configuração.
* **🔒 Centralização Perfeita do Login**: O painel de login foi perfeitamente centralizado horizontalmente no desktop e mobile, com blindagem para que o formulário de login desapareça por completo após a autenticação bem-sucedida.
* **🛡️ Blindagem Absoluta do Logotipo**: Injeção do logotipo roxo local offline (`/Plugins/JMSFusion/assets/LogoPng`) aplicada de forma cirúrgica e com altíssima especificidade sobre os seletores de marca nativos do Jellyfin (`.headerLogo`, `.logoHeader` e `.headerLogoWithText`), garantindo a sua visibilidade permanente sem duplicidades e ocultando os SVGs originais.
* **🧼 Neutralização e Transparência do Cabeçalho**: Purga de cores cinzas sólidas e preenchimentos invasivos vindo de injeções de cache nas abas superiores (`.headerTabs`, `.emby-tabs` e `.emby-tabs-slider`), restaurando a transparência nativa limpa do Jellyfin.
* **🔊 Controle Inteligente de Trailers**: Redução do volume padrão de trailers para 5% e atenuação temporária reativa para 1% sob hover do mouse (nos players de YouTube e HTML5 local), prevenindo picos de áudio incômodos.
* **🇧🇷 Localização PT-BR Absoluta**: Tradução e auditoria cirúrgica de todas as strings e menus administrativos, eliminando termos remanescentes em turco e inglês.
* **🌐 Autonomia Offline Completa**: Redirecionamento de todas as requisições de recursos gráficos (como logos) de servidores externos do GitHub para rotas locais offline embutidas no próprio plugin, possibilitando a autonomia total em redes domésticas fechadas.

---

### 🛠️ Detalhes do Build:

- **Arquivo**: `NexusPobreFlix-1.0.0.0.zip`
- **Versão**: `1.0.0.0`
- **MD5**: `b9083a113574c96fe4d0cbf3af274cff`
- **Status**: Pronta para Publicação
- **Data**: 24/05/2026

---

### 📄 Notas de Publicação:

Esta é a build oficial de lançamento estável (v0). De acordo com a Regra #10, todos os arquivos foram empacotados no workspace local em `dist's/NexusPobreFlix-1.0.0.0.zip`. O snapshot CSS correspondente (`PobreFlix - v0.css`) está armazenado de forma incremental na mesma pasta. Para deploy, substitua a DLL do plugin na pasta correspondente do Jellyfin Server, reinicie o servidor e execute um Hard Refresh (Ctrl+F5) no navegador do cliente para limpar o cache de estilos.

*Build processada e validada via Script Industrial por ONeithan e Antigravity.*
