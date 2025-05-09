# Tree Traversal Algorithms

## Problem Statement
Implement various tree traversal algorithms including in-order, pre-order, post-order, and level-order traversals for binary trees.

## Examples

### Example 1: Binary Tree
```
     1
    / \
   2   3
  / \
 4   5

In-order (Left, Root, Right): 4 2 5 1 3
Pre-order (Root, Left, Right): 1 2 4 5 3
Post-order (Left, Right, Root): 4 5 2 3 1
Level-order: 1 2 3 4 5
```

## Basic Implementation

### 1. Tree Node Structure
```java
public class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    
    TreeNode(int val) {
        this.val = val;
    }
}
```

### 2. In-order Traversal
```java
public class TreeTraversal {
    // Recursive approach
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        inorderHelper(root, result);
        return result;
    }
    
    private void inorderHelper(TreeNode node, List<Integer> result) {
        if (node == null) return;
        
        inorderHelper(node.left, result);
        result.add(node.val);
        inorderHelper(node.right, result);
    }
    
    // Iterative approach using stack
    public List<Integer> inorderTraversalIterative(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        Stack<TreeNode> stack = new Stack<>();
        TreeNode current = root;
        
        while (current != null || !stack.isEmpty()) {
            while (current != null) {
                stack.push(current);
                current = current.left;
            }
            
            current = stack.pop();
            result.add(current.val);
            current = current.right;
        }
        
        return result;
    }
}
```

### 3. Pre-order Traversal
```java
public class TreeTraversal {
    // Recursive approach
    public List<Integer> preorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        preorderHelper(root, result);
        return result;
    }
    
    private void preorderHelper(TreeNode node, List<Integer> result) {
        if (node == null) return;
        
        result.add(node.val);
        preorderHelper(node.left, result);
        preorderHelper(node.right, result);
    }
    
    // Iterative approach
    public List<Integer> preorderTraversalIterative(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        if (root == null) return result;
        
        Stack<TreeNode> stack = new Stack<>();
        stack.push(root);
        
        while (!stack.isEmpty()) {
            TreeNode current = stack.pop();
            result.add(current.val);
            
            if (current.right != null) stack.push(current.right);
            if (current.left != null) stack.push(current.left);
        }
        
        return result;
    }
}
```

### 4. Post-order Traversal
```java
public class TreeTraversal {
    // Recursive approach
    public List<Integer> postorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        postorderHelper(root, result);
        return result;
    }
    
    private void postorderHelper(TreeNode node, List<Integer> result) {
        if (node == null) return;
        
        postorderHelper(node.left, result);
        postorderHelper(node.right, result);
        result.add(node.val);
    }
    
    // Iterative approach
    public List<Integer> postorderTraversalIterative(TreeNode root) {
        LinkedList<Integer> result = new LinkedList<>();
        if (root == null) return result;
        
        Stack<TreeNode> stack = new Stack<>();
        stack.push(root);
        
        while (!stack.isEmpty()) {
            TreeNode current = stack.pop();
            result.addFirst(current.val);
            
            if (current.left != null) stack.push(current.left);
            if (current.right != null) stack.push(current.right);
        }
        
        return result;
    }
}
```

### 5. Level-order Traversal
```java
public class TreeTraversal {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;
        
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        
        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            List<Integer> currentLevel = new ArrayList<>();
            
            for (int i = 0; i < levelSize; i++) {
                TreeNode current = queue.poll();
                currentLevel.add(current.val);
                
                if (current.left != null) queue.offer(current.left);
                if (current.right != null) queue.offer(current.right);
            }
            
            result.add(currentLevel);
        }
        
        return result;
    }
}
```

## Complete Solution with Tests

```java
public class TreeTraversalTest {
    public static void main(String[] args) {
        TreeTraversal solution = new TreeTraversal();
        
        // Create test tree
        TreeNode root = new TreeNode(1);
        root.left = new TreeNode(2);
        root.right = new TreeNode(3);
        root.left.left = new TreeNode(4);
        root.left.right = new TreeNode(5);
        
        // Test all traversals
        System.out.println("In-order Recursive: " + 
            solution.inorderTraversal(root));
        System.out.println("In-order Iterative: " + 
            solution.inorderTraversalIterative(root));
        
        System.out.println("Pre-order Recursive: " + 
            solution.preorderTraversal(root));
        System.out.println("Pre-order Iterative: " + 
            solution.preorderTraversalIterative(root));
        
        System.out.println("Post-order Recursive: " + 
            solution.postorderTraversal(root));
        System.out.println("Post-order Iterative: " + 
            solution.postorderTraversalIterative(root));
        
        System.out.println("Level-order: " + 
            solution.levelOrder(root));
    }
}
```

