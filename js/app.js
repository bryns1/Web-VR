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
          photoMaterial

          //DOM Elements
          elemX = document.getElementById('x'),
          elemY = document.getElementById('y'),
          elemZ = document.getElementById('z'),

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

          element.addEventListener('click', fullscreen, false);

          window.removeEventListener('deviceorientation', setOrientationControls, true);
        }
        window.addEventListener('deviceorientation', setOrientationControls, true);

        var sphereGeo = new THREE.SphereGeometry( 500, 30, 40 );
        var sphereMaterial = new THREE.MeshBasicMaterial({
          map: new THREE.TextureLoader().load( './pano/pano-1.jpg' )
        });
        pano = new THREE.Mesh( sphereGeo, sphereMaterial ); /*sometimes when you fight a */
        pano.material.side = THREE.BackSide;
        scene.add( pano );
      
        var spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( 0, 2, 0 );
        spotLight.castShadow = true;
        scene.add( spotLight );

        var sphereViewerGeo = new THREE.SphereGeometry(1, 30, 40);
        photoMaterial = new THREE.MeshBasicMaterial({
          map: new THREE.TextureLoader().load( './pano/pano-2.jpg' ),
          transparent:true,
          opacity:0
        });
        sphereViewer = new THREE.Mesh(sphereViewerGeo, photoMaterial);
        sphereViewer.position.z = -5;
        sphereViewer.position.y = 15;
        sphereViewer.material.side = THREE.DoubleSide;
        scene.add(sphereViewer);


        hemiLight = new THREE.HemisphereLight( 0x0000ff, 0x00ff00, 0.6 );
        scene.add(hemiLight)

        var light = new THREE.AmbientLight( 0x404040 ); // soft white light
        scene.add( light );
        
        clock = new THREE.Clock();

        animate();
      }

      function calcHover(){
        var planeVector = (new THREE.Vector3( 0, 0, 1 )).applyQuaternion(sphereViewer.quaternion);
        var cameraVector = (new THREE.Vector3( 0, 0, -1 )).applyQuaternion(camera.quaternion );
        var angle = planeVector.angleTo(cameraVector);
        return {on:angle>3, near:angle>2.75, num:angle};
      }

      function animate(oldHover) {
        var elapsedSeconds = clock.getElapsedTime();
        var status = calcHover();
        if (status.near){
          if (status.on){
            jQuery('.aim').css({background:'green'})
          }else{
            photoMaterial.opacity = 1-(3-status.num)/0.25
          }
        }else{
          jQuery('.aim').css({background:'white'})
        }
        if (status.on !== oldHover){
          console.log("Bool Change", status.on)
        }
        elemX.innerHTML = Math.ceil(camera.rotation.x * 180 / Math.PI);
        elemY.innerHTML = Math.ceil(camera.rotation.y * 180 / Math.PI);
        elemZ.innerHTML = Math.ceil(camera.rotation.z * 180 / Math.PI);
        camera.rotation.y + 1 * 180 / Math.PI;

        requestAnimationFrame(function(){
          animate(status.on);
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

      function fullscreen() {
        if (container.requestFullscreen) {
          container.requestFullscreen();
        } else if (container.msRequestFullscreen) {
          container.msRequestFullscreen();
        } else if (container.mozRequestFullScreen) {
          container.mozRequestFullScreen();
        } else if (container.webkitRequestFullscreen) {
          container.webkitRequestFullscreen();
        }
      }