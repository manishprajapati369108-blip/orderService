import { Routes, Route } from "react-router-dom";
import AuthComponents from "./Admin/components/AuthComponents.jsx";
import HomePage from "./Admin/Page/HomePage.jsx";
import Preview from "./Admin/Page/Preview.jsx";
import CreateRestaurant from "./Admin/components/CreateRestaurant.jsx";
import Search from "./Admin/Page/Search.jsx";
import NotifyRequest from "./Admin/components/NotifyRequest.jsx";
import HotelPage from "./Admin/Page/HotelPage.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthComponents />} />

      <Route path="/home" element={<HomePage />} />

      <Route path="/requests" element={<NotifyRequest />} />

      <Route path="/create" element={<CreateRestaurant />} />

      <Route path="/hotel/:groupId" element={<HotelPage/>} />

      <Route path="/" element={<Preview />}/>

      <Route path="/join-hotel" element={<Search />} />
      
    </Routes>
  );
};

export default App;
