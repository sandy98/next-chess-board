import {v4} from 'uuid'
import Link from 'next/link'
import Head from '../components/head'
import Nav from '../components/nav'
import ChessBoard from '../components/board'

export default () => {
  let board1
  return (
  <div>
    <Head title="Home" />
    <Nav>
        <div className="hero">
        <div className="row">
            <ChessBoard id={v4()} size={480} ref={(b1) => board1 = b1}/>
        </div>
        <div className="row">
            <button onClick={() => board1.flip()}>Flip</button>
            <button onClick={() => board1.reset()}>Restart Game</button>
        </div>
        </div>
    </Nav>
  </div>
)}
