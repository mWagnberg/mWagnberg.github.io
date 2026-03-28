const CART_KEY = 'portfolio_shop_static_cart';
let lightboxState = null;

function getProducts() {
    return PRODUCTS.slice();
}

function getProductBySlug(slug) {
    return PRODUCTS.find((product) => product.slug === slug) || null;
}

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (error) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCartCount();
}

function cartCount() {
    return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function cartTotal() {
    return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function addToCart(productId) {
    const product = PRODUCTS.find((entry) => entry.id === productId);
    if (!product) {
        return;
    }

    const cart = getCart();
    const existing = cart.find((item) => item.id === productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            quantity: 1,
            palette: product.palette,
            image: product.image || (product.images && product.images[0]) || ''
        });
    }

    saveCart(cart);
}

function updateCartItem(productId, nextQuantity) {
    const cart = getCart()
        .map((item) => {
            if (item.id !== productId) {
                return item;
            }
            return { ...item, quantity: nextQuantity };
        })
        .filter((item) => item.quantity > 0);

    saveCart(cart);
}

function removeCartItem(productId) {
    saveCart(getCart().filter((item) => item.id !== productId));
}

function currency(value) {
    return new Intl.NumberFormat('sv-SE', {
        style: 'currency',
        currency: 'SEK'
    }).format(value);
}

function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
}

function normalizeImagePath(path) {
    if (!path) {
        return '';
    }
    if (path.startsWith('beccasassets/')) {
        return path;
    }
    if (path.startsWith('assets/')) {
        return `beccas${path}`;
    }
    return path;
}

function getProductImages(product) {
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        return product.images.map((path) => normalizeImagePath(path));
    }

    if (product.image) {
        return [normalizeImagePath(product.image)];
    }

    return [];
}

function renderCartCount() {
    const badge = document.getElementById('cart-count');
    if (!badge) {
        return;
    }

    const count = cartCount();
    badge.textContent = count;
    badge.classList.toggle('is-hidden', count === 0);
}

function artMarkup(product) {
    const productImages = getProductImages(product);

    if (productImages.length > 0) {
        const carouselId = `carousel-${product.id}`;
        const images = productImages.map((img, idx) => `
            <img class="carousel-image carousel-image-${idx}" 
                 src="${img}" 
                 alt="${escapeHtml(product.name)} bild ${idx + 1}"
                 data-open-lightbox="${product.id}"
                 data-lightbox-slide="${idx}"
                 style="display: ${idx === 0 ? 'block' : 'none'};">
        `).join('');

        const navButtons = productImages.length > 1 ? `
            <div class="carousel-nav">
                <button class="carousel-btn carousel-prev" data-carousel="${carouselId}" aria-label="Föregående bild">←</button>
                <div class="carousel-dots">
                    ${productImages.map((_, idx) => `
                        <span class="carousel-dot ${idx === 0 ? 'active' : ''}" 
                              data-carousel="${carouselId}" 
                              data-slide="${idx}"
                              aria-label="Bild ${idx + 1}"></span>
                    `).join('')}
                </div>
                <button class="carousel-btn carousel-next" data-carousel="${carouselId}" aria-label="Nästa bild">→</button>
            </div>
        ` : '';

        return `
            <div class="product-art product-art-carousel" id="${carouselId}" data-total-images="${productImages.length}">
                <div class="carousel-container">
                    ${images}
                </div>
                ${navButtons}
            </div>
        `;
    }

    // Fallback för gamla image property
    if (product.image) {
        return `
        <div class="product-art product-art-image-frame">
            <img class="product-image" src="${normalizeImagePath(product.image)}" alt="${escapeHtml(product.name)}" data-open-lightbox="${product.id}" data-lightbox-slide="0">
        </div>
    `;
    }

    return `
        <div class="product-art" style="--tone-a: ${product.palette[0]}; --tone-b: ${product.palette[1]};">
            <span>${escapeHtml(product.name)}</span>
        </div>
    `;
}

