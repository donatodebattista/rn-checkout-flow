# 🛒 Checkout Flow - Mobile E-Commerce (React Native & Expo)

Aplicación móvil de flujo de compra (*Shopping Cart ➔ Secure Payment ➔ Addresses ➔ Confirmation*) desarrollada en **React Native** con **Expo (SDK 57)**, **Expo Router** y **TypeScript**, diseñada con fidelidad de píxel respecto a especificaciones de diseño en Figma y gestión de estado reactiva con **Zustand**.

---

## 📱 Vistas y Pantallas del Flujo

| 1. Shopping Cart | 2. Secure Payment | 3. Add Address |
| :---: | :---: | :---: |
| <img src="assets/design/Cart.png" width="240" /> | <img src="assets/design/Checkout.png" width="240" /> | <img src="assets/design/Checkout_AddAddress.png" width="240" /> |
| **4. Saved Addresses** | **5. Order Review Backdrop** | **6. Order Confirmation** |
| <img src="assets/design/SavedAdresses.png" width="240" /> | <img src="assets/design/Checkout_Completed_3_Backdrop.png" width="240" /> | <img src="assets/design/Confirmation.png" width="240" /> |

---

## 🚀 Características Principales

### 1. Carrito de Compras (`/`)
- Listado interactivo de productos con imagen, título, precio base y precio tachado para descuentos.
- Modales selectores de variantes para **Color** y **Talle (Size)**.
- Control interactivo de cantidad (`Qty`) con incremento y botón de eliminación con icono de papelera cuando la cantidad es 1.
- Banner dinámico de fechas estimadas de entrega.
- Barra inferior fija con subtotal calculado en tiempo real y botón hacia Checkout.

### 2. Pago Seguro (`/checkout`)
- **Estado Vacío y Estado Completado**:
  - Si no hay dirección configurada, muestra el botón *"Add Address"* con icono de camión.
  - Al completar los datos, renderiza la tarjeta de dirección con opción *"Add / Edit"* y el checkbox *"Billing and delivery addresses are same."*.
  - Si no hay método de pago, muestra el formulario de tarjeta con inputs de titular, número (con formato automático cada 4 dígitos y logotipo de Mastercard), fecha de expiración (Month/Year) y código de seguridad (CVV) con icono informativo.
  - Al guardarse, colapsa en la tarjeta resumen *"My Virtual Debit Card"* mostrando viñetas y últimos 4 dígitos (`● ● ● 8553`).
- **Validación Reactiva**: El botón *"Pay Now"* se mantiene inactivo (`disabled`) en azul cielo suave (`#b2daf3`) si faltan campos obligatorios, y se activa en azul primario (`#3498db`) una vez completada la información.
- **Carrusel Horizontal**: Muestra los productos del carrito con imagen, especificaciones y precios.

### 3. Panel Desplegable "Order Review" (Bottom Sheet Backdrop)
- Al tocar el área de total o chevron en el pie de página de *Secure Payment*, se despliega un panel superpuesto con fondo oscurecido (`rgba(0, 0, 0, 0.4)`).
- Desglose detallado de productos, subtotales, costo de envío ($0,00) y botón para ejecutar el pago directamente desde el panel.
- Puede colapsarse tocando el chevron hacia abajo o el fondo oscurecido.

