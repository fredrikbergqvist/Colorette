/** @type {string} */
const paletteKey = "colorette-saved-palettes";

/**
 * Get the saved palettes from local storage
 * @returns {Object<string, Palette>}
 */
export function getSavedPalettesFromLocalStorage() {
	if (!window.localStorage) {
		console.warn("No local storage available");
		return {};
	}
	const savedPalettes = window.localStorage.getItem(paletteKey);
	if (savedPalettes) {
		return JSON.parse(savedPalettes);
	}
	return {};
}

export function savePalettesInLocalStorage(palettes) {
	window.localStorage.setItem(paletteKey, JSON.stringify(palettes));
}
