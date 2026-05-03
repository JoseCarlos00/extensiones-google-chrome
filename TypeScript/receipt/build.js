const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const isWatch = process.argv.includes('--watch');

const shared = {
	bundle: true,
	minify: false,
	sourcemap: true,
	platform: 'browser',
	target: 'chrome110',
	format: 'iife',
};

// ─── Archivos estáticos a copiar ────────────────────────────────────────────
const staticFiles = [
	{ from: 'public/manifest.json', to: 'dist/manifest.json' },
	{ from: 'popup.html', to: 'dist/popup.html' },
	{ from: 'public/images', to: 'dist/images' },
];

function copyFile(from, to) {
	fs.mkdirSync(path.dirname(to), { recursive: true });
	fs.copyFileSync(from, to);
	console.log(`Copiado: ${from} → ${to}`);
}

function copyDir(from, to) {
	fs.mkdirSync(to, { recursive: true });
	for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
		const srcPath = path.join(from, entry.name);
		const destPath = path.join(to, entry.name);
		if (entry.isDirectory()) {
			copyDir(srcPath, destPath);
		} else {
			fs.copyFileSync(srcPath, destPath);
		}
	}
	console.log(`Copiado directorio: ${from} → ${to}`);
}

function copyStatic() {
	for (const { from, to } of staticFiles) {
		if (fs.existsSync(from)) {
			const stat = fs.statSync(from);
			if (stat.isDirectory()) {
				copyDir(from, to);
			} else {
				copyFile(from, to);
			}
		} else {
			console.warn(`No encontrado, omitiendo: ${from}`);
		}
	}
}

// ─── Entry points ────────────────────────────────────────────────────────────
const entryPoints = [
	{
		in: 'src/receipt-storage/main.ts',
		out: 'dist/receipt-storage',
	},
	{
		in: 'src/receipt-manager/main.ts',
		out: 'dist/receipt-manager',
	},
	{
		in: 'src/popup/main.ts',
		out: 'dist/popup',
	},
];

// ─── Build ───────────────────────────────────────────────────────────────────
async function build() {
	copyStatic();

	if (isWatch) {
		const contexts = await Promise.all(
			entryPoints.map(({ in: entryPoint, out }) =>
				esbuild.context({
					...shared,
					entryPoints: [entryPoint],
					outfile: `${out}.js`,
				}),
			),
		);

		await Promise.all(contexts.map((ctx) => ctx.watch()));
		console.log('Watching for changes...');
	} else {
		await Promise.all(
			entryPoints.map(({ in: entryPoint, out }) =>
				esbuild.build({
					...shared,
					entryPoints: [entryPoint],
					outfile: `${out}.js`,
				}),
			),
		);
		console.log('Build completo ✓');
	}
}

build().catch((err) => {
	console.error('Build error:', err);
	process.exit(1);
});
