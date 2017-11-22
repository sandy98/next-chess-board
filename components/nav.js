import Head from './head'
import Link from 'next/link'

const links = [
  {href: '/borges', label: 'Jorge Luis Borges on Chess'},
  {href: '/sol', label: 'Fancy Sol Art'},
  {href: '/diagram', label: 'Draw diagrams'}, 
  {href: '/boardsetup', label: 'Setup mode'},
  {href: '/about', label: 'About'},
  { href: 'https://github.com/sandy98/next-chess-board', label: 'Fork me at Github' }
].map(link => {
  link.key = `nav-link-${link.href}-${link.label}`
  return link
})

const Nav = (props) => (
  <div>
  <nav>
    <ul>
      <li>
        <Link prefetch href="/">
          <a>Home</a>
        </Link>
      </li>
      <ul>
        {links.map(
          ({ key, href, label }) => (
            <li key={key}>
              <Link prefetch href={href}>
                <a style={{marginRight: '3em'}}>{label}</a>
              </Link>
            </li>
          )
        )}
      </ul>
    </ul>

    <style global jsx>{`
      :global(body) {
        margin: 0;
        font-family: -apple-system,BlinkMacSystemFont,Avenir Next,Avenir,Helvetica,sans-serif;
      }
      nav {
        text-align: center;
      }
      ul {
        display: flex;
        justify-content: space-between;
      }
      nav > ul {
        padding: 4px 16px;
      }
      li {
        display: flex;
        padding: 6px 8px;
      }
      a {
        color: #067df7;
        text-decoration: none;
        font-size: 13px;
      }
      .hero {
        width: 100%;
        color: #333;
      }
      .title {
        margin: 0;
        width: 100%;
        padding-top: 10px;
        line-height: 1.05;
        font-size: 36px;
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
    `}</style>
  </nav>
  {props.children}
  </div>
)

export default Nav
