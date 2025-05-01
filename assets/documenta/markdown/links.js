export default function(content) {
  let edited = false;

  content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, link) => {
    edited = true;

    if (!/^https?:\/\//i.test(link)) {
      link = `/#/${link}`;
    }

    return `<a href="${link}">${text}</a>`;
  });

  return edited ? content : false;
}