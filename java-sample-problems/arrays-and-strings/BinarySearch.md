# Binary Search

## Problem Statement
Implement binary search to efficiently find a target element in a sorted array. Return the index if the target is found, otherwise return -1.

## Examples

### Example 1:
```
Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4
Explanation: 9 exists in nums and its index is 4
```

### Example 2:
```
Input: nums = [-1,0,3,5,9,12], target = 2
Output: -1
Explanation: 2 does not exist in nums
```

## Approaches

### 1. Iterative Approach (Optimal)
```java
public class BinarySearch {
    public int search(int[] nums, int target) {
        if (nums == null || nums.length == 0) return -1;
        
        int left = 0;
        int right = nums.length - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2; // Prevents integer overflow
            
            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return -1;
    }
}
```

**Time Complexity**: O(log n)
**Space Complexity**: O(1)

### 2. Recursive Approach
```java
public class BinarySearch {
    public int searchRecursive(int[] nums, int target) {
        return binarySearchHelper(nums, target, 0, nums.length - 1);
    }
    
    private int binarySearchHelper(int[] nums, int target, int left, int right) {
        if (left > right) return -1;
        
        int mid = left + (right - left) / 2;
        
        if (nums[mid] == target) {
            return mid;
        } else if (nums[mid] < target) {
            return binarySearchHelper(nums, target, mid + 1, right);
        } else {
            return binarySearchHelper(nums, target, left, mid - 1);
        }
    }
}
```

**Time Complexity**: O(log n)
**Space Complexity**: O(log n) due to recursion stack

### 3. Template II: Left Boundary Binary Search
```java
public class BinarySearch {
    public int searchLeftmost(int[] nums, int target) {
        int left = 0;
        int right = nums.length;
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            
            if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        
        return left < nums.length && nums[left] == target ? left : -1;
    }
}
```

## Complete Solution with Tests

```java
public class BinarySearchTest {
    public static void main(String[] args) {
        BinarySearch solution = new BinarySearch();
        
        // Test cases
        int[][] testArrays = {
            {-1, 0, 3, 5, 9, 12},
            {1},
            {1, 3},
            {1, 3, 5},
            {}
        };
        
        int[] targets = {9, 2, 1, 3, 5};
        
        for (int i = 0; i < testArrays.length; i++) {
            System.out.println("Array: " + Arrays.toString(testArrays[i]));
            System.out.println("Target: " + targets[i]);
            System.out.println("Iterative Result: " + 
                solution.search(testArrays[i], targets[i]));
            System.out.println("Recursive Result: " + 
                solution.searchRecursive(testArrays[i], targets[i]));
            System.out.println("Leftmost Result: " + 
                solution.searchLeftmost(testArrays[i], targets[i]));
            System.out.println();
        }
    }
}
```

## Variations

### 1. Find First and Last Position
```java
public int[] searchRange(int[] nums, int target) {
    int[] result = {-1, -1};
    
    // Find first position
    result[0] = findBound(nums, target, true);
    if (result[0] == -1) return result;
    
    // Find last position
    result[1] = findBound(nums, target, false);
    
    return result;
}

private int findBound(int[] nums, int target, boolean isFirst) {
    int left = 0;
    int right = nums.length - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (nums[mid] == target) {
            if (isFirst) {
                if (mid == 0 || nums[mid - 1] != target) return mid;
                right = mid - 1;
            } else {
                if (mid == nums.length - 1 || nums[mid + 1] != target) return mid;
                left = mid + 1;
            }
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}
```

### 2. Search in Rotated Sorted Array
```java
public int searchRotated(int[] nums, int target) {
    int left = 0;
    int right = nums.length - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (nums[mid] == target) {
            return mid;
        }
        
        // Left half is sorted
        if (nums[left] <= nums[mid]) {
            if (target >= nums[left] && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        // Right half is sorted
        else {
            if (target > nums[mid] && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    
    return -1;
}
```

## Common Pitfalls and Tips

1. **Integer Overflow**: Use `mid = left + (right - left) / 2` instead of `(left + right) / 2`
2. **Infinite Loop**: Ensure the search space is reducing in each iteration
3. **Boundary Conditions**: Be careful with the comparison operators (`<`, `<=`)
4. **Empty Array**: Handle edge cases like null or empty arrays
5. **Duplicate Elements**: Consider how duplicates affect the search

## Interview Tips

1. Clarify input constraints and requirements
2. Discuss different binary search templates
3. Consider edge cases early
4. Explain time and space complexity
5. Mention real-world applications

## Follow-up Questions

1. How would you handle duplicates?
2. Can you implement it for floating-point numbers?
3. How would you modify for a descending sorted array?
4. What if the array is rotated?
5. How would you handle very large arrays?

## Real-world Applications

1. Database indexing
2. System search functionality
3. Version control (git bisect)
4. Machine learning (gradient descent)
5. Network routing tables

## Testing Edge Cases

```java
// Test empty array
assert solution.search(new int[]{}, 1) == -1;

// Test single element array
assert solution.search(new int[]{1}, 1) == 0;

// Test array with duplicates
assert solution.searchLeftmost(new int[]{1,1,1,1}, 1) == 0;

// Test boundaries
assert solution.search(new int[]{1,2,3}, 1) == 0;
assert solution.search(new int[]{1,2,3}, 3) == 2;

// Test non-existent element
assert solution.search(new int[]{1,3,5}, 2) == -1;
```

## Performance Comparison

| Approach | Time Complexity | Space Complexity | Best For |
|----------|----------------|------------------|----------|
| Iterative | O(log n) | O(1) | Most cases |
| Recursive | O(log n) | O(log n) | Cleaner code |
| Template II | O(log n) | O(1) | Finding boundaries |

## Optimization Tips

1. Use iterative approach for better space complexity
2. Choose appropriate template based on problem requirements
3. Consider binary search variations for specific cases
4. Handle edge cases efficiently
5. Use appropriate data types for large arrays 