import "@/styles/article.css";

/* Post-processes rendered HTML to add article-* link classes.
   Runs server-side — no runtime overhead. */
function processLinks(html: string): string {
  return html.replace(
    /<a\s+href="([^"]+)"([^>]*)>([\s\S]*?)<\/a>/g,
    (_match, href: string, attrs: string, text: string) => {
      const trimmed = text.trim();

      // Internal wikilinks
      if (
        href.startsWith("/ejes/") ||
        href.startsWith("/pais/") ||
        href.startsWith("/autores/") ||
        href.startsWith("/conceptos/") ||
        href.startsWith("/publicaciones/") ||
        href.startsWith("/analisis/")
      ) {
        return `<a href="${href}"${attrs} class="article-wikilink">${text}</a>`;
      }

      // Citation links — text starts with [ (e.g. [Infobae · 4 may 2026])
      if (trimmed.startsWith("[")) {
        return `<a href="${href}"${attrs} class="article-cite">${text}</a>`;
      }

      // Default external link
      return `<a href="${href}"${attrs} class="article-link">${text}</a>`;
    }
  );
}

interface Props {
  html: string;
  className?: string;
}

export default function ArticleBody({ html, className }: Props) {
  const processed = processLinks(html);
  return (
    <div
      className={`article-body${className ? ` ${className}` : ""}`}
      dangerouslySetInnerHTML={{ __html: processed }}
    />
  );
}
