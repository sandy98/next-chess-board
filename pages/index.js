import {Component} from 'react'
import Link from 'next/link'
import Head from '../components/head'
import Nav from '../components/nav'
import ReactMarkdown from 'react-markdown'
import 'isomorphic-fetch'
import ChessBoard from '../components/board'


export default class Index extends Component {
  static async getInitialProps() {
    const text = await fetch('https://raw.githubusercontent.com/sandy98/next-chess-board/master/README.md')
    const readme = await text.text()
    return {readme}
  }

  render = () => (
    <div>
        <Head title="Home" />
        <Nav>

        <div className="row">
                <ChessBoard size={160} flipped={true}/>
        </div>
        <div className="hero">
          <h2 className="title">React Chess Board v0.1.0</h2>
          <p className="description">
            What are you waiting? Go to <Link href="/boardpage"><a>Board Page</a></Link>
          </p>
          <div className="" style={{textAlign: 'left',
                                       marginLeft: '5%',
                                       marginRight: '5%',
                                       marginTop: '2em',
                                       marginBottom: '2em', 
                                       padding: '1em', 
                                       background: '#efefef',
                                       border: 'solid 1px navy',
                                       borderRadius: '10px',
                                       }}>
            <ReactMarkdown source={this.props.readme} />
            <br/><br/>
            <div style={{textAlign: 'center'}}>
              <img src="static/img/coronando_reyes.jpeg" style={{borderRadius: '50px'}} />
            </div>
          </div>
        </div>
      </Nav>
    </div>
  )
}