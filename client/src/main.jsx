import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Console from './console/Console.jsx'
import './index.css'
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom'
import { LoginForm } from './auth/Login.jsx'
import { Logout } from './auth/Logout.jsx'
import { Title, Text } from '@tremor/react'
import History from './history/History.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>  
      <Routes>
        <Route path='/' Component={App} />
        <Route path='/console' Component={Console} />
        <Route path='/history' Component={History} />
        <Route path='/login' Component={LoginForm}></Route>
        <Route path='/logout' Component={Logout}></Route>
        <Route path="*" element={<>
            <Title>404</Title>
            <Text>Page not found</Text>
        </>} />
      </Routes>
    </Router>
  </React.StrictMode>
)
