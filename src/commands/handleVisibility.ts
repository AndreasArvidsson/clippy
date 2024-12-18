import type { Visibility } from "../types/types";
import { hideOrBlurWindow, hideWindow, showInactiveWindow, showWindow } from "./showHide";

export function handleVisibility(preferredVisibility: Visibility, commandVisibility?: Visibility) {
    const visibility = commandVisibility ?? preferredVisibility;

    switch (visibility) {
        case "no-op":
            // Do nothing
            break;

        case "show":
            showWindow();
            break;

        case "showInactive":
            showInactiveWindow();
            break;

        case "hide":
            hideWindow();
            break;

        case "hideOrBlur":
            hideOrBlurWindow();
            break;

        default: {
            const _unreachable: never = visibility;
        }
    }
}
