import React from 'https://esm.sh/react@18';
import ReactDOM from 'https://esm.sh/react-dom@18';

function App() {
  return React.createElement('h1', null, 'Hello from React PWA!');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(App)
);
