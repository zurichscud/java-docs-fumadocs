import { aesDecrypt, CONFIG } from "./lk-crypto.js";

function readStdin() {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
  });
}

function normalize(text) {
  let s = String(text)
    .replace(/\x1b\[[0-9;?]*[A-Za-z]/g, "")
    .replace(/[\x00-\x1f\x7f]/g, "")
    .trim()
    .replace(/\s+/g, "");
  if (/%[0-9A-Fa-f]{2}/.test(s)) {
    try {
      s = decodeURIComponent(s);
    } catch {}
  }
  if (s.startsWith("{") || s.startsWith("[")) {
    try {
      const obj = JSON.parse(s);
      const inner = obj.body ?? obj.data ?? obj.response ?? obj.content;
      if (typeof inner === "string") s = inner.trim();
    } catch {}
  }
  return s;
}

function tryDecrypt(cipher, key) {
  return JSON.parse(aesDecrypt(cipher, key));
}

function print(json) {
  console.log(JSON.stringify(json, null, 2));
}

function handle(cipher, key) {
  try {
    print(tryDecrypt(cipher, key));
    return true;
  } catch {
    return false;
  }
}

const arg = process.argv[2];
const key = process.argv[3] || CONFIG.key.prod;

if (arg) {
  if (!arg.trim()) {
    console.error("用法: node decode.js '<加密报文>' [key]");
    process.exit(1);
  }
  if (!handle(normalize(arg), key)) {
    console.error("解密失败");
    process.exit(1);
  }
} else if (!process.stdin.isTTY) {
  const lines = (await readStdin()).split("\n").filter((l) => l.trim());
  for (const line of lines) {
    if (!handle(normalize(line), key)) console.error("跳过无法解密的片段:", line.slice(0, 40) + "...");
  }
} else {
  const cyan = (s) => `\x1b[36m${s}\x1b[0m`;
  const green = (s) => `\x1b[32m${s}\x1b[0m`;
  const red = (s) => `\x1b[31m${s}\x1b[0m`;
  const prompt = () => process.stdout.write(cyan("密文> "));

  console.log("LK 响应解密器 | key=prod | Ctrl+C 退出");
  console.log(process.stdin.isTTY ? "直接粘贴加密报文即可自动解密（不必回车）\n" : "");

  const raw = process.stdin.isTTY && typeof process.stdin.setRawMode === "function";
  if (raw) process.stdin.setRawMode(true);
  process.stdin.resume();
  prompt();

  let buf = "";
  let timer = null;
  process.stdin.setEncoding("utf8");

  const status = () => {
    const cipher = normalize(buf);
    const bytes = Buffer.from(cipher.replace(/-/g, "+").replace(/_/g, "/"), "base64").length;
    console.log(
      red("⏳ 等待中") +
        `：已收到 ${cipher.length} 字符 / ${bytes} 字节` +
        (bytes % 16 ? "（非 16 倍数，报文不完整）" : "（解密未通过，可能被截断或 key 不对）") +
        "，继续粘贴剩余部分或按 Backspace 清空\n",
    );
    prompt();
  };

  process.stdin.on("data", (chunk) => {
    if (chunk.includes("\x03") || chunk.includes("\x04")) {
      console.log("\n再见");
      process.exit(0);
    }
    if (chunk.includes("\x7f")) {
      buf = "";
      clearTimeout(timer);
      console.log(red("已清空当前输入，请重新粘贴") + "\n");
      prompt();
      return;
    }
    buf += chunk;
    if (buf.length > 200000) buf = chunk;
    const magic = buf.lastIndexOf("EAT879wHdBcY");
    if (magic > 0) buf = buf.slice(magic);
    const cipher = normalize(buf);
    if (cipher.length < 64) return;
    if (handle(cipher, key)) {
      buf = "";
      clearTimeout(timer);
      console.log(green("✓ 解密成功") + " | " + new Date().toLocaleTimeString() + "\n");
      prompt();
      return;
    }
    if (/[\r\n]/.test(chunk)) status();
    else {
      clearTimeout(timer);
      timer = setTimeout(status, 900);
    }
  });
  process.stdin.on("end", () => process.exit(0));
}
