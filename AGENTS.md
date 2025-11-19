# AGENTS.md - Cardápio Açaí Digital

## Project Overview

**Cardápio Açaí Digital** is a web-based menu application designed for açaí and ice cream shops. It provides customers with an interactive digital ordering system where they can customize their orders and send them directly via WhatsApp.

## Recent Development History

### Initial Commit (July 11, 2025)
**Commit:** `59cb3a4` by Jeconias Rocha

#### Project Structure Created
- Main application files in root directory
- Duplicate setup in `Cardapio AcaiDicasa/` folder
- Total: 2,645 lines of code added

#### Core Features Implemented

**1. Product Selection System**
- Toggle between Açaí and Ice Cream (Sorvete)
- Dynamic UI that adapts based on product type
- Real-time form updates when switching products

**2. Açaí Size Options**
- 300ml (3 accompaniments) - R$ 10.00
- 400ml (4 accompaniments) - R$ 12.00
- 500ml (5 accompaniments) - R$ 15.00
- 600ml (6 accompaniments) - R$ 18.00
- Barca P (8 accompaniments) - R$ 28.00
- Barca M (9 accompaniments) - R$ 35.00

**3. Ice Cream Size Options**
- Tigela P - R$ 5.00
- Tigela M - R$ 8.00
- Tigela G - R$ 10.00
- Casquinha - R$ 6.00

**4. Accompaniments System (Açaí Only)**
Organized into four categories:
- **Frutas:** Morango, Banana, Maçã, Uva, Abacaxi, Kiwi (+R$3), Manga (+R$3)
- **Cereais e Granolas:** Granola, Sucrilhos, Cereais coloridos, Farinha Lacta, Ovomaltine
- **Castanhas e Amendoins:** Paçoca, Amendoim (triturado/inteiro), Farinha de amendoim, Castanha
- **Chocolates e Doces:** Leite em pó, Coco ralado, Raspa de chocolate, Granulado, Jujuba, Chocoball, Biscoito

**5. Premium Extras**
All extras priced at +R$ 2.00:
- Gotas de chocolate
- M&M
- Nutela
- Oreo
- Bis
- Creme de ninho

**6. Sauce Selection (Caldas)**
Free options include:
- Morango, Abacaxi, Uva
- Leite condensado
- Menta, Chocolate, Limão
- Frutas vermelhas
- Caramelo

**7. Shopping Cart System**
- Add multiple items before finalizing
- Edit/remove items from cart
- See running total for all items
- Separate "Add to Cart" and "Finalize Order" buttons

**8. Payment Methods**
- Dinheiro (Cash)
- Cartão de Crédito (Credit Card) - adds R$ 1.00 fee
- PIX

**9. Delivery Information**
Form fields for:
- Street address and number
- Complement (apartment, block, etc.)
- Neighborhood
- Phone number
- Additional observations

**10. Order Summary & Pricing**
- Real-time calculation of order total
- Displays all selections in organized format
- Shows accompaniment count vs. limit
- Includes payment method fees

**11. WhatsApp Integration**
- Formats complete order details
- Sends to business WhatsApp number (5511919926172)
- Includes timestamp and structured information
- Supports single orders or full cart checkout

#### Technical Implementation

**JavaScript Features:**
- Vanilla JavaScript (no frameworks)
- Event-driven architecture
- Dynamic DOM manipulation
- State management for order and cart
- Input validation
- Real-time updates

**Styling:**
- CSS custom properties (CSS variables)
- Responsive design
- Purple gradient theme (`#9b59b6`, `#8e44ad`, `#7d3c98`)
- Card-based UI components
- FontAwesome icons integration
- Poppins font from Google Fonts

**Key Functions:**
- `init()` - Initializes all event listeners
- `atualizarLimites()` - Updates accompaniment limits
- `atualizarResumo()` - Refreshes order summary
- `adicionarAoCarrinho()` - Adds item to cart
- `atualizarCarrinho()` - Updates cart display
- `resetarFormulario()` - Clears form after adding to cart
- `finalizarPedido()` - Finalizes single order
- `finalizarTodosPedidos()` - Finalizes all cart items
- `enviarPedidoWhatsApp()` - Formats and sends WhatsApp message

#### Business Logic

**Pricing Rules:**
1. Base price determined by size selection
2. Premium fruit accompaniments add R$ 3.00 each (Kiwi, Manga)
3. Extra items add R$ 2.00 each
4. Credit card payment adds R$ 1.00 fee
5. Sauces are free regardless of quantity

**Validation:**
- Prevents exceeding accompaniment limits per size
- Requires size selection before adding to cart
- Validates required address fields before checkout
- Ensures cart has items before finalizing all orders

## Project Status

**Current State:** Initial release - fully functional
**Environment:** Client-side only (no backend required)
**Target Users:** Açaí and ice cream shop customers
**Primary Language:** Portuguese (Brazil)

## Next Steps & Potential Improvements

Based on the current implementation, potential enhancements could include:

1. **Order History:** Local storage for past orders
2. **Favorites:** Save frequently ordered combinations
3. **Location Services:** Auto-fill address using geolocation
4. **Image Gallery:** Add photos for sizes and accompaniments
5. **Delivery Fee Calculation:** Distance-based pricing
6. **Multi-language Support:** English/Spanish options
7. **Dark Mode:** Theme toggle
8. **Order Tracking:** Status updates via WhatsApp API
9. **Admin Panel:** Manage menu items and prices
10. **Analytics:** Track popular combinations and ordering patterns

## File Structure

```
/
├── index.html          # Main application page
├── script.js           # JavaScript logic (441 lines)
├── style.css           # Styling (465 lines)
├── README.md           # Project documentation
└── Cardapio AcaiDicasa/
    ├── index.html      # Duplicate setup
    ├── script.js       # Duplicate setup
    └── style.css       # Duplicate setup
```

## Technical Notes

- **No build process required** - runs directly in browser
- **Mobile-first responsive design**
- **WhatsApp Business API** - uses wa.me link format
- **No external dependencies** except CDN resources (FontAwesome, Google Fonts)
- **State persists only during session** - cart clears on page reload

---

*Last Updated: 2025-11-19*  
*Based on commit: 59cb3a4*
