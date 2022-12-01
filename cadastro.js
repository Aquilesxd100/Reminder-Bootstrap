const inputLogin = document.querySelector(".input-login");
const inputSenha = document.querySelector(".input-senha");
const repitaSenha = document.querySelector(".repita-input-senha");
const formulario = document.querySelector("form");
const botaoSubmit = document.querySelector("#botao-padrao");
const erroLogin = document.querySelector("#erro-login");
const erroSenha = document.querySelector("#erro-senha");
let erroSenhaON = false;
let erroLoginON = false;
let erroCriacaoSenha = () => {};
let erroCriacaoLogin = () => {};
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
        erroLogin.style.opacity="0";
        erroSenha.style.opacity="0";
        window.open("index.html", "_self");
    }
});
window.addEventListener("click", (event) => {
    let elementosAlvo = [inputLogin, inputSenha, repitaSenha, erroLogin, erroSenha, botaoSubmit];
    let clickFora = 0;
    for (c = 0; c < elementosAlvo.length; c++) {
        if (elementosAlvo[c].contains(event.target)) {
        }
        else {
            clickFora++;
        }
    }
    if (clickFora === elementosAlvo.length) {
        if (erroSenhaON === true) {
            erroSenhaON = false;
            erroSenha.style.opacity="0";
            erroCriacaoLogin();
            erroCriacaoLogin = () => {};
        }
        else if (erroLoginON === true) {
            erroLoginON = false;
            erroLogin.style.opacity="0";
            erroCriacaoSenha();
            erroCriacaoSenha = () => {};
        }
    }
})
function validacaoLogin() {
    let contas = [];
    let validacao = true;
    if (localStorage.contas) {
        contas = JSON.parse(localStorage.contas);
        for (conta of contas) {
            if (conta.login === inputLogin.value) {
                validacao = false;
                document.getElementById("img-login-repetido").src="img/erro.png";
                break;
            }
            else {
                document.getElementById("img-login-repetido").src="img/confirmacao.png";
            }
        }
    }
    if (inputLogin.value.length < 4) {
        validacao = false;
        document.getElementById("img-login-digitos").src="img/erro.png";
    }  
    else {
        document.getElementById("img-login-digitos").src="img/confirmacao.png";
    }
    if (inputLogin.value !== inputLogin.value.toLowerCase()) {
        validacao = false;
        document.getElementById("img-login-minusculo").src="img/erro.png";
    }
    else {
        document.getElementById("img-login-minusculo").src="img/confirmacao.png";
    }
    if (validacao === false) {
        if (erroSenhaON === false) {
            erroLoginON = true;
            erroLogin.style.opacity="1";
        }
        else {
            erroCriacaoLogin = () => {
                erroLogin.style.opacity="1";
                erroLoginON = true;
            };
        }
        inputLogin.style.border="2px solid #FF0000";
    }
    else {
        erroCriacaoLogin = () => {};
        erroLoginON = false;
        erroLogin.style.opacity="0";
        inputLogin.style.border="2px solid #2296AA";
        erroCriacaoSenha();
        erroCriacaoSenha = () => {};
    }
    return validacao;
}  
function validacaoSenha() {
    let validacao = true;
    let letras = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    let checkLetra = () => {
        for (letra of letras) {
            if (inputSenha.value.includes(letra) === true) {
                return true;
            }
        };
        return false;
    };
    let checkNumero = () => {
        for (c = 0; c <= 9; c++) {
            if (inputSenha.value.includes(c) === true) {
                return true;
            }
        }
        return false;
    };
    if (inputSenha.value.length < 4) {
        document.getElementById("img-senha-digitos").src="img/erro.png";
        validacao = false;
    }
    else {
        document.getElementById("img-senha-digitos").src="img/confirmacao.png";
    }
    if (inputSenha.value !== repitaSenha.value) {
        document.getElementById("img-senha-senhas-iguais").src="img/erro.png";
        validacao = false;
    }
    else {
        document.getElementById("img-senha-senhas-iguais").src="img/confirmacao.png";
    }
    if (checkLetra() === false || checkNumero() === false) {
        document.getElementById("img-senha-letra-numero").src="img/erro.png";
        validacao = false;
    }
    else {
        document.getElementById("img-senha-letra-numero").src="img/confirmacao.png";
    }
    if (validacao === false) {
        if (erroLoginON === false) {
            erroSenhaON = true;
            erroSenha.style.opacity="1";
        }
        else {
            erroCriacaoSenha = () => {
                erroSenha.style.opacity="1";
                erroSenhaON = true;
            };
        }
        inputSenha.style.border="2px solid #FF0000";
        repitaSenha.style.border="2px solid #FF0000";
    }
    else {
        erroCriacaoSenha = () => {};
        erroSenhaON = false;
        erroSenha.style.opacity="0";
        inputSenha.style.border="2px solid #2296AA";
        repitaSenha.style.border="2px solid #2296AA";
        erroCriacaoLogin();
        erroCriacaoLogin = () => {};
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