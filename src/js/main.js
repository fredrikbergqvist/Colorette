/**
 * @typedef {Object} Palette
 * @property {string} b Base
 * @property {string} bc Base content
 * @property {string} a Accent
 * @property {string} nd Neutral dark
 * @property {string} nl Neutral light
 * @property {string} nm Name
 */
import {registerComponents} from "./components/register";
import {getSavedPalettes} from "./util/palettes";
import {loadPaletteFromUrl} from "./util/urlhandling";
import {registerInputListeners} from "./util/forms";


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
