import {getSavedPalettes} from "../util/palettes";
import {EVENTS} from "../util/events";

export class SavedPaletteCounter extends HTMLElement {

	#render() {
		const savedPalettes = getSavedPalettes();
		this.innerHTML = `<span id="palette-count" role="status">${savedPalettes.length}<span class="sr-only"> saved palettes</span></span>`
	}

	connectedCallback() {
		this.#render();
		window.addEventListener(EVENTS.updatePalettes, () => this.#render());
	}

	disconnectedCallback() {
		window.removeEventListener(EVENTS.updatePalettes, () => this.#render());
	}
}
