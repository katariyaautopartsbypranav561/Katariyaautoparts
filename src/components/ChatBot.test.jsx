import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ChatBot from './ChatBot';
import { AuthProvider } from '../context/AuthContext';
import { DataProvider } from '../context/DataContext';

describe('ChatBot Component', () => {
  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = function() {};
  });

  const renderWithProviders = (component) => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            {component}
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  };

  test('renders the chatbot toggle button', () => {
    renderWithProviders(<ChatBot />);
    const toggleButton = screen.getByLabelText(/Open chat assistant/i);
    expect(toggleButton).toBeInTheDocument();
  });

  test('opens chat window when toggle button is clicked', async () => {
    renderWithProviders(<ChatBot />);
    const toggleButton = screen.getByLabelText(/Open chat assistant/i);
    
    // Initial state: chat is closed
    expect(screen.queryByText(/Katariya Auto Parts Assistant/i)).not.toBeInTheDocument();
    
    // Click toggle
    fireEvent.click(toggleButton);
    
    // Wait for animation to finish and chat to open
    await waitFor(() => {
      expect(screen.getAllByText(/Katariya Auto Parts Assistant/i)[0]).toBeInTheDocument();
    });
  });

  test('allows user to enter name', async () => {
    renderWithProviders(<ChatBot />);
    const toggleButton = screen.getByLabelText(/Open chat assistant/i);
    fireEvent.click(toggleButton);
    
    let input;
    await waitFor(() => {
      input = document.querySelector('input[placeholder="Type your message..."]');
      expect(input).toBeInTheDocument();
    }, { timeout: 3000 });

    fireEvent.change(input, { target: { value: 'John' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // It should display the user's message
    await waitFor(() => {
      expect(screen.getAllByText(/John/)[0]).toBeInTheDocument();
    });
  });
});
