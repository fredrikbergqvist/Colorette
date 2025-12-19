import {getSavedPalettesFromLocalStorage, savePalettesInLocalStorage} from "./localstorage";
import {EVENTS} from "./events";

/**
 * Get the saved palettes from local storage or global variable
 * @public
 * @returns {Object<string, Palette>}
 */
export function getSavedPalettes() {
	if (window.colorette.savedPalettes) {
		return window.colorette.savedPalettes;
	}
	const palettes = getSavedPalettesFromLocalStorage();
	window.colorette.savedPalettes = {...palettes};
	return window.colorette.savedPalettes;
}

/**
 * @public
 * @param {Palette} palette
 */
export function savePalette(palette) {
	const savedPalettes = getSavedPalettes();
	savedPalettes[palette.nm] = palette;
	window.colorette.savedPalettes = savedPalettes;
	window.dispatchEvent(new Event(EVENTS.updatePalettes));
	savePalettesInLocalStorage(savedPalettes)
}

/**
 * Delete a saved palette from local storage and global variable
 * @param paletteName {string}
 */
export function deletePalette(paletteName) {
	const savedPalettes = getSavedPalettes();
	delete savedPalettes[paletteName];
	window.colorette.savedPalettes = savedPalettes;
	savePalettesInLocalStorage(savedPalettes)
	window.dispatchEvent(new Event(EVENTS.updatePalettes));
}

/**
 * Apply the current pallet values to the page
 * @param {Palette} palette
 */
export function applyPaletteToPage(palette) {
	if (!palette) return;
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
