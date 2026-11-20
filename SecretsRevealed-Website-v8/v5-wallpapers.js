/* ==========================================================================
   SECRETSREVEALED v5 — 50+ HD BIBLE VERSE WALLPAPER ENGINE
   Exports studio-typeset PNG wallpapers for iPhone (1179x2556),
   Android (1080x2400), and Desktop/Computer (2560x1440).
   ========================================================================== */

const WallpaperStudio = (() => {
  const PRESETS = {
    iphone:  { w: 1179, h: 2556, label: "iPhone Pro (1179×2556)", safeTop: 0.30 },
    android: { w: 1080, h: 2400, label: "Android HD (1080×2400)", safeTop: 0.28 },
    desktop: { w: 2560, h: 1440, label: "Computer 2K (2560×1440)", safeTop: 0.24 }
  };

  function getBackdrop(bgId) {
    return WALLPAPER_BACKDROPS.find(b => b.id === bgId) || WALLPAPER_BACKDROPS[0];
  }

  function wrapLines(ctx, text, maxWidth) {
    const words = String(text || "").split(/\s+/);
    const lines = [];
    let current = "";
    words.forEach(w => {
      const test = current ? `${current} ${w}` : w;
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = w;
      } else {
        current = test;
      }
    });
    if (current) lines.push(current);
    return lines;
  }

  async function renderToDataUrl(wp, deviceKey = "iphone") {
    const preset = PRESETS[deviceKey] || PRESETS.iphone;
    const bg = wp.customBgData ? { src: wp.customBgData, textColor: "#fff8eb", accent: "#f4c465", light: false } : getBackdrop(wp.bg);
    const canvas = document.createElement("canvas");
    canvas.width = preset.w;
    canvas.height = preset.h;
    const ctx = canvas.getContext("2d");

    // Draw full-bleed cover-cropped backdrop image
    await new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const scale = Math.max(preset.w / img.width, preset.h / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        ctx.drawImage(img, (preset.w - dw) / 2, (preset.h - dh) / 2, dw, dh);
        resolve();
      };
      img.onerror = () => {
        const grad = ctx.createLinearGradient(0, 0, 0, preset.h);
        grad.addColorStop(0, "#10192e");
        grad.addColorStop(1, "#060912");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, preset.w, preset.h);
        resolve();
      };
      img.src = bg.src;
    });

    // Editorial cinematic vignette so Scripture is effortlessly legible
    const vig = ctx.createLinearGradient(0, 0, 0, preset.h);
    if (bg.light) {
      vig.addColorStop(0, "rgba(248, 241, 229, 0.25)");
      vig.addColorStop(0.5, "rgba(248, 241, 229, 0.52)");
      vig.addColorStop(1, "rgba(236, 224, 203, 0.72)");
    } else {
      vig.addColorStop(0, "rgba(6, 9, 18, 0.28)");
      vig.addColorStop(0.5, "rgba(6, 9, 18, 0.56)");
      vig.addColorStop(1, "rgba(6, 9, 18, 0.84)");
    }
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, preset.w, preset.h);

    // Subtle luxury inner border frame
    const inset = Math.round(Math.min(preset.w, preset.h) * 0.055);
    ctx.strokeStyle = bg.light ? "rgba(158, 94, 18, 0.38)" : "rgba(244, 196, 101, 0.38)";
    ctx.lineWidth = Math.max(2, Math.round(preset.w * 0.002));
    ctx.strokeRect(inset, inset, preset.w - inset * 2, preset.h - inset * 2);

    // Editorial Serif Verse Typography
    const isDesktop = deviceKey === "desktop";
    const fontSize = isDesktop ? 76 : 64;
    const lineH = Math.round(fontSize * 1.42);
    ctx.font = `italic 600 ${fontSize}px "Cormorant Garamond", Georgia, serif`;
    ctx.fillStyle = bg.textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const maxTextW = preset.w * (isDesktop ? 0.68 : 0.78);
    const lines = wrapLines(ctx, `“${wp.verse}”`, maxTextW);
    const blockH = lines.length * lineH;
    const centerY = isDesktop ? preset.h * 0.48 : preset.h * 0.54;
    let y = centerY - blockH / 2;

    // Gold ornament star above verse
    ctx.font = `700 ${Math.round(fontSize * 0.55)}px sans-serif`;
    ctx.fillStyle = bg.accent;
    ctx.fillText("✦", preset.w / 2, y - lineH * 0.75);

    // Verse lines
    ctx.font = `italic 600 ${fontSize}px "Cormorant Garamond", Georgia, serif`;
    ctx.fillStyle = bg.textColor;
    lines.forEach(line => {
      ctx.fillText(line, preset.w / 2, y);
      y += lineH;
    });

    // Reference pill
    ctx.font = `800 ${isDesktop ? 32 : 28}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = bg.accent;
    ctx.fillText(String(wp.ref || "").toUpperCase(), preset.w / 2, y + lineH * 0.45);

    // Discreet Sanctuary Watermark Footer
    ctx.font = `700 ${isDesktop ? 22 : 20}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = bg.light ? "rgba(35, 25, 16, 0.5)" : "rgba(255, 248, 235, 0.48)";
    ctx.fillText("SECRETSREVEALED  ·  READ · REFLECT · REVEAL", preset.w / 2, preset.h - inset * 1.55);

    return canvas.toDataURL("image/png");
  }

  async function downloadWallpaper(wp, deviceKey = "iphone") {
    if (window.showToast) window.showToast(`Rendering ${PRESETS[deviceKey]?.label || "HD"} wallpaper...`);
    const dataUrl = await renderToDataUrl(wp, deviceKey);
    const a = document.createElement("a");
    const slug = String(wp.ref || "verse").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    a.href = dataUrl;
    a.download = `SecretsRevealed-${slug}-${deviceKey}.png`;
    a.click();
    if (window.trackSpiritualEvent) window.trackSpiritualEvent("wallpapersDownloaded", 1);
    if (window.showToast) window.showToast(`✦ Downloaded HD ${deviceKey.toUpperCase()} Wallpaper!`);
  }

  return { PRESETS, getBackdrop, renderToDataUrl, downloadWallpaper };
})();
