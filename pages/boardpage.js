import {v4} from 'uuid'
import Link from 'next/link'
import Head from '../components/head'
import Nav from '../components/nav'
import ChessBoard from '../components/board'

export default () => {
  let board1
  return (
  <div>
    <Head title="Test Chess Board" />
    <Nav>
        <div className="hero" style={{backgroundImage: 'url("static/img/monstruos.jpg")',
                                      backgoundSize: '800px 600px',
                                      backgroundPosition: 'center',
                                      marginLeft: '7%',
                                      marginRight: '10%',
                                      width: '80%', 
                                      padding: '2em',
                                      borderRadius: '15px'}}>
            <div className="row">
                <ChessBoard id={v4()} size={480} ref={(b1) => board1 = b1}/>
            </div>
            <div className="row">
                <button onClick={() => board1.reset()}>Restart Game</button>
                <button onClick={() => board1.flip()}>
                  {board1 ? (board1.isFlipped() ? 'Unflip' : 'Flip') : 'Flip'}
                </button>
            </div>
        </div>
    </Nav>
  </div>
)}
