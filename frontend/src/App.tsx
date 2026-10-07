import { BrowserRouter, Routes, Route } from "react-router-dom";
import appRoutes from "./Routes";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {appRoutes.map((r) => (
          <Route
            key={r.path}
            path={r.path}
            element={
              r.protected ? (
                <ProtectedRoute>{r.element}</ProtectedRoute>
              ) : (
                r.element
              )
            }
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;