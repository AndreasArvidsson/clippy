export interface ClipItemV0 {
    readonly id: string;
    readonly created: number;
    readonly hash: string;
    readonly type: ClipItemTypeV0;
    name: string | undefined;
    list: string | undefined;
    readonly text: string | undefined;
    readonly rtf: string | undefined;
    readonly html: string | undefined;
    readonly bookmark: ClipBookmarkV0 | undefined;
    readonly image: ClipImageV0 | undefined;
}

type ClipItemTypeV0 = "text" | "image";

export interface ClipImageV0 {
    readonly src: string | undefined;
    readonly alt: string | undefined;
    readonly data: string;
}

export interface ClipBookmarkV0 {
    readonly title: string;
    readonly url: string;
}
