# React Chess Board v0.4.0

![Old game](https://raw.githubusercontent.com/sandy98/next-chess-board/master/static/img/mangiaterra-savoretti-1988.png)

Yet another Javascript chessboard.

Intended to be used as a pluggable component in projects constructed using [React.js](https://reactjs.org/)  and involving chess games.

---

## Install

Through npm
```sh
   cd your-react-project-folder
   npm install --save next-chess-board
```
or through yarn
```sh
   cd your-react-project-folder
   yarn add next-chess-board
```

You are ready to use ChessBoard component in your react.js project, for instance in your `index.js`:

```js  
    import ChessBoard from 'next-chess-board'
    
    export default () => (
      <div>
        <Chessboard size={400} moveValidator={true} />
      </div>
    )
```

---
## API

Main recomendation here is the old, wise *Look at the source, Luke* 

The client pages, users of the component, may be found in the ```/pages``` directory of the source. There almost every feature this component provides is used, and the code is pretty self explanatory. Looking at them (and reusing code!) is strongly recommended.

Anyway the formal description follows.

#### Static properties and methods
```Chessboard.chessSets``` Exposes an array of image sets in data format, which is used internally by the board to draw its images. This means that the user of the component doesn't have to care about figure images location, since they are embedded within the component itself. Exposing them publicly through this property allows their usage outside of the chessboard, for example:
```html
  <img src={ChessBoard.chessSets.alt1.B} title="White Bishop from alt1 set" />
```
---
```js
static Messages = {
      CHECK_MATE: {en: 'Checkmate', es: 'Jaque Mate'},
      CHECK: {en: 'Check', es: 'Jaque'},
      STALE_MATE: {en: 'Stalemate draw', es: 'Tablas por mate ahogado'},
      INSUFFICIENT_MATERIAL: {en: 'Draw for insufficient material', es: 'Tablas por material insuficiente'},
      WRONG_MOVE: {en: 'Wrong move', es: 'Movimiento incorrecto'},
      ERROR_LOAD_FEN: {en: "Could not load position", es: "No se pudo cargar la posición"},
      ERROR_PREV_POS: {en: "Attempt to move from a non last position", es: "Intento de mover desde una posición que no es la última"},
      ERROR_MOVE_ARGS: {en: "Move called with wrong number of arguments", es: "Función 'move' invocada con número incorrecto de argumentos"},
      ERROR_MOVE_TURN: {en: "Attempt to move the wrong color", es: "Intento de mover el color equivocadd"},
      ERROR_CANT_PROCESS_SAN: {en: "Can't process standard algebraic notation (SAN) move without a move validator", es: "No se puede procesar movimiento en notación algebraica estandard (SAN) sin un validador de movimientos"},
      ERROR_WRONG_MOVE: {en: 'Wrong move', es: 'Movida errónea'}
    }
```

These are the messages that ChessBoard internally uses to provide feedback to its client page. As it shows, it's an array of objects, each one of them providing a string message in English and Spanish. It's up to the client page to choose the proper one according to its settings. Example of this can be seen in the message handliers implemented in ```index.js``` which provides for the home page at the demo site. It can be found under the ```pages``` directory of the source. It's strongly recommended to have a thorough look at it, as it shows almost all the features depicted here. 

---
```js
    static Figurines = {
      p: {codePoint: '0x265f',	html: '&#9823;'},
      n: {codePoint: '0x265e',	html: '&#9822;'},
      b: {codePoint: '0x265d',	html: '&#9821;'},
      r: {codePoint: '0x265c',	html: '&#9820;'},
      q: {codePoint: '0x265b',	html: '&#9819;'},
      k: {codePoint: '0x265a',	html: '&#9818;'},
      P: {codePoint: '0x2659',	html: '&#9817;'},
      N: {codePoint: '0x2658',	html: '&#9816;'},
      B: {codePoint: '0x2657',	html: '&#9815;'},
      R: {codePoint: '0x2656',	html: '&#9814;'},
      Q: {codePoint: '0x2655',	html: '&#9813;'},
      K: {codePoint: '0x2654',	html: '&#9812;'}
    }

```

Codes for figurines in ```utf8``` and ```html```. Reserved for future use.

---

> Work in progress. To be continued. 

---

## Technology

This project was bootstrapped with [Create Next App](https://github.com/segmentio/create-next-app).

Find the most recent version of this guide at [here](https://github.com/segmentio/create-next-app/blob/master/lib/templates/default/README.md). And check out [Next.js repo](https://github.com/zeit/next.js) for the most up-to-date info.

## Copyright

The present software is subject to the terms of the MIT license, as stated in the acompanying LICENSE file.

(c) 2017 Domingo E. Savoretti (esavoretti_at_gmail.com)

