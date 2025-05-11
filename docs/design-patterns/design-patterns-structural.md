# Structural Design Patterns

## Overview
Structural design patterns are concerned with how classes and objects are composed to form larger structures. They help ensure that when parts of a system change, the entire system doesn't need to change. This guide covers essential structural design patterns in Java, their implementation, use cases, advantages, and potential drawbacks.

## Prerequisites
- Solid understanding of Java programming
- Familiarity with object-oriented programming concepts
- Basic knowledge of SOLID principles
- Understanding of class inheritance and interfaces

## Learning Objectives
- Understand the purpose and benefits of structural design patterns
- Learn when and how to implement different structural patterns
- Recognize appropriate use cases for each pattern
- Implement structural patterns in Java applications
- Understand the trade-offs between different structural patterns
- Apply best practices when implementing structural patterns

## Table of Contents
1. [Introduction to Structural Patterns](#introduction-to-structural-patterns)
2. [Adapter Pattern](#adapter-pattern)
3. [Bridge Pattern](#bridge-pattern)
4. [Composite Pattern](#composite-pattern)
5. [Decorator Pattern](#decorator-pattern)
6. [Facade Pattern](#facade-pattern)
7. [Flyweight Pattern](#flyweight-pattern)
8. [Proxy Pattern](#proxy-pattern)
9. [Best Practices](#best-practices)
10. [Common Pitfalls](#common-pitfalls)
11. [Comparing Structural Patterns](#comparing-structural-patterns)

## Introduction to Structural Patterns

Structural design patterns deal with object composition, creating relationships between objects to form larger structures. They help to ensure that if one part of a system changes, the entire system doesn't need to change along with it.

### Why Use Structural Patterns?

1. **Flexibility**: They provide flexibility in how objects and classes are composed together.
2. **Decoupling**: They promote loose coupling between different components.
3. **Simplification**: They simplify complex structures by providing abstractions.
4. **Adaptability**: They make it easier to adapt objects to work with different interfaces.

### When to Use Structural Patterns

- When you need to organize objects into larger structures
- When you need to make incompatible interfaces work together
- When you want to add responsibilities to objects without changing their code
- When you need to simplify complex subsystems
- When you want to optimize resource usage with many similar objects

## Adapter Pattern

The Adapter pattern converts the interface of a class into another interface clients expect, allowing classes to work together that couldn't otherwise due to incompatible interfaces.

### Intent

- Convert the interface of a class into another interface clients expect
- Allow classes to work together that couldn't otherwise due to incompatible interfaces
- Make existing classes work with others without modifying their source code

### Implementation

#### Object Adapter (Composition)

```java
// Target interface that the client expects to use
interface MediaPlayer {
    void play(String audioType, String fileName);
}

// Adaptee interface - the interface that needs adapting
interface AdvancedMediaPlayer {
    void playVlc(String fileName);
    void playMp4(String fileName);
}

// Concrete Adaptee implementations
class VlcPlayer implements AdvancedMediaPlayer {
    @Override
    public void playVlc(String fileName) {
        System.out.println("Playing vlc file: " + fileName);
    }

    @Override
    public void playMp4(String fileName) {
        // Do nothing
    }
}

class Mp4Player implements AdvancedMediaPlayer {
    @Override
    public void playVlc(String fileName) {
        // Do nothing
    }

    @Override
    public void playMp4(String fileName) {
        System.out.println("Playing mp4 file: " + fileName);
    }
}

// Adapter using composition
class MediaAdapter implements MediaPlayer {
    private AdvancedMediaPlayer advancedMediaPlayer;

    public MediaAdapter(String audioType) {
        if (audioType.equalsIgnoreCase("vlc")) {
            advancedMediaPlayer = new VlcPlayer();
        } else if (audioType.equalsIgnoreCase("mp4")) {
            advancedMediaPlayer = new Mp4Player();
        }
    }

    @Override
    public void play(String audioType, String fileName) {
        if (audioType.equalsIgnoreCase("vlc")) {
            advancedMediaPlayer.playVlc(fileName);
        } else if (audioType.equalsIgnoreCase("mp4")) {
            advancedMediaPlayer.playMp4(fileName);
        }
    }
}

// Client
class AudioPlayer implements MediaPlayer {
    private MediaAdapter mediaAdapter;

    @Override
    public void play(String audioType, String fileName) {
        // Built-in support for mp3 files
        if (audioType.equalsIgnoreCase("mp3")) {
            System.out.println("Playing mp3 file: " + fileName);
        }
        // MediaAdapter provides support for other formats
        else if (audioType.equalsIgnoreCase("vlc") || audioType.equalsIgnoreCase("mp4")) {
            mediaAdapter = new MediaAdapter(audioType);
            mediaAdapter.play(audioType, fileName);
        } else {
            System.out.println("Invalid media. " + audioType + " format not supported");
        }
    }
}

// Usage
MediaPlayer player = new AudioPlayer();
player.play("mp3", "song.mp3");    // Playing mp3 file: song.mp3
player.play("vlc", "movie.vlc");   // Playing vlc file: movie.vlc
player.play("mp4", "video.mp4");   // Playing mp4 file: video.mp4
player.play("avi", "video.avi");   // Invalid media. avi format not supported
```

#### Class Adapter (Inheritance)

```java
// Target
interface Target {
    void request();
}

// Adaptee
class Adaptee {
    public void specificRequest() {
        System.out.println("Specific request from Adaptee");
    }
}

// Class Adapter using inheritance
class ClassAdapter extends Adaptee implements Target {
    @Override
    public void request() {
        specificRequest();
    }
}

// Usage
Target target = new ClassAdapter();
target.request(); // Outputs: Specific request from Adaptee
```

### Real-World Example: Legacy System Integration

```java
// Legacy database system
class LegacyDatabase {
    public void connect() {
        System.out.println("Connected to legacy database");
    }
    
    public void executeQuery(String rawSql) {
        System.out.println("Executing raw SQL: " + rawSql);
    }
    
    public void disconnect() {
        System.out.println("Disconnected from legacy database");
    }
}

// Modern database interface expected by the application
interface ModernDatabase {
    void openConnection();
    void queryData(String tableName, String[] columns, String condition);
    void closeConnection();
}

// Adapter for the legacy database system
class DatabaseAdapter implements ModernDatabase {
    private LegacyDatabase legacyDb = new LegacyDatabase();
    
    @Override
    public void openConnection() {
        legacyDb.connect();
    }
    
    @Override
    public void queryData(String tableName, String[] columns, String condition) {
        StringBuilder sql = new StringBuilder("SELECT ");
        
        if (columns.length > 0) {
            for (int i = 0; i < columns.length; i++) {
                sql.append(columns[i]);
                if (i < columns.length - 1) {
                    sql.append(", ");
                }
            }
        } else {
            sql.append("*");
        }
        
        sql.append(" FROM ").append(tableName);
        
        if (condition != null && !condition.isEmpty()) {
            sql.append(" WHERE ").append(condition);
        }
        
        legacyDb.executeQuery(sql.toString());
    }
    
    @Override
    public void closeConnection() {
        legacyDb.disconnect();
    }
}

// Usage
ModernDatabase db = new DatabaseAdapter();
db.openConnection();
db.queryData("users", new String[]{"id", "name", "email"}, "active = true");
db.closeConnection();
```

### Two-Way Adapter

```java
// Interface A
interface SquarePeg {
    void insert();
}

// Interface B
interface RoundPeg {
    void insertIntoHole();
}

// Two-way adapter implementing both interfaces
class PegAdapter implements SquarePeg, RoundPeg {
    @Override
    public void insert() {
        System.out.println("Square peg inserted");
        // Can call insertIntoHole() if needed
    }

    @Override
    public void insertIntoHole() {
        System.out.println("Round peg inserted into hole");
        // Can call insert() if needed
    }
}

// Usage
SquarePeg squarePeg = new PegAdapter();
squarePeg.insert();

RoundPeg roundPeg = (RoundPeg) squarePeg; // Same object, different interface
roundPeg.insertIntoHole();
```

### When to Use the Adapter Pattern

- When you want to use an existing class, but its interface does not match the one you need
- When you want to create a reusable class that cooperates with classes that don't necessarily have compatible interfaces
- When you need to use several existing subclasses but don't want to adapt their interfaces by subclassing each one
- When you want to make your code work with third-party libraries
- When you want to integrate legacy code with modern code without changing the legacy implementation

### Advantages

- Allows incompatible interfaces to work together
- Promotes reusability of existing code
- Improves maintainability by separating client code from adapted code
- Enables interoperability between different systems
- Single Responsibility Principle: separates interface conversion from the business logic

### Disadvantages

- Increases complexity by adding an extra layer
- Sometimes overused when a simple refactoring would be better
- In class adapters, can only adapt to one class (due to Java's single inheritance)
- Debugging can be harder due to the extra indirection

## Bridge Pattern

The Bridge pattern decouples an abstraction from its implementation so that the two can vary independently. It involves an interface acting as a bridge between the abstract class and implementation classes.

### Intent

- Decouple an abstraction from its implementation so that the two can vary independently
- Avoid permanent binding between an abstraction and its implementation
- Allow both the abstraction and its implementation to be extended through inheritance
- Hide implementation details from clients

### Implementation

```java
// Implementor interface
interface DrawAPI {
    void drawCircle(double x, double y, double radius);
}

// Concrete Implementors
class RedCircle implements DrawAPI {
    @Override
    public void drawCircle(double x, double y, double radius) {
        System.out.printf("Drawing Circle[ color: red, center: (%f, %f), radius: %f ]%n", x, y, radius);
    }
}

class GreenCircle implements DrawAPI {
    @Override
    public void drawCircle(double x, double y, double radius) {
        System.out.printf("Drawing Circle[ color: green, center: (%f, %f), radius: %f ]%n", x, y, radius);
    }
}

// Abstraction
abstract class Shape {
    protected DrawAPI drawAPI;
    
    protected Shape(DrawAPI drawAPI) {
        this.drawAPI = drawAPI;
    }
    
    public abstract void draw();
}

// Refined Abstraction
class Circle extends Shape {
    private double x, y, radius;
    
    public Circle(double x, double y, double radius, DrawAPI drawAPI) {
        super(drawAPI);
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    
    @Override
    public void draw() {
        drawAPI.drawCircle(x, y, radius);
    }
}

// Usage
DrawAPI redCircle = new RedCircle();
DrawAPI greenCircle = new GreenCircle();

Shape redCircleShape = new Circle(100, 100, 10, redCircle);
Shape greenCircleShape = new Circle(200, 200, 15, greenCircle);

redCircleShape.draw();   // Drawing Circle[ color: red, center: (100.000000, 100.000000), radius: 10.000000 ]
greenCircleShape.draw(); // Drawing Circle[ color: green, center: (200.000000, 200.000000), radius: 15.000000 ]
```

### Extended Example: Messaging System

```java
// Implementor interface
interface MessageSender {
    void sendMessage(String message, String recipient);
}

// Concrete Implementors
class EmailSender implements MessageSender {
    @Override
    public void sendMessage(String message, String recipient) {
        System.out.println("Sending Email to " + recipient + ": " + message);
    }
}

class SMSSender implements MessageSender {
    @Override
    public void sendMessage(String message, String recipient) {
        System.out.println("Sending SMS to " + recipient + ": " + message);
    }
}

class WhatsAppSender implements MessageSender {
    @Override
    public void sendMessage(String message, String recipient) {
        System.out.println("Sending WhatsApp message to " + recipient + ": " + message);
    }
}

// Abstraction
abstract class Message {
    protected MessageSender messageSender;
    
    protected Message(MessageSender messageSender) {
        this.messageSender = messageSender;
    }
    
    public abstract void send();
}

// Refined Abstractions
class TextMessage extends Message {
    private String text;
    private String recipient;
    
    public TextMessage(String text, String recipient, MessageSender messageSender) {
        super(messageSender);
        this.text = text;
        this.recipient = recipient;
    }
    
    @Override
    public void send() {
        messageSender.sendMessage(text, recipient);
    }
}

class UrgentMessage extends Message {
    private String text;
    private String recipient;
    
    public UrgentMessage(String text, String recipient, MessageSender messageSender) {
        super(messageSender);
        this.text = text;
        this.recipient = recipient;
    }
    
    @Override
    public void send() {
        messageSender.sendMessage("URGENT: " + text, recipient);
    }
}

// Usage
MessageSender emailSender = new EmailSender();
MessageSender smsSender = new SMSSender();
MessageSender whatsAppSender = new WhatsAppSender();

Message textEmailMessage = new TextMessage("Hello, how are you?", "john@example.com", emailSender);
Message urgentSmsMessage = new UrgentMessage("Meeting in 10 minutes!", "123-456-7890", smsSender);
Message urgentWhatsAppMessage = new UrgentMessage("Call me back ASAP", "+1-234-567-8901", whatsAppSender);

textEmailMessage.send();      // Sending Email to john@example.com: Hello, how are you?
urgentSmsMessage.send();      // Sending SMS to 123-456-7890: URGENT: Meeting in 10 minutes!
urgentWhatsAppMessage.send(); // Sending WhatsApp message to +1-234-567-8901: URGENT: Call me back ASAP
```

### When to Use the Bridge Pattern

- When you want to avoid a permanent binding between an abstraction and its implementation
- When both the abstraction and its implementation should be extensible through subclasses
- When changes in the implementation should not impact the client code
- When you have a proliferation of classes resulting from a coupled interface and numerous implementations
- When you want to share an implementation among multiple objects
- When you want to hide implementation details completely from clients

### Advantages

- Decouples interface from implementation
- Improves extensibility (you can extend the abstraction and implementation hierarchies independently)
- Hides implementation details from clients
- Allows for dynamic switching of implementations at runtime
- Follows Open/Closed Principle by allowing new abstractions and implementations to be added separately

### Disadvantages

- Increases complexity due to additional indirection
- Can be overkill for simple applications
- Requires designing the proper abstractions up front

## Composite Pattern

The Composite pattern composes objects into tree structures to represent part-whole hierarchies. It lets clients treat individual objects and compositions of objects uniformly.

### Intent

- Compose objects into tree structures to represent part-whole hierarchies
- Allow clients to treat individual objects and compositions of objects uniformly
- Make it easy to add new kinds of components
- Create recursive tree structures with composite and leaf nodes

### Implementation

```java
// Component interface
interface Component {
    void operation();
    void add(Component component);
    void remove(Component component);
    Component getChild(int index);
}

// Leaf class
class Leaf implements Component {
    private String name;
    
    public Leaf(String name) {
        this.name = name;
    }
    
    @Override
    public void operation() {
        System.out.println("Leaf " + name + ": operation");
    }
    
    @Override
    public void add(Component component) {
        // Leaf nodes cannot have children
        throw new UnsupportedOperationException("Cannot add to a leaf");
    }
    
    @Override
    public void remove(Component component) {
        // Leaf nodes cannot have children
        throw new UnsupportedOperationException("Cannot remove from a leaf");
    }
    
    @Override
    public Component getChild(int index) {
        // Leaf nodes cannot have children
        throw new UnsupportedOperationException("Cannot get child from a leaf");
    }
}

// Composite class
class Composite implements Component {
    private List<Component> children = new ArrayList<>();
    private String name;
    
    public Composite(String name) {
        this.name = name;
    }
    
    @Override
    public void operation() {
        System.out.println("Composite " + name + ": operation");
        // Operation on all children
        for (Component component : children) {
            component.operation();
        }
    }
    
    @Override
    public void add(Component component) {
        children.add(component);
    }
    
    @Override
    public void remove(Component component) {
        children.remove(component);
    }
    
    @Override
    public Component getChild(int index) {
        return children.get(index);
    }
}

// Usage
Component leaf1 = new Leaf("A");
Component leaf2 = new Leaf("B");
Component leaf3 = new Leaf("C");

Component composite1 = new Composite("X");
composite1.add(leaf1);
composite1.add(leaf2);

Component composite2 = new Composite("Y");
composite2.add(leaf3);
composite2.add(composite1);

// Treat composite and leaf uniformly
composite2.operation();
```

### File System Example

```java
// Component
abstract class FileSystemComponent {
    protected String name;
    protected int size;
    
    public FileSystemComponent(String name, int size) {
        this.name = name;
        this.size = size;
    }
    
    public abstract int getSize();
    public abstract void printStructure(String indent);
    
    public String getName() {
        return name;
    }
}

// Leaf
class File extends FileSystemComponent {
    public File(String name, int size) {
        super(name, size);
    }
    
    @Override
    public int getSize() {
        return size;
    }
    
    @Override
    public void printStructure(String indent) {
        System.out.println(indent + "File: " + name + " (" + size + " KB)");
    }
}

// Composite
class Directory extends FileSystemComponent {
    private List<FileSystemComponent> children = new ArrayList<>();
    
    public Directory(String name) {
        super(name, 0);
    }
    
    public void addComponent(FileSystemComponent component) {
        children.add(component);
    }
    
    public void removeComponent(FileSystemComponent component) {
        children.remove(component);
    }
    
    @Override
    public int getSize() {
        int totalSize = 0;
        for (FileSystemComponent component : children) {
            totalSize += component.getSize();
        }
        return totalSize;
    }
    
    @Override
    public void printStructure(String indent) {
        System.out.println(indent + "Directory: " + name + " (" + getSize() + " KB)");
        for (FileSystemComponent component : children) {
            component.printStructure(indent + "  ");
        }
    }
}

// Usage
File file1 = new File("file1.txt", 5);
File file2 = new File("file2.txt", 10);
File file3 = new File("file3.txt", 7);
File file4 = new File("file4.txt", 20);

Directory dir1 = new Directory("docs");
dir1.addComponent(file1);
dir1.addComponent(file2);

Directory dir2 = new Directory("images");
dir2.addComponent(file3);

Directory root = new Directory("root");
root.addComponent(dir1);
root.addComponent(dir2);
root.addComponent(file4);

// Print structure and size
root.printStructure("");
System.out.println("Total size: " + root.getSize() + " KB");
```

### Transparency vs. Safety

There are two approaches to implementing the Composite pattern:

#### Transparent Approach (as shown above)

- Component declares all operations (both leaf and composite)
- Client can treat all objects uniformly
- Type safety is sacrificed (leaf nodes throw exceptions for composite operations)

#### Safe Approach

```java
// Component interface with only common operations
interface Component {
    void operation();
}

// Leaf class
class Leaf implements Component {
    private String name;
    
    public Leaf(String name) {
        this.name = name;
    }
    
    @Override
    public void operation() {
        System.out.println("Leaf " + name + ": operation");
    }
}

// Composite class with additional methods
class Composite implements Component {
    private List<Component> children = new ArrayList<>();
    private String name;
    
    public Composite(String name) {
        this.name = name;
    }
    
    @Override
    public void operation() {
        System.out.println("Composite " + name + ": operation");
        for (Component component : children) {
            component.operation();
        }
    }
    
    // Composite-specific methods
    public void add(Component component) {
        children.add(component);
    }
    
    public void remove(Component component) {
        children.remove(component);
    }
    
    public Component getChild(int index) {
        return children.get(index);
    }
}

// Usage requires type checking for Composite operations
Component component = getComponent(); // Some method that returns a Component
if (component instanceof Composite) {
    Composite composite = (Composite) component;
    composite.add(new Leaf("New Leaf"));
}
```

### When to Use the Composite Pattern

- When you want to represent part-whole hierarchies of objects
- When you want clients to be able to ignore the difference between compositions of objects and individual objects
- When the structure can have any level of complexity
- When you want the client code to work with all objects in the hierarchy uniformly
- When you're dealing with tree-structured data

### Advantages

- Defines class hierarchies containing primitive and complex objects
- Makes it easier to add new types of components
- Provides flexibility of structure with manageable components
- Simplifies client code by allowing it to treat complex and individual objects uniformly
- Follows the Open/Closed Principle by allowing new components to be added without changing existing code

### Disadvantages

- Can make the design overly general, making it harder to restrict certain components
- Can be difficult to provide a common interface for classes whose functionality differs widely
- In the transparent approach, type safety is sacrificed
- Difficult to restrict components of a particular composite to only particular types

## Decorator Pattern

The Decorator pattern attaches additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality.

### Intent

- Add responsibilities to individual objects dynamically and transparently
- Provide an alternative to subclassing for extending functionality
- Support the Open/Closed Principle by allowing functionality to be added without modifying existing code
- Allow responsibilities to be added and removed at runtime

### Implementation

```java
// Component interface
interface Component {
    void operation();
}

// Concrete Component
class ConcreteComponent implements Component {
    @Override
    public void operation() {
        System.out.println("ConcreteComponent: operation");
    }
}

// Decorator base class
abstract class Decorator implements Component {
    protected Component component;
    
    public Decorator(Component component) {
        this.component = component;
    }
    
    @Override
    public void operation() {
        component.operation();
    }
}

// Concrete Decorators
class ConcreteDecoratorA extends Decorator {
    public ConcreteDecoratorA(Component component) {
        super(component);
    }
    
    @Override
    public void operation() {
        super.operation();
        addedBehavior();
    }
    
    private void addedBehavior() {
        System.out.println("ConcreteDecoratorA: addedBehavior");
    }
}

class ConcreteDecoratorB extends Decorator {
    public ConcreteDecoratorB(Component component) {
        super(component);
    }
    
    @Override
    public void operation() {
        System.out.println("ConcreteDecoratorB: before");
        super.operation();
        System.out.println("ConcreteDecoratorB: after");
    }
}

// Usage
Component component = new ConcreteComponent();
Component decoratedA = new ConcreteDecoratorA(component);
Component decoratedB = new ConcreteDecoratorB(decoratedA);

// Call operation on the chain of decorators
decoratedB.operation();
```

### Coffee Shop Example

```java
// Component interface
interface Coffee {
    String getDescription();
    double getCost();
}

// Concrete Component
class SimpleCoffee implements Coffee {
    @Override
    public String getDescription() {
        return "Simple Coffee";
    }
    
    @Override
    public double getCost() {
        return 2.0;
    }
}

// Decorator base class
abstract class CoffeeDecorator implements Coffee {
    protected Coffee decoratedCoffee;
    
    public CoffeeDecorator(Coffee coffee) {
        this.decoratedCoffee = coffee;
    }
    
    @Override
    public String getDescription() {
        return decoratedCoffee.getDescription();
    }
    
    @Override
    public double getCost() {
        return decoratedCoffee.getCost();
    }
}

// Concrete Decorators
class MilkDecorator extends CoffeeDecorator {
    public MilkDecorator(Coffee coffee) {
        super(coffee);
    }
    
    @Override
    public String getDescription() {
        return decoratedCoffee.getDescription() + ", with milk";
    }
    
    @Override
    public double getCost() {
        return decoratedCoffee.getCost() + 0.5;
    }
}

class SugarDecorator extends CoffeeDecorator {
    public SugarDecorator(Coffee coffee) {
        super(coffee);
    }
    
    @Override
    public String getDescription() {
        return decoratedCoffee.getDescription() + ", with sugar";
    }
    
    @Override
    public double getCost() {
        return decoratedCoffee.getCost() + 0.2;
    }
}

class WhippedCreamDecorator extends CoffeeDecorator {
    public WhippedCreamDecorator(Coffee coffee) {
        super(coffee);
    }
    
    @Override
    public String getDescription() {
        return decoratedCoffee.getDescription() + ", with whipped cream";
    }
    
    @Override
    public double getCost() {
        return decoratedCoffee.getCost() + 1.0;
    }
}

// Usage
Coffee simpleCoffee = new SimpleCoffee();
System.out.println(simpleCoffee.getDescription() + ": $" + simpleCoffee.getCost());

Coffee milkCoffee = new MilkDecorator(simpleCoffee);
System.out.println(milkCoffee.getDescription() + ": $" + milkCoffee.getCost());

Coffee sweetMilkCoffee = new SugarDecorator(milkCoffee);
System.out.println(sweetMilkCoffee.getDescription() + ": $" + sweetMilkCoffee.getCost());

Coffee whippedSweetMilkCoffee = new WhippedCreamDecorator(sweetMilkCoffee);
System.out.println(whippedSweetMilkCoffee.getDescription() + ": $" + whippedSweetMilkCoffee.getCost());
```

### Java I/O Decorators

Java's I/O classes are a real-world example of the Decorator pattern:

```java
// Using Java's built-in I/O decorators
import java.io.*;

public class JavaIODecoratorExample {
    public static void main(String[] args) throws IOException {
        // Creating a chain of decorators for reading data
        try (InputStream fileInputStream = new FileInputStream("file.txt");
             InputStream bufferedInputStream = new BufferedInputStream(fileInputStream);
             InputStream dataInputStream = new DataInputStream(bufferedInputStream)) {
            
            // Now we can use methods from DataInputStream
            // while benefiting from buffering and file input
            byte data = dataInputStream.readByte();
        }
        
        // Creating a chain of decorators for writing data
        try (OutputStream fileOutputStream = new FileOutputStream("output.txt");
             OutputStream bufferedOutputStream = new BufferedOutputStream(fileOutputStream);
             PrintStream printStream = new PrintStream(bufferedOutputStream)) {
            
            // Now we can use methods from PrintStream
            // while benefiting from buffering and file output
            printStream.println("Hello, Decorator Pattern!");
        }
    }
}
```

### When to Use the Decorator Pattern

- When you need to add responsibilities to objects dynamically and transparently
- When extension by subclassing is impractical (would lead to an explosion of subclasses)
- When you want to add functionality to individual objects without affecting others
- When you want to add and remove responsibilities at runtime
- When your design should allow for a potentially unlimited variety of additional functionalities

### Advantages

- More flexible than inheritance for extending functionality
- Allows responsibilities to be added and removed at runtime
- Allows combining multiple behaviors by nesting decorators
- Follows the Single Responsibility Principle by dividing functionality into classes
- Follows the Open/Closed Principle by allowing extension without modification

### Disadvantages

- Can result in many small objects that look similar
- Decorators can complicate the process of instantiating the component
- Difficult to understand and debug code with many layers of decoration
- Some implementations of the decorator pattern (especially those with extensive state) may not be identical to the component they wrap

## Facade Pattern

The Facade pattern provides a unified interface to a set of interfaces in a subsystem. It defines a higher-level interface that makes the subsystem easier to use.

### Intent

- Provide a unified interface to a set of interfaces in a subsystem
- Define a higher-level interface that makes the subsystem easier to use
- Shield clients from complex subsystem components
- Reduce dependencies on external code
- Promote loose coupling between subsystems and clients

### Implementation

```java
// Complex subsystem classes
class SubsystemA {
    public void operationA() {
        System.out.println("SubsystemA: Operation A");
    }
}

class SubsystemB {
    public void operationB() {
        System.out.println("SubsystemB: Operation B");
    }
}

class SubsystemC {
    public void operationC() {
        System.out.println("SubsystemC: Operation C");
    }
}

// Facade
class Facade {
    private SubsystemA subsystemA;
    private SubsystemB subsystemB;
    private SubsystemC subsystemC;
    
    public Facade() {
        this.subsystemA = new SubsystemA();
        this.subsystemB = new SubsystemB();
        this.subsystemC = new SubsystemC();
    }
    
    // Methods that delegate to subsystems
    public void operation1() {
        System.out.println("Facade: Operation 1");
        subsystemA.operationA();
        subsystemB.operationB();
    }
    
    public void operation2() {
        System.out.println("Facade: Operation 2");
        subsystemB.operationB();
        subsystemC.operationC();
    }
}

// Client code
Facade facade = new Facade();
facade.operation1();
facade.operation2();
```

### Home Theater Example

```java
// Complex subsystem classes
class DVDPlayer {
    public void on() {
        System.out.println("DVD Player is ON");
    }
    
    public void off() {
        System.out.println("DVD Player is OFF");
    }
    
    public void play(String movie) {
        System.out.println("DVD Player is playing: " + movie);
    }
    
    public void stop() {
        System.out.println("DVD Player stopped");
    }
}

class Amplifier {
    public void on() {
        System.out.println("Amplifier is ON");
    }
    
    public void off() {
        System.out.println("Amplifier is OFF");
    }
    
    public void setVolume(int level) {
        System.out.println("Amplifier volume set to: " + level);
    }
    
    public void setDvd(DVDPlayer dvd) {
        System.out.println("Amplifier connected to DVD player");
    }
}

class Projector {
    public void on() {
        System.out.println("Projector is ON");
    }
    
    public void off() {
        System.out.println("Projector is OFF");
    }
    
    public void wideScreenMode() {
        System.out.println("Projector in widescreen mode (16:9)");
    }
}

class TheaterLights {
    public void dim(int level) {
        System.out.println("Theater lights dimming to " + level + "%");
    }
    
    public void on() {
        System.out.println("Theater lights ON");
    }
}

class Screen {
    public void down() {
        System.out.println("Theater screen going down");
    }
    
    public void up() {
        System.out.println("Theater screen going up");
    }
}

// Facade
class HomeTheaterFacade {
    private Amplifier amplifier;
    private DVDPlayer dvdPlayer;
    private Projector projector;
    private TheaterLights lights;
    private Screen screen;
    
    public HomeTheaterFacade(Amplifier amplifier, DVDPlayer dvdPlayer, 
                           Projector projector, TheaterLights lights, Screen screen) {
        this.amplifier = amplifier;
        this.dvdPlayer = dvdPlayer;
        this.projector = projector;
        this.lights = lights;
        this.screen = screen;
    }
    
    public void watchMovie(String movie) {
        System.out.println("=== Getting ready to watch a movie ===");
        lights.dim(10);
        screen.down();
        projector.on();
        projector.wideScreenMode();
        amplifier.on();
        amplifier.setDvd(dvdPlayer);
        amplifier.setVolume(5);
        dvdPlayer.on();
        dvdPlayer.play(movie);
    }
    
    public void endMovie() {
        System.out.println("=== Shutting down movie theater ===");
        dvdPlayer.stop();
        dvdPlayer.off();
        amplifier.off();
        projector.off();
        screen.up();
        lights.on();
    }
}

// Client code
Amplifier amplifier = new Amplifier();
DVDPlayer dvdPlayer = new DVDPlayer();
Projector projector = new Projector();
TheaterLights lights = new TheaterLights();
Screen screen = new Screen();

HomeTheaterFacade homeTheater = new HomeTheaterFacade(
    amplifier, dvdPlayer, projector, lights, screen);

// Using the facade
homeTheater.watchMovie("Inception");
// ... movie is playing ...
homeTheater.endMovie();
```

### Database Facade Example

```java
// Complex database subsystem
class Connection {
    public void open(String connectionString) {
        System.out.println("Opening database connection to: " + connectionString);
    }
    
    public void close() {
        System.out.println("Closing database connection");
    }
}

class Command {
    private Connection connection;
    
    public Command(Connection connection) {
        this.connection = connection;
    }
    
    public void execute(String query) {
        System.out.println("Executing query: " + query);
    }
}

class Transaction {
    public void begin() {
        System.out.println("Beginning transaction");
    }
    
    public void commit() {
        System.out.println("Committing transaction");
    }
    
    public void rollback() {
        System.out.println("Rolling back transaction");
    }
}

class ResultSet {
    public void read() {
        System.out.println("Reading data from result set");
    }
    
    public void close() {
        System.out.println("Closing result set");
    }
}

// Database Facade
class DatabaseFacade {
    private Connection connection;
    private Transaction transaction;
    
    public DatabaseFacade() {
        connection = new Connection();
        transaction = new Transaction();
    }
    
    public void executeQuery(String connectionString, String query) {
        connection.open(connectionString);
        Command command = new Command(connection);
        ResultSet resultSet = new ResultSet();
        
        try {
            transaction.begin();
            command.execute(query);
            resultSet.read();
            transaction.commit();
        } catch (Exception e) {
            transaction.rollback();
            System.out.println("Error executing query: " + e.getMessage());
        } finally {
            resultSet.close();
            connection.close();
        }
    }
}

// Client code
DatabaseFacade dbFacade = new DatabaseFacade();
dbFacade.executeQuery("jdbc:mysql://localhost:3306/mydb", "SELECT * FROM users");
```

### When to Use the Facade Pattern

- When you want to provide a simple interface to a complex subsystem
- When there are many dependencies between clients and the implementation classes of an abstraction
- When you want to layer your subsystems
- When you want to decouple your client code from subsystem components
- When you need to simplify a large, complex API
- When you want to create an entry point to each level of a layered software

### Advantages

- Shields clients from subsystem components, reducing coupling
- Promotes subsystem independence and portability
- Simplifies the usage of complex systems
- Provides a context-specific interface to a large, general-purpose API
- Helps in applying the principle of least knowledge (clients only talk to the facade)
- Enables organizing systems into layers

### Disadvantages

- A facade can become a god object coupled to all classes of an app
- The facade might add complexity if the underlying system is simple
- The facade may hide important configuration options and flexibility
- Might introduce a performance overhead if not designed carefully

## Flyweight Pattern

The Flyweight pattern uses sharing to support large numbers of fine-grained objects efficiently. It reduces memory usage by sharing common state between multiple objects instead of keeping all of the data in each object.

### Intent

- Use sharing to support large numbers of fine-grained objects efficiently
- Reduce memory footprint of a large number of similar objects
- Separate intrinsic (shared) state from extrinsic (unique) state
- Allow many virtual objects to share the same data
- Balance memory consumption and performance

### Implementation

```java
import java.util.HashMap;
import java.util.Map;

// Flyweight interface
interface Flyweight {
    void operation(String extrinsicState);
}

// Concrete Flyweight
class ConcreteFlyweight implements Flyweight {
    private final String intrinsicState;
    
    public ConcreteFlyweight(String intrinsicState) {
        this.intrinsicState = intrinsicState;
    }
    
    @Override
    public void operation(String extrinsicState) {
        System.out.println("Intrinsic State: " + intrinsicState);
        System.out.println("Extrinsic State: " + extrinsicState);
    }
}

// Flyweight Factory
class FlyweightFactory {
    private final Map<String, Flyweight> flyweights = new HashMap<>();
    
    public Flyweight getFlyweight(String key) {
        if (!flyweights.containsKey(key)) {
            flyweights.put(key, new ConcreteFlyweight(key));
            System.out.println("Creating new flyweight with key: " + key);
        } else {
            System.out.println("Reusing existing flyweight with key: " + key);
        }
        return flyweights.get(key);
    }
    
    public int getFlyweightCount() {
        return flyweights.size();
    }
}

// Client code
FlyweightFactory factory = new FlyweightFactory();

// Get flyweights with the same intrinsic state
Flyweight flyweight1 = factory.getFlyweight("shared");
Flyweight flyweight2 = factory.getFlyweight("shared");
Flyweight flyweight3 = factory.getFlyweight("different");

// Operations with different extrinsic states
flyweight1.operation("First external state");
flyweight2.operation("Second external state");
flyweight3.operation("Third external state");

System.out.println("Total flyweights created: " + factory.getFlyweightCount());
```

### Text Editor Example

```java
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

// Character Flyweight
class CharacterFlyweight {
    private final char character;
    private final String font;
    private final int size;
    
    public CharacterFlyweight(char character, String font, int size) {
        this.character = character;
        this.font = font;
        this.size = size;
        
        // Simulate memory consumption
        System.out.println("Creating flyweight for character: " + character + 
                          ", font: " + font + ", size: " + size);
    }
    
    public void display(int x, int y, String color) {
        System.out.println("Displaying character " + character + 
                          " at position (" + x + "," + y + ") with color " + color + 
                          " using font " + font + " and size " + size);
    }
}

// Flyweight Factory
class CharacterFlyweightFactory {
    private final Map<String, CharacterFlyweight> flyweights = new HashMap<>();
    
    public CharacterFlyweight getCharacter(char character, String font, int size) {
        String key = character + font + size;
        if (!flyweights.containsKey(key)) {
            flyweights.put(key, new CharacterFlyweight(character, font, size));
        }
        return flyweights.get(key);
    }
    
    public int getFlyweightCount() {
        return flyweights.size();
    }
}

// Text containing characters with position and color (extrinsic state)
class TextEditor {
    private final List<Character> characters = new ArrayList<>();
    private final CharacterFlyweightFactory factory;
    
    private int currentX = 0;
    private int currentY = 0;
    
    public TextEditor(CharacterFlyweightFactory factory) {
        this.factory = factory;
    }
    
    public void addCharacter(char character, String font, int size, String color) {
        CharacterFlyweight flyweight = factory.getCharacter(character, font, size);
        characters.add(new Character(flyweight, currentX, currentY, color));
        currentX += 10; // Move cursor position
    }
    
    public void display() {
        for (Character character : characters) {
            character.display();
        }
    }
    
    // Character position class (stores extrinsic state)
    private static class Character {
        private final CharacterFlyweight flyweight;
        private final int x;
        private final int y;
        private final String color;
        
        public Character(CharacterFlyweight flyweight, int x, int y, String color) {
            this.flyweight = flyweight;
            this.x = x;
            this.y = y;
            this.color = color;
        }
        
        public void display() {
            flyweight.display(x, y, color);
        }
    }
}

// Usage
CharacterFlyweightFactory factory = new CharacterFlyweightFactory();
TextEditor editor = new TextEditor(factory);

// Add text with the same font and size but different positions and colors
String text = "Hello Flyweight Pattern!";
for (int i = 0; i < text.length(); i++) {
    char c = text.charAt(i);
    String color = i % 2 == 0 ? "blue" : "red";
    editor.addCharacter(c, "Arial", 12, color);
}

editor.display();
System.out.println("Total flyweights created: " + factory.getFlyweightCount());
// Even though we added 23 characters, we only created unique flyweights for each character
```

### Forest Rendering Example

```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

// Tree type - intrinsic state
class TreeType {
    private final String name;
    private final String color;
    private final String texture;
    
    public TreeType(String name, String color, String texture) {
        this.name = name;
        this.color = color;
        this.texture = texture;
        
        System.out.println("Creating a tree type: " + name);
    }
    
    public void render(int x, int y) {
        System.out.println("Rendering " + name + " tree with " + color + 
                          " color and " + texture + " texture at (" + x + "," + y + ")");
    }
}

// Flyweight factory
class TreeFactory {
    private static final Map<String, TreeType> treeTypes = new HashMap<>();
    
    public static TreeType getTreeType(String name, String color, String texture) {
        String key = name + color + texture;
        if (!treeTypes.containsKey(key)) {
            treeTypes.put(key, new TreeType(name, color, texture));
        }
        return treeTypes.get(key);
    }
    
    public static int getTreeTypeCount() {
        return treeTypes.size();
    }
}

// Tree - contains extrinsic state
class Tree {
    private final int x;
    private final int y;
    private final TreeType type;
    
    public Tree(int x, int y, TreeType type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }
    
    public void render() {
        type.render(x, y);
    }
}

// Forest - contains all trees
class Forest {
    private final List<Tree> trees = new ArrayList<>();
    
    public void plantTree(int x, int y, String name, String color, String texture) {
        TreeType type = TreeFactory.getTreeType(name, color, texture);
        Tree tree = new Tree(x, y, type);
        trees.add(tree);
    }
    
    public void render() {
        for (Tree tree : trees) {
            tree.render();
        }
    }
}

// Usage
Forest forest = new Forest();
Random random = new Random();

// Plant many trees of a few types
for (int i = 0; i < 100; i++) {
    int x = random.nextInt(500);
    int y = random.nextInt(500);
    
    String name;
    String color;
    String texture;
    
    if (random.nextBoolean()) {
        name = "Oak";
        color = "Green";
        texture = "Rough";
    } else {
        name = "Pine";
        color = "Dark Green";
        texture = "Smooth";
    }
    
    forest.plantTree(x, y, name, color, texture);
}

forest.render();
System.out.println("Total tree types created: " + TreeFactory.getTreeTypeCount());
// Even though we have 100 trees, we only created 2 tree types
```

### When to Use the Flyweight Pattern

- When an application uses a large number of objects
- When memory usage is high due to the sheer quantity of objects
- When the majority of each object's state can be made extrinsic (external)
- When many objects can be replaced by a few shared objects
- When the application doesn't depend on object identity
- When the objects' intrinsic state is immutable or can be shared

### Advantages

- Reduces memory usage by sharing common data
- Improves performance in memory-constrained environments
- Decreases the total number of objects created
- Makes it possible to represent large numbers of virtual objects without creating as many real ones
- Keeps object instances to a minimum, which can improve responsiveness

### Disadvantages

- Adds complexity by separating intrinsic and extrinsic state
- Managing extrinsic state can add runtime overhead
- The pattern may not provide significant benefits if objects don't share significant amounts of data
- Adds synchronization overhead when used in multi-threaded applications
- Makes it harder to track individual object instances if they need to be tracked separately

## Proxy Pattern

The Proxy pattern provides a surrogate or placeholder for another object to control access to it. It creates a representative object that controls access to another object, which may be remote, expensive to create, or in need of securing.

### Intent

- Provide a surrogate or placeholder for another object to control access to it
- Add a wrapper and delegation to protect the real component from undue complexity
- Control access to the original object
- Add functionality when accessing the original object
- Delay the full cost of creating an object until we need to use it

### Implementation

```java
// Subject interface
interface Subject {
    void request();
}

// Real Subject
class RealSubject implements Subject {
    @Override
    public void request() {
        System.out.println("RealSubject: Handling request");
    }
}

// Proxy
class Proxy implements Subject {
    private RealSubject realSubject;
    
    @Override
    public void request() {
        // Lazy initialization: create the RealSubject only when needed
        if (realSubject == null) {
            realSubject = new RealSubject();
        }
        
        preRequest();
        realSubject.request();
        postRequest();
    }
    
    private void preRequest() {
        System.out.println("Proxy: Pre-processing request");
    }
    
    private void postRequest() {
        System.out.println("Proxy: Post-processing request");
    }
}

// Client code
Subject subject = new Proxy();
subject.request();
```

### Types of Proxies

#### Virtual Proxy (Lazy Initialization)

```java
// Heavy image resource
class Image {
    private String filename;
    
    public Image(String filename) {
        this.filename = filename;
        loadImageFromDisk();
    }
    
    private void loadImageFromDisk() {
        System.out.println("Loading image: " + filename);
        // Simulate loading a large image
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
    
    public void display() {
        System.out.println("Displaying image: " + filename);
    }
}

// Image interface
interface ImageInterface {
    void display();
}

// Real image implementation
class RealImage implements ImageInterface {
    private String filename;
    
    public RealImage(String filename) {
        this.filename = filename;
        loadFromDisk();
    }
    
    private void loadFromDisk() {
        System.out.println("Loading image: " + filename);
        // Simulate loading a large image
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
    
    @Override
    public void display() {
        System.out.println("Displaying image: " + filename);
    }
}

// Virtual proxy for the image
class VirtualImage implements ImageInterface {
    private String filename;
    private RealImage realImage;
    
    public VirtualImage(String filename) {
        this.filename = filename;
        System.out.println("Virtual image created: " + filename);
    }
    
    @Override
    public void display() {
        // Load the real image only when needed
        if (realImage == null) {
            realImage = new RealImage(filename);
        }
        realImage.display();
    }
}

// Usage
System.out.println("Creating image proxies...");
ImageInterface image1 = new VirtualImage("photo1.jpg");
ImageInterface image2 = new VirtualImage("photo2.jpg");

// The images aren't loaded until display() is called
System.out.println("Will display image1...");
image1.display(); // Now photo1.jpg is loaded

System.out.println("Will display image1 again...");
image1.display(); // No loading occurs, already loaded

System.out.println("Will display image2...");
image2.display(); // Now photo2.jpg is loaded
```

#### Protection Proxy (Access Control)

```java
// Internet interface
interface Internet {
    void connectTo(String serverhost) throws Exception;
}

// Real Internet implementation
class RealInternet implements Internet {
    @Override
    public void connectTo(String serverHost) {
        System.out.println("Connecting to " + serverHost);
    }
}

// Protection proxy for controlling access
class RestrictedInternet implements Internet {
    private Internet internet = new RealInternet();
    private List<String> bannedSites;
    
    public RestrictedInternet() {
        bannedSites = Arrays.asList(
            "banned1.example.com",
            "banned2.example.com",
            "banned3.example.com"
        );
    }
    
    @Override
    public void connectTo(String serverHost) throws Exception {
        if (bannedSites.contains(serverHost)) {
            throw new Exception("Access Denied: Cannot connect to " + serverHost);
        }
        
        internet.connectTo(serverHost);
    }
}

// Usage
Internet internet = new RestrictedInternet();

try {
    internet.connectTo("allowed.example.com");      // Allowed
    internet.connectTo("banned1.example.com");      // Throws exception
} catch (Exception e) {
    System.out.println(e.getMessage());
}
```

#### Remote Proxy

```java
// Remote interface
interface RemoteService {
    String performOperation(String data);
}

// Real service implementation (would be on a remote server)
class RealRemoteService implements RemoteService {
    @Override
    public String performOperation(String data) {
        return "Processed: " + data;
    }
}

// Remote proxy simulating RPC
class RemoteServiceProxy implements RemoteService {
    private RemoteService service;
    
    public RemoteServiceProxy() {
        // In a real scenario, this might set up network communication
        System.out.println("Setting up remote service connection");
    }
    
    @Override
    public String performOperation(String data) {
        // Lazy initialization of the service connection
        if (service == null) {
            System.out.println("Establishing connection to remote service");
            service = new RealRemoteService(); // In reality, this would be a remote reference
        }
        
        System.out.println("Sending data over the network: " + data);
        
        // Simulate network communication
        try {
            Thread.sleep(200);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        String result = service.performOperation(data);
        
        System.out.println("Received result from remote service");
        return result;
    }
}

// Usage
RemoteService service = new RemoteServiceProxy();
String result = service.performOperation("Sample data");
System.out.println("Result: " + result);
```

#### Smart Proxy (Adding Functionality)

```java
// Database connection interface
interface DatabaseExecutor {
    void execute(String query);
}

// Real database executor
class DatabaseExecutorImpl implements DatabaseExecutor {
    @Override
    public void execute(String query) {
        System.out.println("Executing query: " + query);
    }
}

// Smart proxy that adds transaction management and query logging
class DatabaseExecutorProxy implements DatabaseExecutor {
    private boolean isAdmin;
    private DatabaseExecutor executor;
    
    public DatabaseExecutorProxy(String user, String password) {
        if ("admin".equals(user) && "password".equals(password)) {
            isAdmin = true;
        }
        executor = new DatabaseExecutorImpl();
    }
    
    @Override
    public void execute(String query) {
        if (isAdmin) {
            // Add transaction management
            System.out.println("Starting transaction...");
            
            try {
                // Log the query
                logQuery(query);
                
                // Execute the query
                executor.execute(query);
                
                System.out.println("Committing transaction...");
            } catch (Exception e) {
                System.out.println("Rolling back transaction due to: " + e.getMessage());
            }
        } else {
            if (query.toLowerCase().startsWith("select")) {
                logQuery(query);
                executor.execute(query);
            } else {
                System.out.println("Access denied: Not authorized for non-select queries");
            }
        }
    }
    
    private void logQuery(String query) {
        System.out.println("Logging query: " + query);
    }
}

// Usage
DatabaseExecutor nonAdminExecutor = new DatabaseExecutorProxy("guest", "guest");
nonAdminExecutor.execute("SELECT * FROM users");            // Works
nonAdminExecutor.execute("DELETE FROM users WHERE id = 1"); // Access denied

DatabaseExecutor adminExecutor = new DatabaseExecutorProxy("admin", "password");
adminExecutor.execute("SELECT * FROM users");               // Works
adminExecutor.execute("DELETE FROM users WHERE id = 1");    // Works with transaction
```

### When to Use the Proxy Pattern

- When you need lazy initialization (virtual proxy)
- When you need access control for the original object (protection proxy)
- When you need to add logging, performance monitoring, or auditing (smart proxy)
- When you need to connect to a remote service (remote proxy)
- When you need a simplified version of a complex or heavy object (virtual proxy)
- When you need a local representative for an object in a different address space (remote proxy)
- When you need to cache results of expensive operations (caching proxy)

### Advantages

- Controls access to the original object
- Allows operations to be performed before or after the request reaches the original object
- Manages the lifecycle of the original object
- Works even when the original object is not ready or not available
- Adds functionality without changing the original object
- Follows the Open/Closed Principle
- Implements the principle of separation of concerns

### Disadvantages

- Adds another layer of indirection which can impact performance
- Makes the code more complex
- Client code might behave differently depending on whether it's using the proxy or the real subject
- In some proxy implementations, the response might be delayed due to lazy initialization

## Best Practices

### General Best Practices for Structural Patterns

1. **Understand the Problem First**: Choose a pattern only after you understand the problem you're trying to solve.

2. **Keep It Simple**: Don't over-engineer solutions. Use the simplest pattern that meets your needs.

3. **Consider Combination**: Sometimes combining patterns can provide more powerful solutions.

4. **Balance Performance**: Structural patterns can introduce overhead, so ensure the benefits outweigh the costs.

5. **Document Your Design**: Make sure to document why and how you're using specific patterns.

### Pattern-Specific Best Practices

#### Adapter Pattern

- Keep adapters simple and focused on interface translation
- Consider using the Adapter pattern for legacy code integration
- Use composition over inheritance when possible
- Don't adapt more than necessary

#### Bridge Pattern

- Identify the varying dimensions early
- Design for independent evolution
- Make sure abstractions and implementations can change independently
- Consider future extensions to both hierarchies

#### Composite Pattern

- Define clear component interface with operations for both leaf and composite
- Consider whether to use the safe or transparent approach
- Be careful with operations that don't make sense for particular components
- Consider adding parent references if needed
- Be explicit about whether clients can modify the component structure

#### Decorator Pattern

- Keep decorator interface compatible with the component
- Make decorators independent of each other
- Keep the component code simple
- Consider using Builder or Factory for complex decoration chains
- Be consistent with method delegation

#### Facade Pattern

- Keep facades simple and focused on providing a simplified interface
- Avoid turning facades into "god objects"
- Consider creating multiple facades for different use cases
- Don't expose the subsystem components through the facade
- Don't make facade dependent on client code

#### Flyweight Pattern

- Clearly separate intrinsic and extrinsic state
- Make flyweight objects immutable
- Use a factory for flyweight creation and management
- Ensure thread safety in the flyweight factory if needed
- Consider the memory/performance tradeoff

#### Proxy Pattern

- Keep the proxy interface identical to the subject
- Choose the right type of proxy for your needs
- Consider lazy initialization for expensive resources
- Proxy should completely encapsulate access to the real subject
- Don't add too much logic to the proxy

## Common Pitfalls

### Overusing Patterns

```java
// Overusing patterns - unnecessary Facade
public class SimpleService {
    public void performOperation() {
        // Simple operation
    }
}

// Unnecessary Facade
public class ServiceFacade {
    private SimpleService service = new SimpleService();
    
    public void operation() {
        service.performOperation();
    }
}

// Better approach - use SimpleService directly if it's already simple
```

### Overcomplicating with Unnecessary Layers

```java
// Overcomplicating - too many decorators
interface Coffee {
    double getCost();
}

class BasicCoffee implements Coffee {
    @Override
    public double getCost() {
        return 2.0;
    }
}

class MilkDecorator implements Coffee {
    private Coffee coffee;
    
    public MilkDecorator(Coffee coffee) {
        this.coffee = coffee;
    }
    
    @Override
    public double getCost() {
        return coffee.getCost() + 0.5;
    }
}

class SugarDecorator implements Coffee {
    private Coffee coffee;
    
    public SugarDecorator(Coffee coffee) {
        this.coffee = coffee;
    }
    
    @Override
    public double getCost() {
        return coffee.getCost() + 0.2;
    }
}

class WhippedCreamDecorator implements Coffee {
    private Coffee coffee;
    
    public WhippedCreamDecorator(Coffee coffee) {
        this.coffee = coffee;
    }
    
    @Override
    public double getCost() {
        return coffee.getCost() + 1.0;
    }
}

class ChocolateSyrupDecorator implements Coffee {
    private Coffee coffee;
    
    public ChocolateSyrupDecorator(Coffee coffee) {
        this.coffee = coffee;
    }
    
    @Override
    public double getCost() {
        return coffee.getCost() + 0.8;
    }
}

class CreamDecorator implements Coffee {
    private Coffee coffee;
    
    public CreamDecorator(Coffee coffee) {
        this.coffee = coffee;
    }
    
    @Override
    public double getCost() {
        return coffee.getCost() + 0.3;
    }
}

// Too many decorators 
Coffee coffee = new ChocolateSyrupDecorator(
                new CreamDecorator(
                new WhippedCreamDecorator(
                new SugarDecorator(
                new MilkDecorator(
                new BasicCoffee())))));

// Better approach - combine related decorators or use a Builder pattern
```

### Confusing Similar Patterns

Developers often confuse similar patterns:

- **Adapter vs. Bridge**: Adapter makes incompatible interfaces work together; Bridge separates abstraction from implementation.
- **Decorator vs. Proxy**: Decorator adds responsibilities; Proxy controls access.
- **Facade vs. Adapter**: Facade provides a simplified interface; Adapter enables incompatible interfaces to work together.
- **Composite vs. Decorator**: Composite builds tree structures; Decorator adds responsibilities without subclassing.

### Performance Issues with Structural Patterns

```java
// Performance issue - proxy with excessive overhead
class ExpensiveProxy implements Subject {
    private RealSubject realSubject;
    
    @Override
    public void request() {
        // Excessive overhead before delegation
        System.out.println("Starting proxy operation");
        for (int i = 0; i < 1000; i++) {
            // Unnecessary processing
            Math.sqrt(i);
        }
        
        // Create subject on every request instead of reusing
        realSubject = new RealSubject();
        
        realSubject.request();
        
        // Excessive overhead after delegation
        System.out.println("Finishing proxy operation");
        for (int i = 0; i < 1000; i++) {
            // Unnecessary processing
            Math.sqrt(i);
        }
    }
}

// Better approach - minimize overhead and cache the real subject
class EfficientProxy implements Subject {
    private RealSubject realSubject;
    
    @Override
    public void request() {
        // Lazy initialization with caching
        if (realSubject == null) {
            realSubject = new RealSubject();
        }
        
        // Minimal pre-processing
        System.out.println("Starting proxy operation");
        
        realSubject.request();
        
        // Minimal post-processing
        System.out.println("Finishing proxy operation");
    }
}
```

### Ignoring Pattern Limitations

Each pattern has limitations that should be considered:

- **Adapter**: Adds complexity and may hide poor design
- **Bridge**: Increases complexity and isn't suitable for simple class hierarchies
- **Composite**: May make design overly general and compromise type safety
- **Decorator**: Can lead to many small, similar objects that are hard to debug
- **Facade**: May turn into a god object if not designed carefully
- **Flyweight**: Adds complexity for managing extrinsic state
- **Proxy**: Adds indirection which can impact performance

## Comparing Structural Patterns

### When to Choose Which Pattern

| Pattern | When to Use |
|---------|-------------|
| **Adapter** | When you need to make incompatible interfaces work together |
| **Bridge** | When you want to decouple an abstraction from its implementation |
| **Composite** | When you need to work with tree-like object structures |
| **Decorator** | When you want to add responsibilities dynamically without subclassing |
| **Facade** | When you need to provide a simplified interface to a complex subsystem |
| **Flyweight** | When you need to support a large number of fine-grained objects efficiently |
| **Proxy** | When you need to control access to an object |

### Comparison of Key Characteristics

| Pattern | Intent | Complexity | Flexibility |
|---------|--------|------------|------------|
| **Adapter** | Makes incompatible interfaces compatible | Low-Medium | Medium |
| **Bridge** | Separates abstraction from implementation | Medium-High | High |
| **Composite** | Treats individual objects and compositions uniformly | Medium | Medium |
| **Decorator** | Adds responsibilities dynamically | Medium | High |
| **Facade** | Simplifies a complex subsystem | Low | Low |
| **Flyweight** | Shares common state between objects | Medium-High | Low |
| **Proxy** | Controls access to an object | Low-Medium | Medium |

### Pattern Combinations

Structural patterns can be combined for more powerful solutions:

1. **Decorator + Composite**: Decorators can add behavior to composite structures.
2. **Adapter + Bridge**: Adapters can make bridges work with incompatible interfaces.
3. **Proxy + Flyweight**: A proxy can manage reference to flyweight objects.
4. **Facade + Adapter**: A facade can use adapters to work with incompatible subsystem components.
5. **Composite + Flyweight**: Flyweights can be used to reduce memory usage in large composite structures.

## Summary

Structural design patterns focus on how classes and objects are composed and provide solutions to create flexible, maintainable, and efficient code structure:

- **Adapter Pattern**: Converts the interface of a class into another interface clients expect.
- **Bridge Pattern**: Decouples an abstraction from its implementation.
- **Composite Pattern**: Composes objects into tree structures to represent part-whole hierarchies.
- **Decorator Pattern**: Adds responsibilities to objects dynamically without subclassing.
- **Facade Pattern**: Provides a simplified interface to a complex subsystem.
- **Flyweight Pattern**: Uses sharing to support large numbers of fine-grained objects efficiently.
- **Proxy Pattern**: Provides a surrogate or placeholder for another object to control access.

Each pattern has specific use cases, advantages, and disadvantages. The key to effective use of structural patterns is understanding when and how to apply them to solve specific design problems.

By mastering these patterns, you'll be able to design more flexible, maintainable, and efficient object structures in your Java applications.

## Further Reading

- "Design Patterns: Elements of Reusable Object-Oriented Software" by Gamma, Helm, Johnson, and Vlissides
- "Head First Design Patterns" by Eric Freeman and Elisabeth Robson
- "Effective Java" by Joshua Bloch
- "Clean Code" by Robert C. Martin
- [Refactoring Guru - Design Patterns](https://refactoring.guru/design-patterns)
- [SourceMaking - Design Patterns](https://sourcemaking.com/design_patterns)
- [Java Design Patterns](https://java-design-patterns.com/) 