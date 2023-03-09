import {Component, OnInit} from '@angular/core';
import {Cart, CartItem} from "../../models/cart.model";
import {CartService} from "../../services/cart.service";
import {HttpClient} from "@angular/common/http";
import {loadStripe} from "@stripe/stripe-js";

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {

    cart: Cart = {
        items: [
            {
                product: 'https://via.placeholder.com/150',
                name: 'sneakers',
                price: 150,
                quantity: 1,
                id: 1
            },
            {
                product: 'https://via.placeholder.com/150',
                name: 'sneakers',
                price: 150,
                quantity: 3,
                id: 2
            }
        ]
    };

    dataSource: Array<CartItem> = [];
    displayedColumns: Array<string> = [
        'product',
        'name',
        'price',
        'quantity',
        'total',
        'action'
    ]

    constructor(private cartService: CartService, private http: HttpClient) {
    }

    ngOnInit(): void {
        this.cartService.cart.subscribe((_cart: Cart) => {
            this.cart = _cart;
            this.dataSource = this.cart.items;
        });
    }

    getTotal(items: Array<CartItem>): number {
        return this.cartService.getTotal(items);
    }

    onClearCart(): void {
        this.cartService.clearCart();
    }

    onRemoveFromCart(item: CartItem): void {
        this.cartService.removeFromCart(item);

    }

    onAddQuantity(item: CartItem): void {
        this.cartService.addToCart(item);

    }

    onReduceQuantity(item: CartItem): void {
        this.cartService.removeQuantity(item);
    }

    onCheckout(): void {
        this.http.post('http://localhost:4242/checkout', {
            items: this.cart.items
        }).subscribe(async(res: any) => {
            let stripe = await loadStripe('pk_test_51Mjm7eFwvtcd6dxjYWKZwrxJI43MFWwSwuVxnVD7c2yFkcoSE2tVBuR9d27rQFXOvKseDGxm77A3dtfv3dzDe8Q100TwB1Z1eO')
            stripe?.redirectToCheckout({
                sessionId: res.id
            })
        } )
    }
}
