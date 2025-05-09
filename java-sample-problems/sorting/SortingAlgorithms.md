# Sorting Algorithms

## Problem Statement
Implement various sorting algorithms including Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, and Heap Sort.

## Examples

### Example 1:
```
Input: [64, 34, 25, 12, 22, 11, 90]
Output: [11, 12, 22, 25, 34, 64, 90]
```

## Basic Implementation

### 1. Bubble Sort
```java
public class BubbleSort {
    public void bubbleSort(int[] arr) {
        int n = arr.length;
        boolean swapped;
        
        for (int i = 0; i < n - 1; i++) {
            swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // Swap arr[j] and arr[j+1]
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            // If no swapping occurred, array is already sorted
            if (!swapped) break;
        }
    }
}
```

### 2. Selection Sort
```java
public class SelectionSort {
    public void selectionSort(int[] arr) {
        int n = arr.length;
        
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }
            // Swap found minimum element with first element
            int temp = arr[minIdx];
            arr[minIdx] = arr[i];
            arr[i] = temp;
        }
    }
}
```

### 3. Insertion Sort
```java
public class InsertionSort {
    public void insertionSort(int[] arr) {
        int n = arr.length;
        
        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;
            
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j = j - 1;
            }
            arr[j + 1] = key;
        }
    }
}
```

### 4. Merge Sort
```java
public class MergeSort {
    public void mergeSort(int[] arr) {
        if (arr == null || arr.length <= 1) return;
        
        mergeSortHelper(arr, 0, arr.length - 1);
    }
    
    private void mergeSortHelper(int[] arr, int left, int right) {
        if (left < right) {
            int mid = left + (right - left) / 2;
            
            mergeSortHelper(arr, left, mid);
            mergeSortHelper(arr, mid + 1, right);
            
            merge(arr, left, mid, right);
        }
    }
    
    private void merge(int[] arr, int left, int mid, int right) {
        int n1 = mid - left + 1;
        int n2 = right - mid;
        
        int[] L = new int[n1];
        int[] R = new int[n2];
        
        // Copy data to temp arrays
        for (int i = 0; i < n1; i++) {
            L[i] = arr[left + i];
        }
        for (int j = 0; j < n2; j++) {
            R[j] = arr[mid + 1 + j];
        }
        
        // Merge the temp arrays
        int i = 0, j = 0, k = left;
        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i++;
            } else {
                arr[k] = R[j];
                j++;
            }
            k++;
        }
        
        // Copy remaining elements
        while (i < n1) {
            arr[k] = L[i];
            i++;
            k++;
        }
        while (j < n2) {
            arr[k] = R[j];
            j++;
            k++;
        }
    }
}
```

### 5. Quick Sort
```java
public class QuickSort {
    public void quickSort(int[] arr) {
        quickSortHelper(arr, 0, arr.length - 1);
    }
    
    private void quickSortHelper(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            
            quickSortHelper(arr, low, pi - 1);
            quickSortHelper(arr, pi + 1, high);
        }
    }
    
    private int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = (low - 1);
        
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        
        return i + 1;
    }
}
```

### 6. Heap Sort
```java
public class HeapSort {
    public void heapSort(int[] arr) {
        int n = arr.length;
        
        // Build heap
        for (int i = n / 2 - 1; i >= 0; i--) {
            heapify(arr, n, i);
        }
        
        // Extract elements from heap
        for (int i = n - 1; i > 0; i--) {
            int temp = arr[0];
            arr[0] = arr[i];
            arr[i] = temp;
            
            heapify(arr, i, 0);
        }
    }
    
    private void heapify(int[] arr, int n, int i) {
        int largest = i;
        int left = 2 * i + 1;
        int right = 2 * i + 2;
        
        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }
        
        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }
        
        if (largest != i) {
            int swap = arr[i];
            arr[i] = arr[largest];
            arr[largest] = swap;
            
            heapify(arr, n, largest);
        }
    }
}
```

## Complete Solution with Tests

```java
public class SortingTest {
    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        int[] original = arr.clone();
        
        // Test Bubble Sort
        BubbleSort bubbleSort = new BubbleSort();
        int[] bubbleArr = arr.clone();
        bubbleSort.bubbleSort(bubbleArr);
        System.out.println("Bubble Sort: " + Arrays.toString(bubbleArr));
        
        // Test Selection Sort
        SelectionSort selectionSort = new SelectionSort();
        int[] selectionArr = arr.clone();
        selectionSort.selectionSort(selectionArr);
        System.out.println("Selection Sort: " + Arrays.toString(selectionArr));
        
        // Test Insertion Sort
        InsertionSort insertionSort = new InsertionSort();
        int[] insertionArr = arr.clone();
        insertionSort.insertionSort(insertionArr);
        System.out.println("Insertion Sort: " + Arrays.toString(insertionArr));
        
        // Test Merge Sort
        MergeSort mergeSort = new MergeSort();
        int[] mergeArr = arr.clone();
        mergeSort.mergeSort(mergeArr);
        System.out.println("Merge Sort: " + Arrays.toString(mergeArr));
        
        // Test Quick Sort
        QuickSort quickSort = new QuickSort();
        int[] quickArr = arr.clone();
        quickSort.quickSort(quickArr);
        System.out.println("Quick Sort: " + Arrays.toString(quickArr));
        
        // Test Heap Sort
        HeapSort heapSort = new HeapSort();
        int[] heapArr = arr.clone();
        heapSort.heapSort(heapArr);
        System.out.println("Heap Sort: " + Arrays.toString(heapArr));
    }
}
```

