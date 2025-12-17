import {setPaletteInputs} from "./forms";

/**
 * Update the URL to reflect the current pallet values
 * @param palette { Palette}
 */
export function savePaletteToUrl(palette) {

	const {b, bc, a, nd, nl, nm, p, s} = palette;

	const stripHash = (v) => (v.startsWith("#") ? v.slice(1) : v);

	const params = new URLSearchParams(window.location.search);
	params.set("b", stripHash(b));
	params.set("bc", stripHash(bc));
	params.set("a", stripHash(a));
	params.set("nd", stripHash(nd));
	params.set("nl", stripHash(nl));
	params.set("nm", stripHash(nm));
	params.set("p", stripHash(palette.p));
	params.set("s", stripHash(palette.s));

	const newUrl =
		window.location.pathname +
		"?" +
		params.toString() +
		window.location.hash;

	window.history.pushState(null, "", newUrl);
}

/**
 *
 * @returns {Palette}
 */
export function getPaletteFromUrl() {
	const params = new URLSearchParams(window.location.search);
	const nm = params.get("nm");
	const b = params.get("b");
	const bc = params.get("bc");
	const a = params.get("a");
	const nd = params.get("nd");
	const nl = params.get("nl");
	const p = params.get("p");
	const s = params.get("s");

	const normalize = (v) => (v ? (v.startsWith("#") ? v : "#" + v) : null);

	return {
		b: normalize(b),
		bc: normalize(bc),
		a: normalize(a),
		nd: normalize(nd),
		nl: normalize(nl),
		p: normalize(p),
		s: normalize(s),
		nm: nm || "",
	}
}

export function loadPaletteFromUrl() {
	const palette = getPaletteFromUrl();
	if (palette.b || palette.bc || palette.a || palette.n) {
		setPaletteInputs(palette);
	}
}
