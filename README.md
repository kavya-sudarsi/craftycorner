# CraftyCorner

CraftyCorner is a full-stack handmade marketplace application built using **Spring Boot** and **React**.

The platform enables:
- Users to browse and purchase handmade products
- Vendors to onboard and sell their creations
- Admins to manage vendors, products, categories, and orders through a centralized dashboard

## Key Features
### User
- User registration and login using JWT authentication
- Browse and search products by category
- Add and manage wishlist items
- Cart and checkout functionality
- Place orders and view order history
- Forgot password and reset password via email
### Vendor
- Vendor onboarding with admin approval workflow
- Vendor dashboard
- Add, update, and delete products
- Upload multiple images for products
- View and manage vendor-specific orders
### Admin
- Admin dashboard with overall platform overview
- Approve or reject vendor onboarding requests
- Manage product categories
- View and manage all products
- Track and manage all orders

## Tech Stack and Versions
#### Backend
- Java 17
- Spring Boot 3.5.x
- Spring Web (REST APIs)
- Spring Data JPA (Hibernate 6.x)
- Spring Security with JWT authentication
- MySQL 8.x
- Stripe Payment Gateway (Stripe Java SDK)
- Maven
- Lombok
- Jakarta Persistence API
- Embedded Tomcat (Spring Boot default)

#### Frontend
- React 18
- Vite 5.x
- React Router DOM v6
- Axios
- Stripe React SDK
- React Context API
- React Toastify
- HTML5, CSS3, JavaScript (ES6+)

## API Documentation (Swagger)

Once the backend application is running, Swagger UI can be accessed at:

http://localhost:8082/swagger-ui.html

## Screenshots
### User Flow
<img width="1885" height="908" alt="dashboard" src="https://github.com/user-attachments/assets/0deaef99-a7c8-46ce-83b4-10217c989ff4" />
<br /><br />
<img width="1904" height="882" alt="register" src="https://github.com/user-attachments/assets/49c8dff5-8bcd-4f20-8222-23c9007d5083" />
<br /><br />
<img width="1901" height="897" alt="login" src="https://github.com/user-attachments/assets/177f0f6a-66a6-4083-8eef-cd7e7f015484" />
<br /><br />
<img width="1910" height="886" alt="forgotPassword" src="https://github.com/user-attachments/assets/23ab9f74-9704-46a2-b319-6c5037fc0fa1" />
<br /><br />
<img width="1536" height="753" alt="passwordResetEmail" src="https://github.com/user-attachments/assets/20a824a0-c739-4e0b-90de-8a70e1b52aa7" /><br /><br />
<br /><br />
<img width="1877" height="902" alt="products" src="https://github.com/user-attachments/assets/3538538c-c0f7-4808-a587-b726c43f0d40" />
<br /><br />
<br /><br />
<img width="1898" height="738" alt="wishlist" src="https://github.com/user-attachments/assets/16c1808d-489e-48c1-8118-b14cac3dc710" />
<br /><br />
<img width="1906" height="877" alt="productDetails" src="https://github.com/user-attachments/assets/828b0513-b7ae-4a44-b7e3-2aa9b0dc2411" />
<br /><br />
<img width="1903" height="896" alt="cart" src="https://github.com/user-attachments/assets/98f657ce-43f3-42e5-975a-76cf3178969b" />
<br /><br />
<img width="1877" height="885" alt="checkout" src="https://github.com/user-attachments/assets/0b8d59ee-ba2a-4c4d-8778-21d45c07f8e4" />
<br /><br />
<img width="1895" height="606" alt="stripePayment" src="https://github.com/user-attachments/assets/7e48bce6-e631-4b57-9cbc-3176484ec620" />
<br /><br />
<img width="1277" height="903" alt="orderDetails" src="https://github.com/user-attachments/assets/e2565d97-69f8-490c-8dc0-f6eab0175b5e" />
<br /><br />
<img width="1510" height="643" alt="orderconfirmEmail" src="https://github.com/user-attachments/assets/989c8179-062c-4909-bb70-74ed43d1eba1" />

### Vendor & Admin Flow
<img width="1873" height="898" alt="vendorOnboard" src="https://github.com/user-attachments/assets/f4bf4503-af95-4e0e-a58b-d39c1c1a59e1" />
<br /><br />
<img width="1880" height="919" alt="vendorDashboard" src="https://github.com/user-attachments/assets/c2c75fa7-13bf-41ac-b1a1-cdc4a70f315f" />
<br /><br />
<img width="1858" height="893" alt="vendorProfile" src="https://github.com/user-attachments/assets/799ce181-3171-4907-8bb6-dc80207c5d6b" />
<br /><br />
<img width="1882" height="900" alt="adminDashboard" src="https://github.com/user-attachments/assets/2cba515c-bc5d-4a63-a1ee-ebbb72c450c6" />
<br /><br />
<img width="1893" height="890" alt="adminvendorapproval" src="https://github.com/user-attachments/assets/de70be95-0b67-4c79-93a7-c3989fba63ac" />
<br /><br />

## Environment Configuration
### Backend (.env)
<pre>
JWT_SECRET=your_jwt_secret
DB_URL=jdbc:mysql://localhost:3306/craftycorner
DB_USERNAME=root
DB_PASSWORD=your_password
STRIPE_SECRET_KEY=your_stripe_secret
</pre>

### Frontend (.env)
<pre>
VITE_API_BASE_URL=http://localhost:8082
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
</pre>

Environment files are excluded from version control using .gitignore to ensure sensitive information is not committed to GitHub.

## Running the Application
### Backend
cd craftycorner_backend/backend
mvn spring-boot:run
<br />
Backend runs on:
 http://localhost:8082
### Frontend
cd craftycorner_frontend/frontend
npm install
npm run dev
<br />
Frontend runs on:
 http://localhost:5173
