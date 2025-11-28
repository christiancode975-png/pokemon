import { Router, Request, Response } from 'express';
import { body, validationResult, query } from 'express-validator';
import { ProductModel } from '../models/Product';

const router = Router();

// Get all products
router.get('/', async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.findAll();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.findById(parseInt(req.params.id));
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product
router.post(
  '/',
  [
    body('name').notEmpty().trim().withMessage('Name is required'),
    body('category').notEmpty().trim().withMessage('Category is required'),
    body('set_name').optional().trim(),
    body('rarity').optional().trim(),
    body('card_number').optional().trim(),
    body('image_url').optional().isURL().withMessage('Invalid URL'),
    body('external_link').optional().isURL().withMessage('Invalid URL'),
    body('description').optional().trim(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const productId = await ProductModel.create(req.body);
      const product = await ProductModel.findById(productId);
      res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  }
);

// Update product
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await ProductModel.update(id, req.body);
    const updatedProduct = await ProductModel.findById(id);
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await ProductModel.delete(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Add price entry
router.post(
  '/:id/prices',
  [
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('currency').optional().trim(),
    body('source').optional().trim(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const productId = parseInt(req.params.id);
      const product = await ProductModel.findById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const priceId = await ProductModel.addPriceEntry({
        product_id: productId,
        price: req.body.price,
        currency: req.body.currency,
        source: req.body.source,
      });

      res.status(201).json({ id: priceId, message: 'Price added successfully' });
    } catch (error) {
      console.error('Error adding price:', error);
      res.status(500).json({ error: 'Failed to add price' });
    }
  }
);

// Get price history
router.get(
  '/:id/prices',
  [
    query('startDate').optional().isISO8601().withMessage('Invalid start date'),
    query('endDate').optional().isISO8601().withMessage('Invalid end date'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const productId = parseInt(req.params.id);
      const product = await ProductModel.findById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const history = await ProductModel.getPriceHistory(
        productId,
        req.query.startDate as string,
        req.query.endDate as string
      );

      res.json(history);
    } catch (error) {
      console.error('Error fetching price history:', error);
      res.status(500).json({ error: 'Failed to fetch price history' });
    }
  }
);

// Get price statistics
router.get('/:id/statistics', async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const stats = await ProductModel.getPriceStatistics(productId);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Toggle watchlist
router.post('/:id/watchlist', async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await ProductModel.toggleWatchlist(productId);
    res.json({ message: 'Watchlist updated' });
  } catch (error) {
    console.error('Error toggling watchlist:', error);
    res.status(500).json({ error: 'Failed to toggle watchlist' });
  }
});

// Get watchlist
router.get('/watchlist/all', async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.getWatchlist();
    res.json(products);
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
});

// Add price alert
router.post(
  '/:id/alerts',
  [
    body('target_price').isFloat({ min: 0 }).withMessage('Target price must be positive'),
    body('alert_type').optional().isIn(['below', 'above']).withMessage('Invalid alert type'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const productId = parseInt(req.params.id);
      const product = await ProductModel.findById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const alertId = await ProductModel.addPriceAlert({
        product_id: productId,
        target_price: req.body.target_price,
        alert_type: req.body.alert_type,
      });

      res.status(201).json({ id: alertId, message: 'Alert created' });
    } catch (error) {
      console.error('Error creating alert:', error);
      res.status(500).json({ error: 'Failed to create alert' });
    }
  }
);

// Get price alerts
router.get('/:id/alerts', async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    const alerts = await ProductModel.getPriceAlerts(productId);
    res.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Delete price alert
router.delete('/alerts/:alertId', async (req: Request, res: Response) => {
  try {
    const alertId = parseInt(req.params.alertId);
    await ProductModel.deletePriceAlert(alertId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting alert:', error);
    res.status(500).json({ error: 'Failed to delete alert' });
  }
});

// Add/Update note
router.post(
  '/:id/note',
  [body('note').notEmpty().trim().withMessage('Note cannot be empty')],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const productId = parseInt(req.params.id);
      const product = await ProductModel.findById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      await ProductModel.addNote(productId, req.body.note);
      res.json({ message: 'Note saved' });
    } catch (error) {
      console.error('Error saving note:', error);
      res.status(500).json({ error: 'Failed to save note' });
    }
  }
);

// Get note
router.get('/:id/note', async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    const note = await ProductModel.getNote(productId);
    res.json(note || { note: '' });
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

// Delete note
router.delete('/:id/note', async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    await ProductModel.deleteNote(productId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// Get collection value
router.get('/collection/value', async (req: Request, res: Response) => {
  try {
    const value = await ProductModel.getCollectionValue();
    res.json(value);
  } catch (error) {
    console.error('Error fetching collection value:', error);
    res.status(500).json({ error: 'Failed to fetch collection value' });
  }
});

export default router;
