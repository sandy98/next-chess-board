import {v4} from 'uuid'
import Link from 'next/link'
import Head from '../components/head'
import Nav from '../components/nav'
import ChessBoard from '../components/board'

export default () => {
  let board2
  let sets = ['Alt1', 'Eyes', 'Fantasy', 'Modern', 'Spatial', 'Veronika']
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
        font-size: 20px;
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

    `}</style>
    
    <Head title="Test Chess Board - Free Movements" />
    <Nav>
        <div className="hero" style={{backgroundImage: 'url("static/img/coronando_reyes.jpeg")',
                                      backgroundPosition: '32%', 
                                      backgoundSize: '800px 600px',
                                      marginLeft: '7%',
                                      marginRight: '10%',
                                      width: '80%', 
                                      padding: '2em',
                                      borderRadius: '15px'
                                      }}>
            <div className="row">
                <ChessBoard id={v4()} size={480} ref={(b2) => board2 = b2}/>
            </div>
            <div className="row" style={{backgroundColor: '#dfdfdf', 
                                         padding: '10px', 
                                         borderTopLeftRadius: '10px',
                                         borderTopRightRadius: '10px',
                                         marginBottom: 0}}>
                <button className="btn wide" onClick={() => board2.reset()} title="Restart game">Restart Game</button>
                <button className="btn" onClick={() => board2.first()} title="Go to beginning position">&lt;&lt;</button>
                <button className="btn" onClick={() => board2.previous()} title="Go to previous position">&lt;&nbsp;&nbsp;</button>
                <button className="btn" onClick={() => board2.next()} title="Go to next position">&nbsp;&nbsp;&gt;</button>
                <button className="btn" onClick={() => board2.last()} title="Go to last position">&gt;&gt;</button>
                <button className="btn wide" onClick={() => board2.flip()} title="Flip/unflip board">
                  {board2 ? (board2.isFlipped() ? 'Unflip' : 'Flip') : 'Flip'}
                </button>
            </div>
            <div className="row" style={{backgroundColor: '#dfdfdf', 
                                         padding: '10px', 
                                         borderBottomLeftRadius: '10px',
                                         borderBottomRightRadius: '10px',
                                         marginTop: 0}}>
                <span>
                    <label style={{color: '#1676a2'}} htmlFor="scs">Select chess set:&nbsp;</label>
                    <select id="scs" onChange={ev => board2.useSet(ev.target.value)}>
                      <option value="default">Default</option>
                      {sets.map((set, i) => <option key={i} value={set.toLowerCase()}>{set}</option>)}
                    </select>
                </span>
                <span>
                    <label style={{color: '#1676a2'}} htmlFor="sqc">Select board colors:&nbsp;</label>
                    <select id="sqc" onChange={ev => board2.useSquares(ev.target.value)}>
                      <option value={0}>Light blue</option>
                      <option value={1}>Brown</option>
                    </select>
                </span>
            </div>
        </div>
    </Nav>
  </div>
)}
