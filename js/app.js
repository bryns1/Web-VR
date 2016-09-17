$(document).ready(function(){
  $(".arrow").click(function(){
    $(".welcome").fadeOut(600);
    fullscreen()
    loadScripts(["./js/three.js", "./js/StereoEffect.js", "./js/DeviceOrientationControls.js", "./js/OrbitControls.js", "./js/environment.js"], 
      function(){
        $('.loading').fadeOut(600);
      })

  })
})

function fullscreen() {
  var body = $('body');
  if (body.requestFullscreen) {
    body.requestFullscreen();
  } else if (body.msRequestFullscreen) {
    body.msRequestFullscreen();
  } else if (body.mozRequestFullScreen) {
    body.mozRequestFullScreen();
  } else if (body.webkitRequestFullscreen) {
    body.webkitRequestFullscreen();
  }
}

function loadScripts(scriptSrc, callBack){
  var arrayLength = scriptSrc.length;
  for (var i = 0; i < arrayLength; i++){
    var script = document.createElement('script');
    script.setAttribute('src', scriptSrc[i]);
    script.async = false;
    document.head.appendChild(script);
  }

  if (callBack && (typeof callBack == "function")) {
      callBack();
   }
  
}