package com.oop.librarymanagement.controller;

import com.oop.librarymanagement.model.Book;
import com.oop.librarymanagement.service.LibraryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/")
public class BookController {
    @Autowired
    private LibraryService libraryService;

    @GetMapping("/books")
    public List<Book> getAllBooks(){
        return libraryService.getAllBooks();
    }

    @PostMapping("/addBook")
    public ResponseEntity<Book> addBook(@RequestBody Book book){
        Book saveBook = libraryService.addBook(book);
        return new ResponseEntity<>(saveBook, HttpStatus.CREATED);
    }






}
