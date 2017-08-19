// Saves options to chrome.storage
function save_options () {
  var projects = document.getElementById('projects').value.replace(',', '').split('\n');
  var cleaned = [];
  for (var i = 0; i < projects.length; i++) {
    if (projects[i].trim().length === 0) {
      continue;
    }
    cleaned.push(projects[i].trim());
  }
  var url = document.getElementById('url').value;
  if (!url.endsWith('/')) {
    url = url + '/';
  }
  chrome.storage.sync.set({
    projects : projects,
    url : url
  }, function () {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function () {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options () {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    projects : [],
    url : ''
  }, function (items) {
    document.getElementById('projects').value = items.projects.join('\n');
    document.getElementById('url').value = items.url;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
  save_options);