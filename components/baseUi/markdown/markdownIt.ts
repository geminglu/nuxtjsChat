import MarkdownIt from "markdown-it";
import MarkdownItAbbr from "markdown-it-abbr";
import MarkdownItAnchor from "markdown-it-anchor";
import MarkdownItFootnote from "markdown-it-footnote";
import MarkdownItSub from "markdown-it-sub";
import MarkdownItSup from "markdown-it-sup";
import MarkdownItTasklists from "markdown-it-task-lists";
import MarkdownItTOC from "markdown-it-toc-done-right";
import { mark } from "@mdit/plugin-mark";
import mk from "markdown-it-katex";
import MdMermaid from "mermaid-it-markdown";
import mila from "markdown-it-link-attributes";
import hljs from "highlight.js";

export default function markdown() {
  const mdi = new MarkdownIt({
    highlight(str, lang) {
      lang = hljs.getLanguage(lang) ? lang : "plaintext";
      return highlightBlock(
        hljs.highlight(str, { language: lang, ignoreIllegals: true }).value,
        lang,
      );
    },
  })
    .use(mila, {
      attrs: {
        target: "_blank",
        rel: "noopener",
      },
    })
    .use(MdMermaid)
    .use(mk)
    .use(MarkdownItAbbr)
    .use(MarkdownItAnchor)
    .use(MarkdownItFootnote)
    .use(MarkdownItSub)
    .use(MarkdownItSup)
    .use(MarkdownItTasklists)
    .use(MarkdownItTOC)
    .use(mark);
  return mdi;
}

function highlightBlock(str: string, lang?: string) {
  return `<pre class="code-block-wrapper"><div class="code-block-header"><span class="code-block-header__lang">${lang}</span><span class="code-block-header__copy"></span></div><code class="hljs code-block-body ${lang}">${str}</code></pre>`;
}
