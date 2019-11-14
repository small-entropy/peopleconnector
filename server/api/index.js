// Express object
import express from 'express';

// Callbacks for system routers
import {
   checkHealth
} from '../routes/callbacks/system';


// Get express router object
const router = express.Router();

// Router for check server health
router.get('/health', checkHealth);

// Export the server middleware
module.exports = router;
