import { test } from "node:test";
import assert from "node:assert";
import { Terminal } from "../packages/nodes/terminal.js";

test("Terminal can be created", () => {
    const terminal = new Terminal();
    assert.ok(terminal);
});

test("Terminal can start a command", () => {
    const terminal = new Terminal();
    terminal.start("echo", ["test"]);
    terminal.stop();
});

test("Terminal warns if already running", () => {
    const terminal = new Terminal();
    terminal.start("sleep", ["1"]);
    terminal.start("echo", ["test"]);
    terminal.stop();
});

test("Terminal can be stopped", () => {
    const terminal = new Terminal();
    terminal.start("sleep", ["1"]);
    terminal.stop();
});

test("Terminal captures stdout with callback", (t, done) => {
    const terminal = new Terminal();
    let output = "";

    terminal.start("echo", ["Hello World"], {}, {
        onStdout: (data) => {
            output += data;
        },
        onClose: (code) => {
            assert.ok(output.includes("Hello World"), "Should capture stdout");
            assert.strictEqual(code, 0, "Should exit with code 0");
            done();
        }
    });
});

test("Terminal captures stderr with callback", (t, done) => {
    const terminal = new Terminal();
    let errorOutput = "";

    terminal.start("ls", ["--invalid-option-xyz"], {}, {
        onStderr: (data) => {
            errorOutput += data;
        },
        onClose: (code) => {
            assert.ok(errorOutput.length > 0, "Should capture stderr");
            done();
        }
    });
});

