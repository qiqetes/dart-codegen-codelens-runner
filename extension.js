// The module 'vscode' contains the VS Code extensibility API
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

const regex = /(@freezed|@riverpod|@Riverpod(.*)|@RoutePage)/i;
/**
 * This function is called when the extension is activated.
 * Your extension is activated the very first time the command is executed.
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const codeLensProvider = new FreezedCodeLensProvider();
  const codeLensDisposable = vscode.languages.registerCodeLensProvider(
    { language: "dart" },
    codeLensProvider
  );

  let disposable = vscode.commands.registerCommand(
    "extension.runBuildRunnerForPackage",
    function () {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage(
          "No active editor. Open a Dart file with @freezed to use this command."
        );
        return;
      }

      const document = editor.document;

      if (document.languageId !== "dart") {
        vscode.window.showWarningMessage(
          "This command is only available for Dart files."
        );
        return;
      }

      const projectRoot = findProjectRoot(document.uri.fsPath);
      if (!projectRoot) {
        vscode.window.showErrorMessage(
          "Could not find a pubspec.yaml file in the parent directories. Is this a valid Dart/Flutter project?"
        );
        return;
      }

      const config = vscode.workspace.getConfiguration("dartBuilder");
      const buildRunnerArgs = config.get(
        "buildRunnerArgs",
        "--delete-conflicting-outputs"
      );

      // Create a new terminal or use an existing one, and run the command.
      const terminal = vscode.window.createTerminal({
        name: "Freezed Runner",
        cwd: projectRoot,
      });

      terminal.sendText(`dart run build_runner build ${buildRunnerArgs}`);

      terminal.show();
    }
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(codeLensDisposable);
}

/**
 * Finds the root of the Dart/Flutter project by searching upwards from a given file path
 * for a 'pubspec.yaml' file.
 * @param {string} startPath The path of the file to start searching from.
 * @returns {string|null} The path to the project root directory, or null if not found.
 */
function findProjectRoot(startPath) {
  let currentDir = path.dirname(startPath);

  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

  while (true) {
    const pubspecPath = path.join(currentDir, "pubspec.yaml");
    console.log(`Checking for pubspec.yaml in: ${currentDir}`);
    if (fs.existsSync(pubspecPath)) {
      return currentDir;
    }

    const parentDir = path.dirname(currentDir);

    if (
      parentDir === currentDir ||
      (workspaceRoot && !currentDir.startsWith(workspaceRoot))
    ) {
      return null;
    }
    currentDir = parentDir;
  }
}

class FreezedCodeLensProvider {
  provideCodeLenses(document) {
    const projectRoot = findProjectRoot(document.uri.fsPath);
    if (!projectRoot) {
      return [];
    }

    const codeLenses = [];
    const text = document.getText();
    const lines = text.split("\n");

    const config = vscode.workspace.getConfiguration("dartBuilder");
    const customAnnotations = config.get("customAnnotations", []);
    const defaultAnnotations = [
      "@freezed",
      "@riverpod",
      "@Riverpod(.*)",
      "@RoutePage",
    ];
    const allAnnotations = [...defaultAnnotations, ...customAnnotations];

    const lineRegex = new RegExp(`^(${allAnnotations.join("|")})`, "i");

    const limitInstanceCount = 3;
    let instanceCount = 0;
    for (
      let i = 0;
      i < lines.length || instanceCount >= limitInstanceCount;
      i++
    ) {
      const line = lines[i];

      const freezedMatch = line.match(lineRegex);

      if (freezedMatch) {
        const range = new vscode.Range(
          i,
          freezedMatch.index,
          i,
          freezedMatch.index + freezedMatch[0].length
        );

        const codeLens = new vscode.CodeLens(range, {
          title: "🚀 Run build_runner",
          command: "extension.runBuildRunnerForPackage",
          tooltip: "Run dart build_runner for this file",
        });

        codeLenses.push(codeLens);
        instanceCount++;
      }
    }

    return codeLenses;
  }
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
