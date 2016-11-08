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

    disposable = vscode.commands.registerCommand('alignment.alignFirst', () => {
        // The code you place here will be executed every time your command is executed
        alignment.align(true);
    });


    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('alignment.alignWhitespace', () => {
        // The code you place here will be executed every time your command is executed
        alignment.alignWhitespace();
    });

    context.subscriptions.push(disposable);

    return alignment;
}

class Alignment {
    align(first = false) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let config: any = (<any>vscode.workspace.getConfiguration('alignment')).chars;
        const alignChars = Object.keys(config).sort((a, b) => b.length - a.length);
        const selections = editor.selections;
        let maxLen = Math.max(editor.document.lineAt(selections[0].active).text.length);
        selections.forEach((selection) => {
            maxLen = Math.max(maxLen, editor.document.lineAt(selection.active).text.length);
            let range = new vscode.Range(selection.start.line, 0, selection.end.character > 0 ? selection.end.line : selection.end.line - 1, maxLen);
            let text = editor.document.getText(range);
            let lines = text.split(/\r\n|\r|\n/);
            let maxPosition = 0;
            let maxPositionTmp = 0;
            let alignChar = '';
            let alignCharTmp = '';
            let maxLineIndex = 0;
            let founded = false;
            do {
                // console.log(lines, maxPositionTmp + alignCharTmp.length);
                maxPositionTmp = maxPosition;
                alignCharTmp = alignChar;
                founded = false;
                lines.forEach((line, i) => {
                    let positions = alignChars.map(char => ({char: char, pos: line.indexOf(char, maxPositionTmp + alignCharTmp.length + 1)})).filter(char => char.pos > -1).sort((char1, char2) => char1.pos - char2.pos);
                    if (positions.length > 0) {
                        founded = !first;
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
                    let positions = alignChars.map(char => line.indexOf(char, maxPositionTmp + alignCharTmp.length + 1)).filter(char => char > -1);
                    if (positions.length > 0) {
                        let position = Math.min(...positions);
                        correct = maxPosition - position;
                        let newLine = '';
                        let charBefore = config[alignChar].tabsBefore != null ? '\t' : ' ';
                        let charAfter = config[alignChar].tabsAfter != null ? '\t' : ' ';
                        let countBefore = charBefore === '\t' ? config[alignChar].tabsBefore : config[alignChar].spaceBefore;
                        let countAfter = charAfter === '\t' ? config[alignChar].tabsAfter : config[alignChar].spaceAfter;

                        if (correct < 0) {
                            newLine += line.slice(0, position + correct) + charBefore.repeat(countBefore);
                        } else {
                            newLine += line.slice(0, position) + charBefore.repeat(correct + countBefore);
                        }
                        newLine += line.slice(position, position + alignChar.length) + charAfter.repeat(countAfter) + line.slice(position + alignChar.length).replace(/^\s\s*/g, '');
                        return newLine;
                    } else {
                        return line;
                    }
                });
            } while (founded);

            editor.edit((editBuilder) => {
                editBuilder.replace(range, lines.join('\n'));
            });
        });
    }

    alignWhitespace() {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let config: any = (<any>vscode.workspace.getConfiguration('alignment')).chars;
        const alignChars = Object.keys(config).sort((a, b) => b.length - a.length);
        const selections = editor.selections;
        let maxLen = Math.max(editor.document.lineAt(selections[0].active).text.length);
        selections.forEach((selection) => {
            maxLen = Math.max(maxLen, editor.document.lineAt(selection.active).text.length);
            let range = new vscode.Range(selection.start.line, 0, selection.end.character > 0 ? selection.end.line : selection.end.line - 1, maxLen);
            let text = editor.document.getText(range);
            let lines = text.split(/\r\n|\r|\n/);
            let maxPosition = 0;
            let maxPositionTmp = 0;
            let alignChar = '';
            let alignCharTmp = '';
            let maxLineIndex = 0;
            let founded = false;
            do {
                maxPositionTmp = maxPosition;
                alignCharTmp = alignChar;
                founded = false;
                lines.forEach((line, i) => {
                    let position = line.substr(maxPositionTmp).search(/\s\S/i) + maxPositionTmp + 1;
                    if (position > maxPositionTmp + 1) {
                        founded = true;
                        if (position > maxPosition) {
                            maxPosition = position;
                            maxLineIndex = i;
                        }
                    }
                });
                lines = lines.map(line => {
                    let correct = 0;
                    let position = line.substr(maxPositionTmp).search(/\s\S/i) + maxPositionTmp + 1;
                    if (position > maxPositionTmp + 1) {
                        correct = maxPosition - position;
                        let newLine = '';
                        if (correct < 0) {
                            newLine += line.slice(0, position + correct);
                        } else {
                            newLine += line.slice(0, position) + ' '.repeat(correct);
                        }
                        newLine += line.slice(position).replace(/^\s\s*/g, '');
                        return newLine;
                    } else {
                        return line;
                    }
                });
            } while (founded);

            editor.edit((editBuilder) => {
                editBuilder.replace(range, lines.join('\n'));
            });
        });
    }
}

