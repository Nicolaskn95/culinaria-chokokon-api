// /home/felipeagx/work/nexus/globals/output/Print.ts
import path from "node:path";
// @deno-types="npm:@types/node"
import { fileURLToPath } from "node:url";

export class Print {
  private fileIdentificator: string;
  private fixedAlternativePrefix: string;

  constructor(fixedAlternativePrefix?: string) {
    this.fixedAlternativePrefix = fixedAlternativePrefix || "";
    this.fileIdentificator = Print.getCallerFileName() || "UNKNOWN_FILE";
  }

  // --- Logging methods (success, error, info, logWithColor) ---
  // ... (mantenha seus métodos de log aqui) ...
  public success(message: string, content?: unknown): void {
    if (content) {
      message += ":" + Deno.inspect(content, { colors: true, depth: 8 });
    }
    this.logWithColor(
      `[${this.fileIdentificator}] ${this.fixedAlternativePrefix} ${this.fixedAlternativePrefix}${message}`,
      "green",
    );
  }

  public error(message: string, content?: unknown): void {
    if (content) {
      message += ":" + Deno.inspect(content, { colors: true, depth: 8 });
    }
    this.logWithColor(
      `[${this.fileIdentificator}] ${this.fixedAlternativePrefix} ${message}`,
      "red",
    );
  }

  public info(message: string, content?: unknown): void {
    if (content) {
      message += ": " + Deno.inspect(content, { colors: true, depth: 8 });
    }
    this.logWithColor(
      `[${this.fileIdentificator}] ${this.fixedAlternativePrefix} ${message}`,
      "blue",
    );
  }
  private logWithColor(message: string, color: "green" | "red" | "blue"): void {
    const colorCodes = {
      green: "\x1b[32m",
      red: "\x1b[31m",
      blue: "\x1b[34m",
      reset: "\x1b[0m",
    };
    console.log(`${colorCodes[color]}${message}${colorCodes.reset}`);
  }
  // --- Fim dos Logging methods ---

  private static getCallerFileName(): string | null {
    let potentialFileName: string | undefined = undefined;
    try {
      // Deno does not support Error.prepareStackTrace or NodeJS.CallSite.
      // We'll use a string stack trace and parse it.
      const err = new Error();
      const stack = err.stack?.split("\n") || [];

      // --- DEBUG LOG ---
      console.log("--- DEBUG: Structured Stack Trace ---");
      stack.forEach((frame, index) => {
        // In Deno, stack frames are strings, not objects with getFileName/getFunctionName.
        // Let's just print the raw frame string for debugging.
        console.log(`[${index}] ${frame}`);
      });
      console.log("--- END DEBUG ---");
      // --- END DEBUG LOG ---

      // stack[0] is Error()
      // stack[1] is this function (getCallerFileName)
      // stack[2] is the constructor (new Print())
      // stack[3] *deveria* ser o chamador (server.ts) - VAMOS VERIFICAR NO DEBUG LOG!
      const callerIndex = 3; // Adjusted index based on stack trace structure
      if (stack && stack.length > callerIndex) {
        // In Deno, stack frames are strings, so we need to parse the file name from the string.
        // Example frame: "    at file:///path/to/file.ts:10:15"
        const frame = stack[callerIndex];
        const match = frame.match(/(?:at |@)?(?:file:\/\/\/|\()([^):]+)/);
        if (match && match[1]) {
          potentialFileName = match[1].trim();
        }
      }
    } catch (e) {
      console.warn(
        "[Print] Failed to use structured stack trace, falling back to string parsing.",
        e,
      );
      // --- DEBUG LOG (Fallback) ---
      try {
        const err = new Error();
        console.log("--- DEBUG: String Stack Trace ---");
        console.log(err.stack);
        console.log("--- END DEBUG ---");
      } catch (e) {
        console.error("[Print] Error in fallback debug log:", e);
      }
      // --- END DEBUG LOG (Fallback) ---
    }

    // Fallback para string parsing (menos provável de funcionar bem se o estruturado falhou)
    if (!potentialFileName) {
      try {
        const err = new Error();
        const stackLines = err.stack?.split("\n");
        // --- DEBUG LOG (String Fallback) ---
        console.log("--- DEBUG: String Stack Lines ---");
        stackLines?.forEach((line, index) => console.log(`[${index}] ${line}`));
        console.log("--- END DEBUG ---");
        // --- END DEBUG LOG (String Fallback) ---

        const callerIndex = 3; // <<< Ajuste este índice baseado no DEBUG LOG
        if (stackLines && stackLines.length > callerIndex) {
          const callerLine = stackLines[callerIndex];
          const match = callerLine?.match(
            /(?:at |@)?(?:file:\/\/\/|\()([^):]+)/,
          );
          if (match && match[1]) {
            potentialFileName = match[1].trim();
          }
        }
      } catch (parseError) {
        console.error("[Print] Error parsing stack trace string:", parseError);
        return null;
      }
    }

    if (!potentialFileName) {
      console.warn(
        "[Print] Could not determine caller filename from stack trace.",
      );
      return null;
    }

    // Processamento do nome do arquivo (igual antes)
    try {
      let filePath = potentialFileName;
      if (filePath.startsWith("file:///")) {
        filePath = fileURLToPath(filePath);
      }
      const fileNameWithExt = path.basename(filePath);
      const ext = path.extname(fileNameWithExt);
      const fileNameWithoutExt = fileNameWithExt.slice(
        0,
        ext ? -ext.length : undefined,
      );
      return fileNameWithoutExt.toUpperCase();
    } catch (pathError) {
      console.error(
        "[Print] Error processing potential filename:",
        potentialFileName,
        pathError,
      );
      return path.basename(potentialFileName).toUpperCase();
    }
  }
}
