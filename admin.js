// Admin JavaScript for WONDER ELECTRONICS

let products = [];
let users = [];
let categories = [];
let subcategoriesList = [];
let trendingProducts = [];
let currentEditingId = null;
let currentPage = 1;
let productsPerPage = 50; // Show 50 products per page for better performance

// Default subcategory mapping
const defaultSubcategories = {
    smartphones: [
        'iPhone',
        'Samsung Galaxy',
        'Google Pixel',
        'OnePlus',
        'Xiaomi',
        'Huawei',
        'Sony Xperia',
        'LG',
        'Motorola',
        'Other'
    ],
    laptops: [
        'MacBook',
        'Dell',
        'HP',
        'Lenovo',
        'ASUS',
        'Acer',
        'MSI',
        'Razer',
        'Surface',
        'Other'
    ],
    audio: [
        'AirPods',
        'Sony',
        'Bose',
        'Sennheiser',
        'JBL',
        'Beats',
        'Audio-Technica',
        'Shure',
        'Marshall',
        'Other'
    ],
    gaming: [
        'PlayStation',
        'Xbox',
        'Nintendo',
        'Gaming PC',
        'Gaming Laptop',
        'Gaming Monitor',
        'Gaming Keyboard',
        'Gaming Mouse',
        'Gaming Headset',
        'Other'
    ],
    accessories: [
        'Phone Cases',
        'Screen Protectors',
        'Chargers',
        'Cables',
        'Power Banks',
        'Bluetooth Speakers',
        'Smart Watches',
        'Tablets',
        'VR Headsets',
        'Other'
    ]
};

// Update subcategories based on selected category
function updateSubcategories() {
    const categorySelect = document.getElementById('productCategory');
    const subcategorySelect = document.getElementById('productSubcategory');

    if (!categorySelect || !subcategorySelect) return;

    const selectedCategory = categorySelect.value;
    subcategorySelect.innerHTML = '<option value="">Select Subcategory</option>';

    if (selectedCategory) {
        // Get custom subcategories for this category
        const customSubcategories = subcategoriesList.filter(sub => sub.category === selectedCategory);

        // Get default subcategories for this category
        const defaultSubs = defaultSubcategories[selectedCategory] || [];

        // Combine and deduplicate
        const allSubcategories = [...new Set([...defaultSubs, ...customSubcategories.map(sub => sub.name)])];

        allSubcategories.forEach(sub => {
            const option = document.createElement('option');
            option.value = sub;
            option.textContent = sub;
            subcategorySelect.appendChild(option);
        });
    }
}

// Load products from localStorage on page load
document.addEventListener('DOMContentLoaded', function () {
    loadProductsFromStorage();
    loadUsersFromStorage();
    loadCategoriesFromStorage();
    loadSubcategoriesFromStorage();
    loadWebsiteSettings();
    displayProductsTable();

    // Force refresh to ensure synchronization
    setTimeout(() => {
        forceRefreshProducts();
    }, 1000);
    displayUsersTable();
    displayCategoriesTable();
    displaySubcategoriesGrid();
    displayOrdersTable();
    displayPasswordResetRequests(); // New: Display password reset requests
    displaySlidesGrid(); // New: Display slideshow
    loadChatSessions(); // New: Load chat sessions
    updateUserStats();
    setupAdminEventListeners();
    setupAdminNavigation(); // Setup admin menu navigation
});

// Load products from localStorage
function loadProductsFromStorage() {
    const storedProducts = localStorage.getItem('wonderElectronicsProducts');
    if (storedProducts) {
        products = JSON.parse(storedProducts);
        console.log('Admin loaded', products.length, 'products from localStorage');
    } else {
        console.log('No products found in localStorage, initializing with empty array');
        products = [];
    }
}

// Save products to localStorage
function saveProductsToStorage() {
    try {
        console.log('Admin saving products to localStorage:', products.length, 'products');

        // Simple save without complex validation
        const productsJson = JSON.stringify(products);
        localStorage.setItem('wonderElectronicsProducts', productsJson);
        console.log('Admin saved', products.length, 'products to localStorage');

        // Update analytics if function exists
        if (typeof displayProductAnalytics === 'function') {
            try {
                displayProductAnalytics();
            } catch (analyticsError) {
                console.warn('Admin: Error updating analytics:', analyticsError);
            }
        }

        // Trigger storage event for client-side refresh
        try {
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'wonderElectronicsProducts',
                newValue: productsJson
            }));
        } catch (eventError) {
            console.warn('Admin: Error dispatching storage event:', eventError);
        }

        // Also dispatch custom event
        try {
            window.dispatchEvent(new CustomEvent('productAdded', {
                detail: { productCount: products.length }
            }));
        } catch (customEventError) {
            console.warn('Admin: Error dispatching custom event:', customEventError);
        }

    } catch (error) {
        console.error('Admin: Error in saveProductsToStorage:', error);
        // Don't re-throw - let the calling function continue
    }
}

// Load users from localStorage
function loadUsersFromStorage() {
    const storedUsers = localStorage.getItem('wonderElectronicsUsers');
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    } else {
        // Create default admin user
        users = [
            {
                id: 1,
                name: 'Admin User',
                email: 'admin@wonderelectronics.com',
                password: 'admin123',
                phone: '+1-555-0123',
                role: 'admin',
                joinDate: new Date().toISOString(),
                status: 'active'
            }
        ];
        saveUsersToStorage();
    }
}

// Save users to localStorage
function saveUsersToStorage() {
    localStorage.setItem('wonderElectronicsUsers', JSON.stringify(users));
}

// Display users in table
function displayUsersTable() {
    const tableBody = document.getElementById('usersTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (users.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem;">No users found.</td></tr>';
        return;
    }

    users.forEach(user => {
        const row = document.createElement('tr');
        const joinDate = new Date(user.joinDate).toLocaleDateString();
        const status = user.status || 'active';

        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone || 'N/A'}</td>
            <td><span class="user-role ${user.role}">${user.role}</span></td>
            <td>${joinDate}</td>
            <td><span class="user-status ${status}">${status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-warning" onclick="editUser(${user.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="deleteUser(${user.id})" ${user.role === 'admin' ? 'disabled' : ''}>
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Update user statistics
function updateUserStats() {
    const totalUsers = users.length;
    const activeUsers = users.filter(user => (user.status || 'active') === 'active').length;
    const today = new Date().toDateString();
    const newUsersToday = users.filter(user =>
        new Date(user.joinDate).toDateString() === today
    ).length;

    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('activeUsers').textContent = activeUsers;
    document.getElementById('newUsersToday').textContent = newUsersToday;
}

// Edit user
function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const newName = prompt('Enter new name:', user.name);
    if (newName && newName !== user.name) {
        user.name = newName;
        saveUsersToStorage();
        displayUsersTable();
        updateUserStats();
        showNotification('User updated successfully!', 'success');
    }
}

// Delete user
function deleteUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    if (user.role === 'admin') {
        showNotification('Cannot delete admin user', 'error');
        return;
    }

    if (confirm(`Are you sure you want to delete user "${user.name}"?`)) {
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            users.splice(userIndex, 1);
            saveUsersToStorage();
            displayUsersTable();
            updateUserStats();
            showNotification('User deleted successfully!', 'success');
        }
    }
}

// Setup admin event listeners
function setupAdminEventListeners() {
    // Admin menu navigation
    const adminLinks = document.querySelectorAll('.admin-link');
    const adminSections = document.querySelectorAll('.admin-section');

    adminLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all links and sections
            adminLinks.forEach(l => l.classList.remove('active'));
            adminSections.forEach(s => s.classList.remove('active'));

            // Add active class to clicked link
            link.classList.add('active');

            // Show corresponding section
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    // Product form submission
    const productForm = document.getElementById('productForm');
    if (productForm) {
        console.log('Admin: Product form found, adding event listener');
        productForm.addEventListener('submit', handleAddProduct);
        console.log('Admin: Event listener added to product form');

        // Test if the event listener is working
        productForm.addEventListener('submit', function (e) {
            console.log('Admin: Form submit event triggered!');
            console.log('Admin: Event target:', e.target);
            console.log('Admin: Event type:', e.type);
        });

        // Also try adding a click listener to the submit button
        const submitButton = productForm.querySelector('button[type="submit"]');
        if (submitButton) {
            console.log('Admin: Submit button found, adding click listener');
            submitButton.addEventListener('click', function (e) {
                console.log('Admin: Submit button clicked!');
            });
        } else {
            console.log('Admin: Submit button NOT found!');
        }
    } else {
        console.log('Admin: Product form NOT found!');
    }

    // Edit product form submission
    const editProductForm = document.getElementById('editProductForm');
    if (editProductForm) {
        editProductForm.addEventListener('submit', handleEditProduct);
    }

    // Modal close functionality
    const modal = document.getElementById('editModal');
    const closeBtn = document.querySelector('.close');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Settings form submissions
    const settingsForms = [
        'generalSettingsForm',
        'heroSettingsForm',
        'aboutSettingsForm',
        'contactSettingsForm',
        'paymentSettingsForm'
    ];

    settingsForms.forEach(formId => {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                handleSettingsFormSubmit(formId);
            });
        }
    });

    // Category form submission
    const categoryForm = document.getElementById('categoryForm');
    if (categoryForm) {
        categoryForm.addEventListener('submit', handleAddCategory);
    }

    // Subcategory form submission
    const subcategoryForm = document.getElementById('subcategoryForm');
    if (subcategoryForm) {
        subcategoryForm.addEventListener('submit', handleSubcategoryFormSubmit);
    }

    // Update product category dropdown
    updateProductCategoryDropdown();
}

// Handle settings form submission
function handleSettingsFormSubmit(formId) {
    const form = document.getElementById(formId);
    const formData = new FormData(form);

    // Update website settings based on form
    switch (formId) {
        case 'generalSettingsForm':
            websiteSettings.siteTitle = formData.get('siteTitle');
            websiteSettings.siteDescription = formData.get('siteDescription');
            websiteSettings.currency = formData.get('currency');
            websiteSettings.taxRate = parseFloat(formData.get('taxRate'));
            websiteSettings.usdToRwf = parseFloat(formData.get('usdToRwf'));
            websiteSettings.usdToEur = parseFloat(formData.get('usdToEur'));
            websiteSettings.usdToGbp = parseFloat(formData.get('usdToGbp'));
            websiteSettings.showStockQuantity = formData.get('showStockQuantity') === 'true';
            break;
        case 'socialSettingsForm':
            websiteSettings.instagramName = formData.get('instagramName');
            websiteSettings.facebookName = formData.get('facebookName');
            websiteSettings.tiktokName = formData.get('tiktokName');
            break;
        case 'heroSettingsForm':
            websiteSettings.heroTitle = formData.get('heroTitle');
            websiteSettings.heroSubtitle = formData.get('heroSubtitle');
            websiteSettings.heroButtonText = formData.get('heroButtonText');
            break;
        case 'aboutSettingsForm':
            websiteSettings.aboutTitle = formData.get('aboutTitle');
            websiteSettings.aboutContent = formData.get('aboutContent');
            break;
        case 'contactSettingsForm':
            websiteSettings.contactPhone = formData.get('contactPhone');
            websiteSettings.contactEmail = formData.get('contactEmail');
            websiteSettings.contactAddress = formData.get('contactAddress');
            break;
        case 'paymentSettingsForm':
            websiteSettings.paymentPhone = formData.get('paymentPhone');
            websiteSettings.paymentInstructions = formData.get('paymentInstructions');
            websiteSettings.deliveryFee = parseFloat(formData.get('deliveryFee'));
            break;
    }

    saveWebsiteSettings();
    showNotification('Settings saved successfully!', 'success');
}

