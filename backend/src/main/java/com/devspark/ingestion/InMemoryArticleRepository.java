package com.devspark.ingestion;

import java.util.ArrayList;
import java.util.List;

class InMemoryArticleRepository {
    private final List<ArticleRecord> records = new ArrayList<>();

    void save(ArticleRecord record) {
        records.add(record);
    }

    boolean existsByUrl(String url) {
        return records.stream().anyMatch(record -> record.url().equals(url));
    }

    int count() {
        return records.size();
    }

    List<ArticleRecord> findAll() {
        return List.copyOf(records);
    }
}
