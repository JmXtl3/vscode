import * as vscode from 'vscode';

function getCurrentFunctionRange(editor: vscode.TextEditor): vscode.Range | null {
    const doc = editor.document;
    const pos = editor.selection.active;

    // Try to use folding ranges if provided by language; otherwise heuristics
    const foldingProvider = (vscode.languages as any).getFoldingRangeProvider;
    // We'll request folding ranges via the built-in command
    // Fallback: find nearest enclosing indentation block

    const foldingRanges = (vscode.commands as any).executeCommand('vscode.provideFoldingRanges', doc.uri).then((ranges: any) => {
        if (!ranges) return null;
        // Find a range that contains the current line and is not the whole file
        for (const r of ranges) {
            if (r.start <= pos.line && r.end >= pos.line && (r.end - r.start) > 0) {
                return new vscode.Range(new vscode.Position(r.start, 0), new vscode.Position(r.end, doc.lineAt(r.end).text.length));
            }
        }
        return null;
    }).catch(() => null);

    // Since the above is async, but commands below can accept ranges via arguments, we return null here
    // and the caller will prefer using editor-based commands with selection.
    return null;
}

async function foldCurrent(editor: vscode.TextEditor) {
    // Try to use the selection line to fold the smallest enclosing range via editor commands
    const line = editor.selection.active.line;

    // Select the line, then execute the editor.fold command which folds the nearest range containing the selection
    const original = editor.selection;
    const sel = new vscode.Selection(line, 0, line, 0);
    editor.selection = sel;
    await vscode.commands.executeCommand('editor.fold');
    editor.selection = original;
}

async function unfoldCurrent(editor: vscode.TextEditor) {
    const line = editor.selection.active.line;
    const original = editor.selection;
    const sel = new vscode.Selection(line, 0, line, 0);
    editor.selection = sel;
    await vscode.commands.executeCommand('editor.unfold');
    editor.selection = original;
}

async function foldAll(editor: vscode.TextEditor) {
    // Use built-in foldAll command
    await vscode.commands.executeCommand('editor.foldAll');
}

async function unfoldAll(editor: vscode.TextEditor) {
    await vscode.commands.executeCommand('editor.unfoldAll');
}

export function activate(context: vscode.ExtensionContext) {
    const foldCurrentCmd = vscode.commands.registerCommand('extension.foldCurrentFunction', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;
        await foldCurrent(editor);
    });

    const unfoldCurrentCmd = vscode.commands.registerCommand('extension.unfoldCurrentFunction', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;
        await unfoldCurrent(editor);
    });

    const foldAllCmd = vscode.commands.registerCommand('extension.foldAllFunctions', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;
        await foldAll(editor);
    });

    const unfoldAllCmd = vscode.commands.registerCommand('extension.unfoldAllFunctions', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;
        await unfoldAll(editor);
    });

    context.subscriptions.push(foldCurrentCmd, unfoldCurrentCmd, foldAllCmd, unfoldAllCmd);
}

export function deactivate() {}
