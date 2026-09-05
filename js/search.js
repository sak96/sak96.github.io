var SearchApp = (function () {
  var index = null;

  function init(callback) {
    var request = new XMLHttpRequest();
    request.open("GET", "/search_index.en.json", true);
    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        index = elasticlunr.Index.load(JSON.parse(request.responseText));
        if (callback) callback();
      }
    };
    request.send();
  }

  function search(query) {
    if (!index || !query) return [];
    return index.search(query, { expand: true });
  }

  function renderResult(doc, ref) {
    var html = '<a class="search-result" href="' + new URL(ref).pathname + '">';
    html += '<div class="search-result-title">' + doc.title + '</div>';
    if (doc.body) {
      html += '<div class="search-result-desc">' + doc.body.substring(0, 150) + '...</div>';
    }
    html += "</a>";
    return html;
  }

  function getDoc(ref) {
    return index ? index.documentStore.getDoc(ref) : null;
  }

  return { init: init, search: search, renderResult: renderResult, getDoc: getDoc };
})();
