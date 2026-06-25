/* ============================================================
   PLAIN VANILLA — events-data.js
   Único archivo a editar para agregar/modificar eventos o fotos.
   ============================================================ */

const GALLERY_APEROL = [
  'assets/Live/aperol-25/live-aperol-01.webp',
  'assets/Live/aperol-25/live-aperol-02.webp',
  'assets/Live/aperol-25/live-aperol-03.webp',
  'assets/Live/aperol-25/live-aperol-04.webp',
  'assets/Live/aperol-25/live-aperol-05.jpg',
  'assets/Live/aperol-25/live-aperol-06.webp',
  'assets/Live/aperol-25/live-aperol-07.webp',
  'assets/Live/aperol-25/live-aperol-08.webp',
];

const GALLERY_MEJIA = [
  'assets/Live/mejia/live-mejia-01.webp',
  'assets/Live/mejia/live-mejia-02.webp',
  'assets/Live/mejia/live-mejia-03.webp',
  'assets/Live/mejia/live-mejia-04.webp',
  'assets/Live/mejia/live-mejia-07.webp',
  'assets/Live/mejia/live-mejia-08.webp',
  'assets/Live/mejia/live-mejia-09.webp',
  'assets/Live/mejia/live-mejia-05.webp',
  'assets/Live/mejia/live-mejia-06.webp',
];

const GALLERY_LA_NOCHE = [
  'assets/Live/la-noche-1905/LaNoche_01.webp',
  'assets/Live/la-noche-1905/LaNoche_02.webp',
  'assets/Live/la-noche-1905/LaNoche_03.webp',
  'assets/Live/la-noche-1905/LaNoche_04.webp',
  'assets/Live/la-noche-1905/LaNoche_05.webp',
  'assets/Live/la-noche-1905/LaNoche_06.webp',
  'assets/Live/la-noche-1905/LaNoche_08.webp',
  'assets/Live/la-noche-1905/LaNoche_09.webp',
  'assets/Live/la-noche-1905/LaNoche_010.webp',
  'assets/Live/la-noche-1905/LaNoche_011.webp',
];

const EVENTS_DATA = [
  {
    id: 'la-noche',
    label: 'La Noche de Barranco',
    caption: '19 de mayo · Barranco, Lima',
    featuredVideo: 'cYXllpHXKWI',
    videos: [
      { youtubeId: '_6mXFVPkBbE', song: 'Funky Rap (Improvisación)' },
      { youtubeId: 'dQ9UH9av3Kg', song: 'Cliché'},
      { youtubeId: 'zQ3ZXLLbFlk', song: 'Vivo & Fino' },
      { youtubeId: 'RSxi6WYdr7w', song: 'Verde y Azul' },
      { youtubeId: 'DGf1VXfo1ag', song: 'Gata Siamés', recommended: true },
      { youtubeId: '5nhaZi70YlU', song: 'Sin Cadenas (Cover)' },
      { youtubeId: 'eBg_FPyAIXc', song: 'Eden y Charcos' },
      { youtubeId: 'nuBomyCoUS8', song: 'Romina', recommended: true },
      { youtubeId: 'cYXllpHXKWI', song: 'Final de Cortesía & Bossabebé', recommended: true },
      { youtubeId: '8a-qX6yPZaM', song: 'Que Se Repita (Encore)', localSrc: 'assets/Live/la-noche-1905/LaNoche_encore_06.mp4' },
    ],
    photos: GALLERY_LA_NOCHE,
  },
  {
    id: 'mejia',
    label: 'Apertura a Laguna Pai',
    caption: '03 de enero · Mejía, Arequipa',
    featuredVideo: 'Dt7FpINKjpA',
    videos: [
      { youtubeId: 'wMpTbeu92oo', song: 'Cliché', recommended: true },
      { youtubeId: 'KLi-Fi_RUao', song: 'Vivo & Fino' },
      { youtubeId: 'Dt7FpINKjpA', song: 'Verde y Azul', recommended: true },
      { youtubeId: 'g_ydCZYa7Qo', song: 'La Flaca (Cover)' },
      { youtubeId: 'XPouOyDahv0', song: 'Bossabebe' },
      { youtubeId: '4xlEur00f1Y', song: 'Que se Repita' },
    ],
    photos: GALLERY_MEJIA,
  },
  {
    id: 'aperol',
    label: "Aperol O'clock",
    caption: '02 de enero · Mejía, Arequipa',
    featuredVideo: 'R0CHezKnteM',
    videos: [
      { youtubeId: 'R0CHezKnteM', song: 'Recap de nuestro debut' },
    ],
    photos: GALLERY_APEROL,
  },
];
