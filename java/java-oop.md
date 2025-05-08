# Object-Oriented Programming in Java

## Overview
This guide explores Object-Oriented Programming (OOP) in Java, covering key concepts like classes, objects, inheritance, polymorphism, encapsulation, and abstraction. OOP is a programming paradigm that organizes code around data (objects) rather than functions and logic, making Java programs more modular, flexible, and maintainable.

## Prerequisites
- Basic Java syntax and language fundamentals
- Understanding of variables, methods, and control flow in Java
- Java Development Kit (JDK) 17 or later installed

## Learning Objectives
- Understand the principles of Object-Oriented Programming
- Create and use classes and objects in Java
- Implement inheritance hierarchies effectively
- Apply polymorphism through method overriding and interfaces
- Design well-encapsulated classes with proper access modifiers
- Utilize abstraction using abstract classes and interfaces
- Work with Java constructors, this keyword, and static members
- Understand object lifecycle and memory management

## Table of Contents
1. [OOP Fundamentals](#oop-fundamentals)
2. [Classes and Objects](#classes-and-objects)
3. [Constructors](#constructors)
4. [Encapsulation and Access Control](#encapsulation-and-access-control)
5. [Inheritance](#inheritance)
6. [Polymorphism](#polymorphism)
7. [Abstraction](#abstraction)
8. [Interfaces](#interfaces)
9. [Advanced OOP Concepts](#advanced-oop-concepts)
10. [Best Practices](#best-practices)

## OOP Fundamentals

Object-Oriented Programming is built on four main principles:

1. **Encapsulation**: Bundling data and methods that operate on that data within a single unit (class), and restricting direct access to some of the object's components.

2. **Inheritance**: The ability of a class to inherit properties and behavior from another class, promoting code reuse.

3. **Polymorphism**: The ability of different classes to be treated as instances of the same class through inheritance, enabling a single interface to represent different underlying forms.

4. **Abstraction**: Simplifying complex reality by modeling classes based on the essential properties and behaviors relevant to the application's context.

## Classes and Objects

### Classes
A class is a blueprint or template for creating objects. It defines the properties (attributes) and behaviors (methods) that the objects created from the class will have.

```java
// Basic class structure
public class Car {
    // Fields (attributes)
    private String make;
    private String model;
    private int year;
    private double mileage;
    
    // Methods (behaviors)
    public void drive(double distance) {
        mileage += distance;
        System.out.println("Driving " + distance + " miles");
    }
    
    public void displayInfo() {
        System.out.println(year + " " + make + " " + model);
        System.out.println("Mileage: " + mileage);
    }
}
```

### Objects
An object is an instance of a class, representing a specific entity with its own set of values for the attributes defined in the class.

```java
// Creating objects (instances) of the Car class
Car myCar = new Car();
Car yourCar = new Car();

// Each object has its own state
myCar.drive(100);
yourCar.drive(50);
```

## Constructors

Constructors are special methods that initialize objects. They have the same name as the class and don't have a return type.

### Types of Constructors

1. **Default Constructor**: Created by Java if no constructor is defined, initializes attributes to default values.

2. **Parameterized Constructor**: Takes parameters to initialize object attributes.

3. **Copy Constructor**: Creates a new object with the same attribute values as an existing object.

```java
public class Car {
    private String make;
    private String model;
    private int year;
    private double mileage;
    
    // Default constructor
    public Car() {
        make = "Unknown";
        model = "Unknown";
        year = 2023;
        mileage = 0;
    }
    
    // Parameterized constructor
    public Car(String make, String model, int year) {
        this.make = make;
        this.model = model;
        this.year = year;
        this.mileage = 0;
    }
    
    // Copy constructor
    public Car(Car otherCar) {
        this.make = otherCar.make;
        this.model = otherCar.model;
        this.year = otherCar.year;
        this.mileage = otherCar.mileage;
    }
}
```

### Constructor Overloading
Multiple constructors with different parameter lists:

```java
// Using the constructors
Car car1 = new Car();  // Default constructor
Car car2 = new Car("Toyota", "Corolla", 2022);  // Parameterized constructor
Car car3 = new Car(car2);  // Copy constructor
```

### The `this` Keyword
`this` refers to the current object instance and is used to:
- Distinguish between class attributes and parameters with the same name
- Invoke other constructors
- Pass the current object as a parameter to other methods

```java
public class Person {
    private String name;
    private int age;
    
    // Using this to refer to instance variables
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    // Using this to call another constructor
    public Person(String name) {
        this(name, 0);  // Calls the constructor that takes name and age
    }
}
```

## Encapsulation and Access Control

Encapsulation is the bundling of data and methods that operate on that data within a single unit (class), and restricting direct access to some components.

### Access Modifiers
Java provides four access modifiers to control the visibility of classes, fields, methods, and constructors:

1. **private**: Accessible only within the same class
2. **default** (no modifier): Accessible within the same package
3. **protected**: Accessible within the same package and by subclasses
4. **public**: Accessible from anywhere

```java
public class BankAccount {
    // Private fields - not directly accessible from outside
    private String accountNumber;
    private double balance;
    
    // Public getters and setters - controlled access
    public String getAccountNumber() {
        return accountNumber;
    }
    
    public double getBalance() {
        return balance;
    }
    
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }
    
    public boolean withdraw(double amount) {
        if (amount > 0 && balance >= amount) {
            balance -= amount;
            return true;
        }
        return false;
    }
}
```

### Benefits of Encapsulation
- **Data hiding**: Prevents unauthorized access to internal implementation details
- **Flexibility**: Implementation can change without affecting client code
- **Validation**: Can enforce rules on how data is modified
- **Maintainability**: Easier to modify internal implementation without breaking dependent code

## Inheritance

Inheritance allows a class to inherit attributes and behaviors from another class, facilitating code reuse and establishing an "is-a" relationship.

### Types of Inheritance
- **Single inheritance**: A class inherits from one superclass
- **Multilevel inheritance**: A class inherits from a class that inherits from another class
- **Hierarchical inheritance**: Multiple classes inherit from a single superclass

Java does not support multiple inheritance directly (a class cannot extend multiple classes), but it can be achieved through interfaces.

### Syntax
```java
// Parent/superclass/base class
public class Vehicle {
    protected String make;
    protected String model;
    protected int year;
    
    public Vehicle(String make, String model, int year) {
        this.make = make;
        this.model = model;
        this.year = year;
    }
    
    public void displayInfo() {
        System.out.println(year + " " + make + " " + model);
    }
}

// Child/subclass/derived class
public class Car extends Vehicle {
    private int numDoors;
    
    public Car(String make, String model, int year, int numDoors) {
        super(make, model, year);  // Call to parent constructor
        this.numDoors = numDoors;
    }
    
    // Override parent method
    @Override
    public void displayInfo() {
        super.displayInfo();  // Call parent method
        System.out.println("Number of doors: " + numDoors);
    }
}
```

### The `super` Keyword
The `super` keyword is used to:
- Call the superclass constructor
- Access superclass methods and fields
- Distinguish between superclass and subclass members with the same name

### Method Overriding
Method overriding occurs when a subclass provides a specific implementation of a method that is already defined in its superclass.

```java
@Override  // Annotation to ensure proper overriding
public void displayInfo() {
    // New implementation
}
```

### The `final` Keyword
The `final` modifier can be used with:
- **Classes**: Prevents the class from being extended
- **Methods**: Prevents the method from being overridden in subclasses
- **Variables**: Creates constants whose values cannot be changed

```java
// Final class that cannot be extended
public final class ImmutableClass {
    // Final variable (constant)
    public final double PI = 3.14159;
    
    // Final method that cannot be overridden
    public final void display() {
        System.out.println("This method cannot be overridden");
    }
}
```

## Polymorphism

Polymorphism allows objects of different types to be treated as objects of a common supertype, enabling a single interface to represent different underlying forms.

### Types of Polymorphism

1. **Compile-time Polymorphism (Method Overloading)**:
   Multiple methods with the same name but different parameters in the same class.

   ```java
   public class Calculator {
       // Method overloading
       public int add(int a, int b) {
           return a + b;
       }
       
       public double add(double a, double b) {
           return a + b;
       }
       
       public int add(int a, int b, int c) {
           return a + b + c;
       }
   }
   ```

2. **Runtime Polymorphism (Method Overriding)**:
   Subclass provides a specific implementation of a method already defined in its superclass.

   ```java
   // Using runtime polymorphism
   Vehicle vehicle1 = new Car("Toyota", "Corolla", 2022, 4);
   Vehicle vehicle2 = new Motorcycle("Honda", "CBR", 2023);
   
   vehicle1.displayInfo();  // Calls Car's implementation
   vehicle2.displayInfo();  // Calls Motorcycle's implementation
   ```

### Benefits of Polymorphism
- **Flexibility**: Code can work with objects of different classes through a common interface
- **Extensibility**: New classes can be added without changing existing code
- **Simplicity**: Reduces complex conditional logic by using the right method implementation for each object type

## Abstraction

Abstraction focuses on essential qualities rather than specific characteristics, hiding complex implementation details and showing only the necessary features.

### Abstract Classes

An abstract class is a class that cannot be instantiated and is meant to be subclassed. It can contain abstract methods (methods without implementation) that must be implemented by concrete subclasses.

```java
// Abstract class
public abstract class Shape {
    // Abstract method - no implementation
    public abstract double calculateArea();
    
    // Concrete method - has implementation
    public void display() {
        System.out.println("This is a shape with area: " + calculateArea());
    }
}

// Concrete subclass
public class Circle extends Shape {
    private double radius;
    
    public Circle(double radius) {
        this.radius = radius;
    }
    
    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
}
```

### Key Points
- Abstract classes can have both abstract and concrete methods
- Abstract classes cannot be instantiated directly (`new Shape()` would be illegal)
- A class that extends an abstract class must implement all abstract methods, or itself be declared abstract
- Abstract classes can have constructors, fields, and non-abstract methods

## Interfaces

An interface is a reference type that defines a contract of methods that implementing classes must provide. It represents a capability or behavior that classes can implement.

### Syntax
```java
// Interface definition
public interface Drivable {
    // Abstract methods (implicitly public and abstract)
    void start();
    void stop();
    void accelerate(double speed);
    
    // Default method (Java 8+)
    default void park() {
        System.out.println("Parking the vehicle");
    }
    
    // Static method (Java 8+)
    static double convertMilesToKm(double miles) {
        return miles * 1.60934;
    }
}

// Implementing an interface
public class Car implements Drivable {
    @Override
    public void start() {
        System.out.println("Starting the car");
    }
    
    @Override
    public void stop() {
        System.out.println("Stopping the car");
    }
    
    @Override
    public void accelerate(double speed) {
        System.out.println("Accelerating to " + speed + " mph");
    }
}
```

### Interface vs. Abstract Class

| Feature                      | Interface                                      | Abstract Class                               |
|------------------------------|------------------------------------------------|----------------------------------------------|
| Multiple Inheritance         | A class can implement multiple interfaces      | A class can extend only one abstract class   |
| State                        | Cannot have state (fields) before Java 8       | Can have fields with any access modifier     |
| Constructor                  | Cannot have constructors                       | Can have constructors                        |
| Method Implementation        | Can have default and static methods (Java 8+)  | Can have both abstract and concrete methods  |
| Access Modifiers             | Methods are implicitly public                  | Methods can have any access modifier         |
| Purpose                      | Defines behavior                               | Provides a base for subclasses               |

### Functional Interfaces (Java 8+)
A functional interface has exactly one abstract method and can be implemented using lambda expressions.

```java
// Functional interface
@FunctionalInterface
public interface Calculable {
    int calculate(int a, int b);
}

// Using lambda expressions
Calculable addition = (a, b) -> a + b;
Calculable subtraction = (a, b) -> a - b;

System.out.println(addition.calculate(5, 3));      // 8
System.out.println(subtraction.calculate(5, 3));   // 2
```

## Advanced OOP Concepts

### Static Members
Static members belong to the class rather than to any instance of the class.

```java
public class MathUtils {
    // Static variable (shared across all instances)
    public static final double PI = 3.14159;
    
    // Static method
    public static int add(int a, int b) {
        return a + b;
    }
    
    // Static block - executed when the class is loaded
    static {
        System.out.println("MathUtils class loaded");
    }
}

// Using static members
double area = MathUtils.PI * radius * radius;
int sum = MathUtils.add(5, 3);
```

### Inner Classes
A class defined within another class to logically group classes and increase encapsulation.

```java
public class OuterClass {
    private int outerField;
    
    // Inner class - has access to all members of the outer class
    public class InnerClass {
        public void display() {
            System.out.println("Outer field: " + outerField);
        }
    }
    
    // Static nested class - doesn't have access to instance members of the outer class
    public static class StaticNestedClass {
        public void display() {
            // Cannot access outerField directly
            System.out.println("Static nested class");
        }
    }
    
    public void createLocalClass() {
        // Local class - defined within a method
        class LocalClass {
            public void display() {
                System.out.println("Local class");
            }
        }
        
        LocalClass local = new LocalClass();
        local.display();
    }
}
```

### Anonymous Classes
Creating a one-time use class without defining a new named class.

```java
// Anonymous class implementing an interface
Runnable runner = new Runnable() {
    @Override
    public void run() {
        System.out.println("Running in anonymous class");
    }
};

// Starting a thread with the anonymous class
new Thread(runner).start();

// More concise with lambda expression (Java 8+)
new Thread(() -> System.out.println("Running with lambda")).start();
```

### Records (Java 16+)
Records are immutable data classes that require minimal code to create simple data carriers.

```java
// Record declaration
public record Person(String name, int age) {
    // Compact constructor
    public Person {
        if (age < 0) {
            throw new IllegalArgumentException("Age cannot be negative");
        }
    }
    
    // Additional methods
    public boolean isAdult() {
        return age >= 18;
    }
}

// Using a record
Person person = new Person("John", 25);
System.out.println(person.name());  // "John"
System.out.println(person.age());   // 25
System.out.println(person.isAdult()); // true
```

### Sealed Classes (Java 17+)
Sealed classes restrict which other classes can extend them, providing more control over the inheritance hierarchy.

```java
// Sealed class with permitted subclasses
public sealed class Shape permits Circle, Rectangle, Triangle {
    // Common shape methods
}

// Permitted subclasses must be final, sealed, or non-sealed
public final class Circle extends Shape {
    // Circle implementation
}

public sealed class Rectangle extends Shape permits Square {
    // Rectangle implementation
}

public final class Square extends Rectangle {
    // Square implementation
}

public non-sealed class Triangle extends Shape {
    // Triangle implementation
}
```

## Best Practices

1. **Follow Single Responsibility Principle**: A class should have only one reason to change.

2. **Use Encapsulation**: Make fields private and provide getters/setters only when necessary.

3. **Favor Composition over Inheritance**: "Has-a" relationships are often more flexible than "is-a" relationships.

4. **Program to Interfaces**: Depend on abstractions, not concrete implementations.

5. **Keep Inheritance Hierarchies Shallow**: Deep inheritance hierarchies become difficult to understand and maintain.

6. **Override `toString()`, `equals()`, and `hashCode()`**: Makes your classes more usable and integrates better with Java collections.

```java
@Override
public String toString() {
    return "Car{make='" + make + "', model='" + model + "', year=" + year + "}";
}

@Override
public boolean equals(Object obj) {
    if (this == obj) return true;
    if (obj == null || getClass() != obj.getClass()) return false;
    Car car = (Car) obj;
    return year == car.year &&
           Objects.equals(make, car.make) &&
           Objects.equals(model, car.model);
}

@Override
public int hashCode() {
    return Objects.hash(make, model, year);
}
```

7. **Use Appropriate Access Modifiers**: Don't make everything public.

8. **Use Final When Appropriate**: Mark classes, methods, or variables as final when they shouldn't be changed or overridden.

9. **Implement Interfaces Rather Than Extending Abstract Classes** when you want to define a contract without imposing class hierarchy.

10. **Use Records** for simple data containers (Java 16+).

## Common Pitfalls and How to Avoid Them

1. **Excessive Inheritance**: Use inheritance only when a true "is-a" relationship exists.

2. **Overuse of Getters and Setters**: Not all fields need accessors; consider what operations the object should expose.

3. **Ignoring Access Control**: Proper encapsulation prevents unintended changes to object state.

4. **Not Using Override Annotation**: The `@Override` annotation catches errors at compile time.

5. **Memory Leaks with Inner Classes**: Anonymous and non-static inner classes hold references to their enclosing instances.

6. **Equals/HashCode Contract Violations**: When overriding `equals()`, always override `hashCode()` as well.

7. **Type Checking with instanceof**: Excessive type checking often indicates a design problem; consider polymorphism instead.

## Resources for Further Learning

1. **Official Documentation**:
   - [Java Language Specification: Classes](https://docs.oracle.com/javase/specs/jls/se17/html/jls-8.html)
   - [Java Tutorials: Classes and Objects](https://docs.oracle.com/javase/tutorial/java/javaOO/index.html)

2. **Books**:
   - "Effective Java" by Joshua Bloch
   - "Head First Object-Oriented Analysis and Design"
   - "Clean Code" by Robert C. Martin

3. **Online Courses**:
   - [Coursera - Object Oriented Programming in Java](https://www.coursera.org/specializations/object-oriented-programming)
   - [Udemy - Java Object-Oriented Programming](https://www.udemy.com/course/java-object-oriented-programming/)

4. **Design Patterns**:
   - [Refactoring Guru: Design Patterns](https://refactoring.guru/design-patterns)
   - "Design Patterns: Elements of Reusable Object-Oriented Software" by the Gang of Four

## Practice Exercises

1. **Bank Account System**:
   Create a system with a base `Account` class and derived classes like `SavingsAccount` and `CheckingAccount`. Implement methods for deposit, withdrawal, and interest calculation.

2. **Shape Hierarchy**:
   Design a class hierarchy for geometric shapes with a common interface for calculating area and perimeter.

3. **Employee Management**:
   Create a system to track different types of employees (full-time, part-time, contractor) with appropriate payroll calculations.

4. **Animal Kingdom**:
   Model an animal hierarchy showcasing inheritance and polymorphism with different animal types and behaviors.

5. **E-commerce System**:
   Design classes for products, customers, orders, and payment methods in an online shopping system.

6. **Media Library**:
   Create a library system for different types of media (books, movies, music) with common operations.

7. **Vehicle Rental System**:
   Design classes for a vehicle rental service with different vehicle types and rental options.

8. **Smart Home System**:
   Model a smart home with various devices that can be controlled through a common interface.

9. **Game Character System**:
   Create a class hierarchy for different game character types with unique abilities and common attributes.

10. **Publishing System**:
    Design classes for a publishing system with authors, editors, books, articles, and publications.