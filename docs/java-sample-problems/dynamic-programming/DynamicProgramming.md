# Dynamic Programming Problems

## Problem Statement
Implement common dynamic programming problems including Fibonacci sequence, longest common subsequence, knapsack problem, and coin change problem.

## Examples

### Example 1: Fibonacci Sequence
```
Input: n = 5
Output: 5
Explanation: fib(5) = fib(4) + fib(3) = 3 + 2 = 5
```

### Example 2: Knapsack Problem
```
Input: values = [60, 100, 120], weights = [10, 20, 30], capacity = 50
Output: 220
Explanation: Choose items with values 100 and 120 (total weight = 50)
```

## Basic Implementation

### 1. Fibonacci Number
```java
public class Fibonacci {
    // Recursive with memoization
    public int fibMemo(int n) {
        Map<Integer, Integer> memo = new HashMap<>();
        return fibHelper(n, memo);
    }
    
    private int fibHelper(int n, Map<Integer, Integer> memo) {
        if (n <= 1) return n;
        if (memo.containsKey(n)) return memo.get(n);
        
        memo.put(n, fibHelper(n-1, memo) + fibHelper(n-2, memo));
        return memo.get(n);
    }
    
    // Dynamic Programming (Bottom-up)
    public int fibDP(int n) {
        if (n <= 1) return n;
        
        int[] dp = new int[n + 1];
        dp[1] = 1;
        
        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i-1] + dp[i-2];
        }
        
        return dp[n];
    }
    
    // Space-optimized version
    public int fibOptimized(int n) {
        if (n <= 1) return n;
        
        int prev2 = 0, prev1 = 1;
        
        for (int i = 2; i <= n; i++) {
            int current = prev1 + prev2;
            prev2 = prev1;
            prev1 = current;
        }
        
        return prev1;
    }
}
```

### 2. Longest Common Subsequence
```java
public class LCS {
    public int longestCommonSubsequence(String text1, String text2) {
        int m = text1.length();
        int n = text2.length();
        int[][] dp = new int[m + 1][n + 1];
        
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i-1) == text2.charAt(j-1)) {
                    dp[i][j] = dp[i-1][j-1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
                }
            }
        }
        
        return dp[m][n];
    }
    
    // Print the LCS
    public String printLCS(String text1, String text2) {
        int m = text1.length();
        int n = text2.length();
        int[][] dp = new int[m + 1][n + 1];
        
        // Fill dp table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i-1) == text2.charAt(j-1)) {
                    dp[i][j] = dp[i-1][j-1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
                }
            }
        }
        
        // Construct LCS
        StringBuilder lcs = new StringBuilder();
        int i = m, j = n;
        
        while (i > 0 && j > 0) {
            if (text1.charAt(i-1) == text2.charAt(j-1)) {
                lcs.insert(0, text1.charAt(i-1));
                i--; j--;
            } else if (dp[i-1][j] > dp[i][j-1]) {
                i--;
            } else {
                j--;
            }
        }
        
        return lcs.toString();
    }
}
```

### 3. 0/1 Knapsack
```java
public class Knapsack {
    public int knapsack(int[] values, int[] weights, int capacity) {
        int n = values.length;
        int[][] dp = new int[n + 1][capacity + 1];
        
        for (int i = 1; i <= n; i++) {
            for (int w = 0; w <= capacity; w++) {
                if (weights[i-1] <= w) {
                    dp[i][w] = Math.max(
                        values[i-1] + dp[i-1][w - weights[i-1]],
                        dp[i-1][w]
                    );
                } else {
                    dp[i][w] = dp[i-1][w];
                }
            }
        }
        
        return dp[n][capacity];
    }
    
    // Space optimized version
    public int knapsackOptimized(int[] values, int[] weights, int capacity) {
        int n = values.length;
        int[] dp = new int[capacity + 1];
        
        for (int i = 0; i < n; i++) {
            for (int w = capacity; w >= weights[i]; w--) {
                dp[w] = Math.max(dp[w], values[i] + dp[w - weights[i]]);
            }
        }
        
        return dp[capacity];
    }
}
```

### 4. Coin Change
```java
public class CoinChange {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        
        for (int coin : coins) {
            for (int i = coin; i <= amount; i++) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
        
        return dp[amount] > amount ? -1 : dp[amount];
    }
    
    // With solution tracking
    public List<Integer> coinChangeSolution(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        int[] prev = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        
        for (int i = 1; i <= amount; i++) {
            for (int j = 0; j < coins.length; j++) {
                if (coins[j] <= i && dp[i - coins[j]] + 1 < dp[i]) {
                    dp[i] = dp[i - coins[j]] + 1;
                    prev[i] = j;
                }
            }
        }
        
        if (dp[amount] > amount) return new ArrayList<>();
        
        // Reconstruct solution
        List<Integer> solution = new ArrayList<>();
        int current = amount;
        while (current > 0) {
            solution.add(coins[prev[current]]);
            current -= coins[prev[current]];
        }
        
        return solution;
    }
}
```

