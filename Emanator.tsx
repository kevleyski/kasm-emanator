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
                algorithm: selectedAlgorithm
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
