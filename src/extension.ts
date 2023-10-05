import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

class ChatWidget {
    private panel: vscode.WebviewPanel | undefined;

    constructor(context: vscode.ExtensionContext) {
        // Create and show the webview panel
        this.panel = vscode.window.createWebviewPanel(
            'chatWidget',
            'ChatBot',
            vscode.ViewColumn.One,
            {}
        );

        // Load your HTML content into the webview
        const htmlPath = path.join(context.extensionPath, 'html', 'index.html');
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        this.panel.webview.html = htmlContent;

        // Handle messages from the webview
        this.panel.webview.onDidReceiveMessage((message: { text: string }) => {
            vscode.window.showInformationMessage(`Received: ${message.text}`);
        });

        // When the webview is closed, dispose of it
        this.panel.onDidDispose(() => {
            this.panel = undefined;
        });
    }

    private getWebviewContent(): string {
        // Replace this with the HTML content of your chat window
        // You can create an HTML file and read it here
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>ChatBot</title>
            </head>
            <body>
                <!-- Your chat interface goes here -->
                <textarea id="input" placeholder="Type your message here..."></textarea>
                <button id="send">Send</button>

                <script>
                    const vscode = acquireVsCodeApi();

                    document.getElementById('send').addEventListener('click', () => {
                        const inputText = document.getElementById('input').value;
                        vscode.postMessage({ text: inputText });
                        document.getElementById('input').value = '';
                    });
                </script>
            </body>
            </html>
        `;
    }
}

export function activate(context: vscode.ExtensionContext) {
    // Register a command to open the chat window
    context.subscriptions.push(vscode.commands.registerCommand('extension.openChat', () => {
        new ChatWidget(context);
    }));
}

export function deactivate() {}
