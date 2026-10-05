# 🚀 Nexus PobreFlix Plugin — Lançamento Oficial v1.0.0.4 (Jellyfin 12.1 & .NET 10)

Esta atualização oficial v1.0.0.4 corrige definitivamente o erro de instalação via repositório no Jellyfin, restaura a logo do Nexus PobreFlix no cabeçalho superior esquerdo ao lado do botão hambúrguer, desativa totalmente a barra flutuante de controle ativada por atalhos de teclado, corrige o direcionamento da categoria "Top Séries", desliga por padrão a reprodução automática de vídeo no hover e consolida o pacote de distribuição com CSS único oficial.

---

### 🌟 O que mudou nesta versão (v1.0.0.4):

* 📥 **Correção Definitiva da Instalação via Repositório no Jellyfin**:
  - Alinhamento estrito entre a URL configurada no `manifest.json` e a release do GitHub (evitando o retorno de HTTP 404 que causava *"Um erro ocorreu durante a instalação do plugin"*).
  - Pacote ZIP completamente higienizado contendo estritamente um único arquivo CSS oficial (`PobreFlix - v1.css`), eliminando duplicidades.

* 🚫 **Remoção Total dos Prompts e Rodapé Flutuante de Controle (`#jms-gamepad-footer`)**:
  - O rodapé com os botões (A Selecionar, B Voltar, Y Menu, LB/RB Mudar Banner) foi completamente removido e desativado.
  - Eliminado o listener de teclado que forçava a interface em modo controle ao pressionar atalhos como `Ctrl+Shift` ou `Win+Shift`.

* 🏷️ **Restauração Dinâmica da Logo Nexus PobreFlix no Cabeçalho**:
  - Injeção automática da logo oficial do Nexus PobreFlix no cabeçalho superior esquerdo (`.skinHeader .headerLeft`), posicionada ao lado do botão hambúrguer (`≡`).
  - O clique sobre a logo funciona como atalho dinâmico para a Home (`#/home`), persistindo em trocas de rota SPA.

* 🎬 **Correção de Rota em "Top Séries"**:
  - O clique no título da seção "Top Séries" agora prioriza inteligentemente as bibliotecas de séries reais (como "Séries", "Series" ou "TV Shows"), impedindo que o Jellyfin abra incorretamente a biblioteca de "Animes" ou desenhos.

* 🔇 **Desativação Padrão de Prévia de Vídeo (Hover)**:
  - Prévia de trailers/vídeos no hover desativada por padrão (`previewPlaybackMode: 'none'`), evitando a abertura indesejada de modais ou reprodução de áudio/vídeo ao passar o mouse sobre cards e slider.

* 📱 **Ergonomia do Botão Hambúrguer (`≡`) em Telas Touch, Celular e Modo TV**:
  - Área de toque ampliada para `44px x 44px` com margens refinadas e padding seguro, garantindo facilidade de clique no dedo ou via controle remoto em Smart TVs e LibreELEC.

* 🇧🇷 **Purgação Completa de Termos em Turco (100% PT-BR)**:
  - Eliminados todos os fallbacks remanescentes em turco em `recentRows.js` e `genreExplorer.js`.

* 📦 **Pacote de Distribuição Consolidado com CSS Único**:
  - O arquivo `.zip` da release contém estritamente `Jellyfin.Plugin.JMSFusion.dll`, `meta.json` e a folha de estilo consolidada `PobreFlix - v1.css`.

---

### 🛠️ Informações Técnicas e Checksum:

- **Nome do Arquivo**: `NexusPobreFlix-1.0.0.4.zip`
- **Versão**: `1.0.0.4`
- **MD5 do ZIP**: `90f201bc18041b2a1f2a76e15d5e3dd9`
- **Target ABI**: `12.0.0.0` (Jellyfin 12.0 / 12.1 compilado nativamente em .NET 10)
- **Status**: Pronta para Publicação
- **Data**: 05/10/2026

---

### ⚠️ INSTRUÇÃO IMPORTANTE PARA CRIAR A RELEASE NO GITHUB:

Ao criar a nova release no GitHub:
1. **Tag**: crie a tag digitando exatamente **`v1.0.0.4`** (com o **`v`** minúsculo no início!).
   > *Nota: Na v1.0.0.3, a tag foi criada como `1.0.0.3` (sem o `v`), fazendo com que o GitHub retornasse erro 404 quando o Jellyfin tentava baixar a URL `.../v1.0.0.4/...`.*
2. **Título da Release**: `Nexus PobreFlix Plugin v1.0.0.4`
3. **Anexe o arquivo**: `NexusPobreFlix-1.0.0.4.zip`
4. Publique a release!