// Handle add category form submission
function handleAddCategory(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const newCategory = {
        id: Date.now(),
        name: formData.get('categoryName').toLowerCase().replace(/\s+/g, '-'),
        displayName: formData.get('categoryName'),
        icon: formData.get('categoryIcon'),
        description: formData.get('categoryDescription'),
        isDefault: false
    };

    // Validate required fields
    if (!newCategory.displayName || !newCategory.icon) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Check if category already exists
    const existingCategory = categories.find(c => c.name === newCategory.name);
    if (existingCategory) {
        showNotification('Category with this name already exists', 'error');
        return;
    }

    // Add category to array
    categories.push(newCategory);
    saveCategoriesToStorage();

    // Clear form
    e.target.reset();

    // Show success message
    showNotification('Category added successfully!', 'success');

    // Refresh categories table
    displayCategoriesTable();

    // Update product category dropdown
    updateProductCategoryDropdown();
}

// Update product category dropdown with current categories
function updateProductCategoryDropdown() {
    const categorySelects = document.querySelectorAll('#productCategory, #editProductCategory');

    categorySelects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Select Category</option>';

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.displayName;
            select.appendChild(option);
        });

        // Restore selected value if it still exists
        if (currentValue && categories.find(c => c.name === currentValue)) {
            select.value = currentValue;
        }
    });
}

// Handle add product form submission
function handleAddProduct(e) {
    e.preventDefault();
    console.log('Admin: Form submission started');

    // Add timeout to prevent hanging
    const timeoutId = setTimeout(() => {
        console.error('Admin: Form submission timed out after 10 seconds');
        showNotification('Form submission timed out. Please try again.', 'error');
    }, 10000);

    try {
        console.log('Admin: Getting form values...');

        // Get form values directly from DOM elements
        const name = document.getElementById('productName').value.trim();
        console.log('Admin: Product name:', name);

        const price = parseFloat(document.getElementById('productPrice').value);
        console.log('Admin: Product price:', price);

        const category = document.getElementById('productCategory').value;
        console.log('Admin: Product category:', category);

        const description = document.getElementById('productDescription').value.trim();
        console.log('Admin: Product description:', description);

        const brand = document.getElementById('productBrand').value.trim();
        console.log('Admin: Product brand:', brand);

        const image = document.getElementById('productImage').value.trim();
        console.log('Admin: Product image length:', image.length);
        console.log('Admin: Product image starts with data:', image.startsWith('data:'));

        // Allow empty images or any format
        console.log('Admin: Image validation passed');

        const stock = parseInt(document.getElementById('productStock').value) || 0;
        console.log('Admin: Product stock:', stock);

        const subcategory = document.getElementById('productSubcategory').value.trim();
        console.log('Admin: Product subcategory:', subcategory);

        const shortDescription = document.getElementById('productShortDescription').value.trim();
        console.log('Admin: Product short description:', shortDescription);

        const specifications = document.getElementById('productSpecifications').value.trim();
        console.log('Admin: Product specifications:', specifications);

        const colors = document.getElementById('productColors').value.trim();
        console.log('Admin: Product colors:', colors);

        const discount = parseInt(document.getElementById('productDiscount').value) || 0;
        console.log('Admin: Product discount:', discount);

        const condition = document.getElementById('productCondition').value;
        console.log('Admin: Product condition:', condition);

        // Get additional images
        console.log('Admin: Getting additional images...');
        const additionalImagesText = document.getElementById('productImages').value.trim();
        console.log('Admin: Additional images text length:', additionalImagesText.length);

        let additionalImages = [];
        if (additionalImagesText) {
            additionalImages = additionalImagesText.split('\n').filter(url => url.trim());
            console.log('Admin: Additional images count:', additionalImages.length);

            // Allow any format for additional images
            console.log('Admin: Additional images validation passed');
        }

        // Validate required fields
        console.log('Admin: Validating required fields...');
        const missingFields = [];
        if (!name) missingFields.push('Product Name');
        if (!price || isNaN(price)) missingFields.push('Price');
        if (!category) missingFields.push('Category');
        if (!description) missingFields.push('Description');
        if (!brand) missingFields.push('Brand');

        if (missingFields.length > 0) {
            console.log('Admin: Missing fields:', missingFields);
            showNotification(`Please fill in: ${missingFields.join(', ')}`, 'error');
            return;
        }

        console.log('Admin: All required fields validated successfully');

        // Create product
        console.log('Admin: Creating product object...');
        const newProduct = {
            id: generateProductId(),
            name: name,
            price: price,
            category: category,
            subcategory: subcategory,
            shortDescription: shortDescription,
            description: description,
            specifications: specifications ? specifications.split('\n').filter(s => s.trim()) : [],
            image: image,
            images: additionalImages,
            stock: stock,
            brand: brand,
            discount: discount,
            condition: condition,
            colors: colors ? colors.split(',').map(c => c.trim()).filter(c => c) : []
        };
        console.log('Admin: Product object created successfully');

        // Debug image data
        console.log('Admin: Product created with image:', newProduct.image);
        console.log('Admin: Image length:', newProduct.image ? newProduct.image.length : 0);
        console.log('Admin: Image starts with data:', newProduct.image ? newProduct.image.startsWith('data:') : false);
        console.log('Admin: Additional images:', newProduct.images);
        console.log('Admin: Additional images length:', newProduct.images ? newProduct.images.length : 0);

        // Test if the main image can be displayed
        if (newProduct.image) {
            const testImg = document.createElement('img');
            testImg.src = newProduct.image;
            testImg.onload = function () {
                console.log('Admin: Main image test loaded successfully!');
            };
            testImg.onerror = function () {
                console.log('Admin: Main image test failed to load!');
            };
            document.body.appendChild(testImg);
        }

        // Add product
        console.log('Admin: Adding product to products array...');
        products.push(newProduct);
        console.log('Admin: Product added to array. Total products:', products.length);

        // Save to storage with error handling
        try {
            console.log('Admin: Saving products to storage...');
            saveProductsToStorage();
            console.log('Admin: Products saved to storage successfully');
        } catch (saveError) {
            console.error('Admin: Error saving to storage:', saveError);
            // Continue anyway - don't fail the entire operation
        }

        // Update UI with error handling
        try {
            console.log('Admin: Updating UI...');
            if (typeof displayProductAnalytics === 'function') {
                displayProductAnalytics();
            }
            if (typeof displayProductsTable === 'function') {
                displayProductsTable();
            }
            if (typeof refreshProductPositioning === 'function') {
                refreshProductPositioning();
            }
            console.log('Admin: UI updated successfully');
        } catch (uiError) {
            console.error('Admin: Error updating UI:', uiError);
            // Continue anyway - don't fail the entire operation
        }

        // Clear form with error handling
        try {
            console.log('Admin: Clearing form...');
            const form = document.getElementById('productForm');
            if (form) {
                form.reset();
            }
            console.log('Admin: Form cleared successfully');
        } catch (formError) {
            console.error('Admin: Error clearing form:', formError);
            // Continue anyway - don't fail the entire operation
        }

        // Show success
        showNotification('Product added successfully!', 'success');
        console.log('Admin: Product added successfully!');

        // Force immediate client refresh by opening client page
        setTimeout(() => {
            try {
                const clientWindow = window.open('index.html', '_blank');
                if (clientWindow) {
                    setTimeout(() => {
                        clientWindow.close();
                    }, 3000);
                }
            } catch (e) {
                // Ignore errors
            }
        }, 500);

        // Also try to refresh the current page if it's the client page
        setTimeout(() => {
            try {
                if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
                    window.location.reload();
                }
            } catch (e) {
                // Ignore errors
            }
        }, 1000);

        // Verify the product was saved
        const savedProducts = localStorage.getItem('wonderElectronicsProducts');
        if (savedProducts) {
            const parsedProducts = JSON.parse(savedProducts);
            console.log('Admin: Verification - localStorage now contains', parsedProducts.length, 'products');
            const lastProduct = parsedProducts[parsedProducts.length - 1];
            console.log('Admin: Last product:', lastProduct.name, 'Image:', lastProduct.image ? 'Has image' : 'No image');
            console.log('Admin: Last product image length:', lastProduct.image ? lastProduct.image.length : 0);
            console.log('Admin: Last product image starts with data:', lastProduct.image ? lastProduct.image.startsWith('data:') : false);
            console.log('Admin: Last product additional images:', lastProduct.images ? lastProduct.images.length : 0);
        }

        // Force client refresh by dispatching multiple events
        try {
            // Dispatch storage event
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'wonderElectronicsProducts',
                newValue: JSON.stringify(products)
            }));

            // Dispatch custom event
            window.dispatchEvent(new CustomEvent('productAdded', {
                detail: { productCount: products.length }
            }));

            // Dispatch page visibility change to trigger refresh
            window.dispatchEvent(new Event('visibilitychange'));

            // Also try to open client page to force refresh
            setTimeout(() => {
                try {
                    const clientWindow = window.open('index.html', '_blank');
                    if (clientWindow) {
                        setTimeout(() => {
                            clientWindow.close();
                        }, 2000);
                    }
                } catch (e) {
                    // Ignore errors - this is just a fallback
                }
            }, 1000);

        } catch (e) {
            // Continue anyway - don't fail the entire operation
        }

        // Clear timeout
        clearTimeout(timeoutId);

    } catch (error) {
        console.error('Error adding product:', error);
        console.error('Error stack:', error.stack);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);

        // Clear timeout
        clearTimeout(timeoutId);

        // Try ultra-simple method as fallback
        console.log('Admin: Trying ultra-simple method as fallback...');
        try {
            ultraSimpleAddProduct();
        } catch (fallbackError) {
            console.error('Admin: Fallback method also failed:', fallbackError);
            showNotification(`Error adding product: ${error.message}. Fallback also failed: ${fallbackError.message}`, 'error');
        }
    }
}

// Handle edit product form submission
function handleEditProduct(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const productId = parseInt(document.getElementById('editProductId').value);

    const updatedProduct = {
        id: productId,
        name: formData.get('productName'),
        price: parseFloat(formData.get('productPrice')),
        category: formData.get('productCategory'),
        description: formData.get('productDescription'),
        image: formData.get('productImage') || '',
        stock: parseInt(formData.get('productStock')),
        brand: formData.get('productBrand')
    };

    // Find and update product
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
        products[productIndex] = updatedProduct;
        saveProductsToStorage();

        // Update analytics
        displayProductAnalytics();

        // Close modal
        closeModal();

        // Show success message
        showNotification('Product updated successfully!', 'success');

        // Refresh products table
        displayProductsTable();
    }
}

