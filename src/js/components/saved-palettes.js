import {getSavedPalettes} from "../util/palettes";
import {EVENTS} from "../util/events";

/**
 * @public
 */
export class SavedPalettes extends HTMLElement {

	/** @param {Palette} palette */
	#PaletteSwatch(palette) {
		return `<div class="saved-palette-list">
			<div class="color-swatch" style="background-color: ${palette.a}"></div>
			<div class="color-swatch" style="background-color: ${palette.b}"></div>
			<div class="color-swatch" style="background-color: ${palette.bc}"></div>
			<div class="color-swatch" style="background-color: ${palette.nl}"></div>
			<div class="color-swatch" style="background-color: ${palette.nd}"></div>
		<div class="palette-name" style="color: ${palette.bc};background-color: ${palette.b}"> ${palette.nm}</div>
		</div>`
	}

	render() {
		const savedPalettes = getSavedPalettes();
		console.log(savedPalettes);
		let markup = savedPalettes.map(p => this.#PaletteSwatch(p));
		this.innerHTML = markup.join("");
	}

	connectedCallback() {
		window.addEventListener(EVENTS.updatePalettes, () => this.render());
		this.render();
	}

	disconnectedCallback() {
		window.removeEventListener(EVENTS.updatePalettes, () => this.render());
	}
}
