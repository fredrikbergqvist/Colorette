import {getSavedPalettes} from "../util/palettes";
import {EVENTS} from "../util/events";

export class SavedPaletteCounter extends HTMLElement {

	#render() {
		const savedPalettes = getSavedPalettes();
		const count = Object.keys(savedPalettes).length;
		this.innerHTML = `<span id="palette-count" role="status">${count}<span class="sr-only"> saved palettes</span></span>`
	}

	connectedCallback() {
		this.#render();
		window.addEventListener(EVENTS.updatePalettes, () => this.#render());
	}

	disconnectedCallback() {
		window.removeEventListener(EVENTS.updatePalettes, () => this.#render());
	}
}
