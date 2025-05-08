# Microservices Security

## Overview
This guide covers security patterns, best practices, and implementation approaches for securing microservices architecture.

## Prerequisites
- Basic understanding of microservices architecture
- Knowledge of Spring Security
- Familiarity with OAuth2 and JWT
- Understanding of SSL/TLS

## Learning Objectives
- Understand microservices security patterns
- Learn OAuth2 implementation
- Master JWT authentication
- Implement service-to-service security
- Handle security at API Gateway level

## Table of Contents
1. [Authentication and Authorization](#authentication-and-authorization)
2. [OAuth2 Implementation](#oauth2-implementation)
3. [JWT Security](#jwt-security)
4. [Service-to-Service Security](#service-to-service-security)
5. [API Gateway Security](#api-gateway-security)

## Authentication and Authorization

### Spring Security Configuration
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeRequests()
                .antMatchers("/public/**").permitAll()
                .antMatchers("/api/**").authenticated()
            .and()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .addFilterBefore(jwtAuthenticationFilter(), 
                UsernamePasswordAuthenticationFilter.class);
    }
}
```

### User Details Service
```java
@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    private final UserRepository userRepository;
    
    @Override
    public UserDetails loadUserByUsername(String username) 
            throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException(
                "User not found: " + username));
                
        return new org.springframework.security.core.userdetails.User(
            user.getUsername(),
            user.getPassword(),
            getAuthorities(user.getRoles()));
    }
}
```

## OAuth2 Implementation

### Authorization Server Configuration
```java
@Configuration
@EnableAuthorizationServer
public class AuthServerConfig extends AuthorizationServerConfigurerAdapter {
    
    @Override
    public void configure(ClientDetailsServiceConfigurer clients) 
            throws Exception {
        clients.inMemory()
            .withClient("client-id")
            .secret(passwordEncoder().encode("client-secret"))
            .authorizedGrantTypes("password", "refresh_token")
            .scopes("read", "write")
            .accessTokenValiditySeconds(3600)
            .refreshTokenValiditySeconds(86400);
    }
}
```

### Resource Server Configuration
```java
@Configuration
@EnableResourceServer
public class ResourceServerConfig extends ResourceServerConfigurerAdapter {
    
    @Override
    public void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
            .antMatchers("/api/**").authenticated()
            .and()
            .oauth2ResourceServer()
            .jwt();
    }
}
```

## JWT Security

### JWT Token Provider
```java
@Component
public class JwtTokenProvider {
    
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    @Value("${jwt.expiration}")
    private int jwtExpiration;
    
    public String generateToken(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        
        return Jwts.builder()
            .setSubject(userDetails.getUsername())
            .setIssuedAt(new Date())
            .setExpiration(new Date(new Date().getTime() + jwtExpiration))
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact();
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
```

### JWT Authentication Filter
```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);
            
            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                String username = tokenProvider.getUsernameFromJWT(jwt);
                UserDetails userDetails = userDetailsService
                    .loadUserByUsername(username);
                    
                UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                        
                SecurityContextHolder.getContext()
                    .setAuthentication(authentication);
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
        }
        
        filterChain.doFilter(request, response);
    }
}
```

## Service-to-Service Security

### Mutual TLS Configuration
```java
@Configuration
public class MutualTlsConfig {
    
    @Bean
    public RestTemplate restTemplate() throws Exception {
        SSLContext sslContext = SSLContextBuilder
            .create()
            .loadTrustMaterial(trustStore.getFile())
            .loadKeyMaterial(
                keyStore.getFile(),
                keyStorePassword.toCharArray(),
                keyPassword.toCharArray()
            )
            .build();
            
        HttpClient client = HttpClients.custom()
            .setSSLContext(sslContext)
            .build();
            
        HttpComponentsClientHttpRequestFactory requestFactory =
            new HttpComponentsClientHttpRequestFactory(client);
            
        return new RestTemplate(requestFactory);
    }
}
```

### Client Certificate Authentication
```java
@Configuration
public class ClientCertificateConfig extends WebSecurityConfigurerAdapter {
    
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
            .anyRequest().authenticated()
            .and()
            .x509()
            .subjectPrincipalRegex("CN=(.*?)(?:,|$)")
            .userDetailsService(userDetailsService());
    }
}
```

## API Gateway Security

### Gateway Security Configuration
```java
@Configuration
public class GatewaySecurityConfig {
    
    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(
            ServerHttpSecurity http) {
        http
            .csrf().disable()
            .authorizeExchange()
                .pathMatchers("/public/**").permitAll()
                .anyExchange().authenticated()
            .and()
            .oauth2ResourceServer()
                .jwt();
        return http.build();
    }
}
```

### Rate Limiting
```java
@Configuration
public class RateLimitingConfig {
    
    @Bean
    public KeyResolver userKeyResolver() {
        return exchange -> Mono.just(
            exchange.getRequest()
                .getHeaders()
                .getFirst("X-User-Id"));
    }
    
    @Bean
    public RateLimiter rateLimiter() {
        return new RedisRateLimiter(10, 20);
    }
}
```

## Best Practices
1. Use HTTPS everywhere
2. Implement proper authentication and authorization
3. Use secure session management
4. Implement rate limiting
5. Use secure communication between services
6. Regular security audits
7. Implement proper logging and monitoring

## Common Pitfalls
1. Insecure communication between services
2. Weak authentication mechanisms
3. Missing rate limiting
4. Poor secret management
5. Insufficient logging
6. Missing security headers

## Implementation Examples

### Complete Security Configuration
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .cors()
            .and()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeRequests()
                .antMatchers("/public/**").permitAll()
                .antMatchers("/api/**").authenticated()
            .and()
            .oauth2ResourceServer()
                .jwt()
            .and()
            .addFilterBefore(jwtAuthenticationFilter(),
                UsernamePasswordAuthenticationFilter.class)
            .headers()
                .frameOptions().deny()
                .xssProtection()
                .and()
                .contentSecurityPolicy("script-src 'self'");
    }
}
```

### Security Headers Configuration
```java
@Configuration
public class SecurityHeadersConfig {
    
    @Bean
    public WebFilter securityHeadersFilter() {
        return (exchange, chain) -> {
            ServerHttpResponse response = exchange.getResponse();
            response.getHeaders().add("X-XSS-Protection", "1; mode=block");
            response.getHeaders().add("X-Frame-Options", "DENY");
            response.getHeaders().add("X-Content-Type-Options", "nosniff");
            response.getHeaders().add("Strict-Transport-Security",
                "max-age=31536000; includeSubDomains");
            return chain.filter(exchange);
        };
    }
}
```

## Resources for Further Learning
- [Spring Security Documentation](https://docs.spring.io/spring-security/reference/)
- [OAuth2 Specifications](https://oauth.net/2/)
- [JWT.io](https://jwt.io/)
- [OWASP Microservices Security](https://owasp.org/www-project-microservices-security/)

## Practice Exercises
1. Implement OAuth2 authentication
2. Set up JWT-based authentication
3. Configure mutual TLS
4. Implement rate limiting
5. Set up security headers 