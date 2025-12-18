import {defineConfig} from "vite";
import {VitePWA} from "vite-plugin-pwa";
import {minify} from "html-minifier-terser";

export default defineConfig({
	root: "src",
	publicDir: "../static",
	build: {
		outDir: "../dist",
		emptyOutDir: true,
	},
	plugins: [
		{
			name: "inline-css",
			apply: "build",
			enforce: "post",
			async generateBundle(options, bundle) {
				const htmlFile = Object.values(bundle).find(file => file.fileName.endsWith(".html"));
				if (!htmlFile) return;

				const cssFiles = Object.values(bundle).filter(file => file.fileName.endsWith(".css"));

				let html = htmlFile.source;

				for (const cssFile of cssFiles) {
					const styleTag = `<style>\n${cssFile.source}\n</style>`;
					const filename = cssFile.fileName;
					const regex = new RegExp(`<link[^>]+href="[^"]*${filename}"[^>]*>`, "i");

					if (regex.test(html)) {
						html = html.replace(regex, styleTag);
						delete bundle[cssFile.fileName];
					}
				}

				// Add defer to script tags
				html = html.replace(/<script[^>]+src=[^>]+>/gi, (tag) => {
					if (!tag.includes("defer")) {
						return tag.replace("<script", "<script defer");
					}
					return tag;
				});

				html = await minify(html, {
					collapseWhitespace: true,
					removeComments: true,
					minifyCSS: true,
					minifyJS: true,
				});

				htmlFile.source = html;
			},
		},
		VitePWA({
			registerType: "autoUpdate",
			manifest: {
				name: "Colorette",
				short_name: "Colorette",
				description: "A simple color palette generator that lets you save and share your color palettes.",
				start_url: "/",
				display: "standalone",
				background_color: "#f4f5dd",
				theme_color: "#D3494E",
				icons: [
					{
						src: "/icon.svg",
						sizes: "any",
						type: "image/svg+xml",
					},
				],
			},
			workbox: {
				globPatterns: ["**/*.{js,css,html,svg,png,jpg}"],
			},
		}),
	],
});
