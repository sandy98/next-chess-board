import {Component} from 'react'
import fetch from 'isomorphic-fetch'
import Head from '../components/head'
import Nav from '../components/nav'

const Poem = (props) => (
    <div style={{
      padding: '1em',
      paddingLeft: '12em',
      fontSize: '36px',
      color: '#eeeeee',
      //color: '#8eaddd',
      backgroundColor: '#ccaa88',
      backgroundImage: 'url(/static/img/monstruos.jpg)',
      fontFamily: 'Courier'
//    fontFamily: 'Lucida Typewriter'
      //color: '#855833'
      }}
    >
        {props.lines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
    </div>
)

export default class PoemPage extends Component {
  static async getInitialProps () {
    try {  
      const file = await fetch('https://chessboard.now.sh/static/borges.txt')
      const text =  await file.text()
      const lines = text.split(/\n/)
      return {lines}
    }
    catch(e) {
        console.log(`ERROR: ${e.message}`)
        return {lines: ["El Ajedrez", "por Jorge Luis Borges"]}
    }
  }

  render () {
    return (
      <div>
        <Head title="Borges Poem on Chess"/>
        <Nav>
          <Poem lines={this.props.lines} />
        </Nav>
      </div>
    )
  }
}
