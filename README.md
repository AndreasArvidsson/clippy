# Clippy

Clipboard manager with RPC. Support keyboard, mouse and excellent Talon Voice integration.

## Run

```
$ npm install
$ npm start
```

## Package app

Creates `dist` folder with executable

```
$ npm install
$ npm package
```

## Talon user scripts

-   [Clippy Talon](https://github.com/AndreasArvidsson/andreas-talon/tree/master/apps/clippy)

### Usage example

[Available commands](./src/types/Command.ts)

```
rpc = RpcClient("Clippy", "ctrl-shift-alt-o")

def clippy_show_hide():
    command = {"id": "toggleShowHide"}
    rpc.send(command, wait_for_finish=True)
```

### Mac OS. Clipboard doesn't update

`chmod +x node_modules/clipboard-event/platform/clipboard-event-handler-mac`

## Images

![Clippy](./images/clippy.png)
