# String Palindrome

## Problem Statement
Given a string, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.

## Examples

### Example 1:
```
Input: "A man, a plan, a canal: Panama"
Output: true
Explanation: "amanaplanacanalpanama" is a palindrome when considering only alphanumeric characters.
```

### Example 2:
```
Input: "race a car"
Output: false
Explanation: "raceacar" is not a palindrome.
```

### Example 3:
```
Input: " "
Output: true
Explanation: An empty string is considered a palindrome.
```

## Approaches

### 1. Two-Pointer Approach (Optimal)
Use two pointers moving from both ends, skipping non-alphanumeric characters.

```java
public class StringPalindrome {
    public boolean isPalindrome(String s) {
        if (s == null || s.length() == 0) return true;
        
        int left = 0;
        int right = s.length() - 1;
        
        while (left < right) {
            // Skip non-alphanumeric characters from left
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) {
                left++;
            }
            
            // Skip non-alphanumeric characters from right
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) {
                right--;
            }
            
            // Compare characters
            if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
                return false;
            }
            
            left++;
            right--;
        }
        
        return true;
    }
}
```

**Time Complexity**: O(n)
**Space Complexity**: O(1)

### 2. Clean String Approach
First clean the string by removing non-alphanumeric characters and converting to lowercase, then check if it equals its reverse.

```java
public class StringPalindrome {
    public boolean isPalindrome_Clean(String s) {
        // Clean the string
        String cleanStr = s.replaceAll("[^A-Za-z0-9]", "").toLowerCase();
        
        // Compare with its reverse
        return cleanStr.equals(new StringBuilder(cleanStr).reverse().toString());
    }
}
```

**Time Complexity**: O(n)
**Space Complexity**: O(n)

### 3. Character Array Approach
Convert to char array for faster character access.

```java
public class StringPalindrome {
    public boolean isPalindrome_CharArray(String s) {
        char[] chars = s.toCharArray();
        int left = 0;
        int right = chars.length - 1;
        
        while (left < right) {
            while (left < right && !isAlphanumeric(chars[left])) {
                left++;
            }
            
            while (left < right && !isAlphanumeric(chars[right])) {
                right--;
            }
            
            if (toLowerCase(chars[left]) != toLowerCase(chars[right])) {
                return false;
            }
            
            left++;
            right--;
        }
        
        return true;
    }
    
    private boolean isAlphanumeric(char c) {
        return (c >= 'a' && c <= 'z') ||
               (c >= 'A' && c <= 'Z') ||
               (c >= '0' && c <= '9');
    }
    
    private char toLowerCase(char c) {
        if (c >= 'A' && c <= 'Z') {
            return (char) (c + 32);
        }
        return c;
    }
}
```

**Time Complexity**: O(n)
**Space Complexity**: O(n)

## Complete Solution with Tests

```java
public class StringPalindromeTest {
    public static void main(String[] args) {
        StringPalindrome solution = new StringPalindrome();
        
        // Test cases
        String[] testCases = {
            "A man, a plan, a canal: Panama",
            "race a car",
            " ",
            ".,",
            "0P",
            "a.",
            "abcba"
        };
        
        for (String test : testCases) {
            System.out.println("Input: \"" + test + "\"");
            System.out.println("Two-Pointer Approach: " + solution.isPalindrome(test));
            System.out.println("Clean String Approach: " + solution.isPalindrome_Clean(test));
            System.out.println("Char Array Approach: " + solution.isPalindrome_CharArray(test));
            System.out.println();
        }
    }
}
```

## Variations

### 1. Valid Palindrome II (Allow one character deletion)
```java
public boolean validPalindromeII(String s) {
    int left = 0;
    int right = s.length() - 1;
    
    while (left < right) {
        if (s.charAt(left) != s.charAt(right)) {
            return isPalindrome(s, left + 1, right) || 
                   isPalindrome(s, left, right - 1);
        }
        left++;
        right--;
    }
    return true;
}

private boolean isPalindrome(String s, int left, int right) {
    while (left < right) {
        if (s.charAt(left) != s.charAt(right)) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}
```

### 2. Longest Palindromic Substring
```java
public String longestPalindrome(String s) {
    if (s == null || s.length() < 2) return s;
    
    int start = 0;
    int maxLength = 1;
    
    for (int i = 0; i < s.length(); i++) {
        // Check odd length palindromes
        int len1 = expandAroundCenter(s, i, i);
        // Check even length palindromes
        int len2 = expandAroundCenter(s, i, i + 1);
        
        int len = Math.max(len1, len2);
        if (len > maxLength) {
            start = i - (len - 1) / 2;
            maxLength = len;
        }
    }
    
    return s.substring(start, start + maxLength);
}

private int expandAroundCenter(String s, int left, int right) {
    while (left >= 0 && right < s.length() && 
           s.charAt(left) == s.charAt(right)) {
        left--;
        right++;
    }
    return right - left - 1;
}
```

## Common Pitfalls and Tips

1. **Case Sensitivity**: Remember to handle uppercase and lowercase characters.
2. **Special Characters**: Consider how to handle spaces, punctuation, and numbers.
3. **Empty String**: Define whether an empty string is a palindrome.
4. **Unicode Characters**: Consider how to handle non-ASCII characters if required.
5. **Performance**: Choose the appropriate approach based on input characteristics.

## Interview Tips

1. Clarify the requirements about case sensitivity and special characters.
2. Discuss the trade-offs between different approaches.
3. Consider writing helper methods for cleaner code.
4. Handle edge cases explicitly.
5. Optimize for space if required.

## Follow-up Questions

1. How would you handle Unicode characters?
2. What if the string is very long?
3. How would you modify the solution to find palindromic substrings?
4. Can you solve it without using extra space?
5. How would you handle streaming input?

## Real-world Applications

1. Text processing and validation
2. DNA sequence analysis
3. Word games and puzzles
4. Natural language processing
5. Data integrity checking

## Testing Edge Cases

```java
// Test empty string
assert solution.isPalindrome("");

// Test single character
assert solution.isPalindrome("a");

// Test all special characters
assert solution.isPalindrome(".,");

// Test mixed case with numbers
assert solution.isPalindrome("A1b2,2b1a");

// Test long palindrome
String longPalindrome = "a".repeat(1000000);
assert solution.isPalindrome(longPalindrome);
``` 