

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

class UIDisplay {
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.items = []
        this.lastHeader = ''
    }

    addItem(display, header) {
        
        this.items.push(display)
    }

    render() {
        push()



        //keybind text
        textAlign(LEFT, CENTER);
        textSize(10)
        fill(255)
        noStroke()



        let cat = ''
        let colWidth = 120
        let top = 400
        let s = createVector(10, height - top - 150)
        let step = 16

        push()
        fill(150, 50)
        strokeWeight(5)
        stroke(150)
        rect(s.x, s.y, colWidth, 300, 5)
        pop()
        s.x += 10

        textAlign(LEFT, CENTER)
        keyBindings.forEach(key => {
            if (cat !== key.category) {
                s.y += step
                keyBindHeading(key.category, s.x, s.y, colWidth, step)
                cat = key.category
                s.y += step

            }
            text('[' + key.keyDisplay + '] ' + key.actionDisplay, s.x, s.y, colWidth, step)
            s.y += step
        })

        s.y += step * 2
        keyBindHeading("VALUES", s.x, s.y, colWidth, step)
        s.y += step
        text('paticles: ' + particles.length, s.x, s.y, colWidth, step)
        s.y += step
        text('FPS: ' + floor(frameRate()), s.x, s.y, colWidth, step)


        pop()
    }

}