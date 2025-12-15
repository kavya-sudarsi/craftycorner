package com.craftycorner.repository;

import com.craftycorner.model.Product;
import com.craftycorner.model.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    List<Product> findByVendor_Id(Long vendorId);

    List<Product> findByStatus(ProductStatus status);

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.images WHERE p.vendor.id = :vendorId")
    List<Product> findByVendor_IdWithImages(@Param("vendorId") Long vendorId);

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.images WHERE p.status = :status")
    List<Product> findByStatusWithImages(@Param("status") ProductStatus status);

    @Query("SELECT p FROM Product p WHERE UPPER(p.status) = 'ACTIVE'")
    List<Product> findAllActiveProducts();

    @Query(value = """
        SELECT * FROM products p 
        WHERE UPPER(p.status) = 'ACTIVE'
          AND (:keyword IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
          AND (:category IS NULL OR p.category_id IN (
                SELECT c.id FROM category c WHERE LOWER(c.name) = LOWER(:category)
          ))
        ORDER BY 
          CASE WHEN :sortBy = 'priceasc' THEN p.base_price END ASC,
          CASE WHEN :sortBy = 'pricedesc' THEN p.base_price END DESC,
          CASE WHEN :sortBy = 'newest' THEN p.created_at END DESC
        """, nativeQuery = true)
    List<Product> searchProductsNative(
            @Param("keyword") String keyword,
            @Param("category") String category,
            @Param("sortBy") String sortBy
    );
}
