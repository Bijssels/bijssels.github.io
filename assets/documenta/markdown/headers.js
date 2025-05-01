export default function(content) {
  const headerCount = {};

  if (content.includes('# ')) {
    const headerLevels = {
      '# ': 'h1',
      '## ': 'h2',
      '### ': 'h3',
      '#### ': 'h4',
      '##### ': 'h5',
      '###### ': 'h6',
    };

    const converted = content.split('\n').map(line => {
      let text;
      let level;

      for (const [prefix, headerTag] of Object.entries(headerLevels)) {
        if (line.startsWith(prefix)) {
          text = line.slice(prefix.length).trim();
          level = headerTag;
          return generateHeader(text, level);
        }
      }

      return line;
    }).join('\n');

    return converted;
  }
  return content;

  function generateHeader(text, level) {
    let sanitizedText = text.toLowerCase().replace(/\s+/g, '-');

    if (headerCount[sanitizedText] !== undefined) {
      headerCount[sanitizedText]++;
      sanitizedText = `${sanitizedText}-${headerCount[sanitizedText]}`;
    } else {
      headerCount[sanitizedText] = 0;
    }

    return `<${level} id="${sanitizedText}"><a href="${window.location.href.split('?')[0]}?id=${sanitizedText}" class="anchor"><span>${text}</span></a></${level}>`;
  }
}
