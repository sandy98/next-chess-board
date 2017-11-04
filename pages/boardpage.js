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
    <Nav />

    <div className="hero">
      <div className="row">
          <ChessBoard id={v4()} size={480} ref={(b1) => board1 = b1}/>
      </div>
      <div className="row">
        <button onClick={() => board1.flip()}>Flip</button>
        <button onClick={() => board1.reset()}>Restart Game</button>
      </div>
    </div>

    <style jsx>{`
      .hero {
        width: 100%;
        color: #333;
      }
      .title {
        margin: 0;
        width: 100%;
        padding-top: 20px;
        line-height: 1.15;
        font-size: 48px;
      }
      .title, .description {
        text-align: center;
      }
      .row {
        max-width: 880px;
        margin: 10px auto 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
      }
      a {
        color: #067df7;
        text-decoration: none;
        font-size: 13px;
      }
    `}</style>
  </div>
)}
