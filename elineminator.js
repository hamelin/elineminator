function setup() {
    createCanvas(windowWidth, windowHeight)
    // console.log(`${windowWidth} ${windowHeight}`)
}


const unit = 10

const colors = {
    black() { return color(0) },
    green() { return color(0, 158, 115) },
    blue_royal() { return color(0, 114, 178) },
    blue_sky() { return color(86, 180, 233) },
    yellow() { return color(240, 228, 66) },
    orange() { return color(230, 159, 0) },
    red() { return color(213, 94, 0) },
    pink() { return color(204, 121, 167) },
    white() { return color(255) }
}

const palette = {
    background() { background(color(64)) },
    container: {
        inside() { return colors.black() },
        edge() { return colors.white() },
        weight() { return 0.5 },

        set() {
            fill(this.inside())
            stroke(this.edge())
            strokeWeight(this.weight())
        },
    },
    text: {
        color() { return colors.white() },
        font() { return "sans-serif" },
        size() { return 0.6 * unit },

        set() {
            fill(this.color())
            strokeWeight(0)
            textFont(this.font(), this.size())
        },
    },
    square: {
        edge() { return colors.black() },
        weight() { return 0.05 },
    },

    score: {
        color() { return colors.yellow() },

        set() {
            palette.text.set()
            fill(this.color())
            textFont("monospace", 0.55 * unit)
        },
    },
}

const screen = {
    width() { return unit * 15.5 },
    height() { return unit * 21 },

    aspectRatio() {
        return this.height() / this.width()
    },

    setUp() {
        palette.background()
        const aspectRatioActual = windowHeight / windowWidth
        if (aspectRatioActual > this.aspectRatio()) {
            const sc = windowWidth / this.width()
            scale(sc, sc)
            const heightViewport = this.width() * aspectRatioActual
            translate(0, heightViewport / 2 - this.height() / 2)
        }
        else
        {
            const sc = windowHeight / this.height()
            scale(sc, sc)
            const widthViewport = this.height() / aspectRatioActual
            translate(widthViewport / 2 - this.width() / 2, 0)
        }
    },

    drawWell() {
        palette.container.set()
        rect(0.25 * unit, 0.25 * unit, 10.5 * unit, 20.5 * unit, .25 * unit)
    },

    drawQueue() {
        textAlign(LEFT, TOP)
        palette.container.set()
        rect(11.25 * unit, 0.25 * unit, 4 * unit, 12 * unit, .25 * unit)
        palette.text.set()
        text("Queue", 11.5 * unit, 0.6 * unit)
    },

    drawScore() {
        palette.container.set()
        rect(11.25 * unit, 12.75 * unit, 4 * unit, 2.5 * unit, .25 * unit)
        palette.text.set()
        text("Score", 11.5 * unit, 13.1 * unit)
        textAlign(RIGHT, TOP)
        palette.score.set()
        text("999,999,999", 15 * unit, 14 * unit)
    },

    drawSquare(color, texture, row, column) {
        fill(color)
        stroke(palette.square.edge())
        strokeWeight(palette.square.weight())
        push()
        translate((0.5 + column) * unit, (0.5 + row) * unit)
        scale(1 * unit, 1 * unit)
        rect(0, 0, 1, 1)
        fill(colors.white())
        stroke(colors.white())
        texture()
        pop()
    }
}


const textures = {
    plain() { },
    x() {
        quad(.2, .2, .45, .5, .5, .5, .5, .45)
        quad(.8, .2, .5, .45, .5, .5, .55, .5)
        quad(.2, .8, .45, .5, .5, .5, .5, .55)
        quad(.8, .8, .55, .5, .5, .5, .5, .55)
    },
    minisquare() {
        rect(.35, .35, .3, .3, .1)
        noFill()
        rect(.25, .25, .5, .5, .1)
    },
    diamond() {
        line(.25, .5, .5, .25)
        line(.5, .25, .75, .5)
        line(.75, .5, .5, .75)
        line(.5, .75, .25, .5)
    },
    circross() {
        noFill()
        arc(.15, .15, .7, .7, 0, HALF_PI)
        arc(.85, .15, .7, .7, HALF_PI, PI)
        arc(.85, .85, .7, .7, PI, PI + HALF_PI)
        arc(.15, .85, .7, .7, PI + HALF_PI, 2 * PI)
    },
    dither() {
        for (const x of [.1, .3, .5, .7]) {
            for (const y of [.1, .3, .5, .7]) {
                rect(x + .025, y + .025, .05, .05)
            }
        }
        for (const x of [.2, .4, .6, .8]) {
            for (const y of [.2, .4, .6, .8]) {
                rect(x + .025, y + .025, .05, .05)
            }
        }
    },
    arrow() {
        for (const h of [.25, .4, .6, .85]) {
            line(.2, .15, .5, h)
            line(.8, .15, .5, h)
        }
    },
    rainbow() {
        noFill()
        for (const d of [1.4, 1.2, 1.0, 0.8]) {
            arc(.85, .85, d, d, PI, PI + HALF_PI)
        }
    },
}


function draw() {
    screen.setUp()
    screen.drawWell()
    screen.drawQueue()
    screen.drawScore()

    const colors_ = [
        colors.green(),
        colors.blue_royal(),
        colors.blue_sky(),
        colors.yellow(),
        colors.orange(),
        colors.red(),
        colors.pink()
    ]
    const textures_ = [
        textures.plain,
        textures.x,
        textures.minisquare,
        textures.diamond,
        textures.circross,
        textures.dither,
        textures.arrow,
        textures.rainbow,
    ]
    for (var row = 0; row < 20; row++) {
        for (var column = 0; column < 10; column++) {
            const n = row * 10 + column
            screen.drawSquare(
                colors_[n % colors_.length],
                textures_[n % textures_.length],
                row,
                column
            )
        }
    }
}
