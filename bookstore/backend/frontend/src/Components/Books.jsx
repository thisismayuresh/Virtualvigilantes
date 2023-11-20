import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Books = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Define searchQuery state
  const [isModalOpen, setIsModalOpen] = useState(false); // State for controlling modal open/close
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editBookData, setEditBookData] = useState({
    title: '',
    author: '',
    genre: '',
    year: '',
    price: '',
  });

  const [newBookData, setNewBookData] = useState({
    title: '',
    author: '',
    genre: '',
    year: '',
    price: '',
  });


  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredBooks = books.filter((book) => {
    const { title, author, genre, year, price } = book;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      title.toLowerCase().includes(lowerCaseQuery) ||
      author.toLowerCase().includes(lowerCaseQuery) ||
      genre.toLowerCase().includes(lowerCaseQuery) ||
      year.toString().includes(lowerCaseQuery) ||
      price.toString().includes(lowerCaseQuery)
    );
  });


  const openModal = () => {
    setIsModalOpen(true);
    console.log("modal is open")
  };

  const closeModal = () => {
    setIsModalOpen(false);
    console.log("modal is closed")
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBookData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditBookData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addNewBook = () => {


    if (Object.values(newBookData).some((value) => !value)) {
      console.log('All fields are required');
      toast.error("All Fields are Required !", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    toast.success("Book Added Successfully !", {
      position: toast.POSITION.TOP_RIGHT,
    });


    axios.post('http://localhost:8000/books', newBookData).then((response) => {
      console.log(response)
    }).catch((error) => {
      console.log("Error", error)
    })


    console.log(newBookData)




    closeModal();
    // Additional code to send newBookData to the backend
  };


  const deleteBook = (index) => {

    console.log("index is ", index);
    const bookid = index
    const bookId = books[index]._id;

    axios.delete(`http://localhost:8000/books/${bookId}`).then(response => {
      console.log(response)
      if (response.status == 200) {
        toast.success("Book Deleted Successfully !", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }


    }).catch(error => {
      console.log(error)
    })
  }

  const editBook = (index) => {
    const bookToEdit = books[index];
    setEditBookData(bookToEdit);
    setIsEditModalOpen(true);
  };

  const updateBook = () => {
    const { _id, ...updatedBookData } = editBookData;

    axios
      .put(`http://localhost:8000/books/${_id}`, updatedBookData)
      .then((response) => {
        console.log(response);
        toast.success("Book Updated Successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setIsEditModalOpen(false);
        // Fetch updated books after successful update
        axios.get('http://localhost:8000/books')
          .then((response) => {
            setBooks(response.data);
          })
          .catch((error) => {
            console.error('Error fetching books:', error);
          });
      })
      .catch((error) => {
        console.log("Error", error);
        // Handle error scenarios
      });
  };

  useEffect(() => {
    // Fetch books from the API
    axios.get('http://localhost:8000/books')
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
      });
  }, [books]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bookstore</h1>

      <div className="flex items-center mb-4">
        <form className="flex items-center">
          <label htmlFor="default-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <input
              type="search"
              id="default-search"
              value={searchQuery}
              onChange={handleSearch}
              className="block w-48 p-2 pl-7 text-sm text-gray-900 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search Books, Authors..."
              required
            />
          </div>
        </form>
        {/* Buttons */}
        <button
          type="submit"
          className="ml-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
        >
          Search
        </button>
        <button
          type="button"
          className="ml-2 text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2"
          onClick={openModal}
        >
          Add New Book!
        </button>
      </div>









      {/* Modal for adding new book */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Add New Book</h2>
            <form onSubmit={addNewBook}>
              {/* Your form inputs for new book data */}
              {/* Example: */}
              <input
                type="text"
                name="title"
                value={newBookData.title}
                onChange={handleInputChange}
                placeholder="Title"
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
              />

              <input
                type="text"
                name="author"
                value={newBookData.author}
                onChange={handleInputChange}
                placeholder="Author"
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
              />

              <input
                type="text"
                name="genre"
                value={newBookData.genre}
                onChange={handleInputChange}
                placeholder="Genre"
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
              />

              <input
                type="text"
                name="year"
                value={newBookData.year}
                onChange={handleInputChange}
                placeholder="Year"
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
              />

              <input
                type="text"
                name="price"
                value={newBookData.price}
                onChange={handleInputChange}
                placeholder="Price"
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
              />


              {/* Other input fields for author, genre, year, price */}
              <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                <button
                  className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
                <button
                  className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => addNewBook()}
                >
                  Add
                </button>
              </div>

            </form>
          </div>
        </div>
      )}




      {/* Modal for Editing new book */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Edit Book</h2>
            <form>
              {/* Your form inputs for new book data */}
              {/* Example: */}
              <input
                type="text"
                name="title"
                value={editBookData.title}
                onChange={handleEditInputChange}
                placeholder="Title"
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
              />

              <input
                type="text"
                name="author"
                value={editBookData.author}
                onChange={handleEditInputChange}
                placeholder="Author"
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
              />

              <input
                type="text"
                name="genre"
                value={editBookData.genre}
                onChange={handleEditInputChange}
                placeholder="Genre"
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
              />

              <input
                type="text"
                name="year"
                value={editBookData.year}
                onChange={handleEditInputChange}
                placeholder="Year"
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
              />

              <input
                type="text"
                name="price"
                value={editBookData.price}
                onChange={handleEditInputChange}
                placeholder="Price"
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
              />


              {/* Other input fields for author, genre, year, price */}
              <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                <button
                  className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Close
                </button>
                <button
                  className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={updateBook}
                >
                  Edit
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
















      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>

          </tr>
        </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {filteredBooks.map((book, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap">{book.title}</td>
              <td className="px-6 py-4 whitespace-nowrap">{book.author}</td>
              <td className="px-6 py-4 whitespace-nowrap">{book.genre}</td>
              <td className="px-6 py-4 whitespace-nowrap">{book.year}</td>
              <td className="px-6 py-4 whitespace-nowrap">{book.price}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  type="button"
                  className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mt-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  onClick={() => editBook(index)}
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteBook(index)}

                  type="button"
                  className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mt-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