## Variations

### 1. Counting Sort
```java
public void countingSort(int[] arr) {
    int max = Arrays.stream(arr).max().getAsInt();
    int min = Arrays.stream(arr).min().getAsInt();
    int range = max - min + 1;
    
    int[] count = new int[range];
    int[] output = new int[arr.length];
    
    for (int i = 0; i < arr.length; i++) {
        count[arr[i] - min]++;
    }
    
    for (int i = 1; i < count.length; i++) {
        count[i] += count[i - 1];
    }
    
    for (int i = arr.length - 1; i >= 0; i--) {
        output[count[arr[i] - min] - 1] = arr[i];
        count[arr[i] - min]--;
    }
    
    System.arraycopy(output, 0, arr, 0, arr.length);
}
```

### 2. Radix Sort
```java
public void radixSort(int[] arr) {
    int max = Arrays.stream(arr).max().getAsInt();
    
    for (int exp = 1; max / exp > 0; exp *= 10) {
        countingSortByDigit(arr, exp);
    }
}

private void countingSortByDigit(int[] arr, int exp) {
    int[] output = new int[arr.length];
    int[] count = new int[10];
    
    for (int i = 0; i < arr.length; i++) {
        count[(arr[i] / exp) % 10]++;
    }
    
    for (int i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }
    
    for (int i = arr.length - 1; i >= 0; i--) {
        output[count[(arr[i] / exp) % 10] - 1] = arr[i];
        count[(arr[i] / exp) % 10]--;
    }
    
    System.arraycopy(output, 0, arr, 0, arr.length);
}
```

## Common Pitfalls and Tips

1. **Choosing Algorithm**: Select appropriate algorithm based on data characteristics
2. **Space Complexity**: Consider memory constraints
3. **Stability**: Consider if stability is required
4. **In-place vs Extra Space**: Choose based on requirements
5. **Edge Cases**: Handle empty arrays and single elements

## Interview Tips

1. Understand time and space complexity
2. Know when to use each algorithm
3. Consider optimization techniques
4. Handle edge cases explicitly
5. Discuss trade-offs between algorithms

## Follow-up Questions

1. How to handle duplicate elements?
2. What about sorting objects?
3. How to handle very large datasets?
4. Can you parallelize the sorting?
5. How to optimize for nearly sorted data?

## Real-world Applications

1. Database indexing
2. File organization
3. Priority queues
4. Statistics (finding median)
5. Compression algorithms

## Testing Edge Cases

```java
// Test empty array
int[] empty = {};
quickSort.quickSort(empty);
assert empty.length == 0;

// Test single element
int[] single = {1};
quickSort.quickSort(single);
assert single[0] == 1;

// Test already sorted
int[] sorted = {1, 2, 3, 4, 5};
quickSort.quickSort(sorted);
assert Arrays.equals(sorted, new int[]{1, 2, 3, 4, 5});

// Test reverse sorted
int[] reverse = {5, 4, 3, 2, 1};
quickSort.quickSort(reverse);
assert Arrays.equals(reverse, new int[]{1, 2, 3, 4, 5});

// Test duplicates
int[] duplicates = {3, 1, 4, 1, 5, 9, 2, 6, 5, 3};
quickSort.quickSort(duplicates);
// Check if sorted
for (int i = 1; i < duplicates.length; i++) {
    assert duplicates[i-1] <= duplicates[i];
}
```

## Performance Comparison

| Algorithm | Time (Best) | Time (Average) | Time (Worst) | Space | Stable |
|-----------|-------------|----------------|--------------|-------|--------|
| Bubble | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Selection | O(n²) | O(n²) | O(n²) | O(1) | No |
| Insertion | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick | O(n log n) | O(n log n) | O(n²) | O(log n) | No |
| Heap | O(n log n) | O(n log n) | O(n log n) | O(1) | No |

## Optimization Tips

1. Use insertion sort for small arrays
2. Choose pivot wisely in quicksort
3. Use three-way partitioning for many duplicates
4. Consider hybrid sorting algorithms
5. Use parallel sorting for large datasets 