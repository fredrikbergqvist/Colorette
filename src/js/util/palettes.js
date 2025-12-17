import {getSavedPalettesFromLocalStorage, savePalettesInLocalStorage} from "./localstorage";
import {EVENTS} from "./events";

/**
 * Get the saved palettes from local storage or global variable
 * @public
 * @returns {Palette[]}
 */
export function getSavedPalettes() {
	if (window.colorette.savedPalettes) {
		return window.colorette.savedPalettes;
	}
	const palettes = getSavedPalettesFromLocalStorage();
	window.colorette.savedPalettes = palettes;
	return [...palettes];
}

/**
 * @public
 * @param {Palette} palette
 */
export function savePalette(palette) {
	const savedPalettes = getSavedPalettes()
	savedPalettes.push(palette);
	window.colorette.savedPalettes = savedPalettes;
	window.dispatchEvent(new Event(EVENTS.updatePalettes));
	savePalettesInLocalStorage(savedPalettes)
}

/**
 * Apply the current pallet values to the page
 * @param {Palette} palette
 */
export function applyPaletteToPage(palette) {
	const {b, bc, a, nd, nl, p, s} = palette;

	const root = document.documentElement;
	root.style.setProperty("--accent", a);
	root.style.setProperty("--base-content", bc);
	root.style.setProperty("--base", b);
	root.style.setProperty("--neutral-dark", nd);
	root.style.setProperty("--neutral-light", nl);
	root.style.setProperty("--primary", p);
	root.style.setProperty("--secondary", s);

}
