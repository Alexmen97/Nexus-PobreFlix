import { bindCheckboxKontrol, createCheckbox, createSection } from "./shared.js";

export function createWatchlistPanel(config, labels) {
    const panel = document.createElement("div");
    panel.id = "watchlist-settings-panel";
    panel.className = "settings-panel";

    const section = createSection(labels.watchlistSettingsTab || "Configurações da Lista de Assistir Mais Tarde");

    section.appendChild(
        createCheckbox(
            "watchlistTabsSliderEnabled",
            labels.watchlistTabsSliderEnabled || "Adicionar botão da lista nas abas de navegação do topo",
            config.watchlistTabsSliderEnabled
        )
    );

    section.appendChild(
        createCheckbox(
            "watchlistAutoRemovePlayed",
            labels.watchlistAutoRemovePlayed || "Remover automaticamente itens assistidos da lista",
            config.watchlistAutoRemovePlayed
        )
    );

    const autoRemoveFavoriteCheckbox = createCheckbox(
        "watchlistAutoRemovePlayedFromFavorites",
        labels.watchlistAutoRemovePlayedFromFavorites || "Ao remover automaticamente, desmarcar também dos favoritos do Jellyfin",
        config.watchlistAutoRemovePlayedFromFavorites
    );
    autoRemoveFavoriteCheckbox.classList.add("watchlist-auto-remove-favorite-container");
    section.appendChild(autoRemoveFavoriteCheckbox);

    const importFavoritesCheckbox = createCheckbox(
        "watchlistImportFavoritesOnStartup",
        labels.watchlistImportFavoritesOnStartup || "Importar favoritos existentes do Jellyfin ao inicializar",
        config.watchlistImportFavoritesOnStartup
    );

    importFavoritesCheckbox.classList.add("watchlist-import-favorites-container");

    const importFavoritesDescription = document.createElement("div");
    importFavoritesDescription.className = "description-text";
    importFavoritesDescription.textContent = labels.watchlistImportFavoritesOnStartupDescription
        || "Ative na primeira configuração ou quando desejar sincronizar seus favoritos existentes do Jellyfin para a lista.";

    const importFavoritesWrapper = document.createElement("div");
    importFavoritesWrapper.className = "watchlist-import-wrapper";

    importFavoritesWrapper.appendChild(importFavoritesCheckbox);
    importFavoritesWrapper.appendChild(importFavoritesDescription);

    section.appendChild(importFavoritesWrapper);

    bindCheckboxKontrol("#watchlistAutoRemovePlayed", ".watchlist-auto-remove-favorite-container", 0.6);

    bindCheckboxKontrol(
        "#watchlistImportFavoritesOnStartup",
        ".watchlist-import-wrapper .description-text",
        0.5
    );

    panel.appendChild(section);
    return panel;
}
