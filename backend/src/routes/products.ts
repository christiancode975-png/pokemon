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

export default router;
