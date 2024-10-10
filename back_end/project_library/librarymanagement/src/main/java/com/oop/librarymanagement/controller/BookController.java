package com.oop.librarymanagement.controller;

import com.oop.librarymanagement.model.Book;
import com.oop.librarymanagement.service.LibraryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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

}
