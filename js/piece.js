//piece.js 3x3 or 4x4
class Piece extends Desk{
    constructor(matrix, mainColor, x, y) {
        super(matrix, mainColor,x, y);
    }

    rotateLeft(){
        const varMatrix = structuredClone(this.matrix)
        if (varMatrix.length===2) {
            this.matrix[0][0] = varMatrix[0][1];
            this.matrix[0][1] = varMatrix[1][1];

            this.matrix[1][0] = varMatrix[0][0];
            this.matrix[1][1] = varMatrix[1][0];
        }
        else if (varMatrix.length===3){
            this.matrix[0][0] = varMatrix[0][2];
            this.matrix[0][1] = varMatrix[1][2];
            this.matrix[0][2] = varMatrix[2][2];

            this.matrix[1][0] = varMatrix[0][1];
            this.matrix[1][1] = varMatrix[1][1];
            this.matrix[1][2] = varMatrix[2][1];

            this.matrix[2][0] = varMatrix[0][0];
            this.matrix[2][1] = varMatrix[1][0];
            this.matrix[2][2] = varMatrix[2][0];
        }
        else if (varMatrix.length===4){
            this.matrix[0][0] = varMatrix[0][3];
            this.matrix[0][1] = varMatrix[1][3];
            this.matrix[0][2] = varMatrix[2][3];
            this.matrix[0][3] = varMatrix[3][3];

            this.matrix[1][0] = varMatrix[0][2];
            this.matrix[1][1] = varMatrix[1][2];
            this.matrix[1][2] = varMatrix[2][2];
            this.matrix[1][3] = varMatrix[3][2];

            this.matrix[2][0] = varMatrix[0][1];
            this.matrix[2][1] = varMatrix[1][1];
            this.matrix[2][2] = varMatrix[2][1];
            this.matrix[2][3] = varMatrix[3][1];

            this.matrix[3][0] = varMatrix[0][0];
            this.matrix[3][1] = varMatrix[1][0];
            this.matrix[3][2] = varMatrix[2][0];
            this.matrix[3][3] = varMatrix[3][0];
        }
    }

    rotateRight(){
        const varMatrix = structuredClone(this.matrix)
        if (varMatrix.length===2) {
            this.matrix[0][0] = varMatrix[1][0];
            this.matrix[0][1] = varMatrix[0][0];

            this.matrix[1][0] = varMatrix[1][1];
            this.matrix[1][1] = varMatrix[0][1];
        }
        else if (varMatrix.length===3){
            this.matrix[2][2] = varMatrix[0][2];
            this.matrix[2][1] = varMatrix[1][2];
            this.matrix[2][0] = varMatrix[2][2];

            this.matrix[1][2] = varMatrix[0][1];
            this.matrix[1][1] = varMatrix[1][1];
            this.matrix[1][0] = varMatrix[2][1];

            this.matrix[0][2] = varMatrix[0][0];
            this.matrix[0][1] = varMatrix[1][0];
            this.matrix[0][0] = varMatrix[2][0];
        }
        else if (varMatrix.length===4){
            this.matrix[3][3] = varMatrix[0][3];
            this.matrix[3][2] = varMatrix[1][3];
            this.matrix[3][1] = varMatrix[2][3];
            this.matrix[3][0] = varMatrix[3][3];

            this.matrix[2][3] = varMatrix[0][2];
            this.matrix[2][2] = varMatrix[1][2];
            this.matrix[2][1] = varMatrix[2][2];
            this.matrix[2][0] = varMatrix[3][2];

            this.matrix[1][3] = varMatrix[0][1];
            this.matrix[1][2] = varMatrix[1][1];
            this.matrix[1][1] = varMatrix[2][1];
            this.matrix[1][0] = varMatrix[3][1];

            this.matrix[0][3] = varMatrix[0][0];
            this.matrix[0][2] = varMatrix[1][0];
            this.matrix[0][1] = varMatrix[2][0];
            this.matrix[0][0] = varMatrix[3][0];
        }
    }

    mirror() {
        const varMatrix = structuredClone(this.matrix)
        if (varMatrix.length===2) {
            this.matrix[0][0] = varMatrix[0][1];
            this.matrix[0][1] = varMatrix[0][0];

            this.matrix[1][0] = varMatrix[1][1];
            this.matrix[1][1] = varMatrix[1][0];
        }
        else if (varMatrix.length===3) {
            this.matrix[0][0] = varMatrix[0][2];
            this.matrix[0][1] = varMatrix[0][1];
            this.matrix[0][2] = varMatrix[0][0];

            this.matrix[1][0] = varMatrix[1][2];
            this.matrix[1][1] = varMatrix[1][1];
            this.matrix[1][2] = varMatrix[1][0];

            this.matrix[2][0] = varMatrix[2][2];
            this.matrix[2][1] = varMatrix[2][1];
            this.matrix[2][2] = varMatrix[2][0];
        }
        else if (varMatrix.length===4) {
            this.matrix[0][0] = varMatrix[0][3];
            this.matrix[0][1] = varMatrix[0][2];
            this.matrix[0][2] = varMatrix[0][1];
            this.matrix[0][3] = varMatrix[0][0];

            this.matrix[1][0] = varMatrix[1][3];
            this.matrix[1][1] = varMatrix[1][2];
            this.matrix[1][2] = varMatrix[1][1];
            this.matrix[1][3] = varMatrix[1][0];

            this.matrix[2][0] = varMatrix[2][3];
            this.matrix[2][1] = varMatrix[2][2];
            this.matrix[2][2] = varMatrix[2][1];
            this.matrix[2][3] = varMatrix[2][0];

            this.matrix[3][0] = varMatrix[3][3];
            this.matrix[3][1] = varMatrix[3][2];
            this.matrix[3][2] = varMatrix[3][1];
            this.matrix[3][3] = varMatrix[3][0];
        }
    }

    isActive(mouse){
        let res = false;
        this.matrix.forEach((row, y) => {
            row.forEach((value, x) =>{
                if(value !== 0){
                    if (((x+this.shiftX)===mouse.xm)&&((y+this.shiftY)===mouse.ym)){
                        res = true;
                        mouse.setPointer([x, y]);
                    }
                }
            });
        });
        return res;
    }

    getMainColor(){
        return this.mainColor;
    }
}