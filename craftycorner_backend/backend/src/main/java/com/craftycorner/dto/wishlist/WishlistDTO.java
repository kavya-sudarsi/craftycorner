package com.craftycorner.dto.wishlist;

import com.craftycorner.model.Wishlist;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistDTO {

    private Long id;
    private Long userId;
    private List<WishlistItemDTO> items;

    public static WishlistDTO fromEntity(Wishlist wishlist) {
        return WishlistDTO.builder()
                .id(wishlist.getId())
                .userId(wishlist.getUser().getId())
                .items(
                        wishlist.getItems().stream()
                                .map(WishlistItemDTO::fromEntity)
                                .collect(Collectors.toList())
                )
                .build();
    }
}
