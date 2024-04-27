declare module "clipboard-event" {
    export function startListening(): void;
    export function stopListening(): void;
    export function on(event: "change", callback: () => void): void;
}
