import Link from 'next/link'
import Head from '../components/head'
import Nav from '../components/nav'

export default () => (
<div>
    <Head title="Home" />
    <Nav>

    <div className="hero">
      <h1 className="title">React Chess Board v0.01</h1>
      <p className="description">To get started, go to <a href="/boardpage">Board Page</a></p>
      <div className="row">
      </div>
    </div>
  </Nav>
</div>
)
