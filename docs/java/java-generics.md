# Java Generics

## Overview
Java Generics, introduced in Java 5 (2004), provides a way to create classes, interfaces, and methods that operate on a type parameter. The primary motivation behind generics is to enable programmers to create type-safe collections while providing compile-time type checking and eliminating the need for explicit casting. Generics allow you to abstract over types, creating reusable components that work with different data types while maintaining type safety.

## Prerequisites
- Basic Java programming knowledge
- Understanding of object-oriented programming concepts
- Familiarity with Java collections framework
- Understanding of Java class hierarchy and polymorphism

## Learning Objectives
- Understand the purpose and benefits of generics in Java
- Learn to create and use generic classes and interfaces
- Master type parameters, bounds, and wildcards
- Understand the limitations imposed by type erasure
- Apply generics effectively with Java collections
- Implement generic methods to create flexible, reusable code
- Recognize and navigate common generics pitfalls
- Apply best practices for working with generics

## Table of Contents
1. [Introduction to Generics](#introduction-to-generics)
2. [Generic Classes and Interfaces](#generic-classes-and-interfaces)
3. [Type Parameters and Naming Conventions](#type-parameters-and-naming-conventions)
4. [Type Parameter Bounds](#type-parameter-bounds)
5. [Generic Methods](#generic-methods)
6. [Wildcards](#wildcards)
7. [Type Erasure](#type-erasure)
8. [Generics and Collections](#generics-and-collections)
9. [Generics and Inheritance](#generics-and-inheritance)
10. [Raw Types and Backward Compatibility](#raw-types-and-backward-compatibility)
11. [Advanced Generic Patterns](#advanced-generic-patterns)

## Introduction to Generics

### Benefits of Generics
Generics provide several important benefits for Java programs:

1. **Type Safety**: Generics enable compile-time type checking, preventing ClassCastExceptions at runtime.
2. **Elimination of Casts**: No need for explicit casting when retrieving elements from collections.
3. **Code Reusability**: Write code once that works with different types.
4. **Higher Abstraction**: Express algorithms independently of specific types.

### Before and After Generics
Let's compare code with and without generics:

```java
// Before generics (pre-Java 5)
List list = new ArrayList();
list.add("Hello");
list.add(42);  // No type checking, can add anything
String s = (String) list.get(0);  // Explicit casting required
Integer i = (Integer) list.get(1);
String error = (String) list.get(1);  // Runtime ClassCastException

// With generics (Java 5+)
List<String> list = new ArrayList<>();
list.add("Hello");
// list.add(42);  // Compile-time error
String s = list.get(0);  // No casting needed
```

## Generic Classes and Interfaces

### Creating a Generic Class
A generic class is declared with one or more type parameters enclosed in angle brackets.

```java
// Generic class with one type parameter
public class Box<T> {
    private T item;
    
    public void put(T item) {
        this.item = item;
    }
    
    public T get() {
        return item;
    }
}

// Usage
Box<String> stringBox = new Box<>();
stringBox.put("Hello Generics");
String str = stringBox.get();  // No casting needed

Box<Integer> intBox = new Box<>();
intBox.put(42);
Integer num = intBox.get();
```

### Generic Class with Multiple Type Parameters

```java
// Generic class with two type parameters
public class Pair<K, V> {
    private K key;
    private V value;
    
    public Pair(K key, V value) {
        this.key = key;
        this.value = value;
    }
    
    public K getKey() {
        return key;
    }
    
    public V getValue() {
        return value;
    }
    
    @Override
    public String toString() {
        return "(" + key + ", " + value + ")";
    }
}

// Usage
Pair<String, Integer> pair = new Pair<>("Age", 30);
String key = pair.getKey();  // "Age"
Integer value = pair.getValue();  // 30
```

### Generic Interfaces
Interfaces can also be generic, allowing for type-safe contracts.

```java
// Generic interface
public interface Repository<T, ID> {
    T findById(ID id);
    List<T> findAll();
    void save(T entity);
    void delete(ID id);
}

// Implementation for User entity
public class UserRepository implements Repository<User, Long> {
    @Override
    public User findById(Long id) {
        // Implementation
        return new User(id);
    }
    
    @Override
    public List<User> findAll() {
        // Implementation
        return new ArrayList<>();
    }
    
    @Override
    public void save(User entity) {
        // Implementation
    }
    
    @Override
    public void delete(Long id) {
        // Implementation
    }
}
```

## Type Parameters and Naming Conventions

Java generics follow standard naming conventions for type parameters:

- `E` - Element (used extensively by the Java Collections Framework)
- `K` - Key (used for mapped types)
- `V` - Value (also used for mapped types)
- `N` - Number
- `T` - Type (general purpose type)
- `S`, `U`, `V` etc. - Additional types when multiple type parameters are needed

```java
// Standard conventions in action
public class Container<T> { /* ... */ }
public interface List<E> { /* ... */ }
public interface Map<K, V> { /* ... */ }
public class Converter<S, T> { /* ... */ }
```

While single-letter names are conventional, you can use more descriptive names when it improves readability:

```java
public class DataProcessor<InputType, OutputType> {
    public OutputType process(InputType input) {
        // Implementation
        return null;
    }
}
```

## Type Parameter Bounds

Type parameter bounds limit the types that can be used as type arguments in a generic class or method.

### Upper Bounds
Restricts the type parameter to a specific type or a subtype of that type.

```java
// T must be a Number or a subclass of Number
public class NumberBox<T extends Number> {
    private T value;
    
    public NumberBox(T value) {
        this.value = value;
    }
    
    public double doubleValue() {
        return value.doubleValue();  // Can call Number methods
    }
    
    public T getValue() {
        return value;
    }
}

// Usage
NumberBox<Integer> intBox = new NumberBox<>(42);
NumberBox<Double> doubleBox = new NumberBox<>(3.14);
// NumberBox<String> stringBox = new NumberBox<>("not allowed");  // Compile error

// Access to Number methods
double doubleValue = intBox.doubleValue();  // 42.0
```

### Multiple Bounds
A type parameter can have multiple bounds, one class and any number of interfaces.

```java
// T must extend Comparable<T> and implement Serializable
public class SortableBox<T extends Comparable<T> & Serializable> {
    private T value;
    
    public SortableBox(T value) {
        this.value = value;
    }
    
    public int compareTo(SortableBox<T> other) {
        return this.value.compareTo(other.value);
    }
    
    public void save() {
        // Can serialize this.value
    }
}

// Usage with String (both Comparable and Serializable)
SortableBox<String> box1 = new SortableBox<>("apple");
SortableBox<String> box2 = new SortableBox<>("banana");
int result = box1.compareTo(box2);  // -1 (apple < banana)
```

## Generic Methods

Generic methods allow type parameters to be scoped to the method level rather than the class level.

### Basic Generic Method

```java
public class Utils {
    // Generic method - type parameter T is defined at method level
    public static <T> T identity(T value) {
        return value;
    }
}

// Usage - explicit type specification (often not needed due to type inference)
String str = Utils.<String>identity("Hello");

// Usage - with type inference
Integer num = Utils.identity(42);  // Type inferred as Integer
```

### Type Inference in Generic Methods
Java's type inference system allows the compiler to determine the type arguments in many cases.

```java
public class Collections {
    public static <T> List<T> emptyList() {
        return new ArrayList<>();
    }
}

// Types inferred by the context
List<String> strings = Collections.emptyList();  // Inferred as List<String>
```

### Generic Methods with Bounded Type Parameters

```java
public class MathUtils {
    // Generic method with bounded type parameter
    public static <T extends Number> double sum(List<T> numbers) {
        double total = 0;
        for (T number : numbers) {
            total += number.doubleValue();  // Can call Number methods
        }
        return total;
    }
}

// Usage
List<Integer> integers = Arrays.asList(1, 2, 3);
double sum1 = MathUtils.sum(integers);  // 6.0

List<Double> doubles = Arrays.asList(1.1, 2.2, 3.3);
double sum2 = MathUtils.sum(doubles);  // 6.6
```

### Generic Static Methods
Type parameters in static methods are independent of any type parameters in the containing class.

```java
public class Container<T> {
    private T value;
    
    // Instance method using the class's type parameter T
    public void setValue(T value) {
        this.value = value;
    }
    
    // Static method with its own type parameter E (independent of T)
    public static <E> List<E> asList(E... elements) {
        List<E> list = new ArrayList<>();
        for (E element : elements) {
            list.add(element);
        }
        return list;
    }
}

// Usage of static method (independent of class type parameter)
List<String> strings = Container.asList("a", "b", "c");
List<Integer> numbers = Container.asList(1, 2, 3);
```

## Wildcards

Wildcards provide flexibility when working with generic types, especially in method parameters.

### Unbounded Wildcards
The unbounded wildcard `<?>` represents an unknown type. It's useful when you want to work with objects of unknown type.

```java
// Method that prints any type of list
public static void printList(List<?> list) {
    for (Object item : list) {
        System.out.println(item);
    }
}

// Usage
List<String> strings = Arrays.asList("one", "two", "three");
List<Integer> integers = Arrays.asList(1, 2, 3);

printList(strings);  // Works with strings
printList(integers);  // Works with integers
```

### Upper Bounded Wildcards
Upper bounded wildcards `<? extends Type>` allow you to work with a specific type or any of its subtypes.

```java
// Method that sums any list of numbers
public static double sumOfNumbers(List<? extends Number> numbers) {
    double sum = 0.0;
    for (Number number : numbers) {
        sum += number.doubleValue();
    }
    return sum;
}

// Usage
List<Integer> integers = Arrays.asList(1, 2, 3);
List<Double> doubles = Arrays.asList(1.1, 2.2, 3.3);

double sum1 = sumOfNumbers(integers);  // Works with integers
double sum2 = sumOfNumbers(doubles);   // Works with doubles
```

### Lower Bounded Wildcards
Lower bounded wildcards `<? super Type>` allow you to work with a specific type or any of its supertypes.

```java
// Method that adds integers to a list of integers or any supertype
public static void addIntegers(List<? super Integer> list) {
    list.add(1);
    list.add(2);
    list.add(3);
}

// Usage
List<Integer> integers = new ArrayList<>();
List<Number> numbers = new ArrayList<>();
List<Object> objects = new ArrayList<>();

addIntegers(integers);  // Works with Integer
addIntegers(numbers);   // Works with Number (supertype of Integer)
addIntegers(objects);   // Works with Object (supertype of Integer)
```

### PECS (Producer Extends, Consumer Super)
A useful mnemonic for wildcards:
- Use `<? extends T>` when you need to get values out of a structure (Producer)
- Use `<? super T>` when you need to put values into a structure (Consumer)

```java
// Producer (get values) - "extends"
public static void printFirstElement(List<? extends Number> list) {
    Number first = list.get(0);  // Safe to read as Number
    System.out.println(first);
}

// Consumer (add values) - "super"
public static void addElements(List<? super Integer> list) {
    list.add(1);  // Safe to add Integers
    list.add(2);
}

// Both producer and consumer - use specific type
public static void transferElements(List<Integer> source, List<? super Integer> dest) {
    for (Integer item : source) {
        dest.add(item);
    }
}
```

## Type Erasure

Java implements generics using type erasure: generic type information is present only at compile time and erased at runtime.

### How Type Erasure Works
1. Replaces type parameters with their bounds or Object if unbounded
2. Inserts casts where necessary
3. Generates bridge methods to preserve polymorphism

```java
// Before erasure
public class Box<T> {
    private T value;
    
    public T getValue() {
        return value;
    }
    
    public void setValue(T value) {
        this.value = value;
    }
}

// After erasure (conceptual representation)
public class Box {
    private Object value;
    
    public Object getValue() {
        return value;
    }
    
    public void setValue(Object value) {
        this.value = value;
    }
}
```

### Consequences of Type Erasure

#### Cannot Instantiate Type Parameters
```java
public class Creator<T> {
    // Error: Cannot instantiate the type parameter T
    public T create() {
        return new T();  // Compiler error
    }
    
    // Workaround: Use a factory or Class<T> parameter
    public T createWithClass(Class<T> clazz) throws Exception {
        return clazz.getDeclaredConstructor().newInstance();
    }
}
```

#### Cannot Create Arrays of Parameterized Types
```java
// Error: Cannot create arrays of generic types
// List<String>[] array = new List<String>[10];  // Compiler error

// Workaround: Create array of raw type and cast
@SuppressWarnings("unchecked")
List<String>[] array = (List<String>[]) new List[10];  // Works but with unchecked warning
```

#### Cannot Use Primitives as Type Arguments
```java
// Error: Cannot use primitive types as type arguments
// Box<int> intBox = new Box<>();  // Compiler error

// Solution: Use wrapper classes
Box<Integer> integerBox = new Box<>();
```

#### Cannot Overload Methods That Differ Only in Type Parameters
```java
public class Processor {
    // Compile error: Erasure causes method clash
    public void process(List<String> strings) { /* ... */ }
    public void process(List<Integer> integers) { /* ... */ }
}
```

## Generics and Collections

The Java Collections Framework is one of the primary use cases for generics.

### Type-Safe Collections
```java
// Type-safe collections
List<String> strings = new ArrayList<>();
strings.add("Hello");
// strings.add(42);  // Compile error: incompatible types

// Type-safe map
Map<String, Integer> nameToAge = new HashMap<>();
nameToAge.put("Alice", 30);
nameToAge.put("Bob", 25);

// Type-safe iteration
for (String name : nameToAge.keySet()) {
    Integer age = nameToAge.get(name);
    System.out.println(name + " is " + age + " years old");
}
```

### Using Collections with Generic Methods
```java
public class CollectionUtils {
    // Find maximum element in a collection
    public static <T extends Comparable<T>> T findMax(Collection<T> collection) {
        if (collection.isEmpty()) {
            throw new IllegalArgumentException("Collection cannot be empty");
        }
        
        Iterator<T> iterator = collection.iterator();
        T max = iterator.next();
        
        while (iterator.hasNext()) {
            T current = iterator.next();
            if (current.compareTo(max) > 0) {
                max = current;
            }
        }
        
        return max;
    }
}

// Usage
List<Integer> numbers = Arrays.asList(3, 1, 4, 1, 5, 9);
Integer max = CollectionUtils.findMax(numbers);  // 9
```

### Using Custom Objects with Generics and Collections
```java
// Custom class implementing Comparable
public class Person implements Comparable<Person> {
    private String name;
    private int age;
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    @Override
    public int compareTo(Person other) {
        return Integer.compare(this.age, other.age);
    }
    
    @Override
    public String toString() {
        return name + " (" + age + ")";
    }
}

// Usage in collections
List<Person> people = Arrays.asList(
    new Person("Alice", 30),
    new Person("Bob", 25),
    new Person("Charlie", 35)
);

// Sort list of people (uses Person's compareTo method)
Collections.sort(people);

// Find oldest person using generic method
Person oldest = CollectionUtils.findMax(people);  // Charlie (35)
```

## Generics and Inheritance

Generics interact with inheritance in ways that can be initially confusing.

### Type Relationships
For any types A and B where B is a subtype of A:
- `B` is a subtype of `A`
- `List<B>` is NOT a subtype of `List<A>`
- `Box<B>` is NOT a subtype of `Box<A>`

This is a key point that's often surprising to newcomers:

```java
// Regular inheritance
Object obj = "hello";  // String is a subtype of Object

// But with generics:
List<String> strings = new ArrayList<>();
// List<Object> objects = strings;  // Compile error!
```

To understand why this restriction exists, consider what would happen if it were allowed:
```java
// If this were allowed (it's not):
List<String> strings = new ArrayList<>();
List<Object> objects = strings;  // Hypothetically allowed
objects.add(42);  // Would add an Integer to a List<String>!
String s = strings.get(0);  // ClassCastException at runtime
```

### Wildcards for Inheritance Relationships
Wildcards provide the solution:

```java
// Using wildcards to enable inheritance relationships
List<String> strings = new ArrayList<>();
strings.add("hello");

// Reading with upper bounded wildcard
List<? extends Object> objects = strings;  // OK
Object obj = objects.get(0);  // OK to read
// objects.add("world");  // Compile error - can't add to ? extends Object

// Writing with lower bounded wildcard
List<Object> objectList = new ArrayList<>();
List<? super String> stringSuperList = objectList;  // OK
stringSuperList.add("hello");  // OK to add String
// String s = stringSuperList.get(0);  // Compile error - not safe to read as String
```

### Covariance and Contravariance
- **Covariance**: `<? extends T>` - preserves the "is-a" relationship
- **Contravariance**: `<? super T>` - reverses the "is-a" relationship
- **Invariance**: `<T>` - no subtyping relationship

These terms describe how type relationships are preserved or modified by generics:

```java
// Covariance: can read as T or its supertype
List<? extends Number> numbers = new ArrayList<Integer>();
Number n = numbers.get(0);  // Safe, because any element is at least a Number
// numbers.add(1);  // Error, can't add to a list with unknown specific type

// Contravariance: can write T or its subtypes
List<? super Number> superNumbers = new ArrayList<Object>();
superNumbers.add(1);  // Safe, because any Number can be added
superNumbers.add(1.0);  // Safe, because any Number can be added
// Number n = superNumbers.get(0);  // Error, can't read because it might be any supertype of Number
```

## Raw Types and Backward Compatibility

### Raw Types
Raw types are generic types without type parameters. They exist for backward compatibility with pre-generic code.

```java
// Raw type (avoid in new code)
List rawList = new ArrayList();
rawList.add("string");
rawList.add(42);

// To retrieve elements, casting is required
String s = (String) rawList.get(0);  // May throw ClassCastException at runtime
```

### Working with Legacy Code
Sometimes you need to interact with legacy code that uses raw types:

```java
// Legacy method using raw types
public void legacyMethod(List list) {
    list.add("Legacy element");
}

// Modern code with generics
List<Integer> integers = new ArrayList<>();
integers.add(1);
integers.add(2);

// Unchecked warning when passing generic to raw type
legacyMethod(integers);  // Warning: unchecked call to legacyMethod(List)

// This could cause problems later
// Integer i = integers.get(2);  // ClassCastException (String cannot be cast to Integer)
```

### SuppressWarnings Annotation
When integrating with legacy code, you can suppress unchecked warnings where appropriate:

```java
public class LegacyIntegration {
    // Suppress warnings for a specific statement
    @SuppressWarnings("unchecked")
    public static <T> List<T> createFromLegacy(List legacyList) {
        return (List<T>) new ArrayList<>(legacyList);
    }
    
    // Suppress warnings for an entire method
    @SuppressWarnings("unchecked")
    public static void processList(List list) {
        // Operations that would normally cause unchecked warnings
    }
}
```

## Advanced Generic Patterns

### Bounded Type Parameters with Recursive Generics
This pattern is used to create self-referential types:

```java
// Recursive type parameter for comparable entities
public abstract class Entity<T extends Entity<T>> implements Comparable<T> {
    private Long id;
    private String name;
    
    // Default comparison based on ID
    @Override
    public int compareTo(T other) {
        return this.id.compareTo(other.id);
    }
}

// Concrete implementation
public class User extends Entity<User> {
    private String email;
    
    // User-specific implementation
    @Override
    public int compareTo(User other) {
        // Custom comparison logic (e.g., by email)
        return this.email.compareTo(other.email);
    }
}
```

### Builder Pattern with Generics
Generics enable fluent builder patterns with method chaining:

```java
// Generic builder pattern
public class GenericBuilder<T> {
    private final Supplier<T> instantiator;
    private final List<Consumer<T>> modifiers = new ArrayList<>();
    
    public GenericBuilder(Supplier<T> instantiator) {
        this.instantiator = instantiator;
    }
    
    public <V> GenericBuilder<T> with(BiConsumer<T, V> consumer, V value) {
        modifiers.add(instance -> consumer.accept(instance, value));
        return this;
    }
    
    public T build() {
        T instance = instantiator.get();
        modifiers.forEach(modifier -> modifier.accept(instance));
        return instance;
    }
}

// Usage
class Person {
    private String name;
    private int age;
    
    public void setName(String name) { this.name = name; }
    public void setAge(int age) { this.age = age; }
    
    @Override
    public String toString() {
        return "Person{name='" + name + "', age=" + age + "}";
    }
}

// Building a person with the generic builder
Person person = new GenericBuilder<>(Person::new)
        .with(Person::setName, "John")
        .with(Person::setAge, 30)
        .build();
```

### Type Safe Heterogeneous Container
A technique for storing objects of different types in a single container:

```java
// Type token class
class TypeToken<T> {
    private final Class<T> type;
    
    @SuppressWarnings("unchecked")
    private TypeToken() {
        // Use reflection to get the actual type argument
        Type superclass = getClass().getGenericSuperclass();
        ParameterizedType paramType = (ParameterizedType) superclass;
        this.type = (Class<T>) paramType.getActualTypeArguments()[0];
    }
    
    public Class<T> getType() {
        return type;
    }
}

// Heterogeneous container
class TypeSafeMap {
    private final Map<Class<?>, Object> map = new HashMap<>();
    
    public <T> void put(Class<T> type, T instance) {
        map.put(type, instance);
    }
    
    @SuppressWarnings("unchecked")
    public <T> T get(Class<T> type) {
        return (T) map.get(type);
    }
}

// Usage
TypeSafeMap container = new TypeSafeMap();
container.put(String.class, "Hello");
container.put(Integer.class, 42);

String s = container.get(String.class);   // "Hello"
Integer i = container.get(Integer.class);  // 42
```

## Best Practices

1. **Use generics for type safety**:
   ```java
   // Avoid raw types in new code
   List<String> strings = new ArrayList<>();  // Good
   List rawList = new ArrayList();  // Avoid
   ```

2. **Favor bounded wildcards for API flexibility**:
   ```java
   // Good - allows reading from any list of numbers
   public double sumOfList(List<? extends Number> list) { /* ... */ }

   // Good - allows adding integers to any suitable list
   public void addNumbers(List<? super Integer> list) { /* ... */ }
   ```

3. **Remember PECS: Producer-Extends, Consumer-Super**:
   ```java
   // Producer - use "extends" when getting values
   public void printElements(Collection<? extends Number> numbers) {
       for (Number n : numbers) {
           System.out.println(n);
       }
   }
   
   // Consumer - use "super" when adding values
   public void fillWithIntegers(Collection<? super Integer> collection) {
       collection.add(1);
       collection.add(2);
   }
   ```

4. **Minimize wildcard usage within a class**:
   ```java
   // Only use wildcards in public APIs when needed
   // For private or internal methods, use concrete type parameters
   ```

5. **Provide factory methods for generic instance creation**:
   ```java
   // Factory method to overcome "new T()" restriction
   public static <T> List<T> createArrayList(Class<T> clazz) {
       return new ArrayList<>();
   }
   ```

6. **Use explicit type parameters when type inference fails**:
   ```java
   // When inference doesn't work
   List<String> list = Collections.<String>emptyList();
   ```

7. **Document generic parameters clearly**:
   ```java
   /**
    * Performs a binary search on the specified list.
    *
    * @param <T> the type of elements in the list
    * @param list the list to be searched (must be sorted)
    * @param key the key to be searched for
    * @return the index of the key, if it is contained in the list;
    *         otherwise, (-(insertion point) - 1)
    */
   public static <T extends Comparable<? super T>> 
           int binarySearch(List<? extends T> list, T key) {
       // Implementation
   }
   ```

8. **Use generic types all the way through**:
   ```java
   // Maintain type safety throughout your code
   public <T> List<T> filterList(List<T> list, Predicate<T> predicate) {
       List<T> result = new ArrayList<>();
       for (T element : list) {
           if (predicate.test(element)) {
               result.add(element);
           }
       }
       return result;
   }
   ```

9. **Use @SuppressWarnings sparingly and with comments**:
   ```java
   // Only suppress warnings when you're sure it's safe
   @SuppressWarnings("unchecked") // Safe because we know the list contains only strings
   public static <T> List<T> createList(T... elements) {
       return (List<T>) Arrays.asList(elements);
   }
   ```

10. **Avoid excessive generic complexity**:
    ```java
    // Overly complex generics can be hard to understand
    public <K, V extends Comparable<? super V>> 
           Pair<K, V> findMaxByValue(Map<K, V> map) {
        // This is already complex enough
    }
    
    // Even more complex - avoid unless necessary
    public <T, S extends Collection<? extends T>, 
           R extends Collection<? super T>> 
           R transferElements(S source, R dest) {
        // Too complex
    }
    ```

## Common Pitfalls and How to Avoid Them

1. **Mixing raw types with generics**:
   ```java
   // Problematic
   List rawList = new ArrayList<String>();  // Raw use of List
   rawList.add(42);  // No compile-time error, but will cause problems
   
   // Correct
   List<String> stringList = new ArrayList<>();
   ```

2. **Trying to instantiate type parameters**:
   ```java
   // Won't work
   public <T> T create() {
       return new T();  // Compiler error
   }
   
   // Alternative: pass a factory or Class<T> with newInstance()
   public <T> T create(Supplier<T> factory) {
       return factory.get();
   }
   ```

3. **Attempting to create arrays of parameterized types**:
   ```java
   // Won't work
   List<String>[] arrayOfLists = new List<String>[10];  // Compiler error
   
   // Alternative: use a List of Lists
   List<List<String>> listOfLists = new ArrayList<>();
   for (int i = 0; i < 10; i++) {
       listOfLists.add(new ArrayList<>());
   }
   ```

4. **Overloading methods with different generic parameters**:
   ```java
   // Won't work - after erasure, these are the same method
   public void process(List<String> strings) { /* ... */ }
   public void process(List<Integer> integers) { /* ... */ }
   
   // Alternative: use different method names
   public void processStrings(List<String> strings) { /* ... */ }
   public void processIntegers(List<Integer> integers) { /* ... */ }
   ```

5. **Assuming List<Dog> is a subtype of List<Animal>**:
   ```java
   // Won't work
   List<Dog> dogs = new ArrayList<>();
   List<Animal> animals = dogs;  // Compiler error
   
   // Use wildcards instead
   List<? extends Animal> animals = dogs;  // OK
   ```

6. **Ignoring compiler warnings**:
   ```java
   // Unchecked assignment warnings should not be ignored without thought
   List<String> strings = new ArrayList();  // Warning: unchecked conversion
   
   // Either fix the code or suppress with justification
   @SuppressWarnings("unchecked")  // Suppression reason explained here
   List<String> strings = new ArrayList();
   ```

7. **Excessive use of wildcards**:
   ```java
   // Too complex
   Map<? extends String, ? extends List<? extends Number>> map;
   
   // Consider simplifying
   Map<String, List<Number>> map;
   ```

8. **Forgetting generic type arguments**:
   ```java
   // Accidental use of raw type
   Set set = new HashSet<>();  // Missing type arguments
   set.add("string");
   Integer i = (Integer) set.iterator().next();  // ClassCastException
   
   // Be explicit
   Set<String> set = new HashSet<>();
   ```

9. **Combining wildcards with type inference incorrectly**:
   ```java
   // This won't compile as expected
   List<?> wildcardList = new ArrayList<>();
   wildcardList.add("string");  // Compiler error - can't add to List<?>
   
   // Correct usage
   List<String> typedList = new ArrayList<>();
   typedList.add("string");
   List<?> wildcardList = typedList;  // OK for read-only operations
   ```

10. **Misunderstanding invariance**:
    ```java
    // Won't work
    List<Object> objectList = new ArrayList<String>();  // Compiler error
    
    // Won't work either
    void addToList(List<Object> list) { list.add(42); }
    List<String> strings = new ArrayList<>();
    addToList(strings);  // Compiler error, prevents heap pollution
    ```

## Resources for Further Learning

1. **Official Documentation**:
   - [Java Generics Tutorial](https://docs.oracle.com/javase/tutorial/java/generics/index.html)
   - [Java Generics FAQs](http://www.angelikalanger.com/GenericsFAQ/JavaGenericsFAQ.html)

2. **Books**:
   - "Java Generics and Collections" by Maurice Naftalin and Philip Wadler
   - "Effective Java" by Joshua Bloch (Chapter on Generics)
   - "Java Generics" by Gilad Bracha

3. **Online Resources**:
   - [Baeldung Java Generics Tutorials](https://www.baeldung.com/java-generics)
   - [Oracle's Java Magazine: Understanding Generics](https://blogs.oracle.com/javamagazine/post/understanding-java-generics)
   - [Generic Programming in Java](https://en.wikipedia.org/wiki/Generics_in_Java)

4. **Advanced Topics**:
   - [Type Erasure Details](https://docs.oracle.com/javase/tutorial/java/generics/erasure.html)
   - [Wildcards in Java](https://docs.oracle.com/javase/tutorial/java/generics/wildcards.html)
   - [Reifiable Types](https://docs.oracle.com/javase/tutorial/java/generics/nonReifiableVarargsType.html)

## Practice Exercises

1. **Generic Box Implementation**:
   Create a generic `Box<T>` class that can store and retrieve a value of any type. Implement methods to check if the box is empty and to clear its contents.

2. **Generic Pair Class**:
   Implement a `Pair<K,V>` class that holds two values of potentially different types. Include methods to access, modify, and swap the values.

3. **Generic Stack**:
   Create a generic stack implementation with `push()`, `pop()`, `peek()`, and `isEmpty()` methods.

4. **Type-Safe Heterogeneous Container**:
   Implement a container that can store objects of different types and retrieve them safely without casting.

5. **Generic Binary Tree**:
   Implement a generic binary tree structure with methods for insertion, traversal, and search.

6. **Function Composition**:
   Create a utility class that allows composing functions with different input and output types using generics.

7. **Generic Sorting**:
   Implement a generic method that can sort any list of comparable objects.

8. **Generic Cache**:
   Create a cache implementation that can store and retrieve different types of objects using keys.

9. **Type-Safe Builder Pattern**:
   Implement a generic builder pattern that ensures type safety during the building process.

10. **Covariant Result Type Pattern**:
    Create a class hierarchy with methods that return a more specific type in subclasses using generics. 