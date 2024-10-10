package com.oop.librarymanagement.repository;

import com.oop.librarymanagement.model.Book;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepo extends MongoRepository <Book, String> {
    List<Book> findByBigCategory(String bigCategory);

}
