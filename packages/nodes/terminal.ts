import { spawn } from "child_process";
import type { INodePlugin, NodeInputs } from "../shared/types";

export interface TerminalCallbacks {
    onStdout?: (data: string) => void;
    onStderr?: (data: string) => void;
    onClose?: (code: number | null) => void;
}

export class Terminal implements INodePlugin {
    type = "terminal";
    name = "Terminal";
    description = "Runs shell commands and captures their output.";
    private callbacks?: TerminalCallbacks;

    execute(data: any, _inputs: NodeInputs): Promise<any> {
        return new Promise((resolve, reject) => {
            const command = data.command;
            if (!command) {
                return reject(new Error("No command provided"));
            }

            const child = spawn(command, { shell: true });

            let stdoutData = "";
            let stderrData = "";

            child.stdout.on("data", (data) => {
                const text = data.toString();
                stdoutData += text;
                if (this.callbacks?.onStdout) {
                    this.callbacks.onStdout(text);
                }
            });

            child.stderr.on("data", (data) => {
                const text = data.toString();
                stderrData += text;
                if (this.callbacks?.onStderr) {
                    this.callbacks.onStderr(text);
                }
            });

            child.on("close", (code) => {
                if (this.callbacks?.onClose) {
                    this.callbacks.onClose(code);
                }
                if (code === 0) {
                    resolve({ stdout: stdoutData });
                } else {
                    reject(new Error(`Command failed with code ${code}: ${stderrData}`));
                }
            });

            child.on("error", (err) => {
                reject(err);
            });
        });
    }
    
    constructor(callbacks?: TerminalCallbacks) {
        this.callbacks = callbacks;
    }

}