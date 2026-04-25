import express from 'express';
import pool from '../db.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

/**
 * @openapi
 * /api/orders:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - total
 *               - paymentMethod
 *               - customerName
 *               - customerPhone
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *               total:
 *                 type: number
 *               paymentMethod:
 *                 type: string
 *               customerName:
 *                 type: string
 *               customerPhone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, async (req, res) => {
    const { items, total, paymentMethod, customerName, customerPhone } = req.body;
    const userId = req.user.id;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Create order
        const orderResult = await client.query(
            'INSERT INTO orders (user_id, total, payment_method, customer_name, customer_phone) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [userId, total, paymentMethod, customerName, customerPhone]
        );
        const orderId = orderResult.rows[0].id;

        // Create order items
        for (const item of items) {
            await client.query(
                'INSERT INTO order_items (order_id, product_id, product_name, product_price, category, quantity) VALUES ($1, $2, $3, $4, $5, $6)',
                [orderId, item.product.id, item.product.name, item.product.price, item.product.category, item.quantity]
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Order placed successfully', orderId });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        client.release();
    }
});

/**
 * @openapi
 * /api/orders:
 *   get:
 *     summary: Get user order history
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user orders
 */
router.get('/', authMiddleware, async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT o.*, 
            JSON_AGG(JSON_BUILD_OBJECT(
                'id', oi.id,
                'product_id', oi.product_id,
                'name', oi.product_name,
                'price', oi.product_price,
                'category', oi.category,
                'quantity', oi.quantity
            )) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            WHERE o.user_id = $1
            GROUP BY o.id
            ORDER BY o.created_at DESC`,
            [userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
