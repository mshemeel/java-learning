# Java Exception Handling

## Table of Contents
1. [Introduction to Exception Handling](#introduction)
2. [Types of Exceptions](#types-of-exceptions)
3. [Exception Handling Mechanisms](#exception-handling-mechanisms)
4. [Best Practices](#best-practices)
5. [Common Scenarios](#common-scenarios)

## Introduction

Exception handling in Java is a mechanism to handle runtime errors and maintain normal application flow. It's crucial for building robust and reliable applications.

### Why Exception Handling?
- Separate error handling code from regular code
- Propagate errors up the call stack
- Group and differentiate error types
- Maintain program reliability

## Types of Exceptions

### 1. Checked Exceptions
Exceptions that must be either caught or declared in the method signature.

```java
public class CheckedExceptionExample {
    public void readFile(String filename) throws IOException {
        FileReader file = new FileReader(filename);
        // Process file
    }
    
    public void handleFile() {
        try {
            readFile("example.txt");
        } catch (IOException e) {
            System.err.println("Error reading file: " + e.getMessage());
        }
    }
}
```

### 2. Unchecked Exceptions
Runtime exceptions that don't need to be explicitly caught or declared.

```java
public class UncheckedExceptionExample {
    public void divideNumbers(int a, int b) {
        try {
            int result = a / b;
            System.out.println("Result: " + result);
        } catch (ArithmeticException e) {
            System.err.println("Cannot divide by zero!");
        }
    }
}
```

### 3. Error
Serious problems that reasonable applications shouldn't try to catch.

```java
public class ErrorExample {
    public void recursiveMethod() {
        // This will cause StackOverflowError
        recursiveMethod();
    }
}
```

## Exception Handling Mechanisms

### 1. try-catch Block
Basic exception handling mechanism.

```java
public class TryCatchExample {
    public void demonstrateTryCatch() {
        try {
            // Code that might throw an exception
            int[] arr = new int[5];
            arr[10] = 50; // ArrayIndexOutOfBoundsException
        } catch (ArrayIndexOutOfBoundsException e) {
            System.err.println("Array index out of bounds!");
        } catch (Exception e) {
            System.err.println("Generic error: " + e.getMessage());
        }
    }
}
```

### 2. try-with-resources
Automatically closes resources that implement AutoCloseable.

```java
public class TryWithResourcesExample {
    public void readFile() {
        try (FileReader fr = new FileReader("file.txt");
             BufferedReader br = new BufferedReader(fr)) {
            String line;
            while ((line = br.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            System.err.println("Error reading file: " + e.getMessage());
        }
    }
}
```

### 3. throw and throws
Mechanisms to throw and declare exceptions.

```java
public class ThrowExample {
    public void validateAge(int age) throws IllegalArgumentException {
        if (age < 0) {
            throw new IllegalArgumentException("Age cannot be negative");
        }
        // Process age
    }
    
    public void processAge() {
        try {
            validateAge(-5);
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid age: " + e.getMessage());
        }
    }
}
```

### 4. finally Block
Code that always executes, regardless of exception.

```java
public class FinallyExample {
    public void processResource() {
        Resource resource = null;
        try {
            resource = new Resource();
            // Process resource
        } catch (Exception e) {
            System.err.println("Error processing resource");
        } finally {
            if (resource != null) {
                resource.close();
            }
        }
    }
}
```

## Best Practices

### 1. Exception Hierarchy
Create custom exceptions by extending appropriate exception classes.

```java
public class CustomExceptionExample {
    public class BusinessException extends Exception {
        public BusinessException(String message) {
            super(message);
        }
    }
    
    public class ValidationException extends BusinessException {
        public ValidationException(String message) {
            super(message);
        }
    }
}
```

### 2. Exception Handling Strategies

```java
public class ExceptionHandlingStrategy {
    // 1. Catch and Handle
    public void handleLocally() {
        try {
            // Risky operation
        } catch (Exception e) {
            // Handle completely
            logError(e);
            notifyUser();
        }
    }
    
    // 2. Catch and Rethrow
    public void handleAndRethrow() throws BusinessException {
        try {
            // Risky operation
        } catch (Exception e) {
            logError(e);
            throw new BusinessException("Operation failed: " + e.getMessage());
        }
    }
    
    // 3. Catch and Transform
    public void handleAndTransform() {
        try {
            // Risky operation
        } catch (SQLException e) {
            throw new DataAccessException("Database error", e);
        }
    }
}
```

### 3. Logging Best Practices

```java
public class ExceptionLogging {
    private static final Logger logger = LoggerFactory.getLogger(ExceptionLogging.class);
    
    public void demonstrateLogging() {
        try {
            // Risky operation
        } catch (Exception e) {
            logger.error("Operation failed", e);
            // Include stack trace for debugging
            logger.debug("Stack trace: ", e);
        }
    }
}
```

## Common Scenarios

### 1. Database Operations

```java
public class DatabaseExample {
    public void performDatabaseOperation() {
        Connection conn = null;
        try {
            conn = getConnection();
            // Perform database operations
        } catch (SQLException e) {
            handleDatabaseError(e);
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    logger.error("Error closing connection", e);
                }
            }
        }
    }
}
```

### 2. File Operations

```java
public class FileOperationExample {
    public void processFile(String path) {
        try (BufferedReader reader = new BufferedReader(new FileReader(path))) {
            String line;
            while ((line = reader.readLine()) != null) {
                processLine(line);
            }
        } catch (IOException e) {
            handleFileError(e);
        }
    }
}
```

### 3. Network Operations

```java
public class NetworkExample {
    public void makeHttpRequest() {
        HttpURLConnection conn = null;
        try {
            URL url = new URL("http://api.example.com");
            conn = (HttpURLConnection) url.openConnection();
            // Process response
        } catch (MalformedURLException e) {
            handleInvalidURL(e);
        } catch (IOException e) {
            handleNetworkError(e);
        } finally {
            if (conn != null) {
                conn.disconnect();
            }
        }
    }
}
```

## Testing Exception Handling

```java
@Test
public void testExceptionHandling() {
    ExceptionExample example = new ExceptionExample();
    
    assertThrows(IllegalArgumentException.class, () -> {
        example.validateInput(null);
    });
    
    assertDoesNotThrow(() -> {
        example.validateInput("valid input");
    });
}
```

## Summary
- Always catch specific exceptions before general ones
- Use try-with-resources for AutoCloseable resources
- Create custom exceptions for business logic
- Log exceptions appropriately
- Clean up resources in finally blocks
- Test exception handling code
- Document exception handling behavior 