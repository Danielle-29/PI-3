import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from '../pages/login/Login'; 
import '@testing-library/jest-dom';

describe('Tela de Login', () => {
  test('renderiza campos de e-mail, senha e botão Entrar', () => {
    render(<Login />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });
});
