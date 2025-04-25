(function () {
  function autoTextToHyperLink(hook, vm) {
    let keywords = {};
    let ignoredParents = [];
    let skipIfOnPage = false;

    hook.init(function () {
      const config = window.$docsify?.link || {};
      keywords = config.keywords || {};
      ignoredParents = config.ignoredparents || [];
      skipIfOnPage = config.skipifonpage || false;
    });

    function isInsideIgnoredParent(node) {
      return ignoredParents.some(selector => {
        try {
          return node.parentElement?.closest(selector);
        } catch {
          return false;
        }
      });
    }

    function isCurrentPageUrl(url) {
      const current = new URL(window.location.href);
      const target = new URL(url, current);
      return current.origin === target.origin && current.pathname === target.pathname && current.search === target.search && current.hash === target.hash;
    }

    function linkifyTextNodes(node, keywords) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (isInsideIgnoredParent(node)) return;

        let text = node.nodeValue;
        for (const [word, url] of Object.entries(keywords)) {
          if (skipIfOnPage && isCurrentPageUrl(url)) continue;

          const regex = new RegExp(`\\b(${word})\\b`, "gi");
          text = text.replace(regex, match => `<a href="${url}" class="hyper">${match}</a>`);
        }

        if (text !== node.nodeValue) {
          const span = document.createElement("span");
          span.innerHTML = text;
          node.replaceWith(...span.childNodes);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== "A" && node.tagName !== "CODE" && node.tagName !== "PRE") {
        for (const child of [...node.childNodes]) {
          linkifyTextNodes(child, keywords);
        }
      }
    }

    hook.afterEach(function (html, next) {
      const container = document.createElement("div");
      container.innerHTML = html;
      linkifyTextNodes(container, keywords);
      next(container.innerHTML);
    });
  }

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = (window.$docsify.plugins || []).concat(autoTextToHyperLink);
})();
