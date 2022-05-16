import React, { useState, useCallback } from 'react';
import { AudioProvider, useSynthesizer } from './hooks/useSynthesizer';

function SynthPad({ frequency }: { frequency: number }) {
  const { play } = useSynthesizer();

  const chord = useCallback(function () {
    play(261.63); // C4
    play(329.63); // E4
    play(392.00); // G4
  }, [play]);

  return (
    <button
      className="btn btn-primary"
      onClick={() => play(frequency, undefined, undefined, undefined, 5, 6)}
      >
        tap
    </button>
  )
}

function Synthesizer() {
  const { init } = useSynthesizer();
  const [enabled, setEnabled] = useState(false);
  const soundBoard = enabled ? <div>
    <SynthPad frequency={261.63} />
  </div> : null;

  const initialize = useCallback(function () {
    if (!enabled) {
      init();
      setEnabled(true);
    }
  }, [enabled]);

  return (
    <div>
      <button onClick={() => initialize()}>toggle</button>
      {soundBoard}
    </div>
  )
}

function App() {
  return (
    <AudioProvider>
      <div className="App">
        <Synthesizer />
      </div>
    </AudioProvider>
  );
}

export default App;
