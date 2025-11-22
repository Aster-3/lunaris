const crime = require('../../assets/books/cap.jpg');
const karamazov = require('../../assets/books/karamazov.jpg');
const moby = require('../../assets/books/26532159.jpg');
const issth = require('../../assets/books/ıssth.jpeg');
const mw = require('../../assets/books/mw.jpg');
const renaged = require('../../assets/books/renaged.jpg');
const ri = require('../../assets/books/ri.jpeg');
const lotm = require('../../assets/books/lotm.webp');
const ed = require('../../assets/books/ed.webp');
const will = require('../../assets/books/will.webp');

export const BookData = [
  { id: 1, name: 'A Will Eternal', img: will, belongsToFolders: [1, 4] },
  { id: 2, name: 'The Brothers Karamazov', img: karamazov, belongsToFolders: [3] },
  { id: 3, name: 'Martial World', img: mw, belongsToFolders: [1, 4] },
  { id: 4, name: 'Crime and Punishment', img: crime, belongsToFolders: [3] },
  { id: 5, name: 'Lord of the Mysteries', img: lotm, belongsToFolders: [1, 4] },
  { id: 6, name: 'Renaged Immortal', img: renaged, belongsToFolders: [1, 4] },
  { id: 7, name: 'Reverend Insanity', img: ri, belongsToFolders: [1, 4] },
  { id: 8, name: 'Moby Dick', img: moby, belongsToFolders: [2] },
  { id: 9, name: 'Emperor Domination', img: ed, belongsToFolders: [1, 4] },
  { id: 10, name: 'I Shall Seal The Heavens', img: issth, belongsToFolders: [1, 4] },
];
