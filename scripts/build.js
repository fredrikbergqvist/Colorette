#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const {minify: minifyHtml} = require("html-minifier-terser");
const CleanCSS = require("clean-css");
const terser = require("terser");

// project root is one level up from scripts/
const projectRoot = path.join(__dirname, "..");
const srcDir = path.join(projectRoot, "src");
const staticDir = path.join(projectRoot, "static");
const srcHtmlPath = path.join(srcDir, "index.html");
const srcCssPath = path.join(srcDir, "styles.css");
const srcJsPath = path.join(srcDir, "main.js");

const distDir = path.join(projectRoot, "dist");
const distHtmlPath = path.join(distDir, "index.html");

if (!fs.existsSync(distDir)) {
	fs.mkdirSync(distDir, {recursive: true});
}

const htmlTemplate = fs.readFileSync(srcHtmlPath, "utf8");
const cssSource = fs.readFileSync(srcCssPath, "utf8");
const jsSource = fs.readFileSync(srcJsPath, "utf8");

function copyStaticToDist() {
	if (!fs.existsSync(staticDir)) {
		return;
	}

	const entries = fs.readdirSync(staticDir, {withFileTypes: true});
	for (const entry of entries) {
		if (!entry.isFile()) continue;

		const srcPath = path.join(staticDir, entry.name);
		const destPath = path.join(distDir, entry.name);
		fs.copyFileSync(srcPath, destPath);
	}
}

async function build() {
	const cssMin = new CleanCSS({level: 2}).minify(cssSource).styles;

	const jsResult = await terser.minify(jsSource, {toplevel: false});
	if (jsResult.error) {
		console.error("JS minify error:", jsResult.error);
		process.exit(1);
	}
	const jsMin = jsResult.code;

	let processedHtml = htmlTemplate;

	// Remove the link to ./styles.css in the built HTML
	processedHtml = processedHtml.replace(
		/<link[^>]+href=["']\.\/styles\.css["'][^>]*>\s*/i,
		"",
	);

	// Inject minified CSS into a new <style> tag just before </head>
	processedHtml = processedHtml.replace(
		/<\/head>/i,
		`<style>${cssMin}<\/style><\/head>`,
	);

	// Inline JS into the first <script src="./main.js"> tag
	processedHtml = processedHtml.replace(
		/<script[^>]+src=["']\.\/main\.js["'][^>]*>[\s\S]*?<\/script>/i,
		`<script>${jsMin}<\/script>`,
	);

	const minifiedHtml = await minifyHtml(processedHtml, {
		collapseWhitespace: true,
		removeComments: true,
		removeRedundantAttributes: true,
		removeOptionalTags: false,
		minifyCSS: false,
		minifyJS: false,
		sortAttributes: true,
		sortClassName: false,
	});

	fs.writeFileSync(distHtmlPath, minifiedHtml, "utf8");

	// Copy top-level files from /static into /dist (no nested static dir)
	copyStaticToDist();

	console.log("Built", path.relative(projectRoot, distHtmlPath));
}

build().catch((err) => {
	console.error(err);
	process.exit(1);
});
