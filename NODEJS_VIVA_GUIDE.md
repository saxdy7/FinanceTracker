# Node.js Backend Development - Viva Guide

## 1. NODE.JS FUNDAMENTALS

### Q: What is Node.js?
**A:** Node.js is a JavaScript runtime built on Chrome's V8 engine that allows you to run JavaScript outside the browser, primarily on the server. It's event-driven, non-blocking, and single-threaded with an event loop.

### Q: Explain the event loop in Node.js
**A:** The event loop is Node.js's core mechanism:
1. **Timers Phase**: Executes setTimeout/setInterval callbacks
2. **Pending Callbacks**: Executes deferred I/O callbacks
3. **Idle/Prepare**: Internal use
4. **Poll Phase**: Retrieves new I/O events
5. **Check Phase**: Executes setImmediate callbacks
6. **Close Callbacks**: Executes socket close callbacks

### Q: What is non-blocking I/O?
**A:** Non-blocking I/O means operations don't wait for a response. When Node.js reads a file, it doesn't freeze - it continues executing code. When the file is read, a callback is executed. This allows handling multiple requests simultaneously.

### Q: Difference between require() and import?
**A:** 
- `require()` - CommonJS module system (synchronous, older)
- `import` - ES6 module system (asynchronous, newer)
In your project: using `require()` for backend

---

## 2. EXPRESS.JS & REST APIs

### Q: What is Express.js?
**A:** Express is a lightweight web framework for Node.js that simplifies building web applications and APIs. It provides routing, middleware support, and easy HTTP handling.

### Q: What is middleware?
**A:** Middleware functions have access to request (req), response (res), and next function. They can:
- Modify request/response objects
- End request-response cycle
- Call next middleware
```javascript
app.use((req, res, next) => {
  console.log('Middleware');
  next(); // Call next middleware
});
```

### Q: Explain CORS
**A:** Cross-Origin Resource Sharing allows requests from different domains. Your app uses CORS to allow frontend on Vercel to call backend on Render:
```javascript
app.use(cors(corsOptions));
```
Without CORS, browser blocks requests from different origins for security.

### Q: What is the difference between app.use() and app.get()?
**A:**
- `app.use()` - Applies middleware to ALL routes
- `app.get()` - Handles GET requests to specific route
```javascript
app.use(cors()); // All routes
app.get('/api/users', handler); // Only GET /api/users
```

### Q: What is routing?
**A:** Routing determines which code runs based on URL path and HTTP method:
```javascript
router.get('/users', getUsers);        // GET /users
router.post('/users', createUser);     // POST /users
router.put('/users/:id', updateUser);  // PUT /users/123
router.delete('/users/:id', deleteUser); // DELETE /users/123
```

---

## 3. AUTHENTICATION & SECURITY

### Q: What is JWT and how does it work?
**A:** JWT (JSON Web Token) is a token-based authentication method:
1. User logs in with credentials
2. Server generates JWT with user data (encrypted)
3. Client stores JWT and sends it in requests
4. Server verifies JWT signature to authenticate

Structure: `header.payload.signature`

### Q: How does your app handle authentication?
**A:** Your backend uses:
1. **JWT for sessions** - generateToken() creates encrypted tokens
2. **Password hashing** - User passwords hashed in MongoDB
3. **NextAuth for OAuth** - Handles Google signin flow
4. **Verify middleware** - verifyToken() checks JWT validity

### Q: Difference between Authentication and Authorization?
**A:**
- **Authentication** - Verify who you are (login)
- **Authorization** - Verify what you can do (permissions)

### Q: What is bcrypt?
**A:** bcrypt is a library for hashing passwords. It:
- Converts plain text password to hash
- Cannot be reversed (one-way encryption)
- Adds "salt" to prevent rainbow table attacks
- User.matchPassword() in your app compares provided password with stored hash

### Q: What should you NEVER store in JWT?
**A:** NEVER store:
- Passwords
- Sensitive personal data
- API keys or secrets
- Credit card information

JWTs can be decoded, so only store user ID and non-sensitive data.

