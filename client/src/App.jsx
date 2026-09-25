import { Routes, Route } from "react-router-dom";
import AuthComponents from "./Admin/components/AuthComponents.jsx";
import HomePage from "./Admin/Page/HomePage.jsx";
import Preview from "./Admin/Page/Preview.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthComponents />} />

      <Route path="/home" element={<HomePage />} />

      <Route path="/" element={<Preview />} />
    </Routes>
  );
};

export default App;
