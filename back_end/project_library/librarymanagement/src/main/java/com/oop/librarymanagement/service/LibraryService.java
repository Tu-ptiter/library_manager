package com.oop.librarymanagement.service;

import com.oop.librarymanagement.model.Book;
import com.oop.librarymanagement.repository.BookRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LibraryService {
    @Autowired
    private BookRepo bookRepo;

    public List<Book> getAllBooks(){
        return bookRepo.findAll();
    }

    public Book addBook(Book book){
        return bookRepo.save(book);
    }

}
