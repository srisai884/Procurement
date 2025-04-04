package com.example.procurement.config;
 
import com.example.procurement.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import com.example.procurement.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
//import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
 
import java.io.IOException;
import java.util.Optional;
import java.util.Set;
 
@Configuration
@EnableWebSecurity
public class SecurityConfig {
 
    @Autowired
    private UserRepository userRepository;

 
    @Autowired
    private TerminateSessionOnLoginFilter terminateSessionOnLoginFilter;
 
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
 
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
    	
    @Bean
    public UserDetailsService userDetailsService() {
        return userId -> {
            User user = Optional.ofNullable(userRepository.findByUserId(userId))
                 .orElseThrow(() -> new UsernameNotFoundException("User not found with userId: " + userId));
            System.out.println("Hi");

            return org.springframework.security.core.userdetails.User.builder()
                  .username(user.getUserId())
                  .password(passwordEncoder().encode(user.getPassword())) // Use plaintext password
                  .roles(user.getRole())
                  .build();
      };
    }
 
    @Bean
    public AuthenticationSuccessHandler successHandler() {
        return (request, response, authentication) -> {
        	Set<String> roles = AuthorityUtils.authorityListToSet(authentication.getAuthorities());
            String role = request.getParameter("role");
            System.out.println(role);
            System.out.println(roles);

            if (!roles.contains("ROLE_" + role)) {
                response.sendRedirect("/login?error=true");
                return;
            }
            
            System.out.println("Roles: " + roles); // Debug statement
            
            System.out.println("Hello");
            
            response.sendRedirect("/login-success?role=" + role);



        };
    }
    
    @Bean
    public AuthenticationFailureHandler failureHandler() {
        return (request, response, exception) -> {
            response.sendRedirect("/login?error=true");
        };
    }
 
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/css/**", "/js/**", "/images/*").permitAll()
                .requestMatchers("/login").permitAll()
                .requestMatchers("/login-success").permitAll()
                .requestMatchers("/api/users/**").permitAll()
                .requestMatchers("/api/**").permitAll()
                .requestMatchers("/manager").hasRole("MANAGER")
                .requestMatchers("/apporrej").hasRole("MANAGER")
                .requestMatchers("/admin").hasRole("ADMIN")
                .requestMatchers("/requisition").hasRole("ADMIN")
                .requestMatchers("/requisitionlines").hasRole("ADMIN")
                .requestMatchers("/purchaseorder").hasRole("ADMIN")
                .requestMatchers("/getstatus").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .loginProcessingUrl("/login") // Default login processing URL
                //.failureUrl("/login?error=true") // Add failureUrl
                .successHandler(successHandler())
                .failureHandler(failureHandler()) // Add failure handler
                .permitAll()
            )
            .logout(logout -> logout
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                .logoutSuccessUrl("/login")
                .permitAll()
            )
            .exceptionHandling(exceptionHandling ->
                exceptionHandling.accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.sendRedirect("/login");
                })
            )
            .addFilterBefore(terminateSessionOnLoginFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().requestMatchers("/images/**"); // Add this line
    }
}