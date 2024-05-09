import { app } from "electron";
import { clipboard } from "./clipboard";
import * as clipboardList from "./clipboardList";
import { storage } from "./storage";
import type {
    AssignItemsToListCommand,
    Command,
    CreateListCommand,
    RenameItemsCommand,
    RenameListCommand,
    SearchCommand,
    SwitchListCommand,
    Target,
} from "./types/Command";
import {
    AllList,
    MyFavoritesList,
    UnstarredList,
    defaultLists,
    type ClipItem,
    type Config,
    type RendererData,
} from "./types/types";
import { getFilteredItems } from "./util/filterItems";
import { processTargets } from "./util/processTargets";
import { getWindow } from "./window";

export function getRendererData(): RendererData {
    const items = storage.getClipboardItems();
    return {
        totalCount: items.length,
        config: storage.getConfig(),
        search: storage.getSearch(),
        items: getFilteredItems(true),
    };
}

export function updateRenderer(force = false) {
    const window = getWindow();
    if (window.isVisible() || force) {
        window.webContents.send("update", getRendererData());
    }
}

function assertSingleItem(items: ClipItem[]): ClipItem {
    if (items.length !== 1) {
        throw new Error("Expected exactly one clipboard item");
    }
    return items[0];
}

function updateConfig(config: Config) {
    storage.setConfig(config);
    updateRenderer();
}

function showHide() {
    const window = getWindow();
    if (window.isVisible()) {
        window.hide();
    } else {
        // Update render even while window is hidden to make sure it's up to date when shown
        updateRenderer(true);
        // Show without taking focus
        window.showInactive();
    }
}

function togglePinned() {
    const config = storage.getConfig();
    config.pinned = !config.pinned;
    updateConfig(config);
}

function toggleSearch() {
    const config = storage.getConfig();
    config.showSearch = !config.showSearch;
    updateConfig(config);
}

function togglePaused() {
    const config = storage.getConfig();
    config.paused = !config.paused;
    updateConfig(config);
}

function toggleAutoStar() {
    const config = storage.getConfig();
    config.autoStar = !config.autoStar;
    updateConfig(config);
}

function search(command: SearchCommand) {
    storage.setSearch({ text: command.text, type: command.type });
    const config = storage.getConfig();
    if (!config.showSearch) {
        config.showSearch = true;
        storage.setConfig(config);
    }
    updateRenderer();
}

function copyItems(targets: Target[]) {
    const items = processTargets(targets);

    clipboard.write(items);

    const window = getWindow();

    if (window.isVisible()) {
        if (storage.getConfig().pinned) {
            if (window.isFocused()) {
                window.blur();
            }
        } else {
            window.hide();
        }
    }
}

function removeItems(targets: Target[]) {
    clipboardList.removeTargets(targets);
    updateRenderer();
}

function removeAllItems(render = true) {
    const { activeList } = storage.getConfig();
    const allItems = storage.getClipboardItems();

    const itemsToRemove = (() => {
        switch (activeList) {
            case AllList:
                return allItems;
            case UnstarredList:
                return allItems.filter((item) => item.list == null);
            default:
                return allItems.filter((item) => item.list === activeList);
        }
    })();

    storage.removeItems(itemsToRemove);

    if (render) {
        updateRenderer();
    }
}

function switchList(command: SwitchListCommand) {
    const config = storage.getConfig();
    const listName = command.name;

    if (listName === config.activeList) {
        return;
    }

    switch (listName) {
        case AllList:
        case MyFavoritesList:
        case UnstarredList:
            break;
        default:
            if (!storage.getLists().includes(command.name)) {
                throw Error(`Can't switch to unknown list '${listName}'`);
            }
    }

    config.activeList = listName;
    storage.setConfig(config);

    updateRenderer();
}

