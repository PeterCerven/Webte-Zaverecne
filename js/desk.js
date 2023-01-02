class Desk{
    constructor(matrix, mainColor, x, y) {
        this.matrix = matrix;
        this.mainColor = mainColor;
        this.shiftX = x;
        this.shiftY = y;
        this.x = x;
        this.y = y;
    }

    draw(context, varColor){
         this.matrix.forEach((row, y) => {
            row.forEach((value, x) =>{
                if(value !== 0){
                    if (varColor) {
                        context.fillStyle = varColor;
                    }
                    else{
                        context.fillStyle = this.mainColor;
                    }
                    context.fillRect(x + this.shiftX, y + this.shiftY, 1, 1);
                }
            });
        });
    }

    setShift(xm, ym){
        this.shiftX = xm;
        this.shiftY = ym;
    }
    getShift(){
        return [this.shiftX, this.shiftY];
    }
    getMatrix(){
        return structuredClone(this.matrix);
    }
}