# Two Sum Problem

## Problem Statement
Given an array of integers `nums` and an integer `target`, return indices of the two numbers in the array such that they add up to the target. You may assume that each input would have exactly one solution, and you may not use the same element twice.

## Examples

### Example 1:
```
Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
Explanation: nums[0] + nums[1] = 2 + 7 = 9
```

### Example 2:
```
Input: nums = [3, 2, 4], target = 6
Output: [1, 2]
Explanation: nums[1] + nums[2] = 2 + 4 = 6
```

### Example 3:
```
Input: nums = [3, 3], target = 6
Output: [0, 1]
Explanation: nums[0] + nums[1] = 3 + 3 = 6
```

## Approaches

### 1. Brute Force Approach
The simplest approach is to check every possible pair of numbers in the array.

```java
public class TwoSum {
    public int[] findTwoSum_BruteForce(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) {
                    return new int[]{i, j};
                }
            }
        }
        return new int[]{}; // No solution found
    }
}
```

**Time Complexity**: O(n²) - We have two nested loops
**Space Complexity**: O(1) - We only use a constant amount of extra space

### 2. Hash Map Approach (Optimal)
We can use a HashMap to store the numbers we've seen and their indices. For each number, we check if its complement (target - current number) exists in the map.

```java
public class TwoSum {
    public int[] findTwoSum_HashMap(int[] nums, int target) {
        Map<Integer, Integer> numMap = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            
            if (numMap.containsKey(complement)) {
                return new int[]{numMap.get(complement), i};
            }
            
            numMap.put(nums[i], i);
        }
        
        return new int[]{}; // No solution found
    }
}
```

**Time Complexity**: O(n) - We only need to traverse the array once
**Space Complexity**: O(n) - We store at most n elements in the HashMap

### 3. Two-Pointer Approach (for sorted arrays)
If the array is sorted, we can use two pointers moving from both ends.

```java
public class TwoSum {
    public int[] findTwoSum_TwoPointer(int[] nums, int target) {
        // First, create a copy of the array with indices
        int[][] numWithIndex = new int[nums.length][2];
        for (int i = 0; i < nums.length; i++) {
            numWithIndex[i] = new int[]{nums[i], i};
        }
        
        // Sort the array
        Arrays.sort(numWithIndex, (a, b) -> a[0] - b[0]);
        
        int left = 0;
        int right = nums.length - 1;
        
        while (left < right) {
            int sum = numWithIndex[left][0] + numWithIndex[right][0];
            
            if (sum == target) {
                return new int[]{numWithIndex[left][1], numWithIndex[right][1]};
            }
            
            if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
        
        return new int[]{}; // No solution found
    }
}
```

**Time Complexity**: O(n log n) - Due to sorting
**Space Complexity**: O(n) - We create an additional array

## Complete Solution with Tests

```java
import java.util.*;

public class TwoSum {
    // All three approaches implemented above
    
    public static void main(String[] args) {
        // Test cases
        int[][] testArrays = {
            {2, 7, 11, 15},
            {3, 2, 4},
            {3, 3}
        };
        int[] testTargets = {9, 6, 6};
        
        TwoSum solution = new TwoSum();
        
        for (int i = 0; i < testArrays.length; i++) {
            System.out.println("Test Case " + (i + 1) + ":");
            System.out.println("Array: " + Arrays.toString(testArrays[i]));
            System.out.println("Target: " + testTargets[i]);
            
            // Test all approaches
            System.out.println("Brute Force: " + 
                Arrays.toString(solution.findTwoSum_BruteForce(testArrays[i], testTargets[i])));
            System.out.println("HashMap: " + 
                Arrays.toString(solution.findTwoSum_HashMap(testArrays[i], testTargets[i])));
            System.out.println("Two Pointer: " + 
                Arrays.toString(solution.findTwoSum_TwoPointer(testArrays[i], testTargets[i])));
            System.out.println();
        }
    }
}
```

## Common Pitfalls and Tips

1. **Array Bounds**: Always check if the array has at least two elements.
2. **Same Element**: Make sure not to use the same element twice.
3. **No Solution**: Handle the case when no solution exists.
4. **Multiple Solutions**: The problem states there's exactly one solution, but in real interviews, clarify this.
5. **Input Validation**: Consider adding input validation in production code.

## Interview Tips

1. Start with the brute force approach and explain its limitations.
2. Optimize using the HashMap approach and explain the space-time tradeoff.
3. If the array is sorted, mention the two-pointer approach.
4. Discuss edge cases and how to handle them.
5. Consider writing test cases before implementing the solution.

## Follow-up Questions

1. What if the array is sorted?
2. Can there be multiple pairs that sum up to the target?
3. What if we need to find three numbers that sum up to the target?
4. How would you handle negative numbers?
5. What if the array is very large and doesn't fit in memory?

## Real-world Applications

1. Financial applications for finding matching transactions
2. Game development for finding matching pairs
3. Data processing for finding complementary data points
4. Analytics for finding related metrics 