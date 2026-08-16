import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(repoRoot, 'docs', 'update-status.md');
const outputPath = path.join(repoRoot, 'UPDATE-STATUS.html');
const requiredSections = ['前回からの変化', '各メーカー状況', '判断待ち', '次にすること'];

const args = process.argv.slice(2);
const checkOnly = args.includes('--check');
const unknownArgs = args.filter((arg) => arg !== '--check');

if (unknownArgs.length > 0) {
  throw new Error(`Unknown argument(s): ${unknownArgs.join(', ')}`);
}

const rawSource = await readFile(sourcePath, 'utf8');
const source = `${rawSource.replace(/\r\n?/g, '\n').trimEnd()}\n`;
const html = buildHtml(source);

if (checkOnly) {
  let current;
  try {
    current = await readFile(outputPath, 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') {
      throw new Error('UPDATE-STATUS.html is missing. Run `npm run generate:update-cockpit`.');
    }
    throw error;
  }

  if (current !== html) {
    throw new Error('UPDATE-STATUS.html is out of date. Run `npm run generate:update-cockpit`.');
  }

  console.log('OK: UPDATE-STATUS.html is up to date.');
} else {
  await writeFile(outputPath, html, 'utf8');
  console.log('OK: generated UPDATE-STATUS.html from docs/update-status.md.');
}

