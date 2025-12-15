import {defineConfig} from "vite";

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
			enforce: "post",
			apply: "build",
			generateBundle(options, bundle) {
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

				htmlFile.source = html;
			},
		},
	],
});