## Complete Solution with Tests

```java
public class DynamicProgrammingTest {
    public static void main(String[] args) {
        // Test Fibonacci
        Fibonacci fib = new Fibonacci();
        System.out.println("Fibonacci(5):");
        System.out.println("Memoization: " + fib.fibMemo(5));
        System.out.println("DP: " + fib.fibDP(5));
        System.out.println("Optimized: " + fib.fibOptimized(5));
        
        // Test LCS
        LCS lcs = new LCS();
        String text1 = "abcde";
        String text2 = "ace";
        System.out.println("\nLCS length: " + 
            lcs.longestCommonSubsequence(text1, text2));
        System.out.println("LCS string: " + 
            lcs.printLCS(text1, text2));
        
        // Test Knapsack
        Knapsack ks = new Knapsack();
        int[] values = {60, 100, 120};
        int[] weights = {10, 20, 30};
        int capacity = 50;
        System.out.println("\nKnapsack value: " + 
            ks.knapsack(values, weights, capacity));
        System.out.println("Optimized Knapsack value: " + 
            ks.knapsackOptimized(values, weights, capacity));
        
        // Test Coin Change
        CoinChange cc = new CoinChange();
        int[] coins = {1, 2, 5};
        int amount = 11;
        System.out.println("\nMinimum coins needed: " + 
            cc.coinChange(coins, amount));
        System.out.println("Coin change solution: " + 
            cc.coinChangeSolution(coins, amount));
    }
}
```

## Variations

### 1. Longest Increasing Subsequence
```java
public int lengthOfLIS(int[] nums) {
    int[] dp = new int[nums.length];
    Arrays.fill(dp, 1);
    int maxLen = 1;
    
    for (int i = 1; i < nums.length; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[i] > nums[j]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
        maxLen = Math.max(maxLen, dp[i]);
    }
    
    return maxLen;
}
```

### 2. Matrix Chain Multiplication
```java
public int matrixChainMultiplication(int[] dimensions) {
    int n = dimensions.length - 1;
    int[][] dp = new int[n][n];
    
    for (int len = 2; len <= n; len++) {
        for (int i = 0; i < n - len + 1; i++) {
            int j = i + len - 1;
            dp[i][j] = Integer.MAX_VALUE;
            
            for (int k = i; k < j; k++) {
                int cost = dp[i][k] + dp[k+1][j] + 
                          dimensions[i] * dimensions[k+1] * dimensions[j+1];
                dp[i][j] = Math.min(dp[i][j], cost);
            }
        }
    }
    
    return dp[0][n-1];
}
```

## Common Pitfalls and Tips

1. **Base Cases**: Always handle base cases correctly
2. **State Definition**: Clearly define what each state represents
3. **State Transition**: Ensure correct transition between states
4. **Memory Usage**: Consider space optimization when possible
5. **Integer Overflow**: Be careful with large numbers

## Interview Tips

1. Start with recursive solution to understand the problem
2. Convert to memoization (top-down)
3. Convert to tabulation (bottom-up)
4. Optimize space if possible
5. Consider time and space complexity

## Follow-up Questions

1. How to handle very large inputs?
2. Can you optimize space complexity?
3. What about parallel processing?
4. How to handle floating-point values?
5. Can you print all possible solutions?

## Real-world Applications

1. Resource allocation
2. Financial optimization
3. Game theory
4. Text processing
5. Network routing

## Testing Edge Cases

```java
// Test Fibonacci
assert fib.fibDP(0) == 0;
assert fib.fibDP(1) == 1;
assert fib.fibDP(2) == 1;

// Test LCS
assert lcs.longestCommonSubsequence("", "") == 0;
assert lcs.longestCommonSubsequence("abc", "") == 0;
assert lcs.longestCommonSubsequence("abc", "abc") == 3;

// Test Knapsack
assert ks.knapsack(new int[]{}, new int[]{}, 0) == 0;
assert ks.knapsack(new int[]{10}, new int[]{5}, 4) == 0;

// Test Coin Change
assert cc.coinChange(new int[]{2}, 3) == -1;
assert cc.coinChange(new int[]{1}, 0) == 0;
```

## Performance Comparison

| Problem | Time Complexity | Space Complexity | Optimized Space |
|---------|----------------|------------------|-----------------|
| Fibonacci | O(n) | O(n) | O(1) |
| LCS | O(mn) | O(mn) | O(min(m,n)) |
| Knapsack | O(nW) | O(nW) | O(W) |
| Coin Change | O(amount * coins) | O(amount) | O(amount) |

## Optimization Tips

1. Use space optimization techniques
2. Consider using binary search for LIS
3. Use rolling array for 2D DP
4. Avoid unnecessary state transitions
5. Use appropriate data structures 