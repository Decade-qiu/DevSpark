package com.devspark.ingestion;

import java.time.Instant;

public record ArticleRecord(
    String title,
    String link,
    String source,
    Instant publishedDate,
    String summary,
    String content,
    String imageUrl
) {}
