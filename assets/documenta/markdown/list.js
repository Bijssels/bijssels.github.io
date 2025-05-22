export default function(content) {
  let lines = content.split('\n');
  let result = [];
  let inUl = false;
  let inOl = false;
  let edited = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    let ulMatch = line.match(/^\s*[*\-+]\s+(.+)/);
    let olMatch = line.match(/^\s*(\d+)\.\s+(.+)/);

    if (ulMatch) {
      if (!inUl) {
        result.push('<ul>');
        inUl = true;
        edited = true;
      }
      result.push(`<li>${ulMatch[1]}</li>`);
    } else if (olMatch) {
      if (!inOl) {
        result.push('<ol>');
        inOl = true;
        edited = true;
      }
      result.push(`<li>${olMatch[2]}</li>`);
    } else {
      if (inUl) {
        result.push('</ul>');
        inUl = false;
      }
      if (inOl) {
        result.push('</ol>');
        inOl = false;
      }
      result.push(line);
    }
  }
  
  if (inUl) result.push('</ul>');
  if (inOl) result.push('</ol>');

  let newContent = result.join('\n');
  return edited ? newContent : false;
}
