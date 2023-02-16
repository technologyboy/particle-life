

class UI_Object {
    constructor(value, screenArea, backColor, foreColor, clickCallback, mouseWheelCallback) {
        this.screenArea = screenArea
        this.clickCallback = clickCallback
        this.mouseWheelCallback = mouseWheelCallback
        this.value = value
        this.backColor = backColor
        this.foreColor = foreColor
        console.log(typeof this.screenArea)
    }

    render() {
        push()
        let areaFor = this.foreColor
        let areaBck = this.backColor
        let textCol = this.foreColor
        let mouseIn = this.screenArea.contains(createVector(mouseX, mouseY))


        //draw back
        if (mouseIn) {
            fill(this.backColor)
            stroke('yellow')
            strokeWeight(3)
        } else {
            fill(this.backColor)
            stroke(this.foreColor)
            strokeWeight(1)
        }

        if (this.screenArea instanceof Rectangle) {
            rect(this.screenArea.x, this.screenArea.y, this.screenArea.w, this.screenArea.h)

        } else if (this.screenArea instanceof Circle) {
            ellipse(this.screenArea.x, this.screenArea.y, this.screenArea.w, this.screenArea.h)
        } else {

        }


        //draw text
        noStroke()
        if (mouseIn) {
            fill("yellow")
        } else {
            fill(this.foreColor)
        }

        textAlign(CENTER, CENTER)
        let txtPos = this.screenArea.center()
        text(this.value, txtPos.x, txtPos.y)


        pop()
    }

    testClick() {

    }

    testWheel(e) {
        if(this.screenArea.contains(mouseX,mouseY)){
            let a = (e.delta > 0) ? 1 : -1;
this.value += a
        }
    }
}