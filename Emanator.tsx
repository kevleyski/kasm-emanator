import React, { useEffect, useState } from 'react';

// Type for MIDIOutput (from Web MIDI API)
type MIDIOutput = {
    id: string;
    name: string;
};
// Extend window for kasmWebMIDI
interface KasmWindow extends Window {
    kasmWebMIDI?: {
        setCurrentMidiOutput: (id: string) => void;
    };
}

const Emanator: React.FC = () => {
    // MIDI device and channel state
    const [midiDevices, setMidiDevices] = useState<MIDIOutput[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
    const [selectedChannel, setSelectedChannel] = useState<number>(0);

    // Enumerate MIDI devices
    const refreshMidiDevices = () => {
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess().then(midiAccess => {
                const outputs: MIDIOutput[] = [];
                midiAccess.outputs.forEach((output: any) => {
                    outputs.push({ id: output.id, name: output.name ?? 'Unknown Device' });
                });
                setMidiDevices(outputs);
            }).catch(() => setMidiDevices([]));
        }
    };

    useEffect(() => {
        refreshMidiDevices();
    }, []);

    // Handle MIDI device selection
    const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDeviceId(e.target.value);
        const win = window as KasmWindow;
        if (win.kasmWebMIDI) {
            win.kasmWebMIDI.setCurrentMidiOutput(e.target.value);
        }
    };

    // Handle MIDI channel selection
    const handleChannelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedChannel(Number(e.target.value));
    };

    return (
        <div style={{ padding: '2em' }}>
                WebMIDI Emanator MIDI Pattern Browser and Editor Tool.<br />
            <div style={{ margin: '20px 0' }}>
                <div>
                    Connect to your MIDI device... (you might need a <a href="https://help.ableton.com/hc/en-us/articles/209774225-Setting-up-a-virtual-MIDI-bus" target="_blank">virtual MIDI bus</a>)
                    <div style={{ marginBottom: '10px' }}>
                        <label>
                            <select style={{ padding: '3px', marginLeft: '10px' }}
                                value={selectedDeviceId}
                                onChange={handleDeviceChange}>
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
                                onChange={handleChannelChange}>
                                {[...Array(16)].map((_, i) => (
                                    <option key={i} value={i}>{i + 1}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Emanator;