function renderProductGrid() {
    const grid = document.getElementById('product-grid');
    if (!grid) {
        return;
    }

    grid.innerHTML = getProducts().map((product) => `
        <article class="product-card reveal-item">
            <div class="product-card-link">
                ${artMarkup(product)}
                <div class="product-card-copy">
                    <p class="product-kicker">${escapeHtml(product.stock)} i lager</p>
                    <h3>${escapeHtml(product.name)}</h3>
                    <p>${escapeHtml(product.blurb)}</p>
                    <p class="product-description">${escapeHtml(product.description)}</p>
                    <div class="product-card-meta">
                        <strong>${currency(product.price)}</strong>
                        <button class="button button-inline" type="button" data-add-to-cart="${product.id}">Lägg i varukorg</button>
                    </div>
                </div>
            </div>
        </article>
    `).join('');
}

function renderCartView() {
    const container = document.getElementById('cart-view');
    if (!container) {
        return;
    }

    const cart = getCart();

    if (cart.length === 0) {
        container.innerHTML = `
            <section class="empty-state">
                <h2>Varukorgen är tom</h2>
                <p>Lägg till några produkter först och kom sedan tillbaka för att förbereda beställningen via e-post.</p>
                <a class="button button-primary" href="#products">Se produkterna</a>
            </section>
        `;
        return;
    }

    container.innerHTML = `
        <div class="cart-layout">
            <div class="cart-list">
                ${cart.map((item) => `
                    <article class="cart-item">
                        ${item.image ? `<img class="cart-item-image" src="${normalizeImagePath(item.image)}" alt="${escapeHtml(item.name)}">` : `<div class="cart-item-art" style="--tone-a: ${item.palette[0]}; --tone-b: ${item.palette[1]};"></div>`}
                        <div class="cart-item-copy">
                            <h2>${escapeHtml(item.name)}</h2>
                            <p>${currency(item.price)} per styck</p>
                            <div class="quantity-row">
                                <button type="button" data-decrease-item="${item.id}">-</button>
                                <span>${item.quantity}</span>
                                <button type="button" data-increase-item="${item.id}">+</button>
                            </div>
                        </div>
                        <div class="cart-item-side">
                            <strong>${currency(item.price * item.quantity)}</strong>
                            <button class="text-button" type="button" data-remove-item="${item.id}">Ta bort</button>
                        </div>
                    </article>
                `).join('')}
            </div>
            <aside class="summary-card">
                <p class="eyebrow">Översikt</p>
                <h2>${currency(cartTotal())}</h2>
                <p>${cartCount()} ${cartCount() === 1 ? 'produkt' : 'produkter'} sparade i webbläsaren.</p>
                <a class="button button-primary" href="#order">Fortsätt till beställning</a>
                <a class="button button-secondary" href="#products">Fortsätt handla</a>
            </aside>
        </div>
    `;
}

function getCurrentCarouselSlide(carouselId) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return 0;
    const images = carousel.querySelectorAll('.carousel-image');
    for (let i = 0; i < images.length; i++) {
        if (images[i].style.display !== 'none') {
            return i;
        }
    }
    return 0;
}

function goToCarouselSlide(carouselId, slideIndex) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const images = carousel.querySelectorAll('.carousel-image');
    const dots = carousel.querySelectorAll('.carousel-dot');

    // Hide all images
    images.forEach((img) => {
        img.style.display = 'none';
    });

    // Remove active class from all dots
    dots.forEach((dot) => {
        dot.classList.remove('active');
    });

    // Show the target slide (with wrapping)
    const targetSlide = ((slideIndex % images.length) + images.length) % images.length;
    if (images[targetSlide]) {
        images[targetSlide].style.display = 'block';
    }
    if (dots[targetSlide]) {
        dots[targetSlide].classList.add('active');
    }
}

function moveCarousel(carouselId, direction) {
    const currentSlide = getCurrentCarouselSlide(carouselId);
    const carousel = document.getElementById(carouselId);
    const totalImages = Number(carousel.dataset.totalImages) || 1;
    const nextSlide = (currentSlide + direction + totalImages) % totalImages;
    goToCarouselSlide(carouselId, nextSlide);
}

