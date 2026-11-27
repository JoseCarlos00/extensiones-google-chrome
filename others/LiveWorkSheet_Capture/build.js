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

// ─── Archivos estáticos ─────────────────────────────────────────────────────

const staticFiles = [
	// Extensión
	{ from: 'public/manifest.json', to: 'dist/manifest.json' },
	{ from: 'public/popup.html', to: 'dist/popup.html' },
	{ from: 'public/background.js', to: 'dist/background.js' },

	// Recursos
	{ from: 'public/images', to: 'dist/images' },
	{ from: 'public/css', to: 'dist/css' },

	// Inventory Insight
	{
		from: 'src/inventory_insight/print/print.html',
		to: 'dist/inventory_insight/print/print.html',
	},
	{
		from: 'src/inventory_insight/print/print.css',
		to: 'dist/inventory_insight/print/print.css',
	},

	// Shipment Detail
	{
		from: 'src/shipment_detail/print/print.html',
		to: 'dist/shipment_detail/print/print.html',
	},
	{
		from: 'src/shipment_detail/print/print.css',
		to: 'dist/shipment_detail/print/print.css',
	},

	// Shipping Container
	{
		from: 'src/shipping_container/print/print.html',
		to: 'dist/shipping_container/print/print.html',
	},
	{
		from: 'src/shipping_container/print/print.css',
		to: 'dist/shipping_container/print/print.css',
	},

	// Work Insight
	{
		from: 'src/work_insight/print/print.html',
		to: 'dist/work_insight/print/print.html',
	},
	{
		from: 'src/work_insight/print/print.css',
		to: 'dist/work_insight/print/print.css',
	},
];

// ─── Entry points ────────────────────────────────────────────────────────────

const entryPoints = [
	{
		in: 'src/inventory_insight/main.js',
		out: 'dist/inventory_insight/main.js',
	},
	{
		in: 'src/inventory_insight/print/print.js',
		out: 'dist/inventory_insight/print/print.js',
	},

	{
		in: 'src/shipment_detail/main.js',
		out: 'dist/shipment_detail/main.js',
	},
	{
		in: 'src/shipment_detail/print/print.js',
		out: 'dist/shipment_detail/print/print.js',
	},

	{
		in: 'src/shipping_container/main.js',
		out: 'dist/shipping_container/main.js',
	},
	{
		in: 'src/shipping_container/print/print.js',
		out: 'dist/shipping_container/print/print.js',
	},

	{
		in: 'src/work_insight/main.js',
		out: 'dist/work_insight/main.js',
	},
	{
		in: 'src/work_insight/print/print.js',
		out: 'dist/work_insight/print/print.js',
	},
];

// ─── Copy ────────────────────────────────────────────────────────────────────

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
		if (!fs.existsSync(from)) {
			console.warn(`No encontrado, omitiendo: ${from}`);
			continue;
		}

		const stat = fs.statSync(from);

		if (stat.isDirectory()) {
			copyDir(from, to);
		} else {
			copyFile(from, to);
		}
	}
}

// ─── Build ───────────────────────────────────────────────────────────────────

async function build() {
	copyStatic();

	if (isWatch) {
		const contexts = await Promise.all(
			entryPoints.map(({ in: entryPoint, out }) =>
				esbuild.context({
					...shared,
					entryPoints: [entryPoint],
					outfile: out,
				}),
			),
		);

		await Promise.all(contexts.map((ctx) => ctx.watch()));

		console.log('Watching for changes...');
		return;
	}

	await Promise.all(
		entryPoints.map(({ in: entryPoint, out }) =>
			esbuild.build({
				...shared,
				entryPoints: [entryPoint],
				outfile: out,
			}),
		),
	);

	console.log('Build completo ✓');
}

build().catch((err) => {
	console.error('Build error:', err);
	process.exit(1);
});
