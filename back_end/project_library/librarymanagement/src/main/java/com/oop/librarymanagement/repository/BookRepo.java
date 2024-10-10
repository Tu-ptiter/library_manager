package com.oop.librarymanagement.repository;

import com.oop.librarymanagement.model.Book;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BookRepo extends MongoRepository <Book, String> {
    List<Book> findByCategory(String category);
    List<Book> findByTitleContaining(String title);
}
