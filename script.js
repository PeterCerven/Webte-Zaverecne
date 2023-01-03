// Code goes here
window.onload = function () {
    fetch("./levels.json")
        .then(function (resp) {
            return resp.json();
        }).then(function (data) {


        let finishedLevels = [];
        let nextBtn = document.getElementById("next");
        let restartBtn = document.getElementById("restart");
        let finishedLevelsContainer = document.querySelector(".finished-levels");
        let easyLevelsLength;
        let hardLevelsLength;
        let currentLevelCount = 0;
        let easyLevels = [];
        let hardLevels = [];
        let blockSizeX;
        let blockSizeY;
        let blockSize2X;
        let blockSize2Y;
        let currLevel;
        const respLow = window.matchMedia("(max-width: 420px)");
        const respHigh = window.matchMedia("(min-width: 600px)");
        respLow.addEventListener("change", function () {
            changeResponsive(respLow, respHigh)
        }, false);
        respHigh.addEventListener("change", function () {
            changeResponsive(respLow, respHigh)
        }, false);
        let activePiece;
        let shiftX;
        let shiftY;
        const canvas = document.getElementById("board");
        const helpcanvas = document.getElementById("helpboard");
        let context
        let helpcontext
        let j = 0;
        let drag;
        let dragH;
        let outH;
        let inH;
        let pieceMatrix;
        let mapMatrix;
        let pieceMatrixH;
        let distX, distY;
        let currIndexLvl;
        let sortedLevels = [];
        sortLevelDifficulty();
        distinguishDevice();
        updateFinishedLevels();
        updateLevels();
        prepareForNewLevel();

        // pravidlá pre hru mobil/pc
        function distinguishDevice() {
            if (navigator.userAgent.includes("Mobile")) {
                document.querySelector(".desktop").style.display = "none";
                document.getElementById("level-restart").style.display = "none";
            } else {
                document.querySelector(".mobile").style.display = "none";
            }
        }

        function prepareForNewLevel() {
            activePiece = null;
            shiftX = 0;
            shiftY = 0;
            j = 0;
            drag = false;
            dragH = false;
            inH = false;
            pieceMatrix = [];
            mapMatrix = [];
            pieceMatrixH = [];
        }

        function createPiece(type) {
            if (type === 'I') {
                return [
                    [0, 2, 0, 0],
                    [0, 2, 0, 0],
                    [0, 2, 0, 0],
                    [0, 2, 0, 0]
                ];
            } else if (type === 'L') {
                return [
                    [0, 3, 0],
                    [0, 3, 0],
                    [0, 3, 3]
                ];
            } else if (type === 'O') {
                return [
                    [4, 4],
                    [4, 4]
                ];
            } else if (type === 'S') {
                return [
                    [0, 5, 0],
                    [0, 5, 5],
                    [0, 0, 5]
                ];
            } else if (type === 'T') {
                return [
                    [0, 6, 0],
                    [0, 6, 6],
                    [0, 6, 0]
                ];
            } else if (type === 'Z') {
                return [
                    [7, 7, 0],
                    [0, 7, 0],
                    [0, 7, 7]
                ];
            } else if (type === 'SI') {
                return [
                    [0, 8, 0],
                    [0, 8, 0],
                    [0, 8, 0]
                ];
            } else if (type === 'XSI') {
                return [
                    [0, 9],
                    [0, 9],
                ];
            } else if (type === 'K') {
                return [
                    [0, 10, 0, 0],
                    [0, 10, 0, 0],
                    [0, 10, 10, 0],
                    [0, 10, 0, 0]
                ];
            } else if (type === 'C') {
                return [
                    [11, 11],
                    [11, 0]
                ];
            } else if (type === 'B') {
                return [
                    [0, 12, 0],
                    [0, 12, 12],
                    [0, 12, 12],
                ];
            } else if (type === 'BL') {
                return [
                    [0, 13, 0, 0],
                    [0, 13, 0, 0],
                    [0, 13, 0, 0],
                    [0, 13, 13, 0]
                ];
            }
        }

        changeResponsive(respLow, respHigh);
        let mouse = new Mouse();
        let mouseH = new Mouse();


        canvas.addEventListener('contextmenu', e => e.preventDefault());
        helpcanvas.addEventListener('contextmenu', e => e.preventDefault());

        /*********************************
         window.addEventListener("devicemotion", function(e) {
        const x = e.accelerationIncludingGravity.x;
        const y = e.accelerationIncludingGravity.y;
        const z = e.accelerationIncludingGravity.z;
    });
         //Tip: To expose a local server in https during development, I use ngrok. It allows to create tunnels to expose your localhost on a https url.
         window.addEventListener("deviceorientation",  function(e) {
        let x = e.beta; // In degree in the range [-180,180)
        let y = e.gamma; // In degree in the range [-90,90)
    });
         */

        window.addEventListener("click", function (e) {
            if (e.target === document.getElementsByClassName("modal-bg")[0]) {
                removeInputs();
            }
        });

        document.getElementById("closeBtn").addEventListener("click", function () {
            removeInputs();
        });

        document.getElementById("solution").addEventListener("click", function () {
            createModal("solution", "Riešenie");
        });

        document.getElementById("tip").addEventListener("click", function () {
            createModal("tip", "Nápoveda");
        });

        /*
            ad touch
        */
        helpcanvas.addEventListener('touchstart', function (e) {
            e.preventDefault();
            mouseH.update(e.changedTouches[0], blockSize2X, blockSize2Y);
            if (inH) {
                pieceMatrixH.push(activePiece);
                draw(null, null);
                inH = false;
            } else {
                activePiece = isPiece(pieceMatrixH, mouseH)
                if (activePiece) {
                    dragH = true;
                    distX = mouseH.x
                    distY = mouseH.y
                }
            }
        })
        helpcanvas.addEventListener('touchmove', function (e) {
            e.preventDefault()
        })
        helpcanvas.addEventListener('touchend', function (e) {
            mouseH.update(e.changedTouches[0], blockSize2X, blockSize2Y);
            e.preventDefault()
            distX = mouseH.x - distX;
            distY = mouseH.y - distY;
            if (activePiece) {
                if (dragH) {
                    dragH = false;
                    if (distX < -20) {  // dolava
                        inH = true;
                        activePiece.draw(helpcontext, '#00FF00');
                        return;
                    } else if ((distX > 10) && (distY < -10)) {   // doprava hore
                        activePiece.rotateLeft();
                    } else if ((distX > 10) && (distY > 10)) {  // doprava dole
                        activePiece.mirror();
                    }
                    pieceMatrixH.push(activePiece);
                    draw(null, null);
                }
            }
        })
        canvas.addEventListener('touchstart', function (e) {
            e.preventDefault()
            mouse.update(e.changedTouches[0], blockSizeX, blockSizeY);
            drag = true;
            if (inH) {
                const varPointer = mouseH.getPointer();
                activePiece.setShift(mouse.xm - varPointer[0], mouse.ym - varPointer[1]);
                mouse.setPointer([mouse.xm - activePiece.shiftX, mouse.ym - activePiece.shiftY]);
                draw(activePiece, null);
            } else {
                activePiece = isPiece(pieceMatrix, mouse)
                if (activePiece) {
                    mapMatrix[j].changePieceToMap(activePiece, -1, 0, 0, 0);
                }
            }
        })
        canvas.addEventListener('touchmove', function (e) {
            mouse.update(e.changedTouches[0], blockSizeX, blockSizeY);
            if (activePiece) {
                if (drag) {
                    if (inH) {
                        const varPointer = mouse.getPointer();
                        activePiece.setShift(mouse.xm - varPointer[0], mouse.ym - varPointer[1]);
                    } else {
                        const varPointer = mouse.getPointer();
                        activePiece.setShift(mouse.xm - varPointer[0], mouse.ym - varPointer[1]);
                    }
                    draw(activePiece, null);
                }
            }
            e.preventDefault()
        })
        canvas.addEventListener('touchend', function () {
            upProcedure();
        })
        /*
          end  ad touch
        */
        canvas.addEventListener('mousedown', function (e) {
            activePiece = isPiece(pieceMatrix, mouse) // vyberie activePiece z pieceMatrix
            if (activePiece) {
                if (e.buttons === 1) {
                    drag = true;
                    mapMatrix[j].changePieceToMap(activePiece, -1, 0, 0, 0);
                } else if ((e.buttons === 2) || (e.buttons === 4) || (e.buttons === 16)) {
                    if (mapMatrix[j].isChangePieceToMap(activePiece, 1, e.buttons, 0, 0)) {
                        pieceMatrix.push(activePiece);
                        draw(null, null);
                    }
                }
            }
        })
        canvas.addEventListener('mousemove', function (e) {
            mouse.update(e, blockSizeX, blockSizeY);
            if (drag) {
                if (inH) {
                    const varPointer = mouseH.getPointer();
                    activePiece.setShift(mouse.xm - varPointer[0], mouse.ym - varPointer[1]);
                } else {
                    const varPointer = mouse.getPointer();
                    activePiece.setShift(mouse.xm - varPointer[0], mouse.ym - varPointer[1]);
                }
                draw(activePiece, null);
            }
        })
        canvas.addEventListener('mouseup', function (e) {
            if (e.button === 0) {
                upProcedure();
            }
        })

        canvas.addEventListener('mouseenter', function (e) {
            if (activePiece) {
                mouse.update(e, blockSizeX, blockSizeY);
                if (outH) {
                    outH = false;
                    inH = true;
                    drag = true;
                    shiftX = mouse.xm;
                    shiftY = mouse.ym;
                    const varPointer = mouseH.getPointer();
                    activePiece.setShift(shiftX + varPointer[0], shiftY + varPointer[1]);
                }
            }
        })
        canvas.addEventListener('mouseleave', function () {
            if (drag) {
                inH = false;
                activePiece.setShift(activePiece.x, activePiece.y);
                pieceMatrixH.push(activePiece);
//                console.log([drag, dragH, inH, pieceMatrix.length, pieceMatrixH.length, e.type])
                draw(null, activePiece);
                drag = false;
            }
        })
        helpcanvas.addEventListener('mousedown', function (e) {
            e.preventDefault()  // ked neni snazi sa to pri kliknuti strednym tlacitkom rolovat
            activePiece = isPiece(pieceMatrixH, mouseH)
            if (activePiece) {
                if (e.buttons === 1) {
                    shiftX = mouseH.xm - activePiece.shiftX;
                    shiftY = mouseH.ym - activePiece.shiftY;
                    dragH = true;
                    return
                } else if (e.buttons === 2) {
                    activePiece.rotateLeft();
                } else if (e.buttons === 4) {
                    activePiece.mirror();
                } else if (e.buttons === 16) {
                    activePiece.rotateRight();
                }
                pieceMatrixH.push(activePiece);
                draw(null, null);
            }
        })
        helpcanvas.addEventListener('mousemove', function (e) {
            mouseH.update(e, blockSize2X, blockSize2Y);
            if (dragH) {
                activePiece.setShift(mouseH.xm - shiftX, mouseH.ym - shiftY);
                draw(null, activePiece);
            }
        })
        helpcanvas.addEventListener('mouseup', function () {
            if (activePiece) {
                if (dragH) {
                    dragH = false;
                    activePiece.setShift(activePiece.x, activePiece.y);
                    pieceMatrixH.push(activePiece);
                    draw(null, null);
                }
            }
        })
        helpcanvas.addEventListener('mouseleave', function () {
            if (dragH) {
                dragH = false;
                if ((mouseH.xm >= 5) || (mouseH.ym <= 0) || (mouseH.ym >= 20)) {
                    activePiece.setShift(activePiece.x, activePiece.y);
                    pieceMatrixH.push(activePiece);
                    draw(null, null);
                    outH = false;
                } else {
                    outH = true;
                    if (mouseH.xm <= 0) {
                        draw(null, null);
                    }
                }
            }
        })
        // Dalsi level alebo pokracovanie alebo zacatie novej hry
        nextBtn.addEventListener("click", function () {
            next();
        })
        nextBtn.addEventListener('touchstart', function () {
            next()
        })
        // uplne restartuje hru a vymaze localstorage
        restartBtn.addEventListener("click", function () {
            restart();
        })
        restartBtn.addEventListener('touchstart', function () {
            restart();
        })

        document.getElementById("level-restart").addEventListener("click", function () {
            restartLevel();
        });

        function upProcedure(){
            if (drag) {
                drag = false;
                if (mapMatrix[j].isChangePieceToMap(activePiece, 1, 10, activePiece.shiftX, activePiece.shiftY)) {
                    draw(activePiece, null);
                    pieceMatrix.push(activePiece);
                    mapMatrix[j].changePieceToMap(activePiece, 1);
                } else {                                //vraciam sa do  vyberu
                    activePiece.setShift(activePiece.x, activePiece.y);
                    pieceMatrixH.push(activePiece);
                    draw(null, null);
                }
                inH = false;
                if (mapMatrix[j].isFinishedMap()) {
                    nextBtn.disabled = false;
                }
            }
        }


        function restartLevel() {
            prepareForNewLevel();
            getRandomLevel();
            nextBtn.disabled = true;
            draw(null, null);
        }

        function sortLevelDifficulty() {
            for (let i = 0; i < data.length; i++) {
                let level = document.createElement("div");
                level.classList.add("level");
                if (data[i].difficulty === "easy") {
                    easyLevels.push(data[i]);
                    sortedLevels.unshift(data[i]);
                    level.classList.add("easy");
                    finishedLevelsContainer.insertBefore(level, finishedLevelsContainer.firstChild);
                }
                if (data[i].difficulty === "hard") {
                    hardLevels.push(data[i]);
                    sortedLevels.push(data[i]);
                    level.classList.add("hard");
                    finishedLevelsContainer.appendChild(level);
                }
            }
            finishedLevels = document.querySelectorAll(".level");
            easyLevelsLength = easyLevels.length;
            hardLevelsLength = hardLevels.length;
        }

        function next() {
            if (nextBtn.innerText !== "Pokračovať") {
                localStorage.removeItem("level-index");
            }
            if (nextBtn.innerText === "Ďalšia úloha") {
                console.log(currentLevelCount);
                finishedLevels[currentLevelCount].style.background = "green";
                currentLevelCount++;
                localStorage.setItem("finished-levels", currentLevelCount.toString());
                if (easyLevels.length !== 0) {
                    easyLevels.splice(currIndexLvl, 1);
                } else if (hardLevels.length !== 0) {
                    hardLevels.splice(currIndexLvl, 1);
                }
            }
            nextBtn.innerText = "Ďalšia úloha";
            document.getElementById("tip").disabled = false;
            document.getElementById("solution").disabled = false;
            document.getElementById("level-restart").disabled = false;
            nextBtn.disabled = true;
            prepareForNewLevel();
            getRandomLevel();
            localStorage.setItem("easyLevels", JSON.stringify(easyLevels));
            localStorage.setItem("hardLevels", JSON.stringify(hardLevels));
            draw(null, null);
        }

        function restart() {
            for (let i = 0; i < finishedLevels.length; i++) {
                if (finishedLevels[i].classList.contains("easy")) {
                    finishedLevels[i].style.background = "#cc0000";
                } else if (finishedLevels[i].classList.contains("hard")) {
                    finishedLevels[i].style.background = "#4c0000";
                }
            }
            nextBtn.innerText = "Začni Hru";
            nextBtn.disabled = false;
            document.getElementById("tip").disabled = true;
            document.getElementById("solution").disabled = true;
            document.getElementById("level-restart").disabled = true;

            currentLevelCount = 0;
            easyLevels = sortedLevels.slice(0, easyLevelsLength);
            hardLevels = data.slice(easyLevelsLength, sortedLevels.length);

            localStorage.clear();
            localStorage.setItem("finished-levels", currentLevelCount.toString());
            localStorage.setItem("easyLevels", JSON.stringify(easyLevels));
            localStorage.setItem("hardLevels", JSON.stringify(hardLevels));

            prepareForNewLevel();
            draw(null, null);
        }

        // naplni localStorage nastavi novy level a jeho index
        function getRandomLevel() {
            let storageIndex = localStorage.getItem("level-index");
            if (easyLevels.length !== 0) {
                currIndexLvl = storageIndex ? parseInt(storageIndex) : Math.floor(Math.random() * easyLevels.length);
                currLevel = easyLevels[currIndexLvl];
                initGameBoard(currLevel.board, currLevel.pieces);

                // localStorage.setItem("easyLevels", JSON.stringify(easyLevels));
                if (easyLevels.length === 0) {
                    localStorage.removeItem("level-index");
                    return;
                }
                localStorage.setItem("level-index", currIndexLvl.toString());
            } else if (hardLevels.length !== 0) {
                currIndexLvl = storageIndex ? parseInt(storageIndex) : Math.floor(Math.random() * hardLevels.length);
                currLevel = hardLevels[currIndexLvl];
                initGameBoard(currLevel.board, currLevel.pieces);
                localStorage.setItem("level-index", currIndexLvl.toString());
            } else {
                alert("Gratulujeme, vyhrali ste hru!");
            }
        }

        // inicializuje hraciu plochu a kamene
        function initGameBoard(board, pieces) {
            let currGameMap = new GameMap(board, '#FFF');
            mapMatrix.push(currGameMap);
            currGameMap.setShift(1, 1);
            let currYM = 1;
            for (let i = 0; i < pieces.length; i++) {
                pieceMatrixH.push(new Piece(createPiece(pieces[i].tileType), pieces[i].tileColor, pieces[i].tileShift.xm, currYM));
                currYM += 1 + pieces[i].tileShift.ym;
            }
        }

        function updateFinishedLevels() {
            currentLevelCount = localStorage.getItem("finished-levels") ? localStorage.getItem("finished-levels") : 0;
            for (let i = 0; i < currentLevelCount; i++) {
                finishedLevels[i].style.background = "green";
            }
        }

        function isPiece(matrixes, mousevar) {
            for (let index = matrixes.length - 1; index >= 0; index--) {
                if (matrixes[index].isActive(mousevar)) {
                    return (matrixes.splice(index, 1))[0];
                }
            }
            return null;
        }

        function draw(source, sourceH) {
            drawCanvas();

            for (let index = pieceMatrix.length - 1; index >= 0; index--) {
                pieceMatrix[index].draw(context, null);
            }
            for (let index = pieceMatrixH.length - 1; index >= 0; index--) {
                pieceMatrixH[index].draw(helpcontext, null);
            }
            if (source) {
                source.draw(context);
            }
            if (sourceH) {
                sourceH.draw(helpcontext);
            }
        }

        // pozrie sa do localstorage ci je hra zapnuta, ak nie tak sa zoberu levely z jsonu
        function updateLevels() {
            if (localStorage.getItem("easyLevels") !== null && localStorage.getItem("hardLevels") !== null) {
                easyLevels = JSON.parse(localStorage.getItem("easyLevels"));
                hardLevels = JSON.parse(localStorage.getItem("hardLevels"));
                currentLevelCount = localStorage.getItem("finished-levels") ? localStorage.getItem("finished-levels") : 0;
                if (easyLevelsLength !== easyLevels.length) {
                    nextBtn.innerText = "Pokračovať";
                }
            } else {
                easyLevels = data.slice(0, easyLevelsLength);
                hardLevels = data.slice(easyLevelsLength, sortedLevels.length);
                localStorage.setItem("easyLevels", JSON.stringify(easyLevels));
                localStorage.setItem("hardLevels", JSON.stringify(hardLevels));
            }
        }

        function createModal(helpType, text) {

            let modal = document.querySelector(".modal-bg");
            let title = document.querySelector(".title");
            let img = document.querySelector(".modal-img");
            let modalBox = document.querySelector(".modal-box");

            modal.style.display = "flex";
            modal.style.height = document.documentElement.offsetHeight + "px";
            title.innerText = text;
            if (document.documentElement.offsetHeight > 400 + document.documentElement.offsetWidth) {
                modalBox.style.width = "80%";
            } else {
                modalBox.style.width = "40%";
            }
            let newPath;
            if (helpType === "tip") {
                newPath = currLevel.tip
            } else if (helpType === "solution") {
                newPath = currLevel.solution
            }
            img.src = newPath;
        }

        function removeInputs() {
            let modal = document.getElementsByClassName("modal-bg")[0];
            modal.style.display = "none";
        }


        function drawCanvas() {
            if (context) {
                context.fillStyle = 'lightgrey';
                //context.fillRect(0, 0, canvas.width, canvas.height);
                context.fillRect(0, 0, Math.floor(canvas.width / blockSizeX) + 1, Math.floor(canvas.height / blockSizeY) + 1);
                helpcontext.fillStyle = 'lightgrey';
                //helpcontext.fillRect(0, 0, helpcanvas.width, helpcanvas.height);
                helpcontext.fillRect(0, 0, Math.floor(helpcanvas.width / blockSize2X) + 1, Math.floor(helpcanvas.height / blockSize2Y) + 1);

                if (mapMatrix.length !== 0) {
                    mapMatrix[j].draw(context);
                }
            }
        }


        function changeResponsive(x, y) {
            if (x.matches) { // max 420
                canvas.style.height = "240px"
                canvas.style.width = "180px"
                canvas.height = 240
                canvas.width = 180
                helpcanvas.style.height = "240px"
                helpcanvas.style.width = "72px"
                helpcanvas.height = 240
                helpcanvas.width = 72
            } else if (y.matches) { // min 600
                canvas.style.height = "480px"
                canvas.style.width = "360px"
                canvas.height = 480
                canvas.width = 360
                helpcanvas.style.height = "480px"
                helpcanvas.style.width = "144px"
                helpcanvas.height = 480
                helpcanvas.width = 144
            } else { // between 420 and 600
                canvas.style.height = "360px"
                canvas.style.width = "270px"
                canvas.height = 360
                canvas.width = 270
                helpcanvas.style.height = "360px"
                helpcanvas.style.width = "108px"
                helpcanvas.height = 360
                helpcanvas.width = 108
            }
            blockSizeX = canvas.width / 8;
            blockSizeY = canvas.width / 8;
            blockSize2X = helpcanvas.width / 6;
            blockSize2Y = helpcanvas.width / 6;

            context = canvas.getContext('2d');
            context.scale(blockSizeX, blockSizeY);
            helpcontext = helpcanvas.getContext('2d');
            helpcontext.scale(blockSize2X, blockSize2Y);
            draw(null, null);
        }


        function handleMotionEvent(event) {

            let x = event.accelerationIncludingGravity.x;
            let y = event.accelerationIncludingGravity.y;
            let z = event.accelerationIncludingGravity.z;

            if (Math.abs(x) > 50 || Math.abs(y) > 50 || Math.abs(z) > 50) {
                restartLevel();
            }

        }

        window.addEventListener("devicemotion", handleMotionEvent, true);

    });
}

