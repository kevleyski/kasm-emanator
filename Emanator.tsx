import React, { useEffect, useState } from 'react';

const Emanator: React.FC = () => {
    const [midiDevices, setMidiDevices] = useState<{ id: string; name: string }[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
    const [selectedChannel, setSelectedChannel] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [tempo, setTempo] = useState<number>(120);
    const [notesJson, setNotesJson] = useState<string>(
        JSON.stringify({ notes: [{ pitch: 60, velocity: 100, duration: 480 }] }, null, 2)
    );
    const [playbackStatus, setPlaybackStatus] = useState<string>('');
    const algorithmOptions = [
        { label: 'Emanator', value: 2 },
        { label: 'Looper', value: 63 },
        { label: 'Bangaz', value: 93 },
        { label: 'Arpeggiator', value: 169 },
        { label: 'Shuffle', value: 83 },
        { label: 'LFO', value: 148 },
        { label: 'Chords', value: 6 },
        { label: 'Patterns', value: 82 },
        { label: 'Counterpoint', value: 75 },
        { label: 'Drum Rack', value: 80 }
    ];
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<number>(2);

    // Algorithm dropdown options (copied from test.html)
    const algorithmDropdownOptions = [
        { value: 0, label: 'Random' },
        { value: 1, label: 'mldy:Phone Ringtone Classic phone ringtone melody with humanization' },
        { value: 2, label: 'mldy:Strummed Cascade Cascading glissando with stereo spread' },
        { value: 3, label: 'mldy:Elaborate Panning Melodic patterns with dynamic panning' },
        { value: 4, label: 'mldy:Advanced Rhythmic Complex melodic patterns with rhythmic variations' },
        { value: 5, label: 'hmny:Chord Progression Classic chord progressions with well-known pattern' },
        { value: 6, label: 'hmny:Simple Chord Basic major triad chord' },
        { value: 7, label: 'hmny:Extended Inversions Extended chords with inversions' },
        { value: 8, label: 'hmny:Complex Extensions Complex chord progressions with extensions and rhy' },
        { value: 9, label: 'rhym:Morse Code Morse code patterns with rhythmic timing' },
        { value: 10, label: 'rhym:Markov Chain Markov chain-based rhythmic patterns' },
        { value: 11, label: 'rhym:Wave Interference Trigonometric wave interference patterns' },
        { value: 12, label: 'rhym:Complex Reflection Physics-based reflection algorithms' },
        { value: 13, label: 'rhym:Balkan 7/8 Balkan 7/8 rhythm (aksak)' },
        { value: 14, label: 'rhym:West African Bell West African bell pattern (12/8 cross-rhythm)' },
        { value: 15, label: 'rhym:Indian Tintal Indian Tintal (16-beat cycle)' },
        { value: 16, label: 'rhym:Latin son clave Latin son clave (3-2)' },
        { value: 17, label: 'rhym:Jazz Swing 8ths Jazz swing eighths' },
        { value: 18, label: 'rhym:Fibonacci rhythm Fibonacci rhythm (5, 8, 13, ...)' },
        { value: 19, label: 'rhym:Golden ratio pulse Golden ratio pulse' },
        { value: 20, label: 'rhym:Prime number rhythm Prime number rhythm' },
        { value: 21, label: 'rhym:Balkan 11/8 (3+2+3+3) Balkan 11/8 (3+2+3+3)' },
        { value: 22, label: 'rhym:Contemporary tuplets (5:4) Contemporary tuplets (5:4)' },
        { value: 23, label: 'rhym:Afro-Cuban 6/8 bell Afro-Cuban 6/8 bell' },
        { value: 24, label: 'prog:Circle of Fifths Circle of Fifths progression with modulation and p' },
        { value: 25, label: 'prog:Stepwise Progression Diatonic stepwise progression' },
        { value: 26, label: 'prog:Plagal Cadence IV-I plagal cadence' },
        { value: 27, label: 'prog:Deceptive Cadence V-vi deceptive cadence' },
        { value: 28, label: 'prog:Modal Mixture Modal mixture progression' },
        { value: 29, label: 'prog:Descending Fifths Descending fifths progression' },
        { value: 30, label: 'prog:Jazz Turnaround I-vi-ii-V jazz turnaround' },
        { value: 31, label: 'prog:Chromatic Mediant Chromatic mediant progression' },
        { value: 32, label: 'prog:Neapolitan Chord Neapolitan chord progression' },
        { value: 33, label: 'prog:Augmented Sixth Augmented sixth progression' },
        { value: 34, label: 'chnt:Chant Dorian Call-Response Call and response in Dorian mode (chant style)' },
        { value: 35, label: 'chnt:Chant Psalm Tone Gregorian psalm tone formula' },
        { value: 36, label: 'chnt:Chant Ornamented Response Responsorial echo with ornamentation' },
        { value: 37, label: 'chnt:Chant with Drone Responsorial chant with ison (drone)' },
        { value: 38, label: 'chnt:Chant Antiphonal Antiphonal (alternating) chant' },
        { value: 39, label: 'spat:Harmonic Resonance Harmonic series with spatial positioning' },
        { value: 40, label: 'spat:Swarm Movement Boids algorithm with spatial audio' },
        { value: 41, label: 'spat:Circular Panning Dynamic circular panning effects' },
        { value: 42, label: 'spat:3D Positioning Simulated 3D spatial positioning' },
        { value: 43, label: 'math:Fibonacci Spiral Fibonacci timing with golden ratio velocity decay' },
        { value: 44, label: 'math:Fractal Cascade Fractal echo patterns at different time scales' },
        { value: 45, label: 'math:Swarming Spirals Bumblebee flight patterns with Fibonacci timing' },
        { value: 46, label: 'math:Fractal Chaos L-systems, strange attractors, and chaos theory' },
        { value: 47, label: 'expr:Multidimensional Markov Multi-dimensional Markov chain with harmonic conte' },
        { value: 48, label: 'expr:Second Order Markov Second-order Markov chain with rhythm patterns' },
        { value: 49, label: 'expr:Chaos Game Harmony Chaos game algorithm for counterpoint harmony' },
        { value: 50, label: 'expr:Complex Drums Complex drum patterns using golden ratio mathemati' },
        { value: 51, label: 'expr:Cellular Automaton Cellular automaton melody generator (Rule 30)' },
        { value: 52, label: 'expr:Euclidean Rhythm Euclidean rhythm pattern generator' },
        { value: 53, label: 'expr:L-System L-system based melody generator' },
        { value: 54, label: 'expr:Microtonal 24-TET Microtonal melody generator using 24-TET' },
        { value: 55, label: 'expr:Brownian Walk Stochastic Brownian walk melody generator' },
        { value: 56, label: 'expr:Spectral Texture Spectral overtone texture generator' },
        { value: 57, label: 'expr:Recursive Pattern Recursive self-similar pattern generator' },
        { value: 58, label: 'expr:Parameter Morphing Dynamic parameter morphing melody generator' },
        { value: 59, label: 'expr:Polymetric (3:4) Polymetric engine generating 3:4 patterns' },
        { value: 60, label: 'expr:Polytempo Engine Polytempo engine for variable speed patterns' },
        { value: 61, label: 'note:Krumhansl Arpeggiator' },
        { value: 62, label: 'note:Krumhansl Chords' },
        { value: 63, label: 'loop:Tape Loop Delay' },
        { value: 64, label: 'loop:Chaos Game Harmony Generates random harmony using chaos game logic an' },
        { value: 65, label: 'loop:Modular Arithmetic Harmony Cyclical pitch patterns using modular arithmetic.' },
        { value: 66, label: 'loop:Cellular Automata Harmony Binary sequence pitch offsets using Rule 30.' },
        { value: 67, label: 'loop:Spectral Harmony Harmony based on overtone series.' },
        { value: 68, label: 'loop:L-System Harmony Interval sequences generated by L-systems.' },
        { value: 69, label: 'loop:Markov Matrix Harmony Probabilistic interval jumps using Markov matrix.' },
        { value: 70, label: 'loop:Quasi-Crystal Harmony Penrose tiling angles for interval structure.' },
        { value: 71, label: 'loop:Fractal Brownian Harmony Fractal Brownian motion for pitch contour.' },
        { value: 72, label: 'loop:Hyperbolic Geometry Harmony Interval mapping using hyperbolic tangent.' },
        { value: 73, label: 'loop:Prime Spiral Harmony Pitch offsets using Ulam spiral of primes.' },
        { value: 74, label: 'loop:Fibonacci Harmony Counterpoint using Fibonacci intervals.' },
        { value: 75, label: 'loop:Markov Harmony Probabilistic note selection based on history.' },
        { value: 76, label: 'loop:Fractal Harmony Self-similar patterns at different octaves.' },
        { value: 77, label: 'loop:Prime Harmony Mathematically pure intervals using primes.' },
        { value: 78, label: 'loop:Golden Ratio Harmony Organic intervals using the golden ratio.' },
        { value: 79, label: 'Clear All Drum Assignments' },
        { value: 80, label: 'Reset Ableton Drum Rack Assignments' },
        { value: 81, label: 'Reset General MIDI Drums' },
        { value: 82, label: 'Reset Drums as Notes' },
        { value: 83, label: 'Shuffle Drum Assignments Around' },
        { value: 84, label: 'Reassign Kick (drum)' },
        { value: 85, label: 'Reassign Snare (drum)' },
        { value: 86, label: 'Reassign HHClose' },
        { value: 87, label: 'Reassign HHOpen' },
        { value: 88, label: 'Reassign LowTom (drum)' },
        { value: 89, label: 'Reassign MidTom (drum)' },
        { value: 90, label: 'Reassign HiTom (drum)' },
        { value: 91, label: 'Reassign Clap' },
        { value: 92, label: 'Reassign CowBell' },
        { value: 93, label: 'drum:Bangaz 1 Classic four-on-the-floor kick/snare with toms, en' },
        { value: 94, label: 'drum:Bangaz 2 Polyrhythmic pattern with triplet kicks, cross-rhy' },
        { value: 95, label: 'drum:Bangaz 3 Extravagant polyrhythms with displaced snares, acc' },
        { value: 96, label: 'drum:Bangaz 4 Evolving groove that changes every 4 bars, adding ' },
        { value: 97, label: 'drum:Bangaz 5 Weirdly polyrhythmic pattern with quintuplet kicks' },
        { value: 98, label: 'drum:Bangaz 6 Evolving Euclidean rhythm generator with increasin' },
        { value: 99, label: 'drum:Bangaz 7 Complex velocity and pan using sine/cosine, with o' },
        { value: 100, label: 'drum:Bangaz 8 Wildly complex beat placement using golden ratio, ' },
        { value: 101, label: 'drum:Bangaz 9 Bossa nova with dynamic pan, ghost notes, and tom ' },
        { value: 102, label: 'drum:Bangaz 10 Classic 808 with swing, intricate math for all dru' },
        { value: 103, label: 'drum:Bangaz 11 909 shuffle with adjustable shuffle depth, all dru' },
        { value: 104, label: 'drum:Bangaz 12 LinnDrum pop groove with HH accent and snare ghost' },
        { value: 105, label: 'drum:Bangaz 13 Electro syncopation with pan and velocity modulati' },
        { value: 106, label: 'drum:Bangaz 14 808 cowbell funk with pan and HH swing, all drums,' },
        { value: 107, label: 'drum:Bangaz 15 707 disco with snare and open HH accents, all drum' },
        { value: 108, label: 'drum:Bangaz 16 606 breakbeat with tom and snare accent controls, ' },
        { value: 109, label: 'drum:Bangaz 17 808 Miami bass with kick and clap accent controls,' },
        { value: 110, label: 'drum:Bangaz 18 727 Latin groove with cowbell and tom accent contr' },
        { value: 111, label: 'drum:Bangaz 19 808 triplet funk with triplet swing and snare acce' },
        { value: 112, label: 'drum:Bangaz 20 909 techno ride with ride and snare accent control' },
        { value: 113, label: 'drum:Bangaz 21 808 boogie with tom accent and HH swing, plus hats' },
        { value: 114, label: 'drum:Bangaz 22 707 house with clap and HH accent controls, plus k' },
        { value: 115, label: 'drum:Bangaz 23 808 clave pattern with offset and accent controls,' },
        { value: 116, label: 'drum:Bangaz 24 909 broken beat with snare ghost and tom accent, p' },
        { value: 117, label: 'drum:Bangaz 25 808 shuffle with swing and HH accent controls, plu' },
        { value: 118, label: 'drum:Bangaz 26 707 funk with snare and open HH accent controls, p' },
        { value: 119, label: 'drum:Bangaz 27 808 triplet shuffle with triplet swing and snare a' },
        { value: 120, label: 'drum:Bangaz 28 909 ride shuffle with ride accent and HH swing, pl' },
        { value: 121, label: 'drum:Bangaz 29 808 clave funk with clave offset and accent, plus ' },
        { value: 122, label: 'drum:Bangaz 30 Classical Motown Swing - evolving, panned, modwhee' },
        { value: 123, label: 'drum:Bangaz 31 Classical Polyrhythmic Waltz with Mathematical Pan' },
        { value: 124, label: 'drum:Bangaz 32 R&B Shuffle with Complex Syncopation and CC1 Modul' },
        { value: 125, label: 'drum:Bangaz 33 Groove with Mathematical Fills' },
        { value: 126, label: 'drum:Bangaz 34 Jazz Swing with Complex Polyrhythms' },
        { value: 127, label: 'drum:Bangaz 35 Complex with Clave & Percussion' },
        { value: 128, label: 'drum:Bangaz 36 Electronic Breakbeat with Glitch Elements' },
        { value: 129, label: 'drum:Bangaz 37 Progressive Rock with Odd Time Signatures' },
        { value: 130, label: 'drum:Bangaz 38 Fusion Odd-Time with Complex Polyrhythms' },
        { value: 131, label: 'drum:Bangaz 39 Breakcore Chaos with Algorithmic Placement' },
        { value: 132, label: 'drum:Bangaz 40 Polyrhythmic with Full Percussion' },
        { value: 133, label: "drum:Bangaz 41 Drum'n'Bass Complex with Algorithmic Breaks" },
        { value: 134, label: 'drum:Bangaz 42 Industrial Techno with Algorithmic Noise' },
        { value: 135, label: 'drum:Bangaz 43 Minimal Techno with Mathematical Precision' },
        { value: 136, label: 'drum:Bangaz 44 Samba Complex with Authentic Brazilian Rhythms' },
        { value: 137, label: 'drum:Bangaz 45 Dubstep with Complex Wobbles & Math Placement' },
        { value: 138, label: 'drum:Bangaz 46 Trap with Complex Hi-Hat Rolls & Math Snare' },
        { value: 139, label: 'drum:Bangaz 47 Reggaeton with Complex Dembow Latin Perc' },
        { value: 140, label: 'drum:Bangaz 48 Neurofunk with Complex Algorithmic Pattern' },
        { value: 141, label: 'drum:Bangaz 49 Footwork Juke with Rapid-Fire Math Patterns' },
        { value: 142, label: 'drum:Bangaz 50 Grime with UK Garage Syncopation' },
        { value: 143, label: 'drum:Bangaz 51 Psytrance with Math Sequences Full Arsenal' },
        { value: 144, label: 'drum:Bangaz 52 Hardstyle with Reverse Bass Maths Kick' },
        { value: 145, label: 'drum:Bangaz 53 Gabber with Extreme Speed Chaos' },
        { value: 146, label: 'drum:Bangaz 54 Ambient Dub Techno with Sparse Math Patterns' },
        { value: 147, label: 'drum:Bangaz 55 Experimental Polymetric with All DrumTypes' },
        { value: 148, label: 'lfo:LFO Sine Classic sine wave LFO with speed and phase control' },
        { value: 149, label: 'lfo:LFO Sawtooth Sawtooth wave LFO with speed and direction control' },
        { value: 150, label: 'lfo:LFO Square Square wave LFO with speed and pulse width control' },
        { value: 151, label: 'lfo:LFO Triangle Triangle wave LFO with speed and symmetry controls' },
        { value: 152, label: 'lfo:LFO Motown Fadeout Gradually decreasing until it disappears rather th' },
        { value: 153, label: 'lfo:LFO Cubic Cubic function (y=x³) LFO with intensity controls' },
        { value: 154, label: 'lfo:LFO Exponential Exponential function LFO with base controls' },
        { value: 155, label: 'lfo:LFO Logarithmic Logarithmic function LFO with scaling controls' },
        { value: 156, label: 'lfo:LFO Fibonacci Fibonacci sequence-based LFO with sequence length ' },
        { value: 157, label: 'lfo:LFO Golden Ratio Golden ratio spiral LFO with spiral tightness cont' },
        { value: 158, label: 'lfo:LFO Chaos Logistic Chaotic logistic map LFO with chaos parameter cont' },
        { value: 159, label: 'lfo:LFO Prime Sequence Prime number sequence LFO with sequence length con' },
        { value: 160, label: 'lfo:LFO Mandelbrot Mandelbrot set escape time LFO with zoom control' },
        { value: 161, label: 'lfo:LFO Lorenz Curve Lorenz attractor chaotic system LFO with axis sele' },
        { value: 162, label: 'lfo:LFO Lissajous Lissajous curve LFO with frequency ratio control' },
        { value: 163, label: 'lfo:LFO Collatz Collatz conjecture LFO with starting number range ' },
        { value: 164, label: 'arp:Arpeggio Up Classic ascending arpeggiator - plays held notes f' },
        { value: 165, label: 'arp:Arpeggio Down Classic descending arpeggiator - plays held notes ' },
        { value: 166, label: 'arp:Arpeggio Up/Down Pendulum arpeggiator - ascends then descends witho' },
        { value: 167, label: 'arp:Arpeggio Down/Up Reverse pendulum arpeggiator - descends then ascen' },
        { value: 168, label: 'arp:Arpeggio Random Random arpeggiator - plays held notes in random or' },
        { value: 169, label: 'arp:Arpeggio Flow Flow arpeggiator - plays notes in the exact order ' },
        { value: 170, label: 'arp:Arpeggio Up In Converging inward - alternates outer notes moving ' },
        { value: 171, label: 'arp:Arpeggio Down In Converging inward from high - starts high and conv' },
        { value: 172, label: 'arp:Expanding Up Expanding outward from center with upward preferen' },
        { value: 173, label: 'arp:Expanding Down Expanding outward from center with downward prefer' },
        { value: 174, label: 'arp:Low and Up Alternates lowest note with ascending sequence (St' },
        { value: 175, label: 'arp:Low and Down Alternates lowest note with descending sequence (S' },
        { value: 176, label: 'arp:Hi and Up Alternates highest note with ascending sequence (S' },
        { value: 177, label: 'arp:Hi and Down Alternates highest note with descending sequence (' },
        { value: 178, label: 'arp:Chord Strum Plays all held notes simultaneously as a chord' },
        { value: 179, label: 'arp:Octave Spread Octave spreading - plays root note across multiple' }
    ];
    const [selectedAlgorithmDropdown, setSelectedAlgorithmDropdown] = useState<number>(0);
    const [rootNote, setRootNote] = useState<number>(60); // Default to Middle C
    const [semitone, setSemitone] = useState<number>(0);
    const [velocity, setVelocity] = useState<number>(100);
    const [enc1, setEnc1] = useState<number>(80);
    const [enc2, setEnc2] = useState<number>(50);
    const [rateMs, setRateMs] = useState<number>(250);
    const [modwheel, setModwheel] = useState<number>(0);
    const [pan, setPan] = useState<number>(64);
    const [noteName, setNoteName] = useState<string>("C4");
    const [chordKeyDetection, setChordKeyDetection] = useState<string>("");
    const [patternDetection, setPatternDetection] = useState<string>("");

    // MIDI keyboard keys and mapping
    const keyboardKeys = [
        { note: 0, key: 'a', label: 'C' },
        { note: 2, key: 's', label: 'D' },
        { note: 4, key: 'd', label: 'E' },
        { note: 5, key: 'f', label: 'F' },
        { note: 7, key: 'g', label: 'G' },
        { note: 9, key: 'h', label: 'A' },
        { note: 11, key: 'j', label: 'B' },
        { note: 12, key: 'k', label: 'C' },
        { note: 14, key: 'l', label: 'D' },
        { note: 16, key: ';', label: 'E' },
        { note: 17, key: "'", label: 'F' }
    ];
    const blackKeys = [
        { note: 1, key: 'w', label: 'C#', x: 40 },
        { note: 3, key: 'e', label: 'Eb', x: 100 },
        { note: 6, key: 't', label: 'F#', x: 220 },
        { note: 8, key: 'y', label: 'G#', x: 280 },
        { note: 10, key: 'u', label: 'Bb', x: 340 },
        { note: 13, key: 'o', label: 'C#', x: 460 },
        { note: 15, key: 'p', label: 'Eb', x: 520 },
        { note: 20, key: ']', label: 'F#', x: 640 }
    ];
    // Play note on keyboard click
    const playKeyboardNote = (note: number) => {
        if ((window as any).kasmWebMIDI && (window as any).kasmWebMIDI.currentMidiOutput) {
            (window as any).kasmWebMIDI.sendNoteOn(note, velocity, selectedChannel);
        }
    };

    // Helper: Convert MIDI number to note name
    const midiToNoteName = (num: number) => {
        const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        return `${names[num % 12]}${Math.floor(num / 12 - 1)}`;
    };
    // Helper: Convert note name to MIDI number
    const noteNameToMidi = (name: string) => {
        const regex = /^([A-G]#?)(-?\d+)$/;
        const match = name.trim().toUpperCase().replace('B#','C').replace('E#','F').match(regex);
        if (!match) return rootNote;
        const note = match[1];
        const octave = parseInt(match[2], 10);
        const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        const idx = names.indexOf(note);
        if (idx < 0) return rootNote;
        return (octave + 1) * 12 + idx;
    };

    // Sync noteName/rootNote
    useEffect(() => {
        setNoteName(midiToNoteName(rootNote));
    }, [rootNote]);
    const handleNoteNameChange = (val: string) => {
        setNoteName(val);
        const midi = noteNameToMidi(val);
        setRootNote(midi);
    };

    // Enumerate MIDI devices
    const refreshMidiDevices = () => {
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess().then(midiAccess => {
                const outputs: { id: string; name: string }[] = [];
                midiAccess.outputs.forEach((output: any) => {
                    outputs.push({ id: output.id, name: output.name });
                });
                setMidiDevices(outputs);
            }).catch(() => setMidiDevices([]));
        }
    };

    useEffect(() => {
        refreshMidiDevices();
    }, []);

    useEffect(() => {
        // Set the selected MIDI output on kasmWebMIDI
        if ((window as any).kasmWebMIDI && selectedDeviceId) {
            navigator.requestMIDIAccess().then(midiAccess => {
                let selectedOutput = null;
                midiAccess.outputs.forEach((output: any) => {
                    if (output.id === selectedDeviceId) {
                        selectedOutput = output;
                    }
                });
                if (selectedOutput) {
                    (window as any).kasmWebMIDI.currentMidiOutput = selectedOutput;
                }
            });
        }
    }, [selectedDeviceId]);

    const handlePlay = () => {
        if (!(window as any).kasmWebMIDI) {
            setPlaybackStatus('No MIDI device selected');
            return;
        }
        try {
            const notesData = JSON.parse(notesJson);
            const notes = notesData.notes || [];
            if (notes.length === 0) {
                setPlaybackStatus('No notes');
                return;
            }
            const success = (window as any).kasmWebMIDI.playMidiClip(notes, {
                tempo,
                channel: selectedChannel,
                loop: false,
                algorithm: selectedAlgorithmDropdown,
                rootNote,
                semitone,
                velocity,
                enc1,
                enc2,
                rateMs,
                modwheel,
                pan
            });
            if (success) {
                setIsPlaying(true);
                setPlaybackStatus('Playing...');
                setTimeout(() => {
                    setIsPlaying(false);
                    setPlaybackStatus('');
                }, 5000);
            }
        } catch (err) {
            setPlaybackStatus('Error playing clip');
        }
    };

    const handleStop = () => {
        if ((window as any).kasmWebMIDI) {
            (window as any).kasmWebMIDI.stopPlayback();
        }
        setIsPlaying(false);
        setPlaybackStatus('Stopped');
    };

    const defaultNotesJson = JSON.stringify({ notes: [{ pitch: 60, velocity: 100, duration: 480 }] }, null, 2);

    const drawMidiClip = (result) => {
        // TODO: Implement MIDI clip visualization on canvas
        // For now, just clear the canvas
        const canvas = document.getElementById('kasmHTMLCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Draw notes if result.notes exists
            if (result && result.notes) {
                result.notes.forEach((note, i) => {
                    ctx.fillStyle = '#4CAF50';
                    ctx.fillRect(i * 10, canvas.height - note.pitch, 8, 8);
                });
            }
        }
    };

    const autoTransform = () => {
        // Synchronize rate and tempo
        if (rateMs > 0) {
            const bpm = Math.round(60000 / rateMs) / 2;
            if (bpm >= 20 && bpm <= 999 && tempo !== bpm) setTempo(bpm);
        }
        if (tempo > 0) {
            const rate = Math.round(60000 / tempo) / 2;
            if (rate >= 30 && rate <= 1500 && rateMs !== rate) setRateMs(rate);
        }
        let inputNotes;
        try {
            inputNotes = JSON.parse(notesJson);
        } catch (e) {
            setPlaybackStatus('Invalid JSON input: ' + e.message);
            setNotesJson(JSON.stringify({ notes: [] }, null, 2));
            drawMidiClip({ notes: [] });
            return;
        }
        try {
            // WASM transform call
            const result = (window as any).kasm_rust?.kasm_transform_notes(
                inputNotes,
                rateMs,
                rootNote,
                semitone,
                velocity,
                enc1,
                enc2,
                selectedAlgorithmDropdown
            );
            setNotesJson(JSON.stringify(result, null, 2));
            drawMidiClip(result);
            setPlaybackStatus('');
            // Auto-play MIDI after short delay
            if ((window as any).kasmWebMIDI?.currentMidiOutput && result?.notes?.length > 0) {
                setTimeout(() => {
                    (window as any).kasmWebMIDI.playMidiClip(result.notes, {
                        tempo,
                        channel: selectedChannel,
                        loop: false,
                        algorithm: selectedAlgorithmDropdown,
                        rootNote,
                        semitone,
                        velocity,
                        enc1,
                        enc2,
                        rateMs,
                        modwheel,
                        pan
                    });
                }, 500);
            }
            // Pattern/chord detection stub
            setChordKeyDetection(result.chordKeyDetection || '');
            setPatternDetection(result.patternDetection || '');
        } catch (err) {
            setPlaybackStatus('Error: ' + err.message);
            setNotesJson(JSON.stringify({ notes: [] }, null, 2));
            drawMidiClip({ notes: [] });
        }
    };

    const loadDefaultExample = () => {
        setSelectedAlgorithmDropdown(0);
        setNotesJson(defaultNotesJson);
        setChordKeyDetection('');
        setPatternDetection('');
    };

    // Debounce autoTransform
    const autoTransformTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    const debouncedAutoTransform = () => {
        if (autoTransformTimeoutRef.current) {
            clearTimeout(autoTransformTimeoutRef.current);
        }
        autoTransformTimeoutRef.current = setTimeout(() => {
            autoTransform();
        }, 100);
    };

    return (
        <div className="emanator-main-ui" data-testid="emanator-root" style={{ padding: '2em' }}>
            <h1 style={{ fontSize: '2.5em', marginBottom: '0.5em' }}>Emanator MIDI Arpeggiator Editor</h1>
            <p style={{ marginBottom: '2em' }}>
                WebMIDI Emanator MIDI Pattern Browser and Editor Tool.<br />
                <em>Mechanism to view emanators and edit them coming soon...</em>
            </p>
            <div style={{ margin: '20px 0' }}>
                <div style={{ margin: '10px 0', padding: '10px', background: '#f9f9f9' }}>
                    Connect to your MIDI device... (you might need a <a href="https://help.ableton.com/hc/en-us/articles/209774225-Setting-up-a-virtual-MIDI-bus" target="_blank">virtual MIDI bus</a>)
                    <div style={{ marginBottom: '10px' }}>
                        <label>
                            <select style={{ padding: '3px', marginLeft: '10px' }}
                                value={selectedDeviceId}
                                onChange={e => setSelectedDeviceId(e.target.value)}>
                                <option value="">Select MIDI Device...</option>
                                {midiDevices.map(device => (
                                    <option key={device.id} value={device.id}>{device.name}</option>
                                ))}
                            </select>
                        </label>
                        <button style={{ marginLeft: '10px', padding: '3px 8px' }} onClick={refreshMidiDevices}>&lt;</button>
                        <label style={{ marginLeft: '20px' }}>
                            MIDI Channel:
                            <select style={{ padding: '3px', width: '40px', marginLeft: '10px' }}
                                value={selectedChannel}
                                onChange={e => setSelectedChannel(Number(e.target.value))}>
                                {[...Array(16)].map((_, i) => (
                                    <option key={i} value={i}>{i + 1}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <button style={{ padding: '5px 15px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }} onClick={handlePlay}>&gt;</button>
                    <button style={{ padding: '5px 15px', background: '#f44336', color: 'white', border: 'none', cursor: 'pointer', marginLeft: '10px' }} onClick={handleStop}>!</button>
                    <span style={{ marginLeft: '15px', fontWeight: 'bold' }}>{playbackStatus}</span>
                </div>
                <div style={{ margin: '10px 0', padding: '10px', background: '#f9f9f9' }}>
                    <div style={{ marginTop: '20px' }}>
                        <label>Choose an Emanator algorithm (inlet_5):<br />
                            <div style={{ marginBottom: '10px' }}>
                                {algorithmOptions.map(opt => (
                                    <label key={opt.value} style={{ marginRight: '15px' }}>
                                        <input
                                            type="radio"
                                            name="emanatorQuick"
                                            value={opt.value}
                                            checked={selectedAlgorithm === opt.value}
                                            onChange={() => setSelectedAlgorithm(opt.value)}
                                        />
                                        {opt.label}
                                    </label>
                                ))}
                            </div>
                        </label>
                    </div>
                    <div style={{ margin: '10px 0', padding: '10px', background: '#f1f1f1' }}>
                        <label style={{ marginRight: '20px' }}>
                            Tempo:
                            <input
                                type="number"
                                min={30}
                                max={300}
                                value={tempo}
                                onChange={e => setTempo(Number(e.target.value))}
                                style={{ marginLeft: '10px', width: '60px', padding: '3px' }}
                            />
                        </label>
                        <label style={{ display: 'block', marginTop: '10px' }}>
                            Notes JSON:
                            <textarea
                                value={notesJson}
                                onChange={e => setNotesJson(e.target.value)}
                                rows={4}
                                style={{ width: '100%', fontFamily: 'monospace', marginTop: '5px' }}
                            />
                        </label>
                    </div>
                </div>
                <div style={{ margin: '10px 0', padding: '10px', background: '#f9f9f9' }}>
                    <label>
                        Algorithm:
                        <select
                            value={selectedAlgorithmDropdown}
                            onChange={e => { setSelectedAlgorithmDropdown(Number(e.target.value)); debouncedAutoTransform(); }}
                            style={{ padding: '3px', marginLeft: '10px', width: '80%' }}
                        >
                            {algorithmDropdownOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </label>
                    <br />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', margin: '20px 0' }}>
                        {/* Root Note Dial/Slider and MIDI Name Input */}
                        <div style={{ textAlign: 'center' }}>
                            <label>Root Note<br/>(inlet_0)</label><br/>
                            <input type="range" min={0} max={127} value={rootNote} onChange={e => setRootNote(Number(e.target.value))} style={{ width: '60px' }} />
                            <input type="number" min={0} max={127} value={rootNote} onChange={e => setRootNote(Number(e.target.value))} style={{ width: '60px', margin: '5px' }} />
                            <input type="text" value={noteName} onChange={e => handleNoteNameChange(e.target.value)} style={{ width: '45px', textAlign: 'center', fontSize: '12px', color: '#666', padding: '2px' }} title="Type note name (e.g. C4, F#3, Bb5)" />
                            <div style={{ fontSize: '12px', color: '#888' }}>{`MIDI: ${rootNote} (${midiToNoteName(rootNote)})`}</div>
                        </div>
                        {/* Semitone Offset Dial/Slider and Number Input */}
                        <div style={{ textAlign: 'center' }}>
                            <label>Semitone Offset<br/>(inlet_1)</label><br/>
                            <input type="range" min={-127} max={127} value={semitone} onChange={e => setSemitone(Number(e.target.value))} style={{ width: '60px' }} />
                            <input type="number" min={-127} max={127} value={semitone} onChange={e => setSemitone(Number(e.target.value))} style={{ width: '60px', margin: '5px' }} />
                        </div>
                        {/* Velocity Dial/Slider and Number Input */}
                        <div style={{ textAlign: 'center' }}>
                            <label>Velocity<br/>(inlet_2)</label><br/>
                            <input type="range" min={0} max={127} value={velocity} onChange={e => setVelocity(Number(e.target.value))} style={{ width: '60px' }} />
                            <input type="number" min={0} max={127} value={velocity} onChange={e => setVelocity(Number(e.target.value))} style={{ width: '60px', margin: '5px' }} />
                        </div>
                        {/* Enc1 Dial/Slider and Number Input */}
                        <div style={{ textAlign: 'center' }}>
                            <label>Enc1<br/>(inlet_3)</label><br/>
                            <input type="range" min={0} max={127} value={enc1} onChange={e => setEnc1(Number(e.target.value))} style={{ width: '60px' }} />
                            <input type="number" min={0} max={127} value={enc1} onChange={e => setEnc1(Number(e.target.value))} style={{ width: '60px', margin: '5px' }} />
                        </div>
                        {/* Enc2 Dial/Slider and Number Input */}
                        <div style={{ textAlign: 'center' }}>
                            <label>Enc2<br/>(inlet_4)</label><br/>
                            <input type="range" min={0} max={127} value={enc2} onChange={e => setEnc2(Number(e.target.value))} style={{ width: '60px' }} />
                            <input type="number" min={0} max={127} value={enc2} onChange={e => setEnc2(Number(e.target.value))} style={{ width: '60px', margin: '5px' }} />
                        </div>
                        {/* Rate Dial/Slider and Number Input */}
                        <div style={{ textAlign: 'center' }}>
                            <label>Rate<br/>(ms)</label><br/>
                            <input type="range" min={30} max={1500} value={rateMs} onChange={e => setRateMs(Number(e.target.value))} style={{ width: '60px' }} />
                            <input type="number" min={30} max={1500} value={rateMs} onChange={e => setRateMs(Number(e.target.value))} style={{ width: '60px', margin: '5px' }} />
                        </div>
                        {/* Modwheel and Pan Sliders/Number Inputs */}
                        <div style={{ textAlign: 'center' }}>
                            <label>Modwheel CC#1</label><br/>
                            <input type="range" min={0} max={127} value={modwheel} onChange={e => setModwheel(Number(e.target.value))} style={{ width: '120px', marginRight: '10px' }} />
                            <input type="number" min={0} max={127} value={modwheel} onChange={e => setModwheel(Number(e.target.value))} style={{ width: '50px', textAlign: 'center', marginRight: '20px' }} />
                            <label>Pan CC#10</label><br/>
                            <input type="range" min={0} max={127} value={pan} onChange={e => setPan(Number(e.target.value))} style={{ width: '120px', marginRight: '10px' }} />
                            <input type="number" min={0} max={127} value={pan} onChange={e => setPan(Number(e.target.value))} style={{ width: '50px', textAlign: 'center' }} />
                        </div>
                    </div>
                </div>
                <div style={{ margin: '10px 0', padding: '10px', background: '#f9f9f9' }}>
                    <label>Choose an Emanator algorithm (quick select):<br/>
                        <div style={{ marginBottom: '10px' }}>
                            <label><input type="radio" name="emanatorQuick"
                                checked={selectedAlgorithmDropdown === 2}
                                onChange={() => { setSelectedAlgorithmDropdown(2); autoTransform(); }} />
                                Emanator</label>
                            <label style={{ marginLeft: '15px' }}><input type="radio" name="emanatorQuick"
                                checked={selectedAlgorithmDropdown === 63}
                                onChange={() => { setSelectedAlgorithmDropdown(63); autoTransform(); }} />
                                Looper</label>
                            <label style={{ marginLeft: '15px' }}><input type="radio" name="emanatorQuick"
                                checked={selectedAlgorithmDropdown === 93}
                                onChange={() => { setSelectedAlgorithmDropdown(93); autoTransform(); }} />
                                Bangaz</label>
                            <label style={{ marginLeft: '15px' }}><input type="radio" name="emanatorQuick"
                                checked={selectedAlgorithmDropdown === 169}
                                onChange={() => { setSelectedAlgorithmDropdown(169); autoTransform(); }} />
                                Arpeggiator</label>
                            <label style={{ marginLeft: '15px' }}><input type="radio" name="emanatorQuick"
                                checked={selectedAlgorithmDropdown === 83}
                                onChange={() => { setSelectedAlgorithmDropdown(83); autoTransform(); }} />
                                Shuffle</label>
                            <label style={{ marginLeft: '15px' }}><input type="radio" name="emanatorQuick"
                                checked={selectedAlgorithmDropdown === 148}
                                onChange={() => { setSelectedAlgorithmDropdown(148); autoTransform(); }} />
                                LFO</label>
                            <label style={{ marginLeft: '15px' }}><input type="radio" name="emanatorQuick"
                                checked={selectedAlgorithmDropdown === 6}
                                onChange={() => { setSelectedAlgorithmDropdown(6); autoTransform(); }} />
                                Chords</label>
                            <label style={{ marginLeft: '15px' }}><input type="radio" name="emanatorQuick"
                                checked={selectedAlgorithmDropdown === 82}
                                onChange={() => { setSelectedAlgorithmDropdown(82); autoTransform(); }} />
                                Patterns</label>
                            <label style={{ marginLeft: '15px' }}><input type="radio" name="emanatorQuick"
                                checked={selectedAlgorithmDropdown === 75}
                                onChange={() => { setSelectedAlgorithmDropdown(75); autoTransform(); }} />
                                Counterpoint</label>
                            <label style={{ marginLeft: '15px' }}><input type="radio" name="emanatorQuick"
                                checked={selectedAlgorithmDropdown === 80}
                                onChange={() => { setSelectedAlgorithmDropdown(80); autoTransform(); }} />
                                Drum Rack</label>
                            <label style={{ marginLeft: '15px' }}><input type="radio" name="emanatorQuick"
                                checked={selectedAlgorithmDropdown === 46}
                                onChange={() => { setSelectedAlgorithmDropdown(46); autoTransform(); }} />
                                Chaos!</label>
                            <label style={{ marginLeft: '15px' }}><input type="radio" name="emanatorQuick"
                                checked={selectedAlgorithmDropdown === 0}
                                onChange={() => { loadDefaultExample(); autoTransform(); }} />
                                Reset</label>
                        </div>
                    </label>
                </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <div id="midiKeyboard" style={{ border: '2px solid #333', background: '#f0f0f0', height: '120px', width: '100%', position: 'relative', borderRadius: '4px', overflow: 'hidden' }}>
                    <svg width="700" height="120" style={{ display: 'block' }}>
                        <g id="whiteKeys">
                            {keyboardKeys.map((k, i) => (
                                <g key={k.note}>
                                    <rect x={i * 60} y={0} width={60} height={120} fill="white" stroke="#333" strokeWidth={1} rx={0} ry={0}
                                        onClick={() => playKeyboardNote(k.note)} style={{ cursor: 'pointer' }} />
                                    <text x={i * 60 + 30} y={110} textAnchor="middle" fontSize={12} fill="#666">{k.label}</text>
                                    <text x={i * 60 + 30} y={100} textAnchor="middle" fontSize={10} fill="#999">{k.key}</text>
                                </g>
                            ))}
                        </g>
                        <g id="blackKeys">
                            {blackKeys.map((k, i) => (
                                <g key={k.note}>
                                    <rect x={k.x} y={0} width={40} height={80} fill="#333" stroke="#000" strokeWidth={1} rx={0} ry={0}
                                        onClick={() => playKeyboardNote(k.note)} style={{ cursor: 'pointer' }} />
                                    <text x={k.x + 20} y={70} textAnchor="middle" fontSize={10} fill="white">{k.label}</text>
                                    <text x={k.x + 20} y={60} textAnchor="middle" fontSize={10} fill="#ccc">{k.key}</text>
                                </g>
                            ))}
                        </g>
                    </svg>
                </div>
                <div>
                    KEYS: Play notes: a-' | Octave: z=down, x=up | Velocity: c=down, v=up
                </div>
            </div>
            <div id="chordKeyDetection" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{chordKeyDetection}</div>
            <div id="patternDetection" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{patternDetection}</div>
            <div style={{ marginBottom: '20px' }}>
                <div id="midiClipView" style={{ border: '2px solid #333', background: '#1a1a1a', height: '600px', width: '100%', position: 'relative', overflowY: 'auto', overflowX: 'hidden', borderRadius: '4px' }}>
                    <canvas id="midiCanvas" width={1600} height={1200} style={{ display: 'block', width: '100%', height: '600px' }} />
                </div>
            </div>
            <canvas
                id="kasmHTMLCanvas"
                width={600}
                height={150}
                style={{
                    width: '600px',
                    height: '150px',
                    border: '2px solid #333',
                    background: '#000',
                    display: 'block',
                    margin: '10px 0'
                }}
            />
        </div>
    );
};

export default Emanator;
