# Three Sum Problem

## Problem Statement
Given an array of integers `nums`, find all unique triplets in the array that sum up to zero. The solution set must not contain duplicate triplets.

## Examples

### Example 1:
```
Input: nums = [-1, 0, 1, 2, -1, -4]
Output: [[-1, -1, 2], [-1, 0, 1]]
Explanation: 
- nums[0] + nums[4] + nums[2] = (-1) + (-1) + 2 = 0
- nums[0] + nums[2] + nums[1] = (-1) + 1 + 0 = 0
```

### Example 2:
```
Input: nums = [0, 0, 0, 0]
Output: [[0, 0, 0]]
Explanation: The only possible triplet sums to zero
```

### Example 3:
```
Input: nums = [1, 2, -2, -1]
Output: []
Explanation: No triplet sums to zero
```

## Approaches

### 1. Brute Force Approach (Not Recommended)
Check every possible triplet combination (three nested loops).

```java
public class ThreeSum {
    public List<List<Integer>> findThreeSum_BruteForce(int[] nums) {
        Set<List<Integer>> result = new HashSet<>();
        
        for (int i = 0; i < nums.length - 2; i++) {
            for (int j = i + 1; j < nums.length - 1; j++) {
                for (int k = j + 1; k < nums.length; k++) {
                    if (nums[i] + nums[j] + nums[k] == 0) {
                        List<Integer> triplet = Arrays.asList(nums[i], nums[j], nums[k]);
                        Collections.sort(triplet); // For consistent ordering
                        result.add(triplet);
                    }
                }
            }
        }
        
        return new ArrayList<>(result);
    }
}
```

**Time Complexity**: O(n³)
**Space Complexity**: O(n) - for storing the result

### 2. Two Pointers Approach (Optimal)
Sort the array first, then use one fixed element and two pointers for the remaining sum.

```java
public class ThreeSum {
    public List<List<Integer>> findThreeSum_TwoPointers(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        Arrays.sort(nums); // Sort array first
        
        for (int i = 0; i < nums.length - 2; i++) {
            // Skip duplicates for i
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            
            int left = i + 1;
            int right = nums.length - 1;
            
            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];
                
                if (sum == 0) {
                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    
                    // Skip duplicates for left
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    // Skip duplicates for right
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    
                    left++;
                    right--;
                } else if (sum < 0) {
                    left++;
                } else {
                    right--;
                }
            }
        }
        
        return result;
    }
}
```

**Time Complexity**: O(n²)
**Space Complexity**: O(1) - excluding the space for output

### 3. Hash Set Approach
Use a hash set to find the third number after fixing the first two numbers.

```java
public class ThreeSum {
    public List<List<Integer>> findThreeSum_HashSet(int[] nums) {
        Set<List<Integer>> result = new HashSet<>();
        Arrays.sort(nums); // Sort for duplicate handling
        
        for (int i = 0; i < nums.length - 2; i++) {
            Set<Integer> seen = new HashSet<>();
            
            for (int j = i + 1; j < nums.length; j++) {
                int complement = -(nums[i] + nums[j]);
                
                if (seen.contains(complement)) {
                    result.add(Arrays.asList(nums[i], complement, nums[j]));
                }
                
                seen.add(nums[j]);
            }
        }
        
        return new ArrayList<>(result);
    }
}
```

**Time Complexity**: O(n²)
**Space Complexity**: O(n) - for the hash set

## Complete Solution with Tests

```java
import java.util.*;

public class ThreeSum {
    // All approaches implemented above
    
    public static void main(String[] args) {
        // Test cases
        int[][] testArrays = {
            {-1, 0, 1, 2, -1, -4},
            {0, 0, 0, 0},
            {1, 2, -2, -1}
        };
        
        ThreeSum solution = new ThreeSum();
        
        for (int i = 0; i < testArrays.length; i++) {
            System.out.println("Test Case " + (i + 1) + ":");
            System.out.println("Array: " + Arrays.toString(testArrays[i]));
            
            // Test all approaches
            System.out.println("Two Pointers: " + 
                solution.findThreeSum_TwoPointers(testArrays[i]));
            System.out.println("Hash Set: " + 
                solution.findThreeSum_HashSet(testArrays[i]));
            System.out.println();
        }
    }
}
```

## Optimization Techniques

1. **Early Termination**:
```java
// If first number is greater than 0, no solution possible
if (nums[i] > 0) break;
```

2. **Skip Duplicates**:
```java
// Skip duplicate values for first number
if (i > 0 && nums[i] == nums[i - 1]) continue;
```

3. **Bounds Check**:
```java
// Check if enough elements remain
if (i > nums.length - 3) break;
```

## Common Pitfalls and Tips

1. **Duplicate Triplets**: Make sure to handle duplicate triplets properly.
2. **Array Sorting**: Consider whether sorting the array first helps.
3. **Empty Array**: Handle cases where array length is less than 3.
4. **Memory Usage**: Be careful with creating new lists/arrays.
5. **Integer Overflow**: Consider potential overflow when summing numbers.

## Interview Tips

1. Start by sorting the array and explain why it helps.
2. Explain how to handle duplicates.
3. Discuss the space-time tradeoff between approaches.
4. Consider writing helper methods for cleaner code.
5. Mention possible optimizations.

## Follow-up Questions

1. What if we need to find four numbers that sum to zero?
2. Can we solve it without sorting the array?
3. How would you handle very large input arrays?
4. What if we need to find triplets that sum to a target value other than zero?
5. How would you parallelize this for very large arrays?

## Real-world Applications

1. Financial analysis for identifying balanced transactions
2. 3D graphics for point cloud processing
3. Chemical compound balancing
4. Network packet analysis
5. Data clustering algorithms

## Performance Comparison

| Approach | Time Complexity | Space Complexity | Best For |
|----------|----------------|------------------|----------|
| Brute Force | O(n³) | O(1) | Small arrays |
| Two Pointers | O(n²) | O(1) | Most cases |
| Hash Set | O(n²) | O(n) | When sorting is expensive |

## Testing Edge Cases

```java
// Test empty array
int[] empty = {};
assert solution.findThreeSum_TwoPointers(empty).isEmpty();

// Test array with less than 3 elements
int[] tooSmall = {1, 2};
assert solution.findThreeSum_TwoPointers(tooSmall).isEmpty();

// Test array with all zeros
int[] allZeros = {0, 0, 0, 0, 0};
assert solution.findThreeSum_TwoPointers(allZeros).size() == 1;

// Test array with no solution
int[] noSolution = {1, 2, 3, 4, 5};
assert solution.findThreeSum_TwoPointers(noSolution).isEmpty();

// Test array with multiple solutions
int[] multiple = {-1, -1, -1, 0, 0, 0, 1, 1, 1};
// Should contain multiple unique triplets
``` 