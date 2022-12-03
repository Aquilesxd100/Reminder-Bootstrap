const body = document.querySelector("body");
const botaoAdicionar = document.querySelector(".botao-adicionar button");
const imgBotaoAdicionar = document.querySelector(".botao-adicionar img");
const formulario = document.querySelector("form");
const inputAcao = document.getElementById("input-acao");
const inputData = document.getElementById("input-data");
const inputHora = document.getElementById("input-hora");
const inputDescricao = document.getElementById("input-descricao");
const menuLembretes = document.querySelector(".menu");
const divAdicionar = document.querySelector(".botao-adicionar");
const nomeConta = document.getElementById("nome-usuario");
const localLembretes = document.getElementById("tabela-lembretes");
const avisoLembretesVazio = document.querySelector(".aviso-base");
const avisoExclusaoConta = document.querySelector(".notifi-exclusao-conta")
let logado = {};
let menu = ["", ""];
if (!sessionStorage.contaLogada && !localStorage.contaLogada) {
    window.open("index.html", "_self");
}
else {
    if (sessionStorage.contaLogada) {
        logado = JSON.parse(sessionStorage.contaLogada);
    }
    else {
        logado = JSON.parse(localStorage.contaLogada);
    }
    nomeConta.innerText = logado.login;
}
listarLembretes();
function listarLembretes() {
    let bancoDados = JSON.parse(localStorage.contas);
    let posicao = logado.posicao;
    if (bancoDados[posicao].lembretes.length !== 0) {
        avisoLembretesVazio.style.display="none";
        localLembretes.innerHTML = `
        <tr class="espacamento"> 
            <th colspan="4"></th>
        </tr>`;
        let lembretesOrganizados = ordenarPorData(bancoDados[posicao].lembretes);
        for (lembrete of lembretesOrganizados) {
            localLembretes.innerHTML +=            
            `<tr class="acao-data-hora sombra-lateral">
                <th class="acao"><span>Ação: </span>${lembrete.acao}</th>
                <th><span>Data: </span>${lembrete.data}</th>
                <th class="hora"><span>Hora(s): </span>${lembrete.hora}</th>
                <th class="botoes sombra desktop">
                    <button class="botao-editar btn-warning btn btn-sm" onclick="editar('${lembrete.id}'); botaoMaior(this)">Editar</button>
                    <button class="botao-apagar btn-danger btn btn-sm" onclick="apagar('${lembrete.id}'); botaoMaior(this)">Apagar</button>
                </th>
            </tr>
            <tr class="sombra-lateral">
                <th colspan="4" class="sombra descricao"><span>Descrição: </span>${lembrete.descricao}</th>
            </tr>
            <tr class="mobile">
                <th class="botoes d-flex justify-content-center">
                    <button class="botao-editar btn-warning btn btn-sm mx-2" onclick="editar('${lembrete.id}'); botaoMaior(this)">Editar</button>
                    <button class="botao-apagar btn-danger btn btn-sm mx-2" onclick="apagar('${lembrete.id}'); botaoMaior(this)">Apagar</button>
                </th>
            </tr>
            <tr class="espacamento"> 
               <th colspan="4"></th>
            </tr>`;            
        }
    }
    else {
        localLembretes.innerHTML = "";
        avisoLembretesVazio.style.display="flex";
    }
}
function adicionarLembrete() {
    function off () {
        divAdicionar.classList.remove("botao-maior");
    }
    divAdicionar.classList.add("botao-maior");
    setTimeout(off, 350);
    menu[0] = "adicao";
    menuLembretesON(true);
}
function botaoDeslogar() {
    localStorage.removeItem("contaLogada");
    sessionStorage.removeItem("contaLogada");
    window.open("index.html", "_self");
}
function editar(id) {
    let bancoDados = JSON.parse(localStorage.contas);
    let posicao = logado.posicao;
    let lembretes = bancoDados[posicao].lembretes;
    menu[0] = "edicao";
    menu[1] = id;
    for (lembrete of lembretes) {
        if (lembrete.id === id) {
            inputAcao.value = lembrete.acao;
            inputData.value = conversorData(lembrete.data, false);
            inputHora.value = lembrete.hora;
            inputDescricao.value = lembrete.descricao;
            break;
        }
    }
    menuLembretesON(true);
}
function apagar(id) {
    let bancoDados = JSON.parse(localStorage.contas);
    let posicao = logado.posicao;
    let lembretes = bancoDados[posicao].lembretes.filter(lembrete => lembrete.id !== id);
    bancoDados[posicao].lembretes = lembretes;
    localStorage.contas = JSON.stringify(bancoDados);
    listarLembretes();
}
formulario.addEventListener("submit", (event) => {
    event.preventDefault();
    let bancoDados = JSON.parse(localStorage.contas);
    let posicao = logado.posicao;
    if (menu[0] === "adicao") {
        bancoDados[posicao].lembretes.push({
            id: geradorID(),
            acao: inicialMaiuscula(inputAcao.value),
            data: conversorData(inputData.value, true),
            hora: inputHora.value,
            descricao: inicialMaiuscula(inputDescricao.value),
        }); 
        localStorage.contas = JSON.stringify(bancoDados);
        menuLembretesON(false);
        formulario.reset();
        menu[0] = "";
        menu[1] = "";
        listarLembretes();
    }
    else if (menu[0] === "edicao") {
        bancoDados[posicao].lembretes = bancoDados[posicao].lembretes.map((lembrete) => {
            if (lembrete.id === menu[1]) {
                return {
                    id: menu[1],
                    acao: inicialMaiuscula(inputAcao.value),
                    data: conversorData(inputData.value, true),
                    hora: inputHora.value,
                    descricao: inicialMaiuscula(inputDescricao.value),
                }
            }
            return lembrete;
        });
        menu[0] = "";
        menu[1] = "";
        formulario.reset();
        menuLembretesON(false);
        localStorage.contas = JSON.stringify(bancoDados);
        listarLembretes();
    }
})
function cancelaLembrete() {
    menuLembretesON(false);
    menu[0] = "";
    menu[1] = "";
    formulario.reset();
}
function notificacaoExclusaoConta(tipo) {
    if (tipo === true) {
        avisoExclusaoConta.style.opacity="1";
        avisoExclusaoConta.style.pointerEvents="all";
        body.classList.add("fundo-travado");
    }
    else {
        avisoExclusaoConta.style.opacity="0";
        avisoExclusaoConta.style.pointerEvents="none";
        body.classList.remove("fundo-travado");
    }
}
function excluirConta() {
    let bancoDados = JSON.parse(localStorage.contas);
    bancoDados = bancoDados.filter((conta) => conta.login !== logado.login)
    localStorage.contas = JSON.stringify(bancoDados);
    sessionStorage.notificacao = "Conta excluída com sucesso!";
    sessionStorage.removeItem("contaLogada");
    localStorage.removeItem("contaLogada");
    window.open("index.html", "_self");
}
// Funções Auxiliares //
function inicialMaiuscula(texto) {
    texto = texto.toLowerCase();
    let letra1 = texto.substring(0, 1);
    return texto.replace(letra1, (letra1.toUpperCase()));
}
function geradorID() {
    let contador = 0;
    if (localStorage.identificador) {
      contador = Number(localStorage.identificador);
    }
    contador++;
    localStorage.identificador = contador;
    return ("id" + contador);
}
function conversorData(data, tipo) {
    if (tipo === true) {
        let ano = data.substring(0, 4);
        let mes = data.substring(5, 7);
        let dia = data.substring(8, 10);
        return `${dia}/${mes}/${ano}`;
    }
    else {
        let dia = data.substring(0, 2);
        let mes = data.substring(3, 5);
        let ano = data.substring(6, 10);
        return `${ano}-${mes}-${dia}`;
    }
}
function ordenarPorData(lembretes) {
    let lembretesFiltrados = [];
    while (lembretes.length !== 0) {
        let lembreteMenor = lembretes[0];
        for (lembrete of lembretes) {
            let minuto = Number((lembrete.hora).substring(4, 5));
            let menorMinuto = Number((lembreteMenor.hora).substring(4, 5))
            if (minuto < menorMinuto) {
                menorMinuto = minuto;
                lembreteMenor = lembrete;
            }
        }
        lembretesFiltrados.push(lembreteMenor)
        lembretes = lembretes.filter((lembrete) => lembrete.id !== lembreteMenor.id);
    }
    lembretes = lembretesFiltrados;
    lembretesFiltrados = [];
    while (lembretes.length !== 0) {
        let lembreteMenor = lembretes[0];
        for (lembrete of lembretes) {
            let hora = Number((lembrete.hora).substring(0, 2));
            let menorHora = Number((lembreteMenor.hora).substring(0, 2))
            if (hora < menorHora) {
                menorHora = hora;
                lembreteMenor = lembrete;
            }
        }
        lembretesFiltrados.push(lembreteMenor)
        lembretes = lembretes.filter((lembrete) => lembrete.id !== lembreteMenor.id);
    }
    lembretes = lembretesFiltrados;
    lembretesFiltrados = [];
    while (lembretes.length !== 0) {
        let lembreteMenor = lembretes[0];
        for (lembrete of lembretes) {
            let dia = Number((lembrete.data).substring(0, 2));
            let menorDia = Number((lembreteMenor.data).substring(0, 2))
            if (dia < menorDia) {
                menorDia = dia;
                lembreteMenor = lembrete;
            }
        }
        lembretesFiltrados.push(lembreteMenor)
        lembretes = lembretes.filter((lembrete) => lembrete.id !== lembreteMenor.id);
    }
    lembretes = lembretesFiltrados;
    lembretesFiltrados = [];
    while (lembretes.length !== 0) {
        let lembreteMenor = lembretes[0];
        for (lembrete of lembretes) {
            let mes = Number((lembrete.data).substring(3, 5));
            let menorMes = Number((lembreteMenor.data).substring(3, 5))
            if (mes < menorMes) {
                menorMes = mes;
                lembreteMenor = lembrete;
            }
        }
        lembretesFiltrados.push(lembreteMenor)
        lembretes = lembretes.filter((lembrete) => lembrete.id !== lembreteMenor.id);
    }
    lembretes = lembretesFiltrados;
    lembretesFiltrados = [];
    while (lembretes.length !== 0) {
        let lembreteMenor = lembretes[0];
        for (lembrete of lembretes) {
            let ano = Number((lembrete.data).substring(6, 10));
            let menorAno = Number((lembreteMenor.data).substring(6, 10))
            if (ano < menorAno) {
                menorAno = ano;
                lembreteMenor = lembrete;
            }
        }
        lembretesFiltrados.push(lembreteMenor)
        lembretes = lembretes.filter((lembrete) => lembrete.id !== lembreteMenor.id);
    }
    return lembretesFiltrados;
}
inputData.addEventListener("change", () => {
    const horario = new Date();
    let diaFiltrado = (horario.getDate() <= 9) ? "0" + horario.getDate() : horario.getDate();
    let mesFiltrado = Number(horario.getMonth()) + 1;
    mesFiltrado = (mesFiltrado <= 9) ? "0" + mesFiltrado : mesFiltrado;
    const diaAtual = (inputData.value).substring(8, 10);
    const mesAtual = (inputData.value).substring(5, 7);
    const anoAtual = (inputData.value).substring(0, 4);
    if (diaAtual == diaFiltrado && mesAtual == mesFiltrado && anoAtual == horario.getFullYear()) {
        let minutosFiltrado = (horario.getMinutes() <= 9) ? "0" + horario.getMinutes() : horario.getMinutes();
        let horasFiltrado = (horario.getHours() <= 9) ? "0" + horario.getHours() : horario.getHours();
        inputHora.setAttribute("min", `${horasFiltrado}:${minutosFiltrado}`);
    }
    else {
        inputHora.removeAttribute("min");
    }
})
function menuLembretesON(tipo) {
    if (tipo === true) {
        const horario = new Date();
        let diaFiltrado = (horario.getDate() <= 9) ? "0" + horario.getDate() : horario.getDate();
        let mesFiltrado = Number(horario.getMonth()) + 1;
        mesFiltrado = (mesFiltrado <= 9) ? "0" + mesFiltrado : mesFiltrado;
        inputData.setAttribute("min", `${horario.getFullYear()}-${mesFiltrado}-${diaFiltrado}`);
        menuLembretes.style.opacity="1";
        menuLembretes.style.pointerEvents="all";
        body.classList.add("fundo-travado");
    }
    else {
        menuLembretes.style.opacity="0";
        menuLembretes.style.pointerEvents="none";
        body.classList.remove("fundo-travado");
    }
}
// Visual //
function botaoAdicionarHover(modo) {
    if (modo === "ON") {
        botaoAdicionar.style.filter="brightness(1.15)";
        botaoAdicionar.style.cursor="pointer";
        imgBotaoAdicionar.style.filter="brightness(1.15)";
        imgBotaoAdicionar.style.cursor="pointer";
    }
    else {
        botaoAdicionar.style.filter="brightness(1)";
        botaoAdicionar.style.cursor="none";
        imgBotaoAdicionar.style.filter="brightness(0.9)";
        imgBotaoAdicionar.style.cursor="none";
    }
}
// Animação Botão //
function botaoMaior(elemento) {
    function off () {
        elemento.classList.remove("botao-maior");
    }
    elemento.classList.add("botao-maior");
    setTimeout(off, 350);
};
function botaoMenor(elemento) {
    function off () {
        elemento.classList.remove("botao-menor");
    }
    elemento.classList.add("botao-menor");
    setTimeout(off, 350);
};