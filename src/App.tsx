import React, { useState, useCallback, MouseEventHandler } from 'react';
import { AudioProvider, useSynthesizer } from './hooks/useSynthesizer';
import './App.scss';

const notes = {
  C4: 261.63,
  E4: 329.63,
  G4: 392.00,
};

function SynthPad({ frequency, enabled }: { frequency: number, enabled: boolean }) {
  const { play } = useSynthesizer();

  const handleTap = useCallback(function () {
    if (!enabled) return;
    play(frequency, undefined, undefined, undefined, 5, 6);
  }, [frequency, enabled]);

  return (
    <div className={"pad pad-wrapper " + (enabled ? 'enabled' : 'disabled')}>
      <button
        className="btn btn-primary"
        onClick={handleTap}
        />
    </div>
  )
}

function PowerButton({ enabled, onClick }: { enabled: boolean, onClick: MouseEventHandler }) {
  return (
    <div className={"control power-button " + (enabled ? 'on' : 'off')}>
      <div className="wrapper">
        <span className="btn btn1">ON</span>
        <span className="btn main"></span>
        <span className="btn btn2">OFF</span>
        <label className="handler" onClick={onClick} />
      </div>
    </div>
  )
}

function Synthesizer() {
  const { setup, teardown } = useSynthesizer();
  const [enabled, setEnabled] = useState(false);

  const handlePower = useCallback(function (enabled: boolean) {
    // toggle power, and modify synth accordingly
    if (enabled) {
      teardown();
    } else {
      setup();
    }
    setEnabled(!enabled);
  }, []);

  return (
    <div>
      <PowerButton enabled={enabled} onClick={() => handlePower(enabled)} />
      <div className="synth synth-board">
        <SynthPad frequency={notes.C4} enabled={enabled} />
      </div>
    </div>
  )
}

function App() {
  return (
    <AudioProvider>
      <div className="app">
        <Synthesizer />
      </div>
    </AudioProvider>
  );
}

export default App;
