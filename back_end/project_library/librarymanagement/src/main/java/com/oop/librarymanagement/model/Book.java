package com.oop.librarymanagement.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="books")
@AllArgsConstructor
@NoArgsConstructor
@Data

public class Book {
    @Id
    private String id;
    private String title;
    private String author;
    private String category;
    private String coverImage;

}
