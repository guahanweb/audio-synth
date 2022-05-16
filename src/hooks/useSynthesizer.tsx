import { createContext, useContext, useEffect } from 'react';

export interface SynthesizerContext {
    setup: () => void;
    teardown: () => void;
    play: (frequency: number, attack?: number, sustain?: number, release?: number, vibrato?: number, vibratoSpeed?: number) => void;
}

const SynthContext = createContext<SynthesizerContext|null>(null);

export function AudioProvider({ children }: { children: JSX.Element }) {
    let context: AudioContext|undefined;
    let masterVolume: GainNode|undefined;
    let oscillator: OscillatorNode|undefined;

    const setup = () => {
        context = new AudioContext();
        masterVolume = context.createGain();
        oscillator = context.createOscillator();

        masterVolume.gain.value = 0.3;
        masterVolume.connect(context.destination);
        oscillator.connect(masterVolume);
    }

    const teardown = () => {
        // free up references for garbage collection
        context = undefined;
        masterVolume = undefined;
        oscillator = undefined;
    }

    const play = (frequency = 220, attack = 0.3, sustain = 0.8, release = 0.3, vibrato = 0.5, vibratoSpeed = 10) => {
        // sanity check to be sure we are "powered on"
        if (context !== undefined && masterVolume !== undefined) {
            const osc = context.createOscillator();
            const noteGain = context.createGain();
            const lfo = context.createOscillator();
            const lfoGain = context.createGain();

            noteGain.gain.setValueAtTime(0, 0);
            noteGain.gain.linearRampToValueAtTime(sustain, context.currentTime + attack);
            noteGain.gain.setValueAtTime(sustain, context.currentTime + 1 - release);
            noteGain.gain.linearRampToValueAtTime(0, context.currentTime + 1);

            // LFO
            lfo.frequency.setValueAtTime(vibratoSpeed, 0);
            lfo.connect(lfoGain);
            lfo.start(0);
            lfo.stop(context.currentTime + 1);

            lfoGain.gain.setValueAtTime(vibrato, 0);
            lfoGain.connect(osc.frequency);

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(frequency, 0);
            osc.start(0);
            osc.stop(context.currentTime + 1);
            osc.connect(noteGain);
            noteGain.connect(masterVolume);
        }
    }

    return (
        <SynthContext.Provider value={{ setup, teardown, play } as SynthesizerContext}>
            {children}
        </SynthContext.Provider>
    )
}

export function useSynthesizer(): SynthesizerContext {
    const context = useContext(SynthContext);
    if (context === undefined) {
        throw new Error('useSynthesizer() must be called from within an AudioProvider context');
    }
    return context as SynthesizerContext;
}