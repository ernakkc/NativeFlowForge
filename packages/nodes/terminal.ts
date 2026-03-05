import { spawn } from "child_process";

export interface TerminalCallbacks {
    onStdout?: (data: string) => void;
    onStderr?: (data: string) => void;
    onClose?: (code: number | null) => void;
}

export class Terminal {
    private process: ReturnType<typeof spawn> | null = null;
    private callbacks: TerminalCallbacks = {};

    start(
        command: string,
        args: string[] = [],
        options: Record<string, any> = {},
        callbacks?: TerminalCallbacks
    ) {
        if (this.process) return;

        this.callbacks = callbacks || {};
        this.process = spawn(command, args, { shell: true, ...options });

        this.process.stdout?.on("data", (data) => {
            const output = data.toString();
            this.callbacks.onStdout?.(output);
        });

        this.process.stderr?.on("data", (data) => {
            const output = data.toString();
            this.callbacks.onStderr?.(output);
        });

        this.process.on("close", (code) => {
            this.callbacks.onClose?.(code);
            this.process = null;
        });
    }

    stop() {
        if (!this.process) return;
        this.process.kill();
        this.process = null;
    }
}


let terminal = new Terminal();
terminal.start("echo", ["Hello World"], {}, {
    onStdout: (data) => {
        console.log("Captured stdout:", data);
    },
    onStderr: (data) => {
        console.error("Captured stderr:", data);
    },
    onClose: (code) => {
        console.log("Process closed with code:", code);
    }
});