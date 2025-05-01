const currentScript = document.currentScript;
const scriptDir = currentScript.src.substring(0, currentScript.src.lastIndexOf('/'));
const cssPath = scriptDir + '/items.css';
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = cssPath;
document.head.appendChild(link);


let querystring = '';
let route = '';

function getRoute() {
  let hash = window.location.hash;

  if (!hash.startsWith('#/')) {
    if (hash.startsWith('#')) {
      window.location.hash = '#/' + hash.slice(1);
    } else {
      window.location.hash = '#/';
    }
  }

  const hashContent = hash.slice(2);
  const [route, querystring = ''] = hashContent.split('?');
  return [route, querystring];
}

function getParams() {
  if (!querystring) { return {} }
  let querystrings = querystring.split('&');
  const queryParams = {};

  querystrings.forEach(param => {
    const [key, value] = param.split('=');
    queryParams[key] = value;
  });

  return queryParams
}

function loadPage(route, querystring) {
  const file = `/pages/${route}.md`;
  const fallbackFile = `/pages/${route}/README.md`;

  fetch(file)
    .then(response => {
      if (!response.ok) {
        return fetch(fallbackFile).then(fallbackResponse => {
          if (!fallbackResponse.ok) {
            throw new Error('Page not found');
          }
          return fallbackResponse.text();
        });
      }
      return response.text();
    })
    .then(content => {
      renderPage(content, querystring);
    })
    .catch(() => {
      renderError();
    });
}

async function renderPage(content, querystring) {
  let app = document.getElementById('app');
  app.innerHTML = ""
  let container = document.createElement('div');
  container.classList.add("content");
  app.appendChild(container);

  const scripts = [
    './markdown/headers.js',
    './markdown/codeblocks.js',
    './markdown/grid.js',
    './markdown/links.js',
    './markdown/list.js',
    './markdown/pharagraph.js'
  ];

  let modifiedContent = content;

  for (const scriptPath of scripts) {
    try {
      const module = await import(scriptPath + `?cacheBust=${Date.now()}`);

      if (typeof module.default === 'function') {
        const result = module.default(modifiedContent);

        if (result !== false) {
          modifiedContent = result;
        }
      } else {
        console.warn(`No default function in module: ${scriptPath}`);
      }
    } catch (error) {
      console.error(`Error loading script ${scriptPath}:`, error);
    }
  }

  container.innerHTML = modifiedContent

  const id = getParams().id;
  if (id) {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.log(`Element with id ${id} not found`);
    }
  }

  let sidebar = document.createElement('aside');
  sidebar.classList.add("sidebar");
  app.appendChild(sidebar);

  let appname = document.createElement('h1');
  sidebar.classList.add("app-name");
  let appnamelink = document.createElement('a');
  appnamelink.classList.add("app-name-link")
  appnamelink.href = "/"
  appnamelink.text = window.$documenta.name
  sidebar.appendChild(appname)
  appname.appendChild(appnamelink)

  let sidebarlu = document.createElement('ul');
  sidebar.appendChild(sidebarlu);

  function createSidebarFromHeaders() {
    let contentDiv = document.querySelector('.content');
    if (!contentDiv) {
      return;
    }

    function createListForHeader(headerLevel, parentList) {
      let headers = contentDiv.querySelectorAll(`h${headerLevel}`);

      headers.forEach(header => {

        let sidebarli = document.createElement('li');
        parentList.appendChild(sidebarli);

        let sidebara = document.createElement('a');
        sidebara.classList.add("section-link");
        sidebara.href = `${window.location}?id=${header.id}`;
        sidebara.textContent = header.textContent;
        sidebarli.appendChild(sidebara);

        if (headerLevel < 6) {
          let nextList = document.createElement('ul');
          sidebarli.appendChild(nextList);
          createListForHeader(headerLevel + 1, nextList);
        }
      });
    }

    createListForHeader(1, sidebarlu);
  }

  createSidebarFromHeaders();
}

function renderError() {
  const container = document.getElementById('app');
  container.innerHTML = '<h1>404 - Page Not Found</h1>';
}

function initRouter() {
  const route = getRoute();
  loadPage(route[0], route[1]);
}

window.addEventListener('hashchange', initRouter);
window.addEventListener('load', initRouter);