## Variations

### 1. Zigzag Level Order Traversal
```java
public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;
    
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    boolean isLeftToRight = true;
    
    while (!queue.isEmpty()) {
        int levelSize = queue.size();
        LinkedList<Integer> currentLevel = new LinkedList<>();
        
        for (int i = 0; i < levelSize; i++) {
            TreeNode current = queue.poll();
            
            if (isLeftToRight) {
                currentLevel.addLast(current.val);
            } else {
                currentLevel.addFirst(current.val);
            }
            
            if (current.left != null) queue.offer(current.left);
            if (current.right != null) queue.offer(current.right);
        }
        
        result.add(currentLevel);
        isLeftToRight = !isLeftToRight;
    }
    
    return result;
}
```

### 2. Vertical Order Traversal
```java
public List<List<Integer>> verticalOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;
    
    Map<Integer, List<Integer>> columnTable = new TreeMap<>();
    Queue<Pair<TreeNode, Integer>> queue = new LinkedList<>();
    queue.offer(new Pair<>(root, 0));
    
    while (!queue.isEmpty()) {
        Pair<TreeNode, Integer> p = queue.poll();
        TreeNode node = p.getKey();
        int column = p.getValue();
        
        columnTable.computeIfAbsent(column, k -> new ArrayList<>())
                  .add(node.val);
        
        if (node.left != null) {
            queue.offer(new Pair<>(node.left, column - 1));
        }
        if (node.right != null) {
            queue.offer(new Pair<>(node.right, column + 1));
        }
    }
    
    result.addAll(columnTable.values());
    return result;
}
```

## Common Pitfalls and Tips

1. **Null Checks**: Always handle null nodes properly
2. **Stack Space**: Be aware of recursion depth for large trees
3. **Queue Memory**: Consider memory usage in level-order traversal
4. **Order Preservation**: Maintain correct order in iterative approaches
5. **Edge Cases**: Handle single node and empty trees

## Interview Tips

1. Start with recursive solution for simplicity
2. Explain space-time trade-offs
3. Consider iterative solutions for better space complexity
4. Draw the tree and walk through the algorithm
5. Discuss real-world applications

## Follow-up Questions

1. How would you handle very deep trees?
2. Can you implement Morris Traversal?
3. How to handle threaded binary trees?
4. What about N-ary trees?
5. How to parallelize tree traversal?

## Real-world Applications

1. File system traversal
2. Expression evaluation
3. HTML/XML parsing
4. Network routing
5. Game tree evaluation

## Testing Edge Cases

```java
// Test empty tree
assert solution.inorderTraversal(null).isEmpty();

// Test single node
TreeNode singleNode = new TreeNode(1);
assert solution.inorderTraversal(singleNode).size() == 1;

// Test left-skewed tree
TreeNode leftSkewed = new TreeNode(1);
leftSkewed.left = new TreeNode(2);
leftSkewed.left.left = new TreeNode(3);

// Test right-skewed tree
TreeNode rightSkewed = new TreeNode(1);
rightSkewed.right = new TreeNode(2);
rightSkewed.right.right = new TreeNode(3);

// Test complete binary tree
TreeNode complete = new TreeNode(1);
complete.left = new TreeNode(2);
complete.right = new TreeNode(3);
complete.left.left = new TreeNode(4);
complete.left.right = new TreeNode(5);
complete.right.left = new TreeNode(6);
complete.right.right = new TreeNode(7);
```

## Performance Comparison

| Traversal | Time Complexity | Space Complexity (Recursive) | Space Complexity (Iterative) |
|-----------|----------------|----------------------------|----------------------------|
| In-order | O(n) | O(h) | O(h) |
| Pre-order | O(n) | O(h) | O(h) |
| Post-order | O(n) | O(h) | O(h) |
| Level-order | O(n) | O(w) | O(w) |

where n = number of nodes, h = height of tree, w = maximum width of tree

## Optimization Tips

1. Use iterative approach for better space complexity
2. Consider Morris Traversal for O(1) space
3. Use appropriate data structures (Stack vs Queue)
4. Avoid unnecessary object creation
5. Consider thread-safe implementations for concurrent access 