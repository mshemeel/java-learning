# Behavioral Design Patterns

## Overview
Behavioral design patterns are concerned with algorithms and the assignment of responsibilities between objects. They characterize complex control flow that's difficult to follow at run-time. They shift your focus away from flow of control to let you concentrate just on the way objects are interconnected. This guide covers essential behavioral design patterns in Java, their implementation, use cases, advantages, and potential drawbacks.

## Prerequisites
- Solid understanding of Java programming
- Familiarity with object-oriented programming concepts
- Basic knowledge of SOLID principles
- Understanding of class inheritance and interfaces

## Learning Objectives
- Understand the purpose and benefits of behavioral design patterns
- Learn when and how to implement different behavioral patterns
- Recognize appropriate use cases for each pattern
- Implement behavioral patterns in Java applications
- Understand the trade-offs between different behavioral patterns
- Apply best practices when implementing behavioral patterns

## Table of Contents
1. [Introduction to Behavioral Patterns](#introduction-to-behavioral-patterns)
2. [Chain of Responsibility Pattern](#chain-of-responsibility-pattern)
3. [Command Pattern](#command-pattern)
4. [Interpreter Pattern](#interpreter-pattern)
5. [Iterator Pattern](#iterator-pattern)
6. [Mediator Pattern](#mediator-pattern)
7. [Memento Pattern](#memento-pattern)
8. [Observer Pattern](#observer-pattern)
9. [State Pattern](#state-pattern)
10. [Strategy Pattern](#strategy-pattern)
11. [Template Method Pattern](#template-method-pattern)
12. [Visitor Pattern](#visitor-pattern)
13. [Best Practices](#best-practices)
14. [Common Pitfalls](#common-pitfalls)
15. [Comparing Behavioral Patterns](#comparing-behavioral-patterns)

## Introduction to Behavioral Patterns

Behavioral patterns focus on communication between objects, how they interact and distribute responsibility. They help make complex flows more manageable by organizing the responsibilities and interactions between classes and objects.

### Why Use Behavioral Patterns?

1. **Flexibility**: They allow changing behavior at runtime.
2. **Loose Coupling**: They reduce dependencies between communicating objects.
3. **Responsibility Allocation**: They define clear roles for objects when carrying out tasks.
4. **Encapsulation**: They encapsulate algorithms and behaviors that can vary.

### When to Use Behavioral Patterns

- When you want to define how objects communicate with each other
- When you need to encapsulate algorithms and make them interchangeable
- When you want to separate the logic that varies from what stays the same
- When you need to define complex workflows and interactions
- When you want to implement communication mechanisms between objects 

## Chain of Responsibility Pattern

The Chain of Responsibility pattern creates a chain of receiver objects for a request. This pattern decouples sender and receiver of a request based on the type of request.

### Intent

- Avoid coupling the sender of a request to its receiver
- Allow more than one object to handle a request
- Chain receiving objects and pass the request along the chain until an object handles it
- Dynamically modify the chain at runtime

### Implementation

```java
// Handler interface
abstract class Handler {
    protected Handler successor;
    
    public void setSuccessor(Handler successor) {
        this.successor = successor;
    }
    
    public abstract void handleRequest(Request request);
}

// Request class
class Request {
    private String type;
    private String content;
    
    public Request(String type, String content) {
        this.type = type;
        this.content = content;
    }
    
    public String getType() {
        return type;
    }
    
    public String getContent() {
        return content;
    }
}

// Concrete handlers
class ConcreteHandler1 extends Handler {
    @Override
    public void handleRequest(Request request) {
        if ("type1".equals(request.getType())) {
            System.out.println("Handler 1 is handling the request: " + request.getContent());
        } else if (successor != null) {
            successor.handleRequest(request);
        } else {
            System.out.println("Request cannot be handled");
        }
    }
}

class ConcreteHandler2 extends Handler {
    @Override
    public void handleRequest(Request request) {
        if ("type2".equals(request.getType())) {
            System.out.println("Handler 2 is handling the request: " + request.getContent());
        } else if (successor != null) {
            successor.handleRequest(request);
        } else {
            System.out.println("Request cannot be handled");
        }
    }
}

class ConcreteHandler3 extends Handler {
    @Override
    public void handleRequest(Request request) {
        if ("type3".equals(request.getType())) {
            System.out.println("Handler 3 is handling the request: " + request.getContent());
        } else if (successor != null) {
            successor.handleRequest(request);
        } else {
            System.out.println("Request cannot be handled");
        }
    }
}

// Client code
Handler h1 = new ConcreteHandler1();
Handler h2 = new ConcreteHandler2();
Handler h3 = new ConcreteHandler3();

// Set up the chain
h1.setSuccessor(h2);
h2.setSuccessor(h3);

// Send requests through the chain
h1.handleRequest(new Request("type1", "Request 1"));
h1.handleRequest(new Request("type2", "Request 2"));
h1.handleRequest(new Request("type3", "Request 3"));
h1.handleRequest(new Request("type4", "Request 4"));
```

### Logging Example

```java
// Logging levels
enum LogLevel {
    INFO(1), DEBUG(2), ERROR(3);
    
    private int level;
    
    LogLevel(int level) {
        this.level = level;
    }
    
    public int getLevel() {
        return level;
    }
}

// Logger interface
abstract class Logger {
    protected LogLevel level;
    protected Logger nextLogger;
    
    public Logger(LogLevel level) {
        this.level = level;
    }
    
    public void setNextLogger(Logger nextLogger) {
        this.nextLogger = nextLogger;
    }
    
    public void logMessage(LogLevel level, String message) {
        if (this.level.getLevel() <= level.getLevel()) {
            write(message);
        }
        
        if (nextLogger != null) {
            nextLogger.logMessage(level, message);
        }
    }
    
    protected abstract void write(String message);
}

// Concrete loggers
class ConsoleLogger extends Logger {
    public ConsoleLogger(LogLevel level) {
        super(level);
    }
    
    @Override
    protected void write(String message) {
        System.out.println("Console Logger: " + message);
    }
}

class FileLogger extends Logger {
    public FileLogger(LogLevel level) {
        super(level);
    }
    
    @Override
    protected void write(String message) {
        System.out.println("File Logger: " + message);
    }
}

class EmailLogger extends Logger {
    public EmailLogger(LogLevel level) {
        super(level);
    }
    
    @Override
    protected void write(String message) {
        System.out.println("Email Logger: " + message);
    }
}

// Usage
Logger consoleLogger = new ConsoleLogger(LogLevel.INFO);
Logger fileLogger = new FileLogger(LogLevel.DEBUG);
Logger emailLogger = new EmailLogger(LogLevel.ERROR);

// Set up the chain
consoleLogger.setNextLogger(fileLogger);
fileLogger.setNextLogger(emailLogger);

// Log messages
System.out.println("--- Logging INFO ---");
consoleLogger.logMessage(LogLevel.INFO, "This is an information.");

System.out.println("--- Logging DEBUG ---");
consoleLogger.logMessage(LogLevel.DEBUG, "This is a debug information.");

System.out.println("--- Logging ERROR ---");
consoleLogger.logMessage(LogLevel.ERROR, "This is an error information.");
```

### Approval Process Example

```java
// Purchase request class
class PurchaseRequest {
    private double amount;
    private String purpose;
    
    public PurchaseRequest(double amount, String purpose) {
        this.amount = amount;
        this.purpose = purpose;
    }
    
    public double getAmount() {
        return amount;
    }
    
    public String getPurpose() {
        return purpose;
    }
}

// Approver interface
abstract class Approver {
    protected Approver successor;
    protected String name;
    
    public Approver(String name) {
        this.name = name;
    }
    
    public void setSuccessor(Approver successor) {
        this.successor = successor;
    }
    
    public abstract void processRequest(PurchaseRequest request);
}

// Concrete approvers
class Manager extends Approver {
    private static final double APPROVAL_LIMIT = 1000.0;
    
    public Manager(String name) {
        super(name);
    }
    
    @Override
    public void processRequest(PurchaseRequest request) {
        if (request.getAmount() <= APPROVAL_LIMIT) {
            System.out.println("Manager " + name + " approved purchase request for $" 
                              + request.getAmount() + " for " + request.getPurpose());
        } else if (successor != null) {
            System.out.println("Manager " + name + " forwards request to " + successor.getClass().getSimpleName());
            successor.processRequest(request);
        } else {
            System.out.println("Request cannot be approved");
        }
    }
}

class Director extends Approver {
    private static final double APPROVAL_LIMIT = 5000.0;
    
    public Director(String name) {
        super(name);
    }
    
    @Override
    public void processRequest(PurchaseRequest request) {
        if (request.getAmount() <= APPROVAL_LIMIT) {
            System.out.println("Director " + name + " approved purchase request for $" 
                              + request.getAmount() + " for " + request.getPurpose());
        } else if (successor != null) {
            System.out.println("Director " + name + " forwards request to " + successor.getClass().getSimpleName());
            successor.processRequest(request);
        } else {
            System.out.println("Request cannot be approved");
        }
    }
}

class VicePresident extends Approver {
    private static final double APPROVAL_LIMIT = 10000.0;
    
    public VicePresident(String name) {
        super(name);
    }
    
    @Override
    public void processRequest(PurchaseRequest request) {
        if (request.getAmount() <= APPROVAL_LIMIT) {
            System.out.println("Vice President " + name + " approved purchase request for $" 
                              + request.getAmount() + " for " + request.getPurpose());
        } else if (successor != null) {
            System.out.println("Vice President " + name + " forwards request to " + successor.getClass().getSimpleName());
            successor.processRequest(request);
        } else {
            System.out.println("Request cannot be approved");
        }
    }
}

class President extends Approver {
    private static final double APPROVAL_LIMIT = 50000.0;
    
    public President(String name) {
        super(name);
    }
    
    @Override
    public void processRequest(PurchaseRequest request) {
        if (request.getAmount() <= APPROVAL_LIMIT) {
            System.out.println("President " + name + " approved purchase request for $" 
                              + request.getAmount() + " for " + request.getPurpose());
        } else if (successor != null) {
            System.out.println("President " + name + " forwards request to " + successor.getClass().getSimpleName());
            successor.processRequest(request);
        } else {
            System.out.println("Request cannot be approved - requires board approval");
        }
    }
}

// Usage
Approver manager = new Manager("John");
Approver director = new Director("Sarah");
Approver vicePresident = new VicePresident("Emily");
Approver president = new President("Michael");

// Set up the chain
manager.setSuccessor(director);
director.setSuccessor(vicePresident);
vicePresident.setSuccessor(president);

// Process purchase requests
manager.processRequest(new PurchaseRequest(800.0, "Office supplies"));
manager.processRequest(new PurchaseRequest(2500.0, "Conference room equipment"));
manager.processRequest(new PurchaseRequest(7000.0, "Company retreat"));
manager.processRequest(new PurchaseRequest(25000.0, "New server infrastructure"));
manager.processRequest(new PurchaseRequest(100000.0, "New office building"));
```

### When to Use the Chain of Responsibility Pattern

- When more than one object may handle a request, and the handler isn't known in advance
- When you want to issue a request to one of several objects without specifying the receiver explicitly
- When the set of objects that can handle a request should be specified dynamically
- When you want to avoid hardwiring the request sender to its receiver
- When the handler can be determined at runtime

### Advantages

- Reduces coupling between the sender of a request and its receivers
- Increases flexibility in assigning responsibilities to objects
- Allows adding or removing responsibilities dynamically at runtime
- Follows the Single Responsibility Principle - each handler performs a single task
- Follows the Open/Closed Principle - new handlers can be added without breaking existing code

### Disadvantages

- No guarantee that a request will be handled - it might fall off the end of the chain
- Can be hard to observe and debug the runtime characteristics
- May lead to poor performance if the chain is too long
- Can lead to circular references if not implemented carefully
- May result in sender having no feedback if a request wasn't handled 

## Command Pattern

The Command pattern encapsulates a request as an object, thereby allowing you to parameterize clients with different requests, queue or log requests, and support undoable operations.

### Intent

- Encapsulate a request as an object
- Allow the parameterization of clients with different requests
- Allow saving requests in a queue
- Support undoable operations
- Structure a system around high-level operations built on primitive operations

### Implementation

```java
// Command interface
interface Command {
    void execute();
}

// Receiver class
class Light {
    private boolean isOn = false;
    
    public void turnOn() {
        isOn = true;
        System.out.println("Light is ON");
    }
    
    public void turnOff() {
        isOn = false;
        System.out.println("Light is OFF");
    }
}

// Concrete commands
class LightOnCommand implements Command {
    private Light light;
    
    public LightOnCommand(Light light) {
        this.light = light;
    }
    
    @Override
    public void execute() {
        light.turnOn();
    }
}

class LightOffCommand implements Command {
    private Light light;
    
    public LightOffCommand(Light light) {
        this.light = light;
    }
    
    @Override
    public void execute() {
        light.turnOff();
    }
}

// Invoker
class RemoteControl {
    private Command command;
    
    public void setCommand(Command command) {
        this.command = command;
    }
    
    public void pressButton() {
        command.execute();
    }
}

// Client code
Light livingRoomLight = new Light();

Command livingRoomLightOn = new LightOnCommand(livingRoomLight);
Command livingRoomLightOff = new LightOffCommand(livingRoomLight);

RemoteControl remote = new RemoteControl();

// Turn on the light
remote.setCommand(livingRoomLightOn);
remote.pressButton();

// Turn off the light
remote.setCommand(livingRoomLightOff);
remote.pressButton();
```

### Undoable Commands

```java
// Command interface with undo capability
interface UndoableCommand {
    void execute();
    void undo();
}

// Receiver class
class TV {
    private boolean isOn = false;
    private int volume = 0;
    
    public void turnOn() {
        isOn = true;
        System.out.println("TV is ON");
    }
    
    public void turnOff() {
        isOn = false;
        System.out.println("TV is OFF");
    }
    
    public void setVolume(int volume) {
        this.volume = volume;
        System.out.println("TV volume set to " + volume);
    }
    
    public int getVolume() {
        return volume;
    }
    
    public boolean isOn() {
        return isOn;
    }
}

// Concrete commands
class TVOnCommand implements UndoableCommand {
    private TV tv;
    private boolean previousState;
    
    public TVOnCommand(TV tv) {
        this.tv = tv;
    }
    
    @Override
    public void execute() {
        previousState = tv.isOn();
        tv.turnOn();
    }
    
    @Override
    public void undo() {
        if (!previousState) {
            tv.turnOff();
        }
    }
}

class TVOffCommand implements UndoableCommand {
    private TV tv;
    private boolean previousState;
    
    public TVOffCommand(TV tv) {
        this.tv = tv;
    }
    
    @Override
    public void execute() {
        previousState = tv.isOn();
        tv.turnOff();
    }
    
    @Override
    public void undo() {
        if (previousState) {
            tv.turnOn();
        }
    }
}

class TVVolumeCommand implements UndoableCommand {
    private TV tv;
    private int previousVolume;
    private int newVolume;
    
    public TVVolumeCommand(TV tv, int newVolume) {
        this.tv = tv;
        this.newVolume = newVolume;
    }
    
    @Override
    public void execute() {
        previousVolume = tv.getVolume();
        tv.setVolume(newVolume);
    }
    
    @Override
    public void undo() {
        tv.setVolume(previousVolume);
    }
}

// Remote control with undo capability
class RemoteControlWithUndo {
    private UndoableCommand command;
    private UndoableCommand lastCommand;
    
    public void setCommand(UndoableCommand command) {
        this.command = command;
    }
    
    public void pressButton() {
        command.execute();
        lastCommand = command;
    }
    
    public void pressUndoButton() {
        if (lastCommand != null) {
            lastCommand.undo();
        }
    }
}

// Usage
TV tv = new TV();

UndoableCommand tvOn = new TVOnCommand(tv);
UndoableCommand tvOff = new TVOffCommand(tv);
UndoableCommand tvVolume10 = new TVVolumeCommand(tv, 10);
UndoableCommand tvVolume20 = new TVVolumeCommand(tv, 20);

RemoteControlWithUndo remote = new RemoteControlWithUndo();

// Turn on the TV
remote.setCommand(tvOn);
remote.pressButton();

// Change volume to 10
remote.setCommand(tvVolume10);
remote.pressButton();

// Change volume to 20
remote.setCommand(tvVolume20);
remote.pressButton();

// Undo volume change (back to 10)
remote.pressUndoButton();

// Turn off the TV
remote.setCommand(tvOff);
remote.pressButton();

// Undo turning off (back to on)
remote.pressUndoButton();
```

### Macro Commands

```java
// Command interface
interface Command {
    void execute();
}

// Receiver classes
class Light {
    private String location;
    
    public Light(String location) {
        this.location = location;
    }
    
    public void turnOn() {
        System.out.println(location + " light is ON");
    }
    
    public void turnOff() {
        System.out.println(location + " light is OFF");
    }
}

class Stereo {
    private String location;
    
    public Stereo(String location) {
        this.location = location;
    }
    
    public void on() {
        System.out.println(location + " stereo is ON");
    }
    
    public void off() {
        System.out.println(location + " stereo is OFF");
    }
    
    public void setCD() {
        System.out.println(location + " stereo is set to CD mode");
    }
    
    public void setVolume(int volume) {
        System.out.println(location + " stereo volume is set to " + volume);
    }
}

// Concrete commands
class LightOnCommand implements Command {
    private Light light;
    
    public LightOnCommand(Light light) {
        this.light = light;
    }
    
    @Override
    public void execute() {
        light.turnOn();
    }
}

class LightOffCommand implements Command {
    private Light light;
    
    public LightOffCommand(Light light) {
        this.light = light;
    }
    
    @Override
    public void execute() {
        light.turnOff();
    }
}

class StereoOnWithCDCommand implements Command {
    private Stereo stereo;
    
    public StereoOnWithCDCommand(Stereo stereo) {
        this.stereo = stereo;
    }
    
    @Override
    public void execute() {
        stereo.on();
        stereo.setCD();
        stereo.setVolume(11);
    }
}

class StereoOffCommand implements Command {
    private Stereo stereo;
    
    public StereoOffCommand(Stereo stereo) {
        this.stereo = stereo;
    }
    
    @Override
    public void execute() {
        stereo.off();
    }
}

// Macro command
class MacroCommand implements Command {
    private Command[] commands;
    
    public MacroCommand(Command[] commands) {
        this.commands = commands;
    }
    
    @Override
    public void execute() {
        for (Command command : commands) {
            command.execute();
        }
    }
}

// Invoker
class RemoteControl {
    private Command[] onCommands;
    private Command[] offCommands;
    
    public RemoteControl() {
        onCommands = new Command[7];
        offCommands = new Command[7];
        
        Command noCommand = new NoCommand();
        for (int i = 0; i < 7; i++) {
            onCommands[i] = noCommand;
            offCommands[i] = noCommand;
        }
    }
    
    public void setCommand(int slot, Command onCommand, Command offCommand) {
        onCommands[slot] = onCommand;
        offCommands[slot] = offCommand;
    }
    
    public void onButtonPushed(int slot) {
        onCommands[slot].execute();
    }
    
    public void offButtonPushed(int slot) {
        offCommands[slot].execute();
    }
    
    public String toString() {
        StringBuffer stringBuff = new StringBuffer();
        stringBuff.append("\n------ Remote Control -------\n");
        for (int i = 0; i < onCommands.length; i++) {
            stringBuff.append("[slot " + i + "] " + onCommands[i].getClass().getName()
                + "    " + offCommands[i].getClass().getName() + "\n");
        }
        return stringBuff.toString();
    }
}

// NoCommand - Null Object Pattern to avoid null checks
class NoCommand implements Command {
    @Override
    public void execute() {
        // Do nothing
    }
}

// Client code
RemoteControl remoteControl = new RemoteControl();

Light livingRoomLight = new Light("Living Room");
Light kitchenLight = new Light("Kitchen");
Stereo stereo = new Stereo("Living Room");

LightOnCommand livingRoomLightOn = new LightOnCommand(livingRoomLight);
LightOffCommand livingRoomLightOff = new LightOffCommand(livingRoomLight);
LightOnCommand kitchenLightOn = new LightOnCommand(kitchenLight);
LightOffCommand kitchenLightOff = new LightOffCommand(kitchenLight);

StereoOnWithCDCommand stereoOnWithCD = new StereoOnWithCDCommand(stereo);
StereoOffCommand stereoOff = new StereoOffCommand(stereo);

// Set individual commands
remoteControl.setCommand(0, livingRoomLightOn, livingRoomLightOff);
remoteControl.setCommand(1, kitchenLightOn, kitchenLightOff);
remoteControl.setCommand(2, stereoOnWithCD, stereoOff);

// Create macro commands for "Party Mode" and "Party's Over"
Command[] partyOn = { livingRoomLightOn, kitchenLightOn, stereoOnWithCD };
Command[] partyOff = { livingRoomLightOff, kitchenLightOff, stereoOff };

MacroCommand partyOnMacro = new MacroCommand(partyOn);
MacroCommand partyOffMacro = new MacroCommand(partyOff);

// Set macro commands
remoteControl.setCommand(3, partyOnMacro, partyOffMacro);

System.out.println(remoteControl);

// Using individual commands
System.out.println("--- Pushing individual buttons ---");
remoteControl.onButtonPushed(0);  // Living room light on
remoteControl.offButtonPushed(0); // Living room light off
remoteControl.onButtonPushed(1);  // Kitchen light on
remoteControl.offButtonPushed(1); // Kitchen light off
remoteControl.onButtonPushed(2);  // Stereo on with CD
remoteControl.offButtonPushed(2); // Stereo off

// Using macro commands
System.out.println("--- Pushing macro buttons ---");
System.out.println("--- Party mode ON ---");
remoteControl.onButtonPushed(3);  // All party devices on
System.out.println("--- Party mode OFF ---");
remoteControl.offButtonPushed(3); // All party devices off
```

### Command Queue and Logging

```java
// Command interface
interface Command {
    void execute();
    String getName();
}

// Receiver class
class DatabaseOperations {
    public void insert(String data) {
        System.out.println("Inserting data: " + data);
    }
    
    public void update(String data) {
        System.out.println("Updating data: " + data);
    }
    
    public void delete(String data) {
        System.out.println("Deleting data: " + data);
    }
}

// Concrete commands
class InsertCommand implements Command {
    private DatabaseOperations database;
    private String data;
    
    public InsertCommand(DatabaseOperations database, String data) {
        this.database = database;
        this.data = data;
    }
    
    @Override
    public void execute() {
        database.insert(data);
    }
    
    @Override
    public String getName() {
        return "Insert Command";
    }
}

class UpdateCommand implements Command {
    private DatabaseOperations database;
    private String data;
    
    public UpdateCommand(DatabaseOperations database, String data) {
        this.database = database;
        this.data = data;
    }
    
    @Override
    public void execute() {
        database.update(data);
    }
    
    @Override
    public String getName() {
        return "Update Command";
    }
}

class DeleteCommand implements Command {
    private DatabaseOperations database;
    private String data;
    
    public DeleteCommand(DatabaseOperations database, String data) {
        this.database = database;
        this.data = data;
    }
    
    @Override
    public void execute() {
        database.delete(data);
    }
    
    @Override
    public String getName() {
        return "Delete Command";
    }
}

// Command Queue
class CommandQueue {
    private Queue<Command> queue = new LinkedList<>();
    private List<String> commandLog = new ArrayList<>();
    
    public void addCommand(Command command) {
        queue.add(command);
        commandLog.add("Command added to queue: " + command.getName());
    }
    
    public void processCommands() {
        Command command;
        while ((command = queue.poll()) != null) {
            commandLog.add("Executing command: " + command.getName());
            command.execute();
        }
    }
    
    public void printCommandLog() {
        System.out.println("=== Command Log ===");
        for (String log : commandLog) {
            System.out.println(log);
        }
        System.out.println("===================");
    }
}

// Usage
DatabaseOperations database = new DatabaseOperations();
CommandQueue commandQueue = new CommandQueue();

// Create commands
Command insertCmd = new InsertCommand(database, "User{id=1, name='John'}");
Command updateCmd = new UpdateCommand(database, "User{id=1, name='John Doe'}");
Command deleteCmd = new DeleteCommand(database, "User{id=1}");

// Queue commands
commandQueue.addCommand(insertCmd);
commandQueue.addCommand(updateCmd);
commandQueue.addCommand(deleteCmd);

// Process all commands
commandQueue.processCommands();

// Print command log
commandQueue.printCommandLog();
```

### When to Use the Command Pattern

- When you want to parameterize objects with operations
- When you want to queue, specify, or execute requests at different times
- When you want to support undoable operations
- When you want to structure a system around high-level operations built on primitive operations
- When you need to implement callbacks
- When you want to create a history of commands executed

### Advantages

- Decouples the object that invokes the operation from the one that knows how to perform it
- Allows creating composite commands (macros)
- Makes it easy to add new commands without changing existing code
- Supports undo/redo operations
- Allows storing command history for logging and debugging
- Enables deferred execution of commands

### Disadvantages

- Increases the number of classes for each individual command
- May lead to an excessive number of command classes
- Complicates the code if there are many commands with complex execution logic
- Not suitable for simple operations where the command pattern overhead is not justified

## Interpreter Pattern

The Interpreter pattern is used to define a grammatical representation of a language. It's used to interpret sentences in the language.

### Intent

- Define a grammatical representation of a language
- Interpret sentences in the language
- Structure a system around a language

### Implementation

```java
// Expression interface
interface Expression {
    boolean interpret(String context);
}

// Concrete expressions
class TerminalExpression implements Expression {
    private String data;
    
    public TerminalExpression(String data) {
        this.data = data;
    }
    
    @Override
    public boolean interpret(String context) {
        return context.contains(data);
    }
}

class OrExpression implements Expression {
    private Expression expr1;
    private Expression expr2;
    
    public OrExpression(Expression expr1, Expression expr2) {
        this.expr1 = expr1;
        this.expr2 = expr2;
    }
    
    @Override
    public boolean interpret(String context) {
        return expr1.interpret(context) || expr2.interpret(context);
    }
}

class AndExpression implements Expression {
    private Expression expr1;
    private Expression expr2;
    
    public AndExpression(Expression expr1, Expression expr2) {
        this.expr1 = expr1;
        this.expr2 = expr2;
    }
    
    @Override
    public boolean interpret(String context) {
        return expr1.interpret(context) && expr2.interpret(context);
    }
}

// Usage
Expression isMale = getMaleExpression();
Expression isMarriedWoman = getMarriedWomanExpression();

System.out.println("John is male? " + isMale.interpret("John"));
System.out.println("Julie is a married woman? " + isMarriedWoman.interpret("Married Julie"));
```

### When to Use the Interpreter Pattern

- When you want to define a grammar and interpret sentences in the language
- When you want to structure a system around a language
- When you want to implement a domain-specific language

### Advantages

- Increases flexibility in adding new expressions
- Increases flexibility in adding new types of expressions
- Increases flexibility in adding new types of interpreters
- Increases flexibility in adding new types of clients
- Increases flexibility in adding new types of expressions

### Disadvantages

- Increases the number of classes for each individual expression
- May lead to an excessive number of expression classes
- Complicates the code if there are many expressions with complex execution logic
- Not suitable for simple operations where the interpreter pattern overhead is not justified

## Iterator Pattern

The Iterator pattern provides a way to access the elements of an aggregate object sequentially without exposing its underlying representation.

### Intent

- Provide a way to access elements of a collection sequentially without exposing the underlying representation
- Allow traversing different collections in a standard way
- Separate the collection's traversal mechanism from its implementation
- Enable multiple traversals of the same collection simultaneously

### Implementation

```java
import java.util.ArrayList;
import java.util.List;

// Iterator interface
interface Iterator<T> {
    boolean hasNext();
    T next();
}

// Collection interface
interface Collection<T> {
    Iterator<T> createIterator();
}

// Concrete Iterator
class ConcreteIterator<T> implements Iterator<T> {
    private List<T> items;
    private int position = 0;
    
    public ConcreteIterator(List<T> items) {
        this.items = items;
    }
    
    @Override
    public boolean hasNext() {
        return position < items.size();
    }
    
    @Override
    public T next() {
        if (!hasNext()) {
            return null;
        }
        return items.get(position++);
    }
}

// Concrete Collection
class ConcreteCollection<T> implements Collection<T> {
    private List<T> items = new ArrayList<>();
    
    public void addItem(T item) {
        items.add(item);
    }
    
    @Override
    public Iterator<T> createIterator() {
        return new ConcreteIterator<>(items);
    }
}

// Client code
Collection<String> collection = new ConcreteCollection<>();
collection.addItem("Item 1");
collection.addItem("Item 2");
collection.addItem("Item 3");

Iterator<String> iterator = collection.createIterator();
while (iterator.hasNext()) {
    String item = iterator.next();
    System.out.println(item);
}
```

### Custom Collection Example

```java
// Book class
class Book {
    private String title;
    private String author;
    
    public Book(String title, String author) {
        this.title = title;
        this.author = author;
    }
    
    public String getTitle() {
        return title;
    }
    
    public String getAuthor() {
        return author;
    }
    
    @Override
    public String toString() {
        return "Book: " + title + " by " + author;
    }
}

// Iterator interface
interface BookIterator {
    boolean hasNext();
    Book next();
}

// Collection interface
interface BookCollection {
    BookIterator createIterator();
}

// Concrete collection - Library
class Library implements BookCollection {
    private Book[] books;
    
    public Library(Book[] books) {
        this.books = books;
    }
    
    @Override
    public BookIterator createIterator() {
        return new LibraryIterator(books);
    }
    
    // Concrete iterator
    private class LibraryIterator implements BookIterator {
        private Book[] books;
        private int position = 0;
        
        public LibraryIterator(Book[] books) {
            this.books = books;
        }
        
        @Override
        public boolean hasNext() {
            return position < books.length && books[position] != null;
        }
        
        @Override
        public Book next() {
            if (!hasNext()) {
                return null;
            }
            return books[position++];
        }
    }
}

// Another concrete collection - BookShelf
class BookShelf implements BookCollection {
    private List<Book> books = new ArrayList<>();
    
    public void addBook(Book book) {
        books.add(book);
    }
    
    @Override
    public BookIterator createIterator() {
        return new BookShelfIterator();
    }
    
    // Concrete iterator
    private class BookShelfIterator implements BookIterator {
        private int position = 0;
        
        @Override
        public boolean hasNext() {
            return position < books.size();
        }
        
        @Override
        public Book next() {
            if (!hasNext()) {
                return null;
            }
            return books.get(position++);
        }
    }
}

// Client code
Book[] libraryBooks = new Book[3];
libraryBooks[0] = new Book("Design Patterns", "Gang of Four");
libraryBooks[1] = new Book("Clean Code", "Robert C. Martin");
libraryBooks[2] = new Book("Refactoring", "Martin Fowler");

Library library = new Library(libraryBooks);
BookIterator libraryIterator = library.createIterator();

System.out.println("=== Library Books ===");
while (libraryIterator.hasNext()) {
    Book book = libraryIterator.next();
    System.out.println(book);
}

BookShelf bookShelf = new BookShelf();
bookShelf.addBook(new Book("The Pragmatic Programmer", "Andrew Hunt"));
bookShelf.addBook(new Book("Head First Design Patterns", "Eric Freeman"));

BookIterator bookShelfIterator = bookShelf.createIterator();

System.out.println("\n=== Bookshelf Books ===");
while (bookShelfIterator.hasNext()) {
    Book book = bookShelfIterator.next();
    System.out.println(book);
}
```

### Java's Built-in Iterators

Java's Collection Framework implements the Iterator pattern:

```java
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

// Using Java's built-in iterator
List<String> items = new ArrayList<>();
items.add("Item A");
items.add("Item B");
items.add("Item C");

// Get the iterator
Iterator<String> iterator = items.iterator();

// Traverse using the iterator
while (iterator.hasNext()) {
    String item = iterator.next();
    System.out.println(item);
}

// Java's for-each loop uses iterators behind the scenes
for (String item : items) {
    System.out.println(item);
}

// The iterator can also remove elements during traversal
iterator = items.iterator();
while (iterator.hasNext()) {
    String item = iterator.next();
    if (item.equals("Item B")) {
        iterator.remove();
    }
}

System.out.println("After removal: " + items);
```

### Internal Iterator vs. External Iterator

```java
// External Iterator (Traditional)
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
Iterator<Integer> iterator = numbers.iterator();

int sum = 0;
while (iterator.hasNext()) {
    sum += iterator.next();
}
System.out.println("Sum using external iterator: " + sum);

// Internal Iterator (Java 8+)
int sum2 = numbers.stream().mapToInt(Integer::intValue).sum();
System.out.println("Sum using internal iterator: " + sum2);

// Another internal iterator example with forEach
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
names.forEach(name -> System.out.println("Hello, " + name));
```

### When to Use the Iterator Pattern

- When you want to access a collection's contents without exposing its internal structure
- When you want to support multiple traversals of a collection
- When you want to provide a uniform interface for traversing different collection types
- When you want to separate traversal behavior from the collection's implementation
- When you need different traversal algorithms for the same collection

### Advantages

- Simplifies the interface of a collection
- Supports variations in traversal of a collection
- Provides a uniform way to traverse different collections
- Allows multiple iterators on the same collection to be active simultaneously
- Separates the traversal algorithm from the collection implementation
- Follows the Single Responsibility Principle by separating collection and traversal logic

### Disadvantages

- Can complicate the code for simple collections
- May not be as efficient as direct access for some collections
- Can be an overkill for simple, single-purpose data structures
- Iterator can get out of sync if the collection is modified during iteration
- Implementing iterators for complex collections can be challenging

## Mediator Pattern

The Mediator pattern is used to reduce communication complexity between multiple objects. It's used to centralize communication between objects.

### Intent

- Reduce communication complexity between multiple objects
- Centralize communication between objects
- Structure a system around a set of objects

### Implementation

```java
// Mediator interface
interface Mediator {
    void send(String message, Colleague colleague);
}

// Colleague interface
interface Colleague {
    void send(String message);
    void receive(String message);
}

// Concrete mediator
class ConcreteMediator implements Mediator {
    private List<Colleague> colleagues = new ArrayList<>();
    
    public void addColleague(Colleague colleague) {
        colleagues.add(colleague);
    }
    
    @Override
    public void send(String message, Colleague colleague) {
        for (Colleague c : colleagues) {
            if (c != colleague) {
                c.receive(message);
            }
        }
    }
}

// Concrete colleagues
class ConcreteColleague implements Colleague {
    private Mediator mediator;
    
    public ConcreteColleague(Mediator mediator) {
        this.mediator = mediator;
    }
    
    @Override
    public void send(String message) {
        mediator.send(message, this);
    }
    
    @Override
    public void receive(String message) {
        System.out.println("Received message: " + message);
    }
}

// Usage
Mediator mediator = new ConcreteMediator();
Colleague colleague1 = new ConcreteColleague(mediator);
Colleague colleague2 = new ConcreteColleague(mediator);
Colleague colleague3 = new ConcreteColleague(mediator);

mediator.addColleague(colleague1);
mediator.addColleague(colleague2);
mediator.addColleague(colleague3);

colleague1.send("Hello from colleague 1");
colleague2.send("Hello from colleague 2");
colleague3.send("Hello from colleague 3");
```

### When to Use the Mediator Pattern

- When you want to reduce communication complexity between multiple objects
- When you want to centralize communication between objects
- When you want to structure a system around a set of objects

### Advantages

- Increases flexibility in adding new types of colleagues
- Increases flexibility in adding new types of mediators
- Increases flexibility in adding new types of clients
- Increases flexibility in adding new types of messages

### Disadvantages

- Increases the number of classes for each individual colleague
- May lead to an excessive number of colleague classes
- Complicates the code if there are many colleagues with complex execution logic
- Not suitable for simple operations where the mediator pattern overhead is not justified

## Memento Pattern

The Memento pattern is used to restore an object to its previous state. It's used to implement undoable operations.

### Intent

- Restore an object to its previous state
- Implement undoable operations
- Structure a system around a set of objects

### Implementation

```java
// Memento interface
interface Memento {
    void restore();
}

// Originator interface
interface Originator {
    Memento createMemento();
}

// Concrete originator
class ConcreteOriginator implements Originator {
    private String state;
    
    public void setState(String state) {
        this.state = state;
    }
    
    public String getState() {
        return state;
    }
    
    @Override
    public Memento createMemento() {
        return new ConcreteMemento(state);
    }
}

// Concrete memento
class ConcreteMemento implements Memento {
    private String state;
    
    public ConcreteMemento(String state) {
        this.state = state;
    }
    
    @Override
    public void restore() {
        // Restore state
    }
}

// Caretaker
class Caretaker {
    private List<Memento> mementos = new ArrayList<>();
    
    public void addMemento(Memento memento) {
        mementos.add(memento);
    }
    
    public Memento getMemento(int index) {
        return mementos.get(index);
    }
}

// Usage
Originator originator = new ConcreteOriginator();
originator.setState("State 1");

Memento memento = originator.createMemento();

Caretaker caretaker = new Caretaker();
caretaker.addMemento(memento);

originator.setState("State 2");

originator.restore(caretaker.getMemento(0));
```

### When to Use the Memento Pattern

- When you want to restore an object to its previous state
- When you want to implement undoable operations
- When you want to structure a system around a set of objects

### Advantages

- Increases flexibility in adding new types of originators
- Increases flexibility in adding new types of mementos
- Increases flexibility in adding new types of caretakers
- Increases flexibility in adding new types of states

### Disadvantages

- Increases the number of classes for each individual memento
- May lead to an excessive number of memento classes
- Complicates the code if there are many mementos with complex execution logic
- Not suitable for simple operations where the memento pattern overhead is not justified

## Observer Pattern

The Observer pattern defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.

### Intent

- Define a one-to-many dependency between objects
- Notify and update all dependent objects automatically when the subject changes state
- Keep objects loosely coupled
- Support broadcast communication
- Provide a mechanism for event handling

### Implementation

```java
import java.util.ArrayList;
import java.util.List;

// Subject interface
interface Subject {
    void registerObserver(Observer observer);
    void removeObserver(Observer observer);
    void notifyObservers();
}

// Observer interface
interface Observer {
    void update(float temperature, float humidity, float pressure);
}

// Display interface
interface DisplayElement {
    void display();
}

// Concrete Subject
class WeatherData implements Subject {
    private List<Observer> observers;
    private float temperature;
    private float humidity;
    private float pressure;
    
    public WeatherData() {
        observers = new ArrayList<>();
    }
    
    @Override
    public void registerObserver(Observer observer) {
        observers.add(observer);
    }
    
    @Override
    public void removeObserver(Observer observer) {
        int index = observers.indexOf(observer);
        if (index >= 0) {
            observers.remove(index);
        }
    }
    
    @Override
    public void notifyObservers() {
        for (Observer observer : observers) {
            observer.update(temperature, humidity, pressure);
        }
    }
    
    public void measurementsChanged() {
        notifyObservers();
    }
    
    public void setMeasurements(float temperature, float humidity, float pressure) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.pressure = pressure;
        measurementsChanged();
    }
}

// Concrete Observer
class CurrentConditionsDisplay implements Observer, DisplayElement {
    private float temperature;
    private float humidity;
    private Subject weatherData;
    
    public CurrentConditionsDisplay(Subject weatherData) {
        this.weatherData = weatherData;
        weatherData.registerObserver(this);
    }
    
    @Override
    public void update(float temperature, float humidity, float pressure) {
        this.temperature = temperature;
        this.humidity = humidity;
        display();
    }
    
    @Override
    public void display() {
        System.out.println("Current conditions: " + temperature 
            + "F degrees and " + humidity + "% humidity");
    }
}

class StatisticsDisplay implements Observer, DisplayElement {
    private float maxTemp = 0.0f;
    private float minTemp = 200.0f;
    private float tempSum = 0.0f;
    private int numReadings = 0;
    private Subject weatherData;
    
    public StatisticsDisplay(Subject weatherData) {
        this.weatherData = weatherData;
        weatherData.registerObserver(this);
    }
    
    @Override
    public void update(float temperature, float humidity, float pressure) {
        tempSum += temperature;
        numReadings++;
        
        if (temperature > maxTemp) {
            maxTemp = temperature;
        }
        
        if (temperature < minTemp) {
            minTemp = temperature;
        }
        
        display();
    }
    
    @Override
    public void display() {
        System.out.println("Avg/Max/Min temperature = " + (tempSum / numReadings)
            + "/" + maxTemp + "/" + minTemp);
    }
}

// Client code
WeatherData weatherData = new WeatherData();

CurrentConditionsDisplay currentDisplay = new CurrentConditionsDisplay(weatherData);
StatisticsDisplay statisticsDisplay = new StatisticsDisplay(weatherData);

weatherData.setMeasurements(80, 65, 30.4f);
weatherData.setMeasurements(82, 70, 29.2f);
weatherData.setMeasurements(78, 90, 29.2f);
```

### Push vs. Pull Model

#### Push Model (previous example):
The subject pushes all data to observers.

#### Pull Model:
Observers pull only the data they need from the subject.

```java
// Subject interface
interface Subject {
    void registerObserver(Observer observer);
    void removeObserver(Observer observer);
    void notifyObservers();
    // Methods for observers to pull data as needed
    float getTemperature();
    float getHumidity();
    float getPressure();
}

// Observer interface
interface Observer {
    void update();  // No parameters - observers will pull data
}

// Concrete Subject
class WeatherData implements Subject {
    private List<Observer> observers;
    private float temperature;
    private float humidity;
    private float pressure;
    
    public WeatherData() {
        observers = new ArrayList<>();
    }
    
    @Override
    public void registerObserver(Observer observer) {
        observers.add(observer);
    }
    
    @Override
    public void removeObserver(Observer observer) {
        int index = observers.indexOf(observer);
        if (index >= 0) {
            observers.remove(index);
        }
    }
    
    @Override
    public void notifyObservers() {
        for (Observer observer : observers) {
            observer.update();  // Just notify, let observers pull data
        }
    }
    
    @Override
    public float getTemperature() {
        return temperature;
    }
    
    @Override
    public float getHumidity() {
        return humidity;
    }
    
    @Override
    public float getPressure() {
        return pressure;
    }
    
    public void measurementsChanged() {
        notifyObservers();
    }
    
    public void setMeasurements(float temperature, float humidity, float pressure) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.pressure = pressure;
        measurementsChanged();
    }
}

// Concrete Observer with Pull model
class CurrentConditionsDisplay implements Observer, DisplayElement {
    private float temperature;
    private float humidity;
    private Subject weatherData;
    
    public CurrentConditionsDisplay(Subject weatherData) {
        this.weatherData = weatherData;
        weatherData.registerObserver(this);
    }
    
    @Override
    public void update() {
        // Pull only the data we need
        this.temperature = weatherData.getTemperature();
        this.humidity = weatherData.getHumidity();
        display();
    }
    
    @Override
    public void display() {
        System.out.println("Current conditions: " + temperature 
            + "F degrees and " + humidity + "% humidity");
    }
}

// Only pull temperature for this display
class TemperatureDisplay implements Observer, DisplayElement {
    private float temperature;
    private Subject weatherData;
    
    public TemperatureDisplay(Subject weatherData) {
        this.weatherData = weatherData;
        weatherData.registerObserver(this);
    }
    
    @Override
    public void update() {
        // Only pull temperature - we don't need other data
        this.temperature = weatherData.getTemperature();
        display();
    }
    
    @Override
    public void display() {
        System.out.println("Current temperature: " + temperature + "F degrees");
    }
}
```

### Java's Built-in Observer Pattern

Java includes built-in support for the Observer pattern through `java.util.Observable` (Subject) and `java.util.Observer` (Observer) - note that these are now deprecated since Java 9.

```java
import java.util.Observable;
import java.util.Observer;

// Using Java's built-in Observable
class WeatherData extends Observable {
    private float temperature;
    private float humidity;
    private float pressure;
    
    public WeatherData() { }
    
    public void measurementsChanged() {
        setChanged();  // Indicate state has changed
        notifyObservers();  // Notify all observers
    }
    
    public void setMeasurements(float temperature, float humidity, float pressure) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.pressure = pressure;
        measurementsChanged();
    }
    
    public float getTemperature() {
        return temperature;
    }
    
    public float getHumidity() {
        return humidity;
    }
    
    public float getPressure() {
        return pressure;
    }
}

// Observer using Java's built-in Observer interface
class CurrentConditionsDisplay implements Observer, DisplayElement {
    private float temperature;
    private float humidity;
    private Observable observable;
    
    public CurrentConditionsDisplay(Observable observable) {
        this.observable = observable;
        observable.addObserver(this);
    }
    
    @Override
    public void update(Observable obs, Object arg) {
        if (obs instanceof WeatherData) {
            WeatherData weatherData = (WeatherData) obs;
            this.temperature = weatherData.getTemperature();
            this.humidity = weatherData.getHumidity();
            display();
        }
    }
    
    @Override
    public void display() {
        System.out.println("Current conditions: " + temperature 
            + "F degrees and " + humidity + "% humidity");
    }
}

// Note: Both Observable and Observer are now deprecated as of Java 9
```

### Event Listeners in Java

Modern Java applications often use event listeners, which implement the Observer pattern:

```java
import java.awt.Button;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

// Button is the subject, ActionListener is the observer
Button button = new Button("Click Me");

// Adding an observer using anonymous class
button.addActionListener(new ActionListener() {
    @Override
    public void actionPerformed(ActionEvent e) {
        System.out.println("Button clicked!");
    }
});

// Using lambda (Java 8+)
button.addActionListener(e -> System.out.println("Button clicked!"));
```

### Custom Event System Example

```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// Event class
class Event {
    private String type;
    private Object source;
    private Map<String, Object> data;
    
    public Event(String type, Object source) {
        this.type = type;
        this.source = source;
        this.data = new HashMap<>();
    }
    
    public String getType() {
        return type;
    }
    
    public Object getSource() {
        return source;
    }
    
    public void setData(String key, Object value) {
        data.put(key, value);
    }
    
    public Object getData(String key) {
        return data.get(key);
    }
    
    @Override
    public String toString() {
        return "Event{type='" + type + "', source=" + source + ", data=" + data + '}';
    }
}

// Event Listener interface
interface EventListener {
    void onEvent(Event event);
}

// Event Publisher interface
interface EventPublisher {
    void addListener(String eventType, EventListener listener);
    void removeListener(String eventType, EventListener listener);
    void notifyListeners(Event event);
}

// Concrete Event Publisher
class EventManager implements EventPublisher {
    private Map<String, List<EventListener>> listeners = new HashMap<>();
    
    @Override
    public void addListener(String eventType, EventListener listener) {
        listeners.computeIfAbsent(eventType, k -> new ArrayList<>()).add(listener);
    }
    
    @Override
    public void removeListener(String eventType, EventListener listener) {
        if (listeners.containsKey(eventType)) {
            listeners.get(eventType).remove(listener);
        }
    }
    
    @Override
    public void notifyListeners(Event event) {
        if (listeners.containsKey(event.getType())) {
            for (EventListener listener : listeners.get(event.getType())) {
                listener.onEvent(event);
            }
        }
    }
}

// Example user class that publishes events
class User {
    private String name;
    private EventPublisher eventPublisher;
    
    public User(String name, EventPublisher eventPublisher) {
        this.name = name;
        this.eventPublisher = eventPublisher;
    }
    
    public void login() {
        System.out.println(name + " logged in");
        Event loginEvent = new Event("login", this);
        loginEvent.setData("username", name);
        loginEvent.setData("time", System.currentTimeMillis());
        eventPublisher.notifyListeners(loginEvent);
    }
    
    public void logout() {
        System.out.println(name + " logged out");
        Event logoutEvent = new Event("logout", this);
        logoutEvent.setData("username", name);
        logoutEvent.setData("time", System.currentTimeMillis());
        eventPublisher.notifyListeners(logoutEvent);
    }
    
    public String getName() {
        return name;
    }
}

// Event listeners
class SecurityMonitor implements EventListener {
    @Override
    public void onEvent(Event event) {
        String username = (String) event.getData("username");
        long time = (long) event.getData("time");
        
        System.out.println("Security: " + username + " " + event.getType() + 
                          " at " + new java.util.Date(time));
    }
}

class UserActivityLogger implements EventListener {
    @Override
    public void onEvent(Event event) {
        String username = (String) event.getData("username");
        System.out.println("Logging: " + event.getType() + " event for user " + username);
    }
}

// Usage
EventManager eventManager = new EventManager();

// Create listeners
SecurityMonitor securityMonitor = new SecurityMonitor();
UserActivityLogger activityLogger = new UserActivityLogger();

// Register listeners for different events
eventManager.addListener("login", securityMonitor);
eventManager.addListener("logout", securityMonitor);
eventManager.addListener("login", activityLogger);

// Create a user that publishes events
User user = new User("John", eventManager);

// Trigger events
user.login();
user.logout();
```

### When to Use the Observer Pattern

- When a change to one object requires changing others, and you don't know how many objects need to change
- When an object should be able to notify others without making assumptions about who they are
- When you need one-to-many dependencies between objects without tight coupling
- When you need to implement a reactive system
- When you're building an event handling system

### Advantages

- Supports loose coupling between the subject and observers
- Allows sending data to multiple objects with minimal effort
- Enables dynamic relationships between objects at runtime
- Makes it easy to add new observers without modifying the subject
- Follows the Open/Closed Principle
- Establishes relationships between objects at runtime

### Disadvantages

- Observers are notified in random order
- If not implemented carefully, can lead to memory leaks (observers need to be properly deregistered)
- Can cause unexpected updates when cascading changes occur
- May create performance issues with many observers or complex dependency relationships
- Can become hard to debug or understand due to indirect relationships

## State Pattern

The State pattern is used to allow an object to change its behavior when its state changes. It's used to implement state machines.

### Intent

- Allow an object to change its behavior when its state changes
- Implement state machines
- Structure a system around a set of objects

### Implementation

```java
// State interface
interface State {
    void handle();
}

// Concrete states
class ConcreteStateA implements State {
    @Override
    public void handle() {
        System.out.println("Handling state A");
    }
}

class ConcreteStateB implements State {
    @Override
    public void handle() {
        System.out.println("Handling state B");
    }
}

// Context
class Context {
    private State state;
    
    public void setState(State state) {
        this.state = state;
    }
    
    public void handle() {
        state.handle();
    }
}

// Usage
Context context = new Context();
context.setState(new ConcreteStateA());
context.handle();

context.setState(new ConcreteStateB());
context.handle();
```

### When to Use the State Pattern

- When you want to allow an object to change its behavior when its state changes
- When you want to implement state machines
- When you want to structure a system around a set of objects

### Advantages

- Increases flexibility in adding new types of states
- Increases flexibility in adding new types of contexts
- Increases flexibility in adding new types of clients
- Increases flexibility in adding new types of behaviors

### Disadvantages

- Increases the number of classes for each individual state
- May lead to an excessive number of state classes
- Complicates the code if there are many states with complex execution logic
- Not suitable for simple operations where the state pattern overhead is not justified

## Strategy Pattern

The Strategy pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable. It lets the algorithm vary independently from clients that use it.

### Intent

- Define a family of algorithms, encapsulate each one, and make them interchangeable
- Let the algorithm vary independently from clients that use it
- Capture the abstraction in an interface, bury implementation details in derived classes
- Enable selecting algorithms at runtime
- Provide different implementations of the same behavior

### Implementation

```java
// Strategy interface
interface PaymentStrategy {
    void pay(int amount);
}

// Concrete Strategies
class CreditCardStrategy implements PaymentStrategy {
    private String name;
    private String cardNumber;
    private String cvv;
    private String expirationDate;
    
    public CreditCardStrategy(String name, String cardNumber, String cvv, String expirationDate) {
        this.name = name;
        this.cardNumber = cardNumber;
        this.cvv = cvv;
        this.expirationDate = expirationDate;
    }
    
    @Override
    public void pay(int amount) {
        System.out.println(amount + " paid with credit card");
    }
}

class PayPalStrategy implements PaymentStrategy {
    private String email;
    private String password;
    
    public PayPalStrategy(String email, String password) {
        this.email = email;
        this.password = password;
    }
    
    @Override
    public void pay(int amount) {
        System.out.println(amount + " paid with PayPal");
    }
}

class CashStrategy implements PaymentStrategy {
    @Override
    public void pay(int amount) {
        System.out.println(amount + " paid with cash");
    }
}

// Context
class ShoppingCart {
    private PaymentStrategy paymentStrategy;
    
    public void setPaymentStrategy(PaymentStrategy paymentStrategy) {
        this.paymentStrategy = paymentStrategy;
    }
    
    public void checkout(int amount) {
        paymentStrategy.pay(amount);
    }
}

// Client code
ShoppingCart cart = new ShoppingCart();

// Pay with credit card
cart.setPaymentStrategy(new CreditCardStrategy("John Doe", "1234567890123456", "123", "12/25"));
cart.checkout(100);

// Pay with PayPal
cart.setPaymentStrategy(new PayPalStrategy("john@example.com", "password"));
cart.checkout(200);

// Pay with cash
cart.setPaymentStrategy(new CashStrategy());
cart.checkout(50);
```

### Duck Example (From "Head First Design Patterns")

```java
// Behavior interfaces
interface FlyBehavior {
    void fly();
}

interface QuackBehavior {
    void quack();
}

// Fly behavior implementations
class FlyWithWings implements FlyBehavior {
    @Override
    public void fly() {
        System.out.println("I'm flying with wings!");
    }
}

class FlyNoWay implements FlyBehavior {
    @Override
    public void fly() {
        System.out.println("I can't fly!");
    }
}

class FlyRocketPowered implements FlyBehavior {
    @Override
    public void fly() {
        System.out.println("I'm flying with a rocket!");
    }
}

// Quack behavior implementations
class Quack implements QuackBehavior {
    @Override
    public void quack() {
        System.out.println("Quack!");
    }
}

class Squeak implements QuackBehavior {
    @Override
    public void quack() {
        System.out.println("Squeak!");
    }
}

class MuteQuack implements QuackBehavior {
    @Override
    public void quack() {
        System.out.println("<< Silence >>");
    }
}

// Abstract Duck class (Context)
abstract class Duck {
    protected FlyBehavior flyBehavior;
    protected QuackBehavior quackBehavior;
    
    public Duck() {}
    
    public void setFlyBehavior(FlyBehavior flyBehavior) {
        this.flyBehavior = flyBehavior;
    }
    
    public void setQuackBehavior(QuackBehavior quackBehavior) {
        this.quackBehavior = quackBehavior;
    }
    
    public void performFly() {
        flyBehavior.fly();
    }
    
    public void performQuack() {
        quackBehavior.quack();
    }
    
    public void swim() {
        System.out.println("All ducks float, even decoys!");
    }
    
    public abstract void display();
}

// Concrete Duck classes
class MallardDuck extends Duck {
    public MallardDuck() {
        flyBehavior = new FlyWithWings();
        quackBehavior = new Quack();
    }
    
    @Override
    public void display() {
        System.out.println("I'm a mallard duck");
    }
}

class RubberDuck extends Duck {
    public RubberDuck() {
        flyBehavior = new FlyNoWay();
        quackBehavior = new Squeak();
    }
    
    @Override
    public void display() {
        System.out.println("I'm a rubber duck");
    }
}

class DecoyDuck extends Duck {
    public DecoyDuck() {
        flyBehavior = new FlyNoWay();
        quackBehavior = new MuteQuack();
    }
    
    @Override
    public void display() {
        System.out.println("I'm a decoy duck");
    }
}

class ModelDuck extends Duck {
    public ModelDuck() {
        flyBehavior = new FlyNoWay();
        quackBehavior = new Quack();
    }
    
    @Override
    public void display() {
        System.out.println("I'm a model duck");
    }
}

// Usage
Duck mallard = new MallardDuck();
mallard.display();
mallard.performQuack();
mallard.performFly();

Duck model = new ModelDuck();
model.display();
model.performFly();
// Change behavior at runtime
model.setFlyBehavior(new FlyRocketPowered());
model.performFly();
```

### Sorting Strategy Example

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

// Strategy interface
interface SortingStrategy<T> {
    void sort(List<T> items);
}

// Concrete strategies
class BubbleSortStrategy<T extends Comparable<T>> implements SortingStrategy<T> {
    @Override
    public void sort(List<T> items) {
        System.out.println("Bubble sort");
        int n = items.size();
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (items.get(j).compareTo(items.get(j + 1)) > 0) {
                    // Swap elements
                    T temp = items.get(j);
                    items.set(j, items.get(j + 1));
                    items.set(j + 1, temp);
                }
            }
        }
    }
}

class QuickSortStrategy<T extends Comparable<T>> implements SortingStrategy<T> {
    @Override
    public void sort(List<T> items) {
        System.out.println("Quick sort");
        // For simplicity, using Java's built-in sort method to simulate quick sort
        Collections.sort(items);
    }
}

class MergeSortStrategy<T extends Comparable<T>> implements SortingStrategy<T> {
    @Override
    public void sort(List<T> items) {
        System.out.println("Merge sort");
        // For simplicity, using Java's built-in sort method with a custom comparator
        Collections.sort(items, Comparator.naturalOrder());
    }
}

// Context
class Sorter<T extends Comparable<T>> {
    private SortingStrategy<T> strategy;
    
    public void setStrategy(SortingStrategy<T> strategy) {
        this.strategy = strategy;
    }
    
    public void sort(List<T> items) {
        if (strategy == null) {
            throw new IllegalStateException("Sorting strategy not set");
        }
        strategy.sort(items);
    }
}

// Usage
List<Integer> numbers = new ArrayList<>();
numbers.add(5);
numbers.add(1);
numbers.add(9);
numbers.add(3);
numbers.add(7);

Sorter<Integer> sorter = new Sorter<>();

// Use bubble sort
sorter.setStrategy(new BubbleSortStrategy<>());
sorter.sort(numbers);
System.out.println("Bubble sort result: " + numbers);

// Scramble the list again
Collections.shuffle(numbers);
System.out.println("Shuffled list: " + numbers);

// Use quick sort
sorter.setStrategy(new QuickSortStrategy<>());
sorter.sort(numbers);
System.out.println("Quick sort result: " + numbers);

// Scramble the list again
Collections.shuffle(numbers);
System.out.println("Shuffled list: " + numbers);

// Use merge sort
sorter.setStrategy(new MergeSortStrategy<>());
sorter.sort(numbers);
System.out.println("Merge sort result: " + numbers);
```

### Strategy vs. State Pattern

While the Strategy and State patterns have similar structures, they solve different problems:

```java
// Strategy Pattern (Algorithm variation)
interface CompressionStrategy {
    void compress(String filename);
}

class ZipCompressionStrategy implements CompressionStrategy {
    @Override
    public void compress(String filename) {
        System.out.println("Compressing " + filename + " using ZIP compression");
    }
}

class RarCompressionStrategy implements CompressionStrategy {
    @Override
    public void compress(String filename) {
        System.out.println("Compressing " + filename + " using RAR compression");
    }
}

class Compressor {
    private CompressionStrategy strategy;
    
    public void setCompressionStrategy(CompressionStrategy strategy) {
        this.strategy = strategy;
    }
    
    public void compress(String filename) {
        if (strategy == null) {
            throw new IllegalStateException("Compression strategy not set");
        }
        strategy.compress(filename);
    }
}

// State Pattern (State transitions)
interface State {
    void handle(Document document);
}

class DraftState implements State {
    @Override
    public void handle(Document document) {
        System.out.println("Document is in DRAFT state");
        document.setState(new ModeratedState());
    }
}

class ModeratedState implements State {
    @Override
    public void handle(Document document) {
        System.out.println("Document is in MODERATED state");
        document.setState(new PublishedState());
    }
}

class PublishedState implements State {
    @Override
    public void handle(Document document) {
        System.out.println("Document is in PUBLISHED state");
        // No transition in this example
    }
}

class Document {
    private State state;
    
    public Document() {
        this.state = new DraftState();
    }
    
    public void setState(State state) {
        this.state = state;
    }
    
    public void process() {
        state.handle(this);
    }
}
```

### When to Use the Strategy Pattern

- When you want to define a family of algorithms
- When you need to select an algorithm at runtime
- When you have multiple variants of an algorithm
- When an algorithm uses data that clients shouldn't know about
- When a class defines many behaviors that appear as multiple conditional statements
- When you want to avoid exposing complex algorithm-specific data structures

### Advantages

- Provides an alternative to inheritance for extending behavior
- Encapsulates the implementation details of algorithms
- Eliminates conditional statements for algorithm selection
- Allows changing the algorithm at runtime
- Promotes the Open/Closed Principle
- Isolates the code and data of specific algorithms from the rest of the code

### Disadvantages

- Clients must be aware of different strategies
- Increases the number of objects in an application
- Can add complexity if strategies don't vary that much
- Communication overhead between strategy and context
- Might introduce unnecessary abstraction for simple algorithms