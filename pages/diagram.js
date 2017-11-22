import Head from '../components/head'
import Nav from '../components/nav'
import Footer from '../components/footer'
import ChessBoard from '../components/board'



export default () => {

    let sets = ['Alt1', 'Eyes', 'Fantasy', 'Modern', 'Spatial', 'Veronika']
    let sqBgs = ChessBoard.getAvailSqColors()
    let board1, canvas
    let drawDiagram = () => {
      //alert("Draw!!")
      if (!canvas) {
          return false
      }
      let ctx = canvas.getContext('2d')
      console.log(board1.drawDiagram(ctx, 400))
    }

    return (
        <div style={{textAlign: 'center', width: '100%'}}>
           <Head title="Diagram Test" />
           <Nav>
             <h1>Diagram Generator</h1>
             <ChessBoard title="Double click to flip board" ref={(b) => window.board1 = board1 = b} size={600}/>
             <div style={{position: 'relative', 
                          top: board1 ? board1.top : '20px', marginLeft: '50px',  
                          display: 'inline-block', 
                          border: 'none'}}>
                <div>
                  <div>
                    <ol>
                        <li>1 - Set the position on the board</li>
                        <li>2 - Click on "Draw Diagram" button</li>
                        <li>3 - Right click on the generated image</li>
                        <li>4 - Choose what you want to do with the image (copy, save) from the context menu</li>
                    </ol>
                  </div>
                  <div>
                    <canvas title="Right click to copy/save image" 
                            ref={(c) => canvas = c} id="diagram" 
                            width="400" 
                            height="400"
                            style={{border: 'solid 1px blue'}}
                    >
                      <h4>Board Image</h4>
                    </canvas>
                  </div>
                </div>
             </div>
             <div style={{marginTop: '30px'}}>
               <label style={{fontSize: '16pt', color: '#1676a2'}} htmlFor="sqs">Select figures set:&nbsp;</label>
               <select style={{fontSize: '16pt'}} defaultValue="default" id="scs" onChange={ev => board1.useSet(ev.target.value)}>
                 <option value="default">Default</option>
                 {sets.map((set, i) => <option key={i} value={set.toLowerCase()}>{set} </option>)}
               </select>
               <label style={{fontSize: '16pt', marginLeft: '30px', color: '#1676a2'}} htmlFor="sqc">Select Board Colors:&nbsp;</label>
               <select style={{fontSize: '16pt'}} id="sqc" defaultValue={0} onChange={ev => board1.useSquares(ev.target.value)}>
                 {
                   [0, 1, 2, 3].map((i) =>
                     <option key={i} value={i}>
                        {sqBgs.labels[i]}
                     </option>
                    )
                  }
                </select>
             
                <button style={{fontSize: '16pt', marginLeft: '20px'}} onClick={drawDiagram}>Draw Diagram</button>
                <button 
                  style={{fontSize: '16pt', marginLeft: '20px'}} 
                  onClick={() => canvas.getContext('2d').clearRect(0,0, 400, 400)}
                >
                  Clear Diagram
                </button>
             </div>
           </Nav>
           <Footer/>
        </div>
    )
}