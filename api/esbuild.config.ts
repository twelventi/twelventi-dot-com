import * as esbuild from "esbuild";

esbuild.build({
  bundle: true,
  outfile: "build/index.js",
  platform: "node",
  entryPoints: ['src/index.ts']
});
