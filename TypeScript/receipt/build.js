const esbuild = require('esbuild');

const shared = {
	bundle: true,
	minify: false,
	sourcemap: true,
	platform: 'browser',
	target: 'chrome110',
	format: 'iife',
};

const isWatch = process.argv.includes('--watch');

async function build() {
	const builds = [
		// receipt-storage — pantalla de captura
		esbuild.build({
			...shared,
			entryPoints: ['src/receipt-storage/main.ts'],
			outfile: 'dist/receipt-storage.js',
		}),
		// receipt-manager — pantalla RF
		esbuild.build({
			...shared,
			entryPoints: ['src/receipt-manager/main.ts'],
			outfile: 'dist/receipt-manager.js',
		}),
		// popup
		esbuild.build({
			...shared,
			entryPoints: ['src/popup/main.ts'],
			outfile: 'dist/popup.js',
		}),
	];

	if (isWatch) {
		const contexts = await Promise.all([
			esbuild.context({ ...shared, entryPoints: ['src/receipt-storage/main.ts'], outfile: 'dist/receipt-storage.js' }),
			esbuild.context({ ...shared, entryPoints: ['src/receipt-manager/main.ts'], outfile: 'dist/receipt-manager.js' }),
			esbuild.context({ ...shared, entryPoints: ['src/popup/main.ts'], outfile: 'dist/popup.js' }),
		]);
		await Promise.all(contexts.map((ctx) => ctx.watch()));
		console.log('Watching...');
	} else {
		await Promise.all(builds);
		console.log('Build completo.');
	}
}

build().catch(() => process.exit(1));
