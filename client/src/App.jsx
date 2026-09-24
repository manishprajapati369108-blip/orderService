import { Routes, Route } from "react-router-dom";
import AuthComponents from "./Admin/components/AuthComponents.jsx"
import Dashboard from "./Admin/Page/Dashboard.jsx";

const App = () => {
  return (
    <Routes>

    
      <Route path="/auth" element={<AuthComponents />} />

      <Route path="/" element={<Dashboard />} />
    </Routes>
  );
};

export default App;
