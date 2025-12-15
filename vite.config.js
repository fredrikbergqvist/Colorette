import {defineConfig} from "vite";
import {viteSingleFile} from "vite-plugin-singlefile";

export default defineConfig({
	root: "src",
	publicDir: "../static",
	build: {
		outDir: "../dist",
		emptyOutDir: true,
	},
	plugins: [viteSingleFile(), {
		name: "move-script-to-body-end",
		enforce: "post",
		generateBundle(options, bundle) {
			const htmlFile = Object.values(bundle).find(file => file.fileName.endsWith(".html"));
			if (htmlFile) {
				let html = htmlFile.source;
				const scriptRegex = /<script type="module" crossorigin>[\s\S]*?<\/script>/;
				const match = html.match(scriptRegex);
				if (match) {
					const script = match[0];
					html = html.replace(script, "").replace("</body>", `${script}</body>`);
					htmlFile.source = html;
				}
			}
		},
	}],
});
