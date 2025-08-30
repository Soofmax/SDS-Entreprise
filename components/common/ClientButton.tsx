// 1. On garde la directive 'use client' car le composant est interactif
'use client';

// 2. On importe les types nécessaires depuis React
import React, { type ReactNode, type MouseEventHandler } from 'react';

// 3. On définit une interface pour décrire les props du composant
interface ClientButtonProps {
  children: ReactNode; // 'children' peut être n'importe quel élément React (texte, icône, etc.)
  onClick: MouseEventHandler<HTMLButtonElement>; // 'onClick' est une fonction qui gère un événement de souris sur un bouton
}

// 4. On applique cette interface à notre composant
//    On utilise la syntaxe React.FC (Functional Component) qui est faite pour ça
const ClientButton: React.FC<ClientButtonProps> = ({ children, onClick }) => {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ClientButton;
