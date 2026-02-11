package com.devspark.ingestion;

import java.util.ArrayList;
import java.util.List;

@org.springframework.stereotype.Component
public class InMemoryArticleRepository {
    private final List<ArticleRecord> records = new ArrayList<>();

    public void save(ArticleRecord record) {
        records.add(record);
    }

    public boolean existsByUrl(String url) {
        return records.stream().anyMatch(record -> record.link().equals(url));
    }

    public int count() {
        return records.size();
    }

    public List<ArticleRecord> findAll() {
        return List.copyOf(records);
    }
}
