const esbuild = require("esbuild");

const shared = {
  bundle: true,
  minify: false,
  sourcemap: true,
  platform: "browser",
  target: "chrome110",
  format: "iife" // 👈 IMPORTANTE: elimina imports
};

Promise.all([
  esbuild.build({
    ...shared,
    entryPoints: ["src/background.ts"],
    outfile: "dist/background.js"
  }),
  esbuild.build({
    ...shared,
    entryPoints: ["src/content.ts"],
    outfile: "dist/content.js"
  }),
  esbuild.build({
    ...shared,
    entryPoints: ["src/popup.ts"],
    outfile: "dist/popup.js"
  })
]).catch(() => process.exit(1));