---

## 4. DATABASE & MONGODB

### Q: What is MongoDB?
**A:** MongoDB is a NoSQL document database that stores data as JSON-like documents. Your app stores:
- Users (email, password, profile)
- Expenses/transactions
- Budgets
- Contact form submissions

### Q: What is Mongoose?
**A:** Mongoose is an ODM (Object Data Modeling) library for MongoDB. It:
- Provides schema validation
- Defines relationships between data
- Offers built-in methods (save, findOne, findById, etc.)

Your User model:
```javascript
const userSchema = new Schema({
  email: String,
  password: String,
  firstName: String,
  isVerified: Boolean
});
```

### Q: Difference between SQL and NoSQL?
**A:**
| SQL | NoSQL |
|-----|-------|
| Relational (tables) | Document-based (collections) |
| Fixed schema | Flexible schema |
| ACID transactions | Eventually consistent |
| Examples: MySQL, PostgreSQL | Examples: MongoDB, Firebase |

### Q: What is a database connection pool?
**A:** Connection pool manages multiple database connections to reuse them instead of creating new ones each time. Mongoose handles this automatically.

### Q: How do you prevent SQL injection in MongoDB?
**A:** 
- Use parameterized queries (Mongoose handles this)
- Validate/sanitize input with express-validator
- Use schema validation
Your app uses: `body('email').isEmail().withMessage(...)`

---

## 5. ASYNCHRONOUS PROGRAMMING

### Q: What are Promises?
**A:** Promise is an object representing eventual completion/failure of async operation:
```javascript
new Promise((resolve, reject) => {
  setTimeout(() => resolve('Done'), 1000);
});
```
States: Pending → Resolved/Rejected

### Q: What is async/await?
**A:** Modern way to handle promises (cleaner than .then()):
```javascript
async function getUser(id) {
  try {
    const user = await User.findById(id); // Wait for DB query
    return user;
  } catch (error) {
    console.error(error);
  }
}
```

### Q: Difference between Promise.all() and Promise.race()?
**A:**
- `Promise.all()` - Waits for ALL promises to resolve
- `Promise.race()` - Returns result of FIRST promise to resolve/reject

Your contact form uses race for timeout:
```javascript
Promise.race([emailPromise, timeoutPromise]);
```

### Q: What is callback hell?
**A:** Nested callbacks making code unreadable:
```javascript
// Callback Hell - BAD
getUserData(id, function(err, user) {
  getOrders(user.id, function(err, orders) {
    getOrderDetails(orders[0].id, function(err, details) {
      // ...nested 3 levels deep
    });
  });
});

// Solution: Use async/await - GOOD
const user = await getUser(id);
const orders = await getOrders(user.id);
const details = await getOrderDetails(orders[0].id);
```

---

## 6. ERROR HANDLING

### Q: What is try-catch?
**A:** Catches synchronous and promise-based errors:
```javascript
try {
  const user = await User.findById(id);
} catch (error) {
  console.error('Error:', error.message);
  res.status(500).json({ error: error.message });
}
```

