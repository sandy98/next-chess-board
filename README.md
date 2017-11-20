# React Chess Board v0.3.6

Yet another Javascript chessboard.

Intended to be used as a pluggable component in projects constructed using [React.js](https://reactjs.org/)
 and involving chess games.


## Install

Download
```sh
   git clone https://github.com/sandy98/next-chess-board
```
or
```sh
   git clone github.com/sandy98/next-chess-board.git
```
then install dependencies
```sh
   cd next-chess-board
   yarn
```
or
```sh
   cd next-chess-board
   npm install
```
then test
```sh
   yarn dev
```
or
```sh
   npm run dev
```

If everything works ok, now you are able to use it.

The main component lives in `components/board.js`

You can take this file and put it wherever you see fit in your react.js project, then, for instance in your `index.js`:

```js  
    import ChessBoard from 'whereyouputit/board'
    
    export default () => (
      <div>
        <Chessboard />
      </div>
    )
```

## Usage

Fine tuning of the component.
Yet to be written.

There are a lot of details worth mentioning, so this is a work in progress.

## Technology

This project was bootstrapped with [Create Next App](https://github.com/segmentio/create-next-app).

Find the most recent version of this guide at [here](https://github.com/segmentio/create-next-app/blob/master/lib/templates/default/README.md). And check out [Next.js repo](https://github.com/zeit/next.js) for the most up-to-date info.

## Copyright

The present software is subject to the terms of the MIT license, as stated in the acompanying LICENSE file.

(c) 2017 Domingo E. Savoretti (esavoretti_at_gmail.com)

