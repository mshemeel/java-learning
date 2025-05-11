# Spring Boot 3 Kafka Integration

## Table of Contents
- [Introduction](#introduction)
- [Kafka Core Concepts](#kafka-core-concepts)
- [Setup and Dependencies](#setup-and-dependencies)
- [Kafka Configuration in Spring Boot](#kafka-configuration-in-spring-boot)
- [Creating a Producer](#creating-a-producer)
- [Creating a Consumer](#creating-a-consumer)
- [Topic Configuration](#topic-configuration)
- [Message Serialization/Deserialization](#message-serializationdeserialization)
- [Error Handling](#error-handling)
- [Transaction Support](#transaction-support)
- [Testing Kafka Components](#testing-kafka-components)
- [Monitoring and Metrics](#monitoring-and-metrics)
- [Real-World Example](#real-world-example)
- [Best Practices](#best-practices)
- [References](#references)

## Introduction

Apache Kafka is a distributed streaming platform that enables building real-time data pipelines and streaming applications. Spring Boot provides excellent integration with Kafka through the `spring-kafka` library, making it easy to configure producers, consumers, and other Kafka-related components.

This guide focuses on Spring Boot 3.x integration with Kafka, covering the basics to advanced features with practical examples.

## Kafka Core Concepts

Before diving into Spring Boot integration, let's understand the core concepts of Apache Kafka:

### Topics and Partitions

- **Topic**: A named stream of records. Similar to a table in a database but without constraints.
- **Partition**: Each topic is divided into partitions. Partitions allow Kafka to scale horizontally and provide parallelism.
- **Partition Ordering**: Messages within a partition are ordered, but there's no guarantee of ordering across partitions.
- **Partition Key**: Determines which partition a message goes to. Messages with the same key always go to the same partition.

```
                      ┌─────────────┐
                      │   Topic A   │
                      └─────────────┘
                            │
         ┌─────────────┬────┼────┬─────────────┐
         ▼             ▼             ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Partition 0 │ │ Partition 1 │ │ Partition 2 │
└─────────────┘ └─────────────┘ └─────────────┘
```

### Producers and Consumers

- **Producer**: Application that publishes records to Kafka topics.
- **Consumer**: Application that subscribes to topics and processes the records.
- **Publish-Subscribe Pattern**: Multiple consumers can read from the same topic.

```
┌───────────┐     ┌─────────────┐     ┌───────────┐
│ Producer  │────▶│   Topic     │────▶│ Consumer  │
└───────────┘     └─────────────┘     └───────────┘
                        │
                        │             ┌───────────┐
                        └────────────▶│ Consumer  │
                                      └───────────┘
```

### Brokers and Clusters

- **Broker**: A single Kafka server that stores data and serves client requests.
- **Cluster**: Multiple brokers working together for scalability and fault tolerance.
- **Controller**: One broker in the cluster acts as the controller, responsible for administrative operations.

```
┌───────────────────────────────────────────┐
│               Kafka Cluster               │
│                                           │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐  │
│  │ Broker 0│   │ Broker 1│   │ Broker 2│  │
│  └─────────┘   └─────────┘   └─────────┘  │
│                                           │
└───────────────────────────────────────────┘
```

### Consumer Groups

- **Consumer Group**: A set of consumers that cooperate to consume a set of topics.
- **Load Balancing**: Each partition is consumed by only one consumer within a group.
- **Scalability**: Adding more consumers to a group allows processing more partitions in parallel.

```
┌───────────────────────────────────┐
│        Consumer Group A           │
│                                   │
│  ┌──────────┐  ┌──────────┐       │
│  │Consumer 1│  │Consumer 2│       │
│  └──────────┘  └──────────┘       │
└───────┬────────────┬──────────────┘
        │            │
        ▼            ▼
┌──────────────┐ ┌──────────────┐
│ Partition 0  │ │ Partition 1  │
└──────────────┘ └──────────────┘
```

### Offset Management

- **Offset**: A sequential ID given to messages in a partition.
- **Consumer Offset**: The position of a consumer in a partition.
- **Commit Offset**: Consumers periodically commit their position to resume from where they left off.

```
┌─────────────────────────────────────────┐
│              Partition                  │
│                                         │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐│
│  │  0  │ │  1  │ │  2  │ │  3  │ │  4  ││
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘│
└─────────────────────────────────────────┘
                      ▲
                      │
                ┌───────────┐
                │Consumer   │
                │Offset: 2  │
                └───────────┘
```

### Message Delivery Semantics

- **At Most Once**: Messages may be lost but never redelivered.
- **At Least Once**: Messages are never lost but may be redelivered.
- **Exactly Once**: Each message is delivered exactly once (achieved with transactions).

### Replication and Fault Tolerance

- **Replication Factor**: Number of copies of data across the cluster.
- **Leader**: Each partition has one leader broker handling all reads and writes.
- **Follower**: Replicas that replicate data from the leader.
- **In-Sync Replica (ISR)**: Followers that are up-to-date with the leader.

```
┌─────────────────────────────────────────────────────┐
│                   Topic Partition                   │
│                                                     │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐           │
│  │ Leader  │   │Follower │   │Follower │           │
│  │(Broker 0)│──▶│(Broker 1)│──▶│(Broker 2)│           │
│  └─────────┘   └─────────┘   └─────────┘           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Log Compaction

- **Log Compaction**: Ensures Kafka retains at least the last known value for each key.
- **Compacted Topics**: Special topics that maintain a clean, compacted version of the data.
- **Use Case**: Perfect for event sourcing and maintaining the latest state.

These core concepts form the foundation of Kafka's architecture. Understanding them is crucial before diving into Spring Boot's integration with Kafka.

## Setup and Dependencies

To use Kafka with Spring Boot 3, add the following dependencies to your `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>
```

For Gradle (`build.gradle`):

```groovy
implementation 'org.springframework.kafka:spring-kafka'
```

For testing:

```xml
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka-test</artifactId>
    <scope>test</scope>
</dependency>
```

## Kafka Configuration in Spring Boot

Configure Kafka in your `application.yml` or `application.properties`:

```yaml
spring:
  kafka:
    bootstrap-servers: localhost:9092
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
      properties:
        spring.json.add.type.headers: false
    consumer:
      group-id: my-group-id
      auto-offset-reset: earliest
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
      properties:
        spring.json.trusted.packages: com.example.model
    admin:
      auto-create: true  # Automatically create topics
```

## Creating a Producer

A simple producer using Spring Kafka's `KafkaTemplate`:

```java
@Service
public class OrderProducer {
    private static final Logger logger = LoggerFactory.getLogger(OrderProducer.class);
    private final KafkaTemplate<String, Order> kafkaTemplate;
    private final String topicName = "orders";

    public OrderProducer(KafkaTemplate<String, Order> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendOrder(Order order) {
        kafkaTemplate.send(topicName, order.getId().toString(), order)
            .addCallback(
                result -> logger.info("Order sent successfully: {}", order.getId()),
                ex -> logger.error("Failed to send order: {}", ex.getMessage())
            );
    }
    
    // Using CompletableFuture approach
    public CompletableFuture<SendResult<String, Order>> sendOrderAsync(Order order) {
        return kafkaTemplate.send(topicName, order.getId().toString(), order)
            .completable()
            .whenComplete((result, ex) -> {
                if (ex == null) {
                    logger.info("Order sent successfully: {} with offset: {}", 
                        order.getId(), result.getRecordMetadata().offset());
                } else {
                    logger.error("Failed to send order: {}", ex.getMessage());
                }
            });
    }
}
```

The `Order` class:

```java
public class Order {
    private Long id;
    private String customerName;
    private BigDecimal amount;
    private LocalDateTime orderDate;
    
    // Constructors, getters, setters
}
```

## Creating a Consumer

A consumer using the `@KafkaListener` annotation:

```java
@Service
public class OrderConsumer {
    private static final Logger logger = LoggerFactory.getLogger(OrderConsumer.class);
    
    @KafkaListener(topics = "orders", groupId = "order-processing-group")
    public void listen(Order order, @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
                      @Header(KafkaHeaders.RECEIVED_TIMESTAMP) long timestamp) {
        logger.info("Received order: {}, from partition: {}, timestamp: {}", 
            order.getId(), partition, timestamp);
        
        // Process the order
        processOrder(order);
    }
    
    private void processOrder(Order order) {
        // Business logic for processing order
        logger.info("Processing order: {}, amount: {}", order.getId(), order.getAmount());
    }
}
```

Configure the consumer factory:

```java
@Configuration
public class KafkaConsumerConfig {

    @Bean
    public ConsumerFactory<String, Order> consumerFactory(KafkaProperties kafkaProperties) {
        Map<String, Object> props = new HashMap<>(kafkaProperties.buildConsumerProperties());
        
        return new DefaultKafkaConsumerFactory<>(props, 
            new StringDeserializer(),
            new JsonDeserializer<>(Order.class));
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, Order> kafkaListenerContainerFactory(
            ConsumerFactory<String, Order> consumerFactory) {
        ConcurrentKafkaListenerContainerFactory<String, Order> factory = 
            new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory);
        return factory;
    }
}
```

## Topic Configuration

Configuration to automatically create topics:

```java
@Configuration
public class KafkaTopicConfig {

    @Bean
    public NewTopic ordersTopic() {
        // Create a topic with 3 partitions and replication factor of 1
        return TopicBuilder.name("orders")
                .partitions(3)
                .replicas(1)
                .configs(Map.of(
                    "retention.ms", "604800000", // 1 week
                    "segment.bytes", "1073741824" // 1 GB
                ))
                .build();
    }
    
    @Bean
    public NewTopic notificationsTopic() {
        return TopicBuilder.name("notifications")
                .partitions(2)
                .replicas(1)
                .build();
    }
}
```

## Message Serialization/Deserialization

Using custom serializers and deserializers:

```java
public class OrderSerializer implements Serializer<Order> {
    private final ObjectMapper objectMapper = new ObjectMapper()
        .registerModule(new JavaTimeModule())
        .configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);

    @Override
    public byte[] serialize(String topic, Order data) {
        try {
            return objectMapper.writeValueAsBytes(data);
        } catch (Exception e) {
            throw new SerializationException("Error serializing Order", e);
        }
    }
}

public class OrderDeserializer implements Deserializer<Order> {
    private final ObjectMapper objectMapper = new ObjectMapper()
        .registerModule(new JavaTimeModule())
        .configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);

    @Override
    public Order deserialize(String topic, byte[] data) {
        try {
            return objectMapper.readValue(data, Order.class);
        } catch (Exception e) {
            throw new SerializationException("Error deserializing Order", e);
        }
    }
}
```

## Error Handling

Error handling with a custom error handler:

```java
@Configuration
public class KafkaErrorHandlingConfig {

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, Order> kafkaListenerContainerFactory(
            ConsumerFactory<String, Order> consumerFactory) {
        ConcurrentKafkaListenerContainerFactory<String, Order> factory = 
            new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory);
        factory.setErrorHandler(new SeekToCurrentErrorHandler(
            new DeadLetterPublishingRecoverer(kafkaTemplate), 
            new FixedBackOff(1000L, 3) // Retry 3 times with 1 second delay
        ));
        return factory;
    }
    
    // For Spring Boot 3
    @Bean
    public DefaultErrorHandler errorHandler(KafkaTemplate<String, Object> template) {
        DeadLetterPublishingRecoverer recoverer = new DeadLetterPublishingRecoverer(template,
            (record, exception) -> new TopicPartition("orders-failed", record.partition()));
        
        DefaultErrorHandler errorHandler = new DefaultErrorHandler(
            recoverer, 
            new FixedBackOff(1000L, 3));
            
        // Exception to be retried - customize based on your needs
        errorHandler.addRetryableExceptions(RecoverableDataAccessException.class);
        
        // Exception NOT to be retried
        errorHandler.addNotRetryableExceptions(NullPointerException.class);
        
        return errorHandler;
    }
}
```

For a listener:

```java
@KafkaListener(topics = "orders", groupId = "order-processing-group")
public void listen(Order order, Acknowledgment acknowledgment) {
    try {
        // Process the order
        processOrder(order);
        acknowledgment.acknowledge();
    } catch (Exception e) {
        // Custom error handling logic
        logger.error("Error processing order: {}", e.getMessage());
        // Depending on the error, you might want to:
        // 1. Acknowledge and move on
        // 2. Not acknowledge and let it be retried
        // 3. Publish to a dead-letter topic
        throw e; // Let the error handler defined earlier handle it
    }
}
```

## Transaction Support

Enabling transactions in Spring Kafka:

```java
@Configuration
public class KafkaTransactionConfig {

    @Bean
    public ProducerFactory<String, Order> producerFactory(KafkaProperties kafkaProperties) {
        Map<String, Object> props = new HashMap<>(kafkaProperties.buildProducerProperties());
        
        // Enable idempotence for exactly-once semantics
        props.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, true);
        
        // Set transaction ID prefix
        props.put(ProducerConfig.TRANSACTIONAL_ID_CONFIG, "tx-");
        
        return new DefaultKafkaProducerFactory<>(props);
    }

    @Bean
    public KafkaTemplate<String, Order> kafkaTemplate(ProducerFactory<String, Order> producerFactory) {
        KafkaTemplate<String, Order> template = new KafkaTemplate<>(producerFactory);
        // Enable transactions for the template
        template.setDefaultTopic("orders");
        return template;
    }
    
    @Bean
    public KafkaTransactionManager<String, Order> kafkaTransactionManager(
            ProducerFactory<String, Order> producerFactory) {
        return new KafkaTransactionManager<>(producerFactory);
    }
}
```

Using transactions in a service:

```java
@Service
@Transactional("kafkaTransactionManager")
public class TransactionalOrderService {
    private final KafkaTemplate<String, Order> kafkaTemplate;
    private final OrderRepository orderRepository;

    public TransactionalOrderService(KafkaTemplate<String, Order> kafkaTemplate, 
                                   OrderRepository orderRepository) {
        this.kafkaTemplate = kafkaTemplate;
        this.orderRepository = orderRepository;
    }

    public void createOrderWithNotification(Order order) {
        // Save to database
        orderRepository.save(order);
        
        // Send to Kafka - this will be in the same transaction
        kafkaTemplate.send("orders", order.getId().toString(), order);
        
        // If an exception is thrown here, both the database save and Kafka send will be rolled back
        ProcessNotification notification = new ProcessNotification(order.getId(), "Order created");
        kafkaTemplate.send("notifications", order.getId().toString(), notification);
    }
}
```

## Testing Kafka Components

Testing with `EmbeddedKafka`:

```java
@SpringBootTest
@EmbeddedKafka(partitions = 1, topics = {"orders", "notifications"})
class OrderServiceIntegrationTest {

    @Autowired
    private OrderProducer producer;
    
    @Autowired
    private Consumer<String, Order> consumer;
    
    @Autowired
    private KafkaTemplate<String, Order> kafkaTemplate;
    
    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;
    
    @BeforeEach
    void setUp() {
        consumer.subscribe(Collections.singletonList("orders"));
    }
    
    @Test
    void testOrderProducer() throws Exception {
        // Create an order
        Order order = new Order(1L, "Customer 1", BigDecimal.valueOf(99.99), LocalDateTime.now());
        
        // Send the order
        producer.sendOrder(order);
        
        // Verify the order was sent to Kafka
        ConsumerRecords<String, Order> records = KafkaTestUtils.getRecords(consumer, Duration.ofSeconds(5));
        assertThat(records.count()).isEqualTo(1);
        
        ConsumerRecord<String, Order> record = records.iterator().next();
        assertThat(record.key()).isEqualTo("1");
        assertThat(record.value().getId()).isEqualTo(1L);
        assertThat(record.value().getCustomerName()).isEqualTo("Customer 1");
    }
}
```

Mock testing:

```java
@ExtendWith(MockitoExtension.class)
class OrderProducerUnitTest {

    @Mock
    private KafkaTemplate<String, Order> kafkaTemplate;
    
    @Mock
    private ListenableFuture<SendResult<String, Order>> future;
    
    @InjectMocks
    private OrderProducer producer;
    
    @Test
    void testSendOrderSuccess() {
        // Create an order
        Order order = new Order(1L, "Customer 1", BigDecimal.valueOf(99.99), LocalDateTime.now());
        
        // Mock success response
        when(kafkaTemplate.send(anyString(), anyString(), any(Order.class))).thenReturn(future);
        doAnswer(invocation -> {
            ListenableFutureCallback<SendResult<String, Order>> callback = invocation.getArgument(0);
            callback.onSuccess(mock(SendResult.class));
            return null;
        }).when(future).addCallback(any(ListenableFutureCallback.class));
        
        // Call the method
        producer.sendOrder(order);
        
        // Verify
        verify(kafkaTemplate).send("orders", "1", order);
        verify(future).addCallback(any(ListenableFutureCallback.class));
    }
}
```

## Monitoring and Metrics

Spring Boot 3 automatically provides Kafka metrics when the Actuator dependency is added:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

Configure Actuator in `application.yml`:

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,kafkametrics
  metrics:
    export:
      prometheus:
        enabled: true
  endpoint:
    health:
      show-details: always
```

## Real-World Example

In this example, we'll build a real-time order processing system with Kafka:

```java
// Order data model
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    private Long id;
    private String customerName;
    private BigDecimal amount;
    private LocalDateTime orderDate;
    private OrderStatus status;
    
    public enum OrderStatus {
        CREATED, PROCESSING, SHIPPED, DELIVERED, CANCELED
    }
}

// Order Controller to create orders
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;
    
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }
    
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.CREATED);
        Order createdOrder = orderService.createOrder(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable Long id) {
        return orderService.getOrder(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}

// Order Service
@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderProducer orderProducer;
    
    public OrderService(OrderRepository orderRepository, OrderProducer orderProducer) {
        this.orderRepository = orderRepository;
        this.orderProducer = orderProducer;
    }
    
    @Transactional
    public Order createOrder(Order order) {
        // Save to database
        Order savedOrder = orderRepository.save(order);
        
        // Send to Kafka
        orderProducer.sendOrder(savedOrder);
        
        return savedOrder;
    }
    
    public Optional<Order> getOrder(Long id) {
        return orderRepository.findById(id);
    }
}

// Order Producer
@Service
public class OrderProducer {
    private static final Logger logger = LoggerFactory.getLogger(OrderProducer.class);
    private final KafkaTemplate<String, Order> kafkaTemplate;
    private final String orderTopic;
    
    public OrderProducer(KafkaTemplate<String, Order> kafkaTemplate, 
                       @Value("${app.kafka.topics.orders}") String orderTopic) {
        this.kafkaTemplate = kafkaTemplate;
        this.orderTopic = orderTopic;
    }
    
    public void sendOrder(Order order) {
        logger.info("Sending order to Kafka: {}", order.getId());
        kafkaTemplate.send(orderTopic, order.getId().toString(), order)
            .addCallback(
                result -> logger.info("Order sent successfully: {}, offset: {}", 
                    order.getId(), result.getRecordMetadata().offset()),
                ex -> logger.error("Failed to send order: {}", ex.getMessage())
            );
    }
}

// Order Processing Consumer
@Service
public class OrderProcessingConsumer {
    private static final Logger logger = LoggerFactory.getLogger(OrderProcessingConsumer.class);
    private final OrderRepository orderRepository;
    private final KafkaTemplate<String, Order> kafkaTemplate;
    
    public OrderProcessingConsumer(OrderRepository orderRepository,
                                 KafkaTemplate<String, Order> kafkaTemplate) {
        this.orderRepository = orderRepository;
        this.kafkaTemplate = kafkaTemplate;
    }
    
    @KafkaListener(topics = "${app.kafka.topics.orders}", groupId = "${app.kafka.group-id.order-processing}")
    public void processOrder(Order order, Acknowledgment acknowledgment) {
        logger.info("Processing order: {}", order.getId());
        
        try {
            // Update order status
            order.setStatus(OrderStatus.PROCESSING);
            orderRepository.save(order);
            
            // Business logic for processing order
            processOrderBusiness(order);
            
            // Update order status to SHIPPED
            order.setStatus(OrderStatus.SHIPPED);
            orderRepository.save(order);
            
            // Send to shipping topic
            kafkaTemplate.send("order-shipped", order.getId().toString(), order);
            
            // Acknowledge the message
            acknowledgment.acknowledge();
            
            logger.info("Order processed successfully: {}", order.getId());
        } catch (Exception e) {
            logger.error("Error processing order: {}, reason: {}", order.getId(), e.getMessage());
            // Don't acknowledge - will be retried based on retry policy
            throw e; 
        }
    }
    
    private void processOrderBusiness(Order order) {
        // Simulate order processing
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}

// Shipping Service Consumer
@Service
public class ShippingServiceConsumer {
    private static final Logger logger = LoggerFactory.getLogger(ShippingServiceConsumer.class);
    private final OrderRepository orderRepository;
    private final KafkaTemplate<String, Order> kafkaTemplate;
    
    public ShippingServiceConsumer(OrderRepository orderRepository,
                                KafkaTemplate<String, Order> kafkaTemplate) {
        this.orderRepository = orderRepository;
        this.kafkaTemplate = kafkaTemplate;
    }
    
    @KafkaListener(topics = "order-shipped", groupId = "shipping-service")
    public void shipOrder(Order order) {
        logger.info("Shipping order: {}", order.getId());
        
        // Simulate shipping process
        try {
            Thread.sleep(2000);
            
            // Update order status to DELIVERED
            order.setStatus(OrderStatus.DELIVERED);
            orderRepository.save(order);
            
            // Send to completion topic
            kafkaTemplate.send("order-delivered", order.getId().toString(), order);
            
            logger.info("Order shipped successfully: {}", order.getId());
        } catch (Exception e) {
            logger.error("Error shipping order: {}, reason: {}", order.getId(), e.getMessage());
            throw new RuntimeException("Shipping failed", e);
        }
    }
}

// Application.yml configuration
```yaml
spring:
  kafka:
    bootstrap-servers: localhost:9092
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
      properties:
        spring.json.add.type.headers: false
    consumer:
      auto-offset-reset: earliest
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
      properties:
        spring.json.trusted.packages: com.example.model
      enable-auto-commit: false
    listener:
      ack-mode: MANUAL

app:
  kafka:
    topics:
      orders: orders
      shipped: order-shipped
      delivered: order-delivered
    group-id:
      order-processing: order-processing-group
      shipping: shipping-service
```

## Best Practices

1. **Always Configure Proper Serialization/Deserialization**
   - Use appropriate serializers based on your message format (JSON, Avro, etc.)
   - Consider using schema registry for complex data structures

2. **Implement Proper Error Handling**
   - Use dead-letter topics for failed messages
   - Implement retry mechanisms with backoff policies
   - Log failed messages with detailed error information

3. **Use Transactions When Necessary**
   - Enable transactions when you need atomic operations across multiple topics
   - Be aware of the performance implications of transactions

4. **Monitor Your Kafka Applications**
   - Enable metrics with Spring Boot Actuator
   - Set up alerting for important metrics like lag, throughput, and errors
   - Use distributed tracing to track message flow

5. **Test Thoroughly**
   - Use `@EmbeddedKafka` for integration testing
   - Mock Kafka components for unit testing
   - Test failure scenarios and recovery processes

6. **Optimize Performance**
   - Configure batch sizes and linger time for producers
   - Set appropriate concurrency for consumers
   - Monitor and adjust partition count based on throughput

7. **Secure Your Kafka Applications**
   - Use SSL/TLS for encryption
   - Implement authentication with SASL
   - Set up authorization with ACLs

8. **Consider Message Ordering**
   - Use a single partition if strict ordering is required
   - Use message keys to ensure related messages go to the same partition

9. **Implement Proper Shutdown Hooks**
   - Ensure clean shutdown of Kafka producers and consumers
   - Handle application lifecycle events properly

10. **Document Your Kafka Architecture**
    - Document topic schemas and their purposes
    - Document consumer groups and their responsibilities
    - Create a diagram of message flows

## References

- [Spring for Apache Kafka](https://spring.io/projects/spring-kafka)
- [Spring Boot Kafka Official Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/messaging.html#messaging.kafka)
- [Apache Kafka Documentation](https://kafka.apache.org/documentation/)
- [Confluent Developer](https://developer.confluent.io/) 