### Q: What is error middleware?
**A:** Catches errors from all routes and handles them centrally:
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});
```

### Q: How should you handle errors in your backend?
**A:**
1. **Input validation** - Check required fields
2. **Try-catch** - Wrap async operations
3. **Status codes** - 400 (bad request), 401 (unauthorized), 500 (server error)
4. **Error logging** - Log errors for debugging
5. **User messages** - Return meaningful error messages

Your app: Uses express-validator + try-catch + meaningful messages

---

## 7. REST API DESIGN

### Q: What are REST API best practices?
**A:**
1. **Use proper HTTP methods**:
   - GET - Retrieve data
   - POST - Create data
   - PUT/PATCH - Update data
   - DELETE - Delete data

2. **Use meaningful URIs**:
   - ✓ `/api/v1/users/123`
   - ✗ `/getUser?id=123`

3. **Return proper status codes**:
   - 200 - Success
   - 201 - Created
   - 400 - Bad Request
   - 401 - Unauthorized
   - 404 - Not Found
   - 500 - Server Error

4. **Return JSON responses**:
   ```json
   {
     "success": true,
     "message": "User created",
     "data": { "id": 123, "email": "user@example.com" }
   }
   ```

### Q: What is API versioning?
**A:** Versioning allows changes without breaking old clients:
- `/api/v1/users` - Version 1
- `/api/v2/users` - Version 2 (with changes)

Your app: Uses `/api/v1/` prefix

### Q: What is request validation?
**A:** Validate input before processing:
```javascript
[
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Min 6 characters')
]
```
Your app uses express-validator for this.

---

## 8. PERFORMANCE & OPTIMIZATION

### Q: What is caching?
**A:** Store frequently accessed data to reduce database queries:
- **Memory cache** - Fast but limited
- **Redis** - In-memory database
- **HTTP caching** - Browser cache
- **Database indexing** - MongoDB indexes for faster queries

### Q: What is request timeout?
**A:** Maximum time for request to complete:
```javascript
const timeout = setTimeout(() => reject('Timeout'), 5000);
```
Your contact form: 5-second timeout to prevent hanging

### Q: How do you improve API response time?
**A:**
1. **Database indexing** - Speed up queries
2. **Pagination** - Don't return all data at once
3. **Caching** - Store frequently accessed data
4. **Load balancing** - Distribute requests
5. **Compression** - Reduce response size
6. **Async operations** - Non-blocking I/O

### Q: What is compression middleware?
**A:** Compresses response to reduce bandwidth:
```javascript
app.use(compression());
```
Reduces response size by 50-80%

---

## 9. SECURITY BEST PRACTICES

### Q: What is HTTPS?
**A:** Secure version of HTTP that encrypts data in transit:
- All data encrypted between client and server
- Prevents man-in-the-middle attacks
- Your production app uses HTTPS

### Q: What is helmet.js?
**A:** Middleware that secures Express app by setting HTTP headers:
```javascript
app.use(helmet());
```
Protects against: XSS, clickjacking, MIME type sniffing

### Q: What is input sanitization?
**A:** Remove/escape potentially harmful input:
- Prevent XSS (JavaScript injection)
- Prevent SQL injection
- Your app: Uses express-validator

### Q: What are environment variables?
**A:** Store sensitive data outside code:
- `MONGODB_URI` - Database connection
- `JWT_SECRET` - Encryption key
- `API_KEY` - Third-party service keys

NEVER commit `.env` to git!

### Q: What is rate limiting?
**A:** Limit requests per IP to prevent DDoS:
```javascript
const rateLimit = require('express-rate-limit');
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
```

---

## 10. YOUR PROJECT SPECIFIC

### Q: Explain your authentication flow
**A:**
1. User clicks "Sign in with Google"
2. Google OAuth dialog opens
3. User selects account
4. NextAuth redirects to `/api/auth/callback/google`
5. Backend `/api/v1/auth/google` creates/finds user in MongoDB
6. Backend returns user data + JWT token
7. NextAuth stores token in session
8. User redirected to dashboard

### Q: How does contact form work in your app?
**A:**
1. User fills contact form
2. Frontend sends POST to `/api/v1/contact/submit`
3. Backend validates input with express-validator
4. Sends emails using Nodemailer (with 5-second timeout)
5. Returns success response
6. Frontend shows confirmation message

### Q: Why did Google signin fail initially?
**A:**
- NODE_ENV was set to `development` in Render production
- NEXTAUTH_SECRET wasn't set in Render environment
- Backend couldn't properly validate JWT tokens
- NextAuth callback was being rejected

### Q: What is middleware in your app?
**A:**
Your app uses:
- **CORS middleware** - Allow cross-origin requests
- **Helmet** - Security headers
- **Body parser** - Parse JSON requests
- **Cookie parser** - Handle cookies
- **Authentication middleware** - verifyToken() for protected routes
- **Error handler** - Catch all errors

### Q: How do you handle environment variables?
**A:**
```javascript
require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
```

Development: `.env` file (not committed)
Production: Render/Vercel environment variables

### Q: Explain MongoDB connection in your app
**A:**
```javascript
const conn = await mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
```
- Connects to MongoDB Atlas (cloud)
- Uses connection pooling
- Handles reconnection automatically

---

## 11. COMMON VIVA QUESTIONS

### Q: What is the difference between blocking and non-blocking?
**A:**
```javascript
// BLOCKING - Freezes everything
const data = fs.readFileSync('file.txt');
console.log(data); // Waits for file to read

