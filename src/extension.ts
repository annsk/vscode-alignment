'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    const alignment = new Alignment();
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('alignment.align', () => {
        // The code you place here will be executed every time your command is executed
        alignment.align();
    });

    context.subscriptions.push(disposable);
}

class Alignment {
    align() {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let config: any = (<any>vscode.workspace.getConfiguration('alignment')).chars;
        const alignChars = Object.keys(config);
        const selections = editor.selections;
        let maxLen = Math.max(editor.document.lineAt(selections[0].active).text.length);
        selections.forEach((selection) => {
            maxLen = Math.max(maxLen, editor.document.lineAt(selection.active).text.length);
            let range = new vscode.Range(selection.start.line, 0, selection.end.line, maxLen);
            let text = editor.document.getText(range);
            let lines = text.split(/\r\n|\r|\n/);
            let maxPosition = 0;
            let alignChar = '';
            let maxLineIndex = 0;
            lines.forEach((line, i) => {
                let positions = alignChars.map(char => ({char: char, pos: line.indexOf(char)})).filter(char => char.pos > -1).sort((char1, char2) => char1.pos - char2.pos);
                if (positions.length > 0) {
                    let pos = line.slice(0, positions[0].pos).replace(/\s\s*$/g, '').length;
                    if (pos > maxPosition) {
                        maxPosition = pos;
                        alignChar = positions[0].char;
                        maxLineIndex = i;
                    }
                }
            });
            lines = lines.map(line => {
                let correct = 0;
                let positions = alignChars.map(char => line.indexOf(char)).filter(char => char > -1);
                if (positions.length > 0) {
                    let position = Math.min(...positions);
                    correct = maxPosition - position;
                    let newLine = '';
                    if (correct < 0) {
                        newLine += line.slice(0, position + correct) + ' '.repeat(config[alignChar].spaceBefore);
                    } else {
                        newLine += line.slice(0, position) + ' '.repeat(correct + config[alignChar].spaceBefore);
                    }
                    newLine += line.slice(position, position + alignChar.length) + ' '.repeat(config[alignChar].spaceAfter) + line.slice(position + alignChar.length).replace(/^\s\s*/g, '');
                    return newLine;
                } else {
                    return line;
                }
            })
            editor.edit((editBuilder) => {
                editBuilder.replace(range, lines.join('\n'));
            });
        });
    }
}

