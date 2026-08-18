import { visit } from 'unist-util-visit';

type MdNode = { type: string; value?: string; children?: MdNode[] };

/**
 * 将 `::: tip [title] ... :::` 语法转换为 `<Callback type="tip" title="...">` 节点。
 */
export function remarkCallback() {
  return (tree: MdNode) => {
    visit(tree, (node) => {
      if (!('children' in node)) return;
      replaceNodes(node.children as unknown as MdNode[]);
    });
  };

  function replaceNodes(nodes: MdNode[]) {
    if (nodes.length === 0) return;

    let open = -1;
    let typeName = '';
    let title = '';
    let hasIntercept = false;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.type !== 'paragraph') continue;

      const text = flattenText(node);

      if (open === -1) {
        const match = text.match(
          /^:{3,}\s*(tip|note|info|warn|warning|danger|error|success)(?:\s+([\s\S]*))?$/,
        );
        if (!match) continue;

        open = i;
        typeName = match[1];
        title = match[2]?.trim() ?? '';

        if (title.startsWith('[') && title.endsWith(']')) {
          title = title.slice(1, -1);
        }
        continue;
      }

      if (text.trim().match(/^:{3,}$/)) {
        const children = nodes.slice(open + 1, i);
        if (hasIntercept) replaceNodes(children);
        nodes.splice(open, i - open + 1, {
          type: 'mdxJsxFlowElement',
          name: 'Callback',
          attributes: [
            { type: 'mdxJsxAttribute', name: 'type', value: typeName },
            ...(title
              ? [{ type: 'mdxJsxAttribute', name: 'title', value: title }]
              : []),
          ],
          children,
        } as unknown as MdNode);

        open = -1;
        hasIntercept = false;
        typeName = '';
        title = '';
        i = open;
        continue;
      }

      // 未闭合前遇到新的 `::: xxx` 开头段落,视为嵌套,递归处理
      if (text.match(/^:{3,}\s*(tip|note|info|warn|warning|danger|error|success)/)) {
        hasIntercept = true;
      }
    }
  }
}

function flattenText(node: MdNode): string {
  if (node.type === 'text') return node.value ?? '';
  if (node.children) return node.children.map(flattenText).join('');
  return '';
}
