'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { Product, CartItem, Review, Order, CompanySettings } from '@/lib/types';
import { PRODUCTS, DEFAULT_COMPANY_SETTINGS, DEFAULT_PAGE_SETTINGS } from '@/lib/data';

// ─── Helper: read/write localStorage safely ───────────────────────────────────
function getLS<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setLS(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn('[BesPoint] localStorage write failed for key:', key);
  }
}

// ─── Context Shape ─────────────────────────────────────────────────────────────
interface AppContextValue {
  // Products
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;

  // Cart
  cart: CartItem[];
  addToCart: (p: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  cartCount: number;
  cartTotal: number;

  // UI State
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAdminOpen: boolean;
  setIsAdminOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthOpen: boolean;
  setIsAuthOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSideMenuOpen: boolean;
  setIsSideMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;

  // Selected product
  selectedProduct: Product | null;
  setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;

  // Filters
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  selectedSubcategory: string;
  setSelectedSubcategory: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  filteredProducts: Product[];

  // Favorites
  favorites: string[];
  toggleFavorite: (id: string) => void;

  // Auth
  currentUser: any;
  setCurrentUser: React.Dispatch<React.SetStateAction<any>>;
  authStep: string;
  setAuthStep: React.Dispatch<React.SetStateAction<any>>;
  logout: () => void;

  // Orders
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;

  // Reviews
  productReviews: Review[];
  setProductReviews: React.Dispatch<React.SetStateAction<Review[]>>;

  // Return requests
  returnRequests: any[];
  setReturnRequests: React.Dispatch<React.SetStateAction<any[]>>;

  // Settings
  companySettings: typeof DEFAULT_COMPANY_SETTINGS;
  setCompanySettings: React.Dispatch<React.SetStateAction<typeof DEFAULT_COMPANY_SETTINGS>>;
  pageSettings: typeof DEFAULT_PAGE_SETTINGS;
  setPageSettings: React.Dispatch<React.SetStateAction<typeof DEFAULT_PAGE_SETTINGS>>;
  paymentSettings: any;
  setPaymentSettings: React.Dispatch<React.SetStateAction<any>>;

  // Toasts
  toasts: { id: string; message: string; type: 'success' | 'error' | 'info' }[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;

  // Cart trigger (for animation)
  cartTrigger: number;

  // Admin
  adminActiveTab: string;
  setAdminActiveTab: React.Dispatch<React.SetStateAction<any>>;

  // isDesktop
  isDesktop: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

// ─── Default payment settings ─────────────────────────────────────────────────
const DEFAULT_PAYMENT_SETTINGS = {
  stripeEnabled: true,
  stripeKey: '',
  paypalEnabled: true,
  paypalEmail: '',
  bankEnabled: true,
  bankOwner: 'BESPOINT S.R.L.',
  bankIban: 'IT00 X 00000 00000 000000000000',
  bankNote: "L'ordine verrà evaso dopo l'accredito.",
  codEnabled: true,
  codNote: 'Pagamento in contanti al corriere alla consegna.',
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AppProvider({ children }: { children: ReactNode }) {
  // — products —
  const [products, setProducts] = useState<Product[]>(() =>
    getLS('bespoint_products', PRODUCTS)
  );
  useEffect(() => setLS('bespoint_products', products), [products]);

  // — cart —
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartTrigger, setCartTrigger] = useState(0);

  const addToCart = useCallback((p: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === p.id);
      if (existing) return prev.map((i) => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...p, quantity: 1 }];
    });
    setCartTrigger((t) => t + 1);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.id !== id));
    } else {
      setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
    }
  }, []);

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.quantity, 0), [cart]);

  // — UI —
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adminActiveTab, setAdminActiveTab] = useState<any>('dashboard');

  // — isDesktop —
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // — filters —
  const [selectedCategory, setSelectedCategory] = useState('Tutti');
  const [selectedSubcategory, setSelectedSubcategory] = useState('Tutti');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    let arr = [...products];
    if (selectedCategory !== 'Tutti') arr = arr.filter((p) => p.category === selectedCategory);
    if (selectedSubcategory && selectedSubcategory !== 'Tutti')
      arr = arr.filter((p) => p.subcategory === selectedSubcategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      arr = arr.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    return arr;
  }, [products, selectedCategory, selectedSubcategory, searchQuery]);

  // — favorites —
  const [favorites, setFavorites] = useState<string[]>(() =>
    getLS('bespoint_favorites', [])
  );
  useEffect(() => setLS('bespoint_favorites', favorites), [favorites]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  // — auth —
  const [currentUser, setCurrentUser] = useState<any>(() =>
    getLS('bespoint_current_user', null)
  );
  const [authStep, setAuthStep] = useState<any>('email');

  useEffect(() => {
    if (currentUser) setLS('bespoint_current_user', currentUser);
    else if (typeof window !== 'undefined') localStorage.removeItem('bespoint_current_user');
  }, [currentUser]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsAuthOpen(false);
  }, []);

  // — orders —
  const [orders, setOrders] = useState<Order[]>(() =>
    getLS('bespoint_orders', [])
  );
  useEffect(() => setLS('bespoint_orders', orders), [orders]);

  // — reviews —
  const [productReviews, setProductReviews] = useState<Review[]>(() =>
    getLS('bespoint_reviews', [
      { id: 'rev-1', productId: '3', orderId: 'BP-2026-879', customerName: 'Alessandro V.', rating: 5, comment: 'Trapano potente e maneggevole. La batteria dura tantissimo, consigliato!', date: '30 Mar 2026', status: 'approved' },
      { id: 'rev-2', productId: '1', orderId: 'BP-2026-881', customerName: 'Marco R.', rating: 4, comment: 'Ottimo faretto, luce calda e intensa. Un po\' difficile da montare ma ne vale la pena.', date: '31 Mar 2026', status: 'approved' },
      { id: 'rev-3', productId: '2', orderId: 'BP-2026-872', customerName: 'Antonio B.', rating: 5, comment: 'Pannello LED di alta qualità. Spedizione rapidissima e imballaggio perfetto.', date: '28 Mar 2026', status: 'approved' },
    ])
  );
  useEffect(() => setLS('bespoint_reviews', productReviews), [productReviews]);

  // — return requests —
  const [returnRequests, setReturnRequests] = useState<any[]>(() =>
    getLS('bespoint_returns', [])
  );
  useEffect(() => setLS('bespoint_returns', returnRequests), [returnRequests]);

  // — settings —
  const [companySettings, setCompanySettings] = useState(() =>
    getLS('companySettings', DEFAULT_COMPANY_SETTINGS)
  );
  useEffect(() => setLS('companySettings', companySettings), [companySettings]);

  const [pageSettings, setPageSettings] = useState(() =>
    getLS('pageSettings', DEFAULT_PAGE_SETTINGS)
  );
  useEffect(() => setLS('pageSettings', pageSettings), [pageSettings]);

  const [paymentSettings, setPaymentSettings] = useState(() =>
    getLS('paymentSettings', DEFAULT_PAYMENT_SETTINGS)
  );
  useEffect(() => setLS('paymentSettings', paymentSettings), [paymentSettings]);

  // — toasts —
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'error' | 'info' }[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value: AppContextValue = {
    products, setProducts,
    cart, addToCart, removeFromCart, updateQuantity, cartCount, cartTotal,
    isCartOpen, setIsCartOpen,
    isCheckoutOpen, setIsCheckoutOpen,
    isAdminOpen, setIsAdminOpen,
    isAuthOpen, setIsAuthOpen,
    isSideMenuOpen, setIsSideMenuOpen,
    selectedProduct, setSelectedProduct,
    selectedCategory, setSelectedCategory,
    selectedSubcategory, setSelectedSubcategory,
    searchQuery, setSearchQuery,
    filteredProducts,
    favorites, toggleFavorite,
    currentUser, setCurrentUser, authStep, setAuthStep, logout,
    orders, setOrders,
    productReviews, setProductReviews,
    returnRequests, setReturnRequests,
    companySettings, setCompanySettings,
    pageSettings, setPageSettings,
    paymentSettings, setPaymentSettings,
    toasts, addToast, dismissToast,
    cartTrigger,
    adminActiveTab, setAdminActiveTab,
    isDesktop,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
