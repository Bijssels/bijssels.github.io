export default function(content) {
    let edited = false;
  
    content = content.replace(/(^|\n)[*\-+]\s+(.+)/g, (match, prefix, text) => {
      edited = true;
      return `${prefix}<ul><li>${text}</li></ul>`;
    });
  
    content = content.replace(/(^|\n)(\d+)\.\s+(.+)/g, (match, prefix, number, text) => {
      edited = true;
      return `${prefix}<ol><li>${text}</li></ol>`;
    });
  
    return edited ? content : false;
  }
  