document.addEventListener("DOMContentLoaded", () => {
  const wordList = ["scythe", "purpium", "bubble rod", "battleaxe", "momentum mace", "mace", "heavy core", "blaze rod"];
  const folder = "/assets/images/";
  const imageStyle = "width:1em;height:1em;vertical-align:middle;";

  function walkTextNodes(node, callback) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (!node.parentNode.closest("span")) {
        callback(node);
      }
    } else {
      node.childNodes.forEach(child => walkTextNodes(child, callback));
    }
  }

  function replaceWordWithImage(node) {
  let text = node.textContent;
  let replaced = false;

  for (let word of wordList) {
    const regex = new RegExp(`\\b${word}\\b`, "gi");

    if (regex.test(text)) {
      replaced = true;
      text = text.replace(regex, match => {
        return `${match} <img src="${folder}${word}.png" style="${imageStyle}">`;
      });
      break;
    }
  }

  if (replaced) {
    const span = document.createElement("span");
    span.innerHTML = text;
    node.parentNode.replaceChild(span, node);
  }
}

  walkTextNodes(document.body, replaceWordWithImage);
});
