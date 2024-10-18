package com.oop.librarymanagement.service;


import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.oop.librarymanagement.model.Book;
import com.oop.librarymanagement.repository.BookRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.List;

@Service
public class LibraryService {
    @Autowired
    private BookRepo bookRepo;

    private List<Book> booksFromJson;

//    public LibraryService(){
//        //doc file json
//        ObjectMapper mapper = new ObjectMapper();
//        TypeReference<List<Book>> typeReference = new TypeReference<>() {};
//        InputStream inputStream = TypeReference.class.getResourceAsStream("/books.json");
//
//        try {
//            booksFromJson = mapper.readValue(inputStream,typeReference);
//        } catch (Exception e){
//            e.printStackTrace();
//        }
//    }

    public List<Book> getAllBooks() {
        // Lấy sách từ database
        List<Book> booksFromDb = bookRepo.findAll();

        // Kết hợp sách từ file JSON và database
//        booksFromDb.addAll(booksFromJson);
        return booksFromDb;
    }

    // them sach vao database
    public Book addBook(Book book){
        return bookRepo.save(book);
    }




}
