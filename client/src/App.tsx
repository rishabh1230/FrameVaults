import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Films from "./pages/Films";
import FilmDetail from "./pages/FilmDetail";
import About from "./pages/About";
import LoginPage from "./components/Login";         // import LoginPage
import RegisterPage from "./components/Register";   // import RegisterPage
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/films" element={<Films />} />
            <Route path="/film/:id" element={<FilmDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<LoginPage />} />            {/* New route */}
            <Route path="/register" element={<RegisterPage />} />      {/* New route */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
