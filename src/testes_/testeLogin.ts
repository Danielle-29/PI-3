function validarLogin(email: string, senha: string): boolean {
    const emailLimpo = email.trim();
    return emailLimpo !== "" && senha.length >= 6;
  }
  
  console.log("Teste 1 - Campos preenchidos:");
console.log("Esperado: true → Resultado:", validarLogin("teste@email.com", "123456"));

console.log("\nTeste 2 - E-mail vazio:");
console.log("Esperado: false → Resultado:", validarLogin("", "123456"));

console.log("\nTeste 3 - Senha vazia:");
console.log("Esperado: false → Resultado:", validarLogin("teste@email.com", ""));

console.log("\nTeste 4 - Ambos vazios:");
console.log("Esperado: false → Resultado:", validarLogin("", ""));

console.log("\nTeste 5 - E-mail com espaços:");
console.log("Esperado: true → Resultado:", validarLogin("   teste@email.com   ", "123456"));

console.log("\nTeste 6 - Senha curta:");
console.log("Esperado: false → Resultado:", validarLogin("teste@email.com", "1"));

console.log("\nTeste 7 - E-mail com apenas espaços:");
console.log("Esperado: false → Resultado:", validarLogin("    ", "123456"));

console.log("\nTeste 8 - Senha com 6 caracteres:");
console.log("Esperado: true → Resultado:", validarLogin("teste@email.com", "123456"));

export {};
