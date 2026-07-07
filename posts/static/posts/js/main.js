/* ============ GLACIREY — interaksi semi-3D & fitur blog ============ */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- 1. Parallax latar mengikuti kursor ---------- */
const shards = document.querySelectorAll(".shard");
const glows = document.querySelectorAll(".glow");

if (!reduceMotion) {
  document.addEventListener("mousemove", (e) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;

    shards.forEach((s, i) => {
      const depth = (i + 1) * 12;
      s.style.translate = `${x * depth}px ${y * depth}px`;
    });
    glows.forEach((g, i) => {
      const depth = (i + 1) * 24;
      g.style.translate = `${-x * depth}px ${-y * depth}px`;
    });

    // kubus hero ikut menoleh ke arah kursor
    const cube = document.getElementById("hero-cube");
    if (cube) {
      cube.style.transform = `rotateX(${-24 + y * -18}deg) rotateY(${38 + x * 26}deg)`;
    }
  });
}

/* ---------- 2. Kartu 3D tilt + kilau mengikuti kursor ---------- */
document.querySelectorAll(".tilt").forEach((card) => {
  const inner = card.querySelector(".card-inner");
  if (!inner || reduceMotion) return;

  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;

    inner.style.transform =
      `rotateY(${(px - 0.5) * 14}deg) rotateX(${(0.5 - py) * 12}deg) translateZ(6px)`;
    inner.style.setProperty("--mx", `${px * 100}%`);
    inner.style.setProperty("--my", `${py * 100}%`);
  });

  card.addEventListener("mouseleave", () => {
    inner.style.transform = "rotateY(0deg) rotateX(0deg) translateZ(0)";
  });
});

/* header artikel sedikit bereaksi terhadap kursor */
const softTilt = document.querySelector(".tilt-soft");
if (softTilt && !reduceMotion) {
  softTilt.addEventListener("mousemove", (e) => {
    const r = softTilt.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    softTilt.style.transform = `rotateY(${px * 4}deg) rotateX(${-py * 4}deg)`;
  });
  softTilt.addEventListener("mouseleave", () => {
    softTilt.style.transform = "rotateY(0) rotateX(0)";
  });
}

/* ---------- 3. Live search tanpa reload (debounce + fetch) ---------- */
const searchInput = document.getElementById("live-search");
const searchResults = document.getElementById("search-results");
let searchTimer;

if (searchInput && searchResults) {
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    const q = searchInput.value.trim();

    if (!q) {
      searchResults.hidden = true;
      searchResults.innerHTML = "";
      return;
    }

    searchTimer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/?q=${encodeURIComponent(q)}`);
        const data = await res.json();

        if (data.results.length === 0) {
          searchResults.innerHTML =
            `<div class="sr-empty">Tidak ada artikel untuk “${escapeHtml(q)}”.</div>`;
        } else {
          searchResults.innerHTML = data.results
            .map(
              (r) => `
              <a href="${r.url}">
                <div class="sr-title">${escapeHtml(r.title)}</div>
                <div class="sr-meta">${r.reading_time} mnt baca — ${escapeHtml(r.excerpt)}…</div>
              </a>`
            )
            .join("");
        }
        searchResults.hidden = false;
      } catch (_) {
        /* biarkan senyap saat offline */
      }
    }, 250);
  });

  // Enter = pencarian penuh di halaman daftar
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      window.location.href = `/?q=${encodeURIComponent(searchInput.value.trim())}`;
    }
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav-search")) searchResults.hidden = true;
  });
}

function escapeHtml(s) {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

/* ---------- 4. Like AJAX dengan animasi ---------- */
const likeBtn = document.getElementById("like-btn");
if (likeBtn) {
  likeBtn.addEventListener("click", async () => {
    likeBtn.disabled = true;
    try {
      const csrfInput = document.querySelector("[name=csrfmiddlewaretoken]");
      const res = await fetch(likeBtn.dataset.url, {
        method: "POST",
        headers: { "X-CSRFToken": csrfInput ? csrfInput.value : getCookie("csrftoken") },
      });
      const data = await res.json();

      document.getElementById("like-count").textContent = data.likes;
      likeBtn.classList.toggle("liked", data.liked);
      likeBtn.classList.remove("pop");
      void likeBtn.offsetWidth; // restart animasi
      likeBtn.classList.add("pop");
    } catch (_) {
      /* abaikan kegagalan jaringan */
    } finally {
      likeBtn.disabled = false;
    }
  });
}

function getCookie(name) {
  const m = document.cookie.match(new RegExp("(^|;\\s*)" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[2]) : "";
}

/* ---------- 5. Progress bar membaca ---------- */
const progressBar = document.getElementById("progress-bar");
if (progressBar) {
  const update = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    progressBar.style.width = max > 0 ? `${(h.scrollTop / max) * 100}%` : "0%";
  };
  document.addEventListener("scroll", update, { passive: true });
  update();
}

/* ---------- 6. Text-to-speech: dengarkan artikel ---------- */
const ttsBtn = document.getElementById("tts-btn");
if (ttsBtn) {
  if (!("speechSynthesis" in window)) {
    ttsBtn.hidden = true;
  } else {
    ttsBtn.addEventListener("click", () => {
      const synth = window.speechSynthesis;

      if (synth.speaking) {
        synth.cancel();
        ttsBtn.classList.remove("speaking");
        ttsBtn.textContent = "🔊 Dengarkan artikel";
        return;
      }

      const text =
        document.querySelector(".article-title").textContent +
        ". " +
        document.getElementById("article-body").textContent;

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "id-ID";
      utter.rate = 1.0;
      utter.onend = () => {
        ttsBtn.classList.remove("speaking");
        ttsBtn.textContent = "🔊 Dengarkan artikel";
      };

      synth.speak(utter);
      ttsBtn.classList.add("speaking");
      ttsBtn.textContent = "⏹ Berhenti mendengarkan";
    });
  }
}