// NON-BLOCKING - Continues executing
fs.readFile('file.txt', (err, data) => {
  console.log(data); // Called when file is read
});
console.log('This prints first');
```

### Q: What are callback functions?
**A:** Function passed as argument, called when async operation completes:
```javascript
function fetchUser(id, callback) {
  setTimeout(() => {
    callback(null, { id, name: 'John' });
  }, 1000);
}

fetchUser(1, (err, user) => {
  console.log(user);
});
```

### Q: What is dependency injection?
**A:** Pass dependencies as parameters instead of hardcoding:
```javascript
// BAD - Hardcoded
function getUser() {
  const db = connectDB();
  return db.findUser();
}

// GOOD - Injected
function getUser(db) {
  return db.findUser();
}
```

### Q: What is the single responsibility principle?
**A:** Each function should do ONE thing well:
```javascript
// BAD - Does multiple things
async function handleUserRequest(req, res) {
  validate(req); // Validation
  const user = await User.findById(req.params.id); // DB query
  user.lastLogin = new Date(); // Update
  await user.save(); // Save
  sendEmail(user.email); // Send email
  res.json(user); // Response
}

// GOOD - Separated concerns
router.get('/users/:id', validate, getUser, updateLastLogin, (req, res) => {
  res.json(req.user);
});
```

### Q: What is the difference between throw and return?
**A:**
```javascript
// throw - Stops execution, creates error
if (!user) throw new Error('User not found');

// return - Normal exit
if (!user) return res.status(404).json({ error: 'User not found' });
```

### Q: How do you debug Node.js?
**A:**
1. **Console.log()** - Print values
2. **Node debugger** - `node --inspect app.js`
3. **VS Code debugger** - Built-in debugging
4. **Winston logger** - Production logging
5. **Error stack traces** - Understand where errors occur

### Q: What is clustering?
**A:** Run multiple Node.js processes to utilize multi-core CPUs:
```javascript
const cluster = require('cluster');
if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) cluster.fork();
} else {
  app.listen(PORT);
}
```

### Q: What is streaming?
**A:** Process data in chunks instead of loading entire file:
```javascript
const stream = fs.createReadStream('large-file.txt');
stream.on('data', (chunk) => {
  console.log('Received chunk:', chunk);
});
```
Good for large files and memory efficiency

---

## 12. VIVA TIPS

✅ **DO:**
- Explain with real examples from your project
- Use diagrams/drawings when explaining concepts
- Ask clarifying questions if confused
- Admit when you don't know, then explain what you'd do
- Relate theory to practical implementation

❌ **DON'T:**
- Memorize answers word-for-word
- Rush through explanations
- Assume your mentor knows your code
- Use jargon without explaining
- Get defensive about mistakes

---

## 13. QUESTIONS TO ASK BACK

If your mentor asks complex questions, you can ask:
- "Can you give an example of when this would be used?"
- "How does this relate to scalability?"
- "What are the tradeoffs of this approach?"
- "How would you improve this?"

---

## LAST-MINUTE REVIEW

**Key concepts to remember:**
1. Node.js is event-driven, non-blocking JavaScript
2. Express provides routing and middleware
3. JWT handles authentication tokens
4. MongoDB stores data in JSON documents
5. Async/await simplifies promise handling
6. Error handling is critical for production
7. REST APIs use proper HTTP methods and status codes
8. Security: validate input, use HTTPS, store secrets in env vars
9. Performance: use indexing, caching, compression
10. Your app: Google OAuth → JWT → MongoDB → Session

Good luck with your viva! 🚀
