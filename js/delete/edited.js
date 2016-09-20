var scene,
          camera, 
          renderer,
          element,
          container,
          effect,
          controls,
          clock,
          pano,
          sphereGeo,
          mouseTimeout,
          currentPano = 0,
          panoSrc = $("#webglviewer").data()["pano"][0]["src"],
          panoMaterial = {},

          // Particles
          particles = new THREE.Object3D(),
          totalParticles = 200,
          maxParticleSize = 200,
          particleRotationSpeed = 0,
          particleRotationDeg = 0,
          lastColorRange = [0, 0.3],
          currentColorRange = [0, 0.3];

      init();

      function init() {
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

        // Our preferred controls via DeviceOrientation
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
        var material = new THREE.MeshBasicMaterial({
          map: new THREE.TextureLoader().load( "./pano/pano-1.jpg", function(){ $('.loading').fadeOut(600) } ),
          transparent:false,
          opacity:1,
          color:"#333"
        });

        pano = new THREE.Mesh( sphereGeo,  material);
        pano.material.side = THREE.BackSide;
        scene.add( pano );

        var spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( 0, 2, 0 );
        spotLight.castShadow = true;
        scene.add( spotLight );

        hemiLight = new THREE.HemisphereLight( 0x0000ff, 0x00ff00, 0.6 );
        scene.add(hemiLight)

        var light = new THREE.AmbientLight( 0x404040 ); // soft white light
        scene.add( light );
        
        clock = new THREE.Clock();

        animate();
      }

      function animate(oldHover) {
        var elapsedSeconds = clock.getElapsedTime();

        requestAnimationFrame(function(){
        });
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

      function changePano(target){
        var target = scene.getObjectByName(target);
        var initial = target.material.opacity;
        Tweenlite.to(initial, 1, {opacity: 0});
        if (currentPano > 5){
          currentPano++;
          initPano();
        }else{
          currentPano = 0;
          initPano();
        }
        Tweenlite.to(initial, 1, {opacity: 1});

      }

      function initPanoMaterial(){
        panoMaterial[currentPano] = new THREE.TextureLoader().load( panoSrc[currentPano], function(){ $('.loading').fadeOut(600) } );
        return panoMaterial[currentPano];
        loadNext()
      }

      function loadNext(){
            
            console.log("1");
            if (currentPano < 5){
              console.log("2");
              panoMaterial[currentPano + 1] = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load( panoSrc[currentPano], function(){})
              })
            }else{
              console.log("3");
            }
            console.log("4")
      }
      var webglviewer = document.getElementById("webglviewer");
      webglviewer.addEventListener("mousedown", function(){
        var oldMouse = mouse;
        var timeout = setTimeout(function(){
          var newMouse = mouse;
          if (Math.abs(newMouse.x - oldMouse.x) < 3 || Math.abs(newMouse.y - oldMouse.y) < 3){
/*            changePano("pano")
*/          }
        }, 600)
      })

      webglviewer.addEventListener("mouseup", function(){
        clearTimeout(mouseTimeout);
      })