

class UI_Object {
    constructor(value, screenArea, backColor, foreColor, clickCallback, mouseWheelCallback) {
        this.screenArea = screenArea
        this.clickCallback = clickCallback
        this.mouseWheelCallback = mouseWheelCallback
        this.text = value
        this.backColor = backColor
        this.foreColor = foreColor
        this.mouseIn = false
    }

    checkMouseIn(x, y) {
        this.mouseIn = this.screenArea.contains(createVector(x, y))
    }

    render() {
        push()
        let areaFor = this.foreColor
        let areaBck = this.backColor
        let textCol = this.foreColor


        //draw back
        if (this.mouseIn) {
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
        if (this.mouseIn) {
            fill("yellow")
        } else {
            fill(this.foreColor)
        }

        textAlign(CENTER, CENTER)
        let txtPos = this.screenArea.center()
        text(this.text, txtPos.x, txtPos.y)


        pop()
    }
}