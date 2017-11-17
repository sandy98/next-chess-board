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
    this.state = {isNotifY: false, notifyMsg: '', notifyLen: 0}
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
    console.log(`Msg from Stockfish: ${ev.data}`)
  }

  componentDidMount() {
    this.stockfish = new Worker('/static/js/stockfish.js')
    this.stockfish.onmessage = this.onUciMsg
    this.stockfish.postMessage('uci')
    this.unsChange = this.refs.board1.on(ChessBoard.Events.CHANGE, (pos) => {
      //console.log(`Received CHANGE to pos ${pos}`)
      this.refs.board1.doScroll()})
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
  }

   componentWillUnmount() {
    console.log("Will unmount.")
    this.stockfish.postMessage('quit')
    setTimeout(() => this.stockfish.terminate(), 0)
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
            <h6 className="title">React Chess Board v0.2.7</h6>                               
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
                    <button className="btn wide" onClick={() => {this.refs.board1.flip(); this.setState({flipped: !this.state.flipped})}} title="Flip/Unflip the board">
                    {(this && this.state) ? (this.state.flipped ? "UnFlip" : "Flip") : "Flip"}
                    </button>
                  </div>
                  <hr/>
                  <div className="row">
                    <p>
                        <label style={{color: '#1676a2'}} htmlFor="scs">Select chess set:&nbsp;</label>
                        <select id="scs" onChange={ev => this.refs.board1.useSet(ev.target.value)}>
                          <option value="default">Default</option>
                          {sets.map((set, i) => <option key={i} value={set.toLowerCase()}>{set}</option>)}
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
              </div>
              <div className="card">
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
                <div className="row">
                  <h3>Analysis</h3>
                </div>
              </div>
            </div>
          </div>
      </Nav>
    </div>
  )}
}