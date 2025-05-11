# Java Concurrency

## Overview
This guide covers Java's concurrency model and multithreading capabilities. Concurrent programming allows multiple processes or threads to execute simultaneously, improving application performance, responsiveness, and resource utilization. Java provides robust APIs and utilities for thread management, synchronization, and concurrent data structures.

## Prerequisites
- Solid understanding of Java core concepts
- Familiarity with object-oriented programming
- Basic knowledge of Java memory model
- Understanding of Java collections framework

## Learning Objectives
- Understand fundamental concurrent programming concepts
- Create and manage threads in Java
- Apply synchronization techniques to prevent race conditions
- Utilize Java's high-level concurrency utilities
- Design thread-safe classes and data structures
- Implement executor services and thread pools
- Apply concurrent collections for multithreaded applications
- Understand atomic operations and non-blocking algorithms
- Recognize and avoid common concurrency pitfalls

## Table of Contents
1. [Concurrency Fundamentals](#concurrency-fundamentals)
2. [Thread Basics](#thread-basics)
3. [Thread Synchronization](#thread-synchronization)
4. [Java Memory Model](#java-memory-model)
5. [Lock Mechanisms](#lock-mechanisms)
6. [Executor Framework](#executor-framework)
7. [Concurrent Collections](#concurrent-collections)
8. [Atomic Variables](#atomic-variables)
9. [CompletableFuture API](#completablefuture-api)
10. [Best Practices](#best-practices)

## Concurrency Fundamentals

### Processes vs Threads
- **Process**: Self-contained execution environment with its own memory space
- **Thread**: Lightweight execution unit within a process that shares memory with other threads

### Concurrency vs Parallelism
- **Concurrency**: Handling multiple tasks by switching between them (time-slicing)
- **Parallelism**: Executing multiple tasks simultaneously (requires multiple CPU cores)

### Benefits of Multithreading
- **Improved responsiveness**: UI remains responsive while background operations execute
- **Resource efficiency**: CPU utilization improved during I/O operations
- **Throughput**: Executing multiple tasks simultaneously on multicore systems

### Challenges in Concurrent Programming
- **Race conditions**: Unpredictable results when two threads access shared data simultaneously
- **Deadlocks**: Two or more threads waiting indefinitely for resources held by each other
- **Livelocks**: Threads respond to each other without making progress
- **Thread starvation**: Threads denied necessary resources to progress
- **Thread interference**: One thread's operations affect another thread's operations

## Thread Basics

### Creating Threads
Java provides two primary ways to create threads:

#### 1. Extending the Thread class
```java
public class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("Thread running: " + Thread.currentThread().getName());
        // Thread logic here
    }
    
    public static void main(String[] args) {
        MyThread thread = new MyThread();
        thread.start(); // Starts the thread
    }
}
```

#### 2. Implementing the Runnable interface (preferred)
```java
public class MyRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println("Thread running: " + Thread.currentThread().getName());
        // Thread logic here
    }
    
    public static void main(String[] args) {
        Thread thread = new Thread(new MyRunnable());
        thread.start(); // Starts the thread
    }
}
```

#### 3. Using lambda expressions (Java 8+)
```java
public class LambdaThread {
    public static void main(String[] args) {
        Runnable task = () -> {
            System.out.println("Thread running: " + Thread.currentThread().getName());
            // Thread logic here
        };
        
        Thread thread = new Thread(task);
        thread.start();
    }
}
```

### Thread Lifecycle
A thread goes through various states during its lifetime:

1. **NEW**: Thread created but not started
2. **RUNNABLE**: Thread is executing or ready to execute
3. **BLOCKED**: Thread waiting to acquire a monitor lock
4. **WAITING**: Thread waiting indefinitely for another thread
5. **TIMED_WAITING**: Thread waiting for a specified time
6. **TERMINATED**: Thread completed execution

```java
// Example of tracking thread states
public class ThreadStates {
    public static void main(String[] args) throws InterruptedException {
        Thread thread = new Thread(() -> {
            try {
                Thread.sleep(2000); // TIMED_WAITING
                synchronized (ThreadStates.class) {
                    ThreadStates.class.wait(); // WAITING
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });
        
        System.out.println("After creation: " + thread.getState()); // NEW
        
        thread.start();
        System.out.println("After start: " + thread.getState()); // RUNNABLE
        
        Thread.sleep(1000);
        System.out.println("After sleep: " + thread.getState()); // TIMED_WAITING
        
        // Eventually thread terminates...
    }
}
```

### Thread Methods
```java
Thread thread = new Thread(() -> {
    // Thread logic
});

thread.start();               // Start thread execution
thread.setName("WorkerThread"); // Set thread name
thread.setPriority(Thread.MAX_PRIORITY); // Set thread priority (1-10)
thread.setDaemon(true);       // Set as daemon thread
thread.interrupt();           // Interrupt the thread
thread.join();                // Wait for thread to complete
thread.join(1000);            // Wait for thread to complete with timeout
```

### Sleep, Yield, and Join
```java
// Sleep: Pause thread execution
try {
    Thread.sleep(1000); // Pause for 1 second
} catch (InterruptedException e) {
    Thread.currentThread().interrupt();
}

// Yield: Hint that thread can pause
Thread.yield();

// Join: Wait for another thread to complete
Thread worker = new Thread(() -> {
    // Long-running task
});
worker.start();

try {
    worker.join(); // Wait for worker to complete
    // Code here executes after worker is done
} catch (InterruptedException e) {
    Thread.currentThread().interrupt();
}
```

## Thread Synchronization

### Race Conditions
Race conditions occur when multiple threads access and modify shared data simultaneously, causing unpredictable results.

```java
// Example of a race condition
public class Counter {
    private int count = 0;
    
    // Not thread-safe
    public void increment() {
        count++;  // This is not an atomic operation
    }
    
    public int getCount() {
        return count;
    }
    
    public static void main(String[] args) throws InterruptedException {
        Counter counter = new Counter();
        
        Thread t1 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) {
                counter.increment();
            }
        });
        
        Thread t2 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) {
                counter.increment();
            }
        });
        
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        
        // Expected: 2000, Actual: potentially less due to race condition
        System.out.println("Count: " + counter.getCount());
    }
}
```

### Synchronized Methods
The `synchronized` keyword provides intrinsic locks to prevent multiple threads from executing a critical section simultaneously.

```java
public class SynchronizedCounter {
    private int count = 0;
    
    // Thread-safe method
    public synchronized void increment() {
        count++;
    }
    
    public synchronized int getCount() {
        return count;
    }
}
```

### Synchronized Blocks
For finer-grained control, use synchronized blocks to lock specific objects or sections of code.

```java
public class SynchronizedBlockExample {
    private final Object lockObject = new Object();
    private int count = 0;
    
    public void increment() {
        synchronized (lockObject) {
            count++;
        }
    }
    
    public int getCount() {
        synchronized (lockObject) {
            return count;
        }
    }
}
```

### Volatile Keyword
The `volatile` keyword ensures visibility of changes to variables across threads.

```java
public class VolatileExample {
    private volatile boolean running = true;
    
    public void stop() {
        running = false;
    }
    
    public void process() {
        while (running) {
            // Do work
        }
    }
}
```

### Thread Cooperation
Wait and notify methods allow threads to communicate with each other.

```java
public class WaitNotifyExample {
    private final List<String> buffer = new ArrayList<>();
    private final int MAX_SIZE = 10;
    
    public synchronized void produce(String item) throws InterruptedException {
        while (buffer.size() == MAX_SIZE) {
            wait(); // Wait until buffer has space
        }
        buffer.add(item);
        notifyAll(); // Notify consumers that item is available
    }
    
    public synchronized String consume() throws InterruptedException {
        while (buffer.isEmpty()) {
            wait(); // Wait until buffer has an item
        }
        String item = buffer.remove(0);
        notifyAll(); // Notify producers that space is available
        return item;
    }
}
```

## Java Memory Model

### Happens-Before Relationship
The Java Memory Model defines a partial ordering of operations called "happens-before," which ensures visibility of memory operations across threads.

Key happens-before relationships:
- Program order: Actions in a thread happen before subsequent actions in that thread
- Monitor lock: `unlock` happens before subsequent `lock` of the same monitor
- Volatile field: Write to a volatile field happens before subsequent reads
- Thread start: `start()` happens before any actions in the started thread
- Thread termination: All actions in a thread happen before detection of thread termination
- Transitivity: If A happens before B, and B happens before C, then A happens before C

### Memory Visibility
Memory visibility ensures that changes made by one thread are visible to other threads.

```java
public class MemoryVisibilityExample {
    private int number;
    private volatile boolean ready;
    
    // Writer thread
    public void writer() {
        number = 42;
        ready = true; // Volatile write ensures visibility of number=42
    }
    
    // Reader thread
    public void reader() {
        if (ready) { // Volatile read
            // Due to happens-before, this thread will see number=42
            System.out.println(number);
        }
    }
}
```

## Lock Mechanisms

### ReentrantLock
`ReentrantLock` provides more flexibility than synchronized blocks, with capabilities like timed lock acquisition and interruptible locks.

```java
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class ReentrantLockExample {
    private final Lock lock = new ReentrantLock();
    private int count = 0;
    
    public void increment() {
        lock.lock();
        try {
            count++;
        } finally {
            lock.unlock(); // Always unlock in finally block
        }
    }
    
    public int getCount() {
        lock.lock();
        try {
            return count;
        } finally {
            lock.unlock();
        }
    }
    
    // Trylock example
    public boolean incrementIfAvailable() {
        if (lock.tryLock()) {
            try {
                count++;
                return true;
            } finally {
                lock.unlock();
            }
        }
        return false;
    }
}
```

### ReadWriteLock
`ReadWriteLock` allows multiple readers but only a single writer at a time.

```java
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class ReadWriteLockExample {
    private final ReadWriteLock rwLock = new ReentrantReadWriteLock();
    private final Map<String, String> data = new HashMap<>();
    
    public void put(String key, String value) {
        rwLock.writeLock().lock();
        try {
            data.put(key, value);
        } finally {
            rwLock.writeLock().unlock();
        }
    }
    
    public String get(String key) {
        rwLock.readLock().lock();
        try {
            return data.get(key);
        } finally {
            rwLock.readLock().unlock();
        }
    }
}
```

### StampedLock (Java 8+)
`StampedLock` provides optimistic reading, which allows multiple readers and possibility to upgrade to write lock.

```java
import java.util.concurrent.locks.StampedLock;

public class StampedLockExample {
    private final StampedLock lock = new StampedLock();
    private double x, y;
    
    public void move(double deltaX, double deltaY) {
        long stamp = lock.writeLock();
        try {
            x += deltaX;
            y += deltaY;
        } finally {
            lock.unlockWrite(stamp);
        }
    }
    
    public double distanceFromOrigin() {
        // Optimistic read
        long stamp = lock.tryOptimisticRead();
        double currentX = x;
        double currentY = y;
        
        // Check if the stamp is still valid (no writes occurred)
        if (!lock.validate(stamp)) {
            // Fall back to pessimistic read lock
            stamp = lock.readLock();
            try {
                currentX = x;
                currentY = y;
            } finally {
                lock.unlockRead(stamp);
            }
        }
        
        return Math.sqrt(currentX * currentX + currentY * currentY);
    }
}
```

## Executor Framework

The Executor Framework separates task submission from execution, providing a flexible thread management system.

### Executor and ExecutorService

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ExecutorExample {
    public static void main(String[] args) {
        // Create an executor with a fixed thread pool of 3 threads
        ExecutorService executor = Executors.newFixedThreadPool(3);
        
        // Submit tasks
        for (int i = 0; i < 10; i++) {
            final int taskId = i;
            executor.submit(() -> {
                System.out.println("Task " + taskId + " executed by " 
                    + Thread.currentThread().getName());
            });
        }
        
        // Shutdown the executor (no new tasks accepted)
        executor.shutdown();
        
        // Alternative: Shutdown and wait for tasks to complete
        // executor.awaitTermination(5, TimeUnit.SECONDS);
    }
}
```

### Types of Executors

```java
// Fixed thread pool - fixed number of threads
ExecutorService fixedPool = Executors.newFixedThreadPool(4);

// Cached thread pool - creates new threads as needed, reuses idle threads
ExecutorService cachedPool = Executors.newCachedThreadPool();

// Single thread executor - single worker thread
ExecutorService singleThreadExecutor = Executors.newSingleThreadExecutor();

// Scheduled executor - for delayed or periodic tasks
ScheduledExecutorService scheduledPool = Executors.newScheduledThreadPool(2);
```

### Scheduled Tasks

```java
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class ScheduledExecutorExample {
    public static void main(String[] args) {
        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
        
        // Execute after 5 seconds delay
        scheduler.schedule(() -> System.out.println("Delayed task"), 
                           5, TimeUnit.SECONDS);
        
        // Execute every 2 seconds, starting after 0 seconds
        scheduler.scheduleAtFixedRate(() -> System.out.println("Fixed rate task"), 
                                     0, 2, TimeUnit.SECONDS);
        
        // Execute every 2 seconds after previous completion
        scheduler.scheduleWithFixedDelay(() -> System.out.println("Fixed delay task"), 
                                       0, 2, TimeUnit.SECONDS);
    }
}
```

### Future and Callable
`Future` represents the result of an asynchronous computation, and `Callable` is similar to `Runnable` but can return a value.

```java
import java.util.concurrent.*;

public class FutureExample {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        ExecutorService executor = Executors.newFixedThreadPool(1);
        
        // Submit Callable task that returns a value
        Future<Integer> future = executor.submit(() -> {
            Thread.sleep(2000); // Simulate long computation
            return 42;
        });
        
        // Do other work while the task is executing
        System.out.println("Waiting for result...");
        
        // Block and get the result (with optional timeout)
        Integer result = future.get(3, TimeUnit.SECONDS);
        System.out.println("Result: " + result);
        
        executor.shutdown();
    }
}
```

## Concurrent Collections

Java provides specialized collections designed for concurrent access.

### ConcurrentHashMap
Thread-safe alternative to HashMap without locking the entire map.

```java
import java.util.concurrent.ConcurrentHashMap;

public class ConcurrentMapExample {
    public static void main(String[] args) {
        ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();
        
        // Thread-safe operations
        map.put("one", 1);
        map.put("two", 2);
        
        // Atomic operations
        map.putIfAbsent("three", 3);
        map.replace("two", 2, 22);
        
        // Aggregate operations (Java 8+)
        map.forEach((k, v) -> System.out.println(k + " = " + v));
        
        // Compute methods
        map.compute("four", (k, v) -> v == null ? 4 : v + 1);
        map.computeIfAbsent("five", k -> 5);
        map.computeIfPresent("one", (k, v) -> v + 10);
    }
}
```

### CopyOnWriteArrayList
Thread-safe variant of ArrayList optimized for read-heavy workloads.

```java
import java.util.concurrent.CopyOnWriteArrayList;

public class CopyOnWriteExample {
    public static void main(String[] args) {
        CopyOnWriteArrayList<String> list = new CopyOnWriteArrayList<>();
        list.add("one");
        list.add("two");
        
        // Safe iteration during concurrent modification
        for (String item : list) {
            System.out.println(item);
            list.add("three"); // Won't affect current iteration
        }
        
        System.out.println("Final size: " + list.size());
    }
}
```

### BlockingQueue
Queue that supports operations that wait for the queue to become non-empty or non-full.

```java
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

public class BlockingQueueExample {
    public static void main(String[] args) {
        BlockingQueue<String> queue = new ArrayBlockingQueue<>(10);
        
        // Producer thread
        new Thread(() -> {
            try {
                for (int i = 0; i < 20; i++) {
                    String item = "Item-" + i;
                    queue.put(item); // Blocks if queue is full
                    System.out.println("Produced: " + item);
                    Thread.sleep(100);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }).start();
        
        // Consumer thread
        new Thread(() -> {
            try {
                while (true) {
                    String item = queue.take(); // Blocks if queue is empty
                    System.out.println("Consumed: " + item);
                    Thread.sleep(300);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }).start();
    }
}
```

## Atomic Variables

Atomic variables provide lock-free, thread-safe operations on single variables.

```java
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;

public class AtomicExample {
    public static void main(String[] args) {
        // Atomic primitive types
        AtomicInteger counter = new AtomicInteger(0);
        
        counter.incrementAndGet(); // Atomic increment and get
        counter.getAndIncrement(); // Get and atomic increment
        counter.addAndGet(5);      // Atomic add and get
        counter.compareAndSet(6, 10); // Compare and set if equal
        
        System.out.println("Counter: " + counter.get());
        
        // Atomic reference
        AtomicReference<String> reference = new AtomicReference<>("initial");
        reference.set("updated");
        reference.compareAndSet("updated", "final");
        
        System.out.println("Reference: " + reference.get());
    }
}
```

## CompletableFuture API

Java 8 introduced CompletableFuture for asynchronous programming with a composable, functional style.

```java
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

public class CompletableFutureExample {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        // Creating a CompletableFuture
        CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            return "Hello";
        });
        
        // Transform the result
        CompletableFuture<String> greetingFuture = future.thenApply(s -> s + " World");
        
        // Chain another asynchronous operation
        CompletableFuture<String> completedFuture = greetingFuture.thenCompose(s -> 
            CompletableFuture.supplyAsync(() -> s + "!"));
        
        // Handle errors
        CompletableFuture<String> safeFuture = completedFuture.exceptionally(ex -> {
            System.err.println("Error: " + ex.getMessage());
            return "Error occurred";
        });
        
        // Combine two futures
        CompletableFuture<Integer> anotherFuture = CompletableFuture.supplyAsync(() -> 42);
        CompletableFuture<String> combinedFuture = safeFuture.thenCombine(
            anotherFuture,
            (s, i) -> s + " - " + i
        );
        
        // Execute callback when complete
        combinedFuture.thenAccept(System.out::println);
        
        // Block and get the result
        String result = combinedFuture.get();
        System.out.println("Final result: " + result);
    }
}
```

## Best Practices

1. **Prefer higher-level concurrency utilities** over raw threads and `synchronized`
   ```java
   // Instead of managing threads directly
   ExecutorService executor = Executors.newFixedThreadPool(nThreads);
   ```

2. **Use thread pools** to limit resource consumption and improve performance
   ```java
   // Good - reuse threads
   ExecutorService executor = Executors.newFixedThreadPool(
       Runtime.getRuntime().availableProcessors()); 
   ```

3. **Prefer concurrent collections** over synchronized collections for better scalability
   ```java
   // Better performance under concurrent access
   Map<String, String> map = new ConcurrentHashMap<>();
   // vs
   Map<String, String> synchronizedMap = Collections.synchronizedMap(new HashMap<>());
   ```

4. **Minimize lock scope** - lock only what's necessary for the shortest time
   ```java
   // Bad - locking too much
   public synchronized void processList(List<Item> items) {
       // Process each item (locking the entire method)
   }
   
   // Better - lock only the critical section
   public void processList(List<Item> items) {
       for (Item item : items) {
           // Process item outside of lock
           synchronized (this) {
               // Update shared state
           }
       }
   }
   ```

5. **Use atomic variables** for simple counters and flags
   ```java
   // Better than synchronized for simple operations
   AtomicInteger counter = new AtomicInteger();
   ```

6. **Avoid using Thread.stop(), Thread.suspend(), and Thread.resume()** as they are deprecated and unsafe

7. **Always catch InterruptedException and restore the interrupt status**
   ```java
   try {
       Thread.sleep(1000);
   } catch (InterruptedException e) {
       // Restore interrupt status
       Thread.currentThread().interrupt();
       // Handle appropriately
   }
   ```

8. **Use thread-local variables** for thread-confined data
   ```java
   private static final ThreadLocal<SimpleDateFormat> dateFormat = 
       ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd"));
   ```

9. **Avoid unnecessary object creation** in concurrent code
   ```java
   // Create outside loop to avoid garbage collection pressure
   StringBuilder builder = new StringBuilder();
   for (int i = 0; i < 1000; i++) {
       builder.setLength(0); // Reset instead of creating new instance
       builder.append("Item ").append(i);
       process(builder.toString());
   }
   ```

10. **Design immutable classes** when possible for thread safety
    ```java
    // Immutable class is inherently thread-safe
    public final class Point {
        private final int x;
        private final int y;
        
        public Point(int x, int y) {
            this.x = x;
            this.y = y;
        }
        
        public int getX() { return x; }
        public int getY() { return y; }
    }
    ```

## Common Pitfalls and How to Avoid Them

### 1. Race Conditions
**Problem**: Multiple threads accessing shared data concurrently may lead to inconsistent state.

**Solution**: Use proper synchronization, locks, or atomic variables.
```java
// Safe increment with synchronized
public synchronized void increment() {
    count++;
}

// Or with AtomicInteger
private AtomicInteger count = new AtomicInteger();
public void increment() {
    count.incrementAndGet();
}
```

### 2. Deadlocks
**Problem**: Two or more threads waiting for locks held by each other.

**Solution**: Always acquire locks in a consistent order.
```java
// Potential deadlock (Thread A gets lock1 then lock2, Thread B gets lock2 then lock1)
synchronized (lock1) {
    synchronized (lock2) {
        // ...
    }
}

// Fix: Always acquire locks in consistent order
// All threads should acquire lock1 first, then lock2
```

### 3. Thread Leaks
**Problem**: Threads not properly shutdown, consuming resources.

**Solution**: Always properly shut down executor services and threads.
```java
ExecutorService executor = Executors.newFixedThreadPool(nThreads);
try {
    // Submit tasks
} finally {
    executor.shutdown();
    try {
        if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {
            executor.shutdownNow();
        }
    } catch (InterruptedException e) {
        executor.shutdownNow();
        Thread.currentThread().interrupt();
    }
}
```

### 4. Memory Leaks in ThreadLocal
**Problem**: ThreadLocal variables not properly removed can cause memory leaks.

**Solution**: Always call remove() when done with ThreadLocal variables.
```java
ThreadLocal<Resource> resourceHolder = new ThreadLocal<>();
try {
    resourceHolder.set(new Resource());
    // Use the resource
} finally {
    resourceHolder.remove(); // Clean up
}
```

### 5. Busy Waiting
**Problem**: Actively checking a condition in a loop wastes CPU.

**Solution**: Use proper waiting mechanisms.
```java
// Bad: Busy waiting
while (!condition) {
    // Waste CPU cycles
}

// Good: Use proper waiting
synchronized (lock) {
    while (!condition) {
        lock.wait();
    }
}
```

### 6. Double-Checked Locking Issues
**Problem**: Incorrect implementation can lead to partially initialized objects.

**Solution**: Use volatile or synchronized correctly.
```java
// Correct double-checked locking with volatile
private volatile Singleton instance;

public Singleton getInstance() {
    if (instance == null) {
        synchronized (this) {
            if (instance == null) {
                instance = new Singleton();
            }
        }
    }
    return instance;
}

// Better: Use holder class idiom
public class Singleton {
    private Singleton() {}
    
    private static class SingletonHolder {
        private static final Singleton INSTANCE = new Singleton();
    }
    
    public static Singleton getInstance() {
        return SingletonHolder.INSTANCE;
    }
}
```

## Resources for Further Learning

1. **Official Documentation**:
   - [Java Concurrency in Practice](https://docs.oracle.com/javase/tutorial/essential/concurrency/)
   - [Java SE Documentation: java.util.concurrent](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/package-summary.html)

2. **Books**:
   - "Java Concurrency in Practice" by Brian Goetz
   - "Concurrent Programming in Java" by Doug Lea
   - "Seven Concurrency Models in Seven Weeks" by Paul Butcher

3. **Online Resources**:
   - [Baeldung Concurrency Guides](https://www.baeldung.com/java-concurrency)
   - [Jakob Jenkov's Java Concurrency Tutorial](http://tutorials.jenkov.com/java-concurrency/index.html)
   - [IBM Developer: Java Concurrency](https://developer.ibm.com/series/java-concurrency/)

4. **Practice Platforms**:
   - [LeetCode Concurrency Problems](https://leetcode.com/tag/concurrency/)
   - [Coursera: Parallel, Concurrent, and Distributed Programming in Java](https://www.coursera.org/specializations/pcdp)

## Practice Exercises

1. **Thread-Safe Counter**:
   Implement a thread-safe counter class using different synchronization mechanisms (synchronized, AtomicInteger, Lock).

2. **Producer-Consumer Pattern**:
   Create a producer-consumer scenario using BlockingQueue.

3. **Resource Pool**:
   Implement a thread-safe resource pool that manages a fixed number of resources.

4. **Web Crawler**:
   Build a concurrent web crawler that downloads and processes web pages in parallel.

5. **Task Scheduler**:
   Create a task scheduler that executes tasks at specified intervals.

6. **Concurrent File Processor**:
   Implement a program that concurrently processes large files.

7. **Bank Account Transfer**:
   Create a system to simulate bank account transfers with proper locking to avoid race conditions.

8. **Thread-Safe Cache**:
   Implement a concurrent cache with automatic expiration of entries.

9. **Fork/Join Sorting**:
   Use the Fork/Join framework to implement a parallel sorting algorithm.

10. **Concurrent Data Pipeline**:
    Build a data processing pipeline where multiple stages of processing occur concurrently.