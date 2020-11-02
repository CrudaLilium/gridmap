function Main() {
    const levelUpFloor = function (cells, targetX, targetY) {
        const centerCell = cells.get(targetX, targetY);
        centerCell.level += 4;
        const afterCertainNumber = 4 + (4 * 2);
        const afterCertainNumber2 = 4 + (4 * 2) + (4 * 3);
        let i = 0;
        let i2 = 0;
        for (const iter of generateRadius(targetX, targetY, 7)) {
            const nextCell = cells.get(iter[0], iter[1]);
            (i2++ < afterCertainNumber2) && nextCell && (nextCell.level += 1);
            (i++ < afterCertainNumber) && nextCell && (nextCell.level += 1);
            nextCell && (nextCell.level += 1);
        }
    }
    const cellType = ['cell--water', 'cell--hill', 'cell--grass'];
    const fragment = document.createDocumentFragment();
    const gridSize = 36;
    const mapCells = new GridMap(gridSize);
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            const gridCell = document.createElement('span');
            gridCell.classList.add('cell', `cell-${x}-${y}`);
            if (x == 13 && y == 19) {
                gridCell.classList.add(`cell--capturable`);
                gridCell.addEventListener('click', ()=> {
                    console.log('add gold +600');
                });
            }
            gridCell.style.setProperty('--cell-row', x + 1);
            gridCell.style.setProperty('--cell-col', y + 1);
            gridCell.addEventListener('click', function (sender) {
                this.classList.add('cell--taken');
            });
            // const type = Math.floor((Math.random() * 1000) % cellType.length);
            const cellInfo = { cell: gridCell, level: 0 };
            mapCells.push(cellInfo);
            fragment.appendChild(gridCell);
        }
    }
    // for (let randomCellIndex = 0; randomCellIndex < gridSize*2; randomCellIndex++) {
    //     let randomX = Math.floor((Math.random() * 1000) % gridSize);
    //     let randomY = Math.floor((Math.random() * 1000) % gridSize);
    //     levelUpFloor(mapCells, randomX, randomY);
    // }
    mapCells.data.forEach(element => {
        const cellLevel = element.level;
        element.cell.classList.add(`cell-level-${cellLevel}`);
    });
    const gridEl = document.getElementById('grid');
    gridEl.appendChild(fragment);
}

function* generateRadius(coordX, coordY, length) {
    const baseX = coordX;
    const baseY = coordY;
    for (let offset = 1; offset <= length; offset++) {
        yield [coordX + offset, coordY];
        for (let subset = 1; subset < offset; subset++) {
            yield [coordX + offset - subset, coordY + subset];
        }
        yield [coordX, coordY + offset];
        for (let subset = 1; subset < offset; subset++) {
            yield [coordX - subset, coordY + offset - subset];
        }
        yield [coordX - offset, coordY];
        for (let subset = 1; subset < offset; subset++) {
            yield [coordX - offset + subset, coordY - subset];
        }
        yield [coordX, coordY - offset];
        for (let subset = 1; subset < offset; subset++) {
            yield [coordX + subset, coordY - offset + subset];
        }
    }
}

class GridMap {
    _data;
    _gridSize;
    _totalSize;

    get data() { return this._data; }

    constructor(gridSize) {
        this._gridSize = gridSize;
        this._totalSize = gridSize ** 2;
        //this._data = new Array(this._totalSize);
        this._data = [];
        this.push = this._data.push.bind(this._data);
    }

    // push(data) {
    //     this._data.push(data);
    //     if (this._data.length > this._totalSize)
    //         throw 'GridMap inner data array overflow!';
    // }

    set(x, y, data) {
        if (x >= this.gridSize)
            throw `x: ${x} is larger than size of GridMap`;
        if (y >= this.gridSize)
            throw `y: ${y} is larger than size of GridMap`;
        this._data[this._getIndex(x, y)] = data;
    }

    get(x, y) {
        if (x >= this._gridSize || y >= this._gridSize)
            return null;
        const index = this._getIndex(x, y);
        return this._data[index];
    }

    _getIndex(x, y) {
        return (this._gridSize * x) + y;
    }
}

Main();