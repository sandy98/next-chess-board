import {v4} from 'uuid'
import {Component} from 'react'
import Chess from 'chess.js'
import chess_sets from './chess-sets'

const steimberg = 155978933

export default class ChessBoard extends Component {
    
    static version = '0.4.5'

    static Modes = {
      MODE_SETUP: 'MODE_SETUP',
      MODE_ANALYSIS: 'MODE_ANALYSIS',
      MODE_VIEW: 'MODE_VIEW',
      MODE_PLAY: 'MODE_PLAY'
    }

    /* General functions */

    static range = (b = 0, e = b + 8, r = []) => 
    b === e ? r : ChessBoard.range(b < e ? b + 1 : b - 1, e, [...r, b])

    static compose = (...fns) => (arg) => fns.reduce((a, f) => f(a), arg)

    static partition = (arr, n = 8, r = []) => 
      arr.length > 0 ? ChessBoard.partition(arr.slice(n), n, [...r, arr.slice(0, n)]) : r

    /* End of general functions */

    /*
    const unflippedRows = [ChessBoard.range(56), ChessBoard.range(48), ChessBoard.range(40), ChessBoard.range(32), ChessBoard.range(24), ChessBoard.range(16), ChessBoard.range(8), ChessBoard.range()]
    const flippedRows = [ChessBoard.range(7, -1), ChessBoard.range(15, 7), ChessBoard.range(23, 15), ChessBoard.range(31, 23), 
                        ChessBoard.range(39, 31), ChessBoard.range(47, 39), ChessBoard.range(55, 47), ChessBoard.range(63, 55)]
    */    

