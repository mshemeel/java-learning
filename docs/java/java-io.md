# Java I/O (Input/Output)

## Overview
Java I/O (Input/Output) provides a comprehensive set of classes for performing input and output operations in Java applications. The I/O API allows Java programs to read and write data from various sources and destinations, including files, network connections, memory buffers, and other devices. This guide covers both the traditional I/O package (java.io) and the enhanced NIO (New I/O) package (java.nio) introduced in Java 1.4, along with NIO.2 features added in Java 7.

## Prerequisites
- Basic Java programming knowledge
- Understanding of exception handling in Java
- Familiarity with Java streams concepts

## Learning Objectives
- Understand the Java I/O architecture and class hierarchy
- Learn how to work with files and directories
- Master reading from and writing to files using various streams
- Use character and byte streams appropriately
- Implement buffered I/O operations for improved performance
- Understand object serialization and deserialization
- Work with the enhanced NIO and NIO.2 APIs
- Apply best practices for resource management and performance optimization

## Table of Contents
1. [Java I/O Architecture](#java-io-architecture)
2. [File Handling](#file-handling)
3. [Byte Streams](#byte-streams)
4. [Character Streams](#character-streams)
5. [Buffered Streams](#buffered-streams)
6. [Data Streams](#data-streams)
7. [Object Serialization](#object-serialization)
8. [NIO (New I/O)](#nio-new-io)
9. [NIO.2 (Java 7+)](#nio2-java-7)
10. [Files and Path API](#files-and-path-api)
11. [Memory-Mapped Files](#memory-mapped-files)
12. [Asynchronous I/O](#asynchronous-io)

## Java I/O Architecture

Java's I/O architecture is designed around streams, channels, buffers, and selectors:

### Stream-Based I/O (java.io)
The traditional I/O package is based on the concept of streams. A stream represents a sequence of data and supports various operations to read from or write to the stream.

**Key Characteristics**:
- Primarily blocking operations
- Byte-oriented and character-oriented streams
- Simple sequential access model
- Extensible through decorator pattern

### Channel-Based I/O (java.nio)
NIO introduced the concept of channels and buffers for more efficient I/O operations.

**Key Characteristics**:
- Support for non-blocking operations
- Buffer-oriented rather than stream-oriented
- Selectors for multiplexed, non-blocking I/O
- More complex but potentially more efficient

### Class Hierarchy Overview

```
java.io Class Hierarchy:

InputStream
├── FileInputStream
├── ByteArrayInputStream
├── FilterInputStream
│   ├── BufferedInputStream
│   └── DataInputStream
├── ObjectInputStream
└── PipedInputStream

OutputStream
├── FileOutputStream
├── ByteArrayOutputStream
├── FilterOutputStream
│   ├── BufferedOutputStream
│   └── DataOutputStream
├── ObjectOutputStream
└── PipedOutputStream

Reader
├── BufferedReader
├── InputStreamReader
│   └── FileReader
├── StringReader
└── PipedReader

Writer
├── BufferedWriter
├── OutputStreamWriter
│   └── FileWriter
├── StringWriter
├── PrintWriter
└── PipedWriter
```

## File Handling

### Working with the File Class
The `File` class represents a file or directory path. It provides methods to create, delete, and manipulate files and directories.

```java
// Creating a File object
File file = new File("example.txt");

// Checking if a file exists
boolean exists = file.exists();

// Getting file properties
String name = file.getName();
String path = file.getPath();
String absolutePath = file.getAbsolutePath();
long length = file.length();
boolean isDirectory = file.isDirectory();
boolean isFile = file.isFile();
long lastModified = file.lastModified();

// File operations
boolean created = file.createNewFile();
boolean deleted = file.delete();
boolean renamed = file.renameTo(new File("new_name.txt"));

// Directory operations
File dir = new File("my_directory");
boolean dirCreated = dir.mkdir();
boolean dirTreeCreated = dir.mkdirs(); // Creates parent directories too

// Listing directory contents
File[] files = dir.listFiles();
String[] fileNames = dir.list();

// File filtering
File[] javaFiles = dir.listFiles((d, name) -> name.endsWith(".java"));
```

### File vs Path (java.nio.file)
While `File` is part of the legacy I/O API, `Path` and `Files` were introduced in Java 7 (NIO.2) and provide more powerful and flexible file operations.

```java
// Using Path (Java 7+)
Path path = Paths.get("example.txt");
boolean exists = Files.exists(path);
```

## Byte Streams

Byte streams work with binary data and are suitable for processing all types of data, including text, images, audio, etc.

### FileInputStream and FileOutputStream
For reading from and writing to files at the byte level.

```java
// Reading from a file byte by byte
try (FileInputStream fis = new FileInputStream("input.txt")) {
    int data;
    while ((data = fis.read()) != -1) {
        // Process each byte
        System.out.print((char) data);
    }
} catch (IOException e) {
    e.printStackTrace();
}

// Writing to a file byte by byte
try (FileOutputStream fos = new FileOutputStream("output.txt")) {
    String message = "Hello, Java I/O!";
    byte[] bytes = message.getBytes();
    fos.write(bytes);
} catch (IOException e) {
    e.printStackTrace();
}

// Reading/writing byte arrays
try (FileInputStream fis = new FileInputStream("input.txt");
     FileOutputStream fos = new FileOutputStream("output.txt")) {
    
    byte[] buffer = new byte[1024];
    int bytesRead;
    
    while ((bytesRead = fis.read(buffer)) != -1) {
        fos.write(buffer, 0, bytesRead);
    }
} catch (IOException e) {
    e.printStackTrace();
}
```

### ByteArrayInputStream and ByteArrayOutputStream
For reading from and writing to byte arrays in memory.

```java
// Reading from a byte array
byte[] data = {65, 66, 67, 68, 69}; // ABCDE
try (ByteArrayInputStream bais = new ByteArrayInputStream(data)) {
    int byteData;
    while ((byteData = bais.read()) != -1) {
        System.out.print((char) byteData);
    }
}

// Writing to a byte array
try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
    baos.write("Hello".getBytes());
    baos.write(", ".getBytes());
    baos.write("World!".getBytes());
    
    byte[] byteArray = baos.toByteArray();
    String result = new String(byteArray);
    System.out.println(result); // Hello, World!
}
```

## Character Streams

Character streams work with text data and automatically handle character encoding/decoding.

### Reader and Writer
Abstract base classes for character-based input and output streams.

### FileReader and FileWriter
For reading from and writing to files using the default character encoding.

```java
// Reading characters from a file
try (FileReader reader = new FileReader("input.txt")) {
    int character;
    while ((character = reader.read()) != -1) {
        System.out.print((char) character);
    }
} catch (IOException e) {
    e.printStackTrace();
}

// Writing characters to a file
try (FileWriter writer = new FileWriter("output.txt")) {
    writer.write("Hello, Character Streams!");
} catch (IOException e) {
    e.printStackTrace();
}

// Appending to a file
try (FileWriter writer = new FileWriter("output.txt", true)) { // append mode
    writer.write("\nThis is appended text.");
} catch (IOException e) {
    e.printStackTrace();
}
```

### InputStreamReader and OutputStreamWriter
Bridge classes between byte streams and character streams with explicit charset support.

```java
// Reading with a specific charset
try (FileInputStream fis = new FileInputStream("input.txt");
     InputStreamReader isr = new InputStreamReader(fis, StandardCharsets.UTF_8);
     BufferedReader reader = new BufferedReader(isr)) {
    
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
} catch (IOException e) {
    e.printStackTrace();
}

// Writing with a specific charset
try (FileOutputStream fos = new FileOutputStream("output.txt");
     OutputStreamWriter osw = new OutputStreamWriter(fos, StandardCharsets.UTF_8);
     BufferedWriter writer = new BufferedWriter(osw)) {
    
    writer.write("Text with explicit UTF-8 encoding");
} catch (IOException e) {
    e.printStackTrace();
}
```

### StringReader and StringWriter
For reading from and writing to String objects.

```java
// Reading from a string
try (StringReader reader = new StringReader("Hello, StringReader!")) {
    int character;
    while ((character = reader.read()) != -1) {
        System.out.print((char) character);
    }
}

// Writing to a string
try (StringWriter writer = new StringWriter()) {
    writer.write("Hello, StringWriter!");
    writer.write(" This text is in memory.");
    
    String result = writer.toString();
    System.out.println(result);
}
```

## Buffered Streams

Buffered streams improve performance by reducing the number of I/O operations through buffering.

### BufferedInputStream and BufferedOutputStream
For buffered byte stream I/O.

```java
// Buffered file reading (bytes)
try (FileInputStream fis = new FileInputStream("input.txt");
     BufferedInputStream bis = new BufferedInputStream(fis)) {
    
    int data;
    while ((data = bis.read()) != -1) {
        System.out.print((char) data);
    }
} catch (IOException e) {
    e.printStackTrace();
}

// Buffered file writing (bytes)
try (FileOutputStream fos = new FileOutputStream("output.txt");
     BufferedOutputStream bos = new BufferedOutputStream(fos)) {
    
    String text = "Text written with buffered output.";
    bos.write(text.getBytes());
    // No need to flush explicitly when using try-with-resources
} catch (IOException e) {
    e.printStackTrace();
}
```

### BufferedReader and BufferedWriter
For buffered character stream I/O.

```java
// Reading lines from a file
try (FileReader fr = new FileReader("input.txt");
     BufferedReader br = new BufferedReader(fr)) {
    
    String line;
    while ((line = br.readLine()) != null) {
        System.out.println(line);
    }
} catch (IOException e) {
    e.printStackTrace();
}

// Writing lines to a file
try (FileWriter fw = new FileWriter("output.txt");
     BufferedWriter bw = new BufferedWriter(fw)) {
    
    bw.write("Line 1");
    bw.newLine(); // Platform-dependent line separator
    bw.write("Line 2");
    bw.newLine();
    bw.write("Line 3");
} catch (IOException e) {
    e.printStackTrace();
}
```

## Data Streams

Data streams allow reading and writing of primitive data types and strings.

### DataInputStream and DataOutputStream
For reading and writing primitive Java data types.

```java
// Writing primitive data types
try (FileOutputStream fos = new FileOutputStream("data.bin");
     DataOutputStream dos = new DataOutputStream(fos)) {
    
    dos.writeInt(123);
    dos.writeDouble(3.14159);
    dos.writeBoolean(true);
    dos.writeUTF("Hello, DataOutputStream!");
} catch (IOException e) {
    e.printStackTrace();
}

// Reading primitive data types
try (FileInputStream fis = new FileInputStream("data.bin");
     DataInputStream dis = new DataInputStream(fis)) {
    
    int intValue = dis.readInt();
    double doubleValue = dis.readDouble();
    boolean booleanValue = dis.readBoolean();
    String stringValue = dis.readUTF();
    
    System.out.println("Int: " + intValue);
    System.out.println("Double: " + doubleValue);
    System.out.println("Boolean: " + booleanValue);
    System.out.println("String: " + stringValue);
} catch (IOException e) {
    e.printStackTrace();
}
```

## Object Serialization

Object serialization allows converting Java objects to byte streams and vice versa.

### Serializable Interface
Classes must implement this marker interface to be serializable.

```java
// Serializable class
public class Person implements Serializable {
    private static final long serialVersionUID = 1L; // Important for versioning
    
    private String name;
    private int age;
    private transient String secretData; // transient fields aren't serialized
    
    // Constructor, getters, setters
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    @Override
    public String toString() {
        return "Person [name=" + name + ", age=" + age + "]";
    }
}
```

### ObjectInputStream and ObjectOutputStream
For reading and writing serialized objects.

```java
// Serializing an object
try (FileOutputStream fos = new FileOutputStream("person.ser");
     ObjectOutputStream oos = new ObjectOutputStream(fos)) {
    
    Person person = new Person("John Doe", 30);
    oos.writeObject(person);
    System.out.println("Object serialized successfully");
} catch (IOException e) {
    e.printStackTrace();
}

// Deserializing an object
try (FileInputStream fis = new FileInputStream("person.ser");
     ObjectInputStream ois = new ObjectInputStream(fis)) {
    
    Person person = (Person) ois.readObject();
    System.out.println("Object deserialized: " + person);
} catch (IOException | ClassNotFoundException e) {
    e.printStackTrace();
}
```

### Serialization Customization
Custom serialization behavior can be implemented using special methods.

```java
public class CustomPerson implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String firstName;
    private String lastName;
    private transient String fullName; // Derived field, not serialized
    
    public CustomPerson(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
        updateFullName();
    }
    
    private void updateFullName() {
        this.fullName = firstName + " " + lastName;
    }
    
    // Called during serialization
    private void writeObject(ObjectOutputStream out) throws IOException {
        out.defaultWriteObject(); // Default serialization
        // Additional custom serialization if needed
    }
    
    // Called during deserialization
    private void readObject(ObjectInputStream in) throws IOException, ClassNotFoundException {
        in.defaultReadObject(); // Default deserialization
        updateFullName(); // Reconstruct transient fields
    }
}
```

## NIO (New I/O)

Java NIO provides an alternative set of I/O APIs for improved performance.

### Channels and Buffers
The core components of the NIO API.

```java
// Reading a file using a channel and buffer
try (RandomAccessFile file = new RandomAccessFile("input.txt", "r");
     FileChannel channel = file.getChannel()) {
    
    ByteBuffer buffer = ByteBuffer.allocate(1024);
    int bytesRead = channel.read(buffer);
    
    while (bytesRead != -1) {
        buffer.flip(); // Switch from writing to reading mode
        
        while (buffer.hasRemaining()) {
            System.out.print((char) buffer.get());
        }
        
        buffer.clear(); // Prepare buffer for writing
        bytesRead = channel.read(buffer);
    }
} catch (IOException e) {
    e.printStackTrace();
}

// Writing to a file using a channel and buffer
try (FileOutputStream fos = new FileOutputStream("output.txt");
     FileChannel channel = fos.getChannel()) {
    
    String text = "Hello, NIO Channel!";
    ByteBuffer buffer = ByteBuffer.allocate(128);
    buffer.put(text.getBytes());
    buffer.flip(); // Switch from writing to reading mode
    
    while (buffer.hasRemaining()) {
        channel.write(buffer);
    }
} catch (IOException e) {
    e.printStackTrace();
}
```

### Direct vs. Non-Direct Buffers
NIO provides two types of ByteBuffers.

```java
// Non-direct buffer (heap buffer)
ByteBuffer heapBuffer = ByteBuffer.allocate(1024);

// Direct buffer (off-heap)
ByteBuffer directBuffer = ByteBuffer.allocateDirect(1024);
```

### Buffer Operations
Important methods for working with buffers.

```java
ByteBuffer buffer = ByteBuffer.allocate(1024);

// Writing to buffer
buffer.put((byte) 'H');
buffer.put((byte) 'e');
buffer.put((byte) 'l');
buffer.put((byte) 'l');
buffer.put((byte) 'o');

// Prepare for reading
buffer.flip();

// Reading from buffer
while (buffer.hasRemaining()) {
    byte b = buffer.get();
    System.out.print((char) b);
}

// Clearing the buffer
buffer.clear();

// Other useful methods
buffer.rewind(); // Resets position to 0
buffer.compact(); // Compacts the buffer (copies unread data to the beginning)
buffer.mark(); // Sets a mark at the current position
buffer.reset(); // Resets the position to the previously set mark
```

### Scatter/Gather Operations
Reading from a channel to multiple buffers or writing from multiple buffers to a channel.

```java
// Scatter read
ByteBuffer header = ByteBuffer.allocate(128);
ByteBuffer body = ByteBuffer.allocate(1024);
ByteBuffer[] buffers = { header, body };

try (FileChannel channel = new RandomAccessFile("data.txt", "r").getChannel()) {
    channel.read(buffers);
    
    header.flip();
    body.flip();
    
    // Process header and body separately
}

// Gather write
ByteBuffer header = ByteBuffer.allocate(128);
ByteBuffer body = ByteBuffer.allocate(1024);

// Fill buffers with data
// ...

ByteBuffer[] buffers = { header, body };
try (FileChannel channel = new FileOutputStream("data.txt").getChannel()) {
    channel.write(buffers);
}
```

### Selectors
For multiplexed, non-blocking I/O operations.

```java
// Setting up a selector (usually used for network I/O)
Selector selector = Selector.open();

// Registering a channel with a selector
ServerSocketChannel serverChannel = ServerSocketChannel.open();
serverChannel.configureBlocking(false);
serverChannel.socket().bind(new InetSocketAddress(8080));
serverChannel.register(selector, SelectionKey.OP_ACCEPT);

// Selector operation loop
while (true) {
    int readyChannels = selector.select();
    if (readyChannels == 0) continue;
    
    Set<SelectionKey> selectedKeys = selector.selectedKeys();
    Iterator<SelectionKey> keyIterator = selectedKeys.iterator();
    
    while (keyIterator.hasNext()) {
        SelectionKey key = keyIterator.next();
        
        if (key.isAcceptable()) {
            // Accept connection
        } else if (key.isReadable()) {
            // Read data
        } else if (key.isWritable()) {
            // Write data
        }
        
        keyIterator.remove();
    }
}
```

## NIO.2 (Java 7+)

Java 7 introduced NIO.2 with significant improvements to file system operations.

### Path Interface
A modern replacement for the File class.

```java
// Creating a Path
Path path1 = Paths.get("data.txt");
Path path2 = Paths.get("/home", "user", "documents", "data.txt");
Path path3 = Paths.get(URI.create("file:///home/user/documents/data.txt"));

// Path operations
Path fileName = path1.getFileName();
Path parent = path1.getParent();
int nameCount = path1.getNameCount();
Path subpath = path1.subpath(0, 2);
Path normalized = path1.normalize();
Path resolved = path1.resolve("subdir/file.txt");
Path relativized = path1.relativize(path2);
```

## Files and Path API

The Files class provides utility methods for file operations.

### Basic File Operations

```java
Path path = Paths.get("example.txt");

// Checking file attributes
boolean exists = Files.exists(path);
boolean isRegularFile = Files.isRegularFile(path);
boolean isDirectory = Files.isDirectory(path);
boolean isReadable = Files.isReadable(path);
boolean isWritable = Files.isWritable(path);

// Creating files and directories
Path newFile = Files.createFile(Paths.get("newfile.txt"));
Path newDir = Files.createDirectory(Paths.get("newdir"));
Path newDirs = Files.createDirectories(Paths.get("dir1/dir2/dir3"));

// Copying and moving files
Path source = Paths.get("source.txt");
Path target = Paths.get("target.txt");
Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING);
Files.move(source, target, StandardCopyOption.REPLACE_EXISTING);

// Deleting files
Files.delete(path);
boolean deleted = Files.deleteIfExists(path);
```

### Reading and Writing Files

```java
Path path = Paths.get("example.txt");

// Reading all bytes
byte[] bytes = Files.readAllBytes(path);

// Reading all lines
List<String> lines = Files.readAllLines(path, StandardCharsets.UTF_8);

// Writing bytes and strings
Files.write(path, "Hello, Files API!".getBytes());
Files.write(path, Arrays.asList("Line 1", "Line 2"), StandardCharsets.UTF_8);

// Streaming lines (Java 8+)
try (Stream<String> stream = Files.lines(path, StandardCharsets.UTF_8)) {
    stream.forEach(System.out::println);
}
```

### Walking a Directory Tree

```java
Path startPath = Paths.get("src");

// Simple directory listing
try (DirectoryStream<Path> stream = Files.newDirectoryStream(startPath)) {
    for (Path entry : stream) {
        System.out.println(entry);
    }
}

// Walking a directory tree
try (Stream<Path> stream = Files.walk(startPath)) {
    stream.filter(Files::isRegularFile)
          .filter(p -> p.toString().endsWith(".java"))
          .forEach(System.out::println);
}

// Finding files
try (Stream<Path> stream = Files.find(startPath, Integer.MAX_VALUE,
        (path, attr) -> path.toString().endsWith(".java") && attr.isRegularFile())) {
    stream.forEach(System.out::println);
}

// Using a FileVisitor
Files.walkFileTree(startPath, new SimpleFileVisitor<Path>() {
    @Override
    public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) {
        System.out.println("File: " + file);
        return FileVisitResult.CONTINUE;
    }
    
    @Override
    public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) {
        System.out.println("Directory: " + dir);
        return FileVisitResult.CONTINUE;
    }
});
```

### File Attributes

```java
Path path = Paths.get("example.txt");

// Basic attributes
BasicFileAttributes attrs = Files.readAttributes(path, BasicFileAttributes.class);
System.out.println("Size: " + attrs.size());
System.out.println("Creation time: " + attrs.creationTime());
System.out.println("Last modified: " + attrs.lastModifiedTime());
System.out.println("Last access: " + attrs.lastAccessTime());
System.out.println("Is directory: " + attrs.isDirectory());
System.out.println("Is regular file: " + attrs.isRegularFile());

// Specific file system attributes (POSIX)
PosixFileAttributes posixAttrs = Files.readAttributes(path, PosixFileAttributes.class);
System.out.println("Owner: " + posixAttrs.owner());
System.out.println("Group: " + posixAttrs.group());
System.out.println("Permissions: " + PosixFilePermissions.toString(posixAttrs.permissions()));

// Setting attributes
Files.setAttribute(path, "lastModifiedTime", FileTime.fromMillis(System.currentTimeMillis()));
Files.setLastModifiedTime(path, FileTime.fromMillis(System.currentTimeMillis()));
```

## Memory-Mapped Files

Memory-mapped files provide high-performance I/O by mapping a file directly into memory.

```java
// Reading a file using memory mapping
try (RandomAccessFile file = new RandomAccessFile("bigfile.data", "r");
     FileChannel channel = file.getChannel()) {
    
    long fileSize = channel.size();
    MappedByteBuffer buffer = channel.map(FileChannel.MapMode.READ_ONLY, 0, fileSize);
    
    // Directly access the file as if it were in memory
    for (int i = 0; i < fileSize; i++) {
        byte b = buffer.get(i);
        // Process byte
    }
} catch (IOException e) {
    e.printStackTrace();
}

// Writing to a memory-mapped file
try (RandomAccessFile file = new RandomAccessFile("output.data", "rw");
     FileChannel channel = file.getChannel()) {
    
    long fileSize = 1024 * 1024; // 1MB
    MappedByteBuffer buffer = channel.map(FileChannel.MapMode.READ_WRITE, 0, fileSize);
    
    // Write to the file through memory
    for (int i = 0; i < fileSize; i++) {
        buffer.put(i, (byte) (i % 256));
    }
    
    buffer.force(); // Flush changes to disk
} catch (IOException e) {
    e.printStackTrace();
}
```

## Asynchronous I/O

Java 7 introduced asynchronous I/O with the `AsynchronousChannel` interfaces.

```java
// Asynchronous file reading
try (AsynchronousFileChannel channel = 
        AsynchronousFileChannel.open(Paths.get("input.txt"), StandardOpenOption.READ)) {
    
    ByteBuffer buffer = ByteBuffer.allocate(1024);
    
    // Read with Future
    Future<Integer> result = channel.read(buffer, 0);
    while (!result.isDone()) {
        // Do something else while waiting
    }
    
    int bytesRead = result.get();
    buffer.flip();
    
    // ... process data in buffer
    
    // Read with CompletionHandler
    channel.read(buffer, position, buffer, new CompletionHandler<Integer, ByteBuffer>() {
        @Override
        public void completed(Integer result, ByteBuffer attachment) {
            attachment.flip();
            // Process data
        }
        
        @Override
        public void failed(Throwable exc, ByteBuffer attachment) {
            exc.printStackTrace();
        }
    });
} catch (IOException | InterruptedException | ExecutionException e) {
    e.printStackTrace();
}
```

## Best Practices

1. **Always close resources properly**:
   - Use try-with-resources (Java 7+) for automatic resource management
   - For pre-Java 7, use finally blocks to ensure closing
   ```java
   // Good (Java 7+)
   try (FileInputStream fis = new FileInputStream("file.txt")) {
       // Use the resource
   } catch (IOException e) {
       e.printStackTrace();
   }
   
   // Pre-Java 7
   FileInputStream fis = null;
   try {
       fis = new FileInputStream("file.txt");
       // Use the resource
   } catch (IOException e) {
       e.printStackTrace();
   } finally {
       if (fis != null) {
           try {
               fis.close();
           } catch (IOException e) {
               e.printStackTrace();
           }
       }
   }
   ```

2. **Use buffered streams for performance**:
   - Wrap basic streams with buffered streams to reduce system calls
   ```java
   // Better performance with buffering
   try (BufferedReader reader = new BufferedReader(new FileReader("file.txt"))) {
       // Use reader
   }
   ```

3. **Choose the right stream type**:
   - Use byte streams for binary data (images, audio, etc.)
   - Use character streams for text data to handle character encoding properly

4. **Prefer NIO.2 (Java 7+) for file operations**:
   - More powerful and expressive API than traditional File class
   - Better exception handling with more specific exceptions

5. **Use memory-mapped files for large files**:
   - Provides better performance for large files
   - Good for random access patterns

6. **Optimize buffer sizes**:
   - Default buffer sizes may not be optimal for all scenarios
   - Consider the access pattern and platform when choosing buffer size
   - Too small: too many system calls
   - Too large: wasted memory

7. **Handle character encodings explicitly**:
   ```java
   // Explicit encoding is better than platform default
   Reader reader = new InputStreamReader(new FileInputStream("file.txt"), StandardCharsets.UTF_8);
   ```

8. **Use NIO for high-throughput scenarios**:
   - Selectors for handling multiple connections with fewer threads
   - Non-blocking I/O for scalable network applications

9. **Implement proper serialization controls**:
   - Define serialVersionUID for all serializable classes
   - Make sensitive fields transient to avoid serializing them
   - Consider implementing readObject/writeObject for custom serialization

10. **Use file locking for concurrent access**:
    ```java
    try (FileChannel channel = FileChannel.open(Paths.get("file.txt"), StandardOpenOption.WRITE)) {
        FileLock lock = channel.lock();
        try {
            // Perform operations while locked
        } finally {
            lock.release();
        }
    }
    ```

## Common Pitfalls and How to Avoid Them

1. **Resource leaks**:
   ```java
   // BAD: Resources not closed properly
   FileInputStream fis = new FileInputStream("file.txt");
   // ... operations without proper closing
   
   // GOOD: try-with-resources ensures closing
   try (FileInputStream fis = new FileInputStream("file.txt")) {
       // ... operations
   }
   ```

2. **Character encoding issues**:
   ```java
   // BAD: Implicitly uses platform default encoding
   FileReader reader = new FileReader("file.txt");
   
   // GOOD: Explicitly specify encoding
   Reader reader = new InputStreamReader(new FileInputStream("file.txt"), StandardCharsets.UTF_8);
   ```

3. **Ignoring exceptions during closing**:
   ```java
   // BAD: Swallowing exceptions
   try {
       resource.close();
   } catch (IOException e) {
       // Empty catch block
   }
   
   // GOOD: At minimum, log the exception
   try {
       resource.close();
   } catch (IOException e) {
       logger.error("Error closing resource", e);
   }
   ```

4. **Inefficient reading/writing**:
   ```java
   // BAD: Reading one byte at a time
   while ((b = inputStream.read()) != -1) {
       // Process single byte
   }
   
   // GOOD: Use buffer for bulk operations
   byte[] buffer = new byte[8192];
   int bytesRead;
   while ((bytesRead = inputStream.read(buffer)) != -1) {
       // Process bytesRead bytes from buffer
   }
   ```

5. **Accidentally using write() instead of append()**:
   ```java
   // BAD: Overwrites existing file content
   try (FileWriter writer = new FileWriter("log.txt")) {
       writer.write("New log entry");
   }
   
   // GOOD: Appends to existing content
   try (FileWriter writer = new FileWriter("log.txt", true)) {
       writer.write("New log entry");
   }
   ```

6. **Incorrect buffer handling in NIO**:
   ```java
   // BAD: Forgetting to flip buffer before reading
   channel.read(buffer);
   // Should call buffer.flip() here
   while (buffer.hasRemaining()) {
       // Process buffer content
   }
   
   // GOOD: Proper buffer handling
   channel.read(buffer);
   buffer.flip(); // Switch from writing to reading mode
   while (buffer.hasRemaining()) {
       // Process buffer content
   }
   buffer.clear(); // Reset for next use
   ```

7. **Synchronization issues with file access**:
   ```java
   // BAD: No synchronization for concurrent access
   public void writeToLog(String message) {
       try (FileWriter writer = new FileWriter("log.txt", true)) {
           writer.write(message + "\n");
       } catch (IOException e) {
           e.printStackTrace();
       }
   }
   
   // GOOD: Using file locking
   public void writeToLog(String message) {
       try (FileChannel channel = FileChannel.open(
               Paths.get("log.txt"), 
               StandardOpenOption.WRITE, StandardOpenOption.APPEND)) {
           
           FileLock lock = channel.lock();
           try {
               ByteBuffer buffer = ByteBuffer.wrap((message + "\n").getBytes());
               channel.write(buffer);
           } finally {
               lock.release();
           }
       } catch (IOException e) {
           e.printStackTrace();
       }
   }
   ```

8. **Incorrect path handling**:
   ```java
   // BAD: Platform-dependent path separator
   String filePath = "directory" + "/" + "file.txt";
   
   // GOOD: Using Path.resolve()
   Path filePath = Paths.get("directory").resolve("file.txt");
   ```

9. **Not checking file existence before operations**:
   ```java
   // BAD: Assuming file exists
   Files.delete(Paths.get("file.txt")); // May throw NoSuchFileException
   
   // GOOD: Check first or use deleteIfExists
   Path path = Paths.get("file.txt");
   if (Files.exists(path)) {
       Files.delete(path);
   }
   // OR
   Files.deleteIfExists(path);
   ```

10. **Serialization versioning issues**:
    ```java
    // BAD: No serialVersionUID
    public class Person implements Serializable {
        private String name;
        private int age;
    }
    
    // GOOD: With serialVersionUID
    public class Person implements Serializable {
        private static final long serialVersionUID = 1L;
        private String name;
        private int age;
    }
    ```

## Resources for Further Learning

1. **Official Documentation**:
   - [Java I/O Tutorial](https://docs.oracle.com/javase/tutorial/essential/io/index.html)
   - [Java NIO Documentation](https://docs.oracle.com/javase/8/docs/api/java/nio/package-summary.html)
   - [Java NIO.2 API](https://docs.oracle.com/javase/8/docs/api/java/nio/file/package-summary.html)

2. **Books**:
   - "Java NIO" by Ron Hitchens
   - "Java I/O, NIO and NIO.2" by Jeff Friesen
   - "Effective Java" by Joshua Bloch (Chapter on Serialization)

3. **Online Resources**:
   - [Baeldung Java I/O Tutorials](https://www.baeldung.com/java-io)
   - [Java NIO vs IO](https://www.baeldung.com/java-nio-vs-io)
   - [Java NIO2 Path API](https://www.baeldung.com/java-nio-2-path)

4. **Video Courses**:
   - "Java Fundamentals: NIO and NIO.2" on Pluralsight
   - "Java I/O Fundamentals" on LinkedIn Learning

## Practice Exercises

1. **File Copier**:
   Create a program that copies files from one directory to another, supporting both small text files and large binary files efficiently.

2. **Directory Size Calculator**:
   Implement a utility that calculates the total size of all files in a directory and its subdirectories.

3. **CSV Parser**:
   Build a parser that reads CSV files and converts the data into a list of objects using appropriate I/O techniques.

4. **File Search Utility**:
   Create a file search utility that can find files based on name patterns, content, size, or creation/modification dates.

5. **Simple Text Editor**:
   Implement a basic text editor that can open, edit, and save text files with proper character encoding support.

6. **File Compression Tool**:
   Build a tool that compresses and decompresses files using Java's I/O streams and a compression library.

7. **Network File Transfer**:
   Create a client-server application that allows file transfer over a network using NIO non-blocking I/O.

8. **Object Serialization Framework**:
   Develop a framework that handles automatic serialization and deserialization of complex object graphs.

9. **Log File Analyzer**:
   Build a tool that reads and analyzes log files, extracting statistics and identifying patterns.

10. **File Watcher Service**:
    Implement a service that monitors a directory for file changes and triggers actions when files are created, modified, or deleted. 