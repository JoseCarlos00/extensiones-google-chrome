const esbuild = require('esbuild');
const fs = require('fs');

const watch = process.argv.includes('--watch');

const options = {
	entryPoints: {
		main: 'src/main.js', // content script  -> dist/main.js
		popup: 'src/popup.js', // popup          -> dist/popup.js
	},
	
	outdir: 'dist',
	bundle: true,
	format: 'iife', // los content scripts no soportan módulos ES
	target: 'chrome110',
	minify: false,
	sourcemap: false, // el sourcemap no se necesita en el paquete de la store
	legalComments: 'inline', // conserva las licencias de html2canvas
	logLevel: 'info',
};

async function main() {
	// Estáticos: manifest.json, popup.html, style.css, icon/
	fs.mkdirSync('dist', { recursive: true });
	fs.cpSync('public', 'dist', { recursive: true });

	if (watch) {
		const ctx = await esbuild.context(options);
		await ctx.watch();
		console.log('Observando cambios en src/ (los archivos de public/ se copian solo al iniciar)...');
	} else {
		await esbuild.build(options);
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
