# Java Basic Concepts

This page provides an overview of Java basic concepts and syntax.

## Introduction to Java

Java is a high-level, class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible. It is a general-purpose programming language intended to let application developers write once, run anywhere (WORA).

## Variables and Data Types

Java has several built-in data types:

- **Primitive types**: byte, short, int, long, float, double, boolean, char
- **Reference types**: String, Arrays, Classes

Example:

```java
// Primitive types
int number = 10;
double price = 9.99;
boolean isValid = true;
char grade = 'A';

// Reference types
String name = "John Doe";
int[] numbers = {1, 2, 3, 4, 5};
```

## Control Flow

Java supports standard control flow constructs:

### Conditional Statements

```java
if (condition) {
    // code to execute if condition is true
} else if (anotherCondition) {
    // code to execute if anotherCondition is true
} else {
    // code to execute if all conditions are false
}

// Switch statement
switch (variable) {
    case value1:
        // code
        break;
    case value2:
        // code
        break;
    default:
        // default code
}
```

### Loops

```java
// For loop
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}

// While loop
while (condition) {
    // code
}

// Do-while loop
do {
    // code
} while (condition);

// Enhanced for loop (for-each)
for (String item : items) {
    System.out.println(item);
}
```

## Methods

Methods are blocks of code that perform specific tasks:

```java
public returnType methodName(parameterType parameterName) {
    // method body
    return value; // if return type is not void
}
```

Example:

```java
public int add(int a, int b) {
    return a + b;
}
```

## Classes and Objects

Java is an object-oriented language where classes are blueprints for objects:

```java
public class Person {
    // Fields
    private String name;
    private int age;
    
    // Constructor
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    // Methods
    public String getName() {
        return name;
    }
    
    public int getAge() {
        return age;
    }
}

// Creating an object
Person person = new Person("John", 30);
```

## Further Reading

- [Oracle Java Documentation](https://docs.oracle.com/en/java/)
- [Java Language Specification](https://docs.oracle.com/javase/specs/) 