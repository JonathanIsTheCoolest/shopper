import './App.css';
import Container from './components/Container/Container';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

function App() {
  return (
    <div className="App">
      <ErrorBoundary>
        <Container/>
      </ErrorBoundary>
    </div>
  );
}

export default App;
