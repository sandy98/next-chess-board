import Head from  '../components/head'
import Nav from  '../components/nav'
import ChessBoard  from '../components/board'

export default () => {
  let board1
  const getSetupStatus = () => board1 ? board1.state.mode === ChessBoard.Modes.MODE_SETUP : false

  return (
  <div>
    <Head title="Setup Mode Board" />  
    <Nav>
      <div className="hero">  
        <h1 className="title"> Setup Mode Board </h1>
        <div className="row">
          <ChessBoard
            ref={(b) => board1 = window.board1 = b} 
            size={520} 
            moveValidator={true} 
            mode={ChessBoard.Modes.MODE_SETUP}
            chessSet={'default'}
            darkSqsBg={ChessBoard.darkSqBgs[1]}
            lightSqsBg={ChessBoard.lightSqBgs[1]}
          />
          <button
            style={{fontSize: '16pt', height: '50px', maxHeight: '50px', marginTop: '10em'}} 
            disabled={!getSetupStatus() ? '' : 'disabled'}
            onClick={() => setTimeout(() => board1 ? board1.setup() : alert("Board not configured"), 0)}
          >
            Setup
          </button>
        </div>
      </div>
    </Nav>
  </div>
  )}