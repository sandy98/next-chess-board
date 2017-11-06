import {Component} from 'react'

const range = (b = 0, e = b + 8, r = []) => {
  if (b === e)
    return r
  r.push(b)
  return range(b < e ? b + 1 : b - 1, e, r)
}

const unflippedRows = [range(56), range(48), range(40), range(32), range(24), range(16), range(8), range()]
const flippedRows = [range(7, -1), range(15, 7), range(23, 15), range(31, 23), 
                     range(39, 31), range(47, 39), range(55, 47), range(63, 55)]


const lightSqBgs = ['#dfdfdf', '#f5ca8f']
const darkSqBgs = ['#56b6e2', '#af9677']

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
const figureColor = (figure) => figure === figure.toLowerCase() ? 'b' : 'w'

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

    reset = () => {
      this.setState({positions: this.state.positions.splice(0, 1),
                     currentPosition: this.props.currentPosition || defaultSettings.currentPosition})
    }

    componentDidMount() {
      //this.reset()
     //console.log("Mounted board!")
     window.board1 = this 
    }

    flip = () => {
      this.setState({flipped: !this.state.flipped})
    } 

    getCrowning = (fig) => {
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
    }

    move = async (sqFrom, sqTo, figure, crowning) => {
      console.log(`move(sqFrom=${sq2san(sqFrom ^ 56)}, sqTo=${sq2san(sqTo ^ 56)}, figure=${figure}}`)
      if (crowning) {
        figure = crowning
      }
      else if ((figure === 'p' && row(sqTo ^ 56) === 0) || (figure === 'P' && row(sqTo ^ 56) === 7)) {
          figure = await this.getCrowning(figure)
      }
      if (!this.moveValidator) {
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
      this.state.positions.push(newPos.join(''))
          this.setState({currentPosition: this.state.positions.length - 1})
      }
    }

    onClick = (sq, figure, evt) => {
      evt.preventDefault()
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

    onDragStart = (sq, figure, evt) => {
      //console.log(`Drag started at sq ${sq2san(sq ^ 56)} with figure ${figure}`)
      //let img = evt.target.cloneNode(true)
      //let offset = this.state.size / 16
      //img.src = evt.target.getAttribute("src")
      //img.width = `${offset * 2}px`
      //img.height = `${offset * 2}px`
      //evt.dataTransfer.setDragImage(img, offset, offset)
      //evt.target.style.opacity = '1.0'
      this.sqFrom = sq
      this.figureFrom = figure
      this.setState({selectedSq: sq, isDragging: true})
    }

    onDragEnd = (evt) => {
        this.setState({isDragging: false})
    }

    onDrop = (sq, evt) => {
      evt.preventDefault()
      console.log(`onDrop(sq=${sq}, san=${sq2san(sq ^ 56)})`)
      if (sq === this.sqFrom) {
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
      console.log(`Selected square = ${sq2san(this.state.selectedSq ^ 56)}`)
      let chosenRows = this.state.flipped ? 
                         range(7, -1).map(n => range(n * 8 + 7, n * 8 - 1 )) : 
                         range().map(n => range(n * 8, n * 8 + 8))
      let rows = chosenRows.map((row, nrow) => {
          let rowIndex = this.state.flipped ? nrow : 7 - nrow
          return (<div key={rowIndex} ref={`row_${rowIndex}`} style={{height: `${this.state.size / 8}px`, 
                                              width: `${this.state.size}px`,
                                              textAlign: 'center', 
                                              backgroundColor: '#3333333',
                                              visibility: this.state.isCrowning ? 'hidden' : 'visible'}}>
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
                          figure={figure}
                          color={figureColor(figure)}
                          style={{
                            width: "100%",
                            height: "100%",
                            cursor: "pointer",
                            opacity: this.state.isDragging && this.state.selectedSq === sq ? "0" : "1",
                          }}
                          onDragStart={evt => this.onDragStart(sq, figure, evt)}
                          onDragEnd={ev => this.onDragEnd(ev)}
                        /> 
                    )
                  }
                  return (
                    <div key={sq}
                         onClick={(evt) => this.onClick(sq, figure, evt)}
                         onDragOver={(evt) => {evt.preventDefault()}}
                         onDrop={(evt) => this.onDrop(sq, evt)} 
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
          <style global jsx>{`
            .selectedSq {
              background: lightcoral;    
            }
          `}</style>
          {rows}
        </div>
      )
    }
}