// scene.js: enhanced BT-Estructure WebXR demo (advanced)
// Builds geodesics, orbit lines, orbits, and tour. Optimized for Quest performance.

AFRAME.registerComponent('bt-structure', {
  init: function () {
    const sceneEl = this.el;
    const geodesicParent = document.querySelector('#geodesics');
    const orbitLines = document.querySelector('#orbitLines');
    const orbitA = document.querySelector('#orbitA');
    const orbitB = document.querySelector('#orbitB');

    // Parameters - tweak here for visual changes
    const params = {
      orbitSpeedA: 0.018,
      orbitSpeedB: -0.012,
      geodesicCount: 18,
      geodesicSegments: 80,
      geodesicRadiusMax: 14,
      throatRadius: 1.4,
      orbitLineColor: '#6f4bb6'
    };

    // Helper: create simple orbit ring (line made of small torus segments)
    function makeOrbitLine(radius, color) {
      const group = document.createElement('a-entity');
      for (let i=0;i<120;i++){
        const angle = (i/120)*Math.PI*2;
        const x = radius*Math.cos(angle);
        const z = radius*Math.sin(angle);
        const seg = document.createElement('a-torus');
        seg.setAttribute('radius', 0.03 + (i%6===0?0.02:0));
        seg.setAttribute('radiusTubular', 0.01);
        seg.setAttribute('position', `${x} -0.01 ${z}`);
        seg.setAttribute('rotation', `90 ${-angle*180/Math.PI} 0`);
        seg.setAttribute('material', `color: ${color}; opacity:0.6`);
        group.appendChild(seg);
      }
      orbitLines.appendChild(group);
    }

    // Create orbit visuals
    makeOrbitLine(5.0, params.orbitLineColor);
    makeOrbitLine(7.0, params.orbitLineColor);
    makeOrbitLine(10.0, '#4455aa');

    // Create geodesics as particle bands (mix compressed and stretched)
    function makeGeodesic(rOffset, phase, compressed) {
      const group = document.createElement('a-entity');
      const segs = params.geodesicSegments;
      for (let i=0;i<segs;i++){
        const t = i/segs;
        const angle = t * Math.PI * 2 + phase;
        // radial variation to create diaphragm/diabolo shape
        const radial = rOffset * (1 + 0.45*Math.sin(4*angle)) * (1 - 0.8*Math.exp(-6*(t-0.5)*(t-0.5)));
        const x = radial * Math.cos(angle);
        const y = Math.sin(angle*2) * (compressed ? 0.18 : 0.45);
        const z = radial * Math.sin(angle);
        const p = document.createElement('a-sphere');
        p.setAttribute('radius', 0.035);
        p.setAttribute('position', `${x} ${y} ${z}`);
        p.setAttribute('material', `color: ${compressed ? '#66ffff' : '#ffdd66'}; opacity:0.88; shader:standard`);
        group.appendChild(p);
      }
      geodesicParent.appendChild(group);
    }

    for (let i=0;i<params.geodesicCount;i++){
      const r = 2.6 + i * (params.geodesicRadiusMax/params.geodesicCount);
      const phase = Math.random()*Math.PI*2;
      const compressed = (i % 4 === 0); // every 4th compressed
      makeGeodesic(r, phase, compressed);
    }

    // Orbit animation and small dynamic effects
    this.tick = function (time, timeDelta) {
      const t = time / 1000;
      orbitA.object3D.rotation.y += params.orbitSpeedA * (timeDelta/16);
      orbitB.object3D.rotation.y += params.orbitSpeedB * (timeDelta/16);

      // subtle pulsation on small BH and accretion
      const smallBH = document.querySelector('#smallBH');
      if (smallBH) {
        const s = 0.8 + 0.02*Math.sin(t*1.5);
        smallBH.setAttribute('scale', `${s} ${s} ${s}`);
      }
    };

    // Tour logic
    const rig = document.querySelector('#rig');
    let tourActive = false;
    const waypoints = [
      {x:0,y:1.6,z:10},
      {x:5.5,y:2.2,z:2.8},
      {x:0,y:1.2,z:0.8},
      {x:-7.5,y:2.6,z:-1.5},
      {x:0,y:3.2,z:-10}
    ];
    let currentWP = 0;
    function lerp(a,b,t){ return a + (b-a)*t; }
    function startTour(){ tourActive = true; currentWP = 0; tourStep(); }
    function stopTour(){ tourActive = false; }
    function tourStep(){
      if (!tourActive) return;
      const target = waypoints[currentWP];
      const startPos = rig.getAttribute('position');
      const duration = 3800;
      const startTime = performance.now();
      function animate(){
        if (!tourActive) return;
        const now = performance.now();
        const tt = Math.min(1,(now-startTime)/duration);
        const nx = lerp(startPos.x, target.x, tt);
        const ny = lerp(startPos.y, target.y, tt);
        const nz = lerp(startPos.z, target.z, tt);
        rig.setAttribute('position', `${nx} ${ny} ${nz}`);
        if (tt<1){
          requestAnimationFrame(animate);
        } else {
          currentWP = (currentWP+1) % waypoints.length;
          setTimeout(tourStep, 600);
        }
      }
      animate();
    }

    // wire window functions used by HTML overlay
    window.startTour = startTour;
    window.stopTour = stopTour;

    // listen for overlay events
    window.addEventListener('start-tour', startTour);
    window.addEventListener('stop-tour', stopTour);

    // expose parameters for debug tweaking in console
    window.BT_PARAMS = params;
  }
});

window.addEventListener('load', function(){
  const scene = document.querySelector('a-scene');
  const comp = document.createElement('a-entity');
  comp.setAttribute('bt-structure', '');
  scene.appendChild(comp);
});
