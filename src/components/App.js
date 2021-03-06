import React from 'react'
import Flex from 'flex-component'
import SimpleInput from 'react-simple-input'
import Switch from 'react-flexible-switch'
import { BrowserRouter as Router, Route} from 'react-router-dom'
import Octicon from 'react-octicon'

import Editor from 'components/Editor/Editor'
import RulesContainer from 'components/RulesContainer/RulesContainer'
import GithubBadge from 'components/GithubBadge/GithubBadge'

import css from './App.scss'

export const Container = ({ children }) => (
  <Flex direction='column' className={css.app}>
    {children}
  </Flex>
)

class App extends React.Component {
  state = {
    filterText: '',
    editorValue: `var foo = 'bar'`,
    showEditor: true,

    localLinterConfig: {
      parserOptions: {
        ecmaVersion: 6,
        ecmaFeatures: {
          experimentalObjectRestSpread: true,
          impliedStrict: true,
          jsx: true
        },
        sourceType: 'module'
      },
    },
    localRuleConfig: {},
  }

  updateCode = editorValue => this.setState({ editorValue })

  onToggleRule = (ruleId, active) => {
    this.setState({
      localRuleConfig: {
        ...this.state.localRuleConfig,
        [ruleId]: active ? 'error' : 'off'
      }
    })
  }

  render() {
    const {
      defaultRuleConfig,
      defaultLinterConfig,
      ruleDefinitions
    } = this.props

    const {
      showEditor
    } = this.state

    // merge default rule config and local rule config
    const activeRuleConfig = {
      ...defaultRuleConfig,
      ...this.state.localRuleConfig,
    }

    const activeLinterConfig = {
      ...defaultLinterConfig,
      ...this.state.localLinterConfig,
    }

    return (
      <Router>
        <Container>
          <Flex shrink={0} className={css.header}>
            <Flex
              justifyContent='center'
              className={css.toggleContainer}
              alignItems='center'
            >
              <div onClick={() => this.setState({ showEditor: true })}>Example Code</div>
              <Switch
                value={!showEditor}
                circleStyles={{ diameter: 15, onColor: '#4B32C3', offColor: '#4B32C3' }}
                switchStyles={{ width: 35, padding: 3, borderColor: '#DDDDDD', margin: '0 20px' }}
                onChange={showEditor => this.setState({ showEditor: !showEditor })}
              />
              <div onClick={() => this.setState({ showEditor: false })}>Eslint Config</div>
            </Flex>
            <SimpleInput
              clearButton
              changeTimeout={200}
              classNameContainer={css.searchContainer}
              className={css.search}
              placeholder='Filter...'
              defaultValue={this.state.filterText}
              onChange={({ target: { value: filterText }}) => this.setState({ filterText })}
              type='text'
            />
          </Flex>

          <Flex>
            {showEditor ? (
              <Editor
                shouldLint
                value={this.state.editorValue}
                onChange={this.updateCode}
                activeRuleConfig={activeRuleConfig}
                activeLinterConfig={activeLinterConfig}
              />
            ) : (
              <Editor
                value={JSON.stringify(activeRuleConfig, null, '  ')}
                options={{
                  lineNumbers: false,
                  readOnly: true
                }}
              />
            )}
              <Flex className={css.rules} direction='column'>
                <Route path='/:ruleId?' render={(params) => {
                  const ruleId = params.match.params.ruleId
                  return (
                    <RulesContainer
                      expandedId={ruleId}
                      ruleDefinitions={ruleDefinitions}
                      activeRuleConfig={activeRuleConfig}
                      filterText={this.state.filterText}
                      onToggleRule={this.onToggleRule}
                      setCode={this.updateCode}
                    />
                  )
                }} />
              </Flex>
            )} />
          </Flex>
        </Container>
      </Router>
    )
  }
}

export default App
