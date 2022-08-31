const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCart = document.getElementById('template-cart').content
const fragment = document.createDocumentFragment()
let cart = {}

//Event
document.addEventListener("DOMContentLoaded", () => {
    fetchData()
    if(localStorage.getItem('cart')){
        cart = JSON.parse(localStorage.getItem('cart'))
        showCart()
    }
})
cards.addEventListener('click', e => {   //Un solo addEventListener para todos los cards
    addToCart(e)
})

items.addEventListener('click', e => {
    btnAction(e)
})

//Traer productos
const fetchData = async () => {
    const res = await fetch ('api.json')
    const data = await res.json()
    showCards(data)
}

const showCards = data => {
    data.forEach(product => {
        templateCard.querySelector('h5').textContent = product.title
        templateCard.querySelector('p').textContent = product.price
        templateCard.querySelector('img').setAttribute("src", product.image)
        templateCard.querySelector('.btn-primary').dataset.id = product.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    });
    cards.appendChild(fragment)
}

const addToCart = e => {
    //Operador Ternario
    let buttonTarget = e.target.classList.contains('btn-primary')? setCart(e.target.parentElement) :
    buttonTarget.e.stopPropagation()
}

const setCart = item => {
    const product = {
        title: item.querySelector('h5').textContent,
        price: item.querySelector('p').textContent,
        id: item.querySelector('.btn').dataset.id,
        stock: 1
    }

    if (cart.hasOwnProperty(product.id)){
        product.stock = cart[product.id].stock + 1
    }

    cart[product.id] = { ...product }
    
    showCart()
}


const showCart = () => {

    items.innerHTML = ''

    Object.values(cart).forEach(product => {
        templateCart.querySelector('th').textContent = product.id
        templateCart.querySelectorAll('td')[0].textContent = product.title
        templateCart.querySelectorAll('td')[1].textContent = product.stock
        templateCart.querySelector('.btn-info').dataset.id = product.id   
        templateCart.querySelector('.btn-danger').dataset.id = product.id    
        templateCart.querySelector('span').textContent = product.stock * product.price
        const clone = templateCart.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    showFooterCart()  

    localStorage.setItem('cart', JSON.stringify(cart))
}

const showFooterCart = () =>{
    footer.innerHTML = ''
    if(Object.keys(cart).length === 0){
        footer.innerHTML = `
        <th scope="row" colspan="5">No hay nada en el carrito!</th>
        `
        return
    }

    const nQuantity = Object.values(cart).reduce((acc, {stock}) => acc + stock,0 )
    const nPrice = Object.values(cart).reduce((acc, {stock,price}) => acc + stock * price,0)
    
    templateFooter.querySelectorAll('td')[0].textContent = nQuantity
    templateFooter.querySelector('span').textContent = nPrice

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnClear = document.getElementById('clear-cart')
    btnClear.addEventListener('click',() => {
        cart = {}
        showCart()
        swal({
            icon: "success",
            title: "Carrito vaciado con exito!"
        });
    })
}

const btnAction = e => {
    if(e.target.classList.contains('btn-info')){
        console.log(cart[e.target.dataset.id])

        const product = cart[e.target.dataset.id]
        product.stock = cart[e.target.dataset.id].stock + 1
        cart[e.target.dataset.id] = {...product}
        showCart()
    }

    if(e.target.classList.contains('btn-danger')){
        const product = cart[e.target.dataset.id]
        product.stock--
        if(product.stock === 0){
            delete cart[e.target.dataset.id]
        }else{
            cart[e.target.dataset.id] = {...product}
        }
        showCart()
    }

    e.stopPropagation()
} 