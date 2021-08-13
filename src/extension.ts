import * as vscode from 'vscode';
import * as crypt from './commands/crypt'
import * as exec from './commands/exec'

export function activate(ctx: vscode.ExtensionContext) {
    ctx.subscriptions.push(vscode.commands.registerCommand('hiera-eyaml-gpg.Encrypt', () => { doCrypt(crypt.commands.CryptKind.Encrypt); }));
    ctx.subscriptions.push(vscode.commands.registerCommand('hiera-eyaml-gpg.Decrypt', () => { doCrypt(crypt.commands.CryptKind.Decrypt); }));
}

function doCrypt(cryptKind: crypt.commands.CryptKind) {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        return;
    }

    const selection = editor.selection;

    if (selection.isEmpty) {
        return null;
    }

    const text = editor.document.getText(selection);
    const output = vscode.window.createOutputChannel("hiera-eyaml-gpg");

    if (text != null) {
        const rawConfig = vscode.workspace.getConfiguration("hiera-eyaml-gpg");
        const execCommand = new exec.commands.ExecCommandImpl();
        const cryptCommand = crypt.commands.getInstance(cryptKind, rawConfig, execCommand);

        cryptCommand.execute(text).then((result) => {
            editor.edit((builder) => {
                const preparedOutput = cryptCommand.prepareOutput(result);
                builder.replace(selection, preparedOutput);
            });
        }).catch((error) => {
            output.appendLine(`hiera-eyaml-gpg.${cryptKind}: Failed: `);
            output.append(error);
            vscode.window.showErrorMessage("eyaml execution failed, more information in the output tab.");
        });
    }
}

export function deactivate() {
}