import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from '../App';

// Mock Google Maps
global.window.google = {
  maps: {
    Map: jest.fn(() => ({
      addListener: jest.fn(),
      setMap: jest.fn()
    })),
    Marker: jest.fn(() => ({
      addListener: jest.fn(),
      setMap: jest.fn()
    })),
    SymbolPath: {
      CIRCLE: 'circle'
    }
  }
};

describe('AIDNET Application', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('renders AIDNET header', () => {
    render(<App />);
    expect(screen.getByText('AIDNET')).toBeInTheDocument();
    expect(screen.getByText('CONNECTING RESOURCES / BUILDING COMMUNITY')).toBeInTheDocument();
  });

  test('renders all category buttons', () => {
    render(<App />);
    expect(screen.getByText('ALL RESOURCES')).toBeInTheDocument();
    expect(screen.getByText('FOOD BANKS')).toBeInTheDocument();
    expect(screen.getByText('SHELTER')).toBeInTheDocument();
    expect(screen.getByText('TUTORING')).toBeInTheDocument();
    expect(screen.getByText('SUPPORT')).toBeInTheDocument();
  });

  test('loads sample data on first visit', () => {
    render(<App />);
    expect(screen.getByText('FOOD BANK OF LUBBOCK')).toBeInTheDocument();
    expect(screen.getByText('YOUTH EMERGENCY SHELTER')).toBeInTheDocument();
    expect(screen.getByText('FREE MATH TUTORING NEEDED')).toBeInTheDocument();
  });

  test('opens add resource form when button clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const addButton = screen.getByText('+ ADD RESOURCE');
    await user.click(addButton);
    
    expect(screen.getByText('ADD NEW RESOURCE')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('FOOD BANK, SHELTER, TUTORING SERVICE...')).toBeInTheDocument();
  });

  test('filters resources by category', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Click FOOD BANKS category
    const foodButton = screen.getByText('FOOD BANKS');
    await user.click(foodButton);
    
    // Should show food bank but not shelter
    expect(screen.getByText('FOOD BANK OF LUBBOCK')).toBeInTheDocument();
    expect(screen.queryByText('YOUTH EMERGENCY SHELTER')).not.toBeInTheDocument();
  });

  test('shows resource details when clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const resourceCard = screen.getByText('FOOD BANK OF LUBBOCK');
    await user.click(resourceCard);
    
    expect(screen.getByText('806.763.3003')).toBeInTheDocument();
    expect(screen.getByText('MON-FRI 9AM-5PM')).toBeInTheDocument();
  });

  test('closes add resource form when X clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Open form
    const addButton = screen.getByText('+ ADD RESOURCE');
    await user.click(addButton);
    
    // Close form
    const closeButton = screen.getAllByRole('button').find(btn => 
      btn.querySelector('svg')
    );
    await user.click(closeButton);
    
    expect(screen.queryByText('ADD NEW RESOURCE')).not.toBeInTheDocument();
  });

  test('persists data in localStorage', () => {
    render(<App />);
    
    const savedData = localStorage.getItem('aidnet-resources');
    expect(savedData).toBeTruthy();
    
    const parsedData = JSON.parse(savedData);
    expect(parsedData.length).toBeGreaterThan(0);
    expect(parsedData[0].name).toBe('FOOD BANK OF LUBBOCK');
  });
});