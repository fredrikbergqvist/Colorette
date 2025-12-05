function setPalette({b, bc, a, n}) {
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
	if (n) {
		root.style.setProperty("--neutral", n);
		document.getElementById("color-neutral").value = n;
	}
}

function loadPaletteFromUrl() {
	const params = new URLSearchParams(window.location.search);
	const b = params.get("b");
	const bc = params.get("bc");
	const a = params.get("a");
	const n = params.get("n");

	const normalize = (v) => (v ? (v.startsWith("#") ? v : "#" + v) : null);

	const palette = {
		b: normalize(b),
		bc: normalize(bc),
		a: normalize(a),
		n: normalize(n),
	};

	if (palette.b || palette.bc || palette.a || palette.n) {
		setPalette(palette);
	}
}

const paletteKey = "colorette-saved-palettes"

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

	const a = document.getElementById("color-accent").value;
	const bc = document.getElementById("color-base-content").value;
	const b = document.getElementById("color-base").value;
	const n = document.getElementById("color-neutral").value;

	root.style.setProperty("--accent", a);
	root.style.setProperty("--base-content", bc);
	root.style.setProperty("--base", b);
	root.style.setProperty("--neutral", n);

	const stripHash = (v) => (v.startsWith("#") ? v.slice(1) : v);

	const params = new URLSearchParams(window.location.search);
	params.set("b", stripHash(b));
	params.set("bc", stripHash(bc));
	params.set("a", stripHash(a));
	params.set("n", stripHash(n));

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
