const inputLogin = document.querySelector(".input-login");
const inputSenha = document.querySelector(".input-senha");
const checkBox = document.getElementById("input-checkbox");
const formulario = document.querySelector("form");
const botaoSubmit = document.querySelector("#botao-padrao");
const erroLogging = document.querySelector("#erro-logar");
window.addEventListener("click", (event) => {
    let elementosAlvo = [inputLogin, inputSenha, botaoSubmit, erroLogging];
    let clickFora = 0;
    for (c = 0; c < elementosAlvo.length; c++) {
        if (elementosAlvo[c].contains(event.target)) {
        }
        else {
            clickFora++;
        }
    }
    if (clickFora === elementosAlvo.length) {
        erroLogging.style.opacity="0";
    }
})
if (sessionStorage.contaLogada || localStorage.contaLogada) {
    window.open("recados.html", "_self");
}
if (sessionStorage.notificacao) {
    let aviso = document.querySelector(".notificacao");
    let spanMensagem = document.getElementById("notificacao-mensagem");
    aviso.style.display="block";
    spanMensagem.innerText = sessionStorage.notificacao;
    sessionStorage.removeItem("notificacao");
    aviso.classList.add("novaContaAviso");
    setTimeout(() => {
        aviso.style.display="none";  
    }, 5500)
}
formulario.addEventListener("submit", (event) => {
    event.preventDefault();
    if (localStorage.contas) {
        let bancoDados = JSON.parse(localStorage.getItem("contas"));
        let posicao = bancoDados.findIndex((conta) => conta.login === inputLogin.value);
        if (posicao !== -1 && bancoDados[posicao].senha === inputSenha.value) {
            if (checkBox.checked === true) {
                localStorage.contaLogada = JSON.stringify({
                    login: bancoDados[posicao].login,
                    posicao: posicao,
                });
            }
            else {
                sessionStorage.contaLogada = JSON.stringify({
                    login: bancoDados[posicao].login,
                    posicao: posicao,
                });
            }
            window.open("recados.html", "_self");
        }
        else {
            erroLogging.style.opacity="1";
            inputLogin.style.border="2px solid #FF0000";
            inputSenha.style.border="2px solid #FF0000";
        }
    }
    else {
        erroLogging.style.opacity="1";
        inputLogin.style.border="2px solid #FF0000";
        inputSenha.style.border="2px solid #FF0000";
    }
});
// Efeitos Visuais //
function displayOn () {
    if (inputLogin.value === "") {
        document.querySelector("input.input-login").placeholder="Login";
    }
    if (inputSenha.value === "") {
        document.querySelector("input.input-senha").placeholder="Senha";
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
