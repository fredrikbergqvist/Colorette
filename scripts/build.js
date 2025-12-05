#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const {minify: minifyHtml} = require("html-minifier-terser");
const CleanCSS = require("clean-css");
const terser = require("terser");

// project root is one level up from scripts/
const projectRoot = path.join(__dirname, "..");
const srcDir = path.join(projectRoot, "src");
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

async function build() {
	const cssMin = new CleanCSS({level: 2}).minify(cssSource).styles;

	const jsResult = await terser.minify(jsSource, {toplevel: false});
	if (jsResult.error) {
		console.error("JS minify error:", jsResult.error);
		process.exit(1);
	}
	const jsMin = jsResult.code;

	// Replace the (currently empty) <style>...</style> and <script>...</script>
	let processedHtml = htmlTemplate;

	// Inline CSS into first <style> tag
	processedHtml = processedHtml.replace(
		/<style>[\s\S]*?<\/style>/i,
		`<style>${cssMin}<\/style>`,
	);

	// Inline JS into first <script> tag
	processedHtml = processedHtml.replace(
		/<script[^>]*>[\s\S]*?<\/script>/i,
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
	console.log("Built", path.relative(projectRoot, distHtmlPath));
}

build().catch((err) => {
	console.error(err);
	process.exit(1);
});
