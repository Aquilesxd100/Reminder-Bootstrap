const inputLogin = document.querySelector(".input-login");
const inputSenha = document.querySelector(".input-senha");
const repitaSenha = document.querySelector(".repita-input-senha");
const formulario = document.querySelector("form");
const botaoSubmit = document.querySelector("#botao-padrao");
const erroLoginDisponibilidade = document.querySelector(".login-erro-disponibilidade");
const erroSenhaRepetida = document.querySelector(".senha-erro-diferentes");
if (sessionStorage.contaLogada || localStorage.contaLogada) {
    window.open("index.html", "_self");
}
formulario.addEventListener("submit", (event) => {
    event.preventDefault();
    let bancoDados = [];
    let validLogin = validacaoLogin();
    let validSenha = validacaoSenha();
    if (validLogin === true && validSenha === true) {
        if (localStorage.contas) {
            bancoDados = JSON.parse(localStorage.getItem("contas"));
        };
        bancoDados.push({
            login: inputLogin.value,
            senha: inputSenha.value,
            lembretes: [],
        });
        localStorage.contas = JSON.stringify(bancoDados);
        sessionStorage.setItem("notificacao", "Conta criada com sucesso!");
        window.open("index.html", "_self");
    }
});
function validacaoLogin() {
    let contas = [];
    let validacao = true;
    if (localStorage.contas) {
        contas = JSON.parse(localStorage.contas);
        for (conta of contas) {
            if (conta.login === inputLogin.value) {
                validacao = false;
                erroLoginDisponibilidade.style.display="block"; 
                break;
            }
            else {
                erroLoginDisponibilidade.style.display="none"; 
            }
        }
    }
    if (validacao === false) {
        inputLogin.style.border="2px solid #FF0000";
    }
    else {
        inputLogin.style.border="2px solid #2296AA";
    }
    return validacao;
}  
function validacaoSenha() {
    let validacao = true;
    if (inputSenha.value !== repitaSenha.value) {
        erroSenhaRepetida.style.display="block";
        console.log("senha repetida") 
        validacao = false;
    }
    else {
        erroSenhaRepetida.style.display="none"; 
    }
    if (validacao === false) {
        inputSenha.style.border="2px solid #FF0000";
        repitaSenha.style.border="2px solid #FF0000";
    }
    else {
        inputSenha.style.border="2px solid #2296AA";
        repitaSenha.style.border="2px solid #2296AA";
    }
    return validacao;
}
// Efeitos Visuais //
function displayOn () {
    if (inputLogin.value === "") {
        document.querySelector("input.input-login").placeholder="Login";
    }
    if (inputSenha.value === "") {
        document.querySelector("input.input-senha").placeholder="Senha";
    }
    if (repitaSenha !== null) {
        if (repitaSenha.value === "") {
            document.querySelector("input.repita-input-senha").placeholder="Repita a Senha";
        }
    }
}
inputLogin.addEventListener("focusout", displayOn);
inputSenha.addEventListener("focusout", displayOn);
inputLogin.addEventListener("focusin", () => { 
    document.querySelector(".input-login").placeholder="";
});
inputSenha.addEventListener("focusin", () => {
    document.querySelector(".input-senha").placeholder="";
});
if (repitaSenha !== null) {
    repitaSenha.addEventListener("focusout", displayOn);
    repitaSenha.addEventListener("focusin", () => {
        document.querySelector(".repita-input-senha").placeholder="";
    });
}
// Animação Botão //
function botaoMaior(elemento) {
    function off () {
        botao.classList.remove("botao-maior");
    }
    const botao = document.querySelector(elemento);
    botao.classList.add("botao-maior");
    setTimeout(off, 350);
};
function botaoMenor(elemento) {
    function off () {
        botao.classList.remove("botao-menor");
    }
    const botao = document.querySelector(elemento);
    botao.classList.add("botao-menor");
    setTimeout(off, 350);
};