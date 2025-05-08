# Java Basics

## Overview
This guide provides a comprehensive introduction to Java programming fundamentals. Java is a versatile, object-oriented language that runs on the Java Virtual Machine (JVM), making it platform-independent. This guide covers essential Java syntax, data types, control flow, and basic operations for developers new to Java or refreshing their knowledge.

## Prerequisites
- Basic understanding of programming concepts
- Java Development Kit (JDK) 17 or later installed
- Integrated Development Environment (IDE) such as IntelliJ IDEA, Eclipse, or VS Code

## Learning Objectives
- Understand Java's architecture and execution model
- Master Java syntax and fundamental data types
- Work with variables, operators, and expressions
- Implement control flow structures (if/else, loops, switch)
- Create and run a basic Java program
- Understand package organization and imports
- Format and display output in console applications

## Table of Contents
1. [Java Architecture](#java-architecture)
2. [Setting Up Your Environment](#setting-up-your-environment)
3. [First Java Program](#first-java-program)
4. [Variables and Data Types](#variables-and-data-types)
5. [Operators](#operators)
6. [Control Flow](#control-flow)
7. [Arrays](#arrays)
8. [Java Packages](#java-packages)
9. [Input and Output Basics](#input-and-output-basics)
10. [Naming Conventions](#naming-conventions)

## Java Architecture
Java applications operate on the principle of "Write Once, Run Anywhere" (WORA) through a two-step process:
1. Java source code (`.java` files) is compiled into bytecode (`.class` files) using the `javac` compiler
2. The bytecode runs on the Java Virtual Machine (JVM), which interprets or just-in-time compiles it to machine code

This architecture includes:
- **JDK (Java Development Kit)**: Tools for developing Java applications
- **JRE (Java Runtime Environment)**: Resources for running Java applications
- **JVM (Java Virtual Machine)**: The runtime engine that executes Java bytecode

```
Java Architecture Diagram:
+----------------+
| Java Source    |
| Code (.java)   |
+----------------+
        |
        v
+----------------+
| Java Compiler  |
| (javac)        |
+----------------+
        |
        v
+----------------+
| Bytecode       |
| (.class)       |
+----------------+
        |
        v
+----------------+
| JVM            | --> Platform-specific implementation
+----------------+
        |
        v
+----------------+
| Operating      |
| System         |
+----------------+
```

## Setting Up Your Environment
1. **Install JDK 17+**:
   - Download from [Oracle](https://www.oracle.com/java/technologies/downloads/) or use OpenJDK
   - Set JAVA_HOME environment variable
   - Add Java's bin directory to your PATH

2. **Verify installation**:
   ```bash
   java -version
   javac -version
   ```

3. **Choose an IDE**:
   - IntelliJ IDEA: Full-featured, powerful IDE
   - Eclipse: Popular open-source option
   - VS Code with Java extensions: Lightweight alternative

## First Java Program
Create a file named `HelloWorld.java`:

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

Let's break this down:
- `public class HelloWorld`: Class declaration matching the filename
- `public static void main(String[] args)`: The entry point method
  - `public`: Accessible from outside the class
  - `static`: Belongs to the class, not an instance
  - `void`: Returns no value
  - `main`: Special method name recognized as program entry point
  - `String[] args`: Command-line arguments array
- `System.out.println()`: Outputs text to the console

To compile and run:
```bash
javac HelloWorld.java
java HelloWorld
```

## Variables and Data Types
Java is statically typed, requiring variable type declaration.

### Primitive Data Types
| Type    | Size    | Range                                                   | Default |
|---------|---------|--------------------------------------------------------|---------|
| byte    | 8 bits  | -128 to 127                                             | 0       |
| short   | 16 bits | -32,768 to 32,767                                       | 0       |
| int     | 32 bits | -2^31 to 2^31-1                                         | 0       |
| long    | 64 bits | -2^63 to 2^63-1                                         | 0L      |
| float   | 32 bits | ~3.4e-38 to 3.4e+38 (6-7 significant decimal digits)    | 0.0f    |
| double  | 64 bits | ~1.7e-308 to 1.7e+308 (15 significant decimal digits)   | 0.0d    |
| char    | 16 bits | 0 to 65,535 (Unicode characters)                        | '\u0000'|
| boolean | 1 bit   | true or false                                           | false   |

### Variable Declaration and Initialization
```java
// Declaration
int age;
double salary;

// Initialization
age = 25;
salary = 50000.50;

// Declaration and initialization
String name = "John";
final double PI = 3.14159; // Constants are declared with 'final'

// Type inference with var (Java 10+)
var message = "Hello"; // Inferred as String
```

### Reference Types
- **String**: Sequence of characters
  ```java
  String greeting = "Hello, Java!";
  ```

- **Arrays**: Fixed-length collections
  ```java
  int[] numbers = {1, 2, 3, 4, 5};
  String[] names = new String[3];
  ```

- **Classes**: User-defined types
  ```java
  Person person = new Person("John", 25);
  ```

## Operators
Java provides several categories of operators:

### Arithmetic Operators
```java
int a = 10, b = 5;
int sum = a + b;        // Addition: 15
int difference = a - b; // Subtraction: 5
int product = a * b;    // Multiplication: 50
int quotient = a / b;   // Division: 2
int remainder = a % b;  // Modulus: 0
```

### Assignment Operators
```java
int x = 10;
x += 5;  // Equivalent to: x = x + 5
x -= 3;  // Equivalent to: x = x - 3
x *= 2;  // Equivalent to: x = x * 2
x /= 4;  // Equivalent to: x = x / 4
x %= 3;  // Equivalent to: x = x % 3
```

### Comparison Operators
```java
int a = 10, b = 5;
boolean isEqual = a == b;       // false
boolean isNotEqual = a != b;    // true
boolean isGreater = a > b;      // true
boolean isLess = a < b;         // false
boolean isGreaterEqual = a >= b; // true
boolean isLessEqual = a <= b;    // false
```

### Logical Operators
```java
boolean x = true, y = false;
boolean andResult = x && y; // false (logical AND)
boolean orResult = x || y;  // true (logical OR)
boolean notResult = !x;     // false (logical NOT)
```

### Bitwise Operators
```java
int a = 5;  // 101 in binary
int b = 3;  // 011 in binary

int bitwiseAnd = a & b;  // 001 (1 in decimal)
int bitwiseOr = a | b;   // 111 (7 in decimal)
int bitwiseXor = a ^ b;  // 110 (6 in decimal)
int bitwiseNot = ~a;     // ...010 (-6 in decimal, due to two's complement)
int leftShift = a << 1;  // 1010 (10 in decimal)
int rightShift = a >> 1; // 010 (2 in decimal)
```

### Ternary Operator
```java
int age = 20;
String status = (age >= 18) ? "Adult" : "Minor";
```

## Control Flow

### Conditional Statements
```java
// if statement
if (condition) {
    // code to execute if condition is true
}

// if-else statement
if (condition) {
    // code to execute if condition is true
} else {
    // code to execute if condition is false
}

// if-else-if ladder
if (condition1) {
    // code to execute if condition1 is true
} else if (condition2) {
    // code to execute if condition1 is false but condition2 is true
} else {
    // code to execute if both conditions are false
}
```

Example:
```java
int score = 85;

if (score >= 90) {
    System.out.println("Grade: A");
} else if (score >= 80) {
    System.out.println("Grade: B");
} else if (score >= 70) {
    System.out.println("Grade: C");
} else if (score >= 60) {
    System.out.println("Grade: D");
} else {
    System.out.println("Grade: F");
}
```

### Switch Statement
Traditional switch:
```java
int day = 3;
switch (day) {
    case 1:
        System.out.println("Monday");
        break;
    case 2:
        System.out.println("Tuesday");
        break;
    case 3:
        System.out.println("Wednesday");
        break;
    // ... other cases
    default:
        System.out.println("Invalid day");
}
```

Enhanced switch (Java 12+):
```java
int day = 3;
switch (day) {
    case 1 -> System.out.println("Monday");
    case 2 -> System.out.println("Tuesday");
    case 3 -> System.out.println("Wednesday");
    // ... other cases
    default -> System.out.println("Invalid day");
}

// With assignment
String dayName = switch (day) {
    case 1 -> "Monday";
    case 2 -> "Tuesday";
    case 3 -> "Wednesday";
    // ... other cases
    default -> "Invalid day";
};
```

### Loops
```java
// for loop
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}

// enhanced for loop (for-each)
int[] numbers = {1, 2, 3, 4, 5};
for (int num : numbers) {
    System.out.println(num);
}

// while loop
int i = 0;
while (i < 5) {
    System.out.println(i);
    i++;
}

// do-while loop
int j = 0;
do {
    System.out.println(j);
    j++;
} while (j < 5);
```

### Control Statements
```java
// break - exits the loop
for (int i = 0; i < 10; i++) {
    if (i == 5) {
        break; // exits loop when i is 5
    }
    System.out.println(i);
}

// continue - skips current iteration
for (int i = 0; i < 10; i++) {
    if (i % 2 == 0) {
        continue; // skips even numbers
    }
    System.out.println(i);
}
```

## Arrays
Arrays are fixed-size collections of elements of the same type.

### Array Declaration and Initialization
```java
// Declaration
int[] numbers;
String[] names;

// Initialization
numbers = new int[5]; // Creates array of 5 integers initialized to 0
names = new String[3]; // Creates array of 3 strings initialized to null

// Declaration and initialization combined
int[] scores = new int[5];
int[] values = {10, 20, 30, 40, 50}; // Shorthand initialization

// Multidimensional arrays
int[][] matrix = new int[3][3]; // 3x3 matrix
int[][] irregularArray = {
    {1, 2},
    {3, 4, 5},
    {6}
};
```

### Accessing and Modifying Arrays
```java
int[] numbers = {10, 20, 30, 40, 50};

// Accessing elements (0-indexed)
int firstNumber = numbers[0]; // 10
int thirdNumber = numbers[2]; // 30

// Modifying elements
numbers[1] = 25; // Changes 20 to 25

// Array length
int length = numbers.length; // 5

// Iterating through an array
for (int i = 0; i < numbers.length; i++) {
    System.out.println(numbers[i]);
}

// Enhanced for-loop (for-each)
for (int number : numbers) {
    System.out.println(number);
}
```

### Common Array Operations
```java
// Copying arrays
int[] source = {1, 2, 3, 4, 5};
int[] dest = new int[source.length];
System.arraycopy(source, 0, dest, 0, source.length);

// Alternative copying methods
int[] copy1 = Arrays.copyOf(source, source.length);
int[] copy2 = Arrays.copyOfRange(source, 1, 4); // {2, 3, 4}

// Sorting arrays
int[] unsorted = {5, 3, 1, 4, 2};
Arrays.sort(unsorted); // {1, 2, 3, 4, 5}

// Searching (on sorted arrays)
int index = Arrays.binarySearch(unsorted, 3); // 2

// Filling arrays
int[] filled = new int[5];
Arrays.fill(filled, 10); // {10, 10, 10, 10, 10}

// Comparing arrays
boolean areEqual = Arrays.equals(source, copy1); // true
```

## Java Packages
Packages organize related classes and interfaces, providing namespace management and access control.

### Creating and Using Packages
```java
// File: com/example/util/MathHelper.java
package com.example.util;

public class MathHelper {
    public static int add(int a, int b) {
        return a + b;
    }
}

// Using the package in another file
import com.example.util.MathHelper;

public class Main {
    public static void main(String[] args) {
        int sum = MathHelper.add(5, 3);
        System.out.println("Sum: " + sum);
    }
}
```

### Common Java Packages
- `java.lang`: Fundamental classes (automatically imported)
- `java.util`: Collections, date/time, random numbers, etc.
- `java.io`: Input/output operations
- `java.nio`: Enhanced I/O operations
- `java.net`: Networking capabilities
- `java.sql`: Database access
- `java.text`: Text processing utilities
- `java.math`: Precise mathematical operations
- `java.time`: Date and time API (Java 8+)

## Input and Output Basics

### Console Output
```java
// Print without a newline
System.out.print("Hello");

// Print with a newline
System.out.println("Hello, World!");

// Formatted output
System.out.printf("Name: %s, Age: %d%n", "John", 25);
```

### Console Input (using Scanner)
```java
import java.util.Scanner;

public class InputExample {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.print("Enter your name: ");
        String name = scanner.nextLine();
        
        System.out.print("Enter your age: ");
        int age = scanner.nextInt();
        
        System.out.println("Hello, " + name + "! You are " + age + " years old.");
        
        scanner.close(); // Always close the scanner when done
    }
}
```

## Naming Conventions
Java uses specific naming conventions for clarity and consistency:

- **Classes and Interfaces**: PascalCase (e.g., `CustomerService`, `Runnable`)
- **Methods and Variables**: camelCase (e.g., `getUserName()`, `totalAmount`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_VALUE`, `PI`)
- **Packages**: lowercase, domain-reversed (e.g., `com.example.project`)

## Best Practices
1. **Follow naming conventions** consistently
2. **Initialize variables** when declared, when possible
3. **Use constants** (`final` variables) for fixed values
4. **Avoid magic numbers** - use named constants
5. **Handle exceptions** appropriately
6. **Close resources** (like Scanner) when done
7. **Comment your code** meaningfully
8. **Break complex operations** into smaller methods
9. **Use enhanced for-loops** for arrays when possible
10. **Validate input** before processing

## Common Pitfalls and How to Avoid Them
1. **Forgetting semicolons**: Always end statements with semicolons
2. **Mismatching braces**: Use an IDE with brace matching
3. **Off-by-one errors in loops**: Be careful with zero-based indexing
4. **Integer division truncation**: 
   ```java
   double result = 5 / 2; // 2.0 (not 2.5)
   double correctResult = 5.0 / 2; // 2.5
   ```
5. **Neglecting resource cleanup**: Use try-with-resources
6. **Comparing Strings with ==**: Use `equals()` method instead
   ```java
   String a = "hello";
   String b = new String("hello");
   
   if (a == b) { // Wrong! Compares references
       // This won't execute
   }
   
   if (a.equals(b)) { // Correct! Compares content
       // This will execute
   }
   ```
7. **Mutable objects in loops**: Be careful with modifying objects while iterating
8. **Importing every class** with `import java.util.*`: Import specific classes

## Resources for Further Learning
1. **Official Documentation**:
   - [Oracle Java Documentation](https://docs.oracle.com/en/java/)
   - [Java SE 17 API Specification](https://docs.oracle.com/en/java/javase/17/docs/api/index.html)

2. **Books**:
   - "Effective Java" by Joshua Bloch
   - "Java: The Complete Reference" by Herbert Schildt
   - "Head First Java" by Kathy Sierra and Bert Bates

3. **Online Courses**:
   - [Codecademy Java Course](https://www.codecademy.com/learn/learn-java)
   - [Coursera - Object-Oriented Programming in Java](https://www.coursera.org/specializations/object-oriented-programming)
   - [Udemy - Java Programming Masterclass](https://www.udemy.com/course/java-the-complete-java-developer-course/)

4. **Practice Platforms**:
   - [HackerRank - Java](https://www.hackerrank.com/domains/java)
   - [LeetCode](https://leetcode.com/)
   - [Codewars](https://www.codewars.com/)

## Practice Exercises
1. **Hello User**:
   Write a program that asks for the user's name and greets them with a personalized message.

2. **Number Classifier**:
   Create a program that takes a number as input and classifies it as positive, negative, or zero.

3. **FizzBuzz**:
   Write a program that prints numbers from 1 to 100, but for multiples of 3 prints "Fizz," for multiples of 5 prints "Buzz," and for multiples of both prints "FizzBuzz."

4. **Calculator**:
   Implement a simple calculator that can perform addition, subtraction, multiplication, and division on two numbers.

5. **Array Operations**:
   Create a program that performs basic operations on an array: find the minimum, maximum, sum, and average.

6. **Word Counter**:
   Write a program that counts the number of words in a given text.

7. **Guessing Game**:
   Implement a number guessing game where the program generates a random number and the user tries to guess it.

8. **Temperature Converter**:
   Create a program that converts temperatures between Celsius and Fahrenheit.

9. **Prime Number Checker**:
   Write a program that checks if a number is prime or not.

10. **Palindrome Detector**:
    Implement a program that determines if a given word or phrase is a palindrome. 