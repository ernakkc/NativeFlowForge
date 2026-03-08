import { test } from "node:test";
import assert from "node:assert";
import { Terminal } from "../packages/nodes/terminal.js";

test("Terminal can be created", () => {
    const terminal = new Terminal();
    assert.ok(terminal);
});

test("Terminal can execute a simple command", async () => {
    const terminal = new Terminal();
    const result = await terminal.execute({ command: "echo test" }, {});
    assert.ok(result.stdout.includes("test"));
});

test("Terminal captures stdout with callback", async () => {
    let output = "";
    
    const terminal = new Terminal({
        onStdout: (data) => {
            output += data;
        }
    });

    await terminal.execute({ command: "echo Hello" }, {});
    assert.ok(output.includes("Hello"));
});

test("Terminal rejects when no command provided", async () => {
    const terminal = new Terminal();
    await assert.rejects(
        () => terminal.execute({}, {}),
        /No command provided/
    );
});

