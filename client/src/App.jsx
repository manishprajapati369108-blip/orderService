import { Routes, Route } from "react-router-dom";
import AuthComponents from "./Admin/components/AuthComponents.jsx";
import HomePage from "./Admin/Page/HomePage.jsx";
import Preview from "./Admin/Page/Preview.jsx";
import CreateRestaurant from "./Admin/components/CreateRestaurant.jsx";
import Search from "./Admin/Page/Search.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthComponents />} />

      <Route path="/home" element={<HomePage />}>
      </Route>

      <Route path="/create" element={<CreateRestaurant />} />

      <Route path="/" element={<Preview />} />

      <Route path="join-hotel" element={<Search />}/>
    </Routes>
  );
};

export default App;