function ensureLightbox() {
    let lightbox = document.getElementById('image-lightbox');
    if (lightbox) {
        return lightbox;
    }

    lightbox = document.createElement('div');
    lightbox.id = 'image-lightbox';
    lightbox.className = 'image-lightbox is-hidden';
    lightbox.innerHTML = `
        <div class="image-lightbox-backdrop" data-close-lightbox="true"></div>
        <div class="image-lightbox-dialog" data-lightbox-surface="true" role="dialog" aria-modal="true" aria-label="Förstorad produktbild">
            <button class="image-lightbox-close" type="button" data-close-lightbox="true" aria-label="Stäng bildvisning">×</button>
            <button class="image-lightbox-nav image-lightbox-prev" type="button" data-lightbox-nav="prev" aria-label="Föregående bild">←</button>
            <figure class="image-lightbox-figure">
                <img class="image-lightbox-image" src="" alt="">
                <figcaption class="image-lightbox-caption"></figcaption>
            </figure>
            <button class="image-lightbox-nav image-lightbox-next" type="button" data-lightbox-nav="next" aria-label="Nästa bild">→</button>
        </div>
    `;

    document.body.appendChild(lightbox);
    return lightbox;
}

function renderLightbox() {
    const lightbox = ensureLightbox();
    const image = lightbox.querySelector('.image-lightbox-image');
    const caption = lightbox.querySelector('.image-lightbox-caption');
    const prevButton = lightbox.querySelector('.image-lightbox-prev');
    const nextButton = lightbox.querySelector('.image-lightbox-next');

    if (!lightboxState || !lightboxState.images.length) {
        lightbox.classList.add('is-hidden');
        document.body.classList.remove('lightbox-open');
        return;
    }

    const totalImages = lightboxState.images.length;
    const currentIndex = ((lightboxState.currentIndex % totalImages) + totalImages) % totalImages;
    const currentImage = lightboxState.images[currentIndex];

    image.src = currentImage;
    image.alt = `${lightboxState.name} bild ${currentIndex + 1}`;
    caption.textContent = totalImages > 1
        ? `${lightboxState.name} · bild ${currentIndex + 1} av ${totalImages}`
        : lightboxState.name;

    prevButton.classList.toggle('is-hidden', totalImages < 2);
    nextButton.classList.toggle('is-hidden', totalImages < 2);

    lightbox.classList.remove('is-hidden');
    document.body.classList.add('lightbox-open');
}

function openLightbox(productId, slideIndex) {
    const product = PRODUCTS.find((entry) => entry.id === productId);
    if (!product) {
        return;
    }

    const images = getProductImages(product);
    if (!images.length) {
        return;
    }

    lightboxState = {
        productId,
        name: product.name,
        images,
        currentIndex: slideIndex || 0
    };

    renderLightbox();
}

function closeLightbox() {
    lightboxState = null;
    renderLightbox();
}

function stepLightbox(direction) {
    if (!lightboxState || !lightboxState.images.length) {
        return;
    }

    lightboxState.currentIndex += direction;
    renderLightbox();
}

function buildOrderLines() {
    return getCart().map((item) => `- ${item.name} x ${item.quantity} (${currency(item.price * item.quantity)})`);
}

function buildMailtoHref() {
    const lines = buildOrderLines();
    const body = [
        'Hej,',
        '',
        'Jag vill gärna beställa följande produkter:',
        ...lines,
        '',
        `Beräknat totalpris: ${currency(cartTotal())}`,
        '',
        'Namn:',
        'Leveransadress:',
        'Övriga kommentarer:'
    ].join('\n');

    return `mailto:${encodeURIComponent(CONTACT_EMAIL)}?subject=${encodeURIComponent('Beställning från Beccas gosedjur')}&body=${encodeURIComponent(body)}`;
}

