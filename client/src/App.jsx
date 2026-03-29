// client/src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout components (show on every page)
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page components (one per route — create these as empty stubs for now)
import Login    from './pages/Login';
import Register from './pages/Register';
import Feed     from './pages/Feed';
import Profile  from './pages/Profile';
import Explore  from './pages/Explore';
import NotFound from './pages/NotFound';

// Global styles — imported once here, apply everywhere
import './index.css';

function App() {
  return (
    <BrowserRouter>
      {/* Navbar renders on every page because it's outside <Routes> */}
      <Navbar />

      {/* Main content area — pushed down by navbar height */}
      <main style={{ paddingTop: 'var(--navbar-height)', minHeight: '100vh' }}>
        <Routes>
          <Route path="/login"      element={<Login />} />
          <Route path="/register"   element={<Register />} />
          <Route path="/feed"       element={<Feed />} />
          <Route path="/profile"    element={<Profile />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/explore"    element={<Explore />} />

          {/* Redirect root to feed */}
          <Route path="/"           element={<Feed />} />

          {/* Catch-all: anything not matched → 404 */}
          <Route path="*"           element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;