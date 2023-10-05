"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
class ChatWidget {
    constructor(context) {
        // Create and show the webview panel
        this.panel = vscode.window.createWebviewPanel('chatWidget', 'ChatBot', vscode.ViewColumn.One, {});
        // Load your HTML content into the webview
        const htmlPath = path.join(context.extensionPath, 'html', 'index.html');
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        this.panel.webview.html = htmlContent;
        // Handle messages from the webview
        this.panel.webview.onDidReceiveMessage((message) => {
            vscode.window.showInformationMessage(`Received: ${message.text}`);
        });
        // When the webview is closed, dispose of it
        this.panel.onDidDispose(() => {
            this.panel = undefined;
        });
    }
    getWebviewContent() {
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
function activate(context) {
    // Register a command to open the chat window
    context.subscriptions.push(vscode.commands.registerCommand('extension.openChat', () => {
        new ChatWidget(context);
    }));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
