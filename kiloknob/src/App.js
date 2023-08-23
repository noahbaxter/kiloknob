import logo from './logo.svg';
import Knob from './components/knob';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
       <Knob paramName="Mix"/>
      </header>
    </div>
  );
}

export default App;
