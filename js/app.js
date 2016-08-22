var scene,
          camera, 
          renderer,
          element,
          container,
          effect,
          controls,
          clock,
          wall,

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

        // Lighting
        var floorTexture = THREE.ImageUtils.loadTexture('textures/wood.jpg', {}, function(){
      renderer.render(scene,camera);
});
        /*floorTexture.wrapS = THREE.RepeatWrapping;
        floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat = new THREE.Vector2(1167, 778);*/
        floorTexture.anisotropy = renderer.getMaxAnisotropy();
        floorTexture.minFilter = THREE.LinearFilter

        var wallTexture = THREE.ImageUtils.loadTexture('textures/wood.jpg', {} , function(){
      renderer.render(scene,camera);
});
        wallTexture.anisotropy = renderer.getMaxAnisotropy();
        wallTexture.minFilter = THREE.LinearFilter

        var floorMaterial = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          specular: 0xffffff,
          shininess: 20,
          shading: THREE.FlatShading,
          map: floorTexture
        });

         var wallMaterial = new THREE.MeshPhongMaterial({
          color: 0xD60000,
          specular: 0xD60000,
          shininess: 20,
        });

        var geometry = new THREE.PlaneBufferGeometry(1000, 1000);
        var wallGeometry = new THREE.PlaneBufferGeometry(192, 108);

        var floor = new THREE.Mesh(geometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        scene.add(floor);

        wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.x = 300;
        wall.rotation.y = -Math.PI / 2;
        scene.add(wall);

            var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );
        
        clock = new THREE.Clock();

        animate();
      }

      function animate() {
        var elapsedSeconds = clock.getElapsedTime();
        // wall.rotation.y += 0.01;
        // console.log(wall.rotation.y)
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