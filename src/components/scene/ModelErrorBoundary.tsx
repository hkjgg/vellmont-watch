import { Component, type ReactNode } from 'react'

interface Props {
  fallback: ReactNode
  children: ReactNode
}

interface State {
  hasError: boolean
}

/**
 * Catches a missing/broken public/models/watch.glb (useGLTF rejects its
 * suspense promise on a failed fetch) and renders the procedural placeholder
 * watch instead, so the showcase still works before the real asset exists.
 */
export default class ModelErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.warn('[VELLMONT] watch.glb failed to load, using placeholder watch:', error)
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}
