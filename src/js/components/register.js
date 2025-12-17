import {SavedPalettes} from "./saved-palettes";
import {SavedPaletteCounter} from "./saved-palette-counter";
import {SavedPalette} from "./saved-palette";
import {ThemeSelector} from "./theme-selector";

export function registerComponents() {
	customElements.define("saved-palettes", SavedPalettes);
	customElements.define("saved-palette-counter", SavedPaletteCounter);
	customElements.define("saved-palette", SavedPalette);
	customElements.define("theme-selector", ThemeSelector);
}
