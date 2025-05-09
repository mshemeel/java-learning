# Graph Algorithms

## Problem Statement
Implement fundamental graph algorithms including DFS, BFS, shortest path algorithms (Dijkstra's), and cycle detection for both directed and undirected graphs.

## Examples

### Example 1: Graph Representation
```
Adjacency List:
0 -> [1, 2]
1 -> [2]
2 -> [0, 3]
3 -> [3]

Adjacency Matrix:
  0 1 2 3
0 0 1 1 0
1 0 0 1 0
2 1 0 0 1
3 0 0 0 1
```

## Basic Implementation

### 1. Graph Representation
```java
public class Graph {
    private int V; // Number of vertices
    private List<List<Integer>> adj; // Adjacency list
    
    public Graph(int v) {
        V = v;
        adj = new ArrayList<>(v);
        for (int i = 0; i < v; i++) {
            adj.add(new ArrayList<>());
        }
    }
    
    public void addEdge(int v, int w) {
        adj.get(v).add(w);
    }
    
    public List<Integer> getAdjacent(int v) {
        return adj.get(v);
    }
    
    public int getV() {
        return V;
    }
}
```

### 2. Depth-First Search (DFS)
```java
public class GraphTraversal {
    // Recursive DFS
    public void dfs(Graph g, int v, boolean[] visited) {
        visited[v] = true;
        System.out.print(v + " ");
        
        for (int adj : g.getAdjacent(v)) {
            if (!visited[adj]) {
                dfs(g, adj, visited);
            }
        }
    }
    
    // Iterative DFS
    public void dfsIterative(Graph g, int start) {
        boolean[] visited = new boolean[g.getV()];
        Stack<Integer> stack = new Stack<>();
        
        stack.push(start);
        visited[start] = true;
        
        while (!stack.isEmpty()) {
            int v = stack.pop();
            System.out.print(v + " ");
            
            for (int adj : g.getAdjacent(v)) {
                if (!visited[adj]) {
                    stack.push(adj);
                    visited[adj] = true;
                }
            }
        }
    }
}
```

### 3. Breadth-First Search (BFS)
```java
public class GraphTraversal {
    public void bfs(Graph g, int start) {
        boolean[] visited = new boolean[g.getV()];
        Queue<Integer> queue = new LinkedList<>();
        
        visited[start] = true;
        queue.offer(start);
        
        while (!queue.isEmpty()) {
            int v = queue.poll();
            System.out.print(v + " ");
            
            for (int adj : g.getAdjacent(v)) {
                if (!visited[adj]) {
                    visited[adj] = true;
                    queue.offer(adj);
                }
            }
        }
    }
}
```

### 4. Dijkstra's Shortest Path
```java
public class ShortestPath {
    public int[] dijkstra(WeightedGraph g, int start) {
        int V = g.getV();
        int[] dist = new int[V];
        boolean[] visited = new boolean[V];
        
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[start] = 0;
        
        PriorityQueue<Node> pq = new PriorityQueue<>(
            (a, b) -> a.weight - b.weight
        );
        pq.offer(new Node(start, 0));
        
        while (!pq.isEmpty()) {
            Node current = pq.poll();
            int u = current.vertex;
            
            if (visited[u]) continue;
            visited[u] = true;
            
            for (Edge e : g.getAdjacent(u)) {
                int v = e.to;
                int weight = e.weight;
                
                if (!visited[v] && dist[u] + weight < dist[v]) {
                    dist[v] = dist[u] + weight;
                    pq.offer(new Node(v, dist[v]));
                }
            }
        }
        
        return dist;
    }
    
    private static class Node {
        int vertex;
        int weight;
        
        Node(int vertex, int weight) {
            this.vertex = vertex;
            this.weight = weight;
        }
    }
}
```

### 5. Cycle Detection
```java
public class CycleDetection {
    // For undirected graph
    public boolean hasCycleUndirected(Graph g) {
        boolean[] visited = new boolean[g.getV()];
        
        for (int i = 0; i < g.getV(); i++) {
            if (!visited[i]) {
                if (dfsUndirected(g, i, visited, -1)) {
                    return true;
                }
            }
        }
        return false;
    }
    
    private boolean dfsUndirected(Graph g, int v, boolean[] visited, int parent) {
        visited[v] = true;
        
        for (int adj : g.getAdjacent(v)) {
            if (!visited[adj]) {
                if (dfsUndirected(g, adj, visited, v)) {
                    return true;
                }
            } else if (adj != parent) {
                return true;
            }
        }
        return false;
    }
    
    // For directed graph
    public boolean hasCycleDirected(Graph g) {
        boolean[] visited = new boolean[g.getV()];
        boolean[] recStack = new boolean[g.getV()];
        
        for (int i = 0; i < g.getV(); i++) {
            if (dfsDirected(g, i, visited, recStack)) {
                return true;
            }
        }
        return false;
    }
    
    private boolean dfsDirected(Graph g, int v, boolean[] visited, boolean[] recStack) {
        if (recStack[v]) return true;
        if (visited[v]) return false;
        
        visited[v] = true;
        recStack[v] = true;
        
        for (int adj : g.getAdjacent(v)) {
            if (dfsDirected(g, adj, visited, recStack)) {
                return true;
            }
        }
        
        recStack[v] = false;
        return false;
    }
}
```

## Complete Solution with Tests

```java
public class GraphAlgorithmsTest {
    public static void main(String[] args) {
        // Create test graph
        Graph g = new Graph(4);
        g.addEdge(0, 1);
        g.addEdge(0, 2);
        g.addEdge(1, 2);
        g.addEdge(2, 0);
        g.addEdge(2, 3);
        g.addEdge(3, 3);
        
        GraphTraversal traversal = new GraphTraversal();
        CycleDetection cycleDetection = new CycleDetection();
        
        // Test DFS
        System.out.println("DFS starting from vertex 2:");
        traversal.dfs(g, 2, new boolean[g.getV()]);
        System.out.println();
        
        // Test BFS
        System.out.println("BFS starting from vertex 2:");
        traversal.bfs(g, 2);
        System.out.println();
        
        // Test cycle detection
        System.out.println("Has cycle (directed): " + 
            cycleDetection.hasCycleDirected(g));
        System.out.println("Has cycle (undirected): " + 
            cycleDetection.hasCycleUndirected(g));
        
        // Test Dijkstra's algorithm
        WeightedGraph wg = new WeightedGraph(4);
        wg.addEdge(0, 1, 4);
        wg.addEdge(0, 2, 1);
        wg.addEdge(2, 1, 2);
        wg.addEdge(1, 3, 1);
        wg.addEdge(2, 3, 5);
        
        ShortestPath sp = new ShortestPath();
        int[] distances = sp.dijkstra(wg, 0);
        System.out.println("Shortest distances from vertex 0: " + 
            Arrays.toString(distances));
    }
}
```

## Variations

### 1. Topological Sort
```java
public List<Integer> topologicalSort(Graph g) {
    Stack<Integer> stack = new Stack<>();
    boolean[] visited = new boolean[g.getV()];
    
    for (int i = 0; i < g.getV(); i++) {
        if (!visited[i]) {
            topologicalSortUtil(g, i, visited, stack);
        }
    }
    
    List<Integer> result = new ArrayList<>();
    while (!stack.isEmpty()) {
        result.add(stack.pop());
    }
    return result;
}

private void topologicalSortUtil(Graph g, int v, boolean[] visited, Stack<Integer> stack) {
    visited[v] = true;
    
    for (int adj : g.getAdjacent(v)) {
        if (!visited[adj]) {
            topologicalSortUtil(g, adj, visited, stack);
        }
    }
    
    stack.push(v);
}
```

### 2. Strongly Connected Components (Kosaraju's Algorithm)
```java
public List<List<Integer>> stronglyConnectedComponents(Graph g) {
    Stack<Integer> stack = new Stack<>();
    boolean[] visited = new boolean[g.getV()];
    
    // First DFS to fill stack
    for (int i = 0; i < g.getV(); i++) {
        if (!visited[i]) {
            fillOrder(g, i, visited, stack);
        }
    }
    
    // Create transpose graph
    Graph transpose = getTranspose(g);
    
    // Reset visited array
    Arrays.fill(visited, false);
    
    List<List<Integer>> result = new ArrayList<>();
    
    // Process vertices in stack order
    while (!stack.isEmpty()) {
        int v = stack.pop();
        
        if (!visited[v]) {
            List<Integer> component = new ArrayList<>();
            dfsUtil(transpose, v, visited, component);
            result.add(component);
        }
    }
    
    return result;
}
```

## Common Pitfalls and Tips

1. **Graph Representation**: Choose appropriate representation (adjacency list vs matrix)
2. **Visited Array**: Always maintain visited array to avoid cycles
3. **Edge Cases**: Handle disconnected components
4. **Memory Usage**: Consider space complexity for large graphs
5. **Infinite Loops**: Be careful with cycle detection

## Interview Tips

1. Clarify graph properties (directed/undirected, weighted/unweighted)
2. Discuss trade-offs of different representations
3. Consider time and space complexity
4. Handle edge cases explicitly
5. Optimize for specific constraints

## Follow-up Questions

1. How would you handle very large graphs?
2. Can you implement minimum spanning tree algorithms?
3. How to handle negative weights?
4. What about parallel graph processing?
5. How to optimize for sparse vs dense graphs?

## Real-world Applications

1. Social networks
2. Road networks and navigation
3. Network routing
4. Dependency resolution
5. Game state analysis

## Testing Edge Cases

```java
// Test empty graph
Graph emptyGraph = new Graph(0);

// Test single vertex
Graph singleVertex = new Graph(1);

// Test disconnected components
Graph disconnected = new Graph(5);
disconnected.addEdge(0, 1);
disconnected.addEdge(2, 3);

// Test complete graph
Graph complete = new Graph(4);
for (int i = 0; i < 4; i++) {
    for (int j = 0; j < 4; j++) {
        if (i != j) complete.addEdge(i, j);
    }
}

// Test self-loops
Graph selfLoop = new Graph(3);
selfLoop.addEdge(0, 0);
```

## Performance Comparison

| Algorithm | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| DFS | O(V + E) | O(V) |
| BFS | O(V + E) | O(V) |
| Dijkstra | O((V + E) log V) | O(V) |
| Cycle Detection | O(V + E) | O(V) |
| Topological Sort | O(V + E) | O(V) |

## Optimization Tips

1. Use appropriate data structures (priority queue for Dijkstra)
2. Consider adjacency list for sparse graphs
3. Use bit vectors for visited array in space-constrained scenarios
4. Implement iterative versions for better stack space
5. Use parallel processing for large graphs 