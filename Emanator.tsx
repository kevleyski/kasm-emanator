import React from 'react';

const Emanator: React.FC = () => {
    return (
        <div className="emanator-main-ui" data-testid="emanator-root" style={{ padding: '2em' }}>
            <h1 style={{ fontSize: '2.5em', marginBottom: '0.5em' }}>Emanator MIDI Arpeggiator Editor</h1>
            <p style={{ marginBottom: '2em' }}>
                WebMIDI Emanator MIDI Pattern Browser and Editor Tool.<br />
                <em>Mechanism to view emanators and edit them coming soon...</em>
            </p>
        </div>
    );
};

export default Emanator;
