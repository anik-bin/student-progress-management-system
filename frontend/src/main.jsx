import { StrictMode } from 'react'
import './index.css'
import ReactDOM from 'react-dom/client'
import AppRouter from './Router.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
)
