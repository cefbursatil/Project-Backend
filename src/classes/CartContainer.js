import fs from "fs";
import Cart from "./Cart.js";
import { __dirname, returnMessage } from "../utils.js";

export default class CartContainer {
  constructor(path) {
    this.path = path;
  }

  async save(cart) {
    try {
      const carts = await this.getAll();
      const idcCart = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;
      const newCart = new Cart(idcCart, cart.products);

      carts.push(newCart);
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));

      return returnMessage(false, "Carrito guardado", newCart);
    } catch (error) {
      return returnMessage(true, "Error al guardar el Carrito", null);
    }
  }
  async deleteById(id) {
    try {
      const carts = await this.getAll();
      const eliminatedCart = carts.find((cart) => cart.id === id);
      if (!eliminatedCart) {
        return returnMessage(true, "El carrito no existe", null);
      }
      const cartsFiltered = carts.filter((cart) => cart.id !== id);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(cartsFiltered, null, 2)
      );
      return returnMessage(false, "Carrito eliminado", eliminatedCart);
    } catch (error) {
      return returnMessage(true, "Error al eliminar el Carrito", null);
    }
  }

  async addProductToCartById(id, product) {
    try {
      const carts = await this.getAll();
      const cartIndex = carts.findIndex((cart) => cart.id === id);
      if (cartIndex === -1) {
        return returnMessage(true, "El carrito no existe", null);
      }
      const cart = carts[cartIndex];
      cart.products = [...cart.products, ...product];
      carts[cartIndex] = cart;
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(carts, null, 2)
      );
      return returnMessage(false, "Producto agregado al carrito", cart);
    } catch (error) {
      return returnMessage(
        true,
        "Error al agregar el producto al carrito",
        null
      );
    }
  }

  async deleteProductFromCartById(idCart, idProduct) {
    try {
      const carts = await this.getAll();
      const cartIndex = carts.findIndex((cart) => cart.id === idCart);
      if (cartIndex === -1) {
        return returnMessage(true, "the cart doesn´t exist", null);
      }
      const cart = carts[cartIndex]
      console.log(idCart,idProduct)
      if (!cart.products.find((product) => product.id === idProduct)) {
        return returnMessage(true, "The product doesn´t exist", null);
      }
      cart.products = cart.products.filter((p) => p.id !== idProduct);
      carts[cartIndex] = cart;
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(carts, null, 2)
      );
      return returnMessage(false, "Product erased from cart", cart);
    } catch (error) {
      return returnMessage(
        true,
        "Error eliminating Cart",
        null
      );
    }
  }

  async getById(id) {
    try {
      const carts = await this.getAll();
      const cart = carts.find((cart) => cart.id === id);

      if (cart) {
        return returnMessage(false, "Cart is found", cart);
      } else {
        return returnMessage(true, "Empty Cart", null);
      }
    } catch (error) {
      return returnMessage(true, "Error requesting cart", null);
    }
  }

  async getAll() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const carts = JSON.parse(data);
      return carts;
    } catch (error) {
      return false;
    }
  }
}
