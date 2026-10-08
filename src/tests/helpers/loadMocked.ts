import Module, { createRequire } from "node:module";

interface ModuleLoader {
    _load: (
        id: string,
        parent: NodeJS.Module | null,
        isMain: boolean,
    ) => unknown;
}

// Load a fresh module with only its direct dependencies replaced. Restore the
// loader and cache immediately so mocks do not leak into other tests.
// oxlint-disable-next-line typescript/no-unnecessary-type-parameters
export function loadMocked<T>(
    filename: string,
    mocks: Record<string, unknown>,
): T {
    const require = createRequire(__filename);
    const resolved = require.resolve(filename);
    const cached = require.cache[resolved];
    // Node does not expose its CommonJS loader hook in the public type definitions.
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    const loader = Module as unknown as ModuleLoader;
    const original = loader._load;

    Reflect.deleteProperty(require.cache, resolved);
    loader._load = (id, parent, isMain) => {
        if (parent?.filename === resolved && Object.hasOwn(mocks, id)) {
            return mocks[id];
        }
        return original(id, parent, isMain);
    };

    try {
        // oxlint-disable-next-line typescript/no-unsafe-type-assertion typescript/no-unsafe-return import/no-dynamic-require
        return require(resolved) as T;
    } finally {
        loader._load = original;
        Reflect.deleteProperty(require.cache, resolved);
        if (cached != null) {
            require.cache[resolved] = cached;
        }
    }
}
