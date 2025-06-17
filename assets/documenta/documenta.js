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
  [route, querystring = ''] = hashContent.split('?');
  return [route, querystring];
}

function getParams() {
  if (!querystring) return {};

  const queryParams = {};
  const querystrings = querystring.split('&');

  querystrings.forEach(param => {
    const [key, ...rest] = param.split('=');
    const value = rest.join('=');
    queryParams[decodeURIComponent(key)] = decodeURIComponent(value || '');
  });

  return queryParams;
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

  const sidebar = document.createElement('aside');
  sidebar.classList.add("sidebar");
  sidebar.classList.add("app-name");
  app.appendChild(sidebar);

  const appname = document.createElement('h1');
  const appnamelink = document.createElement('a');
  appnamelink.classList.add("app-name-link");
  appnamelink.href = "/";
  appnamelink.textContent = window.$documenta.name;

  appname.appendChild(appnamelink);
  sidebar.appendChild(appname);

  const sidebarList = document.createElement('ul');
  sidebar.appendChild(sidebarList);

  function createSidebarFromHeaders() {
    const content = document.querySelector('.content');
    if (!content) return;

    const headers = [...content.querySelectorAll('h1, h2, h3, h4, h5, h6')];
    const stack = [{ level: 0, list: sidebarList }];

    headers.forEach(header => {
      const level = parseInt(header.tagName.substring(1));

      if (!header.id) {
        header.id = header.textContent.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
      }

      const li = document.createElement('li');
      const a = document.createElement('a');
      a.classList.add("section-link");
      a.href = `${window.location.href.split('?')[0]}?id=${header.id}`;
      a.textContent = header.textContent;
      li.appendChild(a);

      while (stack.length > 1 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      const parentList = stack[stack.length - 1].list;
      parentList.appendChild(li);

      const newSublist = document.createElement('ul');
      li.appendChild(newSublist);
      stack.push({ level, list: newSublist });
    });
  }

  createSidebarFromHeaders();

  
  const id = getParams().id;
  const scrollto = id.toLowerCase()
  const element = document.getElementById(scrollto);
  element.scrollIntoView({ 
    behavior: 'smooth'
  });
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