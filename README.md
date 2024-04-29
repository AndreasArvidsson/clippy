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

def clipboard_manager_show_hide():
    data = {"id": "showHide"}
    rpc.send(data, wait_for_finish=True)

def clipboard_manager_paste(hint: str):
    data = {"id": "copyItems", "hints": [str]}
    rpc.send(data, wait_for_finish=True)
    actions.edit.paste()
```