function buildHtml(markdown) {
  const { metadata, body } = parseFrontMatter(markdown);
  const missingMetadata = ['title', 'status', 'updated', 'summary'].filter((key) => !metadata[key]);
  if (missingMetadata.length > 0) {
    throw new Error(`Missing front matter field(s): ${missingMetadata.join(', ')}`);
  }

  const sections = parseSections(body);
  const sectionNames = new Set(sections.map((section) => section.title));
  const missingSections = requiredSections.filter((name) => !sectionNames.has(name));
  if (missingSections.length > 0) {
    throw new Error(`Missing required section(s): ${missingSections.join(', ')}`);
  }

  const sourceHash = createHash('sha256').update(markdown, 'utf8').digest('hex');
  const sectionHtml = sections
    .map((section, index) => renderSection(section, `section-${index + 1}`))
    .join('\n');
  const navigation = sections
    .map((section, index) => `<a href="#section-${index + 1}">${escapeHtml(section.title)}</a>`)
    .join('\n          ');

  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeAttribute(metadata.summary)}">
  <title>${escapeHtml(metadata.title)}</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f4f7fb;
      --surface: #ffffff;
      --surface-strong: #edf3fb;
      --text: #172033;
      --muted: #5e6b82;
      --line: #d7e0ed;
      --accent: #1769aa;
      --accent-strong: #0b4e82;
      --warning-bg: #fff5d9;
      --warning-text: #704d00;
      --shadow: 0 18px 48px rgba(30, 53, 85, 0.11);
    }
    @media (prefers-color-scheme: dark) {
      :root {
        color-scheme: dark;
        --bg: #101722;
        --surface: #182231;
        --surface-strong: #202d3f;
        --text: #edf4ff;
        --muted: #adbbce;
        --line: #34445a;
        --accent: #72b7f1;
        --accent-strong: #a6d5fb;
        --warning-bg: #493b18;
        --warning-text: #ffe29a;
        --shadow: 0 18px 48px rgba(0, 0, 0, 0.32);
      }
    }
    :root[data-theme="light"] {
      color-scheme: light;
      --bg: #f4f7fb;
      --surface: #ffffff;
      --surface-strong: #edf3fb;
      --text: #172033;
      --muted: #5e6b82;
      --line: #d7e0ed;
      --accent: #1769aa;
      --accent-strong: #0b4e82;
      --warning-bg: #fff5d9;
      --warning-text: #704d00;
      --shadow: 0 18px 48px rgba(30, 53, 85, 0.11);
    }
    :root[data-theme="dark"] {
      color-scheme: dark;
      --bg: #101722;
      --surface: #182231;
      --surface-strong: #202d3f;
      --text: #edf4ff;
      --muted: #adbbce;
      --line: #34445a;
      --accent: #72b7f1;
      --accent-strong: #a6d5fb;
      --warning-bg: #493b18;
      --warning-text: #ffe29a;
      --shadow: 0 18px 48px rgba(0, 0, 0, 0.32);
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      background:
        radial-gradient(circle at 10% 0%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 36rem),
        var(--bg);
      color: var(--text);
      font-family: "Yu Gothic UI", "Meiryo", system-ui, sans-serif;
      line-height: 1.7;
    }
    button, a { font: inherit; }
    a { color: var(--accent); }
    .shell { width: min(1120px, calc(100% - 32px)); margin-inline: auto; }
    .hero { padding: 56px 0 30px; }
    .hero-grid { display: grid; grid-template-columns: 1fr auto; gap: 28px; align-items: start; }
    .eyebrow { margin: 0 0 8px; color: var(--accent); font-weight: 800; letter-spacing: .08em; font-size: .82rem; }
    h1 { margin: 0; font-size: clamp(2rem, 5vw, 3.65rem); line-height: 1.15; letter-spacing: -.035em; }
    .summary { max-width: 760px; margin: 18px 0 0; color: var(--muted); font-size: 1.08rem; }
    .actions { display: flex; gap: 8px; flex-wrap: wrap; justify-content: end; }
    .button {
      border: 1px solid var(--line);
      border-radius: 999px;
      background: var(--surface);
      color: var(--text);
      padding: 9px 14px;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(20, 40, 70, .07);
    }
    .button:hover, .button:focus-visible { border-color: var(--accent); outline: none; }
    .meta { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 26px; }
    .pill { border: 1px solid var(--line); background: var(--surface); border-radius: 999px; padding: 6px 11px; color: var(--muted); font-size: .9rem; }
    .pill.status { background: var(--warning-bg); color: var(--warning-text); border-color: color-mix(in srgb, var(--warning-text) 28%, transparent); font-weight: 800; }
    .nav { display: flex; flex-wrap: wrap; gap: 8px 18px; margin-top: 26px; padding: 16px 18px; border-block: 1px solid var(--line); }
    .nav a { color: var(--muted); text-decoration: none; font-weight: 700; }
    .nav a:hover { color: var(--accent-strong); text-decoration: underline; }
    main { display: grid; gap: 18px; padding: 18px 0 60px; }
    .card { scroll-margin-top: 16px; background: var(--surface); border: 1px solid var(--line); border-radius: 20px; box-shadow: var(--shadow); overflow: hidden; }
    .card-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 19px 22px; background: var(--surface-strong); border-bottom: 1px solid var(--line); }
    h2 { margin: 0; font-size: 1.25rem; line-height: 1.35; }
    h3 { margin: 1.4em 0 .45em; font-size: 1.05rem; }
    .section-body { padding: 20px 22px 22px; }
    .section-body > :first-child { margin-top: 0; }
    .section-body > :last-child { margin-bottom: 0; }
    p, ul, ol, blockquote { margin: 0 0 1rem; }
    ul, ol { padding-left: 1.4rem; }
    li + li { margin-top: .45rem; }
    blockquote { margin-inline: 0; padding: 10px 14px; border-left: 4px solid var(--accent); background: var(--surface-strong); color: var(--muted); }
    code { font-family: "Cascadia Mono", Consolas, monospace; padding: .1em .35em; background: var(--surface-strong); border-radius: 5px; }
    .table-scroll { overflow-x: auto; border: 1px solid var(--line); border-radius: 13px; }
    table { width: 100%; border-collapse: collapse; min-width: 760px; font-size: .94rem; }
    th, td { padding: 11px 13px; text-align: left; vertical-align: top; border-bottom: 1px solid var(--line); }
    th { background: var(--surface-strong); color: var(--muted); font-size: .82rem; letter-spacing: .03em; }
    tr:last-child td { border-bottom: 0; }
    tbody tr:hover { background: color-mix(in srgb, var(--accent) 6%, transparent); }
    footer { padding: 0 0 42px; color: var(--muted); font-size: .82rem; }
    .hash { font-family: "Cascadia Mono", Consolas, monospace; overflow-wrap: anywhere; }
    .toast { position: fixed; right: 18px; bottom: 18px; background: var(--accent-strong); color: var(--bg); padding: 10px 14px; border-radius: 10px; box-shadow: var(--shadow); opacity: 0; transform: translateY(8px); pointer-events: none; transition: .18s ease; }
    .toast.visible { opacity: 1; transform: translateY(0); }
    @media (max-width: 720px) {
      .hero { padding-top: 34px; }
      .hero-grid { grid-template-columns: 1fr; }
      .actions { justify-content: start; }
      .card-header, .section-body { padding-inline: 17px; }
    }
    @media print {
      :root { color-scheme: light; --bg: #fff; --surface: #fff; --surface-strong: #f2f4f7; --text: #111; --muted: #444; --line: #bbb; --shadow: none; }
      body { background: #fff; }
      .shell { width: 100%; }
      .hero { padding-top: 0; }
      .actions, .nav, .copy-section, .toast { display: none !important; }
      .card { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <header class="hero shell">
    <div class="hero-grid">
      <div>
        <p class="eyebrow">BAMBU FILAMENT PROFILES</p>
        <h1>${escapeHtml(metadata.title)}</h1>
        <p class="summary">${inlineMarkdown(metadata.summary)}</p>
      </div>
      <div class="actions" aria-label="ページ操作">
        <button class="button" id="copy-all" type="button">全体をコピー</button>
        <button class="button" id="theme-toggle" type="button">配色を切替</button>
      </div>
    </div>
    <div class="meta" aria-label="更新メタデータ">
      <span class="pill status">状態: ${escapeHtml(metadata.status)}</span>
      <span class="pill">基準日: ${escapeHtml(metadata.updated)}</span>
    </div>
    <nav class="nav" aria-label="ページ内目次">
          ${navigation}
    </nav>
  </header>
  <main class="shell" id="content">
${sectionHtml}
  </main>
  <footer class="shell">
    <p>このページは更新状況の正本から機械生成されています。内容識別子: <span class="hash">${sourceHash}</span></p>
  </footer>
  <div class="toast" id="toast" role="status" aria-live="polite">コピーしました</div>
  <script>
    const root = document.documentElement;
    const toast = document.getElementById('toast');
    let toastTimer;

    try {
      const savedTheme = localStorage.getItem('update-status-theme');
      if (savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;
    } catch {}

    document.getElementById('theme-toggle').addEventListener('click', () => {
      const isDark = root.dataset.theme
        ? root.dataset.theme === 'dark'
        : window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.dataset.theme = isDark ? 'light' : 'dark';
      try { localStorage.setItem('update-status-theme', root.dataset.theme); } catch {}
    });

    document.getElementById('copy-all').addEventListener('click', async () => {
      const text = [...document.querySelectorAll('#content > section')]
        .map((section) => section.querySelector('h2').innerText + '\\n\\n' + section.querySelector('.section-body').innerText)
        .join('\\n\\n');
      await copyText(text);
    });

    for (const button of document.querySelectorAll('.copy-section')) {
      button.addEventListener('click', async () => {
        const section = button.closest('section');
        const title = section.querySelector('h2').innerText;
        const body = section.querySelector('.section-body').innerText;
        await copyText(title + '\\n\\n' + body);
      });
    }

    async function copyText(value) {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(value);
        } else {
          const field = document.createElement('textarea');
          field.value = value;
          field.setAttribute('readonly', '');
          field.style.position = 'fixed';
          field.style.opacity = '0';
          document.body.appendChild(field);
          field.select();
          if (!document.execCommand('copy')) throw new Error('copy command failed');
          field.remove();
        }
        showToast('コピーしました');
      } catch {
        showToast('コピーできませんでした');
      }
    }

    function showToast(message) {
      toast.textContent = message;
      toast.classList.add('visible');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('visible'), 1800);
    }
  </script>
</body>
</html>
`;
}

function parseFrontMatter(markdown) {
  const lines = markdown.split('\n');
  if (lines[0] !== '---') {
    throw new Error('docs/update-status.md must start with YAML-style front matter.');
  }

  const closingIndex = lines.indexOf('---', 1);
  if (closingIndex === -1) {
    throw new Error('docs/update-status.md front matter is not closed.');
  }

  const metadata = {};
  for (const line of lines.slice(1, closingIndex)) {
    if (!line.trim()) continue;
    const match = /^([a-z][a-z0-9_-]*):\s*(.+)$/i.exec(line);
    if (!match) throw new Error(`Invalid front matter line: ${line}`);
    metadata[match[1]] = match[2].trim();
  }

  return { metadata, body: lines.slice(closingIndex + 1).join('\n').trim() };
}

function parseSections(body) {
  const lines = body.split('\n');
  const sections = [];
  let current;

  for (const line of lines) {
    const heading = /^##\s+(.+)$/.exec(line);
    if (heading) {
      current = { title: heading[1].trim(), lines: [] };
      sections.push(current);
    } else if (current) {
      current.lines.push(line);
    } else if (line.trim()) {
      throw new Error('Content before the first level-two heading is not supported.');
    }
  }

  if (sections.length === 0) throw new Error('No level-two sections found in docs/update-status.md.');
  return sections;
}

function renderSection(section, id) {
  return `    <section class="card" id="${id}">
      <div class="card-header">
        <h2>${escapeHtml(section.title)}</h2>
        <button class="button copy-section" type="button">この欄をコピー</button>
      </div>
      <div class="section-body">
${renderMarkdownBlocks(section.lines)}
      </div>
    </section>`;
}

function renderMarkdownBlocks(lines) {
  const output = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    const levelThree = /^###\s+(.+)$/.exec(line);
    if (levelThree) {
      output.push(`        <h3>${inlineMarkdown(levelThree[1])}</h3>`);
      index += 1;
      continue;
    }

    if (isTableStart(lines, index)) {
      const rows = [splitTableRow(lines[index])];
      index += 2;
      while (index < lines.length && /^\s*\|.*\|\s*$/.test(lines[index])) {
        rows.push(splitTableRow(lines[index]));
        index += 1;
      }
      output.push(renderTable(rows));
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^[-*]\s+/, ''));
        index += 1;
      }
      output.push(`        <ul>\n${items.map((item) => `          <li>${inlineMarkdown(item)}</li>`).join('\n')}\n        </ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\d+\.\s+/, ''));
        index += 1;
      }
      output.push(`        <ol>\n${items.map((item) => `          <li>${inlineMarkdown(item)}</li>`).join('\n')}\n        </ol>`);
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quote.push(lines[index].replace(/^>\s?/, ''));
        index += 1;
      }
      output.push(`        <blockquote>${inlineMarkdown(quote.join(' '))}</blockquote>`);
      continue;
    }

    const paragraph = [];
    while (index < lines.length && lines[index].trim() && !isBlockStart(lines, index)) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    if (paragraph.length === 0) {
      throw new Error(`Unsupported Markdown near: ${lines[index]}`);
    }
    output.push(`        <p>${inlineMarkdown(paragraph.join(' '))}</p>`);
  }

  return output.join('\n');
}

