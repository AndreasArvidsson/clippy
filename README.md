# Clippy

Clipboard manager with RPC

## Running

```
$ npm install
$ npm start
```

## Talon side

### Download RPC client

`https://github.com/AndreasArvidsson/andreas-talon/blob/master/core/rpc_client`

### Usage example

[Available commands](./src/types/Command.ts)

```
rpc = RpcClient("Clippy", "ctrl-shift-alt-o")

def clippy_show_hide():
    command = {"id": "showHide"}
    rpc.send(command, wait_for_finish=True)

def clippy_paste(hint: str):
    command = {"id": "copyItems", "hints": [str]}
    rpc.send(command, wait_for_finish=True)
    actions.edit.paste()
```
