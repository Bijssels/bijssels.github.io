export default function (content) {
    const lines = content.split('\n');
    let insideCodeBlock = false;
    let converted = [];

    for (let line of lines) {
        if (line.trim() === '```') {
            if (!insideCodeBlock) {
                converted.push('<pre><code>');
                insideCodeBlock = true;
            } else {
                converted.push('</code></pre>');
                insideCodeBlock = false;
            }
            continue;
        }

        if (insideCodeBlock) {
            converted.push(line);
        } else {
            const replaced = line.replace(/`([^`\n]+)`/g, '<code>$1</code>');
            converted.push(replaced);
        }
    }

    return converted.join('\n');
}
