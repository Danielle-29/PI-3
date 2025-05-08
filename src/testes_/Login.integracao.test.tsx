import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../pages/login/Login';
import '@testing-library/jest-dom';

describe('Integração - Tela de Login', () => {
  test('preenche campos e clica no botão Entrar', () => {
    render(<Login />);

    const inputEmail = screen.getByLabelText(/email/i);
    const inputSenha = screen.getByLabelText(/senha/i);
    const botaoEntrar = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(inputEmail, { target: { value: 'teste@email.com' } });
    fireEvent.change(inputSenha, { target: { value: '123456' } });

    expect(inputEmail).toHaveValue('teste@email.com');
    expect(inputSenha).toHaveValue('123456');
    expect(botaoEntrar).toBeInTheDocument();
  });
});
