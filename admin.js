const baseURL='https://miyokobookapp.netlify.app/';
//Redirecting if not logged in as an admin
const loginData= JSON.parse(localStorage.getItem('loginData'));
if(!loginData || loginData.email !=='admin@empher.com'){
    alert('Admin Not Logged In');
    window.location.href='index.html';
}

//Adding the books
document.getElementById('addBookForm').addEventListener('submit', async (e)=> {
    e.preventDefault();
    
    const title=document.getElementById('title').value;
    const author=document.getElementById('author').value;
    const category=document.getElementById('category').value;

    const newBook={
        title,
        author,
        category,
        isAvailable:true,
        isVerified:false,
        borrowedDays:null,
        imageUrl:'https://m.media-amazon.com/images/I/71ZB18P3inL._SY522_.jpg',

    };
    await fetch(baseURL,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(newBook),
    });

    alert('Book Added Successfully');
    loadBooks();

});

//Loading the Books
async function loadBooks() {
    const response= await fetch(baseURL);
    const books=await response.json();

    const booksGrid=document.getElementById('booksGrid');
    booksGrid.innerHTML='';

    books.forEach((book) => {
        const bookCard=document.createElement('div');
        bookCard.innerHTML=`
        <h3>${book.title}</h3>
        <p>Author:${book.author}</p>
        <p>Category:${book.category}</p>
        <p>Availability:${book.isAvailable ? 'Available': 'Not Available'}</p>
        <button ${book.isVerified ? 'disabled': ''} onclick="verifyBooks(${book.id})">Verify Book</button>
        <button onclick="deleteBook(${book.id})">Delete Book </button>
        `;
        booksGrid.appendChild(bookCard);
    });
}
//Verify Book
async function verifyBook(id) {
    if (confirm('Are you sure to Verify Book?')){
        await fetch(`${baseURL}/${id}`,{
            method:'PATCH',
            headers: { 'Content-Type': 'application/json'},
            body:JSON.stringify({isVerified:true}),
        });
        alert('Book Verified');
        loadBooks();
    }
    
}
//Delete book
async function deleteBook(id) {
    if (confirm('Are you sure to Delete...?')){
        await fetch(`${baseURL}/${id}`,{
            method:'DELETE'
        });
    }
} 
loadBooks();