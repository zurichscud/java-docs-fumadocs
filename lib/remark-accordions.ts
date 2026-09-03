// 仅声明插件需要访问的 Processor 字段，避免引入运行时依赖。
type Processor = {
  parser?: (...args: any[]) => unknown;
};

// 外层和内层容器允许使用三个或更多冒号，便于匹配常见的 directive 写法。
const outerOpening = /^\s*(:{3,})accordions(?:\s+.*)?\s*$/;
const accordionOpening = /^\s*(:{3,})accordion(?:\s+(.*?))?\s*$/;
const closing = /^\s*(:{3,})\s*$/;

/** 将 :::accordions 语法改写为 MDX 组件标签。 */
function rewriteAccordions(document: string) {
  const lines = document.split("\n");
  const output: string[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const outerMatch = outerOpening.exec(lines[index]);
    if (!outerMatch) {
      output.push(lines[index]);
      continue;
    }

    // 外层结束标记至少要使用相同数量的冒号，避免误吞内层结束标记。
    const outerLength = outerMatch[1].length;
    const accordions: string[] = [];
    let cursor = index + 1;
    let complete = false;

    while (cursor < lines.length) {
      if (closing.test(lines[cursor]) && lines[cursor].trim().length >= outerLength) {
        complete = true;
        break;
      }

      const accordionMatch = accordionOpening.exec(lines[cursor]);
      if (!accordionMatch) {
        cursor += 1;
        continue;
      }

      // 属性字符串原样放到 Accordion 标签上，由 MDX 负责解析 title 等属性。
      const title = accordionMatch[2]?.trim() ?? "";
      const content: string[] = [];
      const accordionLength = accordionMatch[1].length;
      cursor += 1;

      while (cursor < lines.length && !(closing.test(lines[cursor]) && lines[cursor].trim().length >= accordionLength)) {
        content.push(lines[cursor]);
        cursor += 1;
      }

      if (cursor >= lines.length) {
        complete = false;
        break;
      }

      // 内层内容保留为 Markdown，改写后仍会经过后续 MDX 编译流程。
      accordions.push(
        `<Accordion${title ? ` ${title}` : ""}>\n${content.join("\n")}\n</Accordion>`,
      );
      cursor += 1;
    }

    if (!complete || accordions.length === 0) {
      output.push(lines[index]);
      continue;
    }

    output.push("<Accordions>", ...accordions, "</Accordions>");
    index = cursor;
  }

  return output.join("\n");
}

export function remarkAccordions(this: Processor) {
  const parser = this.parser;
  // 该插件必须在 Markdown parser 初始化后执行，才能包装原始 parser。
  if (!parser) throw new Error("remarkAccordions must run after a Markdown parser");

  this.parser = (document, file) => parser(rewriteAccordions(document), file);
}
