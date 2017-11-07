import {Component} from 'react'

/* General functions */

const range = (b = 0, e = b + 8, r = []) => 
  b === e ? r : range(b < e ? b + 1 : b - 1, e, [...r, b])


const compose = (...fns) => (arg) => fns.reduce((a, f) => f(a), arg)

const partition = (arr, n = 8, r = []) => 
  arr.length > 0 ? partition(arr.slice(n), n, [...r, arr.slice(0, n)]) : r

/* End of general functions */

/*
const unflippedRows = [range(56), range(48), range(40), range(32), range(24), range(16), range(8), range()]
const flippedRows = [range(7, -1), range(15, 7), range(23, 15), range(31, 23), 
                     range(39, 31), range(47, 39), range(55, 47), range(63, 55)]

*/

const partPosition = (pos) => partition([...pos]).map(r => r.join('')).join('/')
const compressPosition = (pos) => partPosition(pos).replace(/0+/g, (m => m.length.toString()))
const expandPosition = (pos) => pos.replace(/\//g, '').replace(/[1-8]/g, (d) => range(0, parseInt(d)).map(i => '0').join(''))

const lightSqBgs = ['#dfdfdf', '#f5ca8f']
const darkSqBgs = ['#56b6e2', '#af9677']

const emptyPosition = range(0, 64).map(i =>'0').join('')
const defaultPosition = 'rnbqkbnrpppppppp00000000000000000000000000000000PPPPPPPPRNBQKBNR'
const sicilianPosition = 'rnbqkbnrpp0ppppp0000000000p000000000P00000000000PPPP0PPPRNBQKBNR'
                                       

const defaultSettings = {
  size: 400,
  flipped: false,
  chessSet: 'default',
  currentPosition: 0,
  positions: [defaultPosition],
  lightSqsBg: lightSqBgs[0],
  darkSqsBg: darkSqBgs[0],
  whoMoves: 'w',
  isCrowning: false
}

//

const row = sq => parseInt(sq / 8)
const col = sq => sq % 8
const difCol = (sq1, sq2) => Math.abs(col(sq1) - col(sq2))
const difRow = (sq1, sq2) => Math.abs(row(sq1) - row(sq2))
const isSameCol = (sq1, sq2) => difCol(sq1, sq2) === 0
const isSameRow = (sq1, sq2) => difRow(sq1, sq2) === 0
const isDiagonal = (sq1, sq2) => (sq1 != sq2) && (difRow(sq1, sq2) === difCol(sq1, sq2))
const isAntiDiagonal = (sq1, sq2) => isDiagonal(sq1, sq2) && (Math.abs(sq1 - sq2) % 7) === 0 
const isBlackSquare = (sq) => ((row(sq) % 2 === 0) && (col(sq) % 2 === 0)) || ((row(sq) % 2 === 1) && (col(sq) % 2 === 1))
const sq2san = (sq) => sq >= 0 && sq < 64 ? `${String.fromCharCode(97 + col(sq))}${row(sq) + 1}` : '-'
const san2sq = (san) => (san.charCodeAt(0) - 97) + (parseInt(san[1]) - 1) * 8
const figureColor = (figure) => figure ? figure === figure.toLowerCase() ? 'b' : 'w' : '-'

const letter2img = {p: 'p.png', P: 'pw.png', 
                     n: 'n.png', N: 'nw.png', 
                     b: 'b.png', B: 'bw.png', 
                     r: 'r.png', R: 'rw.png',
                     q: 'q.png', Q: 'qw.png',
                     k: 'k.png', K: 'kw.png'}


//

export default class ChessBoard extends Component {
    
    constructor(props) {
      super(props)
      this.state = {
        size: this.props.size || defaultSettings.size,
        flipped: this.props.flipped || defaultSettings.flipped,
        chessSet: this.props.chessSet || defaultSettings.chessSet,
        currentPosition: this.props.currentPosition || defaultSettings.currentPosition,
        positions: this.props.positions || defaultSettings.positions,
        lightSqsBg: this.props.lightSqsBg || defaultSettings.lightSqsBg,
        darkSqsBg: this.props.darkSqBgs || defaultSettings.darkSqsBg,
        whoMoves: this.props.whoMoves || defaultSettings.whoMoves,
        selectedSq: -1,
        isDragging: false,
        isCrowning: false,
      }
      this.sqFrom = -1
      this.figureFrom = ''
      this.moveValidator = props.moveValidator || null
    }

    goto = (n) => {
      let n1
      if (n >= this.state.positions.length) {n1 = this.state.positions.length - 1}
      else if (n < 0) {n1 = 0}
      else {n1 = n}
      this.setState({currentPosition: n1})
    }

    previous = () => this.goto(this.state.currentPosition - 1)
    next = () => this.goto(this.state.currentPosition + 1)
    last = () => this.goto(this.state.positions.length - 1)
    first = () => this.goto(0)

    empty = () => {
      this.setState({positions: [emptyPosition],
        currentPosition: 0, whoMoves: this.props.whoMoves || defaultSettings.whoMoves})
    }

    reset = () => {
      this.setState({positions: [defaultPosition],
                     currentPosition: 0, whoMoves: this.props.whoMoves || defaultSettings.whoMoves})
    }

    isFlipped = () => this.state.flipped

    componentDidMount() {
      //this.reset()
     //console.log("Mounted board!")
     window.board1 = this 
    }

    flip = () => {
      this.setState({flipped: !this.state.flipped})
    } 

    getCrowning = (sqFrom, sqTo, fig) => {
        /*
        let crowned
        while (!crowned) {
          crowned = prompt("Choose promotion(Q, R, N, B)", "Q")
        }
        if (fig === 'p') {
            return crowned.toLowerCase()
        }
        else {
            return crowned.toUpperCase()
        }
        */
        this.crowningInfo = {sqFrom: sqFrom,
                             sqTo: sqTo,
                             figureFrom: fig,
                             sqColor: isBlackSquare(sqTo ^ 56) ? 'b' : 'w',
                             figColor: figureColor(fig),
                             top: this.refs[sq2san(sqTo ^ 56)].offsetTop,
                             left: this.refs[sq2san(sqTo ^ 56)].offsetLeft,
                            }
        // console.log(`crowningInfo:\n${this.crowningInfo}`)
        this.setState({isCrowning: true})
    }

    move = (sqFrom, sqTo, figure, crowning) => {
      console.log(`move(sqFrom=${sq2san(sqFrom ^ 56)}, sqTo=${sq2san(sqTo ^ 56)}, figure=${figure}}`)
      /* if (this.state.isCrowning) {
        return
      } */
      if (this.state.currentPosition !== this.state.positions.length - 1) {return}
      if (this.state.whoMoves !== figureColor(figure)) {return}
      if (!crowning && ((figure === 'p' && row(sqTo ^ 56) === 0) || (figure === 'P' && row(sqTo ^ 56) === 7))) {
          this.getCrowning(sqFrom, sqTo, figure)
          return
      }
      if (!this.props.moveValidator) {
          if (crowning) {figure = crowning} 
          let newPos = [...this.state.positions[this.state.currentPosition]]
          newPos[sqFrom] = '0'
          newPos[sqTo] = figure
          if (figure === 'k' && sqFrom === 4 && sqTo === 2) {
              newPos[0] = '0'
              newPos[3] = 'r'
          }
          if (figure === 'k' && sqFrom === 4 && sqTo === 6) {
            newPos[7] = '0'
            newPos[5] = 'r'
        }
        if (figure === 'K' && sqFrom === 60 && sqTo === 58) {
            newPos[56] = '0'
            newPos[59] = 'R'
        }
        if (figure === 'K' && sqFrom === 60 && sqTo === 62) {
          newPos[63] = '0'
          newPos[61] = 'R'
      }
      const newCurrPos = this.state.positions.length
      this.setState({currentPosition: newCurrPos, positions: [...this.state.positions, newPos.join('')],
                     whoMoves: this.state.whoMoves === 'w' ? 'b' : 'w'})
      }
    }

    onSquareClick = (sq, figure, evt) => {
      evt.preventDefault()
      if (this.state.whoMoves !== figureColor(figure) && this.sqFrom === -1) {
        //this.sqFrom = -1
        //this.figureFrom = -1
        //this.setState({selectedSq: -1})
        return
      }
      if (this.sqFrom === -1) {
        if (figure === '0') {
          return
        }
        else {
          this.sqFrom = sq
          this.figureFrom = figure
          this.setState({selectedSq: sq, isDragging: false})
          console.log(`Selected square class name: ${this.refs[sq2san(sq ^ 56)].className}`)
        }
      }
      else {
        if (this.sqFrom === sq) {
          this.sqFrom = -1
          this.figureFrom = ''
          this.setState({selectedSq: -1})
        }
        else {
          this.move(this.sqFrom, sq, this.figureFrom)
          this.sqFrom = -1
          this.figureFrom = ''
          this.setState({selectedSq: -1})
        }
      }
    }

    onFigureDragStart = (sq, figure, evt) => {
      if (this.state.whoMoves !== figureColor(figure)) {
        this.sqFrom = -1
        this.figureFrom = ''
        this.setState({selectedSq: -1})
        return false
      }
      this.sqFrom = sq
      this.figureFrom = figure
      this.setState({selectedSq: sq, isDragging: true})
    }

    onFigureDragEnd = (evt) => {
        this.setState({isDragging: false})
    }

    onSquareDrop = (sq, evt) => {
      evt.preventDefault()
      //console.log(`onSquareDrop(sq=${sq}, san=${sq2san(sq ^ 56)})`)
      if (sq === this.sqFrom || this.state.whoMoves != figureColor(this.figureFrom)) {
          this.sqFrom = -1
          this.figureFrom = ''
          this.setState({selectedSq: -1})
          return
      }
      this.move(this.sqFrom, sq, this.figureFrom)
      this.sqFrom = -1
      this.figureFrom = ''
      this.setState({selectedSq: -1})
    }

    render() {
      // console.log(`Rendering board (size ${this.state.size} pixels) id=${this.props.id || "No Id"}`)
      // console.log(`Selected square = ${sq2san(this.state.selectedSq ^ 56)}`)
      let chosenRows = this.state.flipped ? 
                         range(7, -1).map(n => range(n * 8 + 7, n * 8 - 1 )) : 
                         range().map(n => range(n * 8, n * 8 + 8))
      let rows = chosenRows.map((row, nrow) => {
          let rowIndex = this.state.flipped ? nrow : 7 - nrow
          return (<div key={rowIndex} ref={`row_${rowIndex}`} style={{height: `${this.state.size / 8}px`, 
                                              width: `${this.state.size}px`,
                                              textAlign: 'center', 
                                              backgroundColor: '#3333333',
                                              opacity: this.state.isCrowning ? '0.5' : '1'}}>
              {row.map(
                (sq, index) => {
                  let san = sq2san(sq ^ 56)
                  let figure = this.state.positions[this.state.currentPosition][sq]
                  let content, imgsrc
                  if (figure === '0') {
                    content = ''
                  }
                  else {
                    imgsrc = `/static/img/sets/${this.state.chessSet}/${letter2img[figure]}`
                    content = (
                        <img
                          src={imgsrc}
                          draggable={figureColor(figure) === this.state.whoMoves ? true : false}
                          figure={figure}
                          color={figureColor(figure)}
                          style={{
                            width: "100%",
                            height: "100%",
                            cursor: figureColor(figure) === this.state.whoMoves ? "pointer" : "not-allowed",
                            opacity: this.state.isDragging && this.state.selectedSq === sq ? "0" : "1",
                          }}
                          onDragStart={evt => this.onFigureDragStart(sq, figure, evt)}
                          onDragEnd={ev => this.onFigureDragEnd(ev)}
                        /> 
                    )
                  }
                  return (
                    <div key={sq}
                         onClick={(evt) => this.onSquareClick(sq, figure, evt)}
                         onDragOver={(evt) => {evt.preventDefault()}}
                         onDrop={(evt) => this.onSquareDrop(sq, evt)} 
                         className={sq === this.state.selectedSq ? 'selectedSq' : 'unselectedSq'}
                         style={{display: 'inline-block', 
                                 width: `${this.state.size / 8}px`,
                                 height: `${this.state.size / 8}px`,
                                 backgroundColor: sq === this.state.selectedSq ? 'lightgreen' :
                                                  isBlackSquare(sq ^ 56) ? this.state.darkSqsBg : this.state.lightSqsBg}}
                         ref={san}
                         tooltip={san}
                         color={isBlackSquare(sq ^ 56) ? 'b' : 'w'}
                    >
                      {content}  
                    </div>
                  )
                }    
              )}
            </div>)
        }
      )

      return (
        <div 
          style={{
            width: `${this.state.size}px`,
            height: `${this.state.size}px`,
            border: 'solid 1px navy',
            backgroundColor: '#333333',
            opacity: this.state.isCrowning ? '0.8' : '1'
          }}
        > 
          {rows}
          <div ref="crowningPanel"
               style={{width: this.state.size / 2,
                       height: this.state.size / 8, 
                       color: 'white',
                       display: this.state.isCrowning ? 'block' : 'none',
                       position: 'fixed',
                       left: this.crowningInfo ? this.crowningInfo.left : 0,
                       top:  this.crowningInfo ? this.crowningInfo.top : 0,
                       zIndex: '100'
                       }}
          >
            {['q', 'n', 'r', 'b'].map((f) => this.crowningInfo ? (this.crowningInfo.figColor === 'w' ? f.toUpperCase() : f) : f)
                                .map((figure, i) => {
                let wh = this.state.size / 8
                let ref = `crowning_${figure}`
                return (
                  <div style={{
                    display: 'inline-block',
                    width: wh,
                    height: wh,
                    backgroundColor: this.crowningInfo ? 
                                      (this.crowningInfo.sqColor === 'b' ?  this.state.darkSqsBg : this.state.lightSqsBg) : 
                                      this.state.darkSqsBg
                    }}
                    onClick={e => {
                      let {sqFrom, sqTo, figureFrom} = this.crowningInfo
                      this.setState({isCrowning: false})
                      console.log(`figureFrom: ${figureFrom} - figure: ${figure}`)
                      this.move(sqFrom, sqTo, figureFrom, figure)
                    }}

                    ref={ref}
                    key={i}
                  >
                    <img
                      src={`/static/img/sets/${this.state.chessSet}/${ letter2img[figure] }`}
                      style={{
                        width: '100%',
                        height: '100%',
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                )
              }

            )}
          </div>
        </div>
      )
    }
}