package com.craftycorner.controller;

import com.craftycorner.service.ProductImageService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProductImageController.class)
class ProductImageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductImageService productImageService;

    @Test
    void uploadImage_shouldReturnOk() throws Exception {
        MockMultipartFile file =
                new MockMultipartFile("file", "test.jpg", MediaType.IMAGE_JPEG_VALUE, "dummy".getBytes());

        mockMvc.perform(multipart("/api/images/1")
                        .file(file)
                        .param("primaryImage", "true"))
                .andExpect(status().isOk());
    }
}