function isBlockStart(lines, index) {
  const line = lines[index] ?? '';
  return /^###\s+/.test(line)
    || /^[-*]\s+/.test(line)
    || /^\d+\.\s+/.test(line)
    || /^>\s?/.test(line)
    || isTableStart(lines, index);
}

function isTableStart(lines, index) {
  return /^\s*\|.*\|\s*$/.test(lines[index] ?? '')
    && /^\s*\|(?:\s*:?-{3,}:?\s*\|)+\s*$/.test(lines[index + 1] ?? '');
}

function splitTableRow(line) {
  return line.trim().slice(1, -1).split('|').map((cell) => cell.trim());
}

function renderTable(rows) {
  const [header, ...body] = rows;
  if (body.some((row) => row.length !== header.length)) {
    throw new Error('Markdown table rows must have the same number of columns.');
  }

  return `        <div class="table-scroll">
          <table>
            <thead><tr>${header.map((cell) => `<th scope="col">${inlineMarkdown(cell)}</th>`).join('')}</tr></thead>
            <tbody>
${body.map((row) => `              <tr>${row.map((cell) => `<td>${inlineMarkdown(cell)}</td>`).join('')}</tr>`).join('\n')}
            </tbody>
          </table>
        </div>`;
}

function inlineMarkdown(value) {
  const codeSpans = [];
  const protectedValue = String(value).replace(/`([^`]+)`/g, (_match, code) => {
    const token = `\u0000CODE${codeSpans.length}\u0000`;
    codeSpans.push(`<code>${escapeHtml(code)}</code>`);
    return token;
  });

  let rendered = escapeHtml(protectedValue);
  rendered = rendered.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  rendered = rendered.replace(/\u0000CODE(\d+)\u0000/g, (_match, index) => codeSpans[Number(index)]);
  return rendered;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll('\n', '&#10;');
}
