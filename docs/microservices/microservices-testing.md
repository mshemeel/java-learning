# Microservices Testing

## Overview
This guide covers comprehensive testing strategies for microservices architecture, including unit testing, integration testing, contract testing, and end-to-end testing approaches.

## Prerequisites
- Basic understanding of microservices architecture
- Knowledge of testing frameworks (JUnit, Mockito)
- Familiarity with Spring Boot Testing
- Understanding of contract testing concepts

## Learning Objectives
- Understand different testing strategies
- Learn unit testing best practices
- Master integration testing
- Implement contract testing
- Handle end-to-end testing

## Table of Contents
1. [Unit Testing](#unit-testing)
2. [Integration Testing](#integration-testing)
3. [Contract Testing](#contract-testing)
4. [End-to-End Testing](#end-to-end-testing)
5. [Performance Testing](#performance-testing)

## Unit Testing

### Service Layer Testing
```java
@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private UserService userService;
    
    @Test
    void whenGetUser_thenReturnUser() {
        // Arrange
        User user = new User("1", "John Doe");
        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        
        // Act
        User result = userService.getUser("1");
        
        // Assert
        assertNotNull(result);
        assertEquals("John Doe", result.getName());
        verify(userRepository).findById("1");
    }
}
```

### Controller Layer Testing
```java
@WebMvcTest(UserController.class)
public class UserControllerTest {
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private UserService userService;
    
    @Test
    void whenGetUser_thenReturnJson() throws Exception {
        User user = new User("1", "John Doe");
        when(userService.getUser("1")).thenReturn(user);
        
        mockMvc.perform(get("/api/users/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("John Doe"));
    }
}
```

## Integration Testing

### Database Integration Testing
```java
@SpringBootTest
@AutoConfigureTestDatabase
public class UserRepositoryIntegrationTest {
    @Autowired
    private UserRepository userRepository;
    
    @Test
    void whenSaveUser_thenReturnSavedUser() {
        // Arrange
        User user = new User(null, "John Doe");
        
        // Act
        User savedUser = userRepository.save(user);
        
        // Assert
        assertNotNull(savedUser.getId());
        assertEquals("John Doe", savedUser.getName());
    }
}
```

### API Integration Testing
```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class UserApiIntegrationTest {
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void whenCallUserApi_thenReturnUser() {
        // Act
        ResponseEntity<User> response = restTemplate.getForEntity(
            "/api/users/1", User.class);
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }
}
```

## Contract Testing

### Consumer Contract
```java
@SpringBootTest
@AutoConfigureMessageVerifier
public class UserServiceConsumerTest {
    @Autowired
    private UserClient userClient;
    
    @Test
    @PactTestFor(providerName = "user-service")
    void whenGetUser_thenReturnUser() {
        // Arrange
        MockMvcTestTarget target = new MockMvcTestTarget();
        target.setControllerAdvice(new GlobalExceptionHandler());
        
        // Act & Assert
        User user = userClient.getUser("1");
        assertThat(user).isNotNull();
        assertThat(user.getName()).isEqualTo("John Doe");
    }
}
```

### Provider Contract
```java
@SpringBootTest
@Provider("user-service")
@PactBroker
public class UserServiceProviderTest {
    @MockBean
    private UserService userService;
    
    @TestTemplate
    @ExtendWith(PactVerificationInvocationContextProvider.class)
    void pactVerificationTestTemplate(PactVerificationContext context) {
        context.verifyInteraction();
    }
    
    @State("User exists")
    void toUserExistsState() {
        when(userService.getUser("1"))
            .thenReturn(new User("1", "John Doe"));
    }
}
```

## End-to-End Testing

### Cucumber Test
```java
@SpringBootTest
@CucumberContextConfiguration
public class UserFlowTest {
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Given("a user exists with id {string}")
    public void userExists(String id) {
        // Setup test data
    }
    
    @When("the client requests user details")
    public void clientRequestsUser() {
        response = restTemplate.getForEntity("/api/users/1", User.class);
    }
    
    @Then("the response should contain user details")
    public void validateResponse() {
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }
}
```

### Selenium Test
```java
public class UserUITest {
    private WebDriver driver;
    
    @Test
    void testUserDetailsPage() {
        driver.get("http://localhost:8080/users/1");
        
        WebElement nameElement = driver.findElement(By.id("userName"));
        assertEquals("John Doe", nameElement.getText());
    }
}
```

## Performance Testing

### JMeter Test Plan
```xml
<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2">
  <hashTree>
    <TestPlan guiclass="TestPlanGui" testclass="TestPlan" testname="User Service Test">
      <elementProp name="TestPlan.user_defined_variables" elementType="Arguments">
        <collectionProp name="Arguments.arguments"/>
      </elementProp>
    </TestPlan>
    <hashTree>
      <ThreadGroup guiclass="ThreadGroupGui" testclass="ThreadGroup" testname="Users">
        <elementProp name="ThreadGroup.main_controller" elementType="LoopController">
          <stringProp name="LoopController.loops">10</stringProp>
        </elementProp>
        <stringProp name="ThreadGroup.num_threads">100</stringProp>
      </ThreadGroup>
    </hashTree>
  </hashTree>
</jmeterTestPlan>
```

### Gatling Test
```scala
class UserSimulation extends Simulation {
  val httpProtocol = http
    .baseUrl("http://localhost:8080")
    .acceptHeader("application/json")
  
  val scn = scenario("Get User")
    .exec(http("request_1")
      .get("/api/users/1"))
    .pause(5)
  
  setUp(scn.inject(
    rampUsers(100).during(10.seconds)
  ).protocols(httpProtocol))
}
```

## Best Practices
1. Follow the testing pyramid
2. Write maintainable tests
3. Use appropriate test doubles
4. Implement continuous testing
5. Monitor test coverage
6. Write meaningful assertions
7. Use test data builders

## Common Pitfalls
1. Insufficient test coverage
2. Brittle tests
3. Slow tests
4. Missing integration tests
5. Poor test isolation
6. Inadequate error scenarios

## Implementation Examples

### Complete Test Suite
```java
@SpringBootTest
public class UserServiceCompleteTest {
    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;
    
    @BeforeEach
    void setup() {
        userRepository.deleteAll();
    }
    
    @Test
    void testCreateUser() {
        User user = new User(null, "John Doe");
        User savedUser = userService.createUser(user);
        assertNotNull(savedUser.getId());
    }
    
    @Test
    void testUpdateUser() {
        User user = userService.createUser(new User(null, "John Doe"));
        user.setName("Jane Doe");
        User updatedUser = userService.updateUser(user);
        assertEquals("Jane Doe", updatedUser.getName());
    }
    
    @Test
    void testDeleteUser() {
        User user = userService.createUser(new User(null, "John Doe"));
        userService.deleteUser(user.getId());
        assertThrows(UserNotFoundException.class,
            () -> userService.getUser(user.getId()));
    }
}
```

### Test Configuration
```java
@Configuration
@Profile("test")
public class TestConfig {
    @Bean
    public UserRepository userRepository() {
        return new InMemoryUserRepository();
    }
    
    @Bean
    public TestRestTemplate testRestTemplate() {
        return new TestRestTemplate();
    }
}
```

## Resources for Further Learning
- [JUnit 5 Documentation](https://junit.org/junit5/docs/current/user-guide/)
- [Mockito Documentation](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html)
- [Spring Boot Testing Guide](https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-testing)
- [Pact Documentation](https://docs.pact.io/)

## Practice Exercises
1. Write comprehensive unit tests
2. Implement integration tests
3. Set up contract testing
4. Create end-to-end tests
5. Perform load testing 