import logo from './logo.svg';
import Knob from './components/knob';
import './App.css';

function App() {

    // Do wtv with the output
    const handleKnobValueChange = (value) => {
        console.log(`Mix: ${value}%`);
    }

  return (
    <div className="App">
      <header className="App-header">
        <Knob paramName="Mix" paramValueChange={handleKnobValueChange}/>
      </header>
    </div>
  );
}

export default App;
