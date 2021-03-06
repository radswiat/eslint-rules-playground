import React from 'react'
import SyntaxHighlighter, { registerLanguage } from 'react-syntax-highlighter/dist/light'
import Octicon from 'react-octicon'
import { Link as RouterLink } from 'react-router'

import css from './MarkdownTypes.scss'
import theme from 'react-syntax-highlighter/dist/styles/tomorrow'

import javascript from 'highlight.js/lib/languages/javascript'
import diff from 'highlight.js/lib/languages/diff'
import json from 'highlight.js/lib/languages/json'
import xml from 'highlight.js/lib/languages/xml'

registerLanguage('xml', xml)
registerLanguage('javascript', javascript)
registerLanguage('json', json)
registerLanguage('diff', diff)

const isAbsolute = new RegExp('^([a-z]+://|//)', 'i')

export const Link = ({ href = '', title, children }) =>
  !isAbsolute.test(href) &&
  href.endsWith('.md') ? (
    <RouterLink to={href.slice(0, -3)}>
      {children}
    </RouterLink>
  ) : (
    <a href={href} title={title} target='_blank' rel='noopener'>
      {children}
    </a>
  )

export const Code = ({ literal, inline }) => (
  <code style={{
    padding: 4,
    backgroundColor: '#fafafa',
    fontFamily: 'Consolas'
  }}>
    {literal}
  </code>
)

export const CodeBlock = ({ language, literal, setCode }) => (
  <div className={css.codeBlock}>

    <button
      className={css.button}
      onClick={() => setCode(literal)}
    >
      <span className={css.label}>Load code into editor</span>
      <Octicon className={css.icon} name='repo-push' />
    </button>

    <SyntaxHighlighter
      language={language}
      style={theme}
      customStyle={{
        margintop: 20,
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#fafafa',
        fontFamily: 'Consolas',
        lineHeight: '20px',
      }}
      lineNumberStyle={{
        color: '#ddd',
        float: 'left',
        paddingRight: 10,
      }}
      showLineNumbers
      >
        {literal}
      </SyntaxHighlighter>
  </div>
)
