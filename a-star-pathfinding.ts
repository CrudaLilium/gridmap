export class Point {
    public X: number;
    public Y: number;
    constructor(x: number, y: number) {
        this.X = x;
        this.Y = y;
    }
}

export class SearchParameters {
    StartLocation: Point;
    EndLocation: Point;
    Map: []; // mapa vsech nodu
}

export class Node {
    public Location: Point;
    public IsWalkable: boolean;
    public G: number;
    public H: number;
    public F: number;
    public State: NodeState;
    public ParentNode: Node;

    public static GetTraversalCost(node: Node, node2: Node) {
        return 1;
    }
}

export enum NodeState {
    Untested,
    Open,
    Closed
}

export class AStarPathfinding {
    private width: number;
    private height: number;
    private nodes: Node[][];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.nodes = [];
        for (let x = 0; x < this.width; x++) {
            const newXRow = [];
            this.nodes.push(newXRow);
            for (let y = 0; y < this.height; y++) {
                const node = new Node();
                node.Location = new Point(x,y);
                node.IsWalkable = true;
                newXRow.push(node);
            }
        }
    }

    // public FindPath(): Array<Point> {
    //     const path: Array<Point> = [];
    //     let success: boolean = this.Search(startNode);
    //     if (success) {
    //         Node node = this.endNode;
    //         while (node.ParentNode != null) {
    //             path.Add(node.Location);
    //             node = node.ParentNode;
    //         }
    //         path.Reverse();
    //     }
    //     return path;
    // }

    private Search(currentNode: Node): boolean {
        //...
        const nextNodes: Array<Node> = this.GetAdjacentWalkableNodes(currentNode);
        nextNodes.Sort((node1, node2) => node1.F.CompareTo(node2.F));

        for (const nextNode of nextNodes) {
            if (nextNode.Location == this.endNode.Location) {
                return true;
            }
            else {
                if (Search(nextNode)) // Note: Recurses back into Search(Node)
                    return true;
            }
        }
        return false;
    }

    private GetAdjacentWalkableNodes(fromNode: Node): Array<Node> {
        const walkableNodes: Array<Node> = [];
        // IEnumerable < Point >
        let nextLocations: Point[] = this.GetAdjacentLocations(fromNode.Location);

        for (let location of nextLocations) {
            let x: number = location.X;
            let y: number = location.Y;

            // Stay within the grid's boundaries
            if (x < 0 || x >= this.width || y < 0 || y >= this.height)
                continue;

            let node: Node = this.nodes[x][y];
            // Ignore non-walkable nodes
            if (!node.IsWalkable)
                continue;

            // Ignore already-closed nodes
            if (node.State == NodeState.Closed)
                continue;

            // Already-open nodes are only added to the list if their G-value is lower going via this route.
            if (node.State == NodeState.Open) {
                //float traversalCost = Node.GetTraversalCost(node.Location, node.ParentNode.Location);
                const traversalCost = 1;
                const gTemp: number = fromNode.G + traversalCost;
                if (gTemp < node.G) {
                    node.ParentNode = fromNode;
                    walkableNodes.push(node);
                }
            }
            else {
                // If it's untested, set the parent and flag it as 'Open' for consideration
                node.ParentNode = fromNode;
                node.State = NodeState.Open;
                walkableNodes.push(node);
            }
        }

        return walkableNodes;
    }

    private GetAdjacentLocations(fromPoint: Point): Point[] {
        return [
            { X: fromPoint.X - 1, Y: fromPoint.Y },
            { X: fromPoint.X + 1, Y: fromPoint.Y },
            { X: fromPoint.X - 1, Y: fromPoint.Y - 1 },
            { X: fromPoint.X + 1, Y: fromPoint.Y + 1 },
            { X: fromPoint.X + 1, Y: fromPoint.Y - 1 },
            { X: fromPoint.X - 1, Y: fromPoint.Y + 1 },
            { X: fromPoint.X, Y: fromPoint.Y - 1 },
            { X: fromPoint.X, Y: fromPoint.Y + 1 }
        ];
    }
}