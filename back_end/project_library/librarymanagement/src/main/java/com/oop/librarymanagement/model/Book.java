package com.oop.librarymanagement.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="books")
@AllArgsConstructor
@NoArgsConstructor
@Data

public class Book {
    @Id
    private ObjectId id;

    private String name;
    @JsonProperty("big_category") // ánh xạ JSON
    private String bigCategory;
    @JsonProperty("small_category")
    private String smallCategory;
    private String picture;
    private String author;


}
