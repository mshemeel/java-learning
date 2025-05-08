# Spring Boot AOP (Aspect-Oriented Programming)

## Table of Contents
1. [Introduction to AOP](#introduction)
2. [Core Concepts](#core-concepts)
3. [AOP Annotations](#aop-annotations)
4. [Pointcut Expressions](#pointcut-expressions)
5. [Advice Types](#advice-types)
6. [Common Use Cases](#common-use-cases)
7. [Best Practices](#best-practices)

## Introduction

Aspect-Oriented Programming (AOP) complements Object-Oriented Programming (OOP) by providing another way of thinking about program structure. While OOP modularizes through classes, AOP modularizes cross-cutting concerns.

### Dependencies

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

### Enable AOP
```java
@Configuration
@EnableAspectJAutoProxy
public class AopConfig {
    // AOP Configuration
}
```

## Core Concepts

### 1. Aspect
A modularization of a concern that cuts across multiple classes.

```java
@Aspect
@Component
public class LoggingAspect {
    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);
    
    @Before("execution(* com.example.service.*.*(..))")
    public void logBefore(JoinPoint joinPoint) {
        logger.info("Before executing: " + joinPoint.getSignature().getName());
    }
}
```

### 2. Join Point
A point during the execution of a program, such as the execution of a method or handling of an exception.

```java
@Aspect
@Component
public class JoinPointDemoAspect {
    @Before("execution(* com.example.service.*.*(..))")
    public void demonstrateJoinPoint(JoinPoint joinPoint) {
        // Method name
        String methodName = joinPoint.getSignature().getName();
        
        // Arguments
        Object[] args = joinPoint.getArgs();
        
        // Target class
        String className = joinPoint.getTarget().getClass().getSimpleName();
        
        System.out.println("Executing " + className + "." + methodName);
    }
}
```

### 3. Pointcut
A predicate that matches join points.

```java
@Aspect
@Component
public class PointcutDemoAspect {
    // Pointcut declaration
    @Pointcut("execution(* com.example.service.*.*(..))")
    public void serviceLayer() {}
    
    // Reusing pointcut
    @Before("serviceLayer()")
    public void beforeService() {
        // Advice implementation
    }
    
    @After("serviceLayer()")
    public void afterService() {
        // Advice implementation
    }
}
```

## AOP Annotations

### 1. @Before
```java
@Aspect
@Component
public class BeforeAspect {
    @Before("execution(* com.example.service.UserService.createUser(..))")
    public void beforeUserCreation(JoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();
        logger.info("About to create user with data: " + Arrays.toString(args));
    }
}
```

### 2. @After
```java
@Aspect
@Component
public class AfterAspect {
    @After("execution(* com.example.service.UserService.deleteUser(..))")
    public void afterUserDeletion(JoinPoint joinPoint) {
        logger.info("User deletion completed");
    }
}
```

### 3. @Around
```java
@Aspect
@Component
public class AroundAspect {
    @Around("execution(* com.example.service.*.*(..))")
    public Object measureExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        
        Object result = joinPoint.proceed();
        
        long executionTime = System.currentTimeMillis() - start;
        logger.info(joinPoint.getSignature() + " executed in " + executionTime + "ms");
        
        return result;
    }
}
```

### 4. @AfterReturning
```java
@Aspect
@Component
public class AfterReturningAspect {
    @AfterReturning(
        pointcut = "execution(* com.example.service.UserService.findUser(..))",
        returning = "result"
    )
    public void afterReturningUser(JoinPoint joinPoint, Object result) {
        logger.info("Found user: " + result);
    }
}
```

### 5. @AfterThrowing
```java
@Aspect
@Component
public class AfterThrowingAspect {
    @AfterThrowing(
        pointcut = "execution(* com.example.service.*.*(..))",
        throwing = "ex"
    )
    public void afterThrowingException(JoinPoint joinPoint, Exception ex) {
        logger.error("Method " + joinPoint.getSignature() + " threw exception: " + ex.getMessage());
    }
}
```

## Pointcut Expressions

### 1. Method Execution
```java
@Aspect
@Component
public class MethodExecutionAspect {
    // Any public method
    @Before("execution(public * *(..))")
    public void beforePublicMethod() {}
    
    // Specific return type
    @Before("execution(String com.example.service.*.*(..))")
    public void beforeStringReturn() {}
    
    // Specific parameters
    @Before("execution(* *.*(.., String))")
    public void beforeMethodWithStringParam() {}
}
```

### 2. Within
```java
@Aspect
@Component
public class WithinAspect {
    // All methods in a package
    @Before("within(com.example.service.*)")
    public void beforeServicePackage() {}
    
    // All methods in a class
    @Before("within(com.example.service.UserService)")
    public void beforeUserService() {}
}
```

### 3. Bean
```java
@Aspect
@Component
public class BeanAspect {
    // Specific bean
    @Before("bean(userService)")
    public void beforeUserServiceBean() {}
    
    // Bean pattern
    @Before("bean(*Service)")
    public void beforeAnyServiceBean() {}
}
```

## Common Use Cases

### 1. Logging Aspect
```java
@Aspect
@Component
public class LoggingAspect {
    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);
    
    @Around("execution(* com.example.service.*.*(..))")
    public Object logMethod(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        
        logger.info("=> Starting {} in {}", methodName, className);
        
        try {
            Object result = joinPoint.proceed();
            logger.info("<= Completed {} in {}", methodName, className);
            return result;
        } catch (Exception e) {
            logger.error("!! Exception in {}.{}: {}", className, methodName, e.getMessage());
            throw e;
        }
    }
}
```

### 2. Performance Monitoring
```java
@Aspect
@Component
public class PerformanceAspect {
    private static final Logger logger = LoggerFactory.getLogger(PerformanceAspect.class);
    
    @Around("@annotation(Monitored)")
    public Object measurePerformance(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.nanoTime();
        
        try {
            return joinPoint.proceed();
        } finally {
            long endTime = System.nanoTime();
            long duration = (endTime - startTime) / 1_000_000; // Convert to milliseconds
            
            logger.info("Method {} took {}ms to execute",
                joinPoint.getSignature().getName(), duration);
        }
    }
}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Monitored {}
```

### 3. Security Aspect
```java
@Aspect
@Component
public class SecurityAspect {
    @Before("@annotation(secured)")
    public void checkSecurity(JoinPoint joinPoint, Secured secured) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        if (!hasRequiredRole(auth, secured.value())) {
            throw new AccessDeniedException("Access denied");
        }
    }
    
    private boolean hasRequiredRole(Authentication auth, String[] roles) {
        return Arrays.stream(roles)
            .anyMatch(role -> auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_" + role)));
    }
}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Secured {
    String[] value();
}
```

### 4. Caching Aspect
```java
@Aspect
@Component
public class CachingAspect {
    private Map<String, Object> cache = new ConcurrentHashMap<>();
    
    @Around("@annotation(Cacheable)")
    public Object cache(ProceedingJoinPoint joinPoint) throws Throwable {
        String key = generateKey(joinPoint);
        
        if (cache.containsKey(key)) {
            return cache.get(key);
        }
        
        Object result = joinPoint.proceed();
        cache.put(key, result);
        return result;
    }
    
    private String generateKey(JoinPoint joinPoint) {
        return joinPoint.getSignature().toString() + 
               Arrays.toString(joinPoint.getArgs());
    }
}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Cacheable {}
```

### 5. Transaction Aspect
```java
@Aspect
@Component
public class TransactionAspect {
    @Autowired
    private TransactionTemplate transactionTemplate;
    
    @Around("@annotation(Transactional)")
    public Object handleTransaction(ProceedingJoinPoint joinPoint) throws Throwable {
        return transactionTemplate.execute(status -> {
            try {
                return joinPoint.proceed();
            } catch (Throwable throwable) {
                status.setRollbackOnly();
                throw new RuntimeException(throwable);
            }
        });
    }
}
```

## Best Practices

### 1. Keep Aspects Focused
```java
@Aspect
@Component
public class SingleResponsibilityAspect {
    // Good: Single responsibility
    @Before("execution(* com.example.service.*.*(..))")
    public void logMethodEntry(JoinPoint joinPoint) {
        // Only logging logic here
    }
    
    // Bad: Multiple responsibilities
    @Before("execution(* com.example.service.*.*(..))")
    public void doMultipleThings(JoinPoint joinPoint) {
        // Logging
        // Security checks
        // Performance monitoring
        // Cache management
    }
}
```

### 2. Use Custom Annotations
```java
// Custom annotation
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Audited {
    String value() default "";
}

// Aspect using custom annotation
@Aspect
@Component
public class AuditAspect {
    @Before("@annotation(audited)")
    public void audit(JoinPoint joinPoint, Audited audited) {
        // Audit logic
    }
}

// Usage in service
@Service
public class UserService {
    @Audited("user-creation")
    public User createUser(UserDTO dto) {
        // Implementation
    }
}
```

### 3. Handle Exceptions Properly
```java
@Aspect
@Component
public class ExceptionHandlingAspect {
    @Around("execution(* com.example.service.*.*(..))")
    public Object handleExceptions(ProceedingJoinPoint joinPoint) throws Throwable {
        try {
            return joinPoint.proceed();
        } catch (BusinessException e) {
            // Handle business exceptions
            throw e;
        } catch (Exception e) {
            // Handle unexpected exceptions
            logger.error("Unexpected error", e);
            throw new SystemException("System error occurred", e);
        }
    }
}
```

### 4. Order Multiple Aspects
```java
@Aspect
@Component
@Order(1)
public class SecurityAspect {
    @Before("execution(* com.example.service.*.*(..))")
    public void checkSecurity() {
        // Security checks
    }
}

@Aspect
@Component
@Order(2)
public class LoggingAspect {
    @Before("execution(* com.example.service.*.*(..))")
    public void log() {
        // Logging
    }
}
```

## Testing Aspects

```java
@SpringBootTest
public class LoggingAspectTest {
    @Autowired
    private UserService userService;
    
    @Test
    public void testLoggingAspect() {
        // Given
        UserDTO userDTO = new UserDTO("test@example.com");
        
        // When
        User user = userService.createUser(userDTO);
        
        // Then
        // Verify logging occurred
        // You might need to use a mock logger or capture logs
    }
}
```

## Summary
- Use AOP for cross-cutting concerns
- Keep aspects focused and single-responsibility
- Use custom annotations for better readability
- Handle exceptions appropriately
- Order multiple aspects when needed
- Test aspects thoroughly
- Document aspect behavior and requirements 