import {applyPaletteToPage} from "../util/palettes";
import {getPaletteFromUrl, savePaletteToUrl} from "../util/urlhandling";
import {setPaletteInputs} from "../util/forms";

export class SavedPalette extends HTMLElement {
	static observedAttributes = ["nm", "a", "b", "bc", "nd", "nl"];
	activePalette;

	#render() {
		const nm = this.getAttribute("nm");
		const b = this.getAttribute("b");
		const a = this.getAttribute("a");
		const bc = this.getAttribute("bc");
		const nd = this.getAttribute("nd");
		const nl = this.getAttribute("nl");
		if (!b || !bc || !nd || !nl) return "";
		return `<div class="saved-palette-item">
			<div class="color-swatch" style="background-color: ${a}"></div>
			<div class="color-swatch" style="background-color: ${b}"></div>
			<div class="color-swatch" style="background-color: ${bc}"></div>
			<div class="color-swatch" style="background-color: ${nl}"></div>
			<div class="color-swatch" style="background-color: ${nd}"></div>
		<div class="palette-name" style="color: ${bc};background-color: ${b}"> ${nm}</div>
		</div>`
	}

	#previewOnPage() {
		this.activePalette = getPaletteFromUrl()
		const newPalette = {
			a: this.getAttribute("a"),
			b: this.getAttribute("b"),
			bc: this.getAttribute("bc"),
			nd: this.getAttribute("nd"),
			nl: this.getAttribute("nl"),
			nm: this.getAttribute("nm"),
		}
		applyPaletteToPage(newPalette);
		return newPalette;
	}

	#restorePage() {
		applyPaletteToPage(this.activePalette);
		this.activePalette = null;
	}

	#selectPalette() {
		const palette = this.#previewOnPage();
		setPaletteInputs(palette);
		applyPaletteToPage(palette);
		savePaletteToUrl(palette);

	}

	connectedCallback() {
		this.innerHTML = this.#render();
		this.querySelector(".saved-palette-item").addEventListener("mouseenter", this.#previewOnPage.bind(this));
		this.querySelector(".saved-palette-item").addEventListener("mouseleave", this.#restorePage.bind(this));
		this.querySelector(".saved-palette-item").addEventListener("click", this.#selectPalette.bind(this));
	}

	disconnectedCallback() {
		this.querySelector(".saved-palette-item").removeEventListener("mouseenter", this.#previewOnPage.bind(this));
		this.querySelector(".saved-palette-item").removeEventListener("mouseleave", this.#restorePage.bind(this));
	}
}
