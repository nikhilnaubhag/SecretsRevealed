/* ==========================================================================
   SECRETSREVEALED v5 — 3D CELESTIAL ENGINE, CLICK-ANYWHERE 3D RIPPLES,
   CUSTOM 3D LOADER & OFFLINE DISCONNECTED ANIMATION
   ========================================================================== */

const Sanctuary3DFX = (() => {
  /* Tactile 3D Golden Light Burst on Click/Tap Anywhere */
  function initClickAnywhere3D() {
    document.addEventListener("pointerdown", (e) => {
      if (e.target.closest("input, textarea, select")) return;
      const burst = document.createElement("div");
      burst.className = "click-3d-ripple";
      burst.style.left = `${e.clientX}px`;
      burst.style.top = `${e.clientY}px`;
      document.body.appendChild(burst);
      setTimeout(() => burst.remove(), 650);
    }, { passive: true });
  }

  /* Three.js WebGL 3D Celestial Scene */
  function mountThree(canvasId, opts = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof window.THREE === "undefined") return;
    try {
      const THREE = window.THREE;
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 100);
      camera.position.z = opts.camZ || 7.6;

      const count = opts.count || 280;
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      const c1 = new THREE.Color(0xf4c465), c2 = new THREE.Color(0x4fd9cc), c3 = new THREE.Color(0xfff6e5);
      for (let i = 0; i < count; i++) {
        const r = 2.6 + Math.random() * 8.2;
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(2 * Math.random() - 1);
        pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
        pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.72;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 9;
        const p = i % 5 === 0 ? c2 : (i % 2 === 0 ? c1 : c3);
        col[i * 3] = p.r; col[i * 3 + 1] = p.g; col[i * 3 + 2] = p.b;
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      g.setAttribute("color", new THREE.BufferAttribute(col, 3));
      const stars = new THREE.Points(g, new THREE.PointsMaterial({ size: 0.052, vertexColors: true, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending }));
      scene.add(stars);

      const grp = new THREE.Group();
      const r1 = new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.015, 16, 100), new THREE.MeshBasicMaterial({ color: 0xf4c465, transparent: true, opacity: 0.36 }));
      r1.rotation.x = Math.PI * 0.36; grp.add(r1);
      const r2 = new THREE.Mesh(new THREE.TorusGeometry(2.75, 0.01, 16, 100), new THREE.MeshBasicMaterial({ color: 0x4fd9cc, transparent: true, opacity: 0.22 }));
      r2.rotation.y = Math.PI * 0.3; grp.add(r2);
      const oct = new THREE.Mesh(new THREE.IcosahedronGeometry(0.76, 0), new THREE.MeshBasicMaterial({ color: 0xffe4a3, wireframe: true, transparent: true, opacity: 0.34 }));
      grp.add(oct);
      if (opts.offsetX) grp.position.x = opts.offsetX;
      scene.add(grp);

      let tx = 0, ty = 0;
      window.addEventListener("pointermove", (e) => {
        tx = (e.clientX / window.innerWidth - 0.5) * 1.1;
        ty = -(e.clientY / window.innerHeight - 0.5) * 0.7;
      }, { passive: true });

      const resize = () => {
        const p = canvas.parentElement;
        const w = p ? p.clientWidth : window.innerWidth;
        const h = p ? p.clientHeight : window.innerHeight;
        if (w > 0 && h > 0) { camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h, false); }
      };
      resize();
      window.addEventListener("resize", resize);

      let t = 0;
      (function loop() {
        requestAnimationFrame(loop);
        t += 0.004;
        stars.rotation.y = t * 0.28 + tx * 0.25;
        r1.rotation.z = t * 0.8;
        r2.rotation.z = -t * 0.55;
        oct.rotation.y = t * 0.9;
        oct.rotation.x = t * 0.5;
        grp.position.y = Math.sin(t * 1.5) * 0.14;
        camera.position.x += (tx * 0.5 - camera.position.x) * 0.04;
        camera.position.y += (ty * 0.35 - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
      })();
    } catch {}
  }

  function bind3DTilt(root) {
    if (!root) return;
    root.querySelectorAll(".card-3d-tilt").forEach(card => {
      if (card.dataset.tiltBound) return;
      card.dataset.tiltBound = "1";
      card.addEventListener("pointermove", (e) => {
        if (e.pointerType === "touch") return;
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        card.style.transform = `perspective(900px) rotateX(${((0.5 - py) * 12).toFixed(1)}deg) rotateY(${((px - 0.5) * 14).toFixed(1)}deg) translateY(-6px)`;
        card.style.setProperty("--sheen-x", `${(px * 100).toFixed(0)}%`);
        card.style.setProperty("--sheen-y", `${(py * 100).toFixed(0)}%`);
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
  }

  function initLoaderAndOffline() {
    const loader = document.getElementById("sanctuaryLoader");
    const bar = document.getElementById("loaderProgressFill");
    if (loader) {
      let pct = 20;
      const iv = setInterval(() => {
        pct = Math.min(100, pct + 26);
        if (bar) bar.style.width = `${pct}%`;
        if (pct >= 100) {
          clearInterval(iv);
          setTimeout(() => { loader.classList.add("is-done"); setTimeout(() => loader.classList.add("hidden"), 450); }, 160);
        }
      }, 140);
    }

    const off = document.getElementById("offlineOverlay");
    if (!off) return;
    const showOff = () => { off.classList.remove("hidden"); requestAnimationFrame(() => off.classList.add("is-visible")); };
    const hideOff = () => { off.classList.remove("is-visible"); setTimeout(() => off.classList.add("hidden"), 320); };
    window.addEventListener("offline", showOff);
    window.addEventListener("online", () => { hideOff(); if (window.showToast) window.showToast("✦ Back online!"); });
    document.querySelectorAll("[data-preview-offline]").forEach(b => b.addEventListener("click", showOff));
    const retry = document.getElementById("offlineRetryBtn");
    const cont = document.getElementById("offlineContinueBtn");
    if (retry) retry.addEventListener("click", () => { if (navigator.onLine) hideOff(); else if (window.showToast) window.showToast("Still offline — saved readings remain open."); });
    if (cont) cont.addEventListener("click", hideOff);
  }

  function init() {
    initClickAnywhere3D();
    initLoaderAndOffline();
    mountThree("heroCanvas3D", { count: 260, offsetX: 1.6 });
  }

  return { init, bind3DTilt };
})();
