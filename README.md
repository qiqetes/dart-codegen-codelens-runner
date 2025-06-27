Dart Codelens BuildRunner
A simple VS Code extension to speed up development with code generation in Dart and Flutter projects.

## Features
This extension provides a single command, **Run Build Runner in current package**, that:

- Detects if the currently open file is a Dart file containing code generation annotations such as:
  - `@freezed` (freezed package)
  - `@riverpod` (riverpod_generator package)
  - `@AutoRoute` or `@RoutePage` (auto_route package)
  - `@JsonSerializable` (json_serializable package)
  - `@copyWith` (copy_with_extension package)
  - And other common code generation annotations

- Finds the root of your project (by locating the pubspec.yaml file)

- Opens a terminal in the project root

- Runs the command `dart run build_runner build --delete-conflicting-outputs`

You can access this command in two ways:

1. Open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P) and type "Build Runner: Run in current package"

2. Right-click inside any Dart file editor

## Installation and Setup
To use this extension locally without publishing it:

1. **Install Node.js**

2. **Create a Project Folder**: Create a new folder on your computer for the extension (e.g., `vscode-dart-build-runner`).

3. **Add Files**: Place the extension.js and package.json files from above into this new folder.

4. **Install Dependencies**:
   - Open a terminal or command prompt
   - Navigate into your new folder (`cd vscode-dart-build-runner`)
   - Run the command `npm install`. This will create a node_modules folder with the necessary dependencies.

5. **Run in VS Code**:
   - Open the `vscode-dart-build-runner` folder in VS Code (`code .`)
   - Press F5 on your keyboard. This will compile the extension and launch a new "Extension Development Host" window.

6. **Test the Extension**:
   - In the new window (the "Extension Development Host"), open any of your Dart or Flutter projects that use code generation
   - Open a file that contains code generation annotations (like `@freezed`, `@riverpod`, `@RoutePage`, etc.)
   - Right-click in the editor or use the Command Palette to find and run the "Build Runner: Run in current package" command. A terminal should appear and run the build command.
