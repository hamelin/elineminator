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
            textFont("monospace", 0.6 * unit)
        },
    },
}

const screen = {
    width() { return unit * 15.5 },
    height() { return unit * 21 },

    aspectRatio() {
        return this.height() / this.width()
    },

    clear() {
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

    drawQueue() {
        textAlign(LEFT, TOP)
        palette.container.set()
        rect(11 * unit, 0.25 * unit, 4.5 * unit, 11 * unit, .25 * unit)
        palette.text.set()
        text("Queue", 11.25 * unit, 0.6 * unit)
        fill(colors.blue_royal())
        noStroke()
        for (const [n, shape] of [[0, blocks.zee_l], [1, blocks.ell_l], [2, blocks.zee_r]]) {
            push()
            translate(11.25 * unit, (1.5 + n * 3.25) * unit)
            scale(unit, unit)
            shape.draw()
            pop()
        }
    },

    drawScore() {
        palette.container.set()
        rect(11 * unit, 11.5 * unit, 4.5 * unit, 2.5 * unit, .25 * unit)
        palette.text.set()
        text("Score", 11.25 * unit, 11.8 * unit)
        textAlign(RIGHT, TOP)
        palette.score.set()
        text("999,999,999", 15.25 * unit, 12.75 * unit)
    },

    drawSquareInWell(color, texture, row, column) {
        push()
        translate((0.5 + column) * unit, (0.5 + row) * unit)
        scale(1 * unit, 1 * unit)
        this.drawSquare(color, texture)
        pop()
    },

    drawSquare(color, texture) {
        fill(color)
        stroke(palette.square.edge())
        strokeWeight(palette.square.weight())
        rect(0, 0, 1, 1)
        fill(colors.white())
        stroke(colors.white())
        texture()
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
        line(.15, .5, .5, .15)
        line(.5, .15, .85, .5)
        line(.85, .5, .5, .85)
        line(.5, .85, .15, .5)
        noFill()
        rect(.25, .25, .5, .5)
    },
    circross() {
        noFill()
        arc(.15, .15, .85, .85, 0, HALF_PI)
        arc(.85, .15, .85, .85, HALF_PI, PI)
        arc(.85, .85, .85, .85, PI, PI + HALF_PI)
        arc(.15, .85, .85, .85, PI + HALF_PI, 2 * PI)
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


const Block = {
    indexTiling: 0,
    
    tiling() {
        return this.tilings[this.indexTiling]
    },

    drawSquare() {
        screen.drawSquare(this.color(), this.texture)
    },

    draw31(n) {
        for (const x of [0, 1, 2]) {
            push()
            translate(x + .5, .5)
            this.drawSquare()
            pop()
        }
        translate(.5 + n, 1.5)
        this.drawSquare()
    },

    draw22(offset) {
        var offset_ = offset
        for (const y of [0, 1]) {
            for (const x of [0, 1]) {
                push()
                translate(.5 + offset_ + x, .5 + y)
                this.drawSquare()
                pop()
            }
            offset_ = (offset_ + 1) & 1
        }
    },

    makeCell() {
        return Cell.make(this.color, this.texture)
    },
}


const blocks = {
    bar: Object.assign(
        Object.create(Block),
        {
            color: colors.yellow,
            texture: textures.dither,
            tilings: [
                [[-2, 0], [-1, 0], [0, 0], [1, 0]],
                [[0, 2], [0, 1], [0, 0], [0, -1]],
                [[-1, 0], [0, 0], [1, 0], [2, 0]],
                [[0, -2], [0, -1], [0, 0], [0, 1]],
            ],

            draw() {
                for (const n of [0, 1, 2, 3]) {
                    push()
                    translate(n, 1)
                    this.drawSquare()
                    pop()
                }
            },

            drop() {
                for (const i of [3, 4, 5, 6]) {
                    well.cells[19][i] = this.makeCell()
                }
            }
        }
    ),

    square: Object.assign(
        Object.create(Block),
        {
            color: colors.blue_sky,
            texture: textures.rainbow,
            tilings: [
                [[-1, 0], [-1, -1], [0, 0], [0, -1]],
                [[-1, 0], [-1, -1], [0, 0], [0, -1]],
                [[-1, 0], [-1, -1], [0, 0], [0, -1]],
                [[-1, 0], [-1, -1], [0, 0], [0, -1]],
            ],

            draw() {
                for (const m of [1, 2]) {
                    for (const n of [1, 2]) {
                        push()
                        translate(m, n - .5)
                        this.drawSquare()
                        pop()
                    }
                }
            },
        }
    ),

    tee: Object.assign(
        Object.create(Block),
        {
            color: colors.green,
            texture: textures.arrow,
            tilings: [
                [[-1, 0], [0, 0], [1, 0], [0, -1]],
                [[0, -1], [0, 0], [0, 1], [-1, 0]],
                [[-1, 0], [0, 0], [1, 0], [0, 1]],
                [[0, -1], [0, 0], [0, 1], [1, 0]],
            ],

            draw() {
                this.draw31(1)
            },
        }
    ),

    ell_r: Object.assign(
        Object.create(Block),
        {
            color: colors.orange,
            texture: textures.diamond,
            tilings: [
                [[-1, 0], [0, 0], [1, 0], [1, -1]],
                [[0, 1], [0, 0], [0, -1], [-1, -1]],
                [[-1, 0], [0, 0], [1, 0], [-1, 1]],
                [[0, 1], [0, 0], [0, -1], [1, 1]],
            ],

            draw() {
                this.draw31(2)
            },
        }
    ),

    ell_l: Object.assign(
        Object.create(Block),
        {
            color: colors.red,
            texture: textures.minisquare,
            tilings: [
                [[-1, 0], [0, 0], [1, 0], [-1, -1]],
                [[0, 1], [0, 0], [0, -1], [-1, 1]],
                [[-1, 0], [0, 0], [1, 0], [1, 1]],
                [[0, 1], [0, 0], [0, -1], [1, -1]],
            ],

            draw() {
                this.draw31(0)
            },
        }
    ),

    zee_r: Object.assign(
        Object.create(Block),
        {
            color: colors.blue_royal,
            texture: textures.circross,
            tilings: [
                [[-1, -1], [0, -1], [0, 0], [1, 0]],
                [[-1, 1], [-1, 0], [0, 0], [0, -1]],
                [[-1, -1], [0, -1], [0, 0], [1, 0]],
                [[-1, 1], [-1, 0], [0, 0], [0, -1]],
            ],

            draw() {
                this.draw22(1)
            },
        }
    ),

    zee_l: Object.assign(
        Object.create(Block),
        {
            color: colors.pink,
            texture: textures.x,
            tilings: [
                [[-1, 0], [0, 0], [0, -1], [1, -1]],
                [[0, 1], [0, 0], [-1, 0], [-1, -1]],
                [[-1, 0], [0, 0], [0, -1], [1, -1]],
                [[0, 1], [0, 0], [-1, 0], [-1, -1]],
            ],

            draw() {
                this.draw22(0)
            },
        }
    ),
}


const Cell = {
    make(c, t) {
        return Object.assign(
            Object.create(this),
            {color: c, texture: t}
        )
    },

    empty() {
        return this.make(null, null)
    },

    draw() {
        if (this.color) {
            screen.drawSquare(this.color(), this.texture)
        }
    }
}


const well = {
    cells: [],
    dropping: {
        block: null,
        position: null,
    },

    setUp() {
        this.cells = []
        for (var i = 0; i < 24; i++) {
            const row = []
            for (var j = 0; j < 10; j++) {
                row.push(Cell.empty())
            }
            this.cells.push(row)
        }
    },

    drop(block) {
        this.dropping = {
            block: Object.create(block),
            position: [5, 19],
        }
        this._printBlock(true)
    },

    _printBlock(positive) {
        if (positive) {
            makeCell = () => { return this.dropping.block.makeCell() }
        }
        else {
            makeCell = () => { return Cell.empty() }
        }
        for (const offset of this.dropping.block.tiling()) {
            const [col, row] = this.dropping.position
            const [dc, dr] = offset
            this.cells[row + dr][col + dc] = makeCell()
        }
    },

    draw() {
        palette.container.set()
        rect(0.25 * unit, 0.25 * unit, 10.5 * unit, 20.5 * unit, .25 * unit)
        push()
        translate(.5 * unit, .5 * unit)
        scale(unit, unit)
        translate(0, 19)
        for (const i in this.cells) {
            push()
            for (const j in this.cells[i]) {
                this.cells[i][j].draw()
                translate(1, 0)
            }
            pop()
            translate(0, -1)
        }
        pop()
    },

    down() {
        if (this.dropping.position && this.dropping.block) {
            this._printBlock(false)
            this.dropping.position[1] -= 1
            this._printBlock(true)
        }
    },
}


function setup() {
    createCanvas(windowWidth, windowHeight)
    well.setUp()
    // well.cells[0][0] = Cell.make(colors.yellow, textures.dither)
    // well.cells[0][9] = Cell.make(colors.blue_sky, textures.x)
    // well.cells[1][1] = Cell.make(colors.red, textures.circross)
    // well.cells[19][0] = Cell.make(colors.orange, textures.diamond)
    // well.cells[19][9] = Cell.make(colors.pink, textures.plain)
    well.drop(blocks.bar)
}


function draw() {
    screen.clear()
    well.draw()
    screen.drawQueue()
    screen.drawScore()
}


function keyPressed() {
    switch (keyCode) {
        case DOWN_ARROW:
            well.down()
            return false
    }
}
