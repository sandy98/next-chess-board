import {v4} from 'uuid'
import Link from 'next/link'
import Head from '../components/head'
import Nav from '../components/nav'
import ChessBoard from '../components/board'

export default () => {
  let board1
  let sets = ['Alt1', 'Eyes', 'Fantasy', 'Modern', 'Spatial', 'Veronika']
  return (
  <div>
    <style jsx>{`
      .navButton {
        border-radius: 5px;
        padding: 0.5em;
        font-size: 12pt;
      }
    `}</style>
    <Head title="Test Chess Board" />
    <Nav>
        <div className="hero" style={{backgroundImage: 'url("static/img/monstruos.jpg")',
                                      backgoundSize: '800px 600px',
                                      backgroundPosition: 'center',
                                      marginLeft: '7%',
                                      marginRight: '10%',
                                      width: '80%', 
                                      padding: '2em',
                                      borderRadius: '15px'
                                      }}>
            <div className="row">
                <ChessBoard id={v4()} size={480} ref={(b1) => board1 = b1}/>
            </div>
            <div className="row" style={{backgroundColor: '#56b6e2', 
                                         padding: '10px', 
                                         borderTopLeftRadius: '10px',
                                         borderTopRightRadius: '10px',
                                         marginBottom: 0}}>
                <button className="navButton" onClick={() => board1.reset()} title="Restart game">Restart Game</button>
                <button className="navButton" onClick={() => board1.first()} title="Go to beginning position">{'<<'}</button>
                <button className="navButton" onClick={() => board1.previous()} title="Go to previous position">{'<'}</button>
                <button className="navButton" onClick={() => board1.next()} title="Go to next position">{'>'}</button>
                <button className="navButton" onClick={() => board1.last()} title="Go to last position">{'>>'}</button>
                <button className="navButton" onClick={() => board1.flip()} title="Flip/unflip board">
                  {board1 ? (board1.isFlipped() ? 'Unflip' : 'Flip') : 'Flip'}
                </button>
            </div>
            <div className="row" style={{backgroundColor: '#56b6e2', 
                                         padding: '10px', 
                                         borderBottomLeftRadius: '10px',
                                         borderBottomRightRadius: '10px',
                                         marginTop: 0}}>
                <span>
                    <label style={{color: 'white'}} htmlFor="scs">Select chess set:&nbsp;</label>
                    <select id="scs" onChange={ev => board1.useSet(ev.target.value)}>
                      <option value="default">Default</option>
                      {sets.map((set, i) => <option key={i} value={set.toLowerCase()}>{set}</option>)}
                    </select>
                </span>
                <span>
                    <label style={{color: 'white'}} htmlFor="sqc">Select board colors:&nbsp;</label>
                    <select id="sqc" onChange={ev => board1.useSquares(ev.target.value)}>
                      <option value={0}>Light blue</option>
                      <option value={1}>Brown</option>
                    </select>
                </span>
            </div>
        </div>
    </Nav>
  </div>
)}
