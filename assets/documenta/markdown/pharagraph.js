export default function (content) {
    const converted = content.split('\n').map(line => {
        const hasHtmlTags = /<\/?[a-z][\s\S]*>/i.test(line);
        
        if (hasHtmlTags) {
            return line;
        } else {
            line = line.replace(/\*([^*]+)\*/g, '<b>$1</b>'); // *text* = vetgedrukt
            line = line.replace(/_([^_]+)_/g, '<i>$1</i>'); // _text_ = schuin
            line = line.replace(/~([^~]+)~/g, '<s>$1</s>'); // ~text~ = doorstreept
            line = line.replace(/__([^_]+)__/g, '<u>$1</u>'); // __text__ = onderstreept

            return `<p>${line}</p>`;
        }
    }).join('\n');

    return converted;
}