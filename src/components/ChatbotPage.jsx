import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ChatbotPage = () => {
  const { domain } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const messagesEndRef = useRef(null);
  
  const domainInfo = {
    'international-business': {
      title: 'International Business',
      color: 'from-blue-500 to-purple-600',
      welcomeMessage: 'Bienvenue dans l\'assistant de rédaction de mémoire en International Business. Je peux vous aider à élaborer votre problématique, trouver des sources, et structurer votre recherche sur les affaires internationales.'
    },
    'ia-big-data': {
      title: 'IA & Big Data',
      color: 'from-indigo-500 to-cyan-400',
      welcomeMessage: 'Bienvenue dans l\'assistant de rédaction de mémoire en IA & Big Data. Je peux vous aider à formuler votre problématique, trouver des ressources techniques, et structurer votre recherche dans ce domaine innovant.'
    },
    'finance': {
      title: 'Finance',
      color: 'from-green-500 to-emerald-400',
      welcomeMessage: 'Bienvenue dans l\'assistant de rédaction de mémoire en Finance. Je peux vous aider à définir votre sujet, accéder à des données financières pertinentes, et construire une analyse rigoureuse.'
    },
    'marketing-digital': {
      title: 'Marketing Digital',
      color: 'from-red-500 to-pink-500',
      welcomeMessage: 'Bienvenue dans l\'assistant de rédaction de mémoire en Marketing Digital. Je peux vous aider à élaborer votre stratégie de recherche, analyser des campagnes, et structurer votre étude de marché.'
    },
    'management-leadership': {
      title: 'Management & Leadership',
      color: 'from-amber-500 to-yellow-400',
      welcomeMessage: 'Bienvenue dans l\'assistant de rédaction de mémoire en Management & Leadership. Je peux vous aider à explorer les théories modernes, étudier des cas d\'entreprise, et développer votre cadre conceptuel.'
    },
    'developpement-durable': {
      title: 'Développement Durable',
      color: 'from-teal-500 to-green-400',
      welcomeMessage: 'Bienvenue dans l\'assistant de rédaction de mémoire en Développement Durable. Je peux vous aider à explorer les pratiques responsables, analyser des modèles économiques durables, et structurer votre recherche environnementale.'
    },
    'entrepreneuriat': {
      title: 'Entrepreneuriat',
      color: 'from-purple-500 to-violet-400',
      welcomeMessage: 'Bienvenue dans l\'assistant de rédaction de mémoire en Entrepreneuriat. Je peux vous aider à développer votre business plan, analyser le marché pour votre startup, et structurer votre démarche entrepreneuriale.'
    }
  };

  const currentDomain = domainInfo[domain] || {
    title: 'Assistant Mémoire',
    color: 'from-blue-500 to-purple-600',
    welcomeMessage: 'Bienvenue dans l\'assistant de rédaction de mémoire. Je peux vous aider à structurer votre recherche, trouver des sources, et développer votre analyse académique.'
  };

  // Réinitialiser la conversation avec le backend lors du changement de domaine
  useEffect(() => {
    const resetConversation = async () => {
      try {
        await fetch('http://localhost:5000/reset', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        // Ajouter le message de bienvenue initial
        setMessages([
          { 
            id: 1, 
            sender: 'bot', 
            text: currentDomain.welcomeMessage,
            timestamp: new Date()
          }
        ]);
        
        // Ajouter les suggestions rapides
        addQuickSuggestions();
      } catch (error) {
        console.error('Erreur lors de la réinitialisation de la conversation:', error);
      }
    };
    
    resetConversation();
  }, [domain]);
  
  // Test de connexion au backend
  const testBackendConnection = async () => {
    setConnectionStatus('testing');
    try {
      // Test de connexion à l'endpoint de test
      const response = await fetch('http://localhost:5000/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setConnectionStatus({
          status: 'success',
          message: 'Connexion au serveur établie avec succès!'
        });
      } else {
        setConnectionStatus({
          status: 'error',
          message: `Erreur de connexion: ${data.error || 'Erreur inconnue'}`
        });
      }
    } catch (error) {
      setConnectionStatus({
        status: 'error',
        message: `Erreur de connexion: ${error.message}. Vérifiez que le serveur est démarré sur http://localhost:5000`
      });
    }
  };
  
  // Fonction pour ajouter des suggestions rapides spécifiques au domaine
  const addQuickSuggestions = () => {
    setTimeout(() => {
      const suggestionMessage = {
        id: 2,
        sender: 'bot',
        text: "Voici quelques questions pour démarrer votre réflexion. Cliquez sur une suggestion pour la sélectionner :",
        timestamp: new Date(),
        suggestions: [
          "Quels sont les enjeux actuels en " + currentDomain.title + " ?",
          "Comment structurer mon introduction ?",
          "Comment trouver un sujet original ?",
          "Quelles sont les meilleures sources pour " + currentDomain.title + " ?"
        ]
      };
      
      setMessages(prevMessages => [...prevMessages, suggestionMessage]);
    }, 1000);
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Fonction pour lire le flux de données de l'API
  const processStream = async (reader, botMessageId) => {
    const decoder = new TextDecoder();
    let responseText = '';
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }
        
        // Décoder et ajouter au texte de réponse
        const chunk = decoder.decode(value, { stream: true });
        responseText += chunk;
        
        // Mettre à jour le message du bot avec le texte accumulé
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === botMessageId ? { ...msg, text: responseText } : msg
          )
        );
      }
    } catch (error) {
      console.error('Erreur lors de la lecture du flux:', error);
      
      // Mettre à jour le message avec une erreur
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === botMessageId ? 
          { ...msg, text: responseText + "\n\nDésolé, une erreur s'est produite pendant le traitement de votre demande." } : 
          msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputValue.trim() === '' || isLoading) return;
    
    // Ajouter le message de l'utilisateur
    const newUserMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    
    // Créer un message vide pour le bot
    const botMessageId = messages.length + 2;
    const botMessage = {
      id: botMessageId,
      sender: 'bot',
      text: '',
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, botMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Envoyer la requête au backend
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue }),
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      // Traiter le flux de réponse
      const reader = response.body.getReader();
      await processStream(reader, botMessageId);
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      
      // Mettre à jour le message du bot avec l'erreur
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === botMessageId ? 
          { ...msg, text: "Désolé, une erreur s'est produite lors de la communication avec le serveur. Veuillez réessayer plus tard." } : 
          msg
        )
      );
      setIsLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Fonction pour mettre le focus sur le champ de texte après avoir défini sa valeur
  const focusOnInput = () => {
    document.getElementById('chat-input').focus();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6 overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-purple-800 opacity-10 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-blue-800 opacity-10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-indigo-800 opacity-5 blur-3xl"></div>
      </div>
      
      {/* Header */}
      <div className="w-full max-w-4xl mb-6 text-center z-10">
        <div className="flex items-center justify-center mb-4">
          <Link 
            to="/"
            className="text-gray-400 hover:text-white mr-4 flex items-center transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Retour à l'accueil
          </Link>
          <button 
            onClick={testBackendConnection}
            className="text-gray-400 hover:text-white ml-4 flex items-center transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Tester la connexion
          </button>
        </div>
        <h1 className={`text-3xl font-bold bg-gradient-to-r ${currentDomain.color} bg-clip-text text-transparent mb-2`}>
          Assistant Mémoire: {currentDomain.title}
        </h1>
        <div className={`h-1 w-32 bg-gradient-to-r ${currentDomain.color} rounded-full mx-auto mb-4`}></div>
        <p className="text-gray-400 max-w-2xl mx-auto">Votre assistant IA personnalisé pour vous guider à chaque étape de la rédaction</p>
      </div>
      
      {/* Chatbot Interface */}
      <div className="w-full max-w-4xl bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 flex flex-col h-[500px] z-10">
        {/* Chat messages area */}
        <div className="flex-grow p-4 overflow-y-auto">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-3/4 rounded-lg p-3 ${
                  message.sender === 'user' 
                    ? `bg-gradient-to-r ${currentDomain.color} text-white` 
                    : 'bg-gray-700 text-gray-200'
                }`}
              >
                {message.text ? (
                  <p className="whitespace-pre-wrap">{message.text}</p>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-100"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-200"></div>
                  </div>
                )}
                
                {/* Affichage des suggestions rapides si présentes */}
                {message.suggestions && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setInputValue(suggestion);
                          setTimeout(focusOnInput, 100);
                        }}
                        className={`text-xs py-1 px-3 rounded-full bg-gray-600 hover:bg-gray-500 text-white transition-colors text-left`}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                
                <span className={`text-xs mt-1 block ${
                  message.sender === 'user' ? 'text-gray-100 opacity-70' : 'text-gray-400'
                }`}>
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))}
          
          {connectionStatus && (
            <div className={`p-3 mx-auto my-2 rounded-lg text-sm max-w-md ${
              connectionStatus.status === 'success' 
                ? 'bg-green-800 bg-opacity-50 text-green-100' 
                : connectionStatus.status === 'error'
                  ? 'bg-red-800 bg-opacity-50 text-red-100'
                  : 'bg-gray-700 text-gray-200'
            }`}>
              {connectionStatus === 'testing' ? (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-100"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-200"></div>
                  <span>Test de connexion en cours...</span>
                </div>
              ) : (
                <p>{connectionStatus.message}</p>
              )}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input area */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
          <div className="flex">
            <input
              id="chat-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Posez votre question sur votre mémoire..."
              className="flex-grow bg-gray-700 text-white rounded-l-lg px-4 py-3 focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={testBackendConnection}
              className="bg-gray-600 text-white rounded-md px-4 py-2 mr-2 hover:bg-gray-500 transition-all"
              disabled={isLoading || connectionStatus === 'testing'}
            >
              Tester
            </button>
            <button
              type="submit"
              className={`bg-gradient-to-r ${currentDomain.color} text-white rounded-r-lg px-6 py-3 transition-all ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Envoi...
                </span>
              ) : (
                'Envoyer'
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* FAQ Section */}
      <div className="w-full max-w-4xl mt-8 z-10">
        <h3 className="text-xl font-semibold text-white mb-4">Questions fréquentes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            className="bg-gray-800 bg-opacity-60 rounded-lg p-4 border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
            onClick={() => {
              setInputValue("Comment structurer mon mémoire ?");
              setTimeout(focusOnInput, 100);
            }}
          >
            <h4 className="font-medium text-white mb-2">Comment structurer mon mémoire ?</h4>
            <p className="text-gray-300 text-sm">Cliquez pour poser cette question à l'assistant et obtenir un plan personnalisé selon votre domaine.</p>
          </div>
          <div 
            className="bg-gray-800 bg-opacity-60 rounded-lg p-4 border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
            onClick={() => {
              setInputValue("Comment trouver des sources académiques ?");
              setTimeout(focusOnInput, 100);
            }}
          >
            <h4 className="font-medium text-white mb-2">Comment trouver des sources académiques ?</h4>
            <p className="text-gray-300 text-sm">Cliquez pour demander des recommandations de bases de données spécialisées dans votre domaine.</p>
          </div>
          <div 
            className="bg-gray-800 bg-opacity-60 rounded-lg p-4 border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
            onClick={() => {
              setInputValue("Comment définir ma problématique ?");
              setTimeout(focusOnInput, 100);
            }}
          >
            <h4 className="font-medium text-white mb-2">Comment définir ma problématique ?</h4>
            <p className="text-gray-300 text-sm">Cliquez pour obtenir de l'aide pour formuler une question de recherche pertinente et précise.</p>
          </div>
          <div 
            className="bg-gray-800 bg-opacity-60 rounded-lg p-4 border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
            onClick={() => {
              setInputValue("Quelle méthodologie choisir pour mon mémoire ?");
              setTimeout(focusOnInput, 100);
            }}
          >
            <h4 className="font-medium text-white mb-2">Quelle méthodologie choisir ?</h4>
            <p className="text-gray-300 text-sm">Cliquez pour découvrir l'approche méthodologique la plus adaptée à votre recherche.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;