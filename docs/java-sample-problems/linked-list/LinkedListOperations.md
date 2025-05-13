# Linked List Operations

## Problem Statement
Implement a singly linked list and its basic operations including insertion, deletion, reversal, and cycle detection.

## Examples

### Example 1: Insertion and Traversal
```
Input: Insert 1->2->3->4
Output: 1->2->3->4
```

### Example 2: Reversal
```
Input: 1->2->3->4
Output: 4->3->2->1
```

### Example 3: Cycle Detection
```
Input: 1->2->3->4->2 (4 points back to 2)
Output: true (cycle exists)
```

## Basic Implementation

### 1. Node Class and LinkedList Structure
```java
public class ListNode {
    int val;
    ListNode next;
    
    ListNode(int val) {
        this.val = val;
    }
}

public class LinkedList {
    private ListNode head;
    
    public LinkedList() {
        this.head = null;
    }
}
```

### 2. Basic Operations

```java
public class LinkedList {
    // Insert at the beginning
    public void insertAtHead(int val) {
        ListNode newNode = new ListNode(val);
        newNode.next = head;
        head = newNode;
    }
    
    // Insert at the end
    public void insertAtTail(int val) {
        ListNode newNode = new ListNode(val);
        
        if (head == null) {
            head = newNode;
            return;
        }
        
        ListNode current = head;
        while (current.next != null) {
            current = current.next;
        }
        current.next = newNode;
    }
    
    // Delete a node with given value
    public void delete(int val) {
        if (head == null) return;
        
        if (head.val == val) {
            head = head.next;
            return;
        }
        
        ListNode current = head;
        while (current.next != null && current.next.val != val) {
            current = current.next;
        }
        
        if (current.next != null) {
            current.next = current.next.next;
        }
    }
    
    // Print the list
    public void print() {
        ListNode current = head;
        while (current != null) {
            System.out.print(current.val + "->");
            current = current.next;
        }
        System.out.println("null");
    }
}
```

## Advanced Operations

### 1. Reverse a Linked List (Iterative)
```java
public ListNode reverse() {
    ListNode prev = null;
    ListNode current = head;
    
    while (current != null) {
        ListNode nextTemp = current.next;
        current.next = prev;
        prev = current;
        current = nextTemp;
    }
    
    head = prev;
    return head;
}
```

### 2. Detect Cycle (Floyd's Algorithm)
```java
public boolean hasCycle() {
    if (head == null || head.next == null) return false;
    
    ListNode slow = head;
    ListNode fast = head;
    
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        
        if (slow == fast) return true;
    }
    
    return false;
}
```

### 3. Find Middle Node
```java
public ListNode findMiddle() {
    if (head == null) return null;
    
    ListNode slow = head;
    ListNode fast = head;
    
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return slow;
}
```

## Complete Solution with Tests

```java
public class LinkedListTest {
    public static void main(String[] args) {
        LinkedList list = new LinkedList();
        
        // Test insertions
        list.insertAtTail(1);
        list.insertAtTail(2);
        list.insertAtTail(3);
        list.insertAtHead(0);
        System.out.println("After insertions:");
        list.print();
        
        // Test deletion
        list.delete(2);
        System.out.println("After deleting 2:");
        list.print();
        
        // Test reversal
        list.reverse();
        System.out.println("After reversal:");
        list.print();
        
        // Test cycle detection
        System.out.println("Has cycle: " + list.hasCycle());
        
        // Test finding middle
        ListNode middle = list.findMiddle();
        System.out.println("Middle node value: " + middle.val);
    }
}
```

## Variations

### 1. Remove Nth Node From End
```java
public void removeNthFromEnd(int n) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    
    ListNode first = dummy;
    ListNode second = dummy;
    
    // Advance first pointer by n+1 steps
    for (int i = 0; i <= n; i++) {
        first = first.next;
    }
    
    // Move both pointers until first reaches end
    while (first != null) {
        first = first.next;
        second = second.next;
    }
    
    second.next = second.next.next;
    head = dummy.next;
}
```

### 2. Merge Two Sorted Lists
```java
public static ListNode mergeSorted(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode(0);
    ListNode current = dummy;
    
    while (l1 != null && l2 != null) {
        if (l1.val <= l2.val) {
            current.next = l1;
            l1 = l1.next;
        } else {
            current.next = l2;
            l2 = l2.next;
        }
        current = current.next;
    }
    
    current.next = l1 != null ? l1 : l2;
    return dummy.next;
}
```

## Common Pitfalls and Tips

1. **Null Pointer**: Always check for null before accessing next pointer
2. **Lost References**: Save next reference before modifying links
3. **Infinite Loops**: Be careful with cycle detection
4. **Head Updates**: Remember to update head when necessary
5. **Edge Cases**: Handle empty list and single node cases

## Interview Tips

1. Draw the list operations on paper
2. Use dummy nodes for easier handling of edge cases
3. Consider both iterative and recursive solutions
4. Test with different list sizes
5. Consider space and time complexity

## Follow-up Questions

1. How would you handle doubly linked lists?
2. Can you implement these operations recursively?
3. How would you detect and remove a cycle?
4. How to optimize for space complexity?
5. How to handle concurrent modifications?

## Real-world Applications

1. Browser history implementation
2. Undo/Redo functionality
3. Memory management
4. Music playlist
5. Task scheduling

## Testing Edge Cases

```java
// Test empty list
LinkedList emptyList = new LinkedList();
assert emptyList.hasCycle() == false;

// Test single node
LinkedList singleNode = new LinkedList();
singleNode.insertAtHead(1);
assert singleNode.findMiddle().val == 1;

// Test two nodes
LinkedList twoNodes = new LinkedList();
twoNodes.insertAtHead(1);
twoNodes.insertAtHead(2);
twoNodes.reverse();
assert twoNodes.head.val == 1;

// Test deletion of head
LinkedList deleteHead = new LinkedList();
deleteHead.insertAtHead(1);
deleteHead.delete(1);
assert deleteHead.head == null;
```

## Performance Comparison

| Operation | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| Insert at Head | O(1) | O(1) |
| Insert at Tail | O(n) | O(1) |
| Delete | O(n) | O(1) |
| Reverse | O(n) | O(1) |
| Cycle Detection | O(n) | O(1) |
| Find Middle | O(n) | O(1) |

## Optimization Tips

1. Use fast/slow pointer technique for cycle detection
2. Maintain tail pointer for O(1) insertion at end
3. Use dummy nodes to simplify edge cases
4. Consider using sentinel nodes
5. Use recursion carefully due to stack space 