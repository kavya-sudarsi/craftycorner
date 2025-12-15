package com.craftycorner.dto.vendor;

import lombok.Data;

@Data
public class VendorProfileUpdateRequest {
    private String shopName;
    private String bio;
    private String gstin;
}
