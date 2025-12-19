import {getSavedPalettes} from "../util/palettes";
import {EVENTS} from "../util/events";

/**
 * @public
 */
export class SavedPalettes extends HTMLElement {
	showPanel = false;

	render() {

		const savedPalettes = getSavedPalettes();
		let markup = Object.entries(savedPalettes).map(([_key, p]) =>
			`<saved-palette a="${p.a}" b="${p.b}" bc="${p.bc}" nd="${p.nd}" nl="${p.nl}" p="${p.p}" s="${p.s}" nm="${p.nm}"></saved-palette>`);
		if (markup.length === 0) {
			markup = [`<div class="no-saved-palettes">No saved palettes</div>`]
		}
		this.innerHTML = `
		 <div class="side-menu" id="saved-palettes-menu">
			<h3>Saved palettes</h3>
		 ${markup.join("")}
		 </div>`;
	}

	togglePanel() {
		this.showPanel = !this.showPanel;
		if (!this.showPanel) {
			this.querySelector(".side-menu").style.opacity = "0";
			setTimeout(() => this.querySelector(".side-menu").style.display = "none", 300);
			return
		}
		this.render();
	}

	connectedCallback() {
		window.addEventListener(EVENTS.updatePalettes, () => this.render());
		window.addEventListener(EVENTS.toggleSavedPalettePanel, this.togglePanel.bind(this));
		this.render();
	}

	disconnectedCallback() {
		window.removeEventListener(EVENTS.updatePalettes, () => this.render());
		window.removeEventListener(EVENTS.toggleSavedPalettePanel, this.togglePanel.bind(this));
	}
}
