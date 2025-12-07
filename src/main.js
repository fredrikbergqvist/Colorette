/**
 * @typedef {Object} Palette
 * @property {string} b Base
 * @property {string} bc Base content
 * @property {string} a Accent
 * @property {string} nd Neutral dark
 * @property {string} nl Neutral light
 * @property {string} nm Name
 */

function setPaletteInputs({b, bc, a, nl, nd, nm}) {
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

}


function loadPaletteFromUrl() {
	const params = new URLSearchParams(window.location.search);
	const nm = params.get("nm");
	const b = params.get("b");
	const bc = params.get("bc");
	const a = params.get("a");
	const nd = params.get("nd");
	const nl = params.get("nl");

	const normalize = (v) => (v ? (v.startsWith("#") ? v : "#" + v) : null);

	const palette = {
		b: normalize(b),
		bc: normalize(bc),
		a: normalize(a),
		nd: normalize(nd),
		nl: normalize(nl),
		nm: nm || "",
	};

	if (palette.b || palette.bc || palette.a || palette.n) {
		setPaletteInputs(palette);
	}
}

const paletteKey = "colorette-saved-palettes"
/** @type {Palette[]} nullable */
let savedPalettes = undefined;
let paletteLinks = undefined;

/**
 * Get the saved palettes from local storage
 * @returns {Palette[]}
 */
function getSavedPalettesFromLocalStorage() {
	if (!window.localStorage) {
		return [];
	}
	const savedPalettes = window.localStorage.getItem(paletteKey);
	if (savedPalettes) {
		return JSON.parse(savedPalettes);
	}
	return [];
}

function updatePaletteCount() {
	const paletteContainer = document.getElementById("toggle-saved-palettes")
	const paletteCountElement = document.getElementById("palette-count")
	paletteCountElement.innerHTML = savedPalettes.length
	savedPalettes.length > 0 ? paletteContainer.classList.remove("hidden") : paletteContainer.classList.add("hidden")
}

function writePaletteSwatches() {
	if (!savedPalettes) {
		return;
	}
	const listElement = document.getElementById("saved-palettes-list");
	const markup = savedPalettes.map(p => {
		return `<div class="saved-palette" style="background-color: ${p.b}">
			<div class="color-swatch" style="background-color: ${p.a}"></div>
			<div class="color-swatch" style="background-color: ${p.bc}"></div>
			<div class="color-swatch" style="background-color: ${p.nl}"></div>
			<div class="color-swatch" style="background-color: ${p.nd}"></div>

			${p.nm}
		</div>`
	})

	listElement.innerHTML = markup.join("");

}

function loadPaletteListFromLocalStorage() {
	savedPalettes = getSavedPalettesFromLocalStorage();
	if (savedPalettes && savedPalettes.length > 0) {
		updatePaletteCount();
		writePaletteSwatches();
	}

}

function saveToLocalStorage(params) {
	if (!window.localStorage) {
		return;
	}
	const savedPalettes = window.localStorage.getItem(paletteKey);
	if (savedPalettes) {
		const savedPalettesArray = JSON.parse(savedPalettes);
		if (savedPalettesArray.length < 10) {
			savedPalettesArray.push(params);
			window.localStorage.setItem(paletteKey, savedPalettesArray.join("|"));
			//TODO: Add a saved toast
			return;
		}
	}
	const newPaletteArray = [params];
	window.localStorage.setItem(paletteKey, JSON.stringify(newPaletteArray))
	//TODO: Add a saved toast
}


/**
 * Get the current pallet values from the UI
 * @returns {Palette}
 */
function getPaletteFromForm() {
	const nm = document.getElementById("palette-name").value;
	const a = document.getElementById("color-accent").value;
	const bc = document.getElementById("color-base-content").value;
	const b = document.getElementById("color-base").value;
	const nd = document.getElementById("color-neutral-dark").value;
	const nl = document.getElementById("color-neutral-light").value;

	return {b, bc, a, nd, nl, nm};
}

/**
 * Apply the current pallet values to the page
 * @param {Palette} [palette]
 */
function applyPaletteToPage(palette = getPaletteFromForm()) {
	const {b, bc, a, nd, nl, nm} = palette;

	const root = document.documentElement;
	root.style.setProperty("--accent", a);
	root.style.setProperty("--base-content", bc);
	root.style.setProperty("--base", b);
	root.style.setProperty("--neutral-dark", nd);
	root.style.setProperty("--neutral-light", nl);

}

/**
 * Update the URL to reflect the current pallet values
 * @param {Palette} [palette]

 */

function updatePageUrl(palette = getPaletteFromForm()) {

	const {b, bc, a, nd, nl, nm} = palette;

	const stripHash = (v) => (v.startsWith("#") ? v.slice(1) : v);

	const params = new URLSearchParams(window.location.search);
	params.set("b", stripHash(b));
	params.set("bc", stripHash(bc));
	params.set("a", stripHash(a));
	params.set("nd", stripHash(nd));
	params.set("nl", stripHash(nl));
	params.set("nm", stripHash(nm));

	const newUrl =
		window.location.pathname +
		"?" +
		params.toString() +
		window.location.hash;

	window.history.pushState(null, "", newUrl);
}

function applyPalette() {

	const palette = getPaletteFromForm();

	applyPaletteToPage(palette);
}

function savePallet() {
	const palette = getPaletteFromForm();
	updatePageUrl(palette);
	saveToLocalStorage(palette);
}

document.getElementById("color-accent").addEventListener("input", applyPalette);
document.getElementById("color-base").addEventListener("input", applyPalette);
document.getElementById("color-base-content").addEventListener("input", applyPalette);
document.getElementById("color-neutral-dark").addEventListener("input", applyPalette);
document.getElementById("color-neutral-light").addEventListener("input", applyPalette);
document.getElementById("btn-generate").addEventListener("click", savePallet);

loadPaletteFromUrl();
loadPaletteListFromLocalStorage()
