import {SavedPalettes} from "./saved-palettes";
import {SavedPaletteCounter} from "./saved-palette-counter";

export function registerComponents() {
	customElements.define("saved-palettes", SavedPalettes);
	customElements.define("saved-palette-counter", SavedPaletteCounter);
}