// Display products in table with pagination
function displayProductsTable() {
    const tableBody = document.getElementById('productsTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (products.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem;">No products found. Add some products to get started!</td></tr>';
        return;
    }

    // Calculate pagination
    const totalPages = Math.ceil(products.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = Math.min(startIndex + productsPerPage, products.length);
    const currentProducts = products.slice(startIndex, endIndex);

    currentProducts.forEach(product => {
        const row = document.createElement('tr');
        const discount = product.discount || 0;
        const discountBadge = discount > 0
            ? `<span class="discount-badge">${discount}% OFF</span>`
            : '<span style="color: #999;">No discount</span>';

        const condition = product.condition || 'N';
        const conditionBadge = condition === 'N'
            ? `<span class="condition-badge new">N - New</span>`
            : `<span class="condition-badge used">S - Second-hand</span>`;

        const colors = product.colors && product.colors.length > 0
            ? product.colors.join(', ')
            : '<span style="color: #999;">No colors</span>';

        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${conditionBadge}</td>
            <td>${discountBadge}</td>
            <td>${colors}</td>
            <td>${product.stock}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-warning" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-info" onclick="toggleCondition(${product.id})">
                        <i class="fas fa-tag"></i> Condition
                    </button>
                    <button class="btn btn-success" onclick="addDiscount(${product.id})">
                        <i class="fas fa-percent"></i> Discount
                    </button>
                    <button class="btn btn-danger" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Add pagination controls
    updatePaginationControls(totalPages);
}

// Update pagination controls
function updatePaginationControls(totalPages) {
    const paginationContainer = document.getElementById('paginationContainer');
    if (!paginationContainer) return;

    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let paginationHTML = `
        <div class="pagination-info">
            Showing ${((currentPage - 1) * productsPerPage) + 1} to ${Math.min(currentPage * productsPerPage, products.length)} of ${products.length} products
        </div>
        <div class="pagination-controls">
    `;

    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button class="btn btn-secondary" onclick="changePage(${currentPage - 1})">Previous</button>`;
    }

    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
        paginationHTML += `<button class="btn btn-outline-secondary" onclick="changePage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="pagination-ellipsis">...</span>`;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const isActive = i === currentPage ? 'btn-primary' : 'btn-outline-secondary';
        paginationHTML += `<button class="btn ${isActive}" onclick="changePage(${i})">${i}</button>`;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="pagination-ellipsis">...</span>`;
        }
        paginationHTML += `<button class="btn btn-outline-secondary" onclick="changePage(${totalPages})">${totalPages}</button>`;
    }

    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button class="btn btn-secondary" onclick="changePage(${currentPage + 1})">Next</button>`;
    }

    paginationHTML += `</div>`;
    paginationContainer.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    currentPage = page;
    displayProductsTable();
}

// Force refresh products from storage
function forceRefreshProducts() {
    loadProductsFromStorage();
    displayProductsTable();
    displayProductAnalytics();
    refreshProductPositioning();
    console.log('Admin: Products refreshed from storage');
}

// Debug function to check localStorage
function debugLocalStorage() {
    const stored = localStorage.getItem('wonderElectronicsProducts');
    if (stored) {
        const parsed = JSON.parse(stored);
        console.log('LocalStorage contains:', parsed.length, 'products');
        console.log('First product:', parsed[0]);
    } else {
        console.log('No products in localStorage');
    }
}








// Generate unique ID for products (supports millions of products)
function generateProductId() {
    // Use timestamp + random number for unique IDs
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return timestamp + random;
}


// Ensure product has unique ID
function ensureUniqueProductId(product) {
    if (!product.id || product.id < 1000000000000) {
        product.id = generateProductId();
    }
    return product;
}

// Edit product
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Fill edit form with product data
    document.getElementById('editProductId').value = product.id;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductCategory').value = product.category;
    document.getElementById('editProductDescription').value = product.description;
    document.getElementById('editProductImage').value = product.image;
    document.getElementById('editProductStock').value = product.stock;
    document.getElementById('editProductBrand').value = product.brand;

    // Show modal
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.style.display = 'block';
        currentEditingId = productId;
    }
}

// Toggle product condition (New/Second-hand)
function toggleCondition(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const currentCondition = product.condition || 'N';
    const conditionText = currentCondition === 'N' ? 'Brand New' : 'Second-hand';

    if (confirm(`Current condition: ${conditionText}\n\nChange to ${currentCondition === 'N' ? 'Second-hand (S)' : 'Brand New (N)'}?`)) {
        product.condition = currentCondition === 'N' ? 'S' : 'N';
        saveProductsToStorage();
        displayProductsTable();

        const newCondition = product.condition === 'N' ? 'Brand New' : 'Second-hand';
        showNotification(`${product.name} marked as ${newCondition}!`, 'success');
    }
}

// Add or update discount
function addDiscount(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const currentDiscount = product.discount || 0;
    const newDiscount = prompt(`Enter discount percentage for ${product.name}:\n(Current: ${currentDiscount}%, Enter 0 to remove discount)`, currentDiscount);

    if (newDiscount !== null) {
        const discountValue = parseInt(newDiscount);

        if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
            showNotification('Please enter a valid discount between 0 and 100', 'error');
            return;
        }

        product.discount = discountValue;
        saveProductsToStorage();
        displayProductsTable();

        if (discountValue > 0) {
            showNotification(`${discountValue}% discount added to ${product.name}!`, 'success');
        } else {
            showNotification(`Discount removed from ${product.name}`, 'success');
        }
    }
}

// Delete product
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            products.splice(productIndex, 1);
            saveProductsToStorage();

            // Update analytics
            displayProductAnalytics();

            displayProductsTable();
            showNotification('Product deleted successfully!', 'success');
        }
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.style.display = 'none';
        currentEditingId = null;

        // Clear form
        const form = document.getElementById('editProductForm');
        if (form) {
            form.reset();
        }
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.admin-notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'admin-notification';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 500;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;

    notification.textContent = message;

    // Add animation styles if not already added
    if (!document.querySelector('#admin-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'admin-notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Export products (for backup)
function exportProducts() {
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wonder-electronics-products.json';
    link.click();
    URL.revokeObjectURL(url);
}

// Import products (for restore)
function importProducts(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const importedProducts = JSON.parse(e.target.result);
            if (Array.isArray(importedProducts)) {
                products = importedProducts;
                saveProductsToStorage();
                displayProductsTable();
                showNotification('Products imported successfully!', 'success');
            } else {
                showNotification('Invalid file format', 'error');
            }
        } catch (error) {
            showNotification('Error reading file', 'error');
        }
    };
    reader.readAsText(file);
}

// Category Management
function loadCategoriesFromStorage() {
    const storedCategories = localStorage.getItem('wonderElectronicsCategories');
    if (storedCategories) {
        categories = JSON.parse(storedCategories);
    } else {
        // Default categories
        categories = [
            {
                id: 1,
                name: 'smartphones',
                displayName: 'Smartphones',
                icon: 'fas fa-mobile-alt',
                description: 'Latest smartphones and mobile devices',
                isDefault: true
            },
            {
                id: 2,
                name: 'laptops',
                displayName: 'Laptops',
                icon: 'fas fa-laptop',
                description: 'Laptops and portable computers',
                isDefault: true
            },
            {
                id: 3,
                name: 'audio',
                displayName: 'Audio',
                icon: 'fas fa-headphones',
                description: 'Audio equipment and accessories',
                isDefault: true
            },
            {
                id: 4,
                name: 'gaming',
                displayName: 'Gaming',
                icon: 'fas fa-gamepad',
                description: 'Gaming consoles and accessories',
                isDefault: true
            }
        ];
        saveCategoriesToStorage();
    }
}

function saveCategoriesToStorage() {
    localStorage.setItem('wonderElectronicsCategories', JSON.stringify(categories));
}

