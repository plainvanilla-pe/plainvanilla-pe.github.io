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
    caption: 'La Noche de Barranco · 19 de mayo · Barranco, Lima',
    featuredVideo: 'cYXllpHXKWI',
    videos: [
      { youtubeId: '_6mXFVPkBbE', song: 'Funky Rap' },
      { youtubeId: 'cYXllpHXKWI', song: 'Darte Amor & Bossabebé' },
      { youtubeId: 'DGf1VXfo1ag', song: 'Gata Siamés' },
      { youtubeId: 'nuBomyCoUS8', song: 'Romina' },
    ],
    photos: GALLERY_LA_NOCHE,
  },
  {
    id: 'mejia',
    label: 'Laguna Pai',
    caption: 'Apertura a Laguna Pai · Mejía, Arequipa',
    featuredVideo: 'Dt7FpINKjpA',
    videos: [
      { youtubeId: 'Dt7FpINKjpA', song: 'Verde y Azul' },
      { youtubeId: 'wMpTbeu92oo', song: 'Cliché' },
    ],
    photos: GALLERY_MEJIA,
  },
  {
    id: 'aperol',
    label: "Aperol O'clock",
    caption: '',
    featuredVideo: null,
    videos: [],
    photos: GALLERY_APEROL,
  },
];
