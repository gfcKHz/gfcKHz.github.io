const SOUND_CLOUD_PLAYER_ID = "sc-floating-player";

const buildSoundCloudPlayer = () => {
  if (document.getElementById(SOUND_CLOUD_PLAYER_ID)) {
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.id = SOUND_CLOUD_PLAYER_ID;
  wrapper.innerHTML = `
    <iframe
      width="100%"
      height="166"
      scrolling="no"
      frameborder="no"
      allow="autoplay"
      src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2211134558&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true">
    </iframe>
    <div class="sc-player-meta">
      <a href="https://soundcloud.com/daejjeon" title="crocodile" target="_blank" rel="noopener">crocodile</a>
      <span> · </span>
      <a href="https://soundcloud.com/daejjeon/cm-transform" title="Johnson–Lindenstrauss" target="_blank" rel="noopener">Johnson–Lindenstrauss</a>
    </div>
  `;

  document.body.appendChild(wrapper);
};

const initSoundCloudPlayer = () => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildSoundCloudPlayer, { once: true });
  } else {
    buildSoundCloudPlayer();
  }
};

if (typeof document$ !== "undefined" && document$.subscribe) {
  document$.subscribe(() => buildSoundCloudPlayer());
} else {
  initSoundCloudPlayer();
}
