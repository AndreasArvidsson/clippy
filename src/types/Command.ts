interface CommandShow {
    id: "show";
}

interface CommandCopyItem {
    id: "copyItem";
    number: number;
}

export type Command = CommandShow | CommandCopyItem;
