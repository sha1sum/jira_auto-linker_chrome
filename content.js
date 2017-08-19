var projects = [];
var url = '';

chrome.storage.sync.get({
  projects : [],
  url : ''
}, function (items) {
  console.log(items);
  projects = items.projects;
  url = items.url;
  if (url.length > 0 && projects.length > 0) {
    var timeout
    document.addEventListener("DOMSubtreeModified", function() {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(function() {
        var elements = document.getElementsByTagName('body');
        for (var i = 0; i < elements.length; i++) {
          doReplacement(elements[i]);
        }
      }, 500);
    }, false);
  }
});

function replaceKey(parentNode, node, project) {
  var match = node.nodeValue.match(new RegExp('[^\\w]?(' + project + '-\\d+)[^\\w]'));
  if (match) {
    var key = match[1];
    var keyInd = node.nodeValue.indexOf(key);
    var t1 = node.nodeValue.substr(0, keyInd);
    var t2 = node.nodeValue.substr(keyInd + key.length);
    var anchor = document.createElement('A');
    anchor.setAttribute('target', '_blank');
    anchor.setAttribute('href', url + 'browse/' + key);
    anchor.appendChild(document.createTextNode(key));
    var t2n = document.createTextNode(t2)
    parentNode.insertBefore(document.createTextNode(t1), node);
    parentNode.insertBefore(anchor, node);
    parentNode.insertBefore(t2n, node);
    parentNode.removeChild(node);
    doReplacement(t2n);
    return true;
  }

  return false;
}

function doReplacement(node) {
  if (!node) {
    return;
  }
  // Skip anchor elements since they already link somewhere...
  if (node.nodeName === 'A') {
    return;
  }

  if (node.childNodes.length > 0) {
    for (var j = 0; j < node.childNodes.length; j++) {
      doReplacement(node.childNodes[j]);
    }
  } else {
    if (node.nodeType === 3) {
      var text = node.nodeValue;
      var replaced = text;

      for (var k = 0; k < projects.length; k++) {
        replaceKey(node.parentNode, node, projects[k]);
      }
    }
  }
}