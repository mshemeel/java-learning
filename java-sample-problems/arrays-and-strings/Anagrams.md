# Anagrams

## Problem Statement
Given two strings, determine if they are anagrams of each other. An anagram is a word or phrase formed by rearranging the letters of another.

## Examples

### Example 1:
```
Input: s = "anagram", t = "nagaram"
Output: true
Explanation: Both strings contain the same characters with the same frequencies.
```

### Example 2:
```
Input: s = "rat", t = "car"
Output: false
Explanation: The strings contain different characters.
```

### Example 3:
```
Input: s = "listen", t = "silent"
Output: true
Explanation: Both strings contain the same characters with the same frequencies.
```

## Approaches

### 1. Sorting Approach
Sort both strings and compare them.

```java
public class Anagrams {
    public boolean isAnagram_Sort(String s, String t) {
        if (s.length() != t.length()) return false;
        
        char[] sChars = s.toCharArray();
        char[] tChars = t.toCharArray();
        
        Arrays.sort(sChars);
        Arrays.sort(tChars);
        
        return Arrays.equals(sChars, tChars);
    }
}
```

**Time Complexity**: O(n log n) due to sorting
**Space Complexity**: O(n) for creating char arrays

### 2. Character Count Array (Optimal for ASCII)
Use an array to count character frequencies.

```java
public class Anagrams {
    public boolean isAnagram_Count(String s, String t) {
        if (s.length() != t.length()) return false;
        
        int[] charCount = new int[26]; // For lowercase letters
        
        for (int i = 0; i < s.length(); i++) {
            charCount[s.charAt(i) - 'a']++;
            charCount[t.charAt(i) - 'a']--;
        }
        
        for (int count : charCount) {
            if (count != 0) return false;
        }
        
        return true;
    }
}
```

**Time Complexity**: O(n)
**Space Complexity**: O(1) - fixed size array

### 3. HashMap Approach (For Unicode)
Use a HashMap to count character frequencies.

```java
public class Anagrams {
    public boolean isAnagram_HashMap(String s, String t) {
        if (s.length() != t.length()) return false;
        
        Map<Character, Integer> charCount = new HashMap<>();
        
        // Count characters in s
        for (char c : s.toCharArray()) {
            charCount.put(c, charCount.getOrDefault(c, 0) + 1);
        }
        
        // Decrement counts for t
        for (char c : t.toCharArray()) {
            if (!charCount.containsKey(c)) return false;
            
            int count = charCount.get(c);
            if (count == 1) {
                charCount.remove(c);
            } else {
                charCount.put(c, count - 1);
            }
        }
        
        return charCount.isEmpty();
    }
}
```

**Time Complexity**: O(n)
**Space Complexity**: O(k) where k is the number of unique characters

## Group Anagrams
A common variation is to group multiple strings into anagram groups.

```java
public class Anagrams {
    public List<List<String>> groupAnagrams(String[] strs) {
        if (strs == null || strs.length == 0) return new ArrayList<>();
        
        Map<String, List<String>> anagramGroups = new HashMap<>();
        
        for (String str : strs) {
            // Create character count key
            char[] chars = new char[26];
            for (char c : str.toCharArray()) {
                chars[c - 'a']++;
            }
            String key = new String(chars);
            
            // Add to appropriate group
            anagramGroups.computeIfAbsent(key, k -> new ArrayList<>()).add(str);
        }
        
        return new ArrayList<>(anagramGroups.values());
    }
}
```

## Complete Solution with Tests

```java
public class AnagramsTest {
    public static void main(String[] args) {
        Anagrams solution = new Anagrams();
        
        // Test cases for isAnagram
        String[][] testPairs = {
            {"anagram", "nagaram"},
            {"rat", "car"},
            {"listen", "silent"},
            {"", ""},
            {"a", "a"},
            {"ab", "ba"}
        };
        
        for (String[] pair : testPairs) {
            System.out.println("Testing: " + pair[0] + ", " + pair[1]);
            System.out.println("Sort approach: " + 
                solution.isAnagram_Sort(pair[0], pair[1]));
            System.out.println("Count approach: " + 
                solution.isAnagram_Count(pair[0], pair[1]));
            System.out.println("HashMap approach: " + 
                solution.isAnagram_HashMap(pair[0], pair[1]));
            System.out.println();
        }
        
        // Test groupAnagrams
        String[] words = {"eat", "tea", "tan", "ate", "nat", "bat"};
        System.out.println("Group Anagrams Result:");
        System.out.println(solution.groupAnagrams(words));
    }
}
```

## Variations

### 1. Valid Anagram After One Character Removal
```java
public boolean isAnagramAfterOneRemoval(String s, String t) {
    if (Math.abs(s.length() - t.length()) != 1) return false;
    
    String longer = s.length() > t.length() ? s : t;
    String shorter = s.length() > t.length() ? t : s;
    
    int[] charCount = new int[26];
    
    for (char c : longer.toCharArray()) charCount[c - 'a']++;
    for (char c : shorter.toCharArray()) charCount[c - 'a']--;
    
    int diffCount = 0;
    for (int count : charCount) {
        if (count > 1) return false;
        if (count == 1) diffCount++;
    }
    
    return diffCount == 1;
}
```

### 2. K-Anagrams (At most k different characters)
```java
public boolean isKAnagram(String s, String t, int k) {
    if (s.length() != t.length()) return false;
    
    int[] charCount = new int[26];
    
    for (char c : s.toCharArray()) charCount[c - 'a']++;
    for (char c : t.toCharArray()) charCount[c - 'a']--;
    
    int diff = 0;
    for (int count : charCount) {
        diff += Math.abs(count);
    }
    
    return diff <= 2 * k;
}
```

## Common Pitfalls and Tips

1. **Length Check**: Always check string lengths first.
2. **Case Sensitivity**: Clarify if the comparison is case-sensitive.
3. **Space Characters**: Define how to handle spaces and special characters.
4. **Empty Strings**: Consider if empty strings are anagrams of each other.
5. **Unicode Support**: Choose appropriate approach based on character set.

## Interview Tips

1. Start with clarifying questions about requirements.
2. Discuss trade-offs between different approaches.
3. Consider memory constraints when choosing an approach.
4. Handle edge cases explicitly.
5. Mention possible optimizations.

## Follow-up Questions

1. How would you handle Unicode characters?
2. What if the strings are very long?
3. How would you modify the solution for streaming input?
4. Can you solve it with constant space?
5. How would you handle very large sets of strings for grouping?

## Real-world Applications

1. Spell checkers
2. Word games
3. DNA sequence analysis
4. Cryptography
5. Text analysis and processing

## Testing Edge Cases

```java
// Test empty strings
assert solution.isAnagram_Count("", "");

// Test single character
assert solution.isAnagram_Count("a", "a");

// Test same characters, different lengths
assert !solution.isAnagram_Count("rat", "rats");

// Test case sensitivity
assert !solution.isAnagram_Count("Rat", "tar");

// Test with spaces
assert solution.isAnagram_Count("debit card", "bad credit");

// Test with special characters
assert solution.isAnagram_Count("a!b@c#", "c@b#a!");
```

## Performance Comparison

| Approach | Time Complexity | Space Complexity | Best For |
|----------|----------------|------------------|----------|
| Sorting | O(n log n) | O(n) | Simple implementation |
| Count Array | O(n) | O(1) | ASCII characters |
| HashMap | O(n) | O(k) | Unicode characters |

## Optimization Tips

1. Use count array for ASCII characters
2. Early return on length mismatch
3. Use single pass for character counting
4. Consider bit manipulation for small character sets
5. Use StringBuilder for string manipulation 