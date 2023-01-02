class GameMap extends Desk{

    constructor(matrix, mainColor, x, y) {
        super(matrix, mainColor,x, y);
        const R = matrix.length, C = matrix[0].length;
        const val = 0;

        this.countMap = Array(R);
        for (let i = 0; i < R; i++) {
            this.countMap[i] = Array(C).fill(val);
        }
    }
    isChangePieceToMap(piece, sign, logic, varShiftX, varShiftY){
        //logic 2 rotate left
        //logic 3 rotate right
        //logic 4 mirror
        let isOk = false;
        let [xshift, yshift] = piece.getShift();
        const varPiece = new Piece(piece.getMatrix(), piece.getMainColor());
        varPiece.setShift(xshift, yshift)
        if (logic===2){
            varPiece.rotateLeft();
        }
        else if (logic===4){
            varPiece.mirror();
        }
        else if (logic===16){
            varPiece.rotateRight();
        }
        else if (logic===10){
            varPiece.setShift(varShiftX, varShiftY);
        }
        if (this.insideMap(varPiece)){
            if (logic!=10){
                this.changePieceToMap(piece, -1, 0)       //original von
                this.changePieceToMap(piece, 1, logic)         //novy dnu
                isOk = true;
            }
            else{
                this.changePieceToMap(piece, 1, 0)
                if (this.isHelpMapOK()){
                    isOk = true;
                }
                this.changePieceToMap(piece, -1, 0)
            }
        }
        return isOk;
    }

    changePieceToMap(piece, sign, logic, varShiftX, varShiftY){
        if (logic===2){
            piece.rotateLeft();
        }
        else if (logic===4){
            piece.mirror();
        }
        else if (logic===16){
            varPiece.rotateRight();
        }
        else if (logic===10){
            piece.setShift(varShiftX, varShiftY);
        }
        let [xshift, yshift] = piece.getShift();
        xshift -= this.shiftX;
        yshift -= this.shiftY;
        piece.getMatrix().forEach((row, y) => {
            row.forEach((value, x) =>{
                if (((xshift+x)>=0)&&((yshift+y)>=0)&&((xshift+x)<this.countMap[0].length)&&((yshift+y)<this.countMap.length)) {
                    if (value>0){
                        this.countMap[y + yshift][x + xshift] += sign;
                    }
                }
            });
        });
    }

    isHelpMapOK(){
        let isOk = true;
        this.countMap.forEach((row, y) => {
            row.forEach((value, x) =>{
                    if (value>1){
                        isOk = false;
                    }
            });
        });
        return isOk;
    }

    isFinishedMap(){
        let isOk = true;
        this.getMatrix().forEach((row, y) => {
            row.forEach((value, x) =>{
                if (this.countMap[y][x] != value){
                    isOk = false;
                }
            });
        });
        return isOk;
    }

    insideMap(piece){
        let isOk = true;
        let [xshift, yshift] = piece.getShift();
        xshift -= this.shiftX;
        yshift -= this.shiftY;
        piece.getMatrix().forEach((row, y) => {
            row.forEach((value, x) =>{
                if (((xshift+x)>=0)&&((yshift+y)>=0)&&((xshift+x)<this.matrix[0].length)&&((yshift+y)<this.matrix.length)) {
                    if ((value>0)&&(this.matrix[y + yshift][x + xshift]===0)){
                        isOk = false;
                    }
                }
                else{
                    if (value > 0){
                        isOk = false;
                    }
                }
            });
        });
        return isOk;
    }
}