# Spring Boot Testing

## Overview
This guide provides a comprehensive approach to testing Spring Boot applications. It covers unit testing, integration testing, test slices, mocking strategies, and more. By the end of this guide, you'll understand how to implement effective testing strategies for Spring Boot applications, ensuring their reliability and robustness.

## Prerequisites
- Basic knowledge of Java and Spring Boot
- Understanding of software testing concepts
- Familiarity with dependency injection and inversion of control
- Development environment with Spring Boot set up

## Learning Objectives
- Understand the Spring Boot testing framework
- Implement unit tests for Spring components
- Write integration tests for Spring Boot applications
- Use Spring Boot test slices for focused testing
- Apply mocking strategies with Mockito
- Test web controllers with MockMvc
- Implement data access layer tests
- Test security configurations
- Execute performance and load tests
- Apply test-driven development practices

## Table of Contents
1. [Testing Fundamentals in Spring Boot](#testing-fundamentals-in-spring-boot)
2. [Unit Testing Spring Components](#unit-testing-spring-components)
3. [Integration Testing](#integration-testing)
4. [Test Slices](#test-slices)
5. [MockMvc for Web Layer Testing](#mockmvc-for-web-layer-testing)
6. [Data Access Layer Testing](#data-access-layer-testing)
7. [Mocking with Mockito](#mocking-with-mockito)
8. [Testing Security](#testing-security)
9. [Testing Configurations](#testing-configurations)
10. [Test Containers](#test-containers)
11. [Performance and Load Testing](#performance-and-load-testing)
12. [Test-Driven Development](#test-driven-development)
13. [Testing Best Practices](#testing-best-practices)

## Testing Fundamentals in Spring Boot

Spring Boot provides extensive support for testing through the spring-boot-starter-test dependency, which includes:

- JUnit 5: The core testing framework
- Spring Test & Spring Boot Test: Utilities and annotations for testing Spring Boot applications
- AssertJ: Fluent assertion library
- Hamcrest: Matchers for test expressions
- Mockito: Mocking framework
- JSONassert: JSON assertion library
- JsonPath: XPath for JSON

### Setting Up Test Dependencies

To start testing a Spring Boot application, add the following dependency to your build file:

```xml
<!-- Maven -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

Or for Gradle:

```groovy
// Gradle
testImplementation 'org.springframework.boot:spring-boot-starter-test'
```

### Test Structure and Configuration

A typical Spring Boot test class structure includes:

- Annotations for test configuration
- Setup methods for test initialization
- Test methods that validate specific functionality
- Teardown methods for cleaning up resources

Example of a basic test class:

```java
@SpringBootTest
class ApplicationTests {

    @Autowired
    private SomeService someService;

    @BeforeEach
    void setUp() {
        // Setup code executed before each test
    }

    @Test
    void contextLoads() {
        // Verify application context loads successfully
        assertThat(someService).isNotNull();
    }

    @Test
    void testServiceOperation() {
        // Test specific functionality
        String result = someService.performOperation("input");
        assertThat(result).isEqualTo("expected output");
    }

    @AfterEach
    void tearDown() {
        // Cleanup code executed after each test
    }
}
```

### Spring Boot Test Annotations

Spring Boot provides several annotations to simplify testing:

- `@SpringBootTest`: Loads the full application context. Use when you need the complete Spring context.
- `@WebMvcTest`: Focuses on testing the web layer, including controllers.
- `@DataJpaTest`: Focuses on the JPA components.
- `@RestClientTest`: Tests REST clients.
- `@JsonTest`: Tests JSON serialization/deserialization.
- `@AutoConfigureMockMvc`: Configures MockMvc for testing web controllers.
- `@MockBean`: Creates and injects a Mockito mock.
- `@SpyBean`: Creates and injects a Mockito spy.

### Testing Profiles

It's common to use different configuration profiles for testing:

```properties
# application-test.properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.jpa.hibernate.ddl-auto=create-drop
```

Activate the profile in your test:

```java
@SpringBootTest
@ActiveProfiles("test")
class ApplicationTests {
    // Test methods
}
```

### Testing Lifecycle

JUnit 5 provides annotations for controlling the test lifecycle:

- `@BeforeAll`: Executed once, before all test methods.
- `@AfterAll`: Executed once, after all test methods.
- `@BeforeEach`: Executed before each test method.
- `@AfterEach`: Executed after each test method.
- `@Test`: Marks a method as a test case.
- `@Disabled`: Temporarily disables a test.
- `@DisplayName`: Provides a custom name for the test.
- `@Tag`: Tags tests for selective execution.
- `@Timeout`: Fails the test if it exceeds the given timeout.
- `@RepeatedTest`: Repeats a test a specified number of times.
- `@ParameterizedTest`: Runs a test multiple times with different arguments.

## Unit Testing Spring Components

Unit tests focus on testing individual components in isolation. In Spring Boot, this often means testing a service or component without loading the entire Spring context.

### Testing Services

A service is typically tested by mocking its dependencies:

```java
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class UserServiceTests {

    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private UserServiceImpl userService;
    
    private User testUser;
    
    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
    }
    
    @Test
    void findByIdShouldReturnUser() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        
        // Act
        Optional<User> foundUser = userService.findById(1L);
        
        // Assert
        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getUsername()).isEqualTo("testuser");
    }
    
    @Test
    void findByIdShouldReturnEmptyWhenUserNotFound() {
        // Arrange
        when(userRepository.findById(999L)).thenReturn(Optional.empty());
        
        // Act
        Optional<User> foundUser = userService.findById(999L);
        
        // Assert
        assertThat(foundUser).isEmpty();
    }
}
```

### Testing Utilities and Helper Classes

For utility classes and helpers, pure unit tests are appropriate:

```java
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

class StringUtilsTests {

    @Test
    void nullOrEmptyShouldReturnTrueForNullString() {
        assertThat(StringUtils.isNullOrEmpty(null)).isTrue();
    }
    
    @Test
    void nullOrEmptyShouldReturnTrueForEmptyString() {
        assertThat(StringUtils.isNullOrEmpty("")).isTrue();
    }
    
    @Test
    void nullOrEmptyShouldReturnFalseForNonEmptyString() {
        assertThat(StringUtils.isNullOrEmpty("text")).isFalse();
    }
    
    @ParameterizedTest
    @CsvSource({
        "test, TEST",
        "Spring, SPRING",
        "java, JAVA"
    })
    void toUpperCaseShouldConvertStringToUpperCase(String input, String expected) {
        assertThat(StringUtils.toUpperCase(input)).isEqualTo(expected);
    }
    
    @Test
    void toUpperCaseShouldThrowExceptionForNullInput() {
        assertThrows(NullPointerException.class, () -> StringUtils.toUpperCase(null));
    }
}
```

### Using TestNG Instead of JUnit

If you prefer TestNG over JUnit, configure it in your build:

```xml
<!-- Maven -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
    <exclusions>
        <exclusion>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<dependency>
    <groupId>org.testng</groupId>
    <artifactId>testng</artifactId>
    <version>7.7.1</version>
    <scope>test</scope>
</dependency>
```

TestNG test example:

```java
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class UserServiceTestNG {

    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private UserServiceImpl userService;
    
    private User testUser;
    
    @BeforeMethod
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
    }
    
    @Test
    public void findByIdShouldReturnUser() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        
        Optional<User> foundUser = userService.findById(1L);
        
        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getUsername()).isEqualTo("testuser");
    }
}
```

## Integration Testing

Integration tests verify that different components work together correctly. In Spring Boot, this typically involves loading a subset of the application context.

### @SpringBootTest

The `@SpringBootTest` annotation creates the application context used in tests:

```java
@SpringBootTest
class IntegrationTests {

    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;
    
    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }
    
    @Test
    void createUserShouldStoreInDatabase() {
        // Create a new user
        User user = new User();
        user.setUsername("integrationtest");
        user.setEmail("integration@example.com");
        
        // Save using the service
        User savedUser = userService.save(user);
        
        // Verify it's in the database
        Optional<User> foundUser = userRepository.findById(savedUser.getId());
        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getUsername()).isEqualTo("integrationtest");
    }
}
```

For web applications, you can specify if a real or mock web environment should be used:

```java
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class WebIntegrationTests {

    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void getUserShouldReturnUserDetails() {
        ResponseEntity<User> response = restTemplate.getForEntity("/api/users/1", User.class);
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getId()).isEqualTo(1L);
    }
}
```

### Testing with TestRestTemplate

`TestRestTemplate` is ideal for integration tests that need to make HTTP requests:

```java
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class UserControllerIntegrationTests {

    @Autowired
    private TestRestTemplate restTemplate;
    
    @Autowired
    private UserRepository userRepository;
    
    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        
        User user = new User();
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        userRepository.save(user);
    }
    
    @Test
    void getAllUsersShouldReturnUsers() {
        ResponseEntity<User[]> response = restTemplate.getForEntity("/api/users", User[].class);
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).hasSize(1);
        assertThat(response.getBody()[0].getUsername()).isEqualTo("testuser");
    }
    
    @Test
    void createUserShouldReturnNewUser() {
        User newUser = new User();
        newUser.setUsername("newuser");
        newUser.setEmail("new@example.com");
        
        ResponseEntity<User> response = restTemplate.postForEntity("/api/users", newUser, User.class);
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getUsername()).isEqualTo("newuser");
        assertThat(response.getBody().getId()).isNotNull();
    }
}
```

### Custom Configuration for Tests

You can customize the configuration for tests using `@TestConfiguration`:

```java
@SpringBootTest
class CustomConfigIntegrationTests {

    @TestConfiguration
    static class TestConfig {
        @Bean
        public SomeService someServiceMock() {
            return Mockito.mock(SomeService.class);
        }
    }
    
    @Autowired
    private SomeService someService;
    
    @Test
    void testWithCustomConfiguration() {
        // The someService is the mock from TestConfig
        Mockito.when(someService.performOperation(any())).thenReturn("mocked result");
        
        String result = someService.performOperation("test");
        assertThat(result).isEqualTo("mocked result");
    }
}
```

### Using @DirtiesContext

When a test modifies the application context, mark it with `@DirtiesContext` to reset the context for subsequent tests:

```java
@SpringBootTest
class ContextModifyingTests {

    @Autowired
    private ApplicationContext context;
    
    @Test
    @DirtiesContext
    void testThatModifiesContext() {
        // Test that changes the application context
    }
    
    @Test
    void subsequentTest() {
        // This test will get a fresh application context
    }
}
```

## Test Slices

Spring Boot provides test slice annotations that load only a portion of the application context, making tests faster and more focused.

### @WebMvcTest

For testing Spring MVC controllers without starting the full application:

```java
@WebMvcTest(UserController.class)
class UserControllerTests {

    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private UserService userService;
    
    @Test
    void getUserByIdShouldReturnUser() throws Exception {
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        
        when(userService.findById(1L)).thenReturn(Optional.of(user));
        
        mockMvc.perform(get("/api/users/1"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.id").value(1))
               .andExpect(jsonPath("$.username").value("testuser"));
    }
    
    @Test
    void getUserByIdShouldReturn404WhenNotFound() throws Exception {
        when(userService.findById(999L)).thenReturn(Optional.empty());
        
        mockMvc.perform(get("/api/users/999"))
               .andExpect(status().isNotFound());
    }
}
```

### @DataJpaTest

For testing JPA repositories:

```java
@DataJpaTest
class UserRepositoryTests {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Test
    void findByUsernameShouldReturnUser() {
        // Create and persist a test user
        User user = new User();
        user.setUsername("jpatest");
        user.setEmail("jpa@example.com");
        entityManager.persist(user);
        entityManager.flush();
        
        // Test the query method
        User found = userRepository.findByUsername("jpatest");
        
        assertThat(found).isNotNull();
        assertThat(found.getEmail()).isEqualTo("jpa@example.com");
    }
    
    @Test
    void findByUsernameShouldReturnNullWhenUsernameNotFound() {
        User found = userRepository.findByUsername("nonexistent");
        
        assertThat(found).isNull();
    }
}
```

### @JsonTest

For testing JSON serialization and deserialization:

```java
@JsonTest
class UserJsonTests {

    @Autowired
    private JacksonTester<User> json;
    
    @Test
    void serializeUserToJson() throws Exception {
        User user = new User();
        user.setId(1L);
        user.setUsername("jsontest");
        user.setEmail("json@example.com");
        
        JsonContent<User> jsonContent = json.write(user);
        
        assertThat(jsonContent).extractingJsonPathNumberValue("$.id").isEqualTo(1);
        assertThat(jsonContent).extractingJsonPathStringValue("$.username").isEqualTo("jsontest");
        assertThat(jsonContent).extractingJsonPathStringValue("$.email").isEqualTo("json@example.com");
    }
    
    @Test
    void deserializeUserFromJson() throws Exception {
        String jsonContent = "{\"id\":1,\"username\":\"jsontest\",\"email\":\"json@example.com\"}";
        
        User user = json.parse(jsonContent).getObject();
        
        assertThat(user.getId()).isEqualTo(1L);
        assertThat(user.getUsername()).isEqualTo("jsontest");
        assertThat(user.getEmail()).isEqualTo("json@example.com");
    }
}
```

### @RestClientTest

For testing REST clients:

```java
@RestClientTest(RemoteUserService.class)
class RemoteUserServiceTests {

    @Autowired
    private RemoteUserService remoteUserService;
    
    @Autowired
    private MockRestServiceServer server;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Test
    void getRemoteUserShouldReturnUser() throws Exception {
        User user = new User();
        user.setId(1L);
        user.setUsername("remoteuser");
        
        server.expect(requestTo("/api/remote/users/1"))
              .andRespond(withSuccess(objectMapper.writeValueAsString(user), MediaType.APPLICATION_JSON));
        
        User result = remoteUserService.getUser(1L);
        
        assertThat(result).isNotNull();
        assertThat(result.getUsername()).isEqualTo("remoteuser");
    }
    
    @Test
    void getRemoteUserShouldHandleError() throws Exception {
        server.expect(requestTo("/api/remote/users/999"))
              .andRespond(withStatus(HttpStatus.NOT_FOUND));
        
        assertThatExceptionOfType(UserNotFoundException.class)
            .isThrownBy(() -> remoteUserService.getUser(999L));
    }
}
```

### @DataMongoTest

For testing MongoDB repositories:

```java
@DataMongoTest
class ProductRepositoryTests {

    @Autowired
    private ProductRepository productRepository;
    
    @BeforeEach
    void setUp() {
        productRepository.deleteAll();
    }
    
    @Test
    void saveShouldPersistProduct() {
        Product product = new Product();
        product.setName("Test Product");
        product.setPrice(BigDecimal.valueOf(19.99));
        
        Product savedProduct = productRepository.save(product);
        
        assertThat(savedProduct.getId()).isNotNull();
        
        Optional<Product> foundProduct = productRepository.findById(savedProduct.getId());
        assertThat(foundProduct).isPresent();
        assertThat(foundProduct.get().getName()).isEqualTo("Test Product");
    }
    
    @Test
    void findByNameShouldReturnProducts() {
        // Create and save two products
        Product product1 = new Product();
        product1.setName("Search Product");
        product1.setPrice(BigDecimal.valueOf(29.99));
        productRepository.save(product1);
        
        Product product2 = new Product();
        product2.setName("Another Product");
        product2.setPrice(BigDecimal.valueOf(39.99));
        productRepository.save(product2);
        
        // Test the query
        List<Product> foundProducts = productRepository.findByNameContaining("Search");
        
        assertThat(foundProducts).hasSize(1);
        assertThat(foundProducts.get(0).getName()).isEqualTo("Search Product");
    }
} 
```

## Mocking with Mockito

Mockito is a popular mocking framework bundled with Spring Boot's testing starter. It allows you to create mock objects, specify their behavior, and verify their interactions.

### Basic Mocking

```java
@ExtendWith(MockitoExtension.class)
class NotificationServiceTests {

    @Mock
    private EmailSender emailSender;
    
    @Mock
    private SMSGateway smsGateway;
    
    @InjectMocks
    private NotificationServiceImpl notificationService;
    
    @Test
    void notifyUserShouldSendEmailAndSMS() {
        // Arrange
        User user = new User("user@example.com", "1234567890");
        String message = "Test notification";
        
        // No need to define behavior for void methods like these
        // unless you want them to throw exceptions
        
        // Act
        notificationService.notifyUser(user, message);
        
        // Assert - verify the mock interactions
        verify(emailSender).sendEmail(user.getEmail(), message);
        verify(smsGateway).sendSMS(user.getPhoneNumber(), message);
    }
}
```

### Stubbing Method Calls

```java
@Test
void getUserFullNameShouldCombineFirstAndLastName() {
    // Arrange
    UserRepository userRepository = mock(UserRepository.class);
    User user = new User();
    user.setFirstName("John");
    user.setLastName("Doe");
    
    when(userRepository.findById(1L)).thenReturn(Optional.of(user));
    
    UserService userService = new UserServiceImpl(userRepository);
    
    // Act
    String fullName = userService.getUserFullName(1L);
    
    // Assert
    assertThat(fullName).isEqualTo("John Doe");
}
```

### Advanced Mocking Techniques

#### Argument Matchers

```java
// Using any() to match any argument
when(userRepository.findByUsername(any())).thenReturn(user);

// Using specific argument matchers
when(userRepository.findByUsernameAndActive(eq("admin"), anyBoolean())).thenReturn(user);
```

#### Argument Captor

```java
@Test
void processOrderShouldSendConfirmationEmail() {
    // Arrange
    ArgumentCaptor<String> emailCaptor = ArgumentCaptor.forClass(String.class);
    ArgumentCaptor<String> subjectCaptor = ArgumentCaptor.forClass(String.class);
    
    Order order = new Order();
    order.setId("ORD-12345");
    order.setCustomerEmail("customer@example.com");
    
    // Act
    orderService.processOrder(order);
    
    // Assert - Capture and verify the arguments
    verify(emailService).sendEmail(emailCaptor.capture(), subjectCaptor.capture(), any());
    
    assertThat(emailCaptor.getValue()).isEqualTo("customer@example.com");
    assertThat(subjectCaptor.getValue()).contains("ORD-12345");
}
```

#### Spy on Real Objects

```java
@Test
void calculateTotalWithSpy() {
    // Create a spy on a real object
    List<String> list = new ArrayList<>();
    List<String> spyList = spy(list);
    
    // Use the spy
    spyList.add("one");
    spyList.add("two");
    
    // Real method calls work normally
    assertThat(spyList.size()).isEqualTo(2);
    
    // But we can also stub specific methods
    when(spyList.size()).thenReturn(100);
    assertThat(spyList.size()).isEqualTo(100);
    
    // Other methods still work with real behavior
    assertThat(spyList.get(0)).isEqualTo("one");
}
```

#### Mocking Static Methods (Mockito 3.4.0+)

```java
@Test
void testStaticMethod() {
    try (MockedStatic<UtilityClass> mockedStatic = mockStatic(UtilityClass.class)) {
        // Stub the static method
        mockedStatic.when(() -> UtilityClass.getCurrentDate())
                   .thenReturn(LocalDate.of(2023, 1, 1));
        
        // Test code that uses the static method
        LocalDate result = myService.processWithDate();
        
        // Assert
        assertThat(result).isEqualTo(LocalDate.of(2023, 1, 1));
    }
}
```

## Testing Security

Spring Security is a critical component in most applications. Testing security configurations and behavior ensures your application remains protected.

### Basic Security Test Setup

```java
@SpringBootTest
@AutoConfigureMockMvc
class SecurityConfigTests {

    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void publicEndpointShouldBeAccessible() throws Exception {
        mockMvc.perform(get("/api/public"))
               .andExpect(status().isOk());
    }
    
    @Test
    void privateEndpointShouldRequireAuthentication() throws Exception {
        mockMvc.perform(get("/api/private"))
               .andExpect(status().isUnauthorized());
    }
}
```

### Testing with Authentication

```java
@SpringBootTest
@AutoConfigureMockMvc
class AuthenticatedEndpointsTests {

    @Autowired
    private MockMvc mockMvc;
    
    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void userCanAccessUserEndpoint() throws Exception {
        mockMvc.perform(get("/api/user"))
               .andExpect(status().isOk());
    }
    
    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void userCannotAccessAdminEndpoint() throws Exception {
        mockMvc.perform(get("/api/admin"))
               .andExpect(status().isForbidden());
    }
    
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void adminCanAccessAdminEndpoint() throws Exception {
        mockMvc.perform(get("/api/admin"))
               .andExpect(status().isOk());
    }
}
```

### Custom Security Context

```java
@Test
void customSecurityContext() throws Exception {
    List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_CUSTOM"));
    
    SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
    securityContext.setAuthentication(
        new UsernamePasswordAuthenticationToken("customUser", "password", authorities)
    );
    SecurityContextHolder.setContext(securityContext);
    
    mockMvc.perform(get("/api/custom").with(SecurityMockMvcRequestPostProcessors.csrf()))
           .andExpect(status().isOk());
    
    // Always clean up after test
    SecurityContextHolder.clearContext();
}
```

### Testing JWT Authentication

```java
@SpringBootTest
@AutoConfigureMockMvc
class JwtAuthenticationTests {

    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @Test
    void endpointShouldBeAccessibleWithValidJwt() throws Exception {
        String token = jwtTokenProvider.createToken("user", List.of("ROLE_USER"));
        
        mockMvc.perform(get("/api/secured")
               .header("Authorization", "Bearer " + token))
               .andExpect(status().isOk());
    }
    
    @Test
    void endpointShouldRejectInvalidJwt() throws Exception {
        mockMvc.perform(get("/api/secured")
               .header("Authorization", "Bearer invalidToken"))
               .andExpect(status().isUnauthorized());
    }
}
```

### OAuth2 Testing

```java
@SpringBootTest
@AutoConfigureMockMvc
class OAuth2Tests {

    @Autowired
    private MockMvc mockMvc;
    
    @Test
    @WithMockUser(username = "oauth_user")
    void oauthEndpointWithMockUser() throws Exception {
        mockMvc.perform(get("/api/oauth"))
               .andExpect(status().isOk());
    }
    
    @Test
    void oauthEndpointWithOAuth2Login() throws Exception {
        mockMvc.perform(get("/api/oauth")
               .with(SecurityMockMvcRequestPostProcessors.oauth2Login()))
               .andExpect(status().isOk());
    }
    
    @Test
    void oauthEndpointWithCustomOAuth2Login() throws Exception {
        mockMvc.perform(get("/api/oauth")
               .with(SecurityMockMvcRequestPostProcessors.oauth2Login()
                    .attributes(attrs -> {
                        attrs.put("sub", "1234567890");
                        attrs.put("name", "Test User");
                        attrs.put("email", "testuser@example.com");
                    })))
               .andExpect(status().isOk());
    }
}
```

## Testing Configurations

Testing application configurations ensures that your application behaves correctly with different property settings.

### Testing Properties Configuration

```java
@SpringBootTest(properties = {"app.feature.enabled=true", "app.max-items=10"})
class ConfigurationTests {

    @Autowired
    private ApplicationProperties appProperties;
    
    @Test
    void propertiesShouldBeLoaded() {
        assertThat(appProperties.getFeature().isEnabled()).isTrue();
        assertThat(appProperties.getMaxItems()).isEqualTo(10);
    }
}
```

### Testing Profile-Specific Configuration

```java
@SpringBootTest
@ActiveProfiles("test")
class ProfileConfigTests {

    @Autowired
    private Environment environment;
    
    @Autowired
    private DataSource dataSource;
    
    @Test
    void testProfileShouldBeActive() {
        assertThat(environment.getActiveProfiles()).contains("test");
    }
    
    @Test
    void databaseShouldBeH2InTestProfile() {
        try (Connection conn = dataSource.getConnection()) {
            String dbProduct = conn.getMetaData().getDatabaseProductName();
            assertThat(dbProduct.toLowerCase()).contains("h2");
        } catch (SQLException e) {
            fail("Failed to connect to database", e);
        }
    }
}
```

### Testing Configuration Properties Classes

```java
@ConfigurationPropertiesTest
class EmailConfigPropertiesTests {

    @Test
    void validateConfigProperties(
            @ConfigurationProperty(prefix = "app.email") Map<String, Object> properties) {
        
        assertThat(properties).containsEntry("host", "smtp.example.com");
        assertThat(properties).containsEntry("port", 587);
        assertThat(properties).containsEntry("username", "test@example.com");
    }
}
```

### Testing with External Configuration

```java
@SpringBootTest
@TestPropertySource(locations = "classpath:test-application.properties")
class ExternalConfigTests {

    @Autowired
    private ApplicationProperties appProperties;
    
    @Test
    void propertiesFromExternalFileShouldBeLoaded() {
        assertThat(appProperties.getApi().getBaseUrl()).isEqualTo("https://test-api.example.com");
        assertThat(appProperties.getApi().getTimeout()).isEqualTo(Duration.ofSeconds(30));
    }
}
```

## Test Containers

Testcontainers is a Java library that provides lightweight, throwaway instances of common databases, Selenium web browsers, or anything else that can run in a Docker container. It's particularly useful for integration testing.

### Getting Started with Testcontainers

First, add the dependencies:

```xml
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>testcontainers</artifactId>
    <version>1.17.6</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>1.17.6</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>postgresql</artifactId>
    <version>1.17.6</version>
    <scope>test</scope>
</dependency>
```

### Testing with a PostgreSQL Container

```java
@SpringBootTest
@Testcontainers
class PostgresIntegrationTests {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:14.5")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");
    
    @DynamicPropertySource
    static void postgresProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }
    
    @Autowired
    private UserRepository userRepository;
    
    @Test
    void shouldSaveAndRetrieveUser() {
        // Given
        User user = new User();
        user.setUsername("testcontainer");
        user.setEmail("test@container.com");
        
        // When
        userRepository.save(user);
        
        // Then
        Optional<User> found = userRepository.findByUsername("testcontainer");
        assertThat(found).isPresent();
        assertThat(found.get().getEmail()).isEqualTo("test@container.com");
    }
}
```

### Multiple Containers and Container Networks

```java
@SpringBootTest
@Testcontainers
class MultiContainerTests {

    static Network network = Network.newNetwork();
    
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:14.5")
            .withNetwork(network)
            .withNetworkAliases("postgres")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");
    
    @Container
    static GenericContainer<?> redis = new GenericContainer<>("redis:6.2")
            .withNetwork(network)
            .withNetworkAliases("redis")
            .withExposedPorts(6379);
    
    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.redis.host", redis::getHost);
        registry.add("spring.redis.port", redis::getFirstMappedPort);
    }
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    
    @Test
    void shouldInteractWithMultipleContainers() {
        // Test PostgreSQL
        User user = new User();
        user.setUsername("multicontainer");
        userRepository.save(user);
        
        assertThat(userRepository.findByUsername("multicontainer")).isPresent();
        
        // Test Redis
        redisTemplate.opsForValue().set("testkey", "testvalue");
        String value = redisTemplate.opsForValue().get("testkey");
        
        assertThat(value).isEqualTo("testvalue");
    }
}
```

### Custom Container Classes

```java
public class CustomPostgreSQLContainer extends PostgreSQLContainer<CustomPostgreSQLContainer> {
    