function createList(command: CreateListCommand) {
    const listName = command.name;

    if (listName) {
        const lists = storage.getLists();

        if (defaultLists.includes(listName) || lists.includes(listName)) {
            throw Error(`Can't create list: List '${listName}' already exists`);
        }

        lists.push(listName);

        const config = storage.getConfig();
        config.activeList = listName;

        storage.setConfig(config);
        storage.setLists(lists);

        updateRenderer();
    } else {
        const window = getWindow();
        if (window.isVisible()) {
            window.webContents.send("createList");
        }
    }
}

function renameList(command: RenameListCommand) {
    const newName = command.name;

    if (newName) {
        const config = storage.getConfig();
        const lists = storage.getLists();
        const { activeList } = config;

        if (activeList === newName) {
            return;
        }

        if (defaultLists.includes(activeList)) {
            throw Error(`Can't rename default list '${activeList}'`);
        }
        if (!lists.includes(activeList)) {
            throw Error(`Can't rename unknown list '${activeList}'`);
        }
        if (lists.includes(newName)) {
            throw Error(`Can't rename list: List '${newName}' already exists`);
        }

        lists.filter((list) => list !== activeList);
        lists.push(newName);
        storage.setLists(lists);

        runCommand({ id: "switchList", name: newName });
    } else {
        const window = getWindow();
        if (window.isVisible()) {
            window.webContents.send("renameList");
        }
    }
}

function removeList() {
    const config = storage.getConfig();
    const lists = storage.getLists();
    const { activeList } = config;

    if (defaultLists.includes(activeList)) {
        throw Error(`Can't remove default list '${activeList}'`);
    }
    if (!lists.includes(activeList)) {
        throw Error(`Can't remove unknown list '${activeList}'`);
    }

    removeAllItems(false);

    storage.setLists(lists.filter((list) => list !== activeList));
    storage.setConfig({ ...config, activeList: AllList });

    updateRenderer();
}

function renameItem(command: RenameItemsCommand) {
    const items = processTargets(command.targets);

    if (command.text != null) {
        for (const item of items) {
            item.name = command.text || undefined;
        }
        storage.replaceItems(items);
        updateRenderer();
    } else {
        const item = assertSingleItem(items);
        const window = getWindow();
        if (window.isVisible()) {
            window.webContents.send("renameItem", item.id);
        }
    }
}

function toggleDevTools() {
    const window = getWindow();
    if (window.isVisible()) {
        window.webContents.toggleDevTools();
    }
}

function assignItemsToList(command: AssignItemsToListCommand) {
    if (command.list != null) {
        if (command.list !== MyFavoritesList && !storage.getLists().includes(command.list)) {
            throw Error(`Can't assign item to unknown list '${command.list}'`);
        }
    }

    const items = processTargets(command.targets);
    for (const item of items) {
        item.list = command.list;
    }
    storage.replaceItems(items);
    updateRenderer();
}

export function runCommand(command: Command) {
    console.debug(command);

    switch (command.id) {
        case "exit":
            app.exit();
            break;
        case "showHide":
            showHide();
            break;
        case "toggleDevTools":
            toggleDevTools();
            break;
        case "togglePinned":
            togglePinned();
            break;
        case "toggleSearch":
            toggleSearch();
            break;
        case "togglePaused":
            togglePaused();
            break;
        case "toggleAutoStar":
            toggleAutoStar();
            break;
        case "search":
            search(command);
            break;
        case "copyItems":
            copyItems(command.targets);
            break;
        case "removeItems":
            removeItems(command.targets);
            break;

        case "renameItems":
            renameItem(command);
            break;
        case "switchList":
            switchList(command);
            break;
        case "assignItemsToList":
            assignItemsToList(command);
            break;
        case "removeAllItems":
            removeAllItems();
            break;
        case "createList":
            createList(command);
            break;
        case "renameList":
            renameList(command);
            break;
        case "removeList":
            removeList();
            break;
        default: {
            const _exhaustiveCheck: never = command;
        }
    }
}
