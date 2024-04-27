import esbuild, { type BuildOptions } from "esbuild";

function build(entry: string, out: string) {
    return esbuild.build({
        platform: "node",
        bundle: true,
        minify: true,
        entryPoints: [`src/${entry}`],
        outfile: `out/${out}`,
        external: ["electron"],
    });
}

(async () => {
    await build("main.ts", "main.js");
    await build("renderer/index.tsx", "renderer.js");
})();
