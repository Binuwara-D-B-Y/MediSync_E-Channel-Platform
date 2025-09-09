import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Forgot from './pages/Forgot';
import Reset from './pages/Reset';

function PrivateRoute({ children }) {
	const token = localStorage.getItem('token');
	return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
	const [isAuthed, setIsAuthed] = useState(!!localStorage.getItem('token'));
	useEffect(() => {
		const onStorage = () => setIsAuthed(!!localStorage.getItem('token'));
		window.addEventListener('storage', onStorage);
		return () => window.removeEventListener('storage', onStorage);
	}, []);

	return (
		<BrowserRouter>
			<nav className="nav">
				<Link to="/" className="brand">Clinic</Link>
				<div className="spacer" />
				{isAuthed ? (
					<button className="btn" onClick={() => { localStorage.removeItem('token'); setIsAuthed(false); }}>Logout</button>
				) : (
					<>
						<Link className="btn" to="/login">Login</Link>
						<Link className="btn" to="/register">Register</Link>
					</>
				)}
			</nav>
			<div className="container">
				<Routes>
					<Route path="/" element={<PrivateRoute><Profile /></PrivateRoute>} />
					<Route path="/login" element={<Login onAuthed={() => setIsAuthed(true)} />} />
					<Route path="/register" element={<Register />} />
					<Route path="/forgot" element={<Forgot />} />
					<Route path="/reset" element={<Reset />} />
				</Routes>
			</div>
		</BrowserRouter>
	);
}
