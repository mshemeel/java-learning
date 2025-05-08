# Java Multithreading

## Table of Contents
1. [Introduction to Multithreading](#introduction)
2. [Thread Creation and Management](#thread-creation)
3. [Thread Synchronization](#thread-synchronization)
4. [Thread Communication](#thread-communication)
5. [Concurrent Collections](#concurrent-collections)
6. [Thread Pools and Executors](#thread-pools)
7. [Best Practices](#best-practices)

## Introduction

Multithreading in Java allows concurrent execution of two or more parts of a program for maximum utilization of CPU.

### Benefits of Multithreading
- Better resource utilization
- Enhanced performance
- Improved responsiveness
- Ability to perform multiple tasks simultaneously

## Thread Creation

### 1. Extending Thread Class

```java
public class ThreadExample extends Thread {
    @Override
    public void run() {
        System.out.println("Thread running: " + Thread.currentThread().getName());
    }
    
    public static void main(String[] args) {
        ThreadExample thread = new ThreadExample();
        thread.start();
    }
}
```

### 2. Implementing Runnable Interface

```java
public class RunnableExample implements Runnable {
    @Override
    public void run() {
        System.out.println("Thread running: " + Thread.currentThread().getName());
    }
    
    public static void main(String[] args) {
        Thread thread = new Thread(new RunnableExample());
        thread.start();
    }
}
```

### 3. Using Lambda Expressions

```java
public class LambdaThreadExample {
    public static void main(String[] args) {
        Thread thread = new Thread(() -> {
            System.out.println("Thread running: " + Thread.currentThread().getName());
        });
        thread.start();
    }
}
```

## Thread Synchronization

### 1. Synchronized Methods

```java
public class SynchronizedExample {
    private int count = 0;
    
    public synchronized void increment() {
        count++;
    }
    
    public synchronized void decrement() {
        count--;
    }
    
    public synchronized int getCount() {
        return count;
    }
}
```

### 2. Synchronized Blocks

```java
public class SynchronizedBlockExample {
    private List<String> items = new ArrayList<>();
    private final Object lock = new Object();
    
    public void addItem(String item) {
        synchronized(lock) {
            items.add(item);
        }
    }
    
    public void removeItem(String item) {
        synchronized(lock) {
            items.remove(item);
        }
    }
}
```

### 3. Lock Interface

```java
public class LockExample {
    private final ReentrantLock lock = new ReentrantLock();
    private int count = 0;
    
    public void increment() {
        lock.lock();
        try {
            count++;
        } finally {
            lock.unlock();
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
}
```

## Thread Communication

### 1. wait() and notify()

```java
public class ProducerConsumer {
    private Queue<Integer> queue = new LinkedList<>();
    private final int CAPACITY = 10;
    
    public synchronized void produce(int item) throws InterruptedException {
        while (queue.size() == CAPACITY) {
            wait();
        }
        queue.add(item);
        notify();
    }
    
    public synchronized int consume() throws InterruptedException {
        while (queue.isEmpty()) {
            wait();
        }
        int item = queue.remove();
        notify();
        return item;
    }
}
```

### 2. CountDownLatch

```java
public class CountDownLatchExample {
    public void executeParallelTasks() {
        CountDownLatch latch = new CountDownLatch(3);
        
        // Start multiple threads
        new Thread(() -> {
            performTask();
            latch.countDown();
        }).start();
        
        // Wait for all threads to complete
        try {
            latch.await();
            System.out.println("All tasks completed");
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
```

### 3. CyclicBarrier

```java
public class CyclicBarrierExample {
    private CyclicBarrier barrier = new CyclicBarrier(3, () -> {
        System.out.println("All threads reached barrier");
    });
    
    public void executeTask() {
        try {
            // Perform task
            barrier.await();
            // Continue after all threads reach barrier
        } catch (InterruptedException | BrokenBarrierException e) {
            Thread.currentThread().interrupt();
        }
    }
}
```

## Concurrent Collections

### 1. ConcurrentHashMap

```java
public class ConcurrentMapExample {
    private ConcurrentMap<String, Integer> map = new ConcurrentHashMap<>();
    
    public void updateMap(String key, Integer value) {
        map.put(key, value);
    }
    
    public Integer getValue(String key) {
        return map.get(key);
    }
    
    public void computeIfAbsent(String key) {
        map.computeIfAbsent(key, k -> calculateValue(k));
    }
}
```

### 2. CopyOnWriteArrayList

```java
public class CopyOnWriteExample {
    private List<String> list = new CopyOnWriteArrayList<>();
    
    public void addItem(String item) {
        list.add(item);
    }
    
    public void removeItem(String item) {
        list.remove(item);
    }
    
    public void iterate() {
        // Safe iteration while modifications are happening
        for (String item : list) {
            System.out.println(item);
        }
    }
}
```

## Thread Pools and Executors

### 1. Fixed Thread Pool

```java
public class ThreadPoolExample {
    private ExecutorService executor = Executors.newFixedThreadPool(5);
    
    public void executeTask(Runnable task) {
        executor.submit(task);
    }
    
    public void shutdown() {
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
}
```

### 2. Callable and Future

```java
public class CallableExample {
    private ExecutorService executor = Executors.newFixedThreadPool(5);
    
    public Future<Integer> calculateResult() {
        return executor.submit(() -> {
            // Perform computation
            return computeValue();
        });
    }
    
    public void processResult() {
        Future<Integer> future = calculateResult();
        try {
            Integer result = future.get(1, TimeUnit.SECONDS);
            System.out.println("Result: " + result);
        } catch (InterruptedException | ExecutionException | TimeoutException e) {
            future.cancel(true);
        }
    }
}
```

### 3. CompletableFuture

```java
public class CompletableFutureExample {
    public void processAsync() {
        CompletableFuture<String> future = CompletableFuture
            .supplyAsync(() -> fetchData())
            .thenApply(data -> processData(data))
            .thenAccept(result -> saveResult(result));
            
        future.exceptionally(throwable -> {
            handleError(throwable);
            return null;
        });
    }
    
    public void combineFutures() {
        CompletableFuture<String> future1 = CompletableFuture.supplyAsync(() -> "Hello");
        CompletableFuture<String> future2 = CompletableFuture.supplyAsync(() -> "World");
        
        CompletableFuture<String> combined = future1
            .thenCombine(future2, (s1, s2) -> s1 + " " + s2);
    }
}
```

## Best Practices

### 1. Thread Safety

```java
public class ThreadSafeExample {
    // Use volatile for shared flags
    private volatile boolean running = true;
    
    // Use atomic classes for counters
    private AtomicInteger counter = new AtomicInteger(0);
    
    // Use immutable objects when possible
    private final String name;
    
    public ThreadSafeExample(String name) {
        this.name = name;
    }
    
    public void increment() {
        counter.incrementAndGet();
    }
}
```

### 2. Resource Management

```java
public class ResourceManagement {
    private ExecutorService executor;
    
    public void initializePool() {
        executor = Executors.newFixedThreadPool(
            Runtime.getRuntime().availableProcessors()
        );
    }
    
    @PreDestroy
    public void cleanup() {
        if (executor != null) {
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
    }
}
```

### 3. Exception Handling

```java
public class ThreadExceptionHandling {
    private ExecutorService executor = Executors.newFixedThreadPool(5);
    
    public void handleExceptions() {
        Thread.setDefaultUncaughtExceptionHandler((thread, throwable) -> {
            System.err.println("Thread " + thread.getName() + " threw exception: " + throwable.getMessage());
        });
        
        executor.submit(() -> {
            try {
                // Risky operation
            } catch (Exception e) {
                // Handle exception
                Thread.currentThread().getUncaughtExceptionHandler()
                    .uncaughtException(Thread.currentThread(), e);
            }
        });
    }
}
```

## Testing Multithreaded Code

```java
public class MultithreadingTest {
    @Test
    public void testConcurrentExecution() throws InterruptedException {
        CountDownLatch latch = new CountDownLatch(100);
        AtomicInteger counter = new AtomicInteger(0);
        
        for (int i = 0; i < 100; i++) {
            new Thread(() -> {
                counter.incrementAndGet();
                latch.countDown();
            }).start();
        }
        
        latch.await(1, TimeUnit.SECONDS);
        assertEquals(100, counter.get());
    }
}
```

## Summary
- Use appropriate synchronization mechanisms
- Choose the right concurrent collections
- Implement proper thread pool management
- Handle exceptions in threads
- Test multithreaded code thoroughly
- Follow thread safety best practices
- Clean up resources properly 