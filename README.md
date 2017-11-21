# React Chess Board v0.3.9
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
## Usage
>Fine tuning of the component.
>Yet to be written.

---

## Technology

This project was bootstrapped with [Create Next App](https://github.com/segmentio/create-next-app).

Find the most recent version of this guide at [here](https://github.com/segmentio/create-next-app/blob/master/lib/templates/default/README.md). And check out [Next.js repo](https://github.com/zeit/next.js) for the most up-to-date info.

## Copyright

The present software is subject to the terms of the MIT license, as stated in the acompanying LICENSE file.

(c) 2017 Domingo E. Savoretti (esavoretti_at_gmail.com)

