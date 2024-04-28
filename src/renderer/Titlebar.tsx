import { NAME } from "../constants";
import api from "./api";

export function Titlebar(): JSX.Element {
    return (
        <header id="titlebar">
            <div id="title">{NAME}</div>
            <div id="title-bar-btns">
                <button id="minimize-btn" onClick={() => api.windowMinimize()}>
                    &#xE921;
                </button>
                <button id="maximize-btn" onClick={() => api.windowMaximize()}>
                    &#xE922;
                </button>
                <button id="close-btn" onClick={() => api.windowClose()}>
                    &#xE8BB;
                </button>
            </div>
        </header>
    );
}
