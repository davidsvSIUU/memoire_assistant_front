import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const EducationDashboard = () => {
  const [expandedCard, setExpandedCard] = useState(0);
  
  const educationPaths = [
    {
      id: 0,
      title: "International Business",
      description: "Développez une expertise globale en affaires internationales. Apprenez les stratégies commerciales transfrontalières, la négociation interculturelle et la gestion des opérations mondiales.",
      color: "from-blue-500 to-purple-600",
      path: "/chatbot/international-business"
    },
    {
      id: 1,
      title: "IA & Big Data",
      description: "Maîtrisez les technologies de l'intelligence artificielle et l'analyse des données massives. Explorez l'apprentissage automatique, le deep learning et les applications pratiques de l'IA.",
      color: "from-indigo-500 to-cyan-400",
      path: "/chatbot/ia-big-data"
    },
    {
      id: 2,
      title: "Finance",
      description: "Acquérez une compréhension approfondie des marchés financiers et de la gestion de portefeuille. Développez des compétences en analyse financière, investissement et planification stratégique.",
      color: "from-green-500 to-emerald-400",
      path: "/chatbot/finance"
    },
    {
      id: 3,
      title: "Marketing Digital",
      description: "Perfectionnez vos compétences en marketing numérique, stratégies de contenu et analytics. Apprenez à créer des campagnes efficaces sur les plateformes digitales modernes.",
      color: "from-red-500 to-pink-500",
      path: "/chatbot/marketing-digital"
    },
    {
      id: 4,
      title: "Management & Leadership",
      description: "Développez votre potentiel de leader et vos compétences en gestion d'équipe. Explorez les théories modernes du leadership et les pratiques de management efficaces.",
      color: "from-amber-500 to-yellow-400",
      path: "/chatbot/management-leadership"
    },
    {
      id: 5,
      title: "Développement Durable",
      description: "Contribuez à construire un avenir durable. Étudiez les pratiques commerciales responsables, l'économie circulaire et les stratégies de développement écologique.",
      color: "from-teal-500 to-green-400",
      path: "/chatbot/developpement-durable"
    },
    {
      id: 6,
      title: "Entrepreneuriat",
      description: "Transformez vos idées en entreprises prospères. Apprenez à identifier les opportunités, développer des business plans et sécuriser des financements pour votre startup.",
      color: "from-purple-500 to-violet-400",
      path: "/chatbot/entrepreneuriat"
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6 overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-purple-800 opacity-10 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-blue-800 opacity-10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-indigo-800 opacity-5 blur-3xl"></div>
      </div>
      
      {/* Header */}
      <div className="w-full max-w-6xl mb-10 text-center z-10">
        <h1 className="text-3xl font-bold text-white mb-2">Assistant IA pour Mémoires</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">Choisissez votre domaine d'études et laissez notre IA vous guider dans la création de votre mémoire</p>
      </div>
      
      {/* Cards container - horizontal layout */}
      <div className="w-full max-w-6xl flex flex-row h-96 gap-2 z-10 overflow-x-auto pb-4">
        {educationPaths.map((path) => (
          <Card 
            key={path.id}
            id={path.id}
            title={path.title}
            description={path.description}
            isExpanded={expandedCard === path.id}
            colorGradient={path.color}
            onExpand={() => setExpandedCard(path.id)}
            chatbotPath={path.path}
          />
        ))}
      </div>
      
      {/* Debug Link - Pour tester si le routage fonctionne */}
      <div className="mt-8 text-center z-10">
        <p className="text-gray-400 mb-2">Lien de test direct :</p>
        <Link 
          to="/chatbot/test-path" 
          className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Tester la redirection
        </Link>
      </div>
    </div>
  );
};

const Card = ({ id, title, description, isExpanded, colorGradient, onExpand, chatbotPath }) => {
  return (
    <div 
      className={`relative group transition-all duration-500 ease-in-out rounded-xl overflow-hidden cursor-pointer backdrop-blur-sm h-full ${isExpanded ? 'w-96 flex-shrink-0' : 'w-16 flex-shrink-0'}`}
      onMouseEnter={() => onExpand()}
    >
      {/* Card background with gradient and blur effects */}
      <div className={`absolute inset-0 bg-gradient-to-b ${colorGradient} opacity-10`}></div>
      <div className="absolute inset-0 bg-gray-800 bg-opacity-70"></div>
      
      {/* Random blur shape in background */}
      <div className={`absolute ${getRandomPosition(id)} w-32 h-32 rounded-full bg-gradient-to-r ${colorGradient} opacity-20 blur-xl`}></div>
      
      {/* Card content container */}
      <div className="relative h-full w-full flex">
        {/* Collapsed state (vertical title) - visible when not expanded */}
        <div 
          className={`h-full flex items-center transition-all duration-500 ${isExpanded ? 'w-0 opacity-0' : 'w-full opacity-100'}`}
        >
          <div className="flex flex-col items-center justify-center w-full">
            <h3 className="text-white font-bold text-xl writing-mode-vertical transform rotate-180 whitespace-nowrap">
              {title}
            </h3>
          </div>
        </div>
        
        {/* Expanded state - content inside */}
        <div 
          className={`absolute inset-0 p-6 flex flex-col transition-all duration-500 ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <div className="flex items-start">
            <h2 className={`text-2xl font-bold bg-gradient-to-r ${colorGradient} bg-clip-text text-transparent`}>
              {title}
            </h2>
          </div>
          
          <p className="mt-4 text-gray-300">
            {description}
          </p>
          
          <div className="mt-auto">
            {/* Lien direct au lieu d'un bouton */}
            <Link 
              to={chatbotPath}
              className={`px-4 py-2 rounded-lg bg-gradient-to-r ${colorGradient} text-white font-medium text-sm transition-all hover:shadow-lg hover:scale-105 inline-block`}
            >
              Commencer mon mémoire
            </Link>
          </div>
        </div>
        
        {/* Card border with glow effect on hover */}
        <div className={`absolute inset-0 rounded-xl border border-gray-700 transition-all duration-300 ${isExpanded ? 'shadow-glow border-opacity-50 border-white' : ''}`}></div>
      </div>
    </div>
  );
};

// Helper function to get random positions for the blur shapes
const getRandomPosition = (id) => {
  const positions = [
    'bottom-4 right-4',
    'top-4 left-4',
    'top-10 right-10',
    'bottom-10 left-20',
    'top-20 left-40',
    'bottom-2 right-32',
    'top-16 right-16'
  ];
  return positions[id % positions.length];
};

export default EducationDashboard;