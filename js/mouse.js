class Mouse {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.xm = 0;
        this.ym = 0;
        this.px = 0;
        this.py = 0;
    }
    update(event, varBlockSizeX, varBlockSizeY){
        let x, y;
        if (event.pageX || event.pageY) {
            x = event.pageX;
            y = event.pageY;
        }
        else {
            x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        x -= event.target.offsetLeft;
        y -= event.target.offsetTop;
        this.x = x;
        this.y = y;
        this.xm = Math.floor(x/varBlockSizeX) ;
        this.ym = Math.floor(y/varBlockSizeY);
    }

    getPointer(){
        return [this.px, this.py];
    }

    setPointer([x, y]){
        this.px = x;
        this.py = y;
    }
}