# Java Exceptions

## Overview
This guide covers Java's exception handling system, which provides a structured way to handle runtime anomalies and error conditions. Exception handling allows programs to detect and react to unexpected situations, separate error-handling code from regular code, and provide meaningful feedback to users and developers. Understanding Java's exception model is crucial for building robust, maintainable applications.

## Prerequisites
- Basic understanding of Java syntax
- Familiarity with control flow statements
- Knowledge of Java classes and inheritance
- Understanding of method declarations and invocations

## Learning Objectives
- Understand the Java exception hierarchy
- Distinguish between checked and unchecked exceptions
- Master try-catch-finally exception handling blocks
- Apply try-with-resources for automatic resource management
- Create and use custom exceptions
- Implement proper exception propagation
- Apply multi-catch blocks and exception chaining
- Recognize when and how to document exceptions with Javadoc
- Follow best practices for exception handling
- Avoid common exception handling pitfalls

## Table of Contents
1. [Exception Hierarchy](#exception-hierarchy)
2. [Checked vs Unchecked Exceptions](#checked-vs-unchecked-exceptions)
3. [Try-Catch-Finally](#try-catch-finally)
4. [Try-With-Resources](#try-with-resources)
5. [Creating Custom Exceptions](#creating-custom-exceptions)
6. [Exception Propagation](#exception-propagation)
7. [Multi-Catch and Exception Chaining](#multi-catch-and-exception-chaining)
8. [Exception Documentation](#exception-documentation)
9. [Best Practices](#best-practices)
10. [Common Pitfalls](#common-pitfalls)

## Exception Hierarchy

Java's exception architecture consists of a class hierarchy that provides an organized approach to handling errors:

```
             Object
               |
            Throwable
            /      \
      Exception    Error
       /    \        \
  Checked   RuntimeException  (Various Error types)
Exceptions      \
                (Various RuntimeExceptions)
```

### Throwable
The root class of the exception hierarchy is `Throwable`, which provides common methods for all exceptions:

```java
// Common methods on all exception types
try {
    // Code that might throw an exception
} catch (Throwable t) {
    String message = t.getMessage();      // Gets the detail message
    t.printStackTrace();                  // Prints stack trace to console
    StackTraceElement[] stackTrace = t.getStackTrace(); // Gets the stack trace
    Throwable cause = t.getCause();       // Gets the original cause
    t.initCause(new IOException());       // Sets the cause
}
```

### Error
`Error` represents serious problems that reasonable applications should not try to catch, such as:
- `OutOfMemoryError`: JVM has exhausted available memory
- `StackOverflowError`: Stack has exceeded its capacity
- `LinkageError`: Class dependency issues
- `VirtualMachineError`: Issues with the JVM itself

```java
// Errors generally should not be caught, but it is possible
try {
    // Code that might cause an Error
} catch (OutOfMemoryError e) {
    // Recovery may not be possible
    System.err.println("Critical error: " + e.getMessage());
    // Maybe log the error and exit gracefully
    System.exit(1);
}
```

### Exception
`Exception` is the parent class for all regular exceptions:
- Checked exceptions: Must be declared or caught
- Unchecked exceptions: Subclasses of `RuntimeException`

```java
// Base Exception class example
public void exampleMethod() throws Exception {
    throw new Exception("Something went wrong");
}
```

## Checked vs Unchecked Exceptions

### Checked Exceptions
Checked exceptions must be either:
1. Caught using try-catch blocks, or
2. Declared in the method signature using the `throws` clause

Common checked exceptions include:
- `IOException`: Input/output operations issues
- `SQLException`: Database access problems
- `ClassNotFoundException`: Class loading issues
- `InterruptedException`: Thread interruption

```java
// Handling checked exceptions
public void readFile(String fileName) {
    // Option 1: Catch the exception
    try {
        FileReader fileReader = new FileReader(fileName);
        // Read from file
    } catch (IOException e) {
        // Handle the exception
        System.err.println("Error reading file: " + e.getMessage());
    }
}

// Option 2: Declare the exception
public void readFile2(String fileName) throws IOException {
    FileReader fileReader = new FileReader(fileName);
    // Read from file
}
```

### Unchecked Exceptions
Unchecked exceptions (subclasses of `RuntimeException`) don't require explicit catching or declaration. They typically represent programming errors.

Common unchecked exceptions include:
- `NullPointerException`: Reference to a null object
- `ArrayIndexOutOfBoundsException`: Invalid array index
- `IllegalArgumentException`: Illegal argument passed to a method
- `ArithmeticException`: Arithmetic errors like division by zero
- `ClassCastException`: Invalid class casting

```java
// Unchecked exceptions don't need to be declared
public int divide(int a, int b) {
    if (b == 0) {
        throw new ArithmeticException("Division by zero");
    }
    return a / b;
}

// But they can still be caught
public void safeOperation() {
    try {
        int result = divide(10, 0);
    } catch (ArithmeticException e) {
        System.err.println("Math error: " + e.getMessage());
    }
}
```

## Try-Catch-Finally

### Basic Try-Catch
The try-catch block is the foundation of exception handling:

```java
try {
    // Code that might throw an exception
    int result = 10 / 0; // Will throw ArithmeticException
} catch (ArithmeticException e) {
    // Code to handle the specific exception
    System.err.println("Cannot divide by zero!");
}
```

### Multiple Catch Blocks
Catch blocks are evaluated in order; place more specific exceptions before more general ones:

```java
try {
    // Code that might throw different types of exceptions
    String fileName = "file.txt";
    FileReader fileReader = new FileReader(fileName);
    // Potentially other exception-throwing operations
} catch (FileNotFoundException e) {
    // Handle file not found case
    System.err.println("File not found: " + e.getMessage());
} catch (IOException e) {
    // Handle other I/O issues
    System.err.println("Error reading file: " + e.getMessage());
} catch (Exception e) {
    // Catch any other exceptions
    System.err.println("Unexpected error: " + e.getMessage());
}
```

### Finally Block
The finally block contains code that always executes, regardless of whether an exception occurs:

```java
FileReader fileReader = null;
try {
    fileReader = new FileReader("file.txt");
    // Read operations
} catch (IOException e) {
    System.err.println("Error reading file: " + e.getMessage());
} finally {
    // This code always executes
    if (fileReader != null) {
        try {
            fileReader.close();
        } catch (IOException e) {
            System.err.println("Error closing file: " + e.getMessage());
        }
    }
}
```

### Common Usage Patterns

#### 1. Handle and recover
```java
try {
    // Attempt operation
} catch (Exception e) {
    // Handle the issue and allow the program to continue
    // Perhaps use a default value or alternative approach
}
```

#### 2. Log and rethrow
```java
try {
    // Attempt operation
} catch (Exception e) {
    // Log the error
    logger.error("Operation failed", e);
    // Re-throw same or a new exception
    throw e;
}
```

#### 3. Cleanup with finally
```java
Resource resource = null;
try {
    resource = acquireResource();
    // Use resource
} catch (Exception e) {
    // Handle any exceptions
} finally {
    // Clean up resources
    if (resource != null) {
        resource.close();
    }
}
```

## Try-With-Resources

Introduced in Java 7, try-with-resources automatically closes resources that implement `AutoCloseable` or `Closeable` interfaces:

### Basic Syntax
```java
try (
    // Resources declared here are automatically closed
    FileReader reader = new FileReader("input.txt");
    BufferedReader buffered = new BufferedReader(reader)
) {
    // Use the resources
    String line = buffered.readLine();
    System.out.println(line);
    
    // No need for finally block to close resources
    // Both buffered and reader will be closed automatically
} catch (IOException e) {
    System.err.println("Error: " + e.getMessage());
}
```

### Custom Resources
Any class implementing `AutoCloseable` can be used with try-with-resources:

```java
class DatabaseConnection implements AutoCloseable {
    public DatabaseConnection() {
        System.out.println("Opening database connection");
    }
    
    public void executeQuery(String query) {
        System.out.println("Executing: " + query);
    }
    
    @Override
    public void close() throws Exception {
        System.out.println("Closing database connection");
    }
}

// Using custom resource
try (DatabaseConnection connection = new DatabaseConnection()) {
    connection.executeQuery("SELECT * FROM users");
    // Connection automatically closed
}
```

### Suppressed Exceptions
When an exception occurs inside the try block and another exception occurs during resource closing, the second exception is suppressed:

```java
public static void main(String[] args) {
    try (AutoCloseableResource resource = new AutoCloseableResource()) {
        throw new Exception("Try block exception");
    } catch (Exception e) {
        System.err.println("Main exception: " + e.getMessage());
        
        // Access suppressed exceptions
        Throwable[] suppressed = e.getSuppressed();
        for (Throwable t : suppressed) {
            System.err.println("Suppressed: " + t.getMessage());
        }
    }
}

static class AutoCloseableResource implements AutoCloseable {
    @Override
    public void close() throws Exception {
        throw new Exception("Close exception");
    }
}
```

## Creating Custom Exceptions

### Basic Custom Exception
```java
// Custom checked exception
public class InsufficientFundsException extends Exception {
    // Default constructor
    public InsufficientFundsException() {
        super();
    }
    
    // Constructor with message
    public InsufficientFundsException(String message) {
        super(message);
    }
    
    // Constructor with message and cause
    public InsufficientFundsException(String message, Throwable cause) {
        super(message, cause);
    }
}

// Custom unchecked exception
public class InvalidUserOperationException extends RuntimeException {
    public InvalidUserOperationException(String message) {
        super(message);
    }
}
```

### Adding Context to Custom Exceptions
Custom exceptions can include additional information relevant to the error:

```java
public class InsufficientFundsException extends Exception {
    private final double available;
    private final double required;
    
    public InsufficientFundsException(double available, double required) {
        super(String.format("Insufficient funds: available $%.2f, required $%.2f", 
              available, required));
        this.available = available;
        this.required = required;
    }
    
    public double getAvailable() {
        return available;
    }
    
    public double getRequired() {
        return required;
    }
    
    public double getDeficit() {
        return required - available;
    }
}

// Usage
public void withdraw(double amount) throws InsufficientFundsException {
    if (amount > balance) {
        throw new InsufficientFundsException(balance, amount);
    }
    // Withdraw logic
}

// Handling
try {
    account.withdraw(100.0);
} catch (InsufficientFundsException e) {
    System.out.println(e.getMessage());
    System.out.println("You need $" + e.getDeficit() + " more");
}
```

### When to Create Custom Exceptions
Create custom exceptions when:
- Standard exceptions don't adequately describe the error
- You need to add domain-specific information
- You want to group related errors under a common type
- You're creating a reusable library or framework

```java
// Hierarchy of custom exceptions for a banking application
public class BankingException extends Exception { /* ... */ }

public class InsufficientFundsException extends BankingException { /* ... */ }

public class AccountNotFoundException extends BankingException { /* ... */ }

public class TransactionLimitExceededException extends BankingException { /* ... */ }
```

## Exception Propagation

Exception propagation refers to how exceptions move up the call stack if not caught:

### Call Stack Propagation
```java
public static void main(String[] args) {
    try {
        methodA();
    } catch (Exception e) {
        System.out.println("Caught in main: " + e.getMessage());
    }
}

public static void methodA() throws Exception {
    methodB();
}

public static void methodB() throws Exception {
    methodC();
}

public static void methodC() throws Exception {
    throw new Exception("Exception from methodC");
}
```

In this example, the exception:
1. Originates in `methodC`
2. Propagates to `methodB`
3. Continues to `methodA`
4. Finally, it's caught in `main`

### Checked vs Unchecked Exception Propagation
- Checked exceptions must be declared or caught at each level
- Unchecked exceptions automatically propagate without declaration

```java
// Checked exception propagation requires declaration
public void level1() throws IOException {
    level2();
}

public void level2() throws IOException {
    level3();
}

public void level3() throws IOException {
    throw new IOException("IO Error");
}

// Unchecked exception propagation doesn't require declaration
public void levelA() {
    levelB();
}

public void levelB() {
    levelC();
}

public void levelC() {
    throw new RuntimeException("Runtime Error");
}
```

### Partial Handling
Sometimes you might partially handle an exception and then rethrow it:

```java
public void processFile(String path) throws IOException {
    try {
        // File operations
    } catch (IOException e) {
        // Log the issue
        System.err.println("Error processing file: " + path);
        
        // Clean up any resources
        
        // Rethrow for higher-level handling
        throw e;
    }
}
```

## Multi-Catch and Exception Chaining

### Multi-Catch (Java 7+)
Catch multiple exception types with a single block:

```java
try {
    // Code that might throw multiple exception types
    methodThatThrowsMultipleExceptions();
} catch (FileNotFoundException | SQLException e) {
    // Handle both exception types the same way
    System.err.println("Data access error: " + e.getMessage());
} catch (Exception e) {
    // Handle other exceptions differently
    System.err.println("General error: " + e.getMessage());
}
```

### Exception Chaining
Preserve the original cause when throwing a new exception:

```java
public void processFile(String filename) throws ServiceException {
    try {
        // File operations
        FileInputStream file = new FileInputStream(filename);
        // Process file...
    } catch (IOException e) {
        // Wrap the original exception
        throw new ServiceException("Error processing file: " + filename, e);
    }
}

// Higher-level code can access the original cause
try {
    service.processFile("data.txt");
} catch (ServiceException e) {
    System.err.println("Service error: " + e.getMessage());
    
    // Get the original cause
    Throwable cause = e.getCause();
    if (cause != null) {
        System.err.println("Original cause: " + cause.getMessage());
    }
}
```

### Exception Translation
Convert low-level exceptions to more appropriate higher-level ones:

```java
public User findUserById(int id) throws UserNotFoundException {
    try {
        // Database operations
        String sql = "SELECT * FROM users WHERE id = ?";
        // Execute query...
        if (resultSet.next()) {
            // Map result to User object
            return mapResultToUser(resultSet);
        } else {
            throw new UserNotFoundException("User with ID " + id + " not found");
        }
    } catch (SQLException e) {
        // Translate low-level database exception
        throw new DataAccessException("Database error while finding user", e);
    }
}
```

## Exception Documentation

### Javadoc for Exceptions
Document exceptions with the `@throws` or `@exception` tag:

```java
/**
 * Transfers funds between accounts.
 *
 * @param fromAccount The source account
 * @param toAccount The destination account
 * @param amount The amount to transfer
 * @throws InsufficientFundsException If the source account has insufficient funds
 * @throws AccountNotFoundException If either account does not exist
 * @throws IllegalArgumentException If the amount is negative
 */
public void transferFunds(String fromAccount, String toAccount, double amount) 
        throws InsufficientFundsException, AccountNotFoundException {
    
    if (amount < 0) {
        throw new IllegalArgumentException("Transfer amount cannot be negative");
    }
    
    // Implementation...
}
```

### Runtime Exception Documentation
Document unchecked exceptions even though they don't need to be declared:

```java
/**
 * Calculates the average of the provided values.
 *
 * @param values Array of numbers to average
 * @return The average value
 * @throws NullPointerException If the values array is null
 * @throws IllegalArgumentException If the array is empty
 */
public double calculateAverage(double[] values) {
    if (values == null) {
        throw new NullPointerException("Values array cannot be null");
    }
    if (values.length == 0) {
        throw new IllegalArgumentException("Cannot calculate average of empty array");
    }
    
    double sum = 0;
    for (double value : values) {
        sum += value;
    }
    return sum / values.length;
}
```

### Documenting Exception Behavior
Be specific about exactly when and why exceptions are thrown:

```java
/**
 * Retrieves a user by email address.
 *
 * @param email The email to search for
 * @return The matching user
 * @throws UserNotFoundException If no user with the given email exists
 * @throws InvalidEmailException If the email format is invalid
 * @throws DataAccessException If a database error occurs
 */
public User getUserByEmail(String email) throws UserNotFoundException, 
                                               InvalidEmailException, 
                                               DataAccessException {
    // Implementation...
}
```

## Best Practices

### 1. Use specific exception types
```java
// Bad: Too generic
throw new Exception("Something went wrong");

// Good: Specific and descriptive
throw new FileNotFoundException("Config file not found at " + path);
```

### 2. Include meaningful information in exceptions
```java
// Bad: Vague message
throw new IllegalArgumentException("Invalid value");

// Good: Detailed context
throw new IllegalArgumentException("Age must be between 0 and 120, got: " + age);
```

### 3. Catch exceptions at the right level
```java
// Good: Low-level method declares exception
public byte[] readFile(String path) throws IOException {
    // Implementation...
}

// Good: High-level method handles the exception appropriately
public Configuration loadConfig() {
    try {
        byte[] data = readFile(CONFIG_PATH);
        return parseConfig(data);
    } catch (IOException e) {
        logger.warn("Failed to load configuration, using defaults", e);
        return new DefaultConfiguration();
    }
}
```

### 4. Handle exceptions gracefully
```java
public void processUserInput(String input) {
    try {
        int value = Integer.parseInt(input);
        processValue(value);
    } catch (NumberFormatException e) {
        // Friendly message to user
        displayError("Please enter a valid number");
        
        // Log with technical details for developers
        logger.debug("Invalid number format: " + input, e);
    }
}
```

### 5. Close resources properly
```java
// Good: Using try-with-resources
public String readFirstLine(String path) throws IOException {
    try (BufferedReader reader = new BufferedReader(new FileReader(path))) {
        return reader.readLine();
    }
}
```

### 6. Don't swallow exceptions
```java
// Bad: Exception swallowed
try {
    someRiskyOperation();
} catch (Exception e) {
    // Empty catch block or just e.printStackTrace()
}

// Good: Proper handling
try {
    someRiskyOperation();
} catch (Exception e) {
    logger.error("Operation failed", e);
    notifyUser("An error occurred: " + e.getMessage());
}
```

### 7. Don't use exceptions for normal flow control
```java
// Bad: Using exceptions for expected cases
public boolean isUserValid(String username) {
    try {
        findUser(username);
        return true;
    } catch (UserNotFoundException e) {
        return false;
    }
}

// Good: Check without exceptions
public boolean isUserValid(String username) {
    return userRepository.exists(username);
}
```

### 8. Balance checked and unchecked exceptions
```java
// Good use of unchecked exception: Programming error
public void setAge(int age) {
    if (age < 0 || age > 150) {
        throw new IllegalArgumentException("Invalid age: " + age);
    }
    this.age = age;
}

// Good use of checked exception: External condition
public void saveDocument(Document doc, String path) throws IOException {
    // Implementation with proper IOException propagation
}
```

### 9. Create domain-specific exception hierarchy
```java
// Base exception for your application
public class AppException extends Exception { /*...*/ }

// Functional categories
public class ValidationException extends AppException { /*...*/ }
public class SecurityException extends AppException { /*...*/ }
public class DataException extends AppException { /*...*/ }

// Specific exceptions
public class InvalidInputException extends ValidationException { /*...*/ }
public class DuplicateEntityException extends DataException { /*...*/ }
```

### 10. Clean up properly in catch and finally blocks
```java
Lock lock = new ReentrantLock();
try {
    lock.lock();
    // Critical section
} catch (Exception e) {
    // Handle exception
} finally {
    // Always release the lock
    lock.unlock();
}
```

## Common Pitfalls

### 1. Catching Exception or Throwable
**Problem**: Catching overly general exceptions can mask bugs.

```java
// Bad: Catches everything including programming errors
try {
    // A lot of code...
} catch (Exception e) {
    logger.error("Error", e);
}

// Better: Catch specific exceptions
try {
    // Code...
} catch (IOException e) {
    // Handle I/O issues
} catch (SQLException e) {
    // Handle database issues
} catch (RuntimeException e) {
    // Handle unexpected runtime issues
    throw e; // Consider rethrowing
}
```

### 2. Ignoring exceptions
**Problem**: Silently ignoring exceptions hides issues.

```java
// Bad: Empty catch block
try {
    deleteFile(path);
} catch (IOException e) {
    // Do nothing
}

// Better: At least log the exception
try {
    deleteFile(path);
} catch (IOException e) {
    logger.warn("Failed to delete file: " + path, e);
}
```

### 3. Excessive try-catch blocks
**Problem**: Too many try-catch blocks make code hard to read.

```java
// Bad: Try-catch for every operation
try {
    openFile(path);
} catch (IOException e) {
    handleError(e);
}

try {
    readData();
} catch (IOException e) {
    handleError(e);
}

// Better: Single try-catch for related operations
try {
    File file = openFile(path);
    readData(file);
    processData();
} catch (IOException e) {
    handleError(e);
}
```

### 4. Logging and throwing
**Problem**: Both logging and throwing the same exception leads to duplicate logs.

```java
// Bad: Duplicated error information
try {
    // Code...
} catch (SQLException e) {
    logger.error("Database error", e);
    throw e; // Will be logged again higher up
}

// Better: Either log or throw with context
try {
    // Code...
} catch (SQLException e) {
    // Option 1: Log and convert
    logger.error("Database error", e);
    throw new DataAccessException("Error accessing data", e);
    
    // Option 2: Just throw with context
    throw new DataAccessException("Error accessing data", e);
    // Then log at the top level where it's finally handled
}
```

### 5. Destructive wrapping
**Problem**: Wrapping exceptions without the original cause.

```java
// Bad: Original cause is lost
try {
    // Code...
} catch (IOException e) {
    throw new ServiceException("Service failed"); // Original e is lost
}

// Good: Preserve the cause
try {
    // Code...
} catch (IOException e) {
    throw new ServiceException("Service failed", e); // e is included as cause
}
```

### 6. Throwing raw exception types
**Problem**: Throwing the base Exception class provides little information.

```java
// Bad: Generic exception type
if (username == null) {
    throw new Exception("Username is required");
}

// Good: Specific exception type
if (username == null) {
    throw new IllegalArgumentException("Username is required");
}
```

### 7. Not cleaning up resources
**Problem**: Resource leaks when exceptions occur.

```java
// Bad: Resources might not be closed
Connection conn = getConnection();
try {
    // Use connection
} catch (Exception e) {
    // Handle exception
    return; // Connection not closed if exception or early return
}
conn.close();

// Good: Resources always closed
try (Connection conn = getConnection()) {
    // Use connection
} catch (Exception e) {
    // Handle exception
}
// Connection is automatically closed
```

### 8. Stack trace performance
**Problem**: Creating exceptions is expensive due to stack trace capture.

```java
// Bad for performance-critical code: Exception creation is costly
if (!isValid(value)) {
    throw new IllegalArgumentException("Invalid value: " + value);
}

// Better for extremely performance-critical sections:
if (!isValid(value)) {
    IllegalArgumentException e = new IllegalArgumentException("Invalid value: " + value);
    e.setStackTrace(new StackTraceElement[0]); // Empty stack trace
    throw e;
}
```

### 9. Exception handling in constructors
**Problem**: Object left in inconsistent state if constructor throws exception.

```java
// Problematic: Partially initialized object
public class ResourceManager {
    private Resource resource1;
    private Resource resource2;
    
    public ResourceManager() {
        resource1 = new Resource(); // What if this throws?
        resource2 = new Resource(); // Never initialized
    }
}

// Better: All-or-nothing initialization
public class ResourceManager {
    private final Resource resource1;
    private final Resource resource2;
    
    public ResourceManager() throws ResourceException {
        Resource r1 = null;
        Resource r2 = null;
        try {
            r1 = new Resource();
            r2 = new Resource();
        } catch (Exception e) {
            // Clean up any partially allocated resources
            if (r1 != null) r1.close();
            throw new ResourceException("Failed to initialize resources", e);
        }
        
        // Only assign when everything succeeded
        this.resource1 = r1;
        this.resource2 = r2;
    }
}
```

### 10. Exceptions in finally blocks
**Problem**: Exceptions in finally blocks suppress exceptions in try blocks.

```java
// Bad: Exception in finally overwrites the original exception
try {
    throw new ImportantException("Critical error");
} finally {
    // This exception replaces the ImportantException
    throw new LessImportantException("Cleanup error");
}

// Better: Handle exceptions in finally without throwing
try {
    throw new ImportantException("Critical error");
} finally {
    try {
        // Cleanup code that might throw
    } catch (Exception e) {
        logger.warn("Error during cleanup", e);
    }
}
```

## Resources for Further Learning

1. **Official Documentation**:
   - [Java Exceptions Tutorial](https://docs.oracle.com/javase/tutorial/essential/exceptions/)
   - [Java SE API Documentation: Exception](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/Exception.html)

2. **Books**:
   - "Effective Java" by Joshua Bloch (Chapter on Exceptions)
   - "Java: The Complete Reference" by Herbert Schildt
   - "Clean Code" by Robert C. Martin (Section on Error Handling)

3. **Online Resources**:
   - [Baeldung's Java Exception Handling](https://www.baeldung.com/java-exceptions)
   - [IBM Developer: Best practices for using exceptions](https://developer.ibm.com/articles/j-jtp05254/)
   - [Oracle's Lesson on Exceptions](https://docs.oracle.com/javase/tutorial/essential/exceptions/)

## Practice Exercises

1. **Exception Hierarchy Analysis**:
   Analyze an exception hierarchy and create a diagram of the inheritance relationships.

2. **Custom Exception Creation**:
   Implement a custom exception hierarchy for a specific domain.

3. **Resource Management**:
   Refactor code to properly close resources using try-with-resources.

4. **Exception Translation**:
   Implement methods that translate low-level exceptions to more appropriate higher-level ones.

5. **Real-world Error Handling**:
   Design an error handling strategy for a command-line application.

6. **Exception Testing**:
   Write unit tests that verify correct exception handling in a method.

7. **Checked vs Unchecked Decision**:
   Analyze scenarios and determine whether checked or unchecked exceptions are more appropriate.

8. **Internationalization of Exceptions**:
   Modify exceptions to support localized error messages.

9. **Debugging Stack Traces**:
   Analyze stack traces from real exceptions and identify the root cause.

10. **Exception Performance Analysis**:
    Benchmark different exception handling approaches to understand their performance implications. 