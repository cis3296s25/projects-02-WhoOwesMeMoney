import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          If you can see this then it is working.
        </p>
        <p>
          To run "cd whoowesmemoney"
          then "npm start"
          This text is by Mohammad Eisa.
          This text is by Eric Bonifacic.
          This text is by Hena.
          This text is by Josh Ly.
        </p>
        <p>
          "Ctrl C" to end
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
