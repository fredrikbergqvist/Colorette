import {getSavedPalettes} from "../util/palettes";
import {EVENTS} from "../util/events";

/**
 * @public
 */
export class SavedPalettes extends HTMLElement {

	render() {
		const savedPalettes = getSavedPalettes();
		console.log(savedPalettes);
		let markup = savedPalettes.map(p => `<saved-palette a="${p.a}" b="${p.b}" bc="${p.bc}" nd="${p.nd}" nl="${p.nl}" nm="${p.nm}"></saved-palette>`);
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
