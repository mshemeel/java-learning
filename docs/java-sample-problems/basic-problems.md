# Basic Java Problems

This section contains fundamental Java programming problems to help you practice core concepts.

## Problem 1: String Reversal

### Problem Statement
Write a Java program to reverse a string without using the built-in reverse() method.

### Requirements
- Input: A string
- Output: The reversed string
- Constraints: Do not use StringBuffer or StringBuilder reverse() method

### Sample Input/Output
```
Input: "Hello, World!"
Output: "!dlroW ,olleH"
```

### Solution Approach
1. Convert the string to a character array
2. Use two pointers (start and end)
3. Swap characters at both pointers
4. Move pointers towards the center
5. Convert back to string

### Solution
```java
public class StringReversal {
    public static String reverse(String input) {
        if (input == null || input.isEmpty()) {
            return input;
        }
        
        char[] chars = input.toCharArray();
        int start = 0;
        int end = chars.length - 1;
        
        while (start < end) {
            // Swap characters
            char temp = chars[start];
            chars[start] = chars[end];
            chars[end] = temp;
            
            // Move pointers
            start++;
            end--;
        }
        
        return new String(chars);
    }
}
```

### Test Cases
```java
@Test
public void testReverse() {
    assertEquals("", StringReversal.reverse(""));
    assertEquals("a", StringReversal.reverse("a"));
    assertEquals("ba", StringReversal.reverse("ab"));
    assertEquals("!dlroW ,olleH", StringReversal.reverse("Hello, World!"));
    assertNull(StringReversal.reverse(null));
}
```

## Problem 2: Palindrome Check

### Problem Statement
Write a Java program to check if a given string is a palindrome.

### Requirements
- Input: A string
- Output: Boolean indicating if the string is a palindrome
- Constraints: Ignore case and non-alphanumeric characters

### Sample Input/Output
```
Input: "A man, a plan, a canal: Panama"
Output: true

Input: "race a car"
Output: false
```

### Solution Approach
1. Convert string to lowercase
2. Remove non-alphanumeric characters
3. Use two pointers to compare characters from both ends
4. Return true if all characters match

### Solution
```java
public class PalindromeCheck {
    public static boolean isPalindrome(String input) {
        if (input == null || input.isEmpty()) {
            return true;
        }
        
        // Convert to lowercase and remove non-alphanumeric characters
        String cleaned = input.toLowerCase().replaceAll("[^a-z0-9]", "");
        
        int start = 0;
        int end = cleaned.length() - 1;
        
        while (start < end) {
            if (cleaned.charAt(start) != cleaned.charAt(end)) {
                return false;
            }
            start++;
            end--;
        }
        
        return true;
    }
}
```

### Test Cases
```java
@Test
public void testIsPalindrome() {
    assertTrue(PalindromeCheck.isPalindrome(""));
    assertTrue(PalindromeCheck.isPalindrome("a"));
    assertTrue(PalindromeCheck.isPalindrome("A man, a plan, a canal: Panama"));
    assertFalse(PalindromeCheck.isPalindrome("race a car"));
    assertTrue(PalindromeCheck.isPalindrome(null));
}
```

## Contributing
Feel free to add more problems or improve the existing solutions. See our [Contributing Guide](../../CONTRIBUTING.md) for details. 