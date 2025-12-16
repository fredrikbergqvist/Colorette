import {applyPaletteToPage, savePalette} from "./palettes";

/**
 * Get the current pallet values from the UI
 * @returns {Palette}
 */
export function getPaletteFromForm() {
	const nm = document.getElementById("palette-name").value;
	const a = document.getElementById("color-accent").value;
	const bc = document.getElementById("color-base-content").value;
	const b = document.getElementById("color-base").value;
	const nd = document.getElementById("color-neutral-dark").value;
	const nl = document.getElementById("color-neutral-light").value;
	const p = document.getElementById("color-primary").value;
	const s = document.getElementById("color-secondary").value;

	return {b, bc, a, nd, nl, nm, p, s};
}

/**
 * Set the pallet values in the UI
 * @param palette {Palette}
 */
export function setPaletteInputs(palette) {
	const {b, bc, a, nd, nl, nm, p, s} = palette;
	const root = document.documentElement;

	if (b) {
		root.style.setProperty("--base", b);
		document.getElementById("color-base").value = b;
	}
	if (bc) {
		root.style.setProperty("--base-content", bc);
		document.getElementById("color-base-content").value = bc;
	}
	if (a) {
		root.style.setProperty("--accent", a);
		document.getElementById("color-accent").value = a;
	}
	if (nl) {
		root.style.setProperty("--neutral-light", nl);
		document.getElementById("color-neutral-light").value = nl;
	}
	if (nd) {
		root.style.setProperty("--neutral-dark", nd);
		document.getElementById("color-neutral-dark").value = nd;
	}
	if (nm) {
		document.getElementById("palette-name").value = nm;
	}
	if (p) {
		root.style.setProperty("--primary", p);
		document.getElementById("color-primary").value = p;
	}
	if (s) {
		root.style.setProperty("--secondary", s);
		document.getElementById("color-secondary").value = s;
	}
}

function applyPalette() {

	const palette = getPaletteFromForm();

	applyPaletteToPage(palette);
}

function handleSavePalette() {
	const palette = getPaletteFromForm();
	applyPaletteToPage(palette);
	savePalette(palette);
}

export function registerInputListeners() {
	document.getElementById("color-accent").addEventListener("input", applyPalette);
	document.getElementById("color-base").addEventListener("input", applyPalette);
	document.getElementById("color-base-content").addEventListener("input", applyPalette);
	document.getElementById("color-neutral-dark").addEventListener("input", applyPalette);
	document.getElementById("color-neutral-light").addEventListener("input", applyPalette);
	document.getElementById("btn-generate").addEventListener("click", handleSavePalette);

}
