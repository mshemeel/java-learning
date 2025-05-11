# Saga Pattern

The Saga pattern is a microservices design pattern for managing distributed transactions across multiple services.

## Overview

In a microservices architecture, each service has its own database. This can create challenges when a business transaction spans multiple services. The Saga pattern is a sequence of local transactions where each transaction updates data within a single service, and then publishes an event to trigger the next transaction step.

## Types of Saga Implementation

There are two main ways to implement the saga pattern:

1. **Choreography**: Each local transaction publishes domain events that trigger local transactions in other services.
2. **Orchestration**: A central coordinator (orchestrator) directs and controls the steps of the saga.

## Example: Payment Processing Saga

Consider a payment processing flow in a fintech application:

1. User initiates a payment
2. Payment service validates the payment request
3. Account service checks if the user has sufficient funds
4. Transaction service creates a pending transaction
5. Notification service sends confirmation to the user

### Choreography Implementation

```java
// Payment Service
@Service
public class PaymentService {
    
    @Autowired
    private KafkaTemplate<String, PaymentEvent> kafkaTemplate;
    
    public void processPayment(Payment payment) {
        // Validate payment
        boolean isValid = validatePayment(payment);
        
        if (isValid) {
            // Publish event to trigger account check
            PaymentEvent event = new PaymentEvent(payment.getId(), PaymentStatus.VALIDATED);
            kafkaTemplate.send("payment-events", event);
        } else {
            // Handle invalid payment
            PaymentEvent event = new PaymentEvent(payment.getId(), PaymentStatus.FAILED);
            kafkaTemplate.send("payment-events", event);
        }
    }
}

// Account Service
@Service
@KafkaListener(topics = "payment-events")
public class AccountService {
    
    @Autowired
    private KafkaTemplate<String, AccountEvent> kafkaTemplate;
    
    public void handlePaymentEvent(PaymentEvent event) {
        if (event.getStatus() == PaymentStatus.VALIDATED) {
            // Check if account has sufficient funds
            boolean hasSufficientFunds = checkSufficientFunds(event.getPaymentId());
            
            if (hasSufficientFunds) {
                // Publish event to create transaction
                AccountEvent accountEvent = new AccountEvent(
                    event.getPaymentId(), 
                    AccountStatus.FUNDS_RESERVED
                );
                kafkaTemplate.send("account-events", accountEvent);
            } else {
                // Handle insufficient funds
                AccountEvent accountEvent = new AccountEvent(
                    event.getPaymentId(), 
                    AccountStatus.INSUFFICIENT_FUNDS
                );
                kafkaTemplate.send("account-events", accountEvent);
            }
        }
    }
}
```

### Orchestration Implementation

```java
@Service
public class PaymentSagaOrchestrator {
    
    @Autowired
    private PaymentService paymentService;
    
    @Autowired
    private AccountService accountService;
    
    @Autowired
    private TransactionService transactionService;
    
    @Autowired
    private NotificationService notificationService;
    
    public void processPayment(Payment payment) {
        // Step 1: Validate payment
        try {
            boolean isValid = paymentService.validatePayment(payment);
            if (!isValid) {
                compensatePaymentFailure(payment);
                return;
            }
            
            // Step 2: Check account funds
            boolean hasFunds = accountService.checkAndReserveFunds(payment);
            if (!hasFunds) {
                compensateInsufficientFunds(payment);
                return;
            }
            
            // Step 3: Create transaction
            Transaction transaction = transactionService.createTransaction(payment);
            if (transaction == null) {
                compensateTransactionFailure(payment);
                return;
            }
            
            // Step 4: Send notification
            notificationService.notifyUser(payment, transaction);
            
            // Complete the saga
            completePayment(payment, transaction);
            
        } catch (Exception e) {
            // Handle exceptions and trigger compensation
            handleSagaError(payment, e);
        }
    }
    
    private void compensatePaymentFailure(Payment payment) {
        // Compensation logic for payment validation failure
    }
    
    private void compensateInsufficientFunds(Payment payment) {
        // Compensation logic for insufficient funds
    }
    
    private void compensateTransactionFailure(Payment payment) {
        // Release reserved funds
        accountService.releaseReservedFunds(payment);
    }
    
    private void handleSagaError(Payment payment, Exception e) {
        // General compensation logic
        accountService.releaseReservedFunds(payment);
        transactionService.cancelTransaction(payment);
        notificationService.sendFailureNotification(payment, e.getMessage());
    }
    
    private void completePayment(Payment payment, Transaction transaction) {
        // Finalize the payment
        accountService.commitReservedFunds(payment);
        transactionService.finalizeTransaction(transaction);
    }
}
```

## Advantages of Saga Pattern

1. **Maintains data consistency** across microservices without distributed transactions
2. **Improves system resilience** through compensation mechanisms
3. **Provides better scalability** as services can be scaled independently
4. **Enhances fault isolation** as failures in one service don't block others

## Disadvantages of Saga Pattern

1. **Increased complexity** in implementation and testing
2. **Eventual consistency** instead of immediate consistency
3. **Challenging debugging** across service boundaries
4. **Careful design needed** for compensation transactions

## When to Use Saga Pattern

The Saga pattern is ideal when:

1. Business transactions span multiple services
2. Immediate consistency is not required
3. The system needs to be highly available
4. Services must remain decoupled

## Further Reading

- [Microservices Pattern: Saga](https://microservices.io/patterns/data/saga.html)
- [Chris Richardson on Saga Pattern](https://www.thoughtworks.com/insights/blog/microservices/implement-saga-pattern-using-kafka) 