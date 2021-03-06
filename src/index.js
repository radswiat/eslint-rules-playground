import 'css/global.scss'

import React from 'react'
import { render } from 'react-dom'
import Pinky from 'react-pinky-promise'
import Flex from 'flex-component'
import { MoonLoader } from 'halogen'
import { BrowserRouter as Router } from 'react-router-dom'

import App, { Container } from 'components/App'
import eslintConfig from './eslint-rules/base'
import eslintDefaultRules from './eslint-rules/rules-default'
import eslintAirbnbBaseRules from './eslint-rules/rules-eslint-base'

// apply default rules
eslintConfig[0].rules = eslintDefaultRules

const fetchJSON = url => fetch(url).then(response => response.json())
const isDev = process.env.NODE_ENV === 'development'

const fetchPromise = Promise.all([
  eslintConfig[0],
  eslintConfig[1]
])

render(
  <Router>
    <Pinky promise={fetchPromise}>
        {({ resolved, rejected }) => {
          if (resolved) {
            const [
              defaults,
              ruleDefinitions
            ] = resolved

            const {
              rules: defaultRuleConfig,
              ...defaultLinterConfig
            } = defaults

            return (
              <App
                defaultRuleConfig={defaultRuleConfig}
                defaultLinterConfig={defaultLinterConfig}
                ruleDefinitions={ruleDefinitions}
              />
            )
          } else if (rejected) {
            return (
              <Container>
                <Flex direction='column' style={{ height: '100vh' }} alignItems='center' justifyContent='center'>
                  <div style={{ color: '#4B32C3', fontSize: 60 }}>:(</div>
                  <div style={{ marginTop: 30 }}>Something went wrong, please try again later.</div>
                </Flex>
              </Container>
            )
          } else {
              return (
                <Container>
                  <Flex direction='column' style={{ height: '100vh' }} alignItems='center' justifyContent='center'>
                    <MoonLoader color='#4B32C3' />
                    <div style={{ marginTop: 30 }}>Fetching latest eslint rules...</div>
                  </Flex>
                </Container>
              )
          }
        }}
    </Pinky>
  </Router>,
  document.querySelector('#app')
)
