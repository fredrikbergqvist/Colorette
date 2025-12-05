function setPalette({b, bc, a, nl, nd, nm}) {
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
		setPalette(palette);
	}
}

const paletteKey = "colorette-saved-palettes"
let savedPalettes = undefined;
let paletteLinks = undefined;

function updatePaletteCount() {
	const paletteContainer = document.getElementById("palette-container")
	const paletteCountElement = document.getElementById("palette-count")
	paletteCountElement.innerHTML = savedPalettes.length
	savedPalettes.length > 0 ? paletteContainer.classList.remove("hidden") : paletteContainer.classList.add("hidden")
}

function loadPaletteListFromLocalStorage() {
	if (!window.localStorage) {
		return;
	}
	if (!savedPalettes) {
		const palettes = window.localStorage.getItem(paletteKey);
		if (palettes) {
			savedPalettes = JSON.parse(palettes);
		}
	}

	if (savedPalettes && savedPalettes.length > 0) {
		updatePaletteCount();
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

function applyPallet() {
	const root = document.documentElement;

	const nm = document.getElementById("palette-name").value;
	const a = document.getElementById("color-accent").value;
	const bc = document.getElementById("color-base-content").value;
	const b = document.getElementById("color-base").value;
	const nd = document.getElementById("color-neutral-dark").value;
	const nl = document.getElementById("color-neutral-light").value;

	root.style.setProperty("--accent", a);
	root.style.setProperty("--base-content", bc);
	root.style.setProperty("--base", b);
	root.style.setProperty("--neutral-dark", nd);
	root.style.setProperty("--neutral-light", nl);

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
	saveToLocalStorage(params.toString())
	window.history.replaceState(null, "", newUrl);
}


document.getElementById("btn-generate").addEventListener("click", applyPallet);

loadPaletteFromUrl();
loadPaletteListFromLocalStorage()