    private static final String IMAGE_VERSION = "postgres:14.5";
    private static CustomPostgreSQLContainer container;
    
    private CustomPostgreSQLContainer() {
        super(IMAGE_VERSION);
    }
    
    public static CustomPostgreSQLContainer getInstance() {
        if (container == null) {
            container = new CustomPostgreSQLContainer()
                    .withDatabaseName("testdb")
                    .withUsername("test")
                    .withPassword("test")
                    .withInitScript("init.sql");
        }
        return container;
    }
    
    @Override
    public void start() {
        super.start();
        System.setProperty("DB_URL", container.getJdbcUrl());
        System.setProperty("DB_USERNAME", container.getUsername());
        System.setProperty("DB_PASSWORD", container.getPassword());
    }
    
    @Override
    public void stop() {
        // do nothing, JVM handles shutdown
    }
}
```

## Performance and Load Testing

Performance testing ensures your application meets its performance criteria under various conditions.

### JMeter Integration

JMeter is a popular tool for load testing. You can integrate it with Spring Boot:

```xml
<dependency>
    <groupId>org.apache.jmeter</groupId>
    <artifactId>ApacheJMeter_core</artifactId>
    <version>5.5</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.apache.jmeter</groupId>
    <artifactId>ApacheJMeter_http</artifactId>
    <version>5.5</version>
    <scope>test</scope>
</dependency>
```

### Basic Performance Testing

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class PerformanceTests {

    @LocalServerPort
    private int port;
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void endpointResponseTimeShouldBeLessThan500ms() {
        // Warm up
        for (int i = 0; i < 5; i++) {
            restTemplate.getForEntity("/api/products", String.class);
        }
        
        // Test
        long startTime = System.currentTimeMillis();
        ResponseEntity<String> response = restTemplate.getForEntity("/api/products", String.class);
        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(duration).isLessThan(500);
    }
}
```

### Load Testing with Concurrent Requests

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class LoadTests {

    @LocalServerPort
    private int port;
    
    @Test
    void shouldHandleConcurrentRequests() throws Exception {
        String url = "http://localhost:" + port + "/api/products";
        int numThreads = 10;
        int requestsPerThread = 100;
        
        ExecutorService executor = Executors.newFixedThreadPool(numThreads);
        CountDownLatch latch = new CountDownLatch(numThreads);
        AtomicInteger successCounter = new AtomicInteger(0);
        AtomicInteger failCounter = new AtomicInteger(0);
        
        for (int i = 0; i < numThreads; i++) {
            executor.submit(() -> {
                try {
                    for (int j = 0; j < requestsPerThread; j++) {
                        try {
                            HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
                            connection.setRequestMethod("GET");
                            int responseCode = connection.getResponseCode();
                            
                            if (responseCode == 200) {
                                successCounter.incrementAndGet();
                            } else {
                                failCounter.incrementAndGet();
                            }
                            
                            connection.disconnect();
                        } catch (Exception e) {
                            failCounter.incrementAndGet();
                        }
                    }
                } finally {
                    latch.countDown();
                }
            });
        }
        
        // Wait for all threads to finish
        boolean completed = latch.await(2, TimeUnit.MINUTES);
        
        assertThat(completed).isTrue();
        assertThat(successCounter.get()).isEqualTo(numThreads * requestsPerThread);
        assertThat(failCounter.get()).isZero();
    }
}
```

### Gatling for Load Testing

Gatling is a more sophisticated load testing tool:

```scala
class ProductsSimulation extends Simulation {
  
  val httpProtocol = http
    .baseUrl("http://localhost:8080")
    .acceptHeader("application/json")
    .userAgentHeader("Gatling Load Test")
  
  val scn = scenario("Products Load Test")
    .exec(http("Get All Products")
      .get("/api/products")
      .check(status.is(200)))
    .pause(1)
    .exec(http("Get Single Product")
      .get("/api/products/1")
      .check(status.is(200)))
    .pause(1)
    .exec(http("Search Products")
      .get("/api/products/search?query=phone")
      .check(status.is(200)))
  
  setUp(
    scn.inject(
      rampUsers(100).during(10.seconds),
      constantUsersPerSec(10).during(1.minute)
    )
  ).protocols(httpProtocol)
    .assertions(
      global.responseTime.max.lt(500),
      global.successfulRequests.percent.gt(95)
    )
}
```

## Test-Driven Development

Test-Driven Development (TDD) is a software development approach where tests are written before the actual implementation code.

### The TDD Cycle

1. **Red**: Write a failing test.
2. **Green**: Implement the minimum code needed to pass the test.
3. **Refactor**: Improve the code while keeping the tests passing.

### Example TDD Workflow

Let's implement a calculator service using TDD:

1. **Red Phase** - Write a failing test:

```java
@Test
void addShouldReturnSumOfTwoNumbers() {
    // Arrange
    CalculatorService calculator = new CalculatorServiceImpl();
    
    // Act
    int result = calculator.add(3, 4);
    
    // Assert
    assertThat(result).isEqualTo(7);
}
```

2. **Green Phase** - Implement the minimal code to pass:

```java
public class CalculatorServiceImpl implements CalculatorService {

    @Override
    public int add(int a, int b) {
        return a + b;
    }
    
    // Other methods not implemented yet
}
```

3. **Refactor Phase** - Improve code quality:

```java
public class CalculatorServiceImpl implements CalculatorService {

    @Override
    public int add(int a, int b) {
        return a + b;
    }
    
    // Maybe refactor common validation or logging here
}
```

4. **Continue the Cycle** - Add more tests for new functionality:

```java
@Test
void subtractShouldReturnDifferenceOfTwoNumbers() {
    // Arrange
    CalculatorService calculator = new CalculatorServiceImpl();
    
    // Act
    int result = calculator.subtract(7, 3);
    
    // Assert
    assertThat(result).isEqualTo(4);
}
```

5. **Red-Green-Refactor** again:

```java
public class CalculatorServiceImpl implements CalculatorService {

    @Override
    public int add(int a, int b) {
        return a + b;
    }
    
    @Override
    public int subtract(int a, int b) {
        return a - b;
    }
}
```

### Benefits of TDD

- **Focused Development**: You only write code that's needed to pass tests.
- **High Test Coverage**: Tests are guaranteed for all features.
- **Better Design**: TDD encourages modular, loosely coupled code.
- **Documentation**: Tests serve as documentation for how code should behave.
- **Confidence**: Changing code is safer with a test suite to catch regressions.

## Testing Best Practices

### Structure Tests According to AAA Pattern

- **Arrange**: Set up test prerequisites.
- **Act**: Perform the action being tested.
- **Assert**: Verify the expected outcome.

```java
@Test
void userRegistrationShouldCreateNewUser() {
    // Arrange
    UserRegistrationRequest request = new UserRegistrationRequest();
    request.setUsername("newuser");
    request.setEmail("newuser@example.com");
    request.setPassword("password123");
    
    // Act
    UserResponse response = userService.registerUser(request);
    
    // Assert
    assertThat(response).isNotNull();
    assertThat(response.getUsername()).isEqualTo("newuser");
    assertThat(userRepository.findByUsername("newuser")).isPresent();
}
```

### Use Meaningful Test Names

Test names should clearly describe what's being tested and expected behavior:

```java
@Test
void shouldReturnNotFoundWhenUserDoesNotExist() { ... }

@Test
void shouldThrowExceptionWhenEmailIsInvalid() { ... }

@Test
void shouldSendConfirmationEmailWhenOrderIsPlaced() { ... }
```

### Avoid Test Interdependencies

Each test should be independent and not rely on other tests:

```java
// BAD - Tests depend on each other
@Test
void test1_createUser() { ... } // Creates a user for test2

@Test
void test2_updateUser() { ... } // Uses the user from test1

// GOOD - Each test is independent
@Test
void shouldCreateUser() {
    // Arrange all prerequisites here
    // Act
    // Assert
}

@Test
void shouldUpdateUser() {
    // Arrange all prerequisites here, including creating a user
    // Act
    // Assert
}
```

### Use Appropriate Assertion Libraries

```java
// JUnit assertions
assertEquals(expected, actual);
assertTrue(condition);

// AssertJ fluent assertions (preferred)
assertThat(actual).isEqualTo(expected);
assertThat(collection).hasSize(3).contains("item1", "item2");
assertThat(exception).isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("Invalid input");
```

### Test Edge Cases and Error Paths

```java
@Test
void shouldHandleEmptyInput() { ... }

@Test
void shouldHandleMaximumSizeInput() { ... }

@Test
void shouldThrowExceptionForInvalidData() { ... }

@Test
void shouldHandleNetworkTimeouts() { ... }
```

### Clean Up After Tests

```java
@AfterEach
void tearDown() {
    // Clean up database
    userRepository.deleteAll();
    
    // Reset any static data
    TestData.reset();
    
    // Clear security context
    SecurityContextHolder.clearContext();
}
```

### Use Test Fixtures and Factories

```java
public class UserTestFactory {
    public static User createValidUser() {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setCreatedAt(LocalDateTime.now());
        user.setActive(true);
        return user;
    }
    
    public static User createAdminUser() {
        User user = createValidUser();
        user.setUsername("adminuser");
        user.setEmail("admin@example.com");
        user.setRole(Role.ADMIN);
        return user;
    }
}
```

### Use Test Tags for Categorization

```java
@Tag("unit")
class UserServiceTests { ... }

@Tag("integration")
class UserRepositoryTests { ... }

@Tag("slow")
@Tag("database")
class LargeDatasetTests { ... }
```

### Maintain Test Quality

- **Keep Tests Fast**: Slow tests discourage frequent testing.
- **Keep Tests Simple**: Complex test logic is prone to bugs.
- **Review Test Code**: Test code should meet the same quality standards as production code.
- **Refactor Tests**: Continuously improve test code to avoid test maintenance burden.
- **Prioritize Test Reliability**: Flaky tests erode confidence in the test suite.

### Continuous Integration

- Run tests automatically on every push.
- Include test coverage reports.
- Fail builds when tests fail.
- Monitor test performance over time.

## Summary

Testing is a critical part of Spring Boot application development. With Spring Boot's comprehensive testing support, you can:

- Write effective unit tests for isolated components.
- Create integration tests to verify component interactions.
- Test specific layers using test slices.
- Mock dependencies for controlled testing.
- Verify security constraints.
- Test with realistic environments using test containers.
- Measure and optimize performance.
- Apply test-driven development principles.

Following best practices ensures your tests remain valuable, maintainable, and effective at catching bugs before they reach production.

## Further Reading

- [Spring Boot Testing Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.testing)
- [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)
- [Mockito Documentation](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html)
- [Testcontainers Documentation](https://www.testcontainers.org/)
- [AssertJ Documentation](https://assertj.github.io/doc/)