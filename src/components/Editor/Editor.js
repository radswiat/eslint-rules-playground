import React from 'react'
import CodeMirror from 'react-codemirror'
import isEqual from 'lodash/isEqual'

import 'codemirror/mode/jsx/jsx'
import 'codemirror/lib/codemirror.css'

import 'codemirror/addon/lint/lint.css'
import 'codemirror/addon/lint/lint'

import css from './Editor.scss'

const Linter = new window.eslint()

function getSeverity(error) {
  switch (error.severity) {
    case 1:
      return 'warning'
    case 2:
      return 'error'
    default:
      return 'error'
  }
}

function getPos(error, from) {
  var line = error.line - 1,
    ch = from
      ? error.column
      : error.column + 1
  if (error.node && error.node.loc) {
    line = from
      ? error.node.loc.start.line - 1
      : error.node.loc.end.line - 1
    ch = from
      ? error.node.loc.start.column
      : error.node.loc.end.column
  }
  return { line, ch }
}

export default class Editor extends React.Component {

  static defaultProps = {
    className: css.container,
    shouldLint: false,
  }

  onCodeMirrorInstance = component => {
    if (component !== null) {
      this.codeMirror = component.getCodeMirror()

      if (this.props.shouldLint) {
        component.getCodeMirrorInstance().registerHelper(
          'lint', 'javascript', this.lint
        )
      }
    }
  }

  shouldComponentUpdate({ activeRuleConfig, activeLinterConfig, value }) {
    return (
      this.props.value !== value ||
      !isEqual(this.props.activeRuleConfig, activeRuleConfig) ||
      !isEqual(this.props.activeLinterConfig, activeLinterConfig)
    )
  }

  componentDidUpdate() {
    const cursor = this.codeMirror.getCursor()
    this.codeMirror.setValue(
      this.codeMirror.getValue()
    )
    this.codeMirror.setCursor(cursor)
  }

  get lint() {
    return text => (
      Linter.verify(text, {
        ...this.props.activeLinterConfig,
        rules: this.props.activeRuleConfig
      }).map(error => ({
        message: `${error.ruleId || 'Error'}: ${error.message}`,
        severity: getSeverity(error),
        from: getPos(error, true),
        to: getPos(error, false)
      }))
    )
  }

  render() {
    const options = {
      lineNumbers: true,
      mode: 'jsx',
      gutters: this.props.shouldLint ? ['CodeMirror-lint-markers'] : [],
      lint: this.props.shouldLint,
      ...this.props.options
    }

    return (
      <CodeMirror
        className={this.props.className}
        ref={this.onCodeMirrorInstance}
        value={this.props.value}
        onChange={this.props.onChange}
        options={options}
      />
    )
  }
}