### 4. Gestión de Direcciones (`/address` y `/addresses`)
- **Formulario Add Address**: Campos estructurados para información del destinatario (con selector de prefijo de país 🇩🇪 `+49`), dirección con icono GPS interactivo, selector opcional de segunda línea de dirección, desplegables modales para *City* y *County*, y tipo de facturación (*Personal* / *Commercial*).
- **Lista de Direcciones Guardadas (Saved Addresses)**: Selección mediante radio buttons entre direcciones simuladas (*My Office* / *Mum's House*) y acceso a edición con icono de lápiz.

### 5. Confirmación de Compra (`/confirmation`)
- Encabezado con badge verde de confirmación y número de orden generado (`#BE12345`).
- Correo de notificación destacado en negrita y marca temporal de la transacción.
- Tarjetas de resumen para *Shipping* y *Billing*.
- Desglose financiero final y botón *"Back to Shopping"* que reinicia el carrito en Zustand y regresa al catálogo.

---

## 🛠️ Tecnologías y Librerías

- **Framework**: [React Native 0.86](https://reactnative.dev/) & [Expo SDK ~57](https://docs.expo.dev/)
- **Enrutamiento**: [Expo Router v6](https://docs.expo.dev/router/introduction/) (enfoque basado en archivos)
- **Lenguaje**: [TypeScript 5.9](https://www.typescriptlang.org/) (Strict Mode)
- **Estado Global**: [Zustand 5](https://zustand-demo.pmnd.rs/)
- **Iconos**: [@expo/vector-icons](https://icons.expo.fyi/) (Ionicons & MaterialCommunityIcons)
- **Safe Area**: [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context)
- **Linter & Formateo**: ESLint con `eslint-config-expo`

---

## 📐 Arquitectura del Proyecto (Modular por Capas)

El proyecto implementa una **arquitectura limpia modular por capas** bajo el directorio `src/`, desacoplando la lógica de negocio, las pantallas, los componentes visuales reutilizables, los tokens de diseño y las definiciones de tipos. La carpeta `app/` de **Expo Router** actúa como una capa de enrutamiento delgada y declarativa:

```text
├── app/                                    # Capa de Enrutamiento (Expo Router)
│   ├── _layout.tsx                         # Stack Navigator principal
│   ├── index.tsx                           # Ruta '/' ➔ Re-exporta ShoppingCartScreen
│   ├── checkout.tsx                        # Ruta '/checkout' ➔ Re-exporta CheckoutScreen
│   ├── address.tsx                         # Ruta '/address' ➔ Re-exporta AddAddressScreen
│   ├── addresses.tsx                       # Ruta '/addresses' ➔ Re-exporta SavedAddressesScreen
│   └── confirmation.tsx                    # Ruta '/confirmation' ➔ Re-exporta ConfirmationScreen
│
├── src/                                    # Capa Modular de Código Fuente
│   ├── types/                              # Definiciones e Interfaces TypeScript
│   │   └── index.ts                        # CartItemType, AddressInfo, SavedAddress, PaymentMethod...
│   │
│   ├── theme/                              # Design Tokens centralizados
│   │   └── index.ts                        # Colores, tipografía, bordes y espaciados (theme)
│   │
│   ├── store/                              # Estado Global con Zustand
│   │   ├── cartStore.ts                    # Hook useCartStore con lógica y acciones del carrito
│   │   └── index.ts                        # Exportación centralizada del store
│   │
│   ├── components/                         # Componentes de Dominio Reutilizables
│   │   └── checkout/                       # Componentes específicos del flujo de checkout
│   │       ├── CartItem.tsx                # Tarjeta de producto con modales de color/talle y control de cantidad
│   │       ├── AddressSummary.tsx          # Tarjeta resumen de dirección seleccionada
│   │       ├── PaymentMethodSummary.tsx    # Tarjeta colapsada de método de pago (Mastercard)
│   │       ├── OrderReviewBackdrop.tsx     # Panel inferior desplegable (Bottom Sheet) con backdrop
│   │       └── index.ts                    # Barrel export de componentes
│   │
│   └── screens/                            # Vistas y Pantallas Completas Desacopladas
│       ├── ShoppingCartScreen.tsx          # Pantalla 1: Carrito de compras y subtotal
│       ├── CheckoutScreen.tsx              # Pantalla 2: Formulario de pago, dirección y carrusel
│       ├── AddAddressScreen.tsx            # Pantalla 3: Formulario estructurado de nueva dirección
│       ├── SavedAddressesScreen.tsx        # Pantalla 4: Selección entre direcciones guardadas
│       ├── ConfirmationScreen.tsx          # Pantalla 5: Resumen final de orden y agradecimiento
│       └── index.ts                        # Barrel export de pantallas
│
├── assets/                                 # Recursos multimedia
│   ├── design/                             # Mockups de referencia de Figma
│   └── images/                             # Imágenes de productos e iconos
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Instalación y Ejecución

### Prerrequisitos
- Node.js (versión 18 o superior recomendada)
- npm o yarn
- Expo Go en tu dispositivo físico o un emulador/simulador (Android Studio / Xcode)

### 1. Clonar el repositorio e instalar dependencias
```bash
git clone <URL_DEL_REPOSITORIO>
cd checkout-tienda
npm install
```

### 2. Iniciar el servidor de desarrollo Expo
```bash
npx expo start
```

### 3. Ejecutar en plataformas específicas
- **Android**: Presiona `a` en la terminal o ejecuta `npm run android`
- **iOS**: Presiona `i` en la terminal o ejecuta `npm run ios`
- **Web**: Presiona `w` en la terminal o ejecuta `npm run web`

---

## 🧪 Calidad y Validación de Código

El proyecto cuenta con verificación estricta de tipos y estándares de código:

```bash
# Verificación de TypeScript sin emitir archivos
npx tsc --noEmit

# Análisis estático de código con ESLint
npm run lint
```