function displayCategoriesTable() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid) return;

    categoriesGrid.innerHTML = '';

    if (categories.length === 0) {
        categoriesGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 2rem;">No categories found. Add some categories to get started!</p>';
        return;
    }

    categories.forEach(category => {
        const productCount = products.filter(p => p.category === category.name).length;
        const categoryCard = document.createElement('div');
        categoryCard.className = `category-card ${category.isDefault ? 'default' : ''}`;

        categoryCard.innerHTML = `
            <div class="category-count">${productCount}</div>
            <div class="category-icon">
                <i class="${category.icon}"></i>
            </div>
            <div class="category-name">${category.displayName}</div>
            <div class="category-description">${category.description}</div>
            <div class="category-actions">
                <button class="btn btn-warning" onclick="editCategory(${category.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                ${!category.isDefault ? `
                    <button class="btn btn-danger" onclick="deleteCategory(${category.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                ` : ''}
            </div>
        `;

        categoriesGrid.appendChild(categoryCard);
    });
}

function editCategory(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    const newDisplayName = prompt('Enter new display name:', category.displayName);
    if (newDisplayName && newDisplayName !== category.displayName) {
        category.displayName = newDisplayName;
        saveCategoriesToStorage();
        displayCategoriesTable();
        showNotification('Category updated successfully!', 'success');
    }
}

function deleteCategory(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    if (category.isDefault) {
        showNotification('Cannot delete default category', 'error');
        return;
    }

    const productCount = products.filter(p => p.category === category.name).length;
    if (productCount > 0) {
        showNotification(`Cannot delete category with ${productCount} products. Please move or delete products first.`, 'error');
        return;
    }

    if (confirm(`Are you sure you want to delete category "${category.displayName}"?`)) {
        const categoryIndex = categories.findIndex(c => c.id === categoryId);
        if (categoryIndex !== -1) {
            categories.splice(categoryIndex, 1);
            saveCategoriesToStorage();
            displayCategoriesTable();
            showNotification('Category deleted successfully!', 'success');
        }
    }
}

// Website Settings
let websiteSettings = {};

// Load website settings from localStorage
function loadWebsiteSettings() {
    const storedSettings = localStorage.getItem('wonderElectronicsSettings');
    if (storedSettings) {
        websiteSettings = JSON.parse(storedSettings);
    } else {
        // Default settings
        websiteSettings = {
            siteTitle: 'WONDER ELECTRONICS',
            siteDescription: 'Discover the latest in consumer electronics with unbeatable prices and quality',
            currency: 'USD',
            taxRate: 5,
            usdToRwf: 1300,
            usdToEur: 0.85,
            usdToGbp: 0.73,
            showStockQuantity: true,
            heroTitle: 'Welcome to WONDER ELECTRONICS',
            heroSubtitle: 'Discover the latest in consumer electronics with unbeatable prices and quality',
            heroButtonText: 'Shop Now',
            aboutTitle: 'About WONDER ELECTRONICS',
            aboutContent: 'We are your trusted partner for premium consumer electronics. With years of experience in the industry, we bring you the latest technology at competitive prices. Our commitment to quality and customer satisfaction makes us the preferred choice for electronics enthusiasts.',
            contactPhone: '+1 (555) 123-4567',
            contactEmail: 'info@wonderelectronics.com',
            contactAddress: '123 Electronics Street, Tech City, TC 12345',
            paymentPhone: '+250787070049',
            paymentInstructions: 'Please include your order number in the payment reference when making payment via Mobile Money.',
            deliveryFee: 0
        };
        saveWebsiteSettings();
    }
    populateSettingsForms();
}

// Save website settings to localStorage
function saveWebsiteSettings() {
    localStorage.setItem('wonderElectronicsSettings', JSON.stringify(websiteSettings));
}

// Populate settings forms with current values
function populateSettingsForms() {
    // General settings
    document.getElementById('siteTitle').value = websiteSettings.siteTitle || '';
    document.getElementById('siteDescription').value = websiteSettings.siteDescription || '';
    document.getElementById('currency').value = websiteSettings.currency || 'USD';
    document.getElementById('taxRate').value = websiteSettings.taxRate || 5;
    document.getElementById('usdToRwf').value = websiteSettings.usdToRwf || 1300;
    document.getElementById('usdToEur').value = websiteSettings.usdToEur || 0.85;
    document.getElementById('usdToGbp').value = websiteSettings.usdToGbp || 0.73;
    document.getElementById('showStockQuantity').value = websiteSettings.showStockQuantity !== false ? 'true' : 'false';

    // Social media settings (only names are editable)
    const instagramNameField = document.getElementById('instagramName');
    if (instagramNameField) instagramNameField.value = websiteSettings.instagramName || 'Wonder Electronics';

    const facebookNameField = document.getElementById('facebookName');
    if (facebookNameField) facebookNameField.value = websiteSettings.facebookName || 'Wonder Electronics';

    const tiktokNameField = document.getElementById('tiktokName');
    if (tiktokNameField) tiktokNameField.value = websiteSettings.tiktokName || 'Wonder Electronics';

    // Hero settings
    document.getElementById('heroTitle').value = websiteSettings.heroTitle || '';
    document.getElementById('heroSubtitle').value = websiteSettings.heroSubtitle || '';
    document.getElementById('heroButtonText').value = websiteSettings.heroButtonText || '';

    // About settings
    document.getElementById('aboutTitle').value = websiteSettings.aboutTitle || '';
    document.getElementById('aboutContent').value = websiteSettings.aboutContent || '';

    // Contact settings
    document.getElementById('contactPhone').value = websiteSettings.contactPhone || '';
    document.getElementById('contactEmail').value = websiteSettings.contactEmail || '';
    document.getElementById('contactAddress').value = websiteSettings.contactAddress || '';

    // Payment settings
    document.getElementById('paymentPhone').value = websiteSettings.paymentPhone || '';
    document.getElementById('paymentInstructions').value = websiteSettings.paymentInstructions || '';
    document.getElementById('deliveryFee').value = websiteSettings.deliveryFee || 0;
}

// Switch settings tabs
function switchSettingsTab(tab) {
    const tabBtns = document.querySelectorAll('.settings-tab-btn');
    const contents = document.querySelectorAll('.settings-content');

    // Remove active class from all tabs and contents
    tabBtns.forEach(btn => btn.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));

    // Add active class to selected tab and content
    document.querySelector(`.settings-tab-btn[onclick="switchSettingsTab('${tab}')"]`).classList.add('active');
    document.getElementById(`${tab}-settings`).classList.add('active');
}

// Display orders table
function displayOrdersTable() {
    const tableBody = document.getElementById('ordersTableBody');
    if (!tableBody) return;

    const orders = JSON.parse(localStorage.getItem('wonderElectronicsOrders') || '[]');
    tableBody.innerHTML = '';

    if (orders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem;">No orders found.</td></tr>';
        return;
    }

    orders.forEach(order => {
        const row = document.createElement('tr');
        const orderDate = new Date(order.orderDate).toLocaleDateString();

        const paymentStatus = order.paymentVerified ? 'Verified' : 'Pending';
        const deliveryPeriod = order.deliveryPeriod || 'Standard';
        const expectedDelivery = calculateExpectedDelivery(order.orderDate, order.deliveryPeriod);

        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.customerName}</td>
            <td>$${order.total.toFixed(2)}</td>
            <td><span class="order-status ${order.status}">${order.status}</span></td>
            <td><span class="payment-status ${order.paymentVerified ? 'verified' : 'pending'}">${paymentStatus}</span></td>
            <td>${deliveryPeriod}</td>
            <td>${orderDate}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-warning" onclick="viewOrder(${order.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                    ${!order.paymentVerified ? `<button class="btn btn-success" onclick="approveOrder(${order.id})">
                        <i class="fas fa-check"></i> Approve
                    </button>` : ''}
                    <button class="btn btn-primary" onclick="updateOrderStatus(${order.id})">
                        <i class="fas fa-edit"></i> Update
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// View order details
function viewOrder(orderId) {
    const orders = JSON.parse(localStorage.getItem('wonderElectronicsOrders') || '[]');
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    let orderDetails = `Order #${order.id}\n\n`;
    orderDetails += `Customer: ${order.customerName}\n`;
    orderDetails += `Phone: ${order.customerPhone}\n`;
    orderDetails += `Address: ${order.customerAddress}\n`;
    orderDetails += `Payment Ref: ${order.paymentReference}\n`;
    orderDetails += `Status: ${order.status}\n`;
    orderDetails += `Date: ${new Date(order.orderDate).toLocaleString()}\n\n`;
    orderDetails += `Items:\n`;
    order.items.forEach(item => {
        orderDetails += `- ${item.name} x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}\n`;
    });
    orderDetails += `\nSubtotal: $${order.subtotal.toFixed(2)}\n`;
    orderDetails += `Tax: $${order.tax.toFixed(2)}\n`;
    orderDetails += `Total: $${order.total.toFixed(2)}`;

    alert(orderDetails);
}

// Update order status
function updateOrderStatus(orderId) {
    const orders = JSON.parse(localStorage.getItem('wonderElectronicsOrders') || '[]');
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const newStatus = prompt('Update order status:', order.status);
    if (newStatus && newStatus !== order.status) {
        order.status = newStatus;
        localStorage.setItem('wonderElectronicsOrders', JSON.stringify(orders));
        displayOrdersTable();
        showNotification('Order status updated successfully!', 'success');
    }
}

// Approve order function
function approveOrder(orderId) {
    const orders = JSON.parse(localStorage.getItem('wonderElectronicsOrders') || '[]');
    const orderIndex = orders.findIndex(order => order.id === orderId);

    if (orderIndex !== -1) {
        orders[orderIndex].paymentVerified = true;
        orders[orderIndex].status = 'Approved';
        orders[orderIndex].approvedDate = new Date().toISOString();
        localStorage.setItem('wonderElectronicsOrders', JSON.stringify(orders));

        showNotification('Order approved successfully!', 'success');
        displayOrdersTable();
    }
}

// Calculate expected delivery date
function calculateExpectedDelivery(orderDate, deliveryPeriod) {
    const orderDateObj = new Date(orderDate);
    let daysToAdd = 5; // Default standard delivery

    switch (deliveryPeriod) {
        case 'express':
            daysToAdd = 2;
            break;
        case 'standard':
            daysToAdd = 5;
            break;
        case 'economy':
            daysToAdd = 10;
            break;
    }

    const expectedDate = new Date(orderDateObj.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
    return expectedDate.toLocaleDateString();
}

// Display password reset requests
function displayPasswordResetRequests() {
    const tableBody = document.getElementById('resetRequestsTableBody');
    if (!tableBody) return;

    const resetRequests = JSON.parse(localStorage.getItem('wonderElectronicsResetRequests') || '[]');
    tableBody.innerHTML = '';

    if (resetRequests.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">No password reset requests found.</td></tr>';
        return;
    }

    // Update stats
    const pendingCount = resetRequests.filter(req => req.status === 'pending').length;
    const completedCount = resetRequests.filter(req => req.status === 'completed').length;

    document.getElementById('pendingResets').textContent = pendingCount;
    document.getElementById('completedResets').textContent = completedCount;

    resetRequests.forEach(request => {
        const row = document.createElement('tr');
        const requestDate = new Date(request.requestDate).toLocaleDateString();

        row.innerHTML = `
            <td>${request.userName}</td>
            <td>${request.userEmail}</td>
            <td>${requestDate}</td>
            <td><span class="reset-status ${request.status}">${request.status}</span></td>
            <td>
                <div class="action-buttons">
                    ${request.status === 'pending' ? `
                        <button class="btn btn-success" onclick="approvePasswordReset(${request.id})">
                            <i class="fas fa-check"></i> Approve
                        </button>
                        <button class="btn btn-primary" onclick="sendPasswordResetEmail(${request.id})">
                            <i class="fas fa-envelope"></i> Send Email
                        </button>
                    ` : ''}
                    <button class="btn btn-warning" onclick="viewResetRequest(${request.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Approve password reset request
function approvePasswordReset(requestId) {
    const resetRequests = JSON.parse(localStorage.getItem('wonderElectronicsResetRequests') || '[]');
    const requestIndex = resetRequests.findIndex(req => req.id === requestId);

    if (requestIndex !== -1) {
        resetRequests[requestIndex].status = 'approved';
        resetRequests[requestIndex].approvedDate = new Date().toISOString();
        localStorage.setItem('wonderElectronicsResetRequests', JSON.stringify(resetRequests));

        showNotification('Password reset request approved!', 'success');
        displayPasswordResetRequests();
    }
}

// Send password reset email (simulated)
function sendPasswordResetEmail(requestId) {
    const resetRequests = JSON.parse(localStorage.getItem('wonderElectronicsResetRequests') || '[]');
    const request = resetRequests.find(req => req.id === requestId);

    if (!request) return;

    // Generate new password
    const newPassword = generateNewPassword();

    // Update user password
    const users = JSON.parse(localStorage.getItem('wonderElectronicsUsers') || '[]');
    const userIndex = users.findIndex(u => u.email === request.userEmail);

    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        users[userIndex].passwordResetDate = new Date().toISOString();
        localStorage.setItem('wonderElectronicsUsers', JSON.stringify(users));
    }

    // Update request status
    const requestIndex = resetRequests.findIndex(req => req.id === requestId);
    if (requestIndex !== -1) {
        resetRequests[requestIndex].status = 'completed';
        resetRequests[requestIndex].completedDate = new Date().toISOString();
        resetRequests[requestIndex].newPassword = newPassword;
        localStorage.setItem('wonderElectronicsResetRequests', JSON.stringify(resetRequests));
    }

    // Simulate sending email
    alert(`Password reset email sent to ${request.userEmail}!\n\nNew Password: ${newPassword}\n\nPlease copy this password and send it to the user via email.`);

    showNotification('Password reset email sent successfully!', 'success');
    displayPasswordResetRequests();
}

// Generate new password
function generateNewPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// View reset request details
function viewResetRequest(requestId) {
    const resetRequests = JSON.parse(localStorage.getItem('wonderElectronicsResetRequests') || '[]');
    const request = resetRequests.find(req => req.id === requestId);

    if (!request) {
        showNotification('Request not found', 'error');
        return;
    }

    // Create request details modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>Password Reset Request Details</h2>
            <div class="request-details">
                <p><strong>User:</strong> ${request.userName}</p>
                <p><strong>Email:</strong> ${request.userEmail}</p>
                <p><strong>Request Date:</strong> ${new Date(request.requestDate).toLocaleString()}</p>
                <p><strong>Status:</strong> ${request.status}</p>
                ${request.approvedDate ? `<p><strong>Approved Date:</strong> ${new Date(request.approvedDate).toLocaleString()}</p>` : ''}
                ${request.completedDate ? `<p><strong>Completed Date:</strong> ${new Date(request.completedDate).toLocaleString()}</p>` : ''}
                ${request.newPassword ? `<p><strong>New Password:</strong> ${request.newPassword}</p>` : ''}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Slideshow Management Functions
let slideshowImages = [];

function loadSlideshowImages() {
    const stored = localStorage.getItem('wonderElectronicsSlideshowImages');
    if (stored) {
        slideshowImages = JSON.parse(stored);
    } else {
        slideshowImages = [];
    }
}

function saveSlideshowImages() {
    localStorage.setItem('wonderElectronicsSlideshowImages', JSON.stringify(slideshowImages));
}

function displaySlidesGrid() {
    loadSlideshowImages();
    const slidesGrid = document.getElementById('slidesGrid');
    if (!slidesGrid) return;

    slidesGrid.innerHTML = '';

    if (slideshowImages.length === 0) {
        slidesGrid.innerHTML = '<p style="text-align: center; padding: 2rem;">No slides yet. Add your first slide!</p>';
        return;
    }

    slideshowImages.forEach((slide, index) => {
        const slideCard = document.createElement('div');
        slideCard.className = 'slide-card';
        slideCard.innerHTML = `
            <img src="${slide.image}" alt="${slide.title || 'Slide'}" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
            <div class="slide-card-info">
                <h4>${slide.title || 'No Title'}</h4>
                <p>${slide.description || 'No description'}</p>
            </div>
            <div class="slide-card-actions">
                <button class="btn btn-danger" onclick="deleteSlide(${index})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        slidesGrid.appendChild(slideCard);
    });
}

function deleteSlide(index) {
    if (confirm('Are you sure you want to delete this slide?')) {
        slideshowImages.splice(index, 1);
        saveSlideshowImages();
        displaySlidesGrid();
        showNotification('Slide deleted successfully!', 'success');
    }
}

// Image Upload Handlers
function handleImageUpload(input, targetId) {
    const file = input.files[0];
    if (file) {
        console.log('Admin: Processing image upload for', targetId, 'File:', file.name, 'Size:', file.size, 'Type:', file.type);

        // Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            showNotification('File size must be less than 10MB', 'error');
            return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
            showNotification('Please select an image file', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const base64Data = e.target.result;
            console.log('Admin: Image converted to base64, length:', base64Data.length);
            console.log('Admin: Base64 starts with:', base64Data.substring(0, 50));

            document.getElementById(targetId).value = base64Data;

            // Verify the field was updated
            const fieldValue = document.getElementById(targetId).value;
            console.log('Admin: Field updated successfully, new value length:', fieldValue.length);
            console.log('Admin: Field value starts with:', fieldValue.substring(0, 50));
            console.log('Admin: Target field ID:', targetId);
            console.log('Admin: Field element found:', !!document.getElementById(targetId));

            // Test if the image can be displayed
            const testImg = document.createElement('img');
            testImg.src = base64Data;
            testImg.onload = function () {
                console.log('Admin: Test image loaded successfully!');
            };
            testImg.onerror = function () {
                console.log('Admin: Test image failed to load!');
            };
            document.body.appendChild(testImg);

            showNotification('Image uploaded successfully!', 'success');
        };
        reader.readAsDataURL(file);
    }
}

function handleMultipleImageUpload(input, targetId) {
    const files = input.files;
    if (files.length > 0) {
        console.log('Admin: Processing multiple image upload for', targetId, 'Files:', files.length);

        let urls = [];
        let processed = 0;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Check file size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                showNotification(`File ${file.name} is too large (max 10MB)`, 'error');
                continue;
            }

            // Check file type
            if (!file.type.startsWith('image/')) {
                showNotification(`File ${file.name} is not an image`, 'error');
                continue;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                const base64Data = e.target.result;
                console.log('Admin: Multiple image', i + 1, 'converted to base64');
                console.log('Admin: Additional image', i + 1, 'length:', base64Data.length);
                console.log('Admin: Additional image', i + 1, 'starts with data:', base64Data.startsWith('data:'));

                urls.push(base64Data);
                processed++;

                if (processed === files.length) {
                    const textarea = document.getElementById(targetId);
                    if (textarea) {
                        const existing = textarea.value.trim();
                        textarea.value = existing ? existing + '\n' + urls.join('\n') : urls.join('\n');
                        console.log('Admin: Additional images saved to textarea:', textarea.value.length, 'characters');
                        showNotification(`${urls.length} images uploaded successfully!`, 'success');
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    }
}

// Chat Support Functions
let currentChatSession = null;

function loadChatSessions() {
    const chatMessages = JSON.parse(localStorage.getItem('wonderElectronicsChatMessages') || '[]');
    const sessionsList = document.getElementById('chatSessionsList');

    if (!sessionsList) return;

    // Group messages by user (using userId to handle multiple guests)
    const sessions = {};
    chatMessages.forEach(msg => {
        const userId = msg.userId || msg.userName || 'guest_unknown';
        const userName = msg.userName || 'Guest User';

        if (!sessions[userId]) {
            sessions[userId] = {
                userName: userName,
                messages: [],
                lastMessageTime: null
            };
        }
        sessions[userId].messages.push(msg);

        // Track the latest message timestamp
        const msgTime = new Date(msg.timestamp).getTime();
        if (!sessions[userId].lastMessageTime || msgTime > sessions[userId].lastMessageTime) {
            sessions[userId].lastMessageTime = msgTime;
        }
    });

    sessionsList.innerHTML = '';

    if (Object.keys(sessions).length === 0) {
        sessionsList.innerHTML = '<p style="padding: 1rem; color: #999;">No active chats</p>';
        return;
    }

    // Convert to array and sort by latest message time (newest first)
    const sortedSessions = Object.entries(sessions).sort((a, b) => {
        return b[1].lastMessageTime - a[1].lastMessageTime;
    });

    // Display sessions with newest on top
    sortedSessions.forEach(([userId, sessionData]) => {
        const session = document.createElement('div');
        session.className = 'chat-session';
        session.onclick = () => loadChatConversation(sessionData.userName, sessionData.messages);

        // Get last message preview
        const lastMessage = sessionData.messages[sessionData.messages.length - 1];
        const lastMessageText = lastMessage.text.substring(0, 30) + (lastMessage.text.length > 30 ? '...' : '');
        const lastMessageTime = new Date(lastMessage.timestamp).toLocaleString();

        // Identify guest users
        const userIcon = userId.startsWith('guest_') ? 'fa-user' : 'fa-user-circle';
        const userLabel = userId.startsWith('guest_') ? '(Guest)' : '';

        session.innerHTML = `
            <div class="session-info">
                <i class="fas ${userIcon}" style="font-size: 1.5rem;"></i>
                <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <strong style="color: #333;">${sessionData.userName}</strong>
                        ${userLabel ? `<span style="font-size: 0.75rem; color: #999; font-weight: normal;">${userLabel}</span>` : ''}
                    </div>
                    <small style="display: block; color: #666; margin-top: 0.25rem;">${lastMessageText}</small>
                    <small style="display: block; color: #999; margin-top: 0.25rem; font-size: 0.7rem;">${sessionData.messages.length} messages • ${lastMessageTime}</small>
                </div>
            </div>
        `;
        sessionsList.appendChild(session);
    });
}

function loadChatConversation(userName, messages) {
    currentChatSession = userName;
    document.getElementById('currentChatUser').textContent = `Chat with ${userName}`;

    const messagesContainer = document.getElementById('adminChatMessages');
    messagesContainer.innerHTML = '';

    messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${msg.sender}-message`;
        const time = new Date(msg.timestamp).toLocaleTimeString();
        messageDiv.innerHTML = `
            <div class="message-bubble">
                <p>${msg.text}</p>
                <small>${time}</small>
            </div>
        `;
        messagesContainer.appendChild(messageDiv);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sendAdminMessage() {
    const input = document.getElementById('adminChatInput');
    const message = input.value.trim();

    if (!message || !currentChatSession) return;

    const chatMessages = JSON.parse(localStorage.getItem('wonderElectronicsChatMessages') || '[]');

    chatMessages.push({
        text: message,
        sender: 'admin',
        userName: currentChatSession,
        timestamp: new Date().toISOString()
    });

    localStorage.setItem('wonderElectronicsChatMessages', JSON.stringify(chatMessages));

    input.value = '';
    loadChatSessions();

    // Reload conversation
    const sessions = {};
    chatMessages.forEach(msg => {
        const user = msg.userName || 'Guest User';
        if (!sessions[user]) {
            sessions[user] = [];
        }
        sessions[user].push(msg);
    });

    if (sessions[currentChatSession]) {
        loadChatConversation(currentChatSession, sessions[currentChatSession]);
    }
}

function handleAdminChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendAdminMessage();
    }
}

// Add slide form submission handler
document.addEventListener('DOMContentLoaded', function () {
    const slideForm = document.getElementById('addSlideForm');
    if (slideForm) {
        slideForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const imageUrl = formData.get('slideImage');

            if (!imageUrl || !imageUrl.trim()) {
                showNotification('Please provide an image URL or upload an image', 'error');
                return;
            }

            const newSlide = {
                id: Date.now(),
                image: imageUrl,
                title: formData.get('slideTitle'),
                description: formData.get('slideDescription')
            };

            loadSlideshowImages();
            slideshowImages.push(newSlide);
            saveSlideshowImages();
            console.log('Slide saved:', newSlide);
            console.log('Total slides now:', slideshowImages.length);
            displaySlidesGrid();
            e.target.reset();
            showNotification('Slide added successfully! Refresh the client page to see it.', 'success');
        });
    }
});

// Setup Admin Navigation
function setupAdminNavigation() {
    const adminLinks = document.querySelectorAll('.admin-link');
    const adminSections = document.querySelectorAll('.admin-section');

    adminLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove active class from all links
            adminLinks.forEach(l => l.classList.remove('active'));

            // Add active class to clicked link
            this.classList.add('active');

            // Get target section from href
            const targetId = this.getAttribute('href').substring(1);

            // Hide all sections
            adminSections.forEach(section => {
                section.classList.remove('active');
            });

            // Show target section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');

                // Refresh positioning when manage-products section is shown
                if (targetId === 'manage-products' && typeof refreshProductPositioning === 'function') {
                    refreshProductPositioning();
                }
            }
        });
    });

    // Show first section by default
    if (adminSections.length > 0) {
        adminSections[0].classList.add('active');
    }
}

// Subcategory Management Functions
function loadSubcategoriesFromStorage() {
    const stored = localStorage.getItem('wonderElectronicsSubcategories');
    if (stored) {
        subcategoriesList = JSON.parse(stored);
    }
}

function saveSubcategoriesToStorage() {
    localStorage.setItem('wonderElectronicsSubcategories', JSON.stringify(subcategoriesList));
}

function handleSubcategoryFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const newSubcategory = {
        id: Date.now(),
        category: formData.get('subcategoryCategory'),
        name: formData.get('subcategoryName'),
        description: formData.get('subcategoryDescription') || ''
    };

    // Check if subcategory already exists for this category
    const exists = subcategoriesList.some(sub =>
        sub.category === newSubcategory.category &&
        sub.name.toLowerCase() === newSubcategory.name.toLowerCase()
    );

    if (exists) {
        showNotification('This subcategory already exists for this category', 'error');
        return;
    }

    subcategoriesList.push(newSubcategory);
    saveSubcategoriesToStorage();
    displaySubcategoriesGrid();

    // Clear form
    e.target.reset();

    showNotification('Subcategory added successfully', 'success');
}

function displaySubcategoriesGrid() {
    const grid = document.getElementById('subcategoriesGrid');
    if (!grid) return;

    if (subcategoriesList.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">No custom subcategories added yet</p>';
        return;
    }

    // Group by category
    const grouped = subcategoriesList.reduce((acc, sub) => {
        if (!acc[sub.category]) {
            acc[sub.category] = [];
        }
        acc[sub.category].push(sub);
        return acc;
    }, {});

    grid.innerHTML = Object.keys(grouped).map(category => `
        <div class="subcategory-category-group">
            <h4 class="category-group-title">${category.charAt(0).toUpperCase() + category.slice(1)}</h4>
            <div class="subcategory-items">
                ${grouped[category].map(sub => `
                    <div class="subcategory-item">
                        <div class="subcategory-info">
                            <h5>${sub.name}</h5>
                            ${sub.description ? `<p>${sub.description}</p>` : ''}
                        </div>
                        <div class="subcategory-actions">
                            <button class="btn btn-danger btn-sm" onclick="deleteSubcategory(${sub.id})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function deleteSubcategory(id) {
    if (confirm('Are you sure you want to delete this subcategory?')) {
        subcategoriesList = subcategoriesList.filter(sub => sub.id !== id);
        saveSubcategoriesToStorage();
        displaySubcategoriesGrid();
        showNotification('Subcategory deleted successfully', 'success');
    }
}

// Trending Products Management Functions
function loadTrendingProductsFromStorage() {
    const stored = localStorage.getItem('wonderElectronicsTrendingProducts');
    if (stored) {
        try {
            trendingProducts = JSON.parse(stored);
            console.log('Loaded trending products:', trendingProducts.length);
        } catch (e) {
            console.error('Error parsing trending products:', e);
            trendingProducts = [];
        }
    }
}

function saveTrendingProductsToStorage() {
    localStorage.setItem('wonderElectronicsTrendingProducts', JSON.stringify(trendingProducts));
}

function populateTrendingProductSelect() {
    const select = document.getElementById('trendingProductSelect');
    if (!select) return;

    select.innerHTML = '<option value="">Choose a product to add to trending</option>';

    products.forEach(product => {
        // Check if product is already trending
        const isAlreadyTrending = trendingProducts.some(tp => tp.id === product.id);
        if (!isAlreadyTrending) {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `${product.name} - $${product.price.toFixed(2)}`;
            select.appendChild(option);
        }
    });
}

function displayTrendingProductsGrid() {
    const container = document.getElementById('trendingProductsContainer');
    if (!container) return;

    if (trendingProducts.length === 0) {
        container.innerHTML = '<p>No trending products yet. Add some products to the trending slideshow.</p>';
        return;
    }

    container.innerHTML = trendingProducts.map((product, index) => {
        const productImage = product.images && product.images.length > 0 ? product.images[0] : product.image;
        return `
            <div class="trending-product-card">
                <div class="trending-product-position">#${index + 1}</div>
                <img src="${productImage}" alt="${product.name}" class="trending-product-image" 
                     onerror="this.src='https://via.placeholder.com/300x200?text=Product+Image'">
                <div class="trending-product-info">
                    <h4>${product.name}</h4>
                    <p>${product.shortDescription || product.description}</p>
                    <div class="trending-product-price">
                        ${product.discount && product.discount > 0 ?
                `<span style="text-decoration: line-through; color: #999; margin-right: 0.5rem;">$${product.price.toFixed(2)}</span>
                             <span style="color: #4CAF50;">$${(product.price * (1 - product.discount / 100)).toFixed(2)}</span>
                             <span style="background: #ff4444; color: white; padding: 0.2rem 0.5rem; border-radius: 10px; font-size: 0.8rem; margin-left: 0.5rem;">-${product.discount}%</span>` :
                `$${product.price.toFixed(2)}`
            }
                    </div>
                    <div class="trending-product-actions">
                        <button class="btn btn-warning" onclick="moveTrendingProduct(${product.id}, 'up')" ${index === 0 ? 'disabled' : ''}>
                            <i class="fas fa-arrow-up"></i> Move Up
                        </button>
                        <button class="btn btn-warning" onclick="moveTrendingProduct(${product.id}, 'down')" ${index === trendingProducts.length - 1 ? 'disabled' : ''}>
                            <i class="fas fa-arrow-down"></i> Move Down
                        </button>
                        <button class="btn btn-danger" onclick="removeFromTrending(${product.id})">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function addToTrending(productId, position) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        showNotification('Product not found', 'error');
        return;
    }

    // Check if already trending
    if (trendingProducts.some(tp => tp.id === productId)) {
        showNotification('Product is already trending', 'warning');
        return;
    }

    // Add to trending
    if (position && position >= 1 && position <= trendingProducts.length + 1) {
        trendingProducts.splice(position - 1, 0, product);
    } else {
        trendingProducts.push(product);
    }

    // Limit to 6 products
    if (trendingProducts.length > 6) {
        trendingProducts = trendingProducts.slice(0, 6);
        showNotification('Only 6 products can be trending. Extra products removed.', 'warning');
    }

    saveTrendingProductsToStorage();
    displayTrendingProductsGrid();
    populateTrendingProductSelect();
    showNotification('Product added to trending successfully', 'success');
}

function removeFromTrending(productId) {
    trendingProducts = trendingProducts.filter(tp => tp.id !== productId);
    saveTrendingProductsToStorage();
    displayTrendingProductsGrid();
    populateTrendingProductSelect();
    showNotification('Product removed from trending', 'success');
}

function moveTrendingProduct(productId, direction) {
    const index = trendingProducts.findIndex(tp => tp.id === productId);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
        [trendingProducts[index - 1], trendingProducts[index]] = [trendingProducts[index], trendingProducts[index - 1]];
    } else if (direction === 'down' && index < trendingProducts.length - 1) {
        [trendingProducts[index], trendingProducts[index + 1]] = [trendingProducts[index + 1], trendingProducts[index]];
    }

    saveTrendingProductsToStorage();
    displayTrendingProductsGrid();
    showNotification('Product position updated', 'success');
}

// Handle trending product form submission
function handleTrendingProductFormSubmit(e) {
    e.preventDefault();

    const productId = parseInt(document.getElementById('trendingProductSelect').value);
    const position = parseInt(document.getElementById('trendingPosition').value);

    if (!productId) {
        showNotification('Please select a product', 'error');
        return;
    }

    addToTrending(productId, position);

    // Reset form
    document.getElementById('addTrendingProductForm').reset();
}

// Create example trending products for admin demonstration
function createExampleTrendingProductsForAdmin() {
    const storedTrendingProducts = localStorage.getItem('wonderElectronicsTrendingProducts');

    // Only create examples if no trending products exist
    if (!storedTrendingProducts || storedTrendingProducts === '[]') {
        console.log('Creating example trending products for admin demonstration...');

        // Get some products from the main products array
        const allProducts = JSON.parse(localStorage.getItem('wonderElectronicsProducts')) || products;

        // Select 6 diverse products for trending
        const exampleTrendingProducts = [
            allProducts.find(p => p.name.includes('iPhone 15 Pro Max')) || allProducts[0],
            allProducts.find(p => p.name.includes('MacBook Pro')) || allProducts[1],
            allProducts.find(p => p.name.includes('AirPods Pro')) || allProducts[2],
            allProducts.find(p => p.name.includes('PlayStation 5')) || allProducts[3],
            allProducts.find(p => p.name.includes('Samsung Galaxy')) || allProducts[4],
            allProducts.find(p => p.name.includes('Dell XPS')) || allProducts[5]
        ].filter(product => product); // Remove any undefined products

        // Save example trending products
        localStorage.setItem('wonderElectronicsTrendingProducts', JSON.stringify(exampleTrendingProducts));
        console.log('Created', exampleTrendingProducts.length, 'example trending products for admin');

        // Update trending products array
        trendingProducts = exampleTrendingProducts;
    }
}

// Simplified Trending Product Modal Functionality
function setupTrendingProductModal() {
    // Modal functionality is handled by openTrendingProductModal() and closeTrendingProductModal()
}

function openTrendingProductModal() {
    const modal = document.getElementById('trendingProductModal');
    if (!modal) return;

    // Load products in modal
    loadProductsInModal();

    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeTrendingProductModal() {
    const modal = document.getElementById('trendingProductModal');
    if (!modal) return;

    // Hide modal
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function loadProductsInModal() {
    const modalGrid = document.getElementById('productSelectionGrid');
    if (!modalGrid) return;

    modalGrid.innerHTML = '';

    products.forEach(product => {
        const isAlreadyTrending = trendingProducts.some(tp => tp.id === product.id);
        const productImage = product.images && product.images.length > 0 ? product.images[0] : product.image;

        const productCard = document.createElement('div');
        productCard.className = `product-selection-card ${isAlreadyTrending ? 'already-trending' : ''}`;
        productCard.innerHTML = `
            ${isAlreadyTrending ? '<div class="trending-badge">Already Trending</div>' : ''}
            <img src="${productImage}" alt="${product.name}" class="product-selection-image" 
                 onerror="this.src='https://via.placeholder.com/200x100?text=Product+Image'">
            <div class="product-selection-info">
                <h5>${product.name}</h5>
                <div class="product-selection-price">
                    ${product.discount && product.discount > 0 ?
                `<span style="text-decoration: line-through; color: #999; margin-right: 0.5rem;">$${product.price.toFixed(2)}</span>
                         <span style="color: #4CAF50;">$${(product.price * (1 - product.discount / 100)).toFixed(2)}</span>
                         <span style="background: #ff4444; color: white; padding: 0.1rem 0.3rem; border-radius: 8px; font-size: 0.7rem; margin-left: 0.3rem;">-${product.discount}%</span>` :
                `$${product.price.toFixed(2)}`
            }
                </div>
                <div class="product-selection-actions">
                    <button class="btn btn-primary" onclick="addProductToTrendingFromModal(${product.id})" 
                            ${isAlreadyTrending ? 'disabled' : ''}>
                        <i class="fas fa-star"></i> ${isAlreadyTrending ? 'Already Added' : 'Add to Trending'}
                    </button>
                </div>
            </div>
        `;

        modalGrid.appendChild(productCard);
    });
}

function addProductToTrendingFromModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        showNotification('Product not found', 'error');
        return;
    }

    // Check if already trending
    if (trendingProducts.some(tp => tp.id === productId)) {
        showNotification('Product is already trending', 'warning');
        return;
    }

    // Check if we've reached the limit
    if (trendingProducts.length >= 6) {
        showNotification('Maximum 6 trending products allowed. Remove one first.', 'warning');
        return;
    }

    // Add to trending
    trendingProducts.push(product);
    saveTrendingProductsToStorage();
    displayTrendingProductsGrid();
    closeTrendingProductModal();
    showNotification('Product added to trending successfully', 'success');
}

function clearAllTrending() {
    if (confirm('Are you sure you want to remove all trending products?')) {
        trendingProducts = [];
        saveTrendingProductsToStorage();
        displayTrendingProductsGrid();
        showNotification('All trending products removed', 'success');
    }
}

// Hero Image Management Functions
function loadHeroImageSettings() {
    console.log('Loading hero image settings...');

    const heroImageSettings = localStorage.getItem('wonderElectronicsHeroImage');
    let settings = {
        imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200',
        title: 'Discover Amazing Electronics',
        message: 'Shop the latest technology at unbeatable prices'
    };

    if (heroImageSettings) {
        try {
            const savedSettings = JSON.parse(heroImageSettings);
            settings = { ...settings, ...savedSettings };
            console.log('Loaded hero image settings:', settings);
        } catch (e) {
            console.error('Error parsing hero image settings:', e);
        }
    }

    // Populate form fields
    document.getElementById('heroImageUrl').value = settings.imageUrl;
    document.getElementById('heroImageTitle').value = settings.title;
    document.getElementById('heroImageMessage').value = settings.message;
    document.getElementById('showShopButton').checked = settings.showShopButton !== false; // Default to true

    // Show preview
    updateHeroImagePreview(settings);

    console.log('Hero image settings loaded successfully');
}

function handleHeroImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (10MB limit for better quality)
    if (file.size > 10 * 1024 * 1024) {
        showNotification('File size must be less than 10MB', 'error');
        return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file', 'error');
        return;
    }

    // Show loading notification
    showNotification('Processing image for optimal quality...', 'info');

    // Create image element to check dimensions and optimize
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = function () {
        // Calculate optimal dimensions (maintain aspect ratio)
        const maxWidth = 1920;  // High resolution for better quality
        const maxHeight = 1080;

        let { width, height } = img;

        // Scale down if too large, but maintain quality
        if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = width * ratio;
            height = height * ratio;
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw image with high quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64 with high quality
        const base64Image = canvas.toDataURL('image/jpeg', 0.95); // 95% quality

        // Update the URL field with optimized base64 data
        document.getElementById('heroImageUrl').value = base64Image;

        // Update preview
        const title = document.getElementById('heroImageTitle').value.trim();
        const message = document.getElementById('heroImageMessage').value.trim();

        const settings = {
            imageUrl: base64Image,
            title: title,
            message: message
        };

        updateHeroImagePreview(settings);
        showNotification(`Image optimized successfully! (${width}x${height})`, 'success');
    };

    img.onerror = function () {
        showNotification('Error processing image. Please try a different file.', 'error');
    };

    // Load the image
    const reader = new FileReader();
    reader.onload = function (e) {
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function saveHeroImageSettings() {
    const imageUrl = document.getElementById('heroImageUrl').value.trim();
    const title = document.getElementById('heroImageTitle').value.trim();
    const message = document.getElementById('heroImageMessage').value.trim();
    const showShopButton = document.getElementById('showShopButton').checked;

    if (!imageUrl) {
        showNotification('Please provide an image URL or upload an image', 'error');
        return;
    }

    const settings = {
        imageUrl: imageUrl,
        title: title,
        message: message,
        showShopButton: showShopButton
    };

    localStorage.setItem('wonderElectronicsHeroImage', JSON.stringify(settings));
    showNotification('Hero image settings saved successfully!', 'success');

    // Update preview
    updateHeroImagePreview(settings);

    console.log('Hero image settings saved:', settings);
}

function resetHeroImageSettings() {
    const defaultSettings = {
        imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200',
        title: 'Discover Amazing Electronics',
        message: 'Shop the latest technology at unbeatable prices'
    };

    document.getElementById('heroImageUrl').value = defaultSettings.imageUrl;
    document.getElementById('heroImageTitle').value = defaultSettings.title;
    document.getElementById('heroImageMessage').value = defaultSettings.message;

    updateHeroImagePreview(defaultSettings);
    showNotification('Hero image settings reset to default', 'info');
}

function previewHeroImage() {
    const imageUrl = document.getElementById('heroImageUrl').value.trim();
    const title = document.getElementById('heroImageTitle').value.trim();
    const message = document.getElementById('heroImageMessage').value.trim();

    if (!imageUrl) {
        showNotification('Please enter an image URL first', 'error');
        return;
    }

    const settings = {
        imageUrl: imageUrl,
        title: title || 'Sample Title',
        message: message || 'Sample Message'
    };

    updateHeroImagePreview(settings);
    showNotification('Preview updated', 'success');
}

function updateHeroImagePreview(settings) {
    const previewContainer = document.getElementById('heroImagePreview');
    if (!previewContainer) return;

    // Build content based on what's available
    let contentHtml = '';

    if (settings.title) {
        contentHtml += `<h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);">${settings.title}</h3>`;
    }

    if (settings.message) {
        contentHtml += `<p style="font-size: 1rem; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);">${settings.message}</p>`;
    }

    // Show Shop Now button only if enabled
    if (settings.showShopButton !== false) {
        contentHtml += `<button style="
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            margin-top: 1rem;
            font-size: 1rem;
            box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
        ">Shop Now</button>`;
    }

    previewContainer.innerHTML = `
        <div class="hero-image-preview-item" style="
            width: 100%;
            height: 200px;
            background: url('${settings.imageUrl}') center/cover;
            border-radius: 10px;
            position: relative;
            overflow: hidden;
            margin-bottom: 1rem;
        ">
            <div style="
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.4);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                color: white;
                padding: 1rem;
            ">
                ${contentHtml}
            </div>
        </div>
    `;
}

// Admin User Management Functions
function loadAdminUsers() {
    const adminUsers = JSON.parse(localStorage.getItem('wonderElectronicsAdminUsers')) || [];
    return adminUsers;
}

function saveAdminUsers(adminUsers) {
    localStorage.setItem('wonderElectronicsAdminUsers', JSON.stringify(adminUsers));
}

function displayAdminUsers() {
    const adminUsers = loadAdminUsers();
    const table = document.getElementById('adminUsersTable');

    if (!table) return;

    if (adminUsers.length === 0) {
        table.innerHTML = '<p>No admin users found.</p>';
        return;
    }

    const tableHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${adminUsers.map(admin => `
                    <tr>
                        <td>${admin.name}</td>
                        <td>${admin.email}</td>
                        <td><span class="role-badge ${admin.role}">${admin.role}</span></td>
                        <td><span class="status-badge ${admin.status}">${admin.status}</span></td>
                        <td>${new Date(admin.createdAt).toLocaleDateString()}</td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="editAdminUser(${admin.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="removeAdminUser(${admin.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    table.innerHTML = tableHTML;
    updateAdminStats();
}

function updateAdminStats() {
    const adminUsers = loadAdminUsers();
    const totalAdmins = adminUsers.length;
    const activeAdmins = adminUsers.filter(admin => admin.status === 'active').length;
    const pendingAdmins = adminUsers.filter(admin => admin.status === 'pending').length;

    document.getElementById('totalAdmins').textContent = totalAdmins;
    document.getElementById('activeAdmins').textContent = activeAdmins;
    document.getElementById('pendingAdmins').textContent = pendingAdmins;
}

function openAdminSignupModal() {
    document.getElementById('adminSignupModal').style.display = 'block';
}

function closeAdminSignupModal() {
    document.getElementById('adminSignupModal').style.display = 'none';
    document.getElementById('adminSignupForm').reset();
}

function removeAdminUser(adminId) {
    if (confirm('Are you sure you want to remove this admin user?')) {
        const adminUsers = loadAdminUsers();
        const updatedUsers = adminUsers.filter(admin => admin.id !== adminId);
        saveAdminUsers(updatedUsers);
        displayAdminUsers();
        showNotification('Admin user removed successfully', 'success');
    }
}

function refreshAdminUsers() {
    displayAdminUsers();
    showNotification('Admin users refreshed', 'info');
}

// Handle admin signup form
document.addEventListener('DOMContentLoaded', function () {
    const adminSignupForm = document.getElementById('adminSignupForm');
    if (adminSignupForm) {
        adminSignupForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(adminSignupForm);
            const adminData = {
                id: Date.now(),
                name: formData.get('adminName'),
                email: formData.get('adminEmail'),
                password: formData.get('adminPassword'),
                role: formData.get('adminRole'),
                status: formData.get('adminStatus'),
                createdAt: new Date().toISOString()
            };

            const adminUsers = loadAdminUsers();

            // Check if email already exists
            if (adminUsers.find(admin => admin.email === adminData.email)) {
                showNotification('Admin with this email already exists', 'error');
                return;
            }

            adminUsers.push(adminData);
            saveAdminUsers(adminUsers);
            displayAdminUsers();
            closeAdminSignupModal();
            showNotification('Admin user created successfully', 'success');
        });
    }
});

// Product Analytics Functions
function displayProductAnalytics() {
    // Get current products array (not from storage to ensure we have latest)
    const currentProducts = products || [];
    const currentCategories = categories || [];
    const currentSubcategories = subcategoriesList || [];

    // Update stats
    const totalProductsElement = document.getElementById('totalProductsCount');
    const totalCategoriesElement = document.getElementById('totalCategoriesCount');
    const totalSubcategoriesElement = document.getElementById('totalSubcategoriesCount');

    if (totalProductsElement) {
        totalProductsElement.textContent = currentProducts.length;
    }
    if (totalCategoriesElement) {
        totalCategoriesElement.textContent = currentCategories.length;
    }
    if (totalSubcategoriesElement) {
        totalSubcategoriesElement.textContent = currentSubcategories.length;
    }

    // Generate category chart
    generateCategoryChart(currentProducts);

    // Generate price distribution chart
    generatePriceChart(currentProducts);

    // Generate category breakdown
    generateCategoryBreakdown(currentProducts, currentCategories);
}

function generateCategoryChart(products) {
    const categoryCount = {};
    products.forEach(product => {
        categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
    });

    const chartContainer = document.getElementById('categoryChart');
    const chartHTML = Object.entries(categoryCount).map(([category, count]) => `
        <div class="chart-bar" style="display: flex; align-items: center; margin-bottom: 10px;">
            <div style="width: 100px; font-weight: bold;">${category}</div>
            <div style="flex: 1; background: #f0f0f0; height: 20px; border-radius: 10px; margin: 0 10px; position: relative;">
                <div style="background: #667eea; height: 100%; border-radius: 10px; width: ${(count / Math.max(...Object.values(categoryCount))) * 100}%;"></div>
            </div>
            <div style="width: 50px; text-align: right; font-weight: bold;">${count}</div>
        </div>
    `).join('');

    chartContainer.innerHTML = chartHTML;
}

function generatePriceChart(products) {
    const priceRanges = {
        'Under $100': 0,
        '$100-$500': 0,
        '$500-$1000': 0,
        '$1000-$2000': 0,
        'Over $2000': 0
    };

    products.forEach(product => {
        const price = product.price;
        if (price < 100) priceRanges['Under $100']++;
        else if (price < 500) priceRanges['$100-$500']++;
        else if (price < 1000) priceRanges['$500-$1000']++;
        else if (price < 2000) priceRanges['$1000-$2000']++;
        else priceRanges['Over $2000']++;
    });

    const chartContainer = document.getElementById('priceChart');
    const chartHTML = Object.entries(priceRanges).map(([range, count]) => `
        <div class="chart-bar" style="display: flex; align-items: center; margin-bottom: 10px;">
            <div style="width: 120px; font-weight: bold;">${range}</div>
            <div style="flex: 1; background: #f0f0f0; height: 20px; border-radius: 10px; margin: 0 10px; position: relative;">
                <div style="background: #28a745; height: 100%; border-radius: 10px; width: ${(count / Math.max(...Object.values(priceRanges))) * 100}%;"></div>
            </div>
            <div style="width: 50px; text-align: right; font-weight: bold;">${count}</div>
        </div>
    `).join('');

    chartContainer.innerHTML = chartHTML;
}

function generateCategoryBreakdown(products, categories) {
    const breakdown = categories.map(category => {
        const categoryProducts = products.filter(product => product.category === category.name);
        return {
            category: category.name,
            count: categoryProducts.length,
            percentage: ((categoryProducts.length / products.length) * 100).toFixed(1)
        };
    }).sort((a, b) => b.count - a.count);

    const breakdownContainer = document.getElementById('categoryBreakdown');
    const breakdownHTML = `
        <table class="analytics-table">
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Products</th>
                    <th>Percentage</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${breakdown.map(item => `
                    <tr>
                        <td>${item.category}</td>
                        <td>${item.count}</td>
                        <td>${item.percentage}%</td>
                        <td>
                            <span class="status-badge ${item.count > 0 ? 'active' : 'inactive'}">
                                ${item.count > 0 ? 'Active' : 'Empty'}
                            </span>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    breakdownContainer.innerHTML = breakdownHTML;
}

// Product Positioning Functions
function loadProductPositioning() {
    populatePositionProductSelect();
    displayProductPositions();
}

function refreshProductPositioning() {
    populatePositionProductSelect();
    displayProductPositions();
}

function populatePositionProductSelect() {
    const select = document.getElementById('positionProductSelect');
    if (!select) return;

    // Clear existing options
    select.innerHTML = '<option value="">Choose a product...</option>';

    // Check if products are loaded
    if (!products || products.length === 0) {
        console.log('No products available for positioning');
        return;
    }

    console.log('Populating position select with', products.length, 'products');

    // Add products to select
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = `${product.name} (${product.category})`;
        select.appendChild(option);
    });
}

function updateProductPosition() {
    const productId = document.getElementById('positionProductSelect').value;
    const positionType = document.getElementById('positionType').value;

    if (!productId) {
        showNotification('Please select a product', 'error');
        return;
    }

    let position;
    if (positionType === 'number') {
        const positionNumber = document.getElementById('productPositionNumber').value;
        if (!positionNumber || positionNumber < 1) {
            showNotification('Please enter a valid position number (1 or higher)', 'error');
            return;
        }
        position = parseInt(positionNumber);
    } else {
        position = document.getElementById('productPosition').value;
    }

    // Find the product and update its position
    const productIndex = products.findIndex(p => p.id == productId);
    if (productIndex !== -1) {
        products[productIndex].position = position;
        saveProductsToStorage();
        displayProductPositions();
        showNotification(`Product position updated to ${position}`, 'success');

        // Clear form
        document.getElementById('positionProductSelect').value = '';
        document.getElementById('productPositionNumber').value = '';
        document.getElementById('productPosition').value = 'top';
    }
}

function togglePositionInput() {
    const positionType = document.getElementById('positionType').value;
    const numberGroup = document.getElementById('numberPositionGroup');
    const categoryGroup = document.getElementById('categoryPositionGroup');

    if (positionType === 'number') {
        numberGroup.style.display = 'block';
        categoryGroup.style.display = 'none';
    } else {
        numberGroup.style.display = 'none';
        categoryGroup.style.display = 'block';
    }
}

function resetProductPositions() {
    if (confirm('Are you sure you want to reset all product positions?')) {
        products.forEach(product => {
            delete product.position; // Remove position property
        });
        saveProductsToStorage();
        displayProductPositions();
        showNotification('All product positions reset', 'success');
    }
}

function displayProductPositions() {
    const container = document.getElementById('productPositionsList');
    if (!container) return;

    // Separate products with positions from those without
    const productsWithPositions = products.filter(p => p.position !== undefined);
    const productsWithoutPositions = products.filter(p => p.position === undefined);

    // Sort products with positions
    productsWithPositions.sort((a, b) => {
        // If both are numbers, sort numerically
        if (typeof a.position === 'number' && typeof b.position === 'number') {
            return a.position - b.position;
        }
        // If both are strings, sort by category order
        if (typeof a.position === 'string' && typeof b.position === 'string') {
            const order = { 'top': 1, 'middle': 2, 'bottom': 3 };
            return (order[a.position] || 2) - (order[b.position] || 2);
        }
        // Mixed types: numbers first, then strings
        if (typeof a.position === 'number') return -1;
        if (typeof b.position === 'number') return 1;
        return 0;
    });

    let html = '';

    // Products with positions
    if (productsWithPositions.length > 0) {
        html += '<div class="position-group"><h4>Products with Positions</h4>';
        productsWithPositions.forEach(product => {
            const positionType = typeof product.position === 'number' ? 'number' : 'category';
            const positionValue = positionType === 'number' ? `#${product.position}` : product.position;
            const badgeClass = positionType === 'number' ? 'number' : product.position;

            html += `
                <div class="position-item">
                    <span class="product-name">${product.name}</span>
                    <span class="position-badge ${badgeClass}">${positionValue}</span>
                </div>
            `;
        });
        html += '</div>';
    }

    // Products without positions
    if (productsWithoutPositions.length > 0) {
        html += '<div class="position-group"><h4>Products without Positions</h4>';
        productsWithoutPositions.forEach(product => {
            html += `
                <div class="position-item">
                    <span class="product-name">${product.name}</span>
                    <span class="position-badge default">Default</span>
                </div>
            `;
        });
        html += '</div>';
    }

    if (html === '') {
        html = '<p>No products found.</p>';
    }

    container.innerHTML = html;
}

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    loadProductsFromStorage();
    loadCategoriesFromStorage();
    loadSubcategoriesFromStorage();
    loadHeroImageSettings();

    displayProductsTable();
    displayCategoriesGrid();
    displaySubcategoriesGrid();
    displayTrendingProductsGrid();
    displayUsersTable();
    displayOrdersTable();
    displayAdminUsers();
    displayPasswordResetRequests();
    loadChatSessions();
    populateSettingsForms();
    populateTrendingProductSelect();
    setupAdminEventListeners();
    displayProductAnalytics();
    setupAdminNavigation();
    loadProductPositioning();

    // Setup trending product modal functionality
    setupTrendingProductModal();

    // Load slideshow data
    loadSlideshowData();

    // Add click event listener to checkbox with timeout
    setTimeout(() => {
        const enableCheckbox = document.getElementById('enableSlideshow');
        console.log('Looking for checkbox element:', enableCheckbox);
        if (enableCheckbox) {
            console.log('Adding click event listener to checkbox');
            enableCheckbox.addEventListener('click', function () {
                console.log('Checkbox clicked!');
                alert('Checkbox clicked!');
            });
        } else {
            console.error('Checkbox element not found!');
            alert('Checkbox element not found!');
        }
    }, 1000);
});

// Hero Slideshow Functions
let heroSlideshowData = {
    enabled: false,
    interval: 5,
    slides: []
};

function toggleSlideshowMode() {
    console.log('toggleSlideshowMode called');
    const enableCheckbox = document.getElementById('enableSlideshow');
    const slideshowControls = document.getElementById('slideshowControls');

    console.log('Enable checkbox:', enableCheckbox);
    console.log('Slideshow controls:', slideshowControls);
    console.log('Checkbox checked:', enableCheckbox ? enableCheckbox.checked : 'checkbox not found');

    if (enableCheckbox && slideshowControls) {
        if (enableCheckbox.checked) {
            console.log('Enabling slideshow mode');
            slideshowControls.style.display = 'block';
            heroSlideshowData.enabled = true;
            loadSlideshowData();
            saveSlideshowData();
        } else {
            console.log('Disabling slideshow mode');
            slideshowControls.style.display = 'none';
            heroSlideshowData.enabled = false;
            saveSlideshowData();
        }
    } else {
        console.error('Required elements not found!');
        alert('Error: Required elements not found. Please refresh the page.');
    }
}

function loadSlideshowData() {
    console.log('Loading slideshow data...');
    const stored = localStorage.getItem('heroSlideshowData');
    if (stored) {
        heroSlideshowData = JSON.parse(stored);
        console.log('Loaded slideshow data:', heroSlideshowData);

        const enableCheckbox = document.getElementById('enableSlideshow');
        const intervalInput = document.getElementById('slideshowInterval');
        const slideshowControls = document.getElementById('slideshowControls');

        console.log('Setting checkbox to:', heroSlideshowData.enabled);
        if (enableCheckbox) {
            enableCheckbox.checked = heroSlideshowData.enabled;
            console.log('Checkbox set to:', enableCheckbox.checked);
        }
        if (intervalInput) intervalInput.value = heroSlideshowData.interval;

        if (heroSlideshowData.enabled && slideshowControls) {
            console.log('Showing slideshow controls');
            slideshowControls.style.display = 'block';
        } else if (slideshowControls) {
            console.log('Hiding slideshow controls');
            slideshowControls.style.display = 'none';
        }

        displaySlideshowSlides();
    } else {
        console.log('No stored data, initializing with default slide');
        // Initialize with default slide
        heroSlideshowData = {
            enabled: false,
            interval: 5,
            slides: [{
                id: Date.now(),
                title: 'Discover Amazing Electronics',
                message: 'Shop the latest technology at unbeatable prices'
            }]
        };

        // Ensure checkbox is unchecked
        const enableCheckbox = document.getElementById('enableSlideshow');
        if (enableCheckbox) {
            enableCheckbox.checked = false;
        }

        displaySlideshowSlides();
    }
}

function displaySlideshowSlides() {
    console.log('displaySlideshowSlides called');
    const slidesList = document.getElementById('slideshowSlidesList');
    console.log('slidesList element:', slidesList);
    console.log('heroSlideshowData:', heroSlideshowData);
    console.log('Slides to display:', heroSlideshowData.slides);

    if (!slidesList) {
        console.error('slideshowSlidesList element not found!');
        return;
    }

    slidesList.innerHTML = '';

    if (!heroSlideshowData || !heroSlideshowData.slides || heroSlideshowData.slides.length === 0) {
        console.log('No slides to display, showing empty message');
        slidesList.innerHTML = '<p style="color: #666; text-align: center; padding: 1rem;">No slides added yet. Click "Add Slide" to create your first slide.</p>';
        return;
    }

    console.log('Displaying', heroSlideshowData.slides.length, 'slides');

    heroSlideshowData.slides.forEach((slide, index) => {
        console.log('Creating slide div for slide', index + 1, ':', slide);
        const slideDiv = document.createElement('div');
        slideDiv.className = 'slideshow-slide';
        slideDiv.style.cssText = 'margin-bottom: 1rem; padding: 1rem; border: 1px solid #dee2e6; border-radius: 8px; background: #f8f9fa;';

        slideDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <h5 style="margin: 0; color: #495057;">Slide ${index + 1}</h5>
                <button class="btn btn-danger btn-sm" onclick="removeSlideshowSlide(${slide.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="form-group" style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #495057;">Title (Hero Title):</label>
                <input type="text" value="${slide.title}" onchange="updateSlideTitle(${slide.id}, this.value)" 
                       style="width: 100%; padding: 0.5rem; border: 1px solid #ced4da; border-radius: 4px; font-size: 0.9rem;">
                <small style="color: #666; font-size: 0.8rem;">This will be the main title shown on the hero image</small>
            </div>
            <div class="form-group">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #495057;">Message (Hero Message):</label>
                <input type="text" value="${slide.message}" onchange="updateSlideMessage(${slide.id}, this.value)" 
                       style="width: 100%; padding: 0.5rem; border: 1px solid #ced4da; border-radius: 4px; font-size: 0.9rem;">
                <small style="color: #666; font-size: 0.8rem;">This will be the subtitle message shown on the hero image</small>
            </div>
        `;

        slidesList.appendChild(slideDiv);
        console.log('Slide div added to slidesList');
    });

    console.log('displaySlideshowSlides completed');
}

function addSlideshowSlide() {
    alert('Add slide function called!'); // Temporary alert to confirm function is called
    console.log('addSlideshowSlide function called!');

    // Ensure slideshow data is initialized
    if (!heroSlideshowData || !heroSlideshowData.slides) {
        console.log('Initializing slideshow data...');
        heroSlideshowData = {
            enabled: false,
            interval: 5,
            slides: []
        };
    }

    const newSlide = {
        id: Date.now(),
        title: 'New Slide Title',
        message: 'New slide message'
    };

    console.log('Adding slide:', newSlide);
    heroSlideshowData.slides.push(newSlide);
    console.log('Total slides:', heroSlideshowData.slides.length);

    // Force display update
    console.log('Calling displaySlideshowSlides...');
    displaySlideshowSlides();
    saveSlideshowData();

    alert('Slide added successfully!'); // Temporary alert to confirm completion
    console.log('Slide added successfully!');
}

function removeSlideshowSlide(slideId) {
    heroSlideshowData.slides = heroSlideshowData.slides.filter(slide => slide.id !== slideId);
    displaySlideshowSlides();
    saveSlideshowData();
}

function updateSlideTitle(slideId, newTitle) {
    const slide = heroSlideshowData.slides.find(s => s.id === slideId);
    if (slide) {
        slide.title = newTitle;
        saveSlideshowData();
    }
}

function updateSlideMessage(slideId, newMessage) {
    const slide = heroSlideshowData.slides.find(s => s.id === slideId);
    if (slide) {
        slide.message = newMessage;
        saveSlideshowData();
    }
}

function saveSlideshowData() {
    const enableCheckbox = document.getElementById('enableSlideshow');
    const intervalInput = document.getElementById('slideshowInterval');

    if (enableCheckbox) {
        heroSlideshowData.enabled = enableCheckbox.checked;
    }
    if (intervalInput) {
        heroSlideshowData.interval = parseInt(intervalInput.value) || 5;
    }

    console.log('Saving slideshow data:', heroSlideshowData);
    localStorage.setItem('heroSlideshowData', JSON.stringify(heroSlideshowData));

    // Dispatch event to update client side
    window.dispatchEvent(new CustomEvent('heroSlideshowUpdated'));
}

// Make functions globally accessible
window.addSlideshowSlide = addSlideshowSlide;
window.removeSlideshowSlide = removeSlideshowSlide;
window.updateSlideTitle = updateSlideTitle;
window.updateSlideMessage = updateSlideMessage;
window.toggleSlideshowMode = toggleSlideshowMode;

// Test if function is accessible
console.log('addSlideshowSlide function available:', typeof window.addSlideshowSlide);

// Test function
function testAddSlideFunction() {
    alert('Test function called!');
    console.log('Test function called');
    console.log('addSlideshowSlide function:', typeof addSlideshowSlide);
    console.log('window.addSlideshowSlide function:', typeof window.addSlideshowSlide);

    if (typeof addSlideshowSlide === 'function') {
        addSlideshowSlide();
    } else {
        alert('addSlideshowSlide function not found!');
    }
}

window.testAddSlideFunction = testAddSlideFunction;

// Force refresh slideshow interface
function refreshSlideshowInterface() {
    console.log('Refreshing slideshow interface...');
    const enableCheckbox = document.getElementById('enableSlideshow');
    const slideshowControls = document.getElementById('slideshowControls');

    if (enableCheckbox && slideshowControls) {
        if (enableCheckbox.checked) {
            console.log('Forcing slideshow controls to show');
            slideshowControls.style.display = 'block';
            displaySlideshowSlides();
        } else {
            console.log('Forcing slideshow controls to hide');
            slideshowControls.style.display = 'none';
        }
    }
}

window.refreshSlideshowInterface = refreshSlideshowInterface;

// Test toggle slideshow function
function testToggleSlideshow() {
    alert('Test toggle function called!');
    console.log('Test toggle function called');

    const enableCheckbox = document.getElementById('enableSlideshow');
    const slideshowControls = document.getElementById('slideshowControls');

    console.log('Checkbox element:', enableCheckbox);
    console.log('Slideshow controls element:', slideshowControls);

    if (enableCheckbox) {
        console.log('Checkbox current state:', enableCheckbox.checked);
        enableCheckbox.checked = !enableCheckbox.checked;
        console.log('Checkbox new state:', enableCheckbox.checked);

        // Manually call toggle function
        toggleSlideshowMode();
    } else {
        alert('Checkbox element not found!');
    }
}

window.testToggleSlideshow = testToggleSlideshow;
