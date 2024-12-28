const baseURL='https://miyokobookapp.netlify.app/';

//Redirectong if not logged in as user

const loginData=JSON.parse(localStorage.getItem('loginData'));
if(!loginData || loginData.email !=='user@empher.com'){
    alert('User Not Logged In');
    window.location.href='index.html';
}

//Loading available books
document.getElementById('showAvailable').addEventListener('click', async()=> {
    const response=await fetch(`${baseURL}?isAvailable=true`);
    const books=await response.json();
    displayBooks(books, true);
});

//Loading borrowed books
document.getElementById('showBorrowed').addEventListener('click', async()=> {
    const response=await fetch(`${baseURL}?isAvailable=false`);
    const books=await response.json();
    displayBooks(books, false);
});

//Display Books
function displayBooks(books, isAvailable){
    const booksGrid=document.getElementById('booksGrid');
    booksGrid.innerHTML='';

    books.forEach((book)=>{
        const bookCard=document.createElement('div');
        bookCard.classList.add('book-card');
        bookCard.innerHTML=`
        <img src="${book.imageUrl}" alt="${book.title}">
        <h3>${book.title}</h3>
        <p>Author: ${book.author}</p>
        <p>Category:${book.category}</p>
        ${isAvailable ? '':`<p>Borrowed Days:${book.borrowedDays}</p>`}
        <button ${isAvailable ? '':'disabled'} onclick="${isAvailable ? `borrowedDays(${book.id})`:''}">
        ${isAvailable ? 'Borrow Book':'Unavailable'}
        </button>
        ${isAvailable ? '' : `<button onclick=returnBook(${book.id}")>T=Return Book</button>`}
        `;
        booksGrid.appendChild(bookCard);

    });
}

//Borrowing a book
async function borrowBook(id) {
    const days=parseInt(prompt('Enter the number of days to borrow (1-10):'), 10);
    
    if (days && days>0 && days<=10){
        await fetch(`${baseURL}/${id}`,{
            method:'PATCH',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({isAvailable:false, borrowedDays:days}),
        });
        alert('Book Borrowed Successfully');
        document.getElementById('showAvailable').click();
    }
    else{
        alert('Invalid input! Enter a number between 1 and 10.');
    }
}

//return a book
async function returnBook(id) {
    if (confirm('Are you sure to return this book?')){
        await fetch(`${baseURL}/${id}`,{
            method:'PATCH',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({isAvailable:true, borrowedDays:null}),
        });
        alert('Book Returned Successfully');
        document.getElementById('showBorrowed').click();
    }
    
}