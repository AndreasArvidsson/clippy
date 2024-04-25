import { tmpdir, userInfo } from "node:os";
import { join } from "node:path";

export function getCommunicationDirPath(name: string): string {
    const info = userInfo();

    // NB: On Windows, uid < 0, and the tmpdir is user-specific, so we don't
    // bother with a suffix
    const suffix = info.uid >= 0 ? `-${info.uid}` : "";

    return join(tmpdir(), `${name}${suffix}`);
}
