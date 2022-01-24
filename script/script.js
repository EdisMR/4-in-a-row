"use strict";
const formularioConecta4 = document.forms[0];
const camposGrid = Array.from(document.querySelectorAll(".grid-container div"));
let innerTurnDiv = document.querySelector(".innerTurnUser span");
const innerTurnDivParent = document.querySelector(".innerTurnUser");
const buttonResetParent = document.querySelector(".buttonReset");
const buttonReset = document.querySelector(".buttonReset button");
const ElmDefinirJugadores = document.querySelector(".definirJugadores");
const gameContainer = document.querySelector(".game-container");
const innerTurnUserTextContainer=document.querySelector(".userContainerText")
const innerTurnUserTextInner=document.querySelector("#userTurnText")
const innerWinnerUserTextContainer=document.querySelector(".winnerContainerText")
const innerWinnerUserTextInner=document.querySelector("#winnerTurnText")
const gameHorizontal = 7;
const gameVertical = 6;
var matrizGame = new Array(gameHorizontal);
for (let i = 0; i < gameHorizontal; i++) {
    matrizGame[i] = new Array(gameVertical);
}
let contadorCamposGrid = 0;
for (let Y = 0; Y < gameVertical; Y++) {
    for (let X = 0; X < gameHorizontal; X++) {
        matrizGame[X][Y] = camposGrid[contadorCamposGrid];
        let n = "columna" + (X + 1);
        camposGrid[contadorCamposGrid].classList.add(n);
        camposGrid[contadorCamposGrid].dataset.posx = X.toString();
        camposGrid[contadorCamposGrid].dataset.posy = Y.toString();
        contadorCamposGrid++;
    }
}
var Users = {
    user1: "",
    user2: "",
    winner: "",
    icon: "ms-Icon--CircleFill",
    turno: 1,
};
function retornaClaseUser() {
    let resultado = "";
    if (Users.turno == 0) {
        resultado = "user1";
    }
    if (Users.turno == 1) {
        resultado = "user2";
    }
    return resultado;
}
buttonReset.addEventListener("click", resetGame);
formularioConecta4.addEventListener("submit", defineUsers, false);
function defineUsers(ev) {
    let e = ev;
    e.preventDefault();
    if (formularioConecta4.user1.value != formularioConecta4.user2.value) {
        formularioConecta4.removeEventListener("submit", defineUsers, false);
        Users.user1 = formularioConecta4.user1.value;
        Users.user2 = formularioConecta4.user2.value;
        afterDefineUsers();
    }
    return false;
}
function afterDefineUsers() {
    ElmDefinirJugadores.classList.add("d-none");
    gameContainer.classList.remove("d-none");
    innerTurnUserTextContainer.classList.remove("d-none")
    camposGrid.forEach(elm => {
        elm.addEventListener("mouseover", addHoverGrid, false);
        elm.addEventListener("mouseleave", removeHoverGrid, false);
        elm.addEventListener("click", divCLicked, false);
    });
    Users.turno=randomPlayer()
    innerTurnUser();
}
function removeListerDivs() {
    camposGrid.forEach(elm => {
        elm.removeEventListener("mouseover", addHoverGrid);
        elm.removeEventListener("mouseleave", removeHoverGrid);
        elm.removeEventListener("click", divCLicked);
    });
}
function addHoverGrid(elem) {
    let claseColumna;
    try {
        claseColumna = this.classList[0];
    }
    catch (e) {
        claseColumna = elem.classList[0];
    }
    let elementos = document.querySelectorAll("." + claseColumna);
    elementos.forEach(elm => {
        elm.classList.add("divHover");
    });
}
function removeHoverGrid(elem) {
    let claseColumna;
    try {
        claseColumna = this.classList[0];
    }
    catch (e) {
        claseColumna = elem.classList[0];
    }
    let elementos = document.querySelectorAll("." + claseColumna);
    elementos.forEach(elm => {
        elm.classList.remove("divHover");
    });
}
function divCLicked() {
    let elemento = this;
    let elementoLlenar;
    let hayGanador;
    elementoLlenar = defineUltimoElementoVacio(elemento);
    llenarElemento(elementoLlenar);
    hayGanador = evaluarGanador(elementoLlenar);
    if (!hayGanador) {
        switchUser();
        innerTurnUser();
    }
    else {
        buttonResetParent.classList.remove("d-none");
        ganadorEncontrado();
        removeListerDivs();
        removeHoverGrid(elementoLlenar);
    }
}
function switchUser() {
    Users.turno == 0 ? Users.turno = 1 : Users.turno = 0;
}
function llenarElemento(divLlenar) {
    let divParaLlenar = divLlenar;
    divParaLlenar.children[0].classList.add(Users.icon);
    divParaLlenar.classList.add(retornaClaseUser());
    divParaLlenar.children[0].dataset.occupied = "true";
}
function innerTurnUser() {
    if (Users.turno == 1) {
        innerTurnUserTextInner.innerHTML = Users.user1;
    }
    else {
        innerTurnUserTextInner.innerHTML = Users.user2;
    }
    animateInnerUser();
}
function animateInnerUser() {
    innerTurnDivParent.classList.add("innerTurnUserAnimation");
}
innerTurnDivParent.addEventListener("animationend", afterAnimateInnerUser, false);
function afterAnimateInnerUser() {
    innerTurnDivParent.classList.remove("innerTurnUserAnimation");
}
function defineUltimoElementoVacio(elemento) {
    let ultimo;
    var y = gameVertical - 1;
    for (y; y >= 0; y--) {
        if (matrizGame[elemento.dataset.posx][y].children[0].dataset.occupied == "false") {
            ultimo = matrizGame[elemento.dataset.posx][y];
            break;
        }
    }
    return ultimo;
}
function evaluarGanador(elem) {
    let hayGanador = false;
    let valorX = parseInt(elem.dataset.posx);
    let valorY = parseInt(elem.dataset.posy);
    if (hayGanador == false &&
        buscarClaseEnReferencia(valorX + 1, valorY) == true &&
        buscarClaseEnReferencia(valorX + 2, valorY) == true &&
        buscarClaseEnReferencia(valorX + 3, valorY) == true) {
        hayGanador = true;
    }
    if (hayGanador == false &&
        buscarClaseEnReferencia(valorX - 1, valorY) == true &&
        buscarClaseEnReferencia(valorX + 1, valorY) == true &&
        buscarClaseEnReferencia(valorX + 2, valorY) == true) {
        hayGanador = true;
    }
    if (hayGanador == false &&
        buscarClaseEnReferencia(valorX - 2, valorY) == true &&
        buscarClaseEnReferencia(valorX - 1, valorY) == true &&
        buscarClaseEnReferencia(valorX + 1, valorY) == true) {
        hayGanador = true;
    }
    if (hayGanador == false &&
        buscarClaseEnReferencia(valorX - 1, valorY) == true &&
        buscarClaseEnReferencia(valorX - 2, valorY) == true &&
        buscarClaseEnReferencia(valorX - 3, valorY) == true) {
        hayGanador = true;
    }
    if (hayGanador == false &&
        buscarClaseEnReferencia(valorX, valorY + 1) == true &&
        buscarClaseEnReferencia(valorX, valorY + 2) == true &&
        buscarClaseEnReferencia(valorX, valorY + 3) == true) {
        hayGanador = true;
    }
    if (hayGanador == false &&
        buscarClaseEnReferencia(valorX, valorY - 1) == true &&
        buscarClaseEnReferencia(valorX, valorY + 1) == true &&
        buscarClaseEnReferencia(valorX, valorY + 2) == true) {
        hayGanador = true;
    }
    if (hayGanador == false &&
        buscarClaseEnReferencia(valorX, valorY - 2) == true &&
        buscarClaseEnReferencia(valorX, valorY - 1) == true &&
        buscarClaseEnReferencia(valorX, valorY + 1) == true) {
        hayGanador = true;
    }
    if (hayGanador == false &&
        buscarClaseEnReferencia(valorX, valorY - 1) == true &&
        buscarClaseEnReferencia(valorX, valorY - 2) == true &&
        buscarClaseEnReferencia(valorX, valorY - 3) == true) {
        hayGanador = true;
    }
    if (hayGanador == false &&
        buscarClaseEnReferencia(valorX + 1, valorY - 1) &&
        buscarClaseEnReferencia(valorX + 2, valorY - 2) &&
        buscarClaseEnReferencia(valorX + 3, valorY - 3)) {
        hayGanador = true;
    }
    if (hayGanador == false &&
        buscarClaseEnReferencia(valorX - 1, valorY + 1) &&
        buscarClaseEnReferencia(valorX + 1, valorY - 1) &&
        buscarClaseEnReferencia(valorX + 2, valorY - 2)) {
        hayGanador = true;
    }
    if (hayGanador == false &&
        buscarClaseEnReferencia(valorX - 2, valorY + 2) &&
        buscarClaseEnReferencia(valorX - 1, valorY + 1) &&
        buscarClaseEnReferencia(valorX + 1, valorY - 1)) {
        hayGanador = true;
    }
    if (hayGanador == false &&
        buscarClaseEnReferencia(valorX - 1, valorY + 1) &&
        buscarClaseEnReferencia(valorX - 2, valorY + 2) &&
        buscarClaseEnReferencia(valorX - 3, valorY + 3)) {
        hayGanador = true;
    }
    if (hayGanador == false &&
        buscarClaseEnReferencia(valorX + 1, valorY + 1) &&
        buscarClaseEnReferencia(valorX + 2, valorY + 2) &&
        buscarClaseEnReferencia(valorX + 3, valorY + 3)) {
        hayGanador = true;
    }
    if (hayGanador == false &&
        buscarClaseEnReferencia(valorX - 1, valorY - 1) &&
        buscarClaseEnReferencia(valorX + 1, valorY + 1) &&
        buscarClaseEnReferencia(valorX + 2, valorY + 2)) {
        hayGanador = true;
    }
    if (hayGanador == false &&
        buscarClaseEnReferencia(valorX - 1, valorY - 1) &&
        buscarClaseEnReferencia(valorX - 2, valorY - 2) &&
        buscarClaseEnReferencia(valorX + 1, valorY + 1)) {
        hayGanador = true;
    }
    if (hayGanador == false &&
        buscarClaseEnReferencia(valorX - 1, valorY - 1) &&
        buscarClaseEnReferencia(valorX - 2, valorY - 2) &&
        buscarClaseEnReferencia(valorX - 3, valorY - 3)) {
        hayGanador = true;
    }
    return hayGanador;
}
function buscarClaseEnReferencia(valX, valY) {
    let resultadoF = false;
    let contadorErrores = false;
    try {
        matrizGame[valX][valY].classList;
    }
    catch (error) {
        contadorErrores = true;
    }
    if (contadorErrores == false) {
        let clases = Array.from(matrizGame[valX][valY].classList);
        clases.forEach(elmx => {
            if (elmx == retornaClaseUser()) {
                resultadoF = true;
            }
        });
    }
    return resultadoF;
}
function ganadorEncontrado() {
    let name = "";
    let color = "";
    if (Users.turno == 1) {
        name = Users.user1;
        color = "rgb(212 212 84)";
    }
    if (Users.turno == 0) {
        name = Users.user2;
        color = "hsl(0, 60%, 50%)";
    }
    innerTurnUserTextContainer.classList.add("d-none")
    innerWinnerUserTextContainer.classList.remove("d-none")
    innerWinnerUserTextInner.innerHTML = ` ${name}`;
    innerTurnDivParent.style.backgroundColor = color;
}
function resetGame() {
    buttonResetParent.classList.add("d-none");
    camposGrid.forEach((elm) => {
        elm.classList.remove("user1");
        elm.classList.remove("user2");
        elm.children[0].classList.remove(Users.icon);
        elm.children[0].dataset.occupied = "false";
    });
    innerTurnDivParent.style.backgroundColor = "initial";
    innerTurnUserTextContainer.classList.remove("d-none")
    innerWinnerUserTextContainer.classList.add("d-none")
    innerWinnerUserTextInner.innerHTML = "";
    innerTurnDiv = document.querySelector(".innerTurnUser span");
    afterDefineUsers();
    innerTurnUser();
}

function randomPlayer(){
    return Number(Math.random() < 0.5)
}