import {EVENTS} from "../util/events";

export class ThemeSelector extends HTMLElement {
	showPanel = false;

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
		this.render();
		window.addEventListener(EVENTS.toggleThemePanel, this.togglePanel.bind(this));
	}

	disconnectedCallback() {
		window.removeEventListener(EVENTS.toggleThemePanel, this.togglePanel.bind(this));
	}

	setTheme(theme) {
		document.documentElement.setAttribute("data-theme", theme);
	}

	render() {
		if (!this.showPanel) {
			const circleBtn = this.querySelector("#theme-circle-btn");
			const arcBtn = this.querySelector("#theme-arc-btn");
			if (circleBtn) {
				this.querySelector("#theme-circle-btn").removeEventListener("click", () => this.setTheme("circles"));
			}
			if (arcBtn) {
				this.querySelector("#theme-arc-btn").removeEventListener("click", () => this.setTheme("arc"));
			}
			this.innerHTML = ``;
			return;
		}

		this.innerHTML = `
		<div class="side-menu" id="theme-menu">
			<h3>Themes</h3>
			<div>
			<button id="theme-circle-btn" class="btn">Circles</button>
			<button id="theme-arc-btn" class="btn">Arcs</button>
			</div>

		</div>
		`;
		this.querySelector("#theme-circle-btn").addEventListener("click", () => this.setTheme("circles"));
		this.querySelector("#theme-arc-btn").addEventListener("click", () => this.setTheme("arc"))
	}
}
