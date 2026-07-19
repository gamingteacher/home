document.addEventListener('DOMContentLoaded', () => {
  loadPublications();
});

async function loadPublications() {
  try {
    const res = await fetch('publications.md', { cache: 'no-store' });
    if (!res.ok) throw new Error('Falha ao carregar publications.md');
    const text = await res.text();
    const pubs = parsePublicationsMarkdown(text);
    renderPublications(pubs);
  } catch (err) {
    console.error(err);
    const grid = document.getElementById('pub-grid');
    if (grid) {
      grid.innerHTML = '<p style="color:var(--red)">Erro ao carregar publicações.</p>';
    }
  }
}

function parsePublicationsMarkdown(text) {
  const blocks = text.trim().split(/\r?\n\s*\r?\n+/);
  const pubs = [];
  let id = 1;
  for (const block of blocks) {
    const entry = {};
    const lines = block.split(/\r?\n/);
    for (const line of lines) {
      const m = line.match(/^\s*([a-zA-Z]+)\s*:\s*(.*)$/);
      if (!m) continue;
      const key = m[1];
      let value = m[2].trim();
      if (/^\(nenhum\)/i.test(value) || /^\(nenhuma\)/i.test(value)) value = '';
      entry[key] = value;
    }
    if (Object.keys(entry).length) {
      entry.id = id++;
      pubs.push({
        id:         entry.id,
        coverImage: entry.coverImage || '',
        shortTitle: entry.shortTitle || '',
        authors:    entry.authors    || '',
        year:       entry.year       || '',
        fullTitle:  entry.fullTitle  || '',
        link:       entry.link       || '',
        reference:  entry.reference  || '',
      });
    }
  }
  return pubs;
}

function renderPublications(pubs) {
  const grid    = document.getElementById('pub-grid');
  const details = document.getElementById('pub-details');
  if (!grid || !details) return;

  grid.innerHTML    = '';
  details.innerHTML = '';

  pubs.forEach((pub) => {
    const card = document.createElement('div');
    card.className = 'publication-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', pub.fullTitle || pub.shortTitle || 'Publicação');

    // Cover
    const cover = document.createElement('div');
    cover.className = 'pub-cover';

    if (pub.coverImage) {
      const img = document.createElement('img');
      img.src   = pub.coverImage;
      img.alt   = pub.shortTitle || pub.fullTitle || 'Capa';
      cover.appendChild(img);
    } else if (pub.shortTitle) {
      const p = document.createElement('p');
      p.className   = 'pub-cover-text';
      p.textContent = pub.shortTitle;
      cover.appendChild(p);
    } else {
      const p = document.createElement('p');
      p.className   = 'pub-cover-noimg';
      p.textContent = 'Sem capa';
      cover.appendChild(p);
    }

    // Meta (authors + year)
    const meta = document.createElement('p');
    meta.className   = 'pub-meta';
    meta.textContent = [pub.authors, pub.year].filter(Boolean).join(', ');

    card.appendChild(cover);
    card.appendChild(meta);

    const open = () => showDetails(pub, details);
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });

    grid.appendChild(card);
  });
}

function showDetails(pub, container) {
  container.innerHTML = '';

  const panel = document.createElement('div');
  panel.className = 'pub-detail-panel';

  const closeBtn = document.createElement('button');
  closeBtn.className   = 'close-btn';
  closeBtn.textContent = '✕';
  closeBtn.setAttribute('aria-label', 'Fechar detalhes');
  closeBtn.addEventListener('click', () => container.innerHTML = '');

  const h3 = document.createElement('h3');

  if (pub.link) {
    const a = document.createElement('a');
    a.href   = pub.link;
    a.target = '_blank';
    a.rel    = 'noopener noreferrer';
    a.textContent = pub.fullTitle || pub.shortTitle || 'Publicação';
    h3.appendChild(a);
  } else {
    h3.textContent = pub.fullTitle || pub.shortTitle || 'Publicação';
  }

  const ref = document.createElement('p');
  ref.textContent = pub.reference || '';

  panel.appendChild(closeBtn);
  panel.appendChild(h3);
  panel.appendChild(ref);
  container.appendChild(panel);

  setTimeout(() => {
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 50);
}
