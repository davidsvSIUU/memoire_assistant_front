import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css'; // Assurez-vous que ce fichier existe

// Import des composants
import EducationDashboard from './components/EducationDashboard';
import ChatbotPage from './components/ChatbotPage';

// Composant principal de l'application
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EducationDashboard />} />
        <Route path="/chatbot/:domain" element={<ChatbotPage />} />
        {/* Route de secours qui redirige vers l'accueil */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

// Composant simple pour les routes non trouvées
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-white mb-4">Page non trouvée</h1>
      <p className="text-gray-400 mb-6">La page que vous recherchez n'existe pas.</p>
      <Link to="/" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
        Retour à l'accueil
      </Link>
    </div>
  );
}

export default App;