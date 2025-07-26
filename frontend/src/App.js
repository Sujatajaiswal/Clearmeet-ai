import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Summary from "./pages/Summary";
import NotFound from "./pages/NotFound"; // Optional: create this page
import Layout from "./components/Layout";
// import ScrollToTop from "./components/ScrollToTop"; // Optional: scroll reset on route change

function App() {
  return (
    <Router>
      {/* <ScrollToTop /> */}
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
