var data = [
    {
        name: "Pennant puzzle",
        tiles: [
            new Block(new vec2(0, 0), new vec2(2), true),
            new Block(new vec2(0, 2), new vec2(1)),
            new Block(new vec2(1, 2), new vec2(1)),
            new Block(new vec2(0, 3), new vec2(1, 2)),
            new Block(new vec2(1, 3), new vec2(1, 2)),
            new Block(new vec2(2, 0), new vec2(2, 1)),
            new Block(new vec2(2, 1), new vec2(2, 1)),
            new Block(new vec2(2, 3), new vec2(2, 1)),
            new Block(new vec2(2, 4), new vec2(2, 1)),
        ],
        gameData: null,
        difficulty: "Easy"
    },
    {
        name: "Klotski",
        tiles: [
            new Block(new vec2(0, 3), new vec2(1, 2)),
            new Block(new vec2(3, 3), new vec2(1, 2)),
            new Block(new vec2(1, 4), new vec2(1)),
            new Block(new vec2(1, 3), new vec2(1)),
            new Block(new vec2(2, 4), new vec2(1)),
            new Block(new vec2(2, 3), new vec2(1)),
            new Block(new vec2(1, 2), new vec2(2, 1)),
            new Block(new vec2(0, 0), new vec2(1, 2)),
            new Block(new vec2(3, 0), new vec2(1, 2)),
            new Block(new vec2(1, 0), new vec2(2), true),
        ],
        gameData: null,
        difficulty: "Hard"
    },
    {
        name: "Unnamed variation",
        tiles: [
            new Block(new vec2(1, 0), new vec2(2), true),
            new Block(new vec2(0, 0), new vec2(1, 2)),
            new Block(new vec2(3, 0), new vec2(1, 2)),
            new Block(new vec2(0, 2), new vec2(1)),
            new Block(new vec2(1, 2), new vec2(1)),
            new Block(new vec2(2, 2), new vec2(1)),
            new Block(new vec2(3, 2), new vec2(1)),
            new Block(new vec2(0, 3), new vec2(2, 1)),
            new Block(new vec2(2, 3), new vec2(2, 1)),
            new Block(new vec2(0, 4), new vec2(1)),
            new Block(new vec2(3, 4), new vec2(1)),
        ],
        gameData: null,
        difficulty: "Hard"
    },
    {
        name: "Century",
        tiles: [
            new Block(new vec2(1, 0), new vec2(2), true),
            new Block(new vec2(0, 0), new vec2(1)),
            new Block(new vec2(3, 0), new vec2(1)),
            new Block(new vec2(0, 1), new vec2(1, 2)),
            new Block(new vec2(3, 1), new vec2(1, 2)),
            new Block(new vec2(0, 3), new vec2(1)),
            new Block(new vec2(3, 3), new vec2(1)),
            new Block(new vec2(1, 2), new vec2(1, 2)),
            new Block(new vec2(0, 4), new vec2(2, 1)),
            new Block(new vec2(2, 4), new vec2(2, 1)),
        ],
        gameData: null,
        difficulty: "Very hard"
    },
    {
        name: "Super Compo",
        tiles: [
            new Block(new vec2(1, 0), new vec2(2), true),
            new Block(new vec2(1, 2), new vec2(2, 1)),
            new Block(new vec2(1, 3), new vec2(2, 1)),
            new Block(new vec2(1, 4), new vec2(2, 1)),
            new Block(new vec2(0, 1), new vec2(1)),
            new Block(new vec2(3, 1), new vec2(1)),
            new Block(new vec2(0, 2), new vec2(1, 2)),
            new Block(new vec2(3, 2), new vec2(1, 2)),
            new Block(new vec2(0, 4), new vec2(1)),
            new Block(new vec2(3, 4), new vec2(1)),
        ],
        gameData: null,
        difficulty: "Very hard"
    }
];