    static partPosition = (pos) => ChessBoard.partition([...pos]).map(r => r.join('')).join('/')
    static compressPosition = (pos) => ChessBoard.partPosition(pos).replace(/0+/g, (m => m.length.toString()))
    static expandPosition = (pos) => pos.replace(/\//g, '').replace(/[1-8]/g, (d) => ChessBoard.range(0, parseInt(d)).map(i => '0').join(''))
    
    static sqBgLabels = ['Blue', 'Brown', 'Acqua', 'Maroon']
    static lightSqBgs = ['#add8e6', '#f0d9b5', '#dfdfdf', '#FFF2D7']
    static darkSqBgs = ['#6495ed', '#b58863', '#56b6e2', "#B2535B"]
    static selectedSqBg = '#bfd'

    static emptyPosition = ChessBoard.range(0, 64).map(i =>'0').join('')
    static defaultPosition = 'rnbqkbnrpppppppp00000000000000000000000000000000PPPPPPPPRNBQKBNR'
    static sicilianPosition = 'rnbqkbnrpp0ppppp0000000000p000000000P00000000000PPPP0PPPRNBQKBNR'
      
    static emptyFen = '8/8/8/8/8/8/8/8 w KQkq - 0 1'
    static defaultFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    static sicilianFen = 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1'
    
    static pgnTagLineRE = /^\s*\[\s*(.+?)\s+"(.+?)"\s*\]\s*$/
    static sanRE = /(?:(^0-0-0|^O-O-O)|(^0-0|^O-O)|(?:^([a-h])(?:([1-8])|(?:x([a-h][1-8])))(?:=?([NBRQ]))?)|(?:^([NBRQK])([a-h])?([1-8])?(x)?([a-h][1-8])))(?:(\+)|(#)|(\+\+))?$/
    
    static defaultSettings = {
      size: 400,
      flipped: false,
      chessSet: 'default',
      currentPosition: 0,
      positions: [ChessBoard.defaultFen],
      lightSqsBg: ChessBoard.lightSqBgs[0],
      darkSqsBg: ChessBoard.darkSqBgs[0],
      selectedSqBg: ChessBoard.selectedSqBg,
      movements:  [],
      isCrowning: false,
      showNotation: true,
      whitePlayer: 'White Player',
      blackPlayer: 'Black Player',
      lang: 'en',
      mode: ChessBoard.Modes.MODE_ANALYSIS,
      hideNotation: false
    }
    

    static row = sq => parseInt(sq / 8)
    static col = sq => sq % 8
    static difCol = (sq1, sq2) => Math.abs(ChessBoard.col(sq1) - ChessBoard.col(sq2))
    static difRow = (sq1, sq2) => Math.abs(ChessBoard.row(sq1) - ChessBoard.row(sq2))
    static isSameCol = (sq1, sq2) => ChessBoard.difCol(sq1, sq2) === 0
    static isSameRow = (sq1, sq2) => ChessBoard.difRow(sq1, sq2) === 0
    static isDiagonal = (sq1, sq2) => (sq1 != sq2) && (ChessBoard.difRow(sq1, sq2) === ChessBoard.difCol(sq1, sq2))
    static isAntiDiagonal = (sq1, sq2) => ChessBoard.isDiagonal(sq1, sq2) && (Math.abs(sq1 - sq2) % 7) === 0 
    static isBlackSquare = (sq) => ((ChessBoard.row(sq) % 2 === 0) && (ChessBoard.col(sq) % 2 === 0)) || ((ChessBoard.row(sq) % 2 === 1) && (ChessBoard.col(sq) % 2 === 1))
    static sq2san = (sq) => sq >= 0 && sq < 64 ? `${String.fromCharCode(97 + ChessBoard.col(sq))}${ChessBoard.row(sq) + 1}` : '-'
    static san2sq = (san) => (san.charCodeAt(0) - 97) + (parseInt(san[1]) - 1) * 8
    static figureColor = (figure) => figure ? figure === figure.toLowerCase() ? 'b' : 'w' : '-'
    static date2pgn = (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    
    static letter2img = {p: 'p.png', P: 'pw.png', 
                         n: 'n.png', N: 'nw.png', 
                         b: 'b.png', B: 'bw.png', 
                         r: 'r.png', R: 'rw.png',
                         q: 'q.png', Q: 'qw.png',
                         k: 'k.png', K: 'kw.png'}
    

                         static chessSets = {
      alt1: chess_sets.alt1,
      default: chess_sets.default,
      eyes: chess_sets.eyes,
      fantasy: chess_sets.fantasy,
      modern: chess_sets.modern,
      spatial: chess_sets.spatial,
      veronika: chess_sets.veronika 
    }  
    
    static Events = {
      CHECK_MATE: "CHECK_MATE",
      CHECK: "CHECK",
      DRAW: "DRAW",
      STALE_MATE: "STALE_MATE",
      INSUFFICIENT_MATERIAL: "INSUFFICIENT_MATERIAL",
      MOVE: "MOVE",
      ERROR: "ERROR",
      CHANGE: "CHANGE",
      FLIP: "FLIP"
    }
    
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

    static getAvailSqColors = () => {return {light: ChessBoard.lightSqBgs, dark: ChessBoard.darkSqBgs, labels: ChessBoard.sqBgLabels}}
    

    drawDiagram = (context, ctxSize = this.state.size) => {
      let x, y, xx, yy, img
      let arr = this.figuresCurrent()
      let sqSize = ctxSize / 8

      for (y = 0; y < 4; y++) {
        for (x = 0; x < 4; x++) {
          xx = x * (sqSize * 2)
          yy = y * (sqSize * 2)
          context.fillStyle = this.state.lightSqsBg
          context.fillRect(xx, yy, xx + sqSize, yy + sqSize)

          xx = x * (sqSize * 2) + sqSize
          context.fillStyle = this.state.darkSqsBg
          context.fillRect(xx, yy, xx + sqSize, yy + sqSize)
        }

        for (x = 0; x < 4; x++) {
          xx = x * (sqSize * 2)
          yy = y * (sqSize * 2) + sqSize
          context.fillStyle = this.state.darkSqsBg
          context.fillRect(xx, yy, xx + sqSize, yy + sqSize)

          xx = x * (sqSize * 2) + sqSize
          context.fillStyle = this.state.lightSqsBg
          context.fillRect(xx, yy, xx + sqSize, yy + sqSize)
        }
      }

      // console.log(arr)

      for (let i = 0; i < 64; i++) {
        if (arr[i] !== '0') {
          img = new Image()
          img.src = ChessBoard.chessSets[this.state.chessSet][arr[i]]
          let ci = this.state.flipped ? i ^ 63  ^ 56 : i ^ 56
          yy = ChessBoard.row(ci ^ 56) * sqSize
          xx = ChessBoard.col(ci ^ 56) * sqSize
          context.drawImage(img, xx, yy, sqSize, sqSize)
        }
      }

      return "Done"
    }

    on = (evt, cb) => {
      let uuid = v4()
      this.subscribers = [...this.subscribers, {id: uuid, event: evt, callback: cb}]
      return () => this.subscribers = this.subscribers.filter((subscriber) => subscriber.id !== uuid) 
    }

    emit = (evt, ...data) =>  this.subscribers.filter((subscriber) => subscriber.event === evt).forEach(
      (subscriber) => subscriber.callback(...data)  
    )
        
    constructor(props) {
      super(props)
      this.subscribers = []
      this.state = {
        mode: this.props.mode || ChessBoard.defaultSettings.mode,
        size: this.props.size || ChessBoard.defaultSettings.size,
        flipped: this.props.flipped || ChessBoard.defaultSettings.flipped,
        chessSet: this.props.chessSet || ChessBoard.defaultSettings.chessSet,
        currentPosition: this.props.currentPosition || ChessBoard.defaultSettings.currentPosition,
        positions: this.props.positions || ChessBoard.defaultSettings.positions,
        movements: this.props.movements || ChessBoard.defaultSettings.movements,
        lightSqsBg: this.props.lightSqsBg || ChessBoard.defaultSettings.lightSqsBg,
        darkSqsBg: this.props.darkSqsBg || ChessBoard.defaultSettings.darkSqsBg,
        selectedSqBg: this.props.selectedSqBg || ChessBoard.defaultSettings.selectedSqBg,
        showNotation: this.props.showNotation || ChessBoard.defaultSettings.showNotation,
        whitePlayer: this.props.whitePlayer || ChessBoard.defaultSettings.whitePlayer,
        blackPlayer: this.props.blackPlayer || ChessBoard.defaultSettings.blackPlayer,
        hideNotation: this.props.hideNotation || ChessBoard.defaultSettings.hideNotation,
        gameDate: ChessBoard.date2pgn(new Date()),
        selectedSq: -1,
        isDragging: false,
        isCrowning: false,
      }
      this.sqFrom = -1
      this.figureFrom = ''
      this.moveValidator = props.moveValidator || null
    }

    doScroll = () => this.refs.notation.scrollTop = this.refs.notation.scrollHeight

    useSet = (set) => this.setState({chessSet: set})

    useSquares = (n) => this.setState({lightSqsBg: ChessBoard.lightSqBgs[n], darkSqsBg: ChessBoard.darkSqBgs[n]})


    goto = (n) => {
      let n1
      if (n >= this.state.positions.length) {n1 = this.state.positions.length - 1}
      else if (n < 0) {n1 = 0}
      else {n1 = n}
      this.setState({currentPosition: n1})
      this.emit(ChessBoard.Events.CHANGE, n1) 
    }

    previous = () => this.goto(this.state.currentPosition - 1)
    next = () => this.goto(this.state.currentPosition + 1)
    last = () => this.goto(this.state.positions.length - 1)
    first = () => this.goto(0)

    empty = () => {
      if (this.props.moveValidator) {
        this.game.load(ChessBoard.emptyFen)
      }
      this.setState({positions: [ChessBoard.emptyFen],
        currentPosition: 0, movements: []})
    }

    resetBaseHeaders = () => {
      this.setState({whitePlayer: this.props.whitePlayer || ChessBoard.defaultSettings.whitePlayer,
                     blackPlayer: this.props.blackPlayer || ChessBoard.defaultSettings.blackPlayer,
                    gameDate: ChessBoard.date2pgn(new Date())})
    }

    setBaseHeaders = () => {
      if (!this.props.moveValidator) return
      this.game.header('White', this.state.whitePlayer, 
                       'Black', this.state.blackPlayer,
                       'Date', this.state.gameDate)
    }

    reset = () => {
      this.resetBaseHeaders()
      if (this.props.moveValidator) {
        this.game.reset()
        this.setBaseHeaders()
      } 
      this.setState({positions: [ChessBoard.defaultFen],
                     currentPosition: 0, movements: []})
      this.emit(ChessBoard.Events.CHANGE, 0)
      return true
    }

    loadFen = (fen) => {
      let result = true
      if (this.props.moveValidator) {
        result = this.game.load(fen)
      }
      if (result) {
        this.setState({positions: [fen], currentPosition: 0, movements: []})
        this.resetBaseHeaders()
        this.setBaseHeaders()
        this.emit(ChessBoard.Events.CHANGE, 0)
      }
      else {
        this.emit(ChessBoard.Events.ERROR, ChessBoard.Messages.ERROR_LOAD_FEN, '')
      }
        
      return result
    }

    loadPgn = (pgn) => {
      if (!this.props.moveValidator) return false
      let isGood = this.game.load_pgn(pgn)
      if (isGood) {
        let gameData = this.game.header()
        this.setState({positions: this.game.fens(), 
                       currentPosition: 0, 
                       movements: this.game.history(),
                       whitePlayer: gameData.White,
                       blackPlayer: gameData.Black,
                       gameDate: gameData.Date,
                       gameResult: gameData.Result})
        this.emit(ChessBoard.Events.CHANGE, 0)  
      }
      return isGood
    }

    takeback = () => {
      if (this.state.positions.length === 1) return false
      if (this.props.moveValidator) this.game.undo()
      let posics = this.props.moveValidator ?
                     this.game.fens() : 
                     this.state.positions.slice(0, this.state.positions.length - 1)
      this.setState({positions: posics, 
                     currentPosition: posics.length - 1,
                     movements: this.props.moveValidator ? 
                                  this.game.history() : 
                                  this.state.movements.slice(0, this.state.movements.length - 1)
                    })
      this.emit(ChessBoard.Events.CHANGE, posics.length - 1)
      return true
    }

    san2fig = (san) => {
      let csan = san.replace(/[NBRQK]/, (f) => this.game.turn() == 'w' ? f.toLowerCase() : f)
      return csan.replace(/[NBRQKnbrqk]/, (l) => ChessBoard.Figurines[l].html)
    }

    isFlipped = () => this.state.flipped

    paramFromPosition = (npos, nparam) => this.state.positions[npos].split(/\s+/)[nparam]

    figuresFromPosition = (npos) => ChessBoard.expandPosition(this.state.positions[npos].split(/\s+/)[0])
    whoMovesFromPosition = (npos) => this.state.positions[npos].split(/\s+/)[1]
    castlingFromPosition = (npos) => this.state.positions[npos].split(/\s+/)[2]
    enPassantFromPosition = (npos) => this.state.positions[npos].split(/\s+/)[3]
    halfMoveClockFromPosition = (npos) => parseInt(this.state.positions[npos].split(/\s+/)[4])
    moveNumberFromPosition = (npos) => parseInt(this.state.positions[npos].split(/\s+/)[5])
    
    figuresCurrent = () => this.figuresFromPosition(this.state.positions.length - 1)
    whoMovesCurrent = () => this.whoMovesFromPosition(this.state.positions.length - 1)
    castlingCurrent = () => this.castlingFromPosition(this.state.positions.length - 1)
    enPassantCurrent = () => this.enPassantFromPosition(this.state.positions.length - 1)
    halfMoveClockCurrent = () => this.halfMoveClockFromPosition(this.state.positions.length - 1)
    moveNumberCurrent = () => this.moveNumberFromPosition(this.state.positions.length - 1)
    
    setPlayer = (color, player) => {
      if (color === 'w') {
        this.setState({whitePlayer: player})
      }
      else {
        this.setState({blackPlayer: player})
      }
      this.setBaseHeaders()
    }

    setDate = (date) => {
      this.setState({gameDate: ChessBoard.date2pgn(date)})
      this.setBaseHeaders()
    }

    setSize = (newSize) => {
      this.setState({size: newSize})
    }
    
    componentDidMount() {
     //Waring! Delete next line in production!!!
     window.board1 = this
      if (this.props.moveValidator) {
      this.game = new Chess(this.state.positions[0])
      this.setBaseHeaders()
      }
    }

    flip = () => {
      let newFlipped = !this.state.flipped
      this.setState({flipped: newFlipped})
      this.emit(ChessBoard.Events.FLIP, newFlipped)
    } 

    setHeader = (k, v) => {
      if (!this.props.moveValidator) return
      this.game.header(k, v)
      let obj = {}
      obj[k] = v
      this.setState(obj)
    }

    getPgnText = () => {
      if (!this.props.moveValidator || !this.game) return ''
      let annotations = document.getElementsByClassName('annotation')
      let annotation = annotations ? annotations[0] : null
      let hei = annotation ? annotation.scrollHeight : 200
      //console.log("Scroll height: ", hei)
      if (annotations && annotations.forEach) {
        annotations.forEach((a) => a.scrollTop = hei)
      }
      if (annotation) annotation.scrollTop = hei
      let headers = this.game ? this.game.header() : {}
      let hkeys = []
      for (let k in headers) hkeys.push(k)
      let hheaders = hkeys.map((ky, i) => (<p style={{margin: '1pt'}} key={i}>[{ky} "{headers[ky]}"]</p>))
      let sans = this.game? this.game.history() : this.state.movements
      let decoSans = sans.map((san, ind) => (
        <span key={ind + 1} 
          style={{
            cursor: 'pointer',
            backgroundColor: (ind + 1) === this.state.currentPosition ? this.state.lightSqsBg : 'white' 
          }}
          title=""
          onClick={(e) => this.goto(ind + 1)}
        >
          {this.state.positions[ind] && (this.state.positions[ind].split(/\s+/)[1] === 'w')  ?
            `${this.state.positions[ind].split(/\s+/)[5]}. ` :
            ind === 0 ? `${this.state.positions[ind].split(/\s+/)[5]}. ... ` : ''}{san}&nbsp;
        </span>
      ))
      return (<div ref="annotation" className="annotation">
                {hheaders}
                <p style={{margin: '1pt'}}>
                  <span key={0}
                    style={{cursor: 'pointer', 
                            backgroundColor: 0 === this.state.currentPosition ? this.state.lightSqsBg : 'white'
                          }}
                    onClick={(e) => this.goto(0)}
                  >
                    &nbsp;&nbsp;&nbsp;
                  </span>
                  {decoSans}
                </p>
              </div>)
    }

    getCrowning = (sqFrom, sqTo, fig) => {
        this.crowningInfo = {sqFrom: sqFrom,
                             sqTo: sqTo,
                             figureFrom: fig,
                             sqColor: ChessBoard.isBlackSquare(sqTo ^ 56) ? 'b' : 'w',
                             figColor: ChessBoard.figureColor(fig),
                             top: this.refs[ChessBoard.sq2san(sqTo ^ 56)].offsetTop,
                             left: this.refs[ChessBoard.sq2san(sqTo ^ 56)].offsetLeft,
                            }
        this.setState({isCrowning: true})
    }

    move = (...args) => {
      if (this.state.currentPosition !== this.state.positions.length - 1)  {
        return this.emit(ChessBoard.Events.ERROR, ChessBoard.Messages.ERROR_PREV_POS, '')
      }
      let argsLen = args.length
      if (argsLen === 0 || argsLen === 2) {
        return this.emit(ChessBoard.Events.ERROR, ChessBoard.Messages.ERROR_MOVE_ARGS, argsLen)
      }
      let [sqFrom, sqTo, figure, crowning ] = args
      if (argsLen > 1 && this.whoMovesCurrent() !== ChessBoard.figureColor(figure))   {
        return this.emit(ChessBoard.Events.ERROR, ChessBoard.Messages.ERROR_MOVE_TURN, ChessBoard.figureColor(figure))
      }
      if (!crowning && ((figure === 'p' && ChessBoard.row(sqTo ^ 56) === 0) || (figure === 'P' && ChessBoard.row(sqTo ^ 56) === 7))) {
          this.getCrowning(sqFrom, sqTo, figure)
          return
      }
      if (argsLen === 1 && !this.props.moveValidator) {
        return this.emit(ChessBoard.Events.ERROR, ChessBoard.Messages.ERROR_CANT_PROCESS_SAN, '')
      }

      if (!this.props.moveValidator && argsLen > 1) {
          let oldFigure
          if (crowning) {[oldFigure, figure] = [figure, crowning]}
          else {oldFigure = figure} 
          let newPos = [...this.figuresCurrent()]
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

      const newComprPos = ChessBoard.compressPosition(newPos.join(''))

      const newWhoMoves = this.whoMovesCurrent() === 'w' ? 'b' : 'w'
      
      const oldCastling = this.castlingCurrent()
      let newCastling = oldCastling
      if (figure === 'K') newCastling = oldCastling.replace(/K/, '').replace(/Q/, '')
      if (figure === 'k') newCastling = oldCastling.replace(/k/, '').replace(/q/, '')
      if (figure === 'R' && (sqFrom ^ 56) === 0) newCastling = oldCastling.replace(/Q/, '')
      if (figure === 'R' && (sqFrom ^ 56) === 7) newCastling = oldCastling.replace(/K/, '')
      if (figure === 'r' && (sqFrom ^ 56) === 56) newCastling = oldCastling.replace(/q/, '')
      if (figure === 'r' && (sqFrom ^ 56) === 63) newCastling = oldCastling.replace(/k/, '')
      newCastling = newCastling.length === 0 ? '-' : newCastling
      
      let newEnPassant = '-'
      if ((figure === 'p' || figure === 'P') && Math.abs(sqTo - sqFrom) === 16) {
        let sumando = figure === 'P' ? 8 : -8
        newEnPassant = ChessBoard.sq2san((sqTo + sumando) ^ 56)
      }

      let newHalfMoveClock = this.halfMoveClockCurrent() + 1
      if (figure === 'p' || figure === 'P' || this.figuresCurrent()[sqTo] !== '0') newHalfMoveClock = 0

      let newMoveNumber = this.moveNumberCurrent()
      if (newWhoMoves === 'w') newMoveNumber++  

      this.setState({currentPosition: newCurrPos, 
           positions: [...this.state.positions, [newComprPos, newWhoMoves, newCastling, 
                       newEnPassant, newHalfMoveClock, newMoveNumber].join(' ')],
                      movements: [...this.state.movements, {sqFrom, sqTo, figure: oldFigure, crowning}]})
      this.emit(ChessBoard.Events.CHANGE, newCurrPos) 
      this.emit(ChessBoard.Events.MOVE, this.state.movements[this.state.movements.length -1])} 
      else {
        let params
        if (argsLen === 1) {
          params = args[0]
        }
        else {
          params = {from: ChessBoard.sq2san(sqFrom ^ 56), to: ChessBoard.sq2san(sqTo ^ 56)}
          params = crowning ? {...params, promotion: crowning.toLowerCase()} : params
        }
        let move = this.game.move(params)
        if (!move) {
          return this.emit(ChessBoard.Events.ERROR, ChessBoard.Messages.ERROR_WRONG_MOVE, '')
        }
        else {
          let newCurrentPos = this.game.fens().length -1
          let sans = this.game.history()
          let san = sans[sans.length - 1]
          let moveNumber = this.state.positions[this.state.positions.length -1].split(/\s+/)[5]
          let dots = this.game.turn() === 'b' ? '.' : '. ...'

          this.setState({currentPosition: newCurrentPos, 
                         positions: this.game.fens(),
                         movements: this.game.history()})

          this.emit(ChessBoard.Events.CHANGE, newCurrentPos)
          this.emit(ChessBoard.Events.MOVE, san) 

          if (this.game.in_check() && !this.game.in_checkmate()) {
              this.emit(ChessBoard.Events.CHECK, ChessBoard.Messages.CHECK , `${moveNumber}${dots} ${san}`)              
          }

          if (this.game.game_over()) {
            if (this.game.in_checkmate()) {
              let [result, dottedMoveNumber] = this.game.turn() === 'b' ? ['1-0', `${moveNumber}.`] : ['0-1', `${moveNumber}. ...`]
              this.game.header('Result', result)
              this.setState({gameResult: result})
              this.emit(ChessBoard.Events.CHECK_MATE, ChessBoard.Messages.CHECK_MATE, `${dottedMoveNumber}${san}`, result)
            }
            else if (this.game.in_draw()) {
              if (this.game.insufficient_material() || this.game.in_stalemate()) {
                this.game.header('Result', '1/2-1/2')
                this.setState({gameResult: '1/2-1/2'})
                if (this.game.in_stalemate()) {
                  this.emit(ChessBoard.Events.STALE_MATE, ChessBoard.Messages.STALE_MATE, `1/2-1/2`)
                }
                else {
                  this.emit(ChessBoard.Events.INSUFFICIENT_MATERIAL, ChessBoard.Messages.INSUFFICIENT_MATERIAL,`1/2-1/2`)
                }
              }
            }
          }
        }
      }
    }

    onSquareClick = (sq, figure, evt) => {
      evt.preventDefault()
      //if (this.whoMovesCurrent() !== ChessBoard.figureColor(figure) && this.sqFrom === -1) {
        //this.sqFrom = -1
        //this.figureFrom = -1
        //this.setState({selectedSq: -1})
      //  return
      //}

      if (this.sqFrom === -1) {
        if (figure === '0') {
          return
        }
        else {
          this.sqFrom = sq
          this.figureFrom = figure
          this.setState({selectedSq: sq, isDragging: false})
          //console.log(`Selected square class name: ${this.refs[ChessBoard.sq2san(sq ^ 56)].className}`)
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

      let size = this.state.size / 8
      let pos = size / 2
      let ctx = document.createElement("canvas").getContext("2d");
      ctx.canvas.width = size;
      ctx.canvas.height = size;
      let img = new Image()
      img.src = evt.target.src
      ctx.drawImage(img, 0, 0, size, size);
      evt.dataTransfer.setDragImage(ctx.canvas, pos, pos);

      this.sqFrom = sq
      this.figureFrom = figure
      console.log(this.sqFrom)
      this.setState({selectedSq: sq, isDragging: true})
    }

    onFigureDragEnd = (evt) => {
        let newFen
        //console.log("onFigureDragEnd")
        if (this.state.selectedSq !== -1 && this.state.mode === ChessBoard.Modes.MODE_SETUP) {
          newFen = this.putSquare(this.state.selectedSq, '0')
          this.setState({positions: [newFen], selectedSq: -1})
        }
        this.setState({isDragging: false})
    }

    onSquareDrop = (sq, evt) => {
      evt.preventDefault()
      //console.log(`onSquareDrop(sq=${sq}, san=${ChessBoard.sq2san(sq ^ 56)})`)
      if (sq === this.sqFrom || (this.state.mode !== ChessBoard.Modes.MODE_SETUP && this.whoMovesCurrent() != ChessBoard.figureColor(this.figureFrom))) {
          this.sqFrom = -1
          this.figureFrom = ''
          this.setState({selectedSq: -1})
          return
      }
      if (this.state.mode === ChessBoard.Modes.MODE_SETUP) {
          //console.log("onSquareDrop")
          let newFen = this.putSquare(sq, this.figureFrom)
          this.setState({positions: [newFen]})
          this.sqFrom = -1
          this.figureFrom = ''
          return
      }
      this.move(this.sqFrom, sq, this.figureFrom)
      this.sqFrom = -1
      this.figureFrom = ''
      this.setState({selectedSq: -1})
    }

    setup = () => this.setState({positions: [this.state.positions[this.state.currentPosition]], 
                                 currentPosition: 0, 
                                 mode: ChessBoard.Modes.MODE_SETUP})
    analyze = () => this.setState({mode: ChessBoard.Modes.MODE_ANALIZE})
    view = () => this.setState({mode: ChessBoard.Modes.MODE_VIEW})
    play = () => this.setState({mode: ChessBoard.Modes.MODE_PLAY})
    
    putSquare = (sq, figure) => {
      let [pos, turn, ep, castling, hmc, fmn] = this.state.positions[this.state.currentPosition].split(/\s+/)
      let epos = ChessBoard.expandPosition(pos).split('')
      epos[sq] = figure
      let newpos = ChessBoard.compressPosition(epos.join(''))
      return [newpos, turn, ep, castling, hmc, fmn].join(' ')
    }

    toggleNotation = () => this.setState({hideNotation: !this.state.hideNotation})

    render() {
      // console.log(`Rendering board (size ${this.state.size} pixels) id=${this.props.id || "No Id"}`)
      // console.log(`Selected square = ${ChessBoard.sq2san(this.state.selectedSq ^ 56)}`)
      let imgSize = ChessBoard.chessSets[this.state.chessSet].size
      let figures = ChessBoard.expandPosition(this.state.positions[this.state.currentPosition].split(/\s+/)[0])
      let chosenRows = this.state.flipped ? 
                         ChessBoard.range(7, -1).map(n => ChessBoard.range(n * 8 + 7, n * 8 - 1 )) : 
                         ChessBoard.range().map(n => ChessBoard.range(n * 8, n * 8 + 8))
      let rows = chosenRows.map((row, nrow) => {
          let rowIndex = this.state.flipped ? nrow : 7 - nrow
          return (<div key={rowIndex} ref={`row_${rowIndex}`} style={{height: `${this.state.size / 8}px`, 
                                              width: `${this.state.size}px`,
                                              textAlign: 'center', 
                                              backgroundColor: '#3333333',
                                              opacity: this.state.isCrowning ? '0.5' : '1'}}>
              {row.map(
                (sq, index) => {
                  let san = ChessBoard.sq2san(sq ^ 56)
                  let figure = figures[sq]
                  let content, imgsrc
                  if (figure === '0') {
                    content = ''
                  }
                  else {
                    //let imgsrc = `/static/img/sets/${this.state.chessSet}/${ChessBoard.letter2img[figure]}`
                    content = (
                        <img
                          src={ChessBoard.chessSets[this.state.chessSet][figure]}
                          draggable={ChessBoard.figureColor(figure) === this.whoMovesCurrent() ? true : true}
                          figure={figure}
                          color={ChessBoard.figureColor(figure)}
                          style={{
                            width: `${imgSize}%`,
                            height: `${imgSize}%`,
                            cursor: ChessBoard.figureColor(figure) === this.whoMovesCurrent() ? "pointer" : "not-allowed",
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
                                 verticalAlign: 'middle',
                                 textAlign: 'center',
                                 paddingTop: imgSize === 100 ? 0 : `${(100 - imgSize) / 10}%`,
                                 backgroundColor: sq === this.state.selectedSq ? this.state.selectedSqBg :
                                                  ChessBoard.isBlackSquare(sq ^ 56) ? this.state.darkSqsBg : this.state.lightSqsBg}}
                         ref={san}
                         tooltip={san}
                         color={ChessBoard.isBlackSquare(sq ^ 56) ? 'b' : 'w'}
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
        <div style={{display: 'inline-block'}} onDoubleClick={() => this.flip()}>
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
                        // console.log(`figureFrom: ${figureFrom} - figure: ${figure}`)
                        this.move(sqFrom, sqTo, figureFrom, figure)
                      }}

                      ref={ref}
                      key={i}
                    >
                      <img
                        src={ChessBoard.chessSets[this.state.chessSet][figure]}
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
          <div
            ref="notation"
            style={{
              display: this.state.hideNotation || 
                       !this.props.moveValidator || 
                       this.state.mode === ChessBoard.Modes.MODE_SETUP ? 'none' : 'inherit',
              border: 'solid 1px navy',
              borderTop: 'none',
              width: `${this.state.size}px`,
              height: `${parseInt(this.state.size / 4)}px`,
              overflow: 'auto',
              fontSize: '12pt'
              /* paddingLeft: '0.5em',
              paddingTop: '0.5em', */
            }}
          >
            {this.getPgnText()}
          </div>
          <div
            ref="setup_panel"
            style={{
              display: this.state.mode !== ChessBoard.Modes.MODE_SETUP ? 'none' : 'inherit',
              border: 'solid 1px navy',
              borderTop: 'none',
              width: `${this.state.size}px`,
              //height: `${parseInt(this.state.size / 3)}px`,
              height: `150px`,
              overflow: 'auto',
              fontSize: '12pt',
              backgroundColor: this.state.lightSqsBg
            }}
          >

            <div style={{paddingLeft: '10px', paddingTop: '0'}}>
                <div style={{display: 'inline-block', 
                            height: `50px`,
                            width:   `50px`,
                            border: 'solid 1 px'
                            }}
                    figure={'p'}
                >
                  <img
                    onDragStart={evt => this.onFigureDragStart(-1, 'p', evt)}
                    onDragEnd={ev => this.onFigureDragEnd(ev)}
                    src={ChessBoard.chessSets[this.state.chessSet]['p']} figure={'p'} draggable={true} 
                    width={'100%'} height={'100%'}
                  />
                </div>
                <div style={{display: 'inline-block', 
                            height: `50px`,
                            width:   `50px`,
                            border: 'solid 1 px'
                            }}
                    figure={'P'}
                >
                  <img 
                    onDragStart={evt => this.onFigureDragStart(-1, 'P', evt)}
                    onDragEnd={ev => this.onFigureDragEnd(ev)}
                    src={ChessBoard.chessSets[this.state.chessSet]['P']} figure={'P'} draggable={true} 
                    width={'100%'} height={'100%'}
                  />
                </div>
                <div style={{display: 'inline-block', 
                            height: `50px`,
                            width:   `50px`,
                            border: 'solid 1 px'
                            }}
                    figure={'n'}
                >
                  <img 
                    onDragStart={evt => this.onFigureDragStart(-1, 'n', evt)}
                    onDragEnd={ev => this.onFigureDragEnd(ev)}
                    src={ChessBoard.chessSets[this.state.chessSet]['n']} figure={'n'} draggable={true} 
                    width={'100%'} height={'100%'}
                  />
                </div>
                <div style={{display: 'inline-block', 
                            height: `50px`,
                            width:   `50px`,
                            border: 'solid 1 px'
                            }}
                    figure={'N'}
                >
                  <img 
                  onDragStart={evt => this.onFigureDragStart(-1, 'N', evt)}
                  onDragEnd={ev => this.onFigureDragEnd(ev)}
                  src={ChessBoard.chessSets[this.state.chessSet]['N']} figure={'N'} draggable={true} 
                  width={'100%'} height={'100%'}
                />
                </div>
                <div style={{display: 'inline-block', 
                            height: `50px`,
                            width:   `50px`,
                            border: 'solid 1 px'
                            }}
                    figure={'b'}
                >
                  <img 
                    onDragStart={evt => this.onFigureDragStart(-1, 'b', evt)}
                    onDragEnd={ev => this.onFigureDragEnd(ev)}
                    src={ChessBoard.chessSets[this.state.chessSet]['b']} figure={'b'} draggable={true} 
                    width={'100%'} height={'100%'}
                  />
                </div>
                <div style={{display: 'inline-block', 
                            height: `50px`,
                            width:   `50px`,
                            border: 'solid 1 px'
                            }}
                    figure={'B'}
                >
                  <img 
                    onDragStart={evt => this.onFigureDragStart(-1, 'B', evt)}
                    onDragEnd={ev => this.onFigureDragEnd(ev)}
                    src={ChessBoard.chessSets[this.state.chessSet]['B']} figure={'B'} draggable={true} 
                    width={'100%'} height={'100%'}
                  />
                </div>
                <div style={{display: 'inline-block', 
                            height: `50px`,
                            width:   `50px`,
                            border: 'solid 1 px',
                            marginLeft: '20px'
                            }}
                >
                  <button onClick={() => this.empty()}>Empty</button>
                </div>
                <div style={{display: 'inline-block', 
                            height: `50px`,
                            width:   `50px`,
                            border: 'solid 1 px',
                            marginLeft: '20px'
                            }}
                >
                  <button  onClick={() => this.reset()}>Initial</button>
                </div>
            </div>  

            <div style={{paddingLeft: '10px', paddingTop: '0'}}>
            <div style={{display: 'inline-block', 
                            height: `50px`,
                            width:   `50px`,
                            border: 'solid 1 px'
                            }}
                    figure={'r'}
                >
                  <img 
                    onDragStart={evt => this.onFigureDragStart(-1, 'r', evt)}
                    onDragEnd={ev => this.onFigureDragEnd(ev)}
                    src={ChessBoard.chessSets[this.state.chessSet]['r']} figure={'r'} draggable={true} 
                    width={'100%'} height={'100%'}
                  />
                </div>
                <div style={{display: 'inline-block', 
                            height: `50px`,
                            width:   `50px`,
                            border: 'solid 1 px'
                            }}
                    figure={'R'}
                >
                  <img 
                    onDragStart={evt => this.onFigureDragStart(-1, 'R', evt)}
                    onDragEnd={ev => this.onFigureDragEnd(ev)}
                    src={ChessBoard.chessSets[this.state.chessSet]['R']} figure={'R'} draggable={true} 
                    width={'100%'} height={'100%'}
                  />
                </div>
                <div style={{display: 'inline-block', 
                            height: `50px`,
                            width:   `50px`,
                            border: 'solid 1 px'
                            }}
                    figure={'q'}
                >
                  <img 
                    onDragStart={evt => this.onFigureDragStart(-1, 'q', evt)}
                    onDragEnd={ev => this.onFigureDragEnd(ev)}
                    src={ChessBoard.chessSets[this.state.chessSet]['q']} figure={'q'} draggable={true} 
                    width={'100%'} height={'100%'}
                  />
                </div>
                <div style={{display: 'inline-block', 
                            height: `50px`,
                            width:   `50px`,
                            border: 'solid 1 px'
                            }}
                    figure={'Q'}
                >
                  <img 
                    onDragStart={evt => this.onFigureDragStart(-1, 'Q', evt)}
                    onDragEnd={ev => this.onFigureDragEnd(ev)}
                    src={ChessBoard.chessSets[this.state.chessSet]['Q']} figure={'Q'} draggable={true} 
                    width={'100%'} height={'100%'}
                  />
                </div>
                <div style={{display: 'inline-block', 
                            height: `50px`,
                            width:   `50px`,
                            border: 'solid 1 px'
                            }}
                    figure={'k'}
                >
                  <img 
                    onDragStart={evt => this.onFigureDragStart(-1, 'k', evt)}
                    onDragEnd={ev => this.onFigureDragEnd(ev)}
                    src={ChessBoard.chessSets[this.state.chessSet]['k']} figure={'k'} draggable={true} 
                    width={'100%'} height={'100%'}
                  />
                </div>
                <div style={{display: 'inline-block', 
                            height: `${50}px`,
                            width:  `${50}px`,
                            border: 'solid 1 px'
                            }}
                    figure={'K'}
                >
                  <img 
                    onDragStart={evt => this.onFigureDragStart(-1, 'K', evt)}
                    onDragEnd={ev => this.onFigureDragEnd(ev)}
                    src={ChessBoard.chessSets[this.state.chessSet]['K']} figure={'K'} draggable={true} 
                    width={'100%'} height={'100%'}/>
                </div>
                <div style={{display: 'inline-block', 
                            height: `50px`,
                            width:   `50px`,
                            border: 'solid 1 px',
                            marginLeft: '20px'
                            }}
                >
                  <button onClick={() => {
                    this.loadFen(this.state.positions[0])
                    this.analyze()
                  }
                  }>Done</button>
                </div>
            </div>
          </div>
        </div>
      )
    }
}