# Java Testing

## Overview
Java Testing is a critical aspect of software development that ensures code quality, reliability, and correctness. Testing in Java encompasses a wide range of techniques and frameworks, from simple unit tests to complex integration and system tests. Effective testing reduces bugs, improves code design, facilitates refactoring, and provides documentation for how code should behave. This guide explores the comprehensive landscape of Java testing, focusing on both theoretical concepts and practical implementations using popular Java testing frameworks and tools.

## Prerequisites
- Basic Java programming knowledge
- Understanding of object-oriented programming concepts
- Familiarity with build tools (Maven/Gradle)
- Basic knowledge of software development lifecycle

## Learning Objectives
- Understand the fundamentals of software testing
- Master unit testing with JUnit and TestNG
- Learn mocking techniques with Mockito and other frameworks
- Implement test-driven development (TDD) practices
- Create effective integration tests
- Understand code coverage and quality metrics
- Explore performance and load testing techniques
- Implement automated testing practices
- Use specialized testing tools and frameworks
- Apply testing best practices in real-world Java applications

## Table of Contents
1. [Testing Fundamentals](#testing-fundamentals)
2. [Unit Testing with JUnit](#unit-testing-with-junit)
3. [Unit Testing with TestNG](#unit-testing-with-testng)
4. [Mocking Frameworks](#mocking-frameworks)
5. [Test-Driven Development (TDD)](#test-driven-development-tdd)
6. [Behavior-Driven Development (BDD)](#behavior-driven-development-bdd)
7. [Integration Testing](#integration-testing)
8. [Code Coverage](#code-coverage)
9. [Performance Testing](#performance-testing)
10. [Test Automation](#test-automation)
11. [Testing Web Applications](#testing-web-applications)
12. [Testing Best Practices](#testing-best-practices)
13. [Common Testing Pitfalls](#common-testing-pitfalls)
14. [Advanced Testing Techniques](#advanced-testing-techniques)

## Testing Fundamentals

Testing is a systematic process of evaluating software to detect differences between actual and expected behaviors. Proper testing ensures software quality and reliability.

### Types of Tests

#### Based on Scope
- **Unit Tests**: Test individual components or methods in isolation
- **Integration Tests**: Test interactions between components
- **System Tests**: Test the complete application
- **Acceptance Tests**: Validate the application meets business requirements

#### Based on Knowledge of Internal Structure
- **Black-box Testing**: Tests functionality without knowing internal code
- **White-box Testing**: Tests with knowledge of internal code
- **Gray-box Testing**: Combines both approaches

#### Based on Purpose
- **Functional Testing**: Tests what the system does
- **Non-functional Testing**: Tests how well the system performs (performance, usability, etc.)
- **Regression Testing**: Ensures new changes don't break existing functionality
- **Smoke Testing**: Basic tests to ensure core functionality works

### Testing Principles

1. **Testing shows the presence of defects, not their absence**
2. **Exhaustive testing is impossible**
3. **Early testing saves time and money**
4. **Defects cluster together**
5. **Tests should be repeatable and reusable**
6. **Testing is context dependent**
7. **Absence-of-errors is a fallacy**

### The Testing Pyramid

The testing pyramid represents the ideal distribution of tests in a project:

```
     /\
    /  \
   /    \
  / UI   \
 /        \
/Integration\
/____________\
/   Unit Tests \
/________________\
```

- **Unit Tests**: Form the base - many small, fast tests
- **Integration Tests**: Middle layer - fewer, slightly slower tests
- **UI/End-to-End Tests**: Top layer - fewest, slowest tests

### Test Case Design

A well-designed test case includes:

1. **Test ID and Name**: Unique identifier
2. **Objective**: What is being tested
3. **Preconditions**: Setup required before execution
4. **Test Steps**: Actions to perform
5. **Expected Results**: What should happen
6. **Actual Results**: What actually happened
7. **Pass/Fail Status**: Test outcome

### Test Fixtures

Test fixtures provide a consistent environment for tests:

- **Setup**: Prepare the test environment (runs before each test)
- **Teardown**: Clean up after tests (runs after each test)
- **BeforeAll/AfterAll**: Run once before/after all tests in a class

## Unit Testing with JUnit

JUnit is the most widely used testing framework for Java applications. It provides annotations, assertions, and runners to create and execute tests.

### JUnit 5 Architecture

JUnit 5 consists of three main components:

1. **JUnit Platform**: Foundation for test execution
2. **JUnit Jupiter**: New programming model for writing tests
3. **JUnit Vintage**: Support for running JUnit 3/4 tests

### Setting Up JUnit

#### Maven Dependency
```xml
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.9.2</version>
    <scope>test</scope>
</dependency>
```

#### Gradle Dependency
```gradle
testImplementation 'org.junit.jupiter:junit-jupiter:5.9.2'
testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
```

### Basic Test Structure

```java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class CalculatorTest {
    
    @Test
    void addition() {
        Calculator calculator = new Calculator();
        assertEquals(5, calculator.add(2, 3), "2 + 3 should equal 5");
    }
    
    @Test
    void division() {
        Calculator calculator = new Calculator();
        assertEquals(2, calculator.divide(6, 3), "6 / 3 should equal 2");
    }
    
    @Test
    void divisionByZero() {
        Calculator calculator = new Calculator();
        assertThrows(ArithmeticException.class, () -> {
            calculator.divide(1, 0);
        }, "Division by zero should throw ArithmeticException");
    }
}
```

### JUnit Annotations

- **@Test**: Identifies a test method
- **@BeforeEach**: Executed before each test
- **@AfterEach**: Executed after each test
- **@BeforeAll**: Executed once before all tests (must be static)
- **@AfterAll**: Executed once after all tests (must be static)
- **@Disabled**: Disables a test
- **@DisplayName**: Provides a custom name for the test
- **@ParameterizedTest**: Runs a test multiple times with different arguments
- **@Timeout**: Fails a test if it exceeds a time limit
- **@Tag**: Categorizes tests for selective execution

### Example with Lifecycle Methods

```java
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Calculator Test Suite")
public class CalculatorTest {
    
    private Calculator calculator;
    
    @BeforeAll
    static void setUpAll() {
        System.out.println("Initializing test suite");
    }
    
    @BeforeEach
    void setUp() {
        System.out.println("Initializing test");
        calculator = new Calculator();
    }
    
    @Test
    @DisplayName("Testing addition")
    void testAddition() {
        assertEquals(5, calculator.add(2, 3), "2 + 3 should equal 5");
    }
    
    @Test
    @DisplayName("Testing subtraction")
    void testSubtraction() {
        assertEquals(1, calculator.subtract(3, 2), "3 - 2 should equal 1");
    }
    
    @AfterEach
    void tearDown() {
        System.out.println("Test completed");
    }
    
    @AfterAll
    static void tearDownAll() {
        System.out.println("Test suite completed");
    }
}
```

### Assertions

JUnit provides a variety of assertion methods:

- **assertEquals(expected, actual)**: Tests if two values are equal
- **assertTrue(condition)**: Tests if a condition is true
- **assertFalse(condition)**: Tests if a condition is false
- **assertNull(object)**: Tests if an object is null
- **assertNotNull(object)**: Tests if an object is not null
- **assertSame(expected, actual)**: Tests if two objects reference the same object
- **assertNotSame(expected, actual)**: Tests if two objects don't reference the same object
- **assertThrows(exceptionClass, executable)**: Tests if code throws an exception
- **assertAll(executables...)**: Groups multiple assertions
- **fail(message)**: Fails a test with the given message

### Parameterized Tests

Run the same test with different parameters:

```java
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.*;
import static org.junit.jupiter.api.Assertions.*;

public class ParameterizedCalculatorTest {
    
    @ParameterizedTest
    @CsvSource({
        "1, 1, 2",
        "2, 3, 5",
        "10, 15, 25",
        "0, 0, 0"
    })
    void testAddition(int a, int b, int expected) {
        Calculator calculator = new Calculator();
        assertEquals(expected, calculator.add(a, b),
                () -> a + " + " + b + " should equal " + expected);
    }
    
    @ParameterizedTest
    @ValueSource(ints = {0, 1, 2, 3, 4})
    void testIsEven(int number) {
        Calculator calculator = new Calculator();
        assertEquals(number % 2 == 0, calculator.isEven(number));
    }
    
    @ParameterizedTest
    @EnumSource(value = MathOperation.class, names = {"ADD", "SUBTRACT", "MULTIPLY"})
    void testSupportedOperations(MathOperation operation) {
        Calculator calculator = new Calculator();
        assertTrue(calculator.supportsOperation(operation));
    }
} 
```

## Unit Testing with TestNG

TestNG is a testing framework inspired by JUnit but with additional features designed to make testing more powerful and easier.

### Setting Up TestNG

#### Maven Dependency
```xml
<dependency>
    <groupId>org.testng</groupId>
    <artifactId>testng</artifactId>
    <version>7.7.1</version>
    <scope>test</scope>
</dependency>
```

#### Gradle Dependency
```gradle
testImplementation 'org.testng:testng:7.7.1'
```

### Basic TestNG Test

```java
import org.testng.annotations.*;
import static org.testng.Assert.*;

public class CalculatorTestNG {
    
    private Calculator calculator;
    
    @BeforeMethod
    public void setUp() {
        calculator = new Calculator();
    }
    
    @Test
    public void testAddition() {
        assertEquals(calculator.add(2, 3), 5, "2 + 3 should equal 5");
    }
    
    @Test
    public void testDivision() {
        assertEquals(calculator.divide(6, 3), 2, "6 / 3 should equal 2");
    }
    
    @Test(expectedExceptions = ArithmeticException.class)
    public void testDivisionByZero() {
        calculator.divide(1, 0);
    }
}
```

### Key TestNG Features

#### Test Groups

```java
import org.testng.annotations.*;
import static org.testng.Assert.*;

public class UserServiceTest {
    
    @Test(groups = {"fast", "unit"})
    public void testUserCreation() {
        // Fast unit test
    }
    
    @Test(groups = {"slow", "integration"})
    public void testUserDatabaseInteraction() {
        // Slow integration test
    }
    
    @Test(groups = {"unit", "security"})
    public void testUserAuthentication() {
        // Security-related unit test
    }
}
```

#### Running specific groups:
```xml
<test name="Unit Tests">
    <groups>
        <run>
            <include name="unit"/>
            <exclude name="slow"/>
        </run>
    </groups>
    <classes>
        <class name="com.example.UserServiceTest"/>
    </classes>
</test>
```

#### Dependent Tests

```java
@Test
public void testDatabaseConnection() {
    // Test database connection
    assertTrue(database.isConnected());
}

@Test(dependsOnMethods = {"testDatabaseConnection"})
public void testUserRetrieval() {
    // This test only runs if testDatabaseConnection passes
    User user = database.getUser(1);
    assertNotNull(user);
}
```

#### Data Providers

```java
@DataProvider(name = "additionData")
public Object[][] createAdditionData() {
    return new Object[][] {
        {1, 1, 2},
        {2, 3, 5},
        {10, 15, 25},
        {-1, 1, 0}
    };
}

@Test(dataProvider = "additionData")
public void testAddition(int a, int b, int expected) {
    assertEquals(calculator.add(a, b), expected);
}
```

#### Parallel Execution

```java
@Test(threadPoolSize = 3, invocationCount = 10, timeOut = 1000)
public void testConcurrent() {
    // This test will be executed 10 times with 3 threads
    assertTrue(calculator.isPrime(31));
}
```

### JUnit vs TestNG

| Feature | JUnit 5 | TestNG |
|---------|---------|--------|
| Annotations | @Test, @BeforeEach, @AfterEach, etc. | @Test, @BeforeMethod, @AfterMethod, etc. |
| Parameterization | @ParameterizedTest with providers | @Test with @DataProvider |
| Grouping | @Tag | groups attribute |
| Dependencies | Limited | Comprehensive |
| Parallelism | Supported via extensions | Built-in support |
| Exception Testing | assertThrows() | expectedExceptions attribute |
| Timeout | @Timeout | timeOut attribute |
| Assumptions | assumeTrue(), etc. | Needs custom implementation |
| Extensions | Extension API | Listeners and reporters |

## Mocking Frameworks

Mocking frameworks allow you to create test doubles for dependencies to isolate the code under test.

### Types of Test Doubles

1. **Dummy**: Objects passed around but never used
2. **Fake**: Working implementations with shortcuts (e.g., in-memory database)
3. **Stub**: Provide canned answers to calls
4. **Spy**: Partial mocks that track actual interactions
5. **Mock**: Objects pre-programmed with expectations and verification

### Mockito

Mockito is the most popular mocking framework for Java.

#### Setting Up Mockito

```xml
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-core</artifactId>
    <version>5.2.0</version>
    <scope>test</scope>
</dependency>
<!-- For JUnit 5 integration -->
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-junit-jupiter</artifactId>
    <version>5.2.0</version>
    <scope>test</scope>
</dependency>
```

#### Basic Mocking

```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @Test
    void testGetUser() {
        // Arrange
        User expectedUser = new User(1, "John");
        when(userRepository.findById(1)).thenReturn(expectedUser);
        
        UserService userService = new UserService(userRepository);
        
        // Act
        User actualUser = userService.getUserById(1);
        
        // Assert
        assertEquals(expectedUser, actualUser);
        verify(userRepository).findById(1);
    }
}
```

#### Stubbing Methods

```java
// Return value
when(userRepository.findById(1)).thenReturn(new User(1, "John"));

// Throw exception
when(userRepository.findById(999)).thenThrow(new UserNotFoundException());

// Return different values on consecutive calls
when(iterator.next())
    .thenReturn("first")
    .thenReturn("second")
    .thenReturn("third");

// Do something when method is called
doAnswer(invocation -> {
    Object[] args = invocation.getArguments();
    User user = (User) args[0];
    user.setActive(true);
    return null;
}).when(userRepository).save(any(User.class));
```

#### Verifying Interactions

```java
// Verify method was called
verify(userRepository).save(any(User.class));

// Verify method was never called
verify(userRepository, never()).delete(any(User.class));

// Verify method was called exactly n times
verify(userRepository, times(2)).findAll();

// Verify no more interactions
verifyNoMoreInteractions(userRepository);

// Verify order of calls
InOrder inOrder = inOrder(userRepository, emailService);
inOrder.verify(userRepository).findById(1);
inOrder.verify(emailService).sendWelcomeEmail(any(User.class));
```

#### Argument Matchers

```java
// Any value of specific type
when(userRepository.findById(anyInt())).thenReturn(new User());

// Specific value
when(userRepository.findByUsername(eq("admin"))).thenReturn(new User());

// Complex matcher
when(userRepository.findByAgeGreaterThan(argThat(arg -> arg > 18))).thenReturn(userList);
```

#### Spying on Real Objects

```java
@Test
void testSpy() {
    List<String> realList = new ArrayList<>();
    List<String> spyList = spy(realList);
    
    // Real method calls are used by default
    spyList.add("one");
    spyList.add("two");
    
    assertEquals(2, spyList.size());
    
    // Can stub specific methods
    when(spyList.size()).thenReturn(100);
    assertEquals(100, spyList.size());
    
    // Original list is affected
    assertEquals(2, realList.size());
}
```

### Alternative Mocking Frameworks

#### EasyMock

```java
import org.easymock.*;
import org.junit.jupiter.api.*;

import static org.easymock.EasyMock.*;
import static org.junit.jupiter.api.Assertions.*;

public class EasyMockTest {
    
    @Test
    void testWithEasyMock() {
        // Create mock
        UserRepository mockRepository = createMock(UserRepository.class);
        
        // Set expectations
        expect(mockRepository.findById(1)).andReturn(new User(1, "John"));
        replay(mockRepository);
        
        // Use mock
        UserService service = new UserService(mockRepository);
        User user = service.getUserById(1);
        
        // Verify
        assertEquals("John", user.getName());
        verify(mockRepository);
    }
}
```

#### PowerMock

For mocking static methods, final classes, and private methods:

```java
@RunWith(PowerMockRunner.class)
@PrepareForTest({StaticUtility.class})
public class PowerMockTest {
    
    @Test
    public void testStaticMethod() {
        // Mock static method
        PowerMockito.mockStatic(StaticUtility.class);
        when(StaticUtility.calculateSomething()).thenReturn(42);
        
        // Use and verify
        assertEquals(42, StaticUtility.calculateSomething());
        PowerMockito.verifyStatic(StaticUtility.class);
        StaticUtility.calculateSomething();
    }
}
```

## Test-Driven Development (TDD)

Test-Driven Development is a software development approach where tests are written before the actual code.

### The TDD Cycle

1. **Red**: Write a failing test
2. **Green**: Write the simplest code to make the test pass
3. **Refactor**: Improve the code without changing functionality

### TDD Example

#### Step 1: Write a failing test

```java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class StringCalculatorTest {
    
    @Test
    void emptyStringReturnsZero() {
        StringCalculator calculator = new StringCalculator();
        assertEquals(0, calculator.add(""), "Empty string should return 0");
    }
}
```

#### Step 2: Make the test pass

```java
public class StringCalculator {
    
    public int add(String numbers) {
        return 0;
    }
}
```

#### Step 3: Add another test

```java
@Test
void singleNumberReturnsValue() {
    StringCalculator calculator = new StringCalculator();
    assertEquals(1, calculator.add("1"), "String with single number should return the number");
    assertEquals(5, calculator.add("5"), "String with single number should return the number");
}
```

#### Step 4: Update implementation

```java
public int add(String numbers) {
    if (numbers.isEmpty()) {
        return 0;
    }
    return Integer.parseInt(numbers);
}
```

#### Step 5: Add test for multiple numbers

```java
@Test
void twoNumbersReturnSum() {
    StringCalculator calculator = new StringCalculator();
    assertEquals(3, calculator.add("1,2"), "String with two numbers should return their sum");
    assertEquals(8, calculator.add("3,5"), "String with two numbers should return their sum");
}
```

#### Step 6: Update implementation again

```java
public int add(String numbers) {
    if (numbers.isEmpty()) {
        return 0;
    }
    
    String[] parts = numbers.split(",");
    if (parts.length == 1) {
        return Integer.parseInt(parts[0]);
    }
    
    return Integer.parseInt(parts[0]) + Integer.parseInt(parts[1]);
}
```

#### Step 7: Refactor for any number of values

```java
@Test
void anyNumberOfValuesReturnsSum() {
    StringCalculator calculator = new StringCalculator();
    assertEquals(6, calculator.add("1,2,3"), "Should handle any number of values");
    assertEquals(15, calculator.add("1,2,3,4,5"), "Should handle any number of values");
}
```

#### Step 8: Final implementation

```java
public int add(String numbers) {
    if (numbers.isEmpty()) {
        return 0;
    }
    
    String[] parts = numbers.split(",");
    int sum = 0;
    for (String part : parts) {
        sum += Integer.parseInt(part);
    }
    
    return sum;
}
```

### Benefits of TDD

1. **Improved design**: Code is naturally more modular and testable
2. **Better understanding of requirements**: Tests serve as specifications
3. **Faster debugging**: Issues are detected earlier
4. **Regression safety**: Existing tests catch regressions
5. **Documentation**: Tests document expected behavior
6. **Confidence**: Higher confidence in code changes

## Behavior-Driven Development (BDD)

Behavior-Driven Development extends TDD by focusing on the behavior of the application from the user's perspective rather than implementation details. It uses natural language constructs to express tests in a way that non-technical stakeholders can understand.

### BDD Frameworks for Java

#### Cucumber
Cucumber allows specification of application behavior in plain text and supports multiple languages through Gherkin syntax.

##### Maven Dependency
```xml
<dependency>
    <groupId>io.cucumber</groupId>
    <artifactId>cucumber-java</artifactId>
    <version>7.11.2</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>io.cucumber</groupId>
    <artifactId>cucumber-junit</artifactId>
    <version>7.11.2</version>
    <scope>test</scope>
</dependency>
```

##### Feature File Example (src/test/resources/features/calculator.feature)
```gherkin
Feature: Calculator
  As a user
  I want to use a calculator
  So that I can perform basic arithmetic operations

  Scenario: Addition
    Given I have a calculator
    When I add 2 and 3
    Then the result should be 5

  Scenario Outline: Multiple additions
    Given I have a calculator
    When I add <num1> and <num2>
    Then the result should be <total>

    Examples:
      | num1 | num2 | total |
      | 1    | 1    | 2     |
      | 2    | 3    | 5     |
      | 10   | 15   | 25    |
      | -5   | 5    | 0     |
```

##### Step Definitions
```java
import io.cucumber.java.en.*;
import static org.junit.jupiter.api.Assertions.*;

public class CalculatorSteps {
    
    private Calculator calculator;
    private int result;
    
    @Given("I have a calculator")
    public void i_have_a_calculator() {
        calculator = new Calculator();
    }
    
    @When("I add {int} and {int}")
    public void i_add_and(Integer num1, Integer num2) {
        result = calculator.add(num1, num2);
    }
    
    @Then("the result should be {int}")
    public void the_result_should_be(Integer expected) {
        assertEquals(expected, result);
    }
}
```

##### Test Runner
```java
import org.junit.runner.RunWith;
import io.cucumber.junit.Cucumber;
import io.cucumber.junit.CucumberOptions;

@RunWith(Cucumber.class)
@CucumberOptions(
    features = "src/test/resources/features",
    glue = "com.example.steps",
    plugin = {"pretty", "html:target/cucumber-reports"}
)
public class CucumberTestRunner {
}
```

#### JBehave
JBehave is another BDD framework for Java, similar to Cucumber.

```java
@UsingSteps(instances = { CalculatorSteps.class })
public class CalculatorBehaviorTest extends JUnitStories {
    
    @Override
    public Configuration configuration() {
        return new MostUsefulConfiguration()
            .useStoryLoader(new LoadFromClasspath(this.getClass()))
            .useStoryReporterBuilder(new StoryReporterBuilder()
                .withDefaultFormats()
                .withFormats(Format.CONSOLE, Format.HTML));
    }
    
    @Override
    public List<String> storyPaths() {
        return Arrays.asList("calculator.story");
    }
}
```

#### Spock Framework
Spock combines testing and specification with a Groovy DSL.

```groovy
class CalculatorSpec extends Specification {
    
    def "Adding two numbers should return their sum"() {
        given: "A calculator"
        def calculator = new Calculator()
        
        when: "Adding two numbers"
        def result = calculator.add(a, b)
        
        then: "The result should be their sum"
        result == expected
        
        where:
        a  | b  | expected
        1  | 1  | 2
        2  | 3  | 5
        10 | 15 | 25
        -5 | 5  | 0
    }
}
```

### BDD Best Practices

1. **Focus on behavior**: Write scenarios from user's perspective
2. **Use domain language**: Avoid technical terms in feature files
3. **Keep scenarios independent**: Each scenario should run in isolation
4. **Maintain a living documentation**: Update features as requirements change
5. **Collaborate**: Include business stakeholders in feature writing

## Integration Testing

Integration testing verifies that different components work together as expected.

### Types of Integration Tests

1. **Component Integration**: Tests interactions between components
2. **System Integration**: Tests the entire system
3. **Contract Testing**: Tests integration points based on contracts

### Spring Integration Testing

The Spring Framework provides robust support for integration testing.

#### Maven Dependencies
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

#### Testing Spring MVC Controllers
```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
public class UserControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private UserService userService;
    
    @Test
    void testGetUser() throws Exception {
        User user = new User(1, "John Doe");
        when(userService.getUserById(1)).thenReturn(user);
        
        mockMvc.perform(get("/api/users/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.name").value("John Doe"));
    }
}
```

#### Testing REST APIs
```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class UserControllerIntegrationTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void testCreateUser() {
        UserDTO userDTO = new UserDTO("John Doe", "john@example.com");
        
        ResponseEntity<User> response = restTemplate.postForEntity(
            "/api/users", userDTO, User.class);
        
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertNotNull(response.getBody().getId());
        assertEquals("John Doe", response.getBody().getName());
    }
}
```

#### Testing with an In-Memory Database
```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class UserRepositoryTest {
    
    @Autowired
    private UserRepository userRepository;
    
    @Test
    void testSaveUser() {
        // Given
        User user = new User("John Doe", "john@example.com");
        
        // When
        User savedUser = userRepository.save(user);
        
        // Then
        assertNotNull(savedUser.getId());
        assertEquals("John Doe", savedUser.getName());
        
        // Verify it's in the database
        assertTrue(userRepository.findById(savedUser.getId()).isPresent());
    }
}
```

### Testing with Testcontainers

Testcontainers is a Java library that provides lightweight, throwaway instances of databases, message brokers, web browsers, or anything else that can run in a Docker container.

#### Maven Dependency
```xml
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>postgresql</artifactId>
    <version>1.17.6</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>1.17.6</version>
    <scope>test</scope>
</dependency>
```

#### PostgreSQL Container Test
```java
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest
@Testcontainers
public class UserServiceIntegrationTest {
    
    @Container
    private static final PostgreSQLContainer<?> postgreSQLContainer = 
        new PostgreSQLContainer<>("postgres:13")
            .withDatabaseName("test-db")
            .withUsername("test")
            .withPassword("test");
    
    @DynamicPropertySource
    static void databaseProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgreSQLContainer::getJdbcUrl);
        registry.add("spring.datasource.username", postgreSQLContainer::getUsername);
        registry.add("spring.datasource.password", postgreSQLContainer::getPassword);
    }
    
    @Autowired
    private UserService userService;
    
    @Test
    void testCreateUser() {
        // Test with real PostgreSQL database in container
        User user = userService.createUser("John", "john@example.com");
        assertNotNull(user.getId());
    }
}
```

### Integration Testing Best Practices

1. **Isolate tests**: Each test should run independently
2. **Control external dependencies**: Use test doubles or controlled environments
3. **Test realistic scenarios**: Cover actual user workflows
4. **Clean up after tests**: Ensure no test data leaks between tests
5. **Focus on integration points**: Test boundaries between components
6. **Maintain test data**: Use seed data or test fixtures for consistency

## Code Coverage

Code measures how much of your code is executed during tests, helping identify untested code sections.

### Coverage Metrics

1. **Line Coverage**: Percentage of code lines executed
2. **Branch Coverage**: Percentage of branches executed (if/else paths)
3. **Method Coverage**: Percentage of methods called
4. **Class Coverage**: Percentage of classes touched

### JaCoCo

JaCoCo is a popular code coverage library for Java.

#### Maven Configuration
```xml
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.8</version>
    <executions>
        <execution>
            <goals>
                <goal>prepare-agent</goal>
            </goals>
        </execution>
        <execution>
            <id>report</id>
            <phase>test</phase>
            <goals>
                <goal>report</goal>
            </goals>
        </execution>
        <execution>
            <id>check</id>
            <goals>
                <goal>check</goal>
            </goals>
            <configuration>
                <rules>
                    <rule>
                        <element>PACKAGE</element>
                        <limits>
                            <limit>
                                <counter>LINE</counter>
                                <value>COVEREDRATIO</value>
                                <minimum>0.80</minimum>
                            </limit>
                        </limits>
                    </rule>
                </rules>
            </configuration>
        </execution>
    </executions>
</plugin>
```

#### Running Coverage
```bash
mvn clean test jacoco:report
```

### Interpreting Coverage Reports

JaCoCo generates HTML reports with color-coded indicators:
- **Red**: Lines not executed
- **Yellow**: Branches partially executed
- **Green**: Fully executed code

![JaCoCo Report Example](https://www.jacoco.org/jacoco/trunk/doc/resources/report.png)

### Coverage Tools Integration

#### SonarQube Integration
```xml
<plugin>
    <groupId>org.sonarsource.scanner.maven</groupId>
    <artifactId>sonar-maven-plugin</artifactId>
    <version>3.9.1.2184</version>
</plugin>
```

#### Running with SonarQube
```bash
mvn clean verify sonar:sonar \
  -Dsonar.projectKey=my-project \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=myAuthToken
```

### Coverage Best Practices

1. **Don't aim for 100%**: Focus on business-critical code
2. **Use coverage as a guide**: Not as the only quality metric
3. **Combine with mutation testing**: Ensure tests are meaningful
4. **Track coverage trends**: Monitor changes over time
5. **Focus on uncovered high-risk areas**: Prioritize critical components

## Performance Testing

Performance testing evaluates how a system performs under a particular workload, focusing on responsiveness, stability, scalability, and resource usage.

### Types of Performance Tests

1. **Load Testing**: Tests behavior under expected load
2. **Stress Testing**: Tests behavior under extreme load
3. **Spike Testing**: Tests behavior under sudden load increases
4. **Endurance/Soak Testing**: Tests behavior over extended periods
5. **Scalability Testing**: Tests how system scales with increased load
6. **Volume Testing**: Tests with large amounts of data

### JMeter

Apache JMeter is a widely-used open-source load testing tool.

#### Basic JMeter Test Plan
1. Create a Thread Group (simulated users)
2. Add HTTP Request samplers
3. Add listeners to collect results
4. Configure assertions to validate responses
5. Run the test and analyze results

#### JMeter Maven Integration
```xml
<plugin>
    <groupId>com.lazerycode.jmeter</groupId>
    <artifactId>jmeter-maven-plugin</artifactId>
    <version>3.6.0</version>
    <executions>
        <execution>
            <id>jmeter-tests</id>
            <phase>verify</phase>
            <goals>
                <goal>jmeter</goal>
            </goals>
        </execution>
    </executions>
    <configuration>
        <testFilesDirectory>${project.basedir}/src/test/jmeter</testFilesDirectory>
        <resultsDirectory>${project.build.directory}/jmeter-results</resultsDirectory>
    </configuration>
</plugin>
```

### Gatling

Gatling is a modern load testing tool with a fluent DSL.

#### Maven Dependency
```xml
<dependency>
    <groupId>io.gatling.highcharts</groupId>
    <artifactId>gatling-charts-highcharts</artifactId>
    <version>3.9.0</version>
    <scope>test</scope>
</dependency>
```

#### Basic Gatling Simulation
```scala
import io.gatling.core.Predef._
import io.gatling.http.Predef._
import scala.concurrent.duration._

class UserSimulation extends Simulation {
  
  val httpProtocol = http
    .baseUrl("http://localhost:8080")
    .acceptHeader("application/json")
    .userAgentHeader("Gatling/Performance Test")
  
  val scn = scenario("Get Users Scenario")
    .exec(http("Get All Users")
      .get("/api/users")
      .check(status.is(200)))
    .pause(2)
    .exec(http("Get User by ID")
      .get("/api/users/1")
      .check(status.is(200))
      .check(jsonPath("$.name").is("John Doe")))
  
  setUp(
    scn.inject(
      rampUsers(100).during(30.seconds)
    )
  ).protocols(httpProtocol)
}
```

### JMH (Java Microbenchmark Harness)

JMH is used for benchmarking small code segments with high precision.

#### Maven Dependency
```xml
<dependency>
    <groupId>org.openjdk.jmh</groupId>
    <artifactId>jmh-core</artifactId>
    <version>1.36</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.openjdk.jmh</groupId>
    <artifactId>jmh-generator-annprocess</artifactId>
    <version>1.36</version>
    <scope>test</scope>
</dependency>
```

#### Sample JMH Benchmark
```java
@BenchmarkMode(Mode.AverageTime)
@OutputTimeUnit(TimeUnit.MICROSECONDS)
@Warmup(iterations = 5, time = 1)
@Measurement(iterations = 5, time = 1)
@Fork(1)
@State(Scope.Thread)
public class StringConcatenationBenchmark {
    
    @Param({"10", "100", "1000"})
    private int iterations;
    
    @Benchmark
    public String stringConcatenation() {
        String result = "";
        for (int i = 0; i < iterations; i++) {
            result += i;
        }
        return result;
    }
    
    @Benchmark
    public String stringBuilder() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < iterations; i++) {
            sb.append(i);
        }
        return sb.toString();
    }
    
    public static void main(String[] args) throws Exception {
        org.openjdk.jmh.Main.main(args);
    }
}
```

### Performance Testing Best Practices

1. **Define clear metrics**: Response time, throughput, error rate, etc.
2. **Use realistic data**: Test with production-like data volumes
3. **Monitor resources**: CPU, memory, disk, network during tests
4. **Identify bottlenecks**: Focus optimization on actual constraints
5. **Test in production-like environment**: Replicate actual deployment setup
6. **Establish baselines**: Compare performance against known benchmarks
7. **Automate performance tests**: Include in CI/CD pipeline

## Test Automation

Test automation involves using software tools to execute tests automatically and compare actual outcomes with expected outcomes.

### Test Automation Frameworks

#### Selenium
For web UI testing:

```java
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import static org.junit.jupiter.api.Assertions.*;

public class SeleniumTest {
    
    private WebDriver driver;
    
    @BeforeEach
    void setUp() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
    }
    
    @Test
    void testGoogleSearch() {
        driver.get("https://www.google.com");
        WebElement searchBox = driver.findElement(By.name("q"));
        searchBox.sendKeys("selenium testing");
        searchBox.submit();
        
        // Wait for results
        WebElement results = driver.findElement(By.id("search"));
        assertTrue(results.isDisplayed());
        
        // Check title contains the search query
        assertTrue(driver.getTitle().contains("selenium testing"));
    }
    
    @AfterEach
    void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
```

#### REST Assured
For API testing:

```java
import io.restassured.RestAssured;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

public class RestAssuredTest {
    
    @BeforeEach
    void setUp() {
        RestAssured.baseURI = "https://reqres.in";
        RestAssured.basePath = "/api";
    }
    
    @Test
    void testGetUser() {
        given()
            .pathParam("id", 2)
        .when()
            .get("/users/{id}")
        .then()
            .statusCode(200)
            .body("data.id", equalTo(2))
            .body("data.email", equalTo("janet.weaver@reqres.in"))
            .body("data.first_name", equalTo("Janet"));
    }
    
    @Test
    void testCreateUser() {
        String user = "{\"name\":\"morpheus\",\"job\":\"leader\"}";
        
        given()
            .contentType("application/json")
            .body(user)
        .when()
            .post("/users")
        .then()
            .statusCode(201)
            .body("name", equalTo("morpheus"))
            .body("job", equalTo("leader"))
            .body("id", not(emptyString()));
    }
}
```

#### Cucumber with Selenium
For behavior-driven UI testing:

```java
// Feature file: src/test/resources/features/login.feature
Feature: Login Functionality
  As a user
  I want to be able to log in
  So that I can access my account

  Scenario: Successful login
    Given I am on the login page
    When I enter username "user" and password "pass"
    And I click the login button
    Then I should be redirected to the dashboard

// Step definitions
public class LoginSteps {
    
    private WebDriver driver;
    
    @Before
    public void setUp() {
        driver = new ChromeDriver();
    }
    
    @Given("I am on the login page")
    public void i_am_on_the_login_page() {
        driver.get("https://example.com/login");
    }
    
    @When("I enter username {string} and password {string}")
    public void i_enter_username_and_password(String username, String password) {
        driver.findElement(By.id("username")).sendKeys(username);
        driver.findElement(By.id("password")).sendKeys(password);
    }
    
    @And("I click the login button")
    public void i_click_the_login_button() {
        driver.findElement(By.id("login-button")).click();
    }
    
    @Then("I should be redirected to the dashboard")
    public void i_should_be_redirected_to_the_dashboard() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.urlContains("/dashboard"));
        assertEquals("Dashboard", driver.getTitle());
    }
    
    @After
    public void tearDown() {
        driver.quit();
    }
}
```

### Continuous Integration

#### Jenkins Pipeline for Testing
```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'mvn clean compile'
            }
        }
        stage('Unit Tests') {
            steps {
                sh 'mvn test'
            }
            post {
                always {
                    junit '**/target/surefire-reports/*.xml'
                }
            }
        }
        stage('Integration Tests') {
            steps {
                sh 'mvn verify -DskipUnitTests'
            }
            post {
                always {
                    junit '**/target/failsafe-reports/*.xml'
                }
            }
        }
        stage('Code Coverage') {
            steps {
                sh 'mvn jacoco:report'
                publishHTML([
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'target/site/jacoco',
                    reportFiles: 'index.html',
                    reportName: 'JaCoCo Code Coverage'
                ])
            }
        }
    }
}
```

#### GitHub Actions
```yaml
name: Java Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
        cache: maven
    - name: Unit Tests
      run: mvn test
    - name: Integration Tests
      run: mvn verify -DskipUnitTests
    - name: Publish Test Report
      uses: mikepenz/action-junit-report@v3
      if: always()
      with:
        report_paths: '**/target/surefire-reports/TEST-*.xml, **/target/failsafe-reports/TEST-*.xml'
```

### Test Automation Best Practices

1. **Choose the right tools**: Select frameworks suited to your needs
2. **Automate at the right level**: Prioritize unit and API tests over UI tests
3. **Keep tests independent**: Avoid dependencies between tests
4. **Prioritize test reliability**: Flaky tests undermine confidence
5. **Maintain test code**: Treat test code with the same care as production code
6. **Use the test pyramid**: More unit tests, fewer UI tests
7. **Fast feedback**: Tests should run quickly
8. **Test data management**: Control test data creation and cleanup

## Testing Web Applications

Testing web applications involves multiple layers from front-end to back-end.

### Front-end Testing

#### Testing JavaScript with Jest
```javascript
// math.js
export function add(a, b) {
  return a + b;
}

// math.test.js
import { add } from './math';

test('adds 1 + 2 to equal 3', () => {
  expect(add(1, 2)).toBe(3);
});
```

#### React Component Testing
```javascript
// Button.jsx
import React from 'react';

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>{text}</button>
);

export default Button;

// Button.test.jsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Button from './Button';

test('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  const { getByText } = render(
    <Button onClick={handleClick} text="Click Me" />
  );
  
  fireEvent.click(getByText('Click Me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

#### Angular Component Testing
```typescript
// counter.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <div>Current Count: {{ count }}</div>
    <button (click)="increment()">Increment</button>
  `
})
export class CounterComponent {
  count = 0;
  
  increment() {
    this.count++;
  }
}

// counter.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CounterComponent } from './counter.component';

describe('CounterComponent', () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;
  let compiled: HTMLElement;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CounterComponent ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should start with count 0', () => {
    expect(compiled.textContent).toContain('Current Count: 0');
  });
  
  it('should increment count when button is clicked', () => {
    const button = compiled.querySelector('button');
    button?.click();
    fixture.detectChanges();
    expect(compiled.textContent).toContain('Current Count: 1');
  });
});
```

### End-to-End Testing

#### Cypress
```javascript
// cypress/integration/login.spec.js
describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });
  
  it('should login with valid credentials', () => {
    cy.get('#username').type('testuser');
    cy.get('#password').type('password123');
    cy.get('#login-button').click();
    
    // Verify successful login
    cy.url().should('include', '/dashboard');
    cy.get('h1').should('contain', 'Welcome, testuser');
  });
  
  it('should display error with invalid credentials', () => {
    cy.get('#username').type('wronguser');
    cy.get('#password').type('wrongpass');
    cy.get('#login-button').click();
    
    // Verify error message
    cy.get('.error-message').should('be.visible');
    cy.get('.error-message').should('contain', 'Invalid username or password');
  });
});
```

#### Playwright
```java
import com.microsoft.playwright.*;
import org.junit.jupiter.api.*;

import static org.junit.jupiter.api.Assertions.*;

public class PlaywrightTest {
    
    private Playwright playwright;
    private Browser browser;
    private Page page;
    
    @BeforeEach
    void setUp() {
        playwright = Playwright.create();
        browser = playwright.chromium().launch();
        page = browser.newPage();
    }
    
    @Test
    void testLogin() {
        page.navigate("https://example.com/login");
        
        page.fill("#username", "testuser");
        page.fill("#password", "password123");
        page.click("#login-button");
        
        // Wait for navigation
        page.waitForURL("**/dashboard");
        
        // Verify successful login
        assertTrue(page.url().contains("/dashboard"));
        assertEquals("Welcome, testuser", page.textContent("h1"));
    }
    
    @AfterEach
    void tearDown() {
        if (page != null) {
            page.close();
        }
        if (browser != null) {
            browser.close();
        }
        if (playwright != null) {
            playwright.close();
        }
    }
}
```

### API Testing

#### Testing Spring Boot REST API
```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void testGetAllUsers() throws Exception {
        mockMvc.perform(get("/api/users"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$.length()").isNumber());
    }
    
    @Test
    void testCreateUser() throws Exception {
        String userJson = "{\"name\":\"Jane Doe\",\"email\":\"jane@example.com\"}";
        
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userJson))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.name").value("Jane Doe"))
            .andExpect(jsonPath("$.email").value("jane@example.com"));
    }
}
```

### Accessibility Testing

#### Using Axe with Selenium
```java
import com.deque.html.axecore.selenium.AxeBuilder;
import com.deque.html.axecore.selenium.AxeReporter;
import com.deque.html.axecore.selenium.ResultType;
import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

import static org.junit.jupiter.api.Assertions.*;

public class AccessibilityTest {
    
    private WebDriver driver;
    
    @BeforeEach
    void setUp() {
        driver = new ChromeDriver();
    }
    
    @Test
    void testHomePageAccessibility() {
        driver.get("https://example.com");
        
        JSONObject results = new AxeBuilder()
            .analyze(driver);
        
        JSONArray violations = results.getJSONArray("violations");
        
        if (violations.length() > 0) {
            AxeReporter.writeResultsToJsonFile("accessibility-results", results);
            fail("Accessibility violations found: " + violations.length());
        }
    }
    
    @AfterEach
    void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
```

### Security Testing

#### OWASP ZAP Integration
```java
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.zaproxy.clientapi.core.ApiResponse;
import org.zaproxy.clientapi.core.ClientApi;

import static org.junit.jupiter.api.Assertions.*;

public class SecurityTest {
    
    private static ClientApi api;
    
    @BeforeAll
    static void setUp() {
        // ZAP API client
        api = new ClientApi("localhost", 8080);
    }
    
    @Test
    void testApiSecurity() throws Exception {
        // Start a new session
        api.core.newSession("", "");
        
        // Access the target
        api.core.accessUrl("https://example.com/api");
        
        // Spider the target
        ApiResponse response = api.spider.scan("https://example.com/api", null, null, null, null);
        String scanId = response.getString("scan");
        
        // Wait for the spider to complete
        while (true) {
            Thread.sleep(1000);
            int progress = Integer.parseInt(api.spider.status(scanId).getString("status"));
            if (progress >= 100) {
                break;
            }
        }
        
        // Run active scan
        response = api.ascan.scan("https://example.com/api", "True", "False", null, null, null);
        scanId = response.getString("scan");
        
        // Wait for the scan to complete
        while (true) {
            Thread.sleep(1000);
            int progress = Integer.parseInt(api.ascan.status(scanId).getString("status"));
            if (progress >= 100) {
                break;
            }
        }
        
        // Get the alerts
        ApiResponse alerts = api.core.alerts("https://example.com/api", null, null);
        
        // Verify high risk alerts
        JSONObject alertsObj = new JSONObject(alerts.toString());
        JSONArray alertsList = alertsObj.getJSONArray("alerts");
        
        int highRiskAlerts = 0;
        for (int i = 0; i < alertsList.length(); i++) {
            JSONObject alert = alertsList.getJSONObject(i);
            if (alert.getInt("risk") >= 3) {  // High risk (3)
                highRiskAlerts++;
            }
        }
        
        assertEquals(0, highRiskAlerts, "High risk security vulnerabilities found");
    }
    
    @AfterAll
    static void tearDown() {
        // Clean up
    }
}
```

### Web Testing Best Practices

1. **Test across browsers**: Verify compatibility with major browsers
2. **Test responsive design**: Check behavior across device sizes
3. **Automate regression testing**: Catch UI regressions automatically
4. **Test accessibility**: Ensure compliance with WCAG guidelines
5. **Security testing**: Check for common vulnerabilities
6. **Performance testing**: Measure load times and responsiveness
7. **Consider real user conditions**: Test with throttled connections
8. **Visual regression testing**: Compare screenshots for UI changes

## Testing Best Practices

### General Testing Best Practices

1. **Test Early, Test Often**
   - Start testing as early as possible in development
   - Integrate tests into your development workflow
   - Automate tests to run on every code change

2. **Follow the Testing Pyramid**
   ```
        /\
       /  \
      /    \
     / E2E  \
    /        \
   /Integration\
   /____________\
   /   Unit Tests \
   /________________\
   ```
   - Many unit tests: fast, reliable, focused
   - Fewer integration tests: verify component interactions
   - Fewest E2E tests: validate complete workflows

3. **Write Testable Code**
   - Follow SOLID principles
   - Use dependency injection
   - Separate concerns (business logic from I/O)
   - Keep methods small and focused

4. **Maintain Test Independence**
   - Tests should not depend on each other
   - Each test should set up its own state
   - Clean up after tests to avoid affecting others

5. **Use Fresh Test Data**
   - Avoid shared test data when possible
   - Reset data between tests
   - Use test data builders or factories

6. **Make Tests Deterministic**
   - Avoid random data without setting seeds
   - Control external dependencies
   - Avoid time dependencies with clock injection

7. **Focus on Test Quality**
   - Tests should be clear and readable
   - Maintain tests like production code
   - Refactor tests when needed

8. **Consider Edge Cases**
   - Test boundary conditions
   - Test error scenarios
   - Test with invalid inputs

### Unit Testing Best Practices

1. **Test One Thing at a Time**
   ```java
   // GOOD: Testing one behavior
   @Test
   void whenDivideByZero_thenThrowsException() {
       assertThrows(ArithmeticException.class, () -> calculator.divide(1, 0));
   }
   
   // BAD: Testing multiple behaviors
   @Test
   void testCalculator() {
       assertEquals(5, calculator.add(2, 3));
       assertEquals(2, calculator.subtract(5, 3));
       assertThrows(ArithmeticException.class, () -> calculator.divide(1, 0));
   }
   ```

2. **Use Descriptive Test Names**
   ```java
   // GOOD: Descriptive name
   @Test
   void givenValidCredentials_whenLogin_thenSucceeds() {
       // Test implementation
   }
   
   // BAD: Vague name
   @Test
   void testLogin() {
       // Test implementation
   }
   ```

3. **Follow Arrange-Act-Assert Pattern**
   ```java
   @Test
   void givenExistingUser_whenUpdateEmail_thenEmailUpdated() {
       // Arrange
       User user = new User(1, "John", "john@example.com");
       when(userRepository.findById(1)).thenReturn(Optional.of(user));
       
       // Act
       userService.updateEmail(1, "new@example.com");
       
       // Assert
       assertEquals("new@example.com", user.getEmail());
       verify(userRepository).save(user);
   }
   ```

4. **Test Behavior, Not Implementation**
   ```java
   // GOOD: Testing behavior
   @Test
   void givenInvalidEmail_whenValidate_thenReturnsFalse() {
       assertFalse(validator.isValidEmail("not-an-email"));
   }
   
   // BAD: Testing implementation
   @Test
   void checkEmailValidationRegex() {
       Pattern pattern = (Pattern) ReflectionUtils.getField(
           ValidatorClass.class.getDeclaredField("EMAIL_PATTERN"), 
           validator);
       assertTrue(pattern.matcher("email@example.com").matches());
   }
   ```

5. **Use Appropriate Assertions**
   ```java
   // GOOD: Clear assertions
   @Test
   void testUser() {
       User user = new User("John", 30);
       assertEquals("John", user.getName());
       assertEquals(30, user.getAge());
   }
   
   // BETTER: AssertJ fluent assertions
   @Test
   void testUserWithAssertJ() {
       User user = new User("John", 30);
       assertThat(user)
           .extracting(User::getName, User::getAge)
           .containsExactly("John", 30);
   }
   ```

### Integration Testing Best Practices

1. **Use Real Dependencies When Possible**
   - Test with real databases for data access layers
   - Use embedded servers for testing microservices
   - Leverage test containers for external services

2. **Control External Services**
   - Use WireMock for HTTP dependencies
   - Use Embedded Kafka for messaging
   - Use Testcontainers for databases and other services

3. **Focus on Component Interactions**
   - Test API contracts
   - Test database interactions
   - Test messaging patterns

4. **Validate End-to-End Flows**
   - Test complete business processes
   - Verify system behavior as a whole
   - Cover critical user journeys

### Test Data Management

1. **Use Test Data Builders**
   ```java
   public class UserBuilder {
       private int id = 1;
       private String name = "Default Name";
       private String email = "default@example.com";
       private boolean active = true;
       
       public UserBuilder withId(int id) {
           this.id = id;
           return this;
       }
       
       public UserBuilder withName(String name) {
           this.name = name;
           return this;
       }
       
       public UserBuilder withEmail(String email) {
           this.email = email;
           return this;
       }
       
       public UserBuilder inactive() {
           this.active = false;
           return this;
       }
       
       public User build() {
           User user = new User(name, email);
           user.setId(id);
           user.setActive(active);
           return user;
       }
       
       public static UserBuilder aUser() {
           return new UserBuilder();
       }
   }
   
   // Usage in tests
   @Test
   void testInactiveUser() {
       User user = UserBuilder.aUser()
           .withName("John")
           .inactive()
           .build();
       
       assertFalse(user.isActive());
   }
   ```

2. **Use Test Fixtures**
   ```java
   public class TestFixtures {
       public static List<User> createSampleUsers() {
           return List.of(
               new User(1, "John", "john@example.com"),
               new User(2, "Jane", "jane@example.com"),
               new User(3, "Bob", "bob@example.com")
           );
       }
       
       public static Order createSampleOrder() {
           // Create and return sample order
       }
   }
   ```

3. **Database Test Data**
   - Use database migrations (Flyway/Liquibase)
   - Create test-specific datasets
   - Reset database between tests

## Common Testing Pitfalls

### Unit Testing Pitfalls

1. **Testing Implementation Details**
   ```java
   // PROBLEMATIC: Testing private methods
   @Test
   void testPrivateMethod() throws Exception {
       Method method = UserService.class.getDeclaredMethod("validateEmail", String.class);
       method.setAccessible(true);
       boolean result = (boolean) method.invoke(userService, "user@example.com");
       assertTrue(result);
   }
   
   // BETTER: Test the public behavior
   @Test
   void givenInvalidEmail_whenCreateUser_thenThrowsException() {
       assertThrows(IllegalArgumentException.class, 
           () -> userService.createUser("John", "invalid-email"));
   }
   ```

2. **Over-mocking**
   ```java
   // PROBLEMATIC: Too many mocks
   @Test
   void testOverMocked() {
       when(dependency1.method1()).thenReturn("value1");
       when(dependency2.method2(any())).thenReturn("value2");
       when(dependency3.method3(anyString(), anyInt())).thenReturn("value3");
       when(dependency4.method4()).thenReturn("value4");
       when(dependency5.method5()).thenReturn("value5");
       
       String result = service.doSomething();
       
       assertEquals("expected", result);
   }
   
   // BETTER: Test with real objects when possible
   @Test
   void testWithRealObjects() {
       Dependency1 real1 = new Dependency1();
       Dependency2 real2 = new Dependency2();
       
       Service service = new Service(real1, real2, mockDep3);
       
       String result = service.doSomething();
       
       assertEquals("expected", result);
   }
   ```

3. **Inadequate Assertions**
   ```java
   // PROBLEMATIC: Missing assertions
   @Test
   void testNoAssertions() {
       service.process("input");
       // No assertions!
   }
   
   // PROBLEMATIC: Too general assertions
   @Test
   void testVagueAssertions() {
       List<User> users = userService.getAllUsers();
       assertNotNull(users); // Not specific enough
   }
   
   // BETTER: Specific assertions
   @Test
   void testSpecificAssertions() {
       List<User> users = userService.getAllUsers();
       assertThat(users)
           .isNotEmpty()
           .hasSize(3)
           .extracting(User::getEmail)
           .contains("john@example.com", "jane@example.com");
   }
   ```

4. **Flaky Tests**
   ```java
   // PROBLEMATIC: Time-dependent test
   @Test
   void testTimeDependent() {
       Order order = new Order();
       order.setCreationTime(new Date());
       
       boolean isNew = orderService.isNewOrder(order);
       
       assertTrue(isNew); // Might fail near midnight
   }
   
   // BETTER: Inject clock
   @Test
   void testWithInjectedClock() {
       Clock fixedClock = Clock.fixed(
           Instant.parse("2023-01-01T12:00:00Z"),
           ZoneId.systemDefault());
       
       OrderService orderService = new OrderService(fixedClock);
       
       Order order = new Order();
       order.setCreationTime(Date.from(fixedClock.instant()));
       
       boolean isNew = orderService.isNewOrder(order);
       
       assertTrue(isNew);
   }
   ```

### Integration Testing Pitfalls

1. **Shared Mutable State**
   ```java
   // PROBLEMATIC: Static state affecting tests
   public static class SharedCounter {
       public static int count = 0;
       
       public static void increment() {
           count++;
       }
   }
   
   @Test
   void test1() {
       SharedCounter.count = 0;
       SharedCounter.increment();
       assertEquals(1, SharedCounter.count);
   }
   
   @Test
   void test2() {
       SharedCounter.increment();
       assertEquals(1, SharedCounter.count); // Might fail if test1 runs first
   }
   ```

2. **Incomplete Environment Setup**
   ```java
   // PROBLEMATIC: Missing configuration
   @Test
   void testDatabaseWithoutSchema() {
       // Assumes database schema exists
       userRepository.save(new User("John", "john@example.com"));
   }
   
   // BETTER: Ensure complete environment
   @Test
   void testWithProperSetup() {
       // Use Flyway to create schema
       flyway.migrate();
       
       userRepository.save(new User("John", "john@example.com"));
   }
   ```

3. **Ignoring Cleanup**
   ```java
   // PROBLEMATIC: No cleanup
   @Test
   void testWithoutCleanup() {
       File tempFile = new File("temp.txt");
       tempFile.createNewFile();
       // Test file operations
       // Forgot to delete the file
   }
   
   // BETTER: Ensure cleanup
   @Test
   void testWithCleanup() {
       File tempFile = new File("temp.txt");
       try {
           tempFile.createNewFile();
           // Test file operations
       } finally {
           tempFile.delete();
       }
   }
   ```

4. **Race Conditions in Concurrent Tests**
   ```java
   // PROBLEMATIC: Race condition
   @Test
   void testConcurrentAccess() throws Exception {
       CountDownLatch latch = new CountDownLatch(1);
       AtomicBoolean failed = new AtomicBoolean(false);
       
       Thread thread1 = new Thread(() -> {
           try {
               latch.await();
               service.increment();
           } catch (Exception e) {
               failed.set(true);
           }
       });
       
       Thread thread2 = new Thread(() -> {
           try {
               latch.await();
               service.increment();
           } catch (Exception e) {
               failed.set(true);
           }
       });
       
       thread1.start();
       thread2.start();
       latch.countDown();
       
       thread1.join();
       thread2.join();
       
       assertFalse(failed.get());
       assertEquals(2, service.getCount()); // Might fail
   }
   
   // BETTER: Use proper concurrency testing tools
   @Test
   void testWithJCStress() {
       ConcurrentServiceStressTest stressTest = new ConcurrentServiceStressTest();
       stressTest.run();
       assertTrue(stressTest.passed());
   }
   ```

### System Testing Pitfalls

1. **Environment Differences**
   ```java
   // PROBLEMATIC: Hardcoded paths
   @Test
   void testFileProcessing() {
       service.processFile("C:\\data\\input.txt");
       assertTrue(Files.exists(Paths.get("C:\\data\\output.txt")));
   }
   
   // BETTER: Use relative paths or environment variables
   @Test
   void testFileProcessingPortable() {
       String baseDir = System.getProperty("java.io.tmpdir");
       Path inputPath = Paths.get(baseDir, "input.txt");
       Path outputPath = Paths.get(baseDir, "output.txt");
       
       Files.write(inputPath, "test data".getBytes());
       
       service.processFile(inputPath.toString());
       assertTrue(Files.exists(outputPath));
   }
   ```

2. **Insufficient Load Testing**
   ```java
   // PROBLEMATIC: Fixed small dataset
   @Test
   void testBatchProcessing() {
       List<Order> orders = createSampleOrders(10); // Only 10 items
       service.processBatch(orders);
       // Assert results
   }
   
   // BETTER: Test with realistic volumes
   @Test
   void testLargeDatasetProcessing() {
       List<Order> orders = createSampleOrders(10000);
       service.processBatch(orders);
       // Assert results and performance metrics
   }
   ```

## Advanced Testing Techniques

### Property-Based Testing

Property-based testing generates random input data to test properties that should hold for all inputs.

#### Using JUnit-QuickCheck
```java
import com.pholser.junit.quickcheck.Property;
import com.pholser.junit.quickcheck.runner.JUnitQuickcheck;
import org.junit.runner.RunWith;

import static org.junit.Assert.*;

@RunWith(JUnitQuickcheck.class)
public class StringReversePropertyTest {
    
    @Property
    public void reverseTwiceIsOriginal(String original) {
        StringUtils stringUtils = new StringUtils();
        String reversed = stringUtils.reverse(original);
        String reversedTwice = stringUtils.reverse(reversed);
        
        assertEquals(original, reversedTwice);
    }
    
    @Property
    public void reversePreservesLength(String original) {
        StringUtils stringUtils = new StringUtils();
        String reversed = stringUtils.reverse(original);
        
        assertEquals(original.length(), reversed.length());
    }
}
```

### Mutation Testing

Mutation testing assesses test quality by introducing bugs (mutations) and checking if tests catch them.

#### Using PIT Mutation Testing
```xml
<plugin>
    <groupId>org.pitest</groupId>
    <artifactId>pitest-maven</artifactId>
    <version>1.14.0</version>
    <dependencies>
        <dependency>
            <groupId>org.pitest</groupId>
            <artifactId>pitest-junit5-plugin</artifactId>
            <version>1.2.0</version>
        </dependency>
    </dependencies>
    <configuration>
        <targetClasses>
            <param>com.example.service.*</param>
        </targetClasses>
        <targetTests>
            <param>com.example.service.*</param>
        </targetTests>
    </configuration>
</plugin>
```

### Approval Testing

Approval testing compares test outputs with previously approved outputs.

#### Using Approvals
```java
import org.approvaltests.Approvals;
import org.junit.jupiter.api.Test;

public class ReportGeneratorTest {
    
    @Test
    void testComplexReportGeneration() {
        ReportGenerator generator = new ReportGenerator();
        String report = generator.generateReport();
        
        Approvals.verify(report);
    }
}
```

### Chaos Testing

Chaos testing deliberately introduces failures to test system resilience.

#### Using Chaos Monkey for Spring Boot
```java
@SpringBootApplication
@EnableChaos
public class Application {
    
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

// application.properties
chaos.monkey.enabled=true
chaos.monkey.watcher.service=true
chaos.monkey.assaults.latencyActive=true
chaos.monkey.assaults.latencyRangeStart=1000
chaos.monkey.assaults.latencyRangeEnd=3000
```

### Consumer-Driven Contract Testing

CDC testing validates that API providers meet consumer expectations.

#### Using Spring Cloud Contract
```groovy
// src/test/resources/contracts/shouldReturnUser.groovy
package contracts

import org.springframework.cloud.contract.spec.Contract

Contract.make {
    description "should return user by ID"
    
    request {
        method GET()
        url "/api/users/1"
    }
    
    response {
        status 200
        headers {
            contentType('application/json')
        }
        body([
            id: 1,
            name: "John Doe",
            email: "john@example.com"
        ])
    }
}
```

### Fuzz Testing

Fuzz testing provides random or invalid data to find exceptions or security issues.

```java
import com.code_intelligence.jazzer.api.FuzzedDataProvider;
import com.code_intelligence.jazzer.junit.FuzzTest;

public class ParserFuzzTest {
    
    @FuzzTest
    void testJsonParser(FuzzedDataProvider data) {
        String input = data.consumeRemainingAsString();
        try {
            JsonParser parser = new JsonParser();
            parser.parse(input);
        } catch (JsonParseException e) {
            // Expected for invalid JSON
        } catch (Throwable t) {
            // Any other exception is a problem
            throw t;
        }
    }
}
```

### Performance Profiling

Performance profiling identifies bottlenecks and optimization opportunities.

```java
import org.junit.jupiter.api.Test;
import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.util.ArrayList;
import java.util.List;

public class MemoryUsageTest {
    
    @Test
    void testMemoryUsage() {
        MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
        long beforeHeapMemory = memoryBean.getHeapMemoryUsage().getUsed();
        
        // Execute code to be measured
        List<String> data = new ArrayList<>();
        for (int i = 0; i < 1000000; i++) {
            data.add("Item " + i);
        }
        
        long afterHeapMemory = memoryBean.getHeapMemoryUsage().getUsed();
        long memoryUsed = afterHeapMemory - beforeHeapMemory;
        
        System.out.println("Memory used: " + memoryUsed / (1024 * 1024) + " MB");
    }
}
```

## Resources for Further Learning

### Books
1. **"Effective Unit Testing" by Lasse Koskela**
   - Comprehensive guide to writing maintainable unit tests

2. **"Test Driven Development: By Example" by Kent Beck**
   - The definitive guide to TDD from its creator

3. **"Practical Unit Testing with JUnit and Mockito" by Tomek Kaczanowski**
   - Practical approaches to unit testing in Java

4. **"Growing Object-Oriented Software, Guided by Tests" by Steve Freeman and Nat Pryce**
   - How to use TDD to build maintainable OO systems

5. **"Java Testing with Spock" by Konstantinos Kapelonis**
   - Advanced testing using the Spock framework

### Online Resources
1. **JUnit 5 User Guide**
   - [https://junit.org/junit5/docs/current/user-guide/](https://junit.org/junit5/docs/current/user-guide/)

2. **Mockito Documentation**
   - [https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html)

3. **TestNG Documentation**
   - [https://testng.org/doc/documentation-main.html](https://testng.org/doc/documentation-main.html)

4. **Spring Testing Documentation**
   - [https://docs.spring.io/spring-framework/reference/testing.html](https://docs.spring.io/spring-framework/reference/testing.html)

5. **Baeldung Java Testing Articles**
   - [https://www.baeldung.com/java-tests](https://www.baeldung.com/java-tests)

6. **AssertJ Documentation**
   - [https://assertj.github.io/doc/](https://assertj.github.io/doc/)

7. **JMeter User Manual**
   - [https://jmeter.apache.org/usermanual/index.html](https://jmeter.apache.org/usermanual/index.html)

### Courses
1. **Testing Java Applications (Pluralsight)**
   - Comprehensive course on Java testing strategies

2. **Practical Test-Driven Development for Java Programmers (LinkedIn Learning)**
   - Hands-on TDD techniques for Java developers

3. **Spring: Test-Driven Development with JUnit (LinkedIn Learning)**
   - TDD specifically for Spring applications

4. **Automation Testing Masterclass with JUnit 5 & Mockito (Udemy)**
   - Detailed course on JUnit 5 and Mockito

### Tools
1. **SonarQube**
   - Code quality and security platform with test coverage analysis

2. **IntelliJ IDEA Test Runner**
   - Integrated test execution and debugging

3. **Eclipse Test & Performance Tools Platform**
   - Test tools for Eclipse IDE

4. **Jenkins CI/CD**
   - Automation server for continuous integration and testing

5. **Gatling**
   - Load and performance testing tool

## Practice Exercises

### Basic Testing Exercises

1. **Calculator Testing**
   Create a Calculator class with basic operations (add, subtract, multiply, divide) and write comprehensive unit tests.

2. **String Manipulation Library**
   Implement a utility class for string operations (reverse, capitalize, truncate) using TDD.

3. **Collection Wrapper**
   Create a custom collection class with operations like filter, map, and reduce, and test it thoroughly.

### Intermediate Testing Exercises

4. **Bank Account System**
   Implement a simple bank account system with deposit, withdraw, and transfer operations, using TDD.

5. **REST API Testing**
   Create a small REST API with Spring Boot and write both unit and integration tests.

6. **Mock External Services**
   Build a weather service that calls an external API, and test it using mocks.

### Advanced Testing Exercises

7. **Concurrent Data Structure**
   Implement a thread-safe data structure (e.g., blocking queue) and test its concurrency behavior.

8. **Performance Testing**
   Create JMH benchmarks to compare different implementations of a sorting algorithm.

9. **End-to-End Testing**
   Develop a small web application and create E2E tests using Selenium or Playwright.

10. **Property-Based Testing**
    Implement sorting algorithms and test them using property-based testing to verify correctness.