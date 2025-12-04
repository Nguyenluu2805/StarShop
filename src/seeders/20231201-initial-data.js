require('dotenv').config();
const bcrypt = require('bcrypt');

module.exports = {
    up: async(queryInterface, Sequelize) => {
        const hashedPassword = await bcrypt.hash('password123', 10);

        await queryInterface.bulkInsert('Users', [{
                name: 'Admin User',
                email: 'admin@starshop.com',
                password: hashedPassword,
                phone: '1234567890',
                address: '123 Admin St',
                role: 'admin',
                age: 30,
                avatar: 'http://example.com/admin_avatar.jpg',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Regular User',
                email: 'user@starshop.com',
                password: hashedPassword,
                phone: '0987654321',
                address: '456 User Ave',
                role: 'user',
                age: 25,
                avatar: 'http://example.com/user_avatar.jpg',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ], {});

        // Seed Categories
        await queryInterface.bulkInsert('Categories', [{
                name: 'Electronics',
                icon: 'electronics-icon',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Books',
                icon: 'books-icon',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Clothing',
                icon: 'clothing-icon',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ], {});

        const electronicsCategory = await queryInterface.sequelize.query(
            `SELECT id FROM Categories WHERE name = 'Electronics' LIMIT 1;`, { type: Sequelize.QueryTypes.SELECT }
        );
        const clothingCategory = await queryInterface.sequelize.query(
            `SELECT id FROM Categories WHERE name = 'Clothing' LIMIT 1;`, { type: Sequelize.QueryTypes.SELECT }
        );

        const adminUser = await queryInterface.sequelize.query(
            `SELECT id FROM Users WHERE email = 'admin@starshop.com' LIMIT 1;`, { type: Sequelize.QueryTypes.SELECT }
        );
        const regularUser = await queryInterface.sequelize.query(
            `SELECT id FROM Users WHERE email = 'user@starshop.com' LIMIT 1;`, { type: Sequelize.QueryTypes.SELECT }
        );

        await queryInterface.bulkInsert('Products', [{
                name: 'Smartphone X',
                description: 'Latest model smartphone with advanced features.',
                categoryId: electronicsCategory[0].id,
                price: 999.99,
                image: 'http://example.com/smartphone_x.jpg',
                stock: 100,
                featured: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Wireless Headphones',
                description: 'High-quality wireless headphones with noise cancellation.',
                categoryId: electronicsCategory[0].id,
                price: 149.99,
                image: 'http://example.com/headphones.jpg',
                stock: 250,
                featured: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'T-Shirt',
                description: 'Comfortable cotton t-shirt.',
                categoryId: clothingCategory[0].id,
                price: 19.99,
                image: 'http://example.com/tshirt.jpg',
                stock: 500,
                featured: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ], {});

        // Create a sample order for the regular user
        const product1 = await queryInterface.sequelize.query(
            `SELECT id FROM Products WHERE name = 'Smartphone X' LIMIT 1;`, { type: Sequelize.QueryTypes.SELECT }
        );
        const product2 = await queryInterface.sequelize.query(
            `SELECT id FROM Products WHERE name = 'Wireless Headphones' LIMIT 1;`, { type: Sequelize.QueryTypes.SELECT }
        );
        const product3 = await queryInterface.sequelize.query(
            `SELECT id FROM Products WHERE name = 'T-Shirt' LIMIT 1;`, { type: Sequelize.QueryTypes.SELECT }
        );

        if (regularUser.length > 0 && product1.length > 0 && product2.length > 0 && product3.length > 0) {
            const order = await queryInterface.bulkInsert('Orders', [{
                userId: regularUser[0].id,
                totalAmount: (999.99 * 1) + (149.99 * 2) + (19.99 * 3), // 1 Smartphone X + 2 Wireless Headphones + 3 T-Shirts
                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date(),
            }, ], {});

            const orderId = await queryInterface.sequelize.query(
                `SELECT id FROM Orders WHERE userId = ${regularUser[0].id} LIMIT 1;`, { type: Sequelize.QueryTypes.SELECT }
            );

            if (orderId.length > 0) {
                await queryInterface.bulkInsert('OrderItems', [{
                        orderId: orderId[0].id,
                        productId: product1[0].id,
                        quantity: 1,
                        price: 999.99,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        orderId: orderId[0].id,
                        productId: product2[0].id,
                        quantity: 2,
                        price: 149.99,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        orderId: orderId[0].id,
                        productId: product3[0].id,
                        quantity: 3,
                        price: 19.99,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                ], {});
            }
        }

        // Create a sample cart for the regular user
        if (regularUser.length > 0) {
            await queryInterface.bulkInsert('Carts', [{
                userId: regularUser[0].id,
                createdAt: new Date(),
                updatedAt: new Date(),
            }], {});

            const cart = await queryInterface.sequelize.query(
                `SELECT id FROM Carts WHERE userId = ${regularUser[0].id} LIMIT 1;`, { type: Sequelize.QueryTypes.SELECT }
            );

            if (cart.length > 0 && product1.length > 0) {
                await queryInterface.bulkInsert('CartItems', [{
                    cartId: cart[0].id,
                    productId: product1[0].id,
                    quantity: 1,
                    total: product1[0].price * 1, // Assuming product1 has a price property
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }], {});
            }
        }
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('CartItems', null, {});
        await queryInterface.bulkDelete('Carts', null, {});
        await queryInterface.bulkDelete('OrderItems', null, {});
        await queryInterface.bulkDelete('Orders', null, {});
        await queryInterface.bulkDelete('Products', null, {});
        await queryInterface.bulkDelete('Categories', null, {});
        await queryInterface.bulkDelete('Users', null, {});
    }
};