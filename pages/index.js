import {Component} from 'react'
import fetch from 'isomorphic-fetch'
import {v4} from 'uuid'
import Link from 'next/link'
import Head from '../components/head'
import Nav from '../components/nav'
import ChessBoard from '../components/board'
import Snackbar from 'material-ui/Snackbar'

export default class BoardPage2 extends Component {
  constructor(props) {
    super(props)
    this.state = {isNotifY: false, notifyMsg: '', notifyLen: 0, sfmsgs: [], sfRunning: false, sfDepth: 15}
    //this.state.flipped = false
  }

  static async getInitialProps() {
    try {
      const pgnfile = await fetch('https://raw.githubusercontent.com/sandy98/next-chess-board/master/static/pgn/quickmates.pgn')
      const pgntext = await pgnfile.text()
      const pgngames = pgntext.split(/[\n\r]{2}(?=\[)/)
      const jsonfile = await fetch('https://raw.githubusercontent.com/sandy98/next-chess-board/master/static/json/quickmates.json')
      const jsongames = await jsonfile.json()
      console.log(`Json games: ${jsongames.length}   -   Pgn games: ${pgngames.length}`)    
      return {pgngames, jsongames}
    }
    catch (e) {
      return {pgngames: [], jsongames: []}
    }
  }
  
  onUciMsg = (ev) => {
    //console.log(`Msg from Stockfish: ${ev.data}`)
    this.setState({sfmsgs: [...this.state.sfmsgs, ev.data]})
    this.refs.sfmsgs.scrollTop = this.refs.sfmsgs.scrollHeight
    if (ev.data.match(/uciok/g)) {
      setTimeout(() => this.setState({isNotify: true, notifyLen: 2000, notifyMsg: "Engine initialized OK."}), 0)
      console.log("Engine initialized OK")
    }
    let m = ev.data.match(/bestmove\s+([a-h][1-8][a-h][1-8][nbrq]?)\s+bestmoveSan\s+([a-h1-8NBRQK+x#=O0-]+)\s+/)
    if (m) {
      console.log(`Stockfish suggests ${m[1]} (${m[2]})`)
      let m2 = ev.data.match(/score\s+cp\s+(\-?\d+)\b/)
      let m3 = ev.data.match(/score\s+mate\s+(\-?\d+)\b/)
      let engineScore = m2 ? parseFloat(m2[1]) / 100 : m3 ? `M ${m3[1]}` : '---' 
      setTimeout(() => 
                   this.setState({isNotify: true, 
                                  notifyMsg: `Engine suggests best move is: ${m[2]}`, 
                                  notifyLen: 5000, 
                                  engineSuggestion: m[2], 
                                  engineScore: engineScore}), 0)
    }
  }

  processChange = (pos) => {
    //console.log(`Received CHANGE to pos ${pos}`)
    this.refs.board1.doScroll()
    this.setState({engineSuggestion: '', engineScore: null})
    if (!this.state.sfRunning) return
    this.stockfish.postMessage('stop')
    this.stockfish.postMessage('ucinewgame')
    let fen = this.refs.board1.state.positions[pos]
    this.stockfish.postMessage(`position fen ${fen}`)
    this.stockfish.postMessage(`go depth ${this.state.sfDepth}`)
  }

  componentDidMount() {
    this.unsFlip = this.refs.board1.on(ChessBoard.Events.FLIP, (flipped) => this.setState({flipped: flipped}))
    this.unsChange = this.refs.board1.on(ChessBoard.Events.CHANGE, this.processChange)
    this.unsMove = this.refs.board1.on(ChessBoard.Events.MOVE, (move) => console.log(`MOVIDA RECIBIDA: ${move}\n\n\n`))
    this.unsCheck = this.refs.board1.on(
      ChessBoard.Events.CHECK, (data) => this.setState({isNotifY: true, notifyMsg: data, notifyLen: 5000})) 
    this.unsCheckMate = this.refs.board1.on(
      ChessBoard.Events.CHECK_MATE, (data) => this.setState({isNotifY: true, notifyMsg: data, notifyLen: 60000})) 
    this.unsStaleMate = this.refs.board1.on(
      ChessBoard.Events.STALE_MATE, (data) => this.setState({isNotifY: true, notifyMsg: data, notifyLen: 60000})) 
    this.unsInsufficient = this.refs.board1.on(
      ChessBoard.Events.INSUFFICIENT_MATERIAL, (data) => this.setState({isNotifY: true, notifyMsg: data, notifyLen: 60000})) 
    this.unsError = this.refs.board1.on(
      ChessBoard.Events.ERROR, (data) => this.setState({isNotifY: true, notifyMsg: data, notifyLen: 5000})) 
    this.setState({flipped: this.refs.board1.state.flipped,
                   lang: navigator.language.slice(0, 2)})
    this.refs.board1.setSize(parseInt(screen.availWidth / 3.4))
    //Warning! Delete next line in production!
    window.page1 = this

    this.stockfish = new Worker('/static/js/stockfish.js')
    this.stockfish.onmessage = this.onUciMsg
    this.stockfish.postMessage('uci')
  }

   componentWillUnmount() {
    // console.log("Will unmount.")
    this.stockfish.postMessage('quit')
    setTimeout(() => this.stockfish.terminate(), 0)
    this.unsFlip()
    this.unsChange()
    this.unsMove()
    this.unsCheck()
    this.unsCheckMate()
    this.unsInsufficient()
    this.unsStaleMate()
    this.unsError()
   }
  
   handleNotifyClose = () => {
    this.setState({isNotifY: false})
   }

   render() {
    let board1
    let sets = ['Alt1', 'Eyes', 'Fantasy', 'Modern', 'Spatial', 'Veronika']
    let sqBgs = ChessBoard.getAvailSqColors()
    return (
    <div>
      <style jsx>{`
        .gridContainer {
          display: grid;
          margin-top:1em;
          margin-left: 5%;
          grid-row-gap: 3px;
          grid-column-gap: 3px;
          width: 80%;
        }

        .engineInfo {
          text-align: center;
          margin-top: 1em;  
          font-size: 14pt; 
          height: 2em;
          min-height: 2em;
          max-height: 2em; 
          width: 4em;
          min-width: 4em;
          max-width: 7em;
          font-weight: bold;
          color: #090;
          border: solid 1px black;
          display: inline-block;
          padding-top: 10px;
          background-color: white;
        }

        .navButton {
          border-radius: 5px;
          padding: 0.5em;
          font-size: 12pt;
          width: 3em;
          text-align: center;
          text-shadow: 0 1px 2px;
        }

        .wide {
          width: 10em;
        }

        .btn {
          background: #3498db;
          background-image: -webkit-linear-gradient(top, #3498db, #2980b9);
          background-image: -moz-linear-gradient(top, #3498db, #2980b9);
          background-image: -ms-linear-gradient(top, #3498db, #2980b9);
          background-image: -o-linear-gradient(top, #3498db, #2980b9);
          background-image: linear-gradient(to bottom, #3498db, #2980b9);
          -webkit-border-radius: 28;
          -moz-border-radius: 28;
          border-radius: 28px;
          font-family: Arial;
          color: #ffffff;
          font-size: 16px;
          padding: 10px 20px 10px 20px;
          text-decoration: none;
        }
        
        .btn:hover {
          background: #3cb0fd;
          background-image: -webkit-linear-gradient(top, #3cb0fd, #3498db);
          background-image: -moz-linear-gradient(top, #3cb0fd, #3498db);
          background-image: -ms-linear-gradient(top, #3cb0fd, #3498db);
          background-image: -o-linear-gradient(top, #3cb0fd, #3498db);
          background-image: linear-gradient(to bottom, #3cb0fd, #3498db);
          text-decoration: none;
        }
        
        .card {
		            background-color: #eeeeee;
                width: 50%;
                min-width: 50%; 
                border: none; 
                padding: 5px; 
                border-radius: 10px;
                margin-left: 10px; 
                padding-left: 10px;     
        }
        
      `}</style>

      <Head title="Test Chess Board" />
        <Nav>
          <Snackbar
              contentstyle={{fontSize: '36px'}}
              open={this.state.isNotifY}
              message={this.state.notifyMsg}
              autoHideDuration={this.state.notifyLen}
              onRequestClose={this.handleNotifyClose}
          />
          <div className="hero" style={{/*backgroundImage: 'url("static/img/monstruos.jpg")', 
                                        backgoundSize: '800px 600px', 
                                        backgroundPosition: 'center', */
                                        marginLeft: '7%',
                                        marginRight: '10%',
                                        width: '80%', 
                                        padding: '1em',
                                        /* borderRadius: '15px', */
                                        }}>
            <h6 className="title">React Chess Board v0.3.0</h6>                               
            <div className="row">
                <div>
                  <ChessBoard 
                    id={v4()} 
                    size={360} 
                    moveValidator={true} 
                    ref="board1"
                    lightSqsBg={sqBgs.light[1]}
                    darkSqsBg={sqBgs.dark[1]}
                  />
                </div>
                <div className="card">
                  <div className="row">
                    <button className="btn wide" onClick={() => this.refs.board1.reset()} title="Restart game">Restart Game</button>
                  </div>
                  <div className="row">
                    <button className="btn" onClick={() => this.refs.board1.first()} title="Go to beginning position">&lt;&lt;</button>
                    <button className="btn" onClick={() => this.refs.board1.previous()} title="Go to previous position">&lt;&nbsp;&nbsp;</button>
                    <button className="btn" onClick={() => this.refs.board1.next()} title="Go to next position">&nbsp;&nbsp;&gt;</button>
                    <button className="btn" onClick={() => this.refs.board1.last()} title="Go to last position">&gt;&gt;</button>
                  </div>
                  <div className="row">
                    <button className="btn" disabled={false} onClick={() => this.refs.board1.takeback()} title="Undo last move">Undo</button>
                  </div>
                  <div className="row">
                    <button className="btn wide" onClick={() => this.refs.board1.flip()} title="Flip/Unflip the board">
                    {(this && this.state) ? (this.state.flipped ? "UnFlip" : "Flip") : "Flip"}
                    </button>
                  </div>
                  <hr/>
                  <div className="row">
                    <p>
                        <label style={{color: '#1676a2'}} htmlFor="sqs">Select figures set:&nbsp;</label>
                        <select defaultValue="default" id="scs" onChange={ev => this.refs.board1.useSet(ev.target.value)}>
                          <option value="default">Default</option>
                          {sets.map((set, i) => <option key={i} value={set.toLowerCase()}>{set} </option>)}
                        </select>
                    </p>
                    <p>
                        <label style={{color: '#1676a2'}} htmlFor="sqc">Select board colors:&nbsp;</label>
                        <select ref="selectBg" id="sqc" defaultValue={1} onChange={ev => this.refs.board1.useSquares(ev.target.value)}>
                          {
                            [0, 1, 2, 3].map((i) =>
                              <option key={i} value={i}>
                                {sqBgs.labels[i]}
                              </option>
                            )
                          }
                        </select>
                    </p>
                  </div>
                  <hr/>
                  <div className="row">
                   <textarea 
                     ref="copypaste"
                     style={{
                       width: '90%',
                       marginLeft: '5%',
                       height: '5em',
                       overflow: 'auto'
                     }} 
                   />
                  </div>
                  <div className="row">
                    <button 
                      className="btn" 
                      onClick={(e) => {
                        this.refs.copypaste.value = this.refs.board1.game.pgn({newline_char: '\n'})
                        this.refs.copypaste.select()
                        document.execCommand('copy')
                      }} 
                      title="Copy game PGN to clipboard"
                    >
                      Copy Game
                    </button>
                    <button 
                      className="btn" 
                      onClick={(e) => {
                        this.refs.copypaste.select()
                        document.execCommand('paste')
                        let isGood = this.refs.board1.loadPgn(this.refs.copypaste.value)
                        if (!isGood) {
                          this.setState({isNotifY: true, notifyMsg: "Couldn't load game data.", notifyLen: 5000})
                          this.refs.board1.reset()
                        }
                        else {
                          setTimeout(() =>
                          this.setState({isNotifY: true, 
                                         notifyMsg: `Game ${this.refs.board1.state.whitePlayer}
                                                      - ${this.refs.board1.state.blackPlayer} 
                                                        ${this.refs.board1.state.gameResult || ''} loaded`, 
                                         notifyLen: 5000})
                          ,0)
                        }
                        this.refs.copypaste.value = ''
                      }} 
                      title="Paste game from clipboard"
                    >
                      Paste Game
                    </button>
                  </div>
                  <hr/>
                  <div className="row">
                   <input type="text" 
                     ref="copypasteFen"
                     style={{
                       width: '90%',
                       marginLeft: '5%',
                       overflow: 'auto'
                     }} 
                   />
                  </div>
                  <div className="row">
                    <button 
                      className="btn" 
                      onClick={(e) => {
                        this.refs.copypasteFen.value = 
                          this.refs.board1.state.positions[this.refs.board1.state.currentPosition]
                        this.refs.copypasteFen.select()
                        document.execCommand('copy')
                      }} 
                      title="Copy game FEN to clipboard"
                    >
                      Copy FEN
                    </button>
                    <button 
                      className="btn" 
                      onClick={(e) => {
                        this.refs.copypasteFen.select()
                        document.execCommand('paste')
                        let result = this.refs.board1.loadFen(this.refs.copypasteFen.value)
                        if (result) this.refs.copypasteFen.value = ''
                      }} 
                      title="Paste FEN from clipboard"
                    >
                      Paste FEN
                    </button>
                  </div>
                  <hr/>
              </div>
              <div className="card">
                  <div className="row">
                    <label htmlFor="gamePick" style={{color: '#1676a2'}}>Pick a game</label>
                    <select id="gamePick" style={{width: "80%", maxWidth: "80%", height: '2em', minHeight: '2em'}} 
                            onChange={(ev) => {
                            if (ev.target.value < 0) return false
                            let result = this.refs.board1.loadPgn(this.props.pgngames[ev.target.value])
                            if (!result) {
                              this.setState({isNotify: true, notifyMsg: 'Could not load selected game', notifyLen: 5000})
                              }
                            return result
                            }}
                     >
                      <option value={-1}></option>
                      {
                        this.props.jsongames.map((jgame, i) => (
                          <option key={i} value={i} 
                          >
                            {`${this.props.jsongames[i].headers.White} - 
                              ${this.props.jsongames[i].headers.Black}   
                              ${this.props.jsongames[i].headers.Result}`}
                          </option>
                          )
                        )
                      }
                    </select>
                  </div>
                <hr/>
                <div style={{textAlign: 'center'}}>
                  <h3>Analysis</h3>
                  <div ref="sfmsgs" 
                    className=""
                    style={{
                      border: 'solid 1px',
                      width: '90%',
                      minWidth: '90%',
                      maxWidth: '90%',
                      height: '10em',
                      minHeight: '10em',
                      maxHeight: '10em',
                      overflowY: 'scroll',
                      overflowX: 'hidden',
                      padding: '5px',
                      paddingLeft: '0,5em',
                      backgroundColor: 'white',
                      fontSize: '12pt',
                      fontFamily: 'Monospace',
                      textAlign: 'left',
                      cursor: 'default'
                    }}
                  >
                    {
                      this.state.sfmsgs.map(
                        (msg, i) => 
                          <p key={i} title={msg}>{msg}</p>
                      )
                    }
                  </div>
                  <div className="">
                    <label htmlFor="inputDepth" style={{color: '#1676a2', fontSize: '14pt', marginRight: '1em'}}>Depth</label>
                    <input type="number" defaultValue={this.state.sfDepth} id="inputDepth" style={{textAlign: 'right', 
                                                                                                   fontSize: '14pt', 
                                                                                                   height: '2em', 
                                                                                                   width: '3em'}}
                           onChange={(ev) => this.setState({sfDepth: parseInt(ev.target.value)})} /> 
                  </div>
                  <div className="row">
                      <button 
                        className="btn" 
                        onClick={() => {
                                         let newRunning = !this.state.sfRunning
                                         this.setState({sfRunning: newRunning})
                                         if (newRunning) {
                                           setTimeout(() => this.processChange(this.refs.board1.state.currentPosition), 0)
                                         }
                                         else { 
                                           this.stockfish.postMessage('stop')
                                           this.setState({engineSuggestion: '', engineScore: null})
                                         }
                                       }}
                        style={{ backgroundColor: this.state.sfRunning ? 'red' : 'auto'}}
                      >
                        {this.state.sfRunning ? 'Stop Engine' : 'Start Engine'}
                      </button>
                  </div>
                  <hr/>
                  <div className="gridContainer">
                    <div className="">
                      <label style={{textAlign: 'left', 
                                    color: '#1676a2', 
                                    fontSize: '14pt', 
                                    marginRight: '1em',
                                    gridRow: '2',
                                    gridColumn: '1 / 4'}}
                      >
                        Engine Suggestion
                      </label>
                      <div className="engineInfo" style={{gridRow: '1 / 3', gridColumn: '5'}}> 
                        {this.state.engineSuggestion}
                      </div>
                    </div>
                    <div className="">
                      <label style={{textAlign: 'left', 
                                    color: '#1676a2', 
                                    fontSize: '14pt', 
                                    marginRight: '1em',
                                    gridRow: '6',
                                    gridColumn: '1 / 4'}}
                      >
                        Engine Score
                      </label>
                      <div className="engineInfo" style={{gridRow: '5 / 7', gridColumn: '5'}}> 
                        {this.state.engineScore ? 
                          this.state.engineScore.toFixed ? 
                            this.state.engineScore.toFixed(2) : this.state.engineScore : ''}
                      </div>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </Nav>
    </div>
  )}
}