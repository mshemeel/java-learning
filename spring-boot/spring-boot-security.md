# Spring Boot Security

## Overview
This guide provides a comprehensive overview of Spring Security in Spring Boot applications. It covers the core concepts, configuration approaches, authentication and authorization mechanisms, and advanced topics including JWT-based authentication, OAuth2, and Keycloak integration. By the end of this guide, you'll understand how Spring Security works internally and be able to implement robust security solutions for your Spring Boot applications.

## Prerequisites
- Basic knowledge of Java and Spring Boot
- Understanding of web security concepts (authentication, authorization)
- Familiarity with RESTful APIs
- Development environment with Spring Boot set up

## Learning Objectives
- Understand Spring Security's architecture and core components
- Configure Spring Security in Spring Boot applications
- Implement various authentication mechanisms
- Secure RESTful APIs using Spring Security
- Apply proper authorization controls
- Implement JWT-based authentication
- Integrate with OAuth2 and OpenID Connect
- Configure Keycloak as an identity provider
- Test secured applications
- Apply security best practices

## Table of Contents
1. [Spring Security Fundamentals](#spring-security-fundamentals)
2. [Spring Security Architecture](#spring-security-architecture)
3. [Authentication Mechanisms](#authentication-mechanisms)
4. [Authorization and Access Control](#authorization-and-access-control)
5. [Securing RESTful APIs](#securing-restful-apis)
6. [CSRF, CORS, and XSS Protection](#csrf-cors-and-xss-protection)
7. [JWT-Based Authentication](#jwt-based-authentication)
8. [OAuth2 and OpenID Connect](#oauth2-and-openid-connect)
9. [Keycloak Integration](#keycloak-integration)
10. [Method Security](#method-security)
11. [Testing Secured Applications](#testing-secured-applications)
12. [Security Best Practices](#security-best-practices)

## Spring Security Fundamentals

Spring Security is a powerful and highly customizable authentication and access control framework. It is the de-facto standard for securing Spring-based applications.

### Core Concepts

1. **Authentication**: The process of verifying the identity of a user, system, or entity.
2. **Authorization**: The process of determining if an authenticated entity has permission to access a resource or perform an action.
3. **Principal**: Currently authenticated user.
4. **Granted Authority**: Permission granted to the principal.
5. **Role**: A group of permissions/authorities.

### Spring Security Features

- Comprehensive authentication support
- Protection against common attacks (CSRF, Session Fixation)
- Servlet API integration
- Optional integration with Spring Web MVC
- Support for multiple security contexts and authentication providers
- Extensible and customizable security architecture

### Getting Started with Spring Security

To add Spring Security to a Spring Boot application, include the following dependency:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

This single dependency brings:
- Authentication and authorization support
- Default security configuration
- Login/logout functionality
- CSRF protection
- Session management
- Security header integration

### Default Security Configuration

When you add the Spring Security starter dependency without any additional configuration, Spring Boot applies default security settings:

1. Secures all HTTP endpoints with basic authentication
2. Generates a default user with a random password (printed in the console)
3. Enables CSRF protection, XSS protection, and secure HTTP headers
4. Creates login/logout endpoints

To override these defaults, you need to provide custom configuration.

## Spring Security Architecture

Understanding the internal architecture is crucial for effective customization of Spring Security. Let's explore the key components and their interactions.
## Spring Security Architecture
![Spring Security Architecture](./spring-security-architecture.png)

## Spring Security with keycloak Architecture
![Spring Security Keycloak Architecture](./spring-security-keycloak.png)

### Security Filters Chain

Spring Security is primarily filter-based. It adds a chain of filters to the Servlet container's filter chain. These filters are executed in a specific order to implement security features:

1. **ChannelProcessingFilter**: Ensures requests go through required channels (e.g., HTTPS)
2. **SecurityContextPersistenceFilter**: Establishes SecurityContext for requests
3. **ConcurrentSessionFilter**: Updates SessionRegistry and checks for expired sessions
4. **HeaderWriterFilter**: Adds security headers to response
5. **CsrfFilter**: Protects against CSRF attacks
6. **LogoutFilter**: Processes logout requests
7. **UsernamePasswordAuthenticationFilter**: Processes form-based authentication
8. **BasicAuthenticationFilter**: Processes HTTP Basic authentication
9. **RequestCacheAwareFilter**: Handles saved requests after authentication
10. **SecurityContextHolderAwareRequestFilter**: Integrates with Servlet API
11. **AnonymousAuthenticationFilter**: Creates anonymous users when no authentication exists
12. **SessionManagementFilter**: Handles session fixation, session timeout, etc.
13. **ExceptionTranslationFilter**: Catches security exceptions and redirects to appropriate handlers
14. **FilterSecurityInterceptor**: Makes access control decisions based on configuration

This filter chain is dynamically configured based on your security requirements.

### SecurityContextHolder

The SecurityContextHolder is where Spring Security stores details of the present security context, including:

- Current user's identity
- Authentication details
- Granted authorities

By default, it uses a ThreadLocal strategy to store this information, making it available throughout a single request thread.

```java
// How to access current authentication in code
Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
if (authentication != null && authentication.isAuthenticated()) {
    String username = authentication.getName();
    Object principal = authentication.getPrincipal();
    Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
    // Use authentication details
}
```

### Authentication Manager

The AuthenticationManager is the core interface for authentication in Spring Security. Its primary method is:

```java
Authentication authenticate(Authentication authentication) throws AuthenticationException;
```

This method:
1. Returns a fully populated Authentication object (including granted authorities) if successful
2. Throws an AuthenticationException if authentication fails
3. Returns null if it cannot decide

The most common implementation is `ProviderManager`, which delegates to a chain of AuthenticationProvider instances.

### Authentication Providers

Authentication providers perform specific types of authentication:

- `DaoAuthenticationProvider`: Username/password authentication using a UserDetailsService
- `JwtAuthenticationProvider`: Authenticates JWT tokens
- `RememberMeAuthenticationProvider`: Handles remember-me authentication
- `OAuthAuthenticationProvider`: Authenticates OAuth tokens
- `LdapAuthenticationProvider`: LDAP authentication

These can be chained together to support multiple authentication mechanisms.

### UserDetailsService

The UserDetailsService is a key interface that:

1. Loads user details by username
2. Returns a UserDetails object with username, password, authorities, and account status flags

```java
public interface UserDetailsService {
    UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
}
```

Custom implementations typically connect to user stores like databases, LDAP, or external identity providers.

### Access Decision Manager

The AccessDecisionManager makes decisions about whether access is granted to a secured resource. It uses:

- Authentication object (current user)
- Secured object being accessed
- List of security configuration attributes for the object

Spring Security offers several voting-based implementations, like:
- `AffirmativeBased`: Grants access if any voter approves
- `ConsensusBased`: Takes majority vote
- `UnanimousBased`: Requires all voters to approve

### Security Context Management

Spring Security manages the security context across requests through:

1. **SecurityContextPersistenceFilter**: Loads and saves SecurityContext between requests
2. **SecurityContextRepository**: Interface for storing contexts (default: HttpSessionSecurityContextRepository)
3. **SecurityContextHolderStrategy**: Strategy for storing context (default: ThreadLocalSecurityContextHolderStrategy)

### WebSecurityConfigurerAdapter (Legacy, pre-Spring Security 5.7)

In versions before 5.7, this adapter class was used to customize web security:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
                .antMatchers("/public/**").permitAll()
                .anyRequest().authenticated()
                .and()
            .formLogin()
                .loginPage("/login")
                .permitAll();
    }
    
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth
            .inMemoryAuthentication()
                .withUser("user")
                .password("{noop}password")
                .roles("USER");
    }
}
```

### Component-Based Security Configuration (Spring Security 5.7+)

In modern Spring Security, the recommended approach uses component-based configuration:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/public/**").permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .permitAll()
            );
        return http.build();
    }
    
    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails user = User.withDefaultPasswordEncoder()
            .username("user")
            .password("password")
            .roles("USER")
            .build();
        return new InMemoryUserDetailsManager(user);
    }
}
```

### RequestMatcher

Spring Security uses RequestMatcher to determine which security rules apply to which requests:

- `AntPathRequestMatcher`: Ant-style path patterns
- `MvcRequestMatcher`: Spring MVC pattern matching
- `RegexRequestMatcher`: Regular expression-based matching

### Filter Security Interceptor

FilterSecurityInterceptor makes the final access control decision. It:

1. Uses SecurityMetadataSource to get attributes for a request
2. Retrieves the Authentication from SecurityContext
3. Delegates to AccessDecisionManager to make the authorization decision

## Authentication Mechanisms

Spring Security supports multiple authentication mechanisms that can be configured based on your application's requirements.

### Form-Based Authentication

The most common web authentication method using HTML forms:

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(authorize -> authorize
            .anyRequest().authenticated()
        )
        .formLogin(form -> form
            .loginPage("/login")               // Custom login page URL
            .loginProcessingUrl("/perform-login") // URL to submit the credentials
            .defaultSuccessUrl("/home")        // Redirect after successful login
            .failureUrl("/login?error=true")   // Redirect after failed login
            .usernameParameter("username")     // Username parameter name in form
            .passwordParameter("password")     // Password parameter name in form
            .permitAll()                       // Allow access to login page
        );
    return http.build();
}
```

### HTTP Basic Authentication

Simple authentication scheme built into the HTTP protocol:

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(authorize -> authorize
            .anyRequest().authenticated()
        )
        .httpBasic(Customizer.withDefaults());
    return http.build();
}
```

### Remember-Me Authentication

Allows returning users to be remembered:

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(authorize -> authorize
            .anyRequest().authenticated()
        )
        .formLogin(Customizer.withDefaults())
        .rememberMe(remember -> remember
            .key("uniqueAndSecretKey")
            .tokenValiditySeconds(86400) // 1 day
        );
    return http.build();
}
```

### Custom Authentication Providers

For custom authentication logic, implement the AuthenticationProvider interface:

```java
@Component
public class CustomAuthenticationProvider implements AuthenticationProvider {

    @Override
    public Authentication authenticate(Authentication authentication) 
      throws AuthenticationException {
        String username = authentication.getName();
        String password = authentication.getCredentials().toString();
        
        // Custom authentication logic
        if (shouldAuthenticateUser(username, password)) {
            List<GrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
            return new UsernamePasswordAuthenticationToken(username, password, authorities);
        } else {
            throw new BadCredentialsException("Authentication failed");
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
    
    private boolean shouldAuthenticateUser(String username, String password) {
        // Implement custom validation logic
        return true; // Placeholder
    }
}
```

Then register it:

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(authorize -> authorize
            .anyRequest().authenticated()
        )
        .formLogin(Customizer.withDefaults());
    return http.build();
}

@Bean
public AuthenticationManager authenticationManager(
        AuthenticationConfiguration authConfig) throws Exception {
    return authConfig.getAuthenticationManager();
}

@Autowired
public void configureGlobal(AuthenticationManagerBuilder auth,
                           CustomAuthenticationProvider customAuthProvider) {
    auth.authenticationProvider(customAuthProvider);
}
```

### LDAP Authentication

For organizations using LDAP directories:

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(authorize -> authorize
            .anyRequest().authenticated()
        )
        .formLogin(Customizer.withDefaults());
    return http.build();
}

@Bean
public EmbeddedLdapServerContextSourceFactoryBean contextSourceFactoryBean() {
    EmbeddedLdapServerContextSourceFactoryBean contextSourceFactoryBean =
        EmbeddedLdapServerContextSourceFactoryBean.fromEmbeddedLdapServer();
    contextSourceFactoryBean.setPort(0);
    return contextSourceFactoryBean;
}

@Bean
public LdapAuthenticationProvider ldapAuthenticationProvider(
        BaseLdapPathContextSource contextSource) {
    BindAuthenticator authenticator = new BindAuthenticator(contextSource);
    authenticator.setUserDnPatterns(new String[] { "uid={0},ou=people" });
    
    LdapAuthoritiesPopulator authoritiesPopulator = new DefaultLdapAuthoritiesPopulator(
            contextSource, "ou=groups");
    authoritiesPopulator.setGroupRoleAttribute("cn");
    
    return new LdapAuthenticationProvider(authenticator, authoritiesPopulator);
}
```

### Database Authentication

Using a database to store user credentials:

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(authorize -> authorize
            .anyRequest().authenticated()
        )
        .formLogin(Customizer.withDefaults());
    return http.build();
}

@Bean
public UserDetailsService userDetailsService(DataSource dataSource) {
    JdbcUserDetailsManager userDetailsManager = new JdbcUserDetailsManager(dataSource);
    // Optional: customize queries
    userDetailsManager.setUsersByUsernameQuery(
            "SELECT username, password, enabled FROM users WHERE username = ?");
    userDetailsManager.setAuthoritiesByUsernameQuery(
            "SELECT username, authority FROM authorities WHERE username = ?");
    return userDetailsManager;
}

@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}

## JWT-Based Authentication

JSON Web Tokens (JWT) provide a stateless way to authenticate users, which is especially useful for APIs and microservice architectures.

### Understanding JWT Structure

A JWT consists of three parts separated by dots:
1. **Header**: Identifies the algorithm used for signing
2. **Payload**: Contains claims about the entity (user) and metadata
3. **Signature**: Ensures the token hasn't been altered

Example JWT:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### JWT Authentication Flow

1. User logs in with credentials
2. Server validates credentials and generates a JWT
3. Server returns the JWT to the client
4. Client stores the JWT (usually in localStorage or a cookie)
5. Client sends the JWT in the Authorization header for subsequent requests
6. Server validates the JWT signature and extracts user information
7. Server grants access based on the user's authorities

### Implementing JWT Authentication in Spring Boot

#### Dependencies

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
```

#### JWT Utility Class

```java
@Component
public class JwtTokenUtil {
    
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.expiration}")
    private long expiration;
    
    private Key key;
    
    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }
    
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
        if (!authorities.isEmpty()) {
            claims.put("authorities", authorities.stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList()));
        }
        
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration * 1000))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }
    
    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
    
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
    
    private boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }
    
    private Date getExpirationDateFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
    }
    
    public List<SimpleGrantedAuthority> getAuthoritiesFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        
        List<String> authorities = claims.get("authorities", List.class);
        if (authorities == null) {
            return Collections.emptyList();
        }
        
        return authorities.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }
}
```

#### JWT Request Filter

```java
@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private UserDetailsService userDetailsService;
    
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                   FilterChain chain) throws ServletException, IOException {
        
        final String requestTokenHeader = request.getHeader("Authorization");
        
        String username = null;
        String jwtToken = null;
        
        // JWT Token is in the form "Bearer token". Remove Bearer word and get only the Token
        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            jwtToken = requestTokenHeader.substring(7);
            try {
                username = jwtTokenUtil.getUsernameFromToken(jwtToken);
            } catch (IllegalArgumentException e) {
                logger.error("Unable to get JWT Token");
            } catch (ExpiredJwtException e) {
                logger.error("JWT Token has expired");
            }
        } else {
            logger.warn("JWT Token does not begin with Bearer String");
        }
        
        // Once we get the token validate it.
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
            
            // If token is valid configure Spring Security to manually set authentication
            if (jwtTokenUtil.validateToken(jwtToken, userDetails)) {
                List<SimpleGrantedAuthority> authorities = jwtTokenUtil.getAuthoritiesFromToken(jwtToken);
                
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails, null, authorities);
                
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // Set authentication in context
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        chain.doFilter(request, response);
    }
}
```

#### Authentication Controller

```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserDetailsService userDetailsService;
    
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    
    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody LoginRequest authenticationRequest) {
        
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authenticationRequest.getUsername(), 
                            authenticationRequest.getPassword())
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Invalid credentials"));
        }
        
        final UserDetails userDetails = userDetailsService
                .loadUserByUsername(authenticationRequest.getUsername());
        
        final String token = jwtTokenUtil.generateToken(userDetails);
        
        return ResponseEntity.ok(new JwtResponse(token));
    }
    
    // Login request class
    public static class LoginRequest {
        private String username;
        private String password;
        
        // Getters and setters
    }
    
    // JWT response class
    public static class JwtResponse {
        private String token;
        
        public JwtResponse(String token) {
            this.token = token;
        }
        
        // Getter
    }
    
    // Message response class
    public static class MessageResponse {
        private String message;
        
        public MessageResponse(String message) {
            this.message = message;
        }
        
        // Getter
    }
}
```

#### Security Configuration

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Autowired
    private UserDetailsService userDetailsService;
    
    @Autowired
    private JwtRequestFilter jwtRequestFilter;
    
    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );
        
        // Add JWT filter
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}

@Component
class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
    
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                        AuthenticationException authException) throws IOException {
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
    }
}
```

### JWT Security Best Practices

1. **Use HTTPS**: Always transmit JWTs over HTTPS to prevent token theft
2. **Set Proper Expiration**: Short-lived tokens reduce risk if stolen
3. **Secure Token Storage**: Don't store in localStorage (vulnerable to XSS); consider HttpOnly cookies
4. **Include Only Necessary Claims**: Minimize sensitive data in tokens
5. **Use Strong Secret Keys**: Long, random keys for HMAC algorithms
6. **Consider Using Asymmetric Algorithms**: RSA or ECDSA for better security
7. **Implement Token Revocation**: Blacklist or use refresh token pattern
8. **Validate All Inputs**: Especially in token payloads
9. **Add Fingerprint Claims**: Include IP or device info to prevent token reuse
10. **Monitor and Audit**: Log authentication attempts and token usage

## Keycloak Integration

Keycloak is an open-source Identity and Access Management solution that provides features like Single Sign-On (SSO), Identity Brokering, and Social Login.

### Keycloak Architecture

Keycloak functions as an identity provider that manages:
- User registration, authentication, and authorization
- Client application registration
- Identity brokering with external providers
- User federation with existing LDAP or Active Directory servers
- Social login

### Setting Up Keycloak for Spring Boot

#### Add Dependencies

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

#### Configure Keycloak Properties

```properties
# application.properties
spring.security.oauth2.resourceserver.jwt.issuer-uri=http://localhost:8080/realms/your-realm
spring.security.oauth2.resourceserver.jwt.jwk-set-uri=http://localhost:8080/realms/your-realm/protocol/openid-connect/certs
```

#### Configure Security

```java
@Configuration
@EnableWebSecurity
public class KeycloakSecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/user/**").hasRole("USER")
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
            );
        
        return http.build();
    }
    
    private Converter<Jwt, AbstractAuthenticationToken> jwtAuthenticationConverter() {
        JwtAuthenticationConverter jwtConverter = new JwtAuthenticationConverter();
        jwtConverter.setJwtGrantedAuthoritiesConverter(new KeycloakRoleConverter());
        return jwtConverter;
    }
    
    public class KeycloakRoleConverter implements Converter<Jwt, Collection<GrantedAuthority>> {
        @Override
        public Collection<GrantedAuthority> convert(Jwt jwt) {
            final Map<String, Object> realmAccess = 
                    (Map<String, Object>) jwt.getClaims().get("realm_access");
            
            if (realmAccess == null) {
                return new ArrayList<>();
            }
            
            @SuppressWarnings("unchecked")
            List<String> roles = (List<String>) realmAccess.get("roles");
            
            return roles.stream()
                    .map(roleName -> "ROLE_" + roleName.toUpperCase())
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());
        }
    }
}
```

### JWT with Keycloak

Keycloak issues JWTs that Spring Security can validate. The key difference from custom JWT implementation is that Keycloak manages:

1. Token issuance
2. User management
3. Token validation
4. Role mappings

### Keycloak as an OAuth2 Authorization Server

Keycloak can act as an OAuth2 Authorization Server, supporting these grant types:

1. **Authorization Code**: For web applications
2. **Implicit**: For SPA applications (deprecated in favor of PKCE)
3. **Resource Owner Password Credentials**: For trusted applications
4. **Client Credentials**: For service-to-service communication
5. **Refresh Token**: For obtaining new access tokens

### Client Registration in Keycloak

To use Keycloak, you need to register your application as a client:

1. Create a new client in Keycloak admin console
2. Set the client protocol to `openid-connect`
3. Configure Valid Redirect URIs
4. Choose the appropriate Access Type (public, confidential, or bearer-only)
5. Configure client scopes
6. Set up client roles if needed

### Full OAuth2 Login with Keycloak

For a complete login flow where users are redirected to Keycloak:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-client</artifactId>
</dependency>
```

```properties
# application.properties
spring.security.oauth2.client.registration.keycloak.client-id=your-client-id
spring.security.oauth2.client.registration.keycloak.client-secret=your-client-secret
spring.security.oauth2.client.registration.keycloak.scope=openid,profile,email,roles
spring.security.oauth2.client.registration.keycloak.authorization-grant-type=authorization_code
spring.security.oauth2.client.registration.keycloak.redirect-uri={baseUrl}/login/oauth2/code/{registrationId}

spring.security.oauth2.client.provider.keycloak.issuer-uri=http://localhost:8080/realms/your-realm
spring.security.oauth2.client.provider.keycloak.user-name-attribute=preferred_username
```

```java
@Configuration
@EnableWebSecurity
public class OAuth2LoginSecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/", "/error", "/webjars/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .userInfoEndpoint(userInfo -> userInfo
                    .userAuthoritiesMapper(this.userAuthoritiesMapper())
                )
            );
        
        return http.build();
    }
    
    private GrantedAuthoritiesMapper userAuthoritiesMapper() {
        return (authorities) -> {
            Set<GrantedAuthority> mappedAuthorities = new HashSet<>();
            
            authorities.forEach(authority -> {
                if (authority instanceof OidcUserAuthority) {
                    OidcUserAuthority oidcUserAuthority = (OidcUserAuthority) authority;
                    OidcIdToken idToken = oidcUserAuthority.getIdToken();
                    
                    Map<String, Object> claims = idToken.getClaims();
                    Map<String, Object> realmAccess = (Map<String, Object>) claims.get("realm_access");
                    
                    if (realmAccess != null) {
                        @SuppressWarnings("unchecked")
                        List<String> roles = (List<String>) realmAccess.get("roles");
                        
                        roles.forEach(role -> 
                            mappedAuthorities.add(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                        );
                    }
                }
                
                // Add the original authority
                mappedAuthorities.add(authority);
            });
            
            return mappedAuthorities;
        };
    }
}
```

### Obtaining Tokens Programmatically

For service-to-service authentication or testing:

```java
@Service
public class KeycloakService {
    
    @Value("${keycloak.auth-server-url}")
    private String authServerUrl;
    
    @Value("${keycloak.realm}")
    private String realm;
    
    @Value("${keycloak.resource}")
    private String clientId;
    
    @Value("${keycloak.credentials.secret}")
    private String clientSecret;
    
    public String getToken(String username, String password) {
        String tokenUrl = authServerUrl + "/realms/" + realm + "/protocol/openid-connect/token";
        
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("grant_type", "password");
        map.add("client_id", clientId);
        map.add("client_secret", clientSecret);
        map.add("username", username);
        map.add("password", password);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);
        
        RestTemplate restTemplate = new RestTemplate();
        
        ResponseEntity<Map> response = restTemplate.postForEntity(
                tokenUrl, request, Map.class);
        
        if (response.getStatusCode() == HttpStatus.OK) {
            return (String) response.getBody().get("access_token");
        }
        
        throw new RuntimeException("Could not get token");
    }
    
    public String getClientToken() {
        String tokenUrl = authServerUrl + "/realms/" + realm + "/protocol/openid-connect/token";
        
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("grant_type", "client_credentials");
        map.add("client_id", clientId);
        map.add("client_secret", clientSecret);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);
        
        RestTemplate restTemplate = new RestTemplate();
        
        ResponseEntity<Map> response = restTemplate.postForEntity(
                tokenUrl, request, Map.class);
        
        if (response.getStatusCode() == HttpStatus.OK) {
            return (String) response.getBody().get("access_token");
        }
        
        throw new RuntimeException("Could not get token");
    }
}
```

### User Management with Keycloak

For managing users through the Keycloak Admin REST API:

```java
@Service
public class KeycloakAdminService {
    
    @Value("${keycloak.auth-server-url}")
    private String authServerUrl;
    
    @Value("${keycloak.realm}")
    private String realm;
    
    @Autowired
    private KeycloakService keycloakService;
    
    public void createUser(String username, String email, String firstName, String lastName, String password) {
        String adminToken = keycloakService.getClientToken();
        
        String userUrl = authServerUrl + "/admin/realms/" + realm + "/users";
        
        Map<String, Object> user = new HashMap<>();
        user.put("username", username);
        user.put("email", email);
        user.put("firstName", firstName);
        user.put("lastName", lastName);
        user.put("enabled", true);
        
        Map<String, Object> credentials = new HashMap<>();
        credentials.put("type", "password");
        credentials.put("value", password);
        credentials.put("temporary", false);
        
        user.put("credentials", List.of(credentials));
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(adminToken);
        
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(user, headers);
        
        RestTemplate restTemplate = new RestTemplate();
        
        ResponseEntity<Void> response = restTemplate.exchange(
                userUrl, HttpMethod.POST, request, Void.class);
        
        if (response.getStatusCode() != HttpStatus.CREATED) {
            throw new RuntimeException("Could not create user: " + response.getStatusCode());
        }
    }
    
    // More user management methods can be added here
}
```

### Keycloak Best Practices

1. **Use HTTPS**: Secure all communications with Keycloak
2. **Proper Client Configuration**: Use confidential clients with client secrets for backend applications
3. **Implement Proper Scopes**: Only request necessary scopes
4. **Use Authorization Code Flow with PKCE**: For web and mobile applications
5. **Keep Keycloak Updated**: Regularly apply security updates
6. **Configure Session Timeouts**: Set appropriate token lifetimes
7. **Use Proper SSL Certificates**: Avoid certificate validation issues
8. **Implement User Consent**: For sensitive operations
9. **Enable Brute Force Protection**: Protect against login attacks
10. **Audit Regularly**: Review authentication logs periodically 