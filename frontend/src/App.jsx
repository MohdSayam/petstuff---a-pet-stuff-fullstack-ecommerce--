import { Route, Router } from "react-router-dom";
import Home from "./pages/Home"
import Login from "./pages/Login"

function App(){
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="/login" element={ <Login /> } />
        {/* The '*' path acts as a 404 Page Not Found */}
        <Route path="/" element={ <h1>404 Page Not Found</h1> } />
      </Routes>
    </div>
  )
}

export default App;