
INSERT INTO roles (id, name) VALUES 
  (1, 'ROLE_USER'),
  (2, 'ROLE_ADMIN'),
  (3, 'ROLE_VENDOR')
AS newVals
ON DUPLICATE KEY UPDATE name = newVals.name;


-- john@example.com → password: 123456
-- admin@example.com → password: admin123
INSERT INTO users (id, name, email, password) VALUES
  (1, 'John Doe', 'john@example.com', '$2y$10$vS5c5jw2fAPNt7YDo6EH6eC.k7UxiEpSL3gQaTN16PBdGN2lpFv96'),
  (2, 'Admin User', 'admin@example.com', '$2y$10$Xts3JopSc/0.g8CAylNx5.NZJpYDkoIheK6dSqnijFhFlzKLN37nW')
AS newVals
ON DUPLICATE KEY UPDATE name = newVals.name, password = newVals.password;


INSERT INTO user_roles (user_id, role_id) VALUES
  (1, 3), -- John → Vendor
  (2, 2)  -- Admin → Admin
AS newVals
ON DUPLICATE KEY UPDATE role_id = newVals.role_id;



