import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Flower2,
  Heart,
  Leaf,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
} from 'lucide-react'
import { categories, formatPrice, products, type Product } from './data'
import './App.css'

const heroImage = `${import.meta.env.BASE_URL}images/seroja-studio-hero.jpg`
const bouquetAtlas = `url("${import.meta.env.BASE_URL}images/bouquet-atlas.jpg")`
const earliestDeliveryDate = new Date(Date.now() + 86400000).toISOString().slice(0, 10)

type CartLine = { productId: string; quantity: number }
type CheckoutDetails = {
  name: string
  email: string
  phone: string
  address: string
  city: string
  postcode: string
  deliveryDate: string
  deliveryWindow: string
  note: string
}

const blankCheckout: CheckoutDetails = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postcode: '',
  deliveryDate: '',
  deliveryWindow: '10:00 am – 1:00 pm',
  note: '',
}

function App() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [cart, setCart] = useState<CartLine[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('seroja-cart') ?? '[]') as CartLine[]
    } catch {
      return []
    }
  })
  const [favorites, setFavorites] = useState<string[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [checkout, setCheckout] = useState(blankCheckout)
  const [paymentMethod, setPaymentMethod] = useState('online-banking')
  const [orderNumber, setOrderNumber] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => {
    localStorage.setItem('seroja-cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  const visibleProducts = useMemo(() => {
    const term = search.trim().toLowerCase()
    return products.filter((product) => {
      const categoryMatches = activeCategory === 'all' || product.category === activeCategory
      const searchMatches = !term || `${product.name} ${product.palette} ${product.description}`.toLowerCase().includes(term)
      return categoryMatches && searchMatches
    })
  }, [activeCategory, search])

  const cartProducts = useMemo(
    () => cart.flatMap((line) => {
      const product = products.find((item) => item.id === line.productId)
      return product ? [{ ...line, product }] : []
    }),
    [cart],
  )
  const itemCount = cart.reduce((sum, line) => sum + line.quantity, 0)
  const subtotal = cartProducts.reduce((sum, line) => sum + line.product.price * line.quantity, 0)
  const deliveryFee = subtotal === 0 || subtotal >= 180 ? 0 : 12
  const total = subtotal + deliveryFee
  const amountToFreeDelivery = Math.max(0, 180 - subtotal)

  const addToCart = (product: Product, quantity = 1) => {
    setCart((current) => {
      const exists = current.find((line) => line.productId === product.id)
      return exists
        ? current.map((line) => line.productId === product.id ? { ...line, quantity: line.quantity + quantity } : line)
        : [...current, { productId: product.id, quantity }]
    })
    setSelectedProduct(null)
    setToast(`${product.name} added to your bag`)
  }

  const changeQuantity = (productId: string, delta: number) => {
    setCart((current) => current
      .map((line) => line.productId === productId ? { ...line, quantity: line.quantity + delta } : line)
      .filter((line) => line.quantity > 0))
  }

  const toggleFavorite = (productId: string) => {
    setFavorites((current) => current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId])
  }

  const startCheckout = () => {
    setCartOpen(false)
    setCheckoutOpen(true)
  }

  const placeDemoOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setCheckout((current) => ({
      ...current,
      name: String(formData.get('recipientName') ?? current.name),
      email: String(formData.get('email') ?? current.email),
      phone: String(formData.get('phone') ?? current.phone),
      address: String(formData.get('address') ?? current.address),
      city: String(formData.get('city') ?? current.city),
      postcode: String(formData.get('postcode') ?? current.postcode),
      deliveryDate: String(formData.get('deliveryDate') ?? current.deliveryDate),
      deliveryWindow: String(formData.get('deliveryWindow') ?? current.deliveryWindow),
    }))
    setOrderNumber(`SS-${Math.floor(100000 + Math.random() * 900000)}`)
    setCart([])
  }

  const closeCheckout = () => {
    setCheckoutOpen(false)
    setOrderNumber('')
  }

  const updateCheckout = (field: keyof CheckoutDetails, value: string) => {
    setCheckout((current) => ({ ...current, [field]: value }))
  }

  return (
    <div className="storefront">
      <div className="announcement">
        <span>Flowers for the everyday & the extraordinary</span>
        <span className="announcement-divider" aria-hidden="true">✳</span>
        <span>Same-day delivery in KL &amp; PJ</span>
      </div>

      <header className="site-header">
        <button className="icon-button menu-toggle" aria-label="Open menu" onClick={() => setMobileMenuOpen(true)}>
          <Menu size={21} strokeWidth={1.6} />
        </button>
        <nav className="header-links header-links-left" aria-label="Main navigation">
          <a href="#shop">Shop flowers</a>
          <a href="#story">Our little story</a>
        </nav>
        <a className="wordmark" href="#top" aria-label="Seroja Studio home">
          <span className="wordmark-icon"><Flower2 size={20} strokeWidth={1.35} /></span>
          <span>Seroja <i>Studio</i></span>
          <small>FLOWERS, THOUGHTFULLY</small>
        </a>
        <nav className="header-links header-links-right" aria-label="Shopping navigation">
          <a href="#delivery">Delivery</a>
          <a href="#footer">Say hello</a>
        </nav>
        <div className="header-actions">
          <button className="icon-button search-toggle" aria-label="Search flowers" onClick={() => setSearchOpen((open) => !open)}>
            <Search size={19} strokeWidth={1.65} />
          </button>
          <button className="bag-button" onClick={() => setCartOpen(true)} aria-label={`Open bag, ${itemCount} items`}>
            <ShoppingBag size={19} strokeWidth={1.6} />
            <span className="bag-label">Bag</span>
            <span className="bag-count">{itemCount}</span>
          </button>
        </div>
      </header>

      {searchOpen && (
        <div className="search-panel">
          <Search size={18} strokeWidth={1.7} />
          <input autoFocus value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search bouquets, colours, little notes..." aria-label="Search bouquets" />
          <button className="text-button" onClick={() => { setSearch(''); setSearchOpen(false) }}>Close</button>
        </div>
      )}

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> A LITTLE FLOWER STUDIO IN KL</div>
            <h1>A little beauty,<br /><em>for every kind of day.</em></h1>
            <p className="hero-description">Hand-gathered flowers, wrapped with care and delivered to make someone's day feel a little more theirs.</p>
            <div className="hero-actions">
              <a className="button button-dark" href="#shop">Find your flowers <ArrowRight size={16} /></a>
              <a className="quiet-link" href="#story">A note from our studio <ArrowDown size={15} /></a>
            </div>
            <div className="hero-caption"><span className="caption-spark">✳</span> Freshly arranged, never just picked.</div>
          </div>
          <div className="hero-visual">
            <img src={heroImage} alt="A hand-tied bouquet of coral roses and white orchids" />
            <div className="hero-stamp"><span>made with</span><b>a little</b><span>more feeling</span></div>
            <div className="hero-note"><Flower2 size={18} strokeWidth={1.3} /><span><b>Made to order</b><small>by our little KL studio</small></span></div>
          </div>
          <div className="hero-index"><span>01</span><i /><span>04</span></div>
        </section>

        <section className="promise-strip" id="delivery">
          <div><Leaf size={17} strokeWidth={1.5} /><span>Thoughtfully gathered, season by season</span></div>
          <i />
          <div><Truck size={18} strokeWidth={1.5} /><span>Careful delivery across Klang Valley</span></div>
          <i />
          <div><Sparkles size={17} strokeWidth={1.5} /><span>A handwritten note with every bunch</span></div>
        </section>

        <section className="shop-section" id="shop">
          <div className="section-heading">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" /> THE FLOWER EDIT</div>
              <h2>Choose a little <em>something.</em></h2>
              <p>Seasonal stems, made to say the things that matter.</p>
            </div>
            <a className="quiet-link desktop-only" href="#delivery">How delivery works <ArrowRight size={15} /></a>
          </div>

          <div className="catalog-tools">
            <div className="category-list" role="tablist" aria-label="Filter bouquets">
              {categories.map((category) => (
                <button
                  className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  role="tab"
                  aria-selected={activeCategory === category.id}
                >
                  {category.label}
                </button>
              ))}
            </div>
            <button className="sort-button" onClick={() => setActiveCategory('all')}>Shop all <ChevronDown size={15} /></button>
          </div>

          {visibleProducts.length > 0 ? (
            <div className="product-grid">
              {visibleProducts.map((product, index) => (
                <article className="product-card" key={product.id} style={{ animationDelay: `${index * 45}ms` }}>
                  <div className="product-image-wrap">
                    <button className="product-image" style={{ backgroundImage: bouquetAtlas, backgroundPosition: product.imagePosition }} onClick={() => setSelectedProduct(product)} aria-label={`View ${product.name}`} />
                    {product.label && <span className="product-tag">{product.label}</span>}
                    <button className={`favorite-button ${favorites.includes(product.id) ? 'is-favorite' : ''}`} onClick={() => toggleFavorite(product.id)} aria-label={favorites.includes(product.id) ? `Remove ${product.name} from favourites` : `Add ${product.name} to favourites`}>
                      <Heart size={17} strokeWidth={1.55} fill={favorites.includes(product.id) ? 'currentColor' : 'none'} />
                    </button>
                    <button className="quick-add" onClick={() => addToCart(product)}><Plus size={15} /> <span>Quick add</span></button>
                  </div>
                  <button className="product-copy" onClick={() => setSelectedProduct(product)}>
                    <span className="product-name">{product.name}</span>
                    <span className="product-palette">{product.palette}</span>
                    <span className="product-price">{formatPrice(product.price)}</span>
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-results"><Flower2 size={26} /><p>No flowers match that search just yet.</p><button className="text-button" onClick={() => { setSearch(''); setActiveCategory('all') }}>Show all flowers</button></div>
          )}
          <div className="catalog-footnote"><span>✳</span> Each arrangement is a little different, just like the day it's made for.</div>
        </section>

        <section className="studio-note" id="story">
          <div className="note-image"><img src={heroImage} alt="Soft morning light over a bouquet in the flower studio" /><span className="note-image-caption">A slow morning at the studio</span></div>
          <div className="note-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> FROM OUR STUDIO, WITH LOVE</div>
            <h2>Flowers don't need<br />a <em>big reason.</em></h2>
            <p>Sometimes it's the birthday. Sometimes it's the thank you. And sometimes it's just Tuesday. We make every bunch by hand, with flowers we love and a little room for happy accidents.</p>
            <a href="#shop" className="button button-outline">Meet your next bouquet <ArrowRight size={16} /></a>
            <div className="signature">With love, <span>Seroja Studio</span></div>
          </div>
        </section>

        <section className="delivery-banner">
          <div className="delivery-icon"><Truck size={21} strokeWidth={1.35} /></div>
          <div><span className="delivery-kicker">A LITTLE SOMETHING, RIGHT ON TIME</span><h2>From our hands to <em>their door.</em></h2><p>Order before 12pm for same-day delivery in selected KL &amp; PJ postcodes.</p></div>
          <a href="#shop" className="button button-light">Choose a bouquet <ArrowRight size={15} /></a>
        </section>
      </main>

      <footer className="site-footer" id="footer">
        <div className="footer-main">
          <div className="footer-brand"><a className="wordmark footer-wordmark" href="#top"><span className="wordmark-icon"><Flower2 size={20} strokeWidth={1.35} /></span><span>Seroja <i>Studio</i></span><small>FLOWERS, THOUGHTFULLY</small></a><p>Little bunches, thoughtfully made in Kuala Lumpur.</p></div>
          <div className="footer-column"><b>WANDER A LITTLE</b><a href="#shop">Shop flowers</a><a href="#shop">Bestsellers</a><a href="#delivery">Delivery information</a></div>
          <div className="footer-column"><b>NEED A HAND?</b><a href="mailto:hello@serojastudio.my">hello@serojastudio.my</a><a href="#delivery">Our delivery areas</a><a href="#story">Our studio story</a></div>
          <div className="footer-newsletter"><b>A NOTE FROM THE STUDIO</b><p>Seasonal stems, small joys, and the occasional flower tip.</p><form onSubmit={(event) => { event.preventDefault(); setToast('You’re on our list — speak soon!') }}><input type="email" placeholder="Your email address" aria-label="Your email address" required /><button aria-label="Subscribe"><ArrowRight size={17} /></button></form><small>By subscribing, you agree to hear from our little studio.</small></div>
        </div>
        <div className="footer-bottom"><span>© 2026 Seroja Studio · Kuala Lumpur</span><span>Made slowly, with care <i>✳</i></span><a href="#top">Back to top ↑</a></div>
      </footer>

      {mobileMenuOpen && <div className="mobile-menu-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setMobileMenuOpen(false) }}><nav className="mobile-menu"><div className="mobile-menu-top"><a className="wordmark" href="#top" onClick={() => setMobileMenuOpen(false)}><span className="wordmark-icon"><Flower2 size={19} /></span><span>Seroja <i>Studio</i></span><small>FLOWERS, THOUGHTFULLY</small></a><button className="icon-button" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu"><X size={20} /></button></div><a href="#shop" onClick={() => setMobileMenuOpen(false)}>Shop flowers <ArrowRight size={16} /></a><a href="#story" onClick={() => setMobileMenuOpen(false)}>Our little story <ArrowRight size={16} /></a><a href="#delivery" onClick={() => setMobileMenuOpen(false)}>Delivery <ArrowRight size={16} /></a><a href="mailto:hello@serojastudio.my">Say hello <ArrowRight size={16} /></a><div className="mobile-menu-note">A little beauty, delivered with care.</div></nav></div>}

      {selectedProduct && <ProductDialog product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={addToCart} />}

      {cartOpen && (
        <div className="drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false) }}>
          <aside className="cart-drawer" aria-label="Shopping bag">
            <div className="drawer-heading"><div><span className="drawer-eyebrow">YOUR LITTLE BUNCH</span><h2>Your bag <span>({itemCount})</span></h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close bag"><X size={20} /></button></div>
            {cartProducts.length === 0 ? (
              <div className="empty-cart"><div className="empty-cart-icon"><ShoppingBag size={25} strokeWidth={1.3} /></div><h3>A little room for flowers.</h3><p>Your bag is waiting for something lovely.</p><button className="button button-dark" onClick={() => { setCartOpen(false); document.querySelector('#shop')?.scrollIntoView({ behavior: 'smooth' }) }}>Explore the flowers <ArrowRight size={15} /></button></div>
            ) : (
              <>
                <div className="shipping-progress">{amountToFreeDelivery > 0 ? <><span>Add <b>{formatPrice(amountToFreeDelivery)}</b> for complimentary delivery</span><div className="progress-track"><i style={{ width: `${Math.min(100, (subtotal / 180) * 100)}%` }} /></div></> : <span className="shipping-unlocked"><Check size={14} /> Your delivery is on us — lovely choice.</span>}</div>
                <div className="cart-lines">{cartProducts.map(({ product, quantity }) => <div className="cart-line" key={product.id}><div className="cart-thumb" style={{ backgroundImage: bouquetAtlas, backgroundPosition: product.imagePosition }} /><div className="cart-line-copy"><b>{product.name}</b><small>{product.palette}</small><strong>{formatPrice(product.price)}</strong><div className="quantity-control"><button onClick={() => changeQuantity(product.id, -1)} aria-label={`Remove one ${product.name}`}><Minus size={12} /></button><span>{quantity}</span><button onClick={() => changeQuantity(product.id, 1)} aria-label={`Add one ${product.name}`}><Plus size={12} /></button></div></div><button className="remove-line" onClick={() => setCart((current) => current.filter((line) => line.productId !== product.id))} aria-label={`Remove ${product.name}`}><X size={15} /></button></div>)}</div>
                <div className="gift-note"><label htmlFor="cart-note">A little note to go with it</label><textarea id="cart-note" placeholder="Write a few words for them..." rows={2} value={checkout.note} onChange={(event) => updateCheckout('note', event.target.value)} /></div>
                <div className="cart-summary"><div><span>Subtotal</span><b>{formatPrice(subtotal)}</b></div><div><span>Delivery</span><b>{deliveryFee === 0 ? 'Complimentary' : formatPrice(deliveryFee)}</b></div><div className="summary-total"><span>Total</span><b>{formatPrice(total)}</b></div><button className="button button-dark checkout-cta" onClick={startCheckout}>Continue to checkout <ArrowRight size={16} /></button><p className="secure-note"><Check size={13} /> Your details stay private. This is a demo checkout.</p></div>
              </>
            )}
          </aside>
        </div>
      )}

      {checkoutOpen && (
        <div className="checkout-backdrop">
          <section className="checkout-sheet" aria-label="Checkout">
            {orderNumber ? (
              <div className="order-success"><button className="icon-button success-close" onClick={closeCheckout} aria-label="Close order confirmation"><X size={20} /></button><div className="success-mark"><Check size={29} strokeWidth={1.4} /></div><div className="eyebrow"><span className="eyebrow-line" /> A LITTLE JOY IS ON ITS WAY</div><h2>Order received,<br /><em>{checkout.name.split(' ')[0] || 'flower friend'}.</em></h2><p>Your demo order <b>{orderNumber}</b> is ready. No payment was processed — this preview simply shows the checkout flow.</p><div className="success-order-card"><span>DELIVERING TO</span><b>{checkout.name}</b><small>{checkout.address}, {checkout.city} {checkout.postcode}</small><small>{checkout.deliveryDate || 'Date to be arranged'} · {checkout.deliveryWindow}</small></div><button className="button button-dark" onClick={closeCheckout}>Back to the flowers <ArrowRight size={15} /></button></div>
            ) : (
              <>
                <div className="checkout-top"><button className="back-link" onClick={() => { setCheckoutOpen(false); setCartOpen(true) }}><ArrowLeft size={16} /> Back to bag</button><button className="icon-button" onClick={closeCheckout} aria-label="Close checkout"><X size={20} /></button></div>
                <div className="checkout-layout">
                  <form className="checkout-form" onSubmit={placeDemoOrder}>
                    <div className="checkout-title"><div className="eyebrow"><span className="eyebrow-line" /> JUST A FEW DETAILS</div><h2>Send something <em>lovely.</em></h2><p>Tell us where your flowers should find you.</p></div>
                    <div className="checkout-section-title"><span>01</span><h3>Your details</h3></div>
                    <div className="form-grid"><label className="field full-field">Recipient's full name<input name="recipientName" required autoComplete="name" value={checkout.name} onChange={(event) => updateCheckout('name', event.target.value)} placeholder="e.g. Aina Rahman" /></label><label className="field">Email address<input name="email" required type="email" autoComplete="email" value={checkout.email} onChange={(event) => updateCheckout('email', event.target.value)} placeholder="you@example.com" /></label><label className="field">Phone number<input name="phone" required type="tel" autoComplete="tel" value={checkout.phone} onChange={(event) => updateCheckout('phone', event.target.value)} placeholder="+60 12 345 6789" /></label></div>
                    <div className="checkout-section-title"><span>02</span><h3>Where to deliver</h3></div>
                    <div className="form-grid"><label className="field full-field">Street address<input name="address" required autoComplete="street-address" value={checkout.address} onChange={(event) => updateCheckout('address', event.target.value)} placeholder="House, street and unit number" /></label><label className="field">City<input name="city" required autoComplete="address-level2" value={checkout.city} onChange={(event) => updateCheckout('city', event.target.value)} placeholder="Kuala Lumpur" /></label><label className="field">Postcode<input name="postcode" required inputMode="numeric" autoComplete="postal-code" pattern="[0-9]{5}" value={checkout.postcode} onChange={(event) => updateCheckout('postcode', event.target.value)} placeholder="50000" /></label><label className="field">Delivery date<input name="deliveryDate" required type="date" min={earliestDeliveryDate} value={checkout.deliveryDate} onChange={(event) => updateCheckout('deliveryDate', event.target.value)} /></label><label className="field">Preferred window<select name="deliveryWindow" value={checkout.deliveryWindow} onChange={(event) => updateCheckout('deliveryWindow', event.target.value)}><option>10:00 am – 1:00 pm</option><option>1:00 pm – 4:00 pm</option><option>4:00 pm – 7:00 pm</option></select></label></div>
                    <div className="checkout-section-title"><span>03</span><h3>How would you like to pay?</h3></div>
                    <div className="payment-options"><label className={paymentMethod === 'online-banking' ? 'payment-option selected' : 'payment-option'}><input type="radio" name="payment" value="online-banking" checked={paymentMethod === 'online-banking'} onChange={(event) => setPaymentMethod(event.target.value)} /><span className="payment-dot" /><span><b>Online banking</b><small>FPX · demo only</small></span><span className="payment-glyph">FPX</span></label><label className={paymentMethod === 'card' ? 'payment-option selected' : 'payment-option'}><input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(event) => setPaymentMethod(event.target.value)} /><span className="payment-dot" /><span><b>Credit or debit card</b><small>Visa · Mastercard · demo only</small></span><span className="payment-glyph card-glyph">••••</span></label></div>
                    <div className="demo-payment-notice"><Sparkles size={16} /><span><b>Preview checkout</b> — no real payment is processed or card details are collected.</span></div>
                    <button className="button button-dark place-order" type="submit">Place demo order · {formatPrice(total)} <ArrowRight size={16} /></button>
                    <p className="checkout-terms">By placing this demo order, you agree to our delivery and flower care notes.</p>
                  </form>
                  <aside className="checkout-summary"><div className="summary-image"><img src={heroImage} alt="Flowers prepared in the Seroja Studio" /><span><Flower2 size={16} /> Arranged just for them</span></div><h3>A little recap</h3>{cartProducts.map(({ product, quantity }) => <div className="summary-line" key={product.id}><span>{product.name} <i>× {quantity}</i></span><b>{formatPrice(product.price * quantity)}</b></div>)}<div className="summary-line"><span>Delivery</span><b>{deliveryFee === 0 ? 'Complimentary' : formatPrice(deliveryFee)}</b></div><div className="summary-line summary-grand"><span>Total</span><b>{formatPrice(total)}</b></div><p className="summary-small">Complimentary delivery on orders over RM 180 in selected KL &amp; PJ areas.</p></aside>
                </div>
              </>
            )}
          </section>
        </div>
      )}

      {toast && <div className="toast-message" role="status"><Check size={16} /> {toast}</div>}
      <button className="mobile-bag-dock" onClick={() => setCartOpen(true)}><ShoppingBag size={17} /> Your bag <span>{itemCount} · {formatPrice(subtotal)}</span><ChevronRight size={16} /></button>
    </div>
  )
}

function ProductDialog({ product, onClose, onAdd }: { product: Product; onClose: () => void; onAdd: (product: Product) => void }) {
  const [wrap, setWrap] = useState('Warm ivory')
  return (
    <div className="product-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="product-modal" aria-label={`${product.name} details`}>
        <button className="icon-button product-modal-close" onClick={onClose} aria-label="Close product details"><X size={20} /></button>
        <div className="modal-product-image" style={{ backgroundImage: bouquetAtlas, backgroundPosition: product.imagePosition }} />
        <div className="modal-product-copy"><div className="eyebrow"><span className="eyebrow-line" /> TIED BY HAND, IN OUR KL STUDIO</div><h2>{product.name}</h2><p className="modal-palette">{product.palette}</p><b className="modal-price">{formatPrice(product.price)}</b><p className="modal-description">{product.description} Each arrangement is made fresh, so your flowers may look a little different from the photograph — that's part of their charm.</p><label className="wrap-select">Choose your wrap<select value={wrap} onChange={(event) => setWrap(event.target.value)}><option>Warm ivory</option><option>Soft blush</option><option>Natural kraft</option></select></label><button className="button button-dark modal-add" onClick={() => onAdd(product)}>Add to your bag · {formatPrice(product.price)} <ArrowRight size={16} /></button><div className="modal-delivery"><Truck size={16} /><span>Same-day delivery in selected areas. Complimentary over RM 180.</span></div></div>
      </section>
    </div>
  )
}

export default App
