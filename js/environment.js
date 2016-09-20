var scene,
    camera, 
    renderer,
    element,
    container,
    effect,
    controls,
    clock,
    wall,
    pano,
    emoticon,
    video,
    videoTexture,
    sphereViewer,
    panoSrc,
    panoImg = [],
    panoIter = -1,
    mouseTimeout,
    rotateTimer;


init();

function init() {
  panoSrc = $("#webglviewer").data()["pano"][0]["src"],
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.001, 700);
  camera.position.set(0, 15, 0);
  scene.add(camera);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.shadowMapEnabled = true;
  renderer.shadowMapType = THREE.PCFSoftShadowMap;
  element = renderer.domElement;
  container = document.getElementById('webglviewer');
  container.appendChild(element);

  effect = new THREE.StereoEffect(renderer);
  effect.seperation = 1000;
  effect.focalLength = 1000;

  // Our initial control fallback with mouse/touch events in case DeviceOrientation is not enabled
  controls = new THREE.OrbitControls(camera, element);
  controls.target.set(
    camera.position.x + 0.15,
    camera.position.y,
    camera.position.z
  );
  controls.noPan = true;
  controls.noZoom = true;

  function setOrientationControls(e) {
    if (!e.alpha) {
      return;
    }

    controls = new THREE.DeviceOrientationControls(camera, true);
    controls.connect();
    controls.update();

    window.removeEventListener('deviceorientation', setOrientationControls, true);
  }
  window.addEventListener('deviceorientation', setOrientationControls, true);

  var sphereGeo = new THREE.SphereGeometry( 500, 30, 40 );
  var sphereMaterial = new THREE.MeshBasicMaterial({
    map: getPhoto()
  });
  pano = new THREE.Mesh( sphereGeo, sphereMaterial ); /*sometimes when you fight a */
  pano.material.side = THREE.BackSide;
  scene.add( pano );

  clock = new THREE.Clock();

  animate();
}

function animate() {
  var elapsedSeconds = clock.getElapsedTime();

  requestAnimationFrame(animate);
  update(clock.getDelta());
  render(clock.getDelta());
}

function resize() {
  var width = container.offsetWidth;
  var height = container.offsetHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  effect.setSize(width, height);
}

function update(dt) {
  resize();

  camera.updateProjectionMatrix();

  controls.update(dt);
}

function render(dt) {
  effect.render(scene, camera);
}













function getPhoto(){
  var panoLong = panoImg.length;
  if (panoImg.length < panoSrc.length){
    panoImg[panoLong] = new THREE.TextureLoader().load( panoSrc[panoLong], function(){
        $("#webglviewer").removeClass('fade');
      })
  panoIter = panoIter + 1;
  console.log("first" + panoIter)
  return panoImg[panoLong];
  }else{
    panoIter = panoIter + 1;
    if (panoIter > panoSrc.length-1){
      panoIter = 0;
    }
    console.log("second" + panoIter);
    $("#webglviewer").removeClass('fade');
    return panoImg[panoIter]
  }
}

function changePhoto(){
  pano.material.map = panoImg[panoIter];
  pano.material.needUpdate = true;
}

var webglviewer = document.getElementById("webglviewer");
webglviewer.addEventListener("mousedown", function(){
  var oldMouse = mouse;
  mouseTimeout = setTimeout(function(){
    var newMouse = mouse;
    if (Math.abs(newMouse.x - oldMouse.x) < 3 || Math.abs(newMouse.y - oldMouse.y) < 3){
      $("#webglviewer").addClass('fade');
      setTimeout(function(){
        getPhoto();
        changePhoto();
      }, 300)
      
    }
  }, 600)
})

webglviewer.addEventListener("mouseup", function(){
  clearTimeout(mouseTimeout);
})

$(window).resize(function(){
  if(window.innerHeight > window.innerWidth){
    $('.rotateWrapper').removeClass('fade');
    clearTimeout(rotateTimer);
    $('.rotateWrapper').removeClass('noDisplay');
  }else{
    $('.rotateWrapper').addClass('fade');
    rotateTimer = setTimeout(function(){
      $('.rotateWrapper').addClass('noDisplay');
    }, 600)
  }
})

