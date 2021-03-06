import {Component} from 'react'
import fetch from 'isomorphic-fetch'
import Head from '../components/head'
import Nav from '../components/nav'
import MyFooter from '../components/footer'

const Poem = (props) => (
    <div style={{
      padding: '1em',
      paddingLeft: '12em',
      fontSize: '36px',
      color: '#eeeeee',
      //color: '#8eaddd',
      backgroundColor: '#ccaa88',
      backgroundImage: 'url(/static/img/monstruos.jpg)',
      fontFamily: 'Monospace'
//    fontFamily: 'Lucida Typewriter'
      //color: '#855833'
      }}
    >   <h1 style={{fontFamily: 'Gotham', fontWeight: 'bold'}}>El ajedrez</h1>
        <h3 style={{color: '#bbb', textAlign: 'right', paddingRight: '3em', fontStyle: 'italic'}}>por Jorge Luis Borges</h3>
        {props.lines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
    </div>
)

export default class PoemPage extends Component {
  static async getInitialProps () {
    try {  
      const file = await fetch('https://raw.githubusercontent.com/sandy98/next-chess-board/master/static/borges.txt')
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
        <MyFooter/>
      </div>
    )
  }
}
