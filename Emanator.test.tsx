import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Importing jest-dom to use its matchers
import Emanator from './Emanator';

describe('Emanator component', () => {
  it('renders without crashing', () => {
    render(<Emanator />);
    // Basic smoke test: check for a main container or any element
    // You may want to update this selector based on your component
    expect(screen.getByTestId('emanator-root')).toBeInTheDocument();
  });
});
