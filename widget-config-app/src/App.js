import logo from './logo.svg';
import './App.css';
import ConfigurationForm from './ConfigurationForm';
import ReactGA from 'react-ga';
ReactGA.initialize('UA-000000-01');
ReactGA.pageview(window.location.pathname);

function App() {
  return (
    <div className="App">
    
      <ConfigurationForm />
    </div>
  );
}

export default App;
