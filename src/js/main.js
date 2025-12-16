/**
 * @typedef {Object} Palette
 * @property {string} b Base
 * @property {string} bc Base content
 * @property {string} a Accent
 * @property {string} nd Neutral dark
 * @property {string} nl Neutral light
 * @property {string} nm Name
 * @property {string} p Primary
 * @property {string} s Secondary
 */
import {registerComponents} from "./components/register";
import {getSavedPalettes} from "./util/palettes";
import {loadPaletteFromUrl} from "./util/urlhandling";
import {registerInputListeners} from "./util/forms"
import {inject} from "@vercel/analytics";
import {registerSW} from "virtual:pwa-register"

if (import.meta.env.PROD) {
	registerSW({immediate: true})
	inject();
}

function init() {
	window.colorette = {
		savedPalettes: undefined,
	}
	registerComponents();
	registerInputListeners();
	loadPaletteFromUrl();
	getSavedPalettes();
}

init();
