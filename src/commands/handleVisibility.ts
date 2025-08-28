import type { Visibility } from "../types/types";
import {
    hideOrBlurWindowIfPinned,
    hideWindow,
    hideWindowIfNotPinned,
    showInactiveWindow,
    showWindow,
} from "./showHide";

export function handleVisibility(
    preferredVisibility: Visibility,
    commandVisibility?: Visibility,
) {
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

        case "hideIfNotPinned":
            hideWindowIfNotPinned();
            break;

        case "hideOrBlurIfPinned":
            hideOrBlurWindowIfPinned();
            break;

        default: {
            const _unreachable: never = visibility;
        }
    }
}
