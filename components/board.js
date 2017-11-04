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
  darkSqsBg: darkSqBgs[0]
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
const sq2pgn = (sq) => `${String.fromCharCode(97 + col(sq))}${row(sq) + 1}`

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
        darkSqsBg: this.props.darkSqBgs || defaultSettings.darkSqsBg
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
     console.log("Mounted board!") 
    }

    flip = () => {
      this.setState({flipped: !this.state.flipped})
    } 

    move = (sqFrom, sqTo, figure) => {
      console.log(`move(sqFrom=${sq2pgn(sqFrom ^ 56)}, sqTo=${sq2pgn(sqTo ^ 56)}, figure=${figure}}`)
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
          this.setState({currentPosition: this.state.currentPosition + 1})
      }
    }

    onClick = (sq, sqIndex, figure, evt) => {
      evt.preventDefault()
      if (this.sqFrom === -1) {
        if (figure === '0') {
          return
        }
        else {
          this.sqFrom = sqIndex
          this.figureFrom = figure
        }
      }
      else {
        if (this.sqFrom === sqIndex) {
          this.sqFrom = -1
          this.figureFrom = ''
        }
        else {
          this.move(this.sqFrom, sqIndex, this.figureFrom)
          this.sqFrom = -1
          this.figureFrom = ''
        }
      }
    }

    onDragStart = (sq, sqIndex, figure, evt) => {
      console.log(`Drag started at sq ${sq2pgn(sq)} with figure ${figure}`)
      this.sqFrom = sqIndex
      this.figureFrom = figure
    }

    onDrop = (sq, sqIndex, evt) => {
      evt.preventDefault()
      console.log(`onDrop(sq=${sq}, sqIndex=${sqIndex})`)
      if (sqIndex === this.sqFrom) {
          this.sqFrom = -1
          this.figureFrom = ''
          return
      }
      this.move(this.sqFrom, sqIndex, this.figureFrom)
      this.sqFrom = -1
      this.figureFrom = ''
    }

    render() {
      // console.log(`Rendering board (size ${this.state.size} pixels) id=${this.props.id || "No Id"}`)
      let chosenRows = this.state.flipped ? flippedRows : unflippedRows
      let rows = chosenRows.map((row, nrow) => {
          let rowIndex = this.state.flipped ? nrow : 7 - nrow
          return (<div key={rowIndex} style={{height: `${this.state.size / 8}px`, 
                                              width: `${this.state.size}px`,
                                              textAlign: 'center'}}>
              {row.map(
                (sqIndex, index) => {
                  let dataIndex = (nrow * 8 + index) ^ (this.state.flipped ? 63 : 0)
                  let figure = this.state.positions[this.state.currentPosition][dataIndex]
                  let content, imgsrc
                  if (figure === '0') {
                    content = ''
                  }
                  else {
                    imgsrc = `/static/img/sets/${this.state.chessSet}/${letter2img[figure]}`
                    content = (
                        <img
                          src={imgsrc}
                          style={{
                            width: "100%",
                            height: "100%",
                            cursor: "pointer"
                          }}
                          onDragStart={evt => this.onDragStart(sqIndex, dataIndex, figure, evt)}
                          onDragEnd={f => f}
                        /> 
                    )
                  }
                  return (
                    <div key={sqIndex}
                         onClick={(evt) => this.onClick(sqIndex, dataIndex, figure, evt)}
                         onDragOver={(evt) => {evt.preventDefault()}}
                         onDrop={(evt) => this.onDrop(sqIndex, dataIndex, evt)} 
                         style={{display: 'inline-block', 
                                 border: 'none',
                                 width: `${this.state.size / 8}px`,
                                 height: `${this.state.size / 8}px`,
                                 backgroundColor: isBlackSquare(sqIndex) ? this.state.darkSqsBg : this.state.lightSqsBg}}
                         datasquare={sqIndex}
                         datapgn={sq2pgn(sqIndex)}
                         dataindex={dataIndex}
                         title={`sqI: ${sqIndex} I: ${dataIndex} Sq: ${sq2pgn(sqIndex)}`}  
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
            border: 'solid 1px black'
          }}
        >
          {rows}
            <style jsx>{`
            
            `}
            </style>
        </div>
      )
    }
}