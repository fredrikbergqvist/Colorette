import {applyPaletteToPage, deletePalette} from "../util/palettes";
import {getPaletteFromUrl, savePaletteToUrl} from "../util/urlhandling";
import {setPaletteInputs} from "../util/forms";

export class SavedPalette extends HTMLElement {
	static observedAttributes = ["nm", "a", "b", "bc", "nd", "nl", "p", "s"];
	activePalette;

	#render() {
		const nm = this.getAttribute("nm");
		const b = this.getAttribute("b");
		const a = this.getAttribute("a");
		const bc = this.getAttribute("bc");
		const nd = this.getAttribute("nd");
		const nl = this.getAttribute("nl");
		const p = this.getAttribute("p");
		const s = this.getAttribute("s");
		if (!b || !bc || !nd || !nl) return "";
		return `<div class="saved-palette-item" tabindex="0" role="button" aria-label="Select saved palette ${nm}">
		<div class="palette-name" style="color: ${bc};background-color: ${b}"> ${nm}
		<div>
		<button class="edit-btn" aria-label="Edit palette ${nm}" title="Edit saved palette ${nm}">
			<svg width="20" height="20" aria-hidden="true" focusable="false">
				<use href="#icon-edit" xlink:href="#icon-edit" />
			</svg>
		</button>
		<button class="delete-btn" aria-label="Delete saved palette ${nm}" title="Delete saved palette ${nm}">
			<svg width="20" height="20" aria-hidden="true" focusable="false">
				<use href="#icon-trash" xlink:href="#icon-trash" />
			</svg>
		</button>
		</div>
		</div>
			<div class="color-swatch" style="background-color: ${a}"></div>
			<div class="color-swatch" style="background-color: ${p}"></div>
			<div class="color-swatch" style="background-color: ${s}"></div>
			<div class="color-swatch" style="background-color: ${b}"></div>
			<div class="color-swatch" style="background-color: ${bc}"></div>
			<div class="color-swatch" style="background-color: ${nl}"></div>
			<div class="color-swatch" style="background-color: ${nd}"></div>
		</div>`
	}

	/**
	 * @returns {Palette}
	 */
	#previewOnPage() {
		this.activePalette = getPaletteFromUrl()
		/** type {Palette} */
		const newPalette = {
			a: this.getAttribute("a"),
			b: this.getAttribute("b"),
			bc: this.getAttribute("bc"),
			nd: this.getAttribute("nd"),
			nl: this.getAttribute("nl"),
			nm: this.getAttribute("nm"),
			p: this.getAttribute("p"),
			s: this.getAttribute("s"),
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
		savePaletteToUrl(palette);
		applyPaletteToPage(palette);
		this.activePalette = null;
	}

	#deletePalette() {
		this.querySelector(".saved-palette-item").classList.add("remove");
		setTimeout(() =>
				deletePalette(this.getAttribute("nm"))
			, 240);
	}

	connectedCallback() {
		this.innerHTML = this.#render();
		this.querySelector(".saved-palette-item").addEventListener("mouseenter", this.#previewOnPage.bind(this));
		this.querySelector(".saved-palette-item").addEventListener("mouseleave", this.#restorePage.bind(this));
		this.querySelector(".edit-btn").addEventListener("click", this.#selectPalette.bind(this));
		this.querySelector(".delete-btn").addEventListener("click", this.#deletePalette.bind(this));
		this.querySelector(".saved-palette-item").addEventListener("keydown", (e) => e.key === "Enter" && this.#selectPalette())
	}

	disconnectedCallback() {
		this.querySelector(".saved-palette-item").removeEventListener("mouseenter", this.#previewOnPage.bind(this));
		this.querySelector(".saved-palette-item").removeEventListener("mouseleave", this.#restorePage.bind(this));
	}
}
