package com.craftycorner.controller;

import com.craftycorner.model.Address;
import com.craftycorner.model.User;
import com.craftycorner.repository.AddressRepository;
import com.craftycorner.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Address>> getMyAddresses(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        return ResponseEntity.ok(addressRepository.findByUserId(user.getId()));
    }

    @PostMapping
    public ResponseEntity<Address> addAddress(Authentication auth, @RequestBody Address newAddress) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        newAddress.setUser(user);
        return ResponseEntity.ok(addressRepository.save(newAddress));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(Authentication auth, @PathVariable Long id) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        addressRepository.delete(address);
        return ResponseEntity.noContent().build();
    }
}
