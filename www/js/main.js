// Add view
var mainView = app.addView('.view-main', {
  modalTitle: 'Shake ton BDE',
  dynamicNavbar: true
});

// Show/hide preloader for remote ajax loaded pages
// Probably should be removed on a production/local app
$$(document).on('ajaxStart', function () {
    app.showIndicator();
});
$$(document).on('ajaxComplete', function () {
    app.hideIndicator();
});

// Event listener to run specific code for specific pages
$$(document).on('pageInit', function (e) {
  var page = e.detail.page;
console.log(page.name);
  if (page.name === 'events') {
    $.getJSON('http://einna.net/events.json?callback=?', function(remoteData){
      console.log(remoteData)
    });
  }
});