function renderCheckoutSummary() {
    const summary = document.getElementById('checkout-summary');
    const mailtoButton = document.getElementById('mailto-button');
    const emailLink = document.getElementById('contact-email-link');

    if (!summary || !mailtoButton || !emailLink) {
        return;
    }

    emailLink.textContent = CONTACT_EMAIL;
    emailLink.href = `mailto:${CONTACT_EMAIL}`;

    const cart = getCart();

    if (cart.length === 0) {
        summary.innerHTML = `
            <div class="empty-inline">
                <p>Varukorgen är tom.</p>
                <a class="button button-secondary" href="#products">Se produkterna</a>
            </div>
        `;
        mailtoButton.href = `mailto:${CONTACT_EMAIL}`;
        return;
    }

    summary.innerHTML = `
        <ul class="summary-list">
            ${cart.map((item) => `
                <li>
                    <span>${escapeHtml(item.name)} x ${item.quantity}</span>
                    <strong>${currency(item.price * item.quantity)}</strong>
                </li>
            `).join('')}
        </ul>
        <div class="summary-total">
            <span>Beräknat totalpris</span>
            <strong>${currency(cartTotal())}</strong>
        </div>
    `;

    mailtoButton.href = buildMailtoHref();
}

function handleClicks(event) {
    const lightboxTrigger = event.target.closest('[data-open-lightbox]');
    if (lightboxTrigger) {
        openLightbox(Number(lightboxTrigger.dataset.openLightbox), Number(lightboxTrigger.dataset.lightboxSlide || '0'));
        return;
    }

    const lightboxSurface = event.target.closest('[data-lightbox-surface]');
    if (lightboxSurface && !event.target.closest('.image-lightbox-figure, .image-lightbox-nav, .image-lightbox-close')) {
        closeLightbox();
        return;
    }

    const lightboxClose = event.target.closest('[data-close-lightbox]');
    if (lightboxClose) {
        closeLightbox();
        return;
    }

    const lightboxNav = event.target.closest('[data-lightbox-nav]');
    if (lightboxNav) {
        stepLightbox(lightboxNav.dataset.lightboxNav === 'next' ? 1 : -1);
        return;
    }

    // Handle carousel navigation
    const carouselPrevBtn = event.target.closest('.carousel-prev');
    if (carouselPrevBtn) {
        const carouselId = carouselPrevBtn.dataset.carousel;
        moveCarousel(carouselId, -1);
        return;
    }

    const carouselNextBtn = event.target.closest('.carousel-next');
    if (carouselNextBtn) {
        const carouselId = carouselNextBtn.dataset.carousel;
        moveCarousel(carouselId, 1);
        return;
    }

    const carouselDot = event.target.closest('.carousel-dot');
    if (carouselDot) {
        const carouselId = carouselDot.dataset.carousel;
        const slide = Number(carouselDot.dataset.slide);
        goToCarouselSlide(carouselId, slide);
        return;
    }

    const addButton = event.target.closest('[data-add-to-cart]');
    if (addButton) {
        addToCart(Number(addButton.dataset.addToCart));
        addButton.textContent = 'Tillagd';
        window.setTimeout(() => {
            addButton.textContent = 'Lägg i varukorg';
        }, 900);
        renderCartView();
        renderCheckoutSummary();
        return;
    }

    const increaseButton = event.target.closest('[data-increase-item]');
    if (increaseButton) {
        const productId = Number(increaseButton.dataset.increaseItem);
        const current = getCart().find((item) => item.id === productId);
        if (current) {
            updateCartItem(productId, current.quantity + 1);
            renderCartView();
            renderCheckoutSummary();
        }
        return;
    }

    const decreaseButton = event.target.closest('[data-decrease-item]');
    if (decreaseButton) {
        const productId = Number(decreaseButton.dataset.decreaseItem);
        const current = getCart().find((item) => item.id === productId);
        if (current) {
            updateCartItem(productId, current.quantity - 1);
            renderCartView();
            renderCheckoutSummary();
        }
        return;
    }

    const removeButton = event.target.closest('[data-remove-item]');
    if (removeButton) {
        removeCartItem(Number(removeButton.dataset.removeItem));
        renderCartView();
        renderCheckoutSummary();
    }
}

function handleKeydown(event) {
    if (!lightboxState) {
        return;
    }

    if (event.key === 'Escape') {
        closeLightbox();
        return;
    }

    if (event.key === 'ArrowLeft') {
        stepLightbox(-1);
        return;
    }

    if (event.key === 'ArrowRight') {
        stepLightbox(1);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    ensureLightbox();
    renderCartCount();
    renderProductGrid();
    renderCartView();
    renderCheckoutSummary();
    document.addEventListener('click', handleClicks);
    document.addEventListener('keydown', handleKeydown);